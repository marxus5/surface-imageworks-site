const nodemailer = require("nodemailer");

const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const IMAGE_TYPES = {
  "image/jpeg": { extension: ".jpg", matches: (data) => data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff },
  "image/png": { extension: ".png", matches: (data) => data.length >= 8 && data.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  "image/gif": { extension: ".gif", matches: (data) => data.length >= 6 && ["GIF87a", "GIF89a"].includes(data.subarray(0, 6).toString("ascii")) },
  "image/webp": { extension: ".webp", matches: (data) => data.length >= 12 && data.subarray(0, 4).toString("ascii") === "RIFF" && data.subarray(8, 12).toString("ascii") === "WEBP" }
};

function text(value, limit) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function sendError(res, status, error) {
  return res.status(status).json({ error });
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendError(res, 405, "This endpoint only accepts form submissions.");
  }

  const origin = req.headers.origin;
  let originHost;
  try {
    originHost = new URL(origin).host;
  } catch (error) {
    return sendError(res, 403, "Please submit your request from the contact form.");
  }
  if (originHost !== req.headers.host) {
    return sendError(res, 403, "Please submit your request from the contact form.");
  }

  const body = req.body;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return sendError(res, 400, "The form submission could not be read.");
  }
  if (text(body.website, 200)) {
    return res.status(200).json({ ok: true });
  }

  const name = text(body.name, 120);
  const company = text(body.company, 160);
  const email = text(body.email, 254);
  if (!name || !company || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return sendError(res, 400, "Please provide your name, company, and a valid email address.");
  }

  const gmailUser = process.env.GMAIL_USER;
  const appPassword = process.env.GMAIL_APP_PASSWORD;
  const contactTo = process.env.CONTACT_TO || gmailUser;
  const bccEmails = (process.env.BCC_EMAILS || "").split(",").map((address) => address.trim()).filter(Boolean);
  if (!gmailUser || !appPassword || !contactTo) {
    console.error("Contact form email environment variables are not configured.");
    return sendError(res, 503, "The contact form is temporarily unavailable. Please email surfaceimageworks@gmail.com.");
  }
  if (bccEmails.some((address) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address))) {
    console.error("The BCC_EMAILS environment variable contains an invalid email address.");
    return sendError(res, 503, "The contact form is temporarily unavailable. Please email surfaceimageworks@gmail.com.");
  }

  const fields = [
    ["Name", name],
    ["Company", company],
    ["Email", email],
    ["Project name", text(body.projectName, 200)],
    ["Material of interest", text(body.material, 100)],
    ["Final image size", text(body.imageSize, 200)],
    ["Image resolution at final", text(body.finalResolution, 100)],
    ["File type", text(body.fileType, 50)],
    ["Resolution", text(body.resolution, 50)],
    ["Additional details about project", text(body.details, 5000)]
  ];
  const attachments = [];
  if (body.attachment != null) {
    const file = body.attachment;
    if (!file || typeof file !== "object" || typeof file.data !== "string" || typeof file.type !== "string") {
      return sendError(res, 400, "The sample image could not be read. Please choose it again.");
    }

    const imageType = IMAGE_TYPES[file.type];
    if (!imageType || file.data.length > Math.ceil(MAX_IMAGE_BYTES / 3) * 4 + 4 || file.data.length % 4 !== 0 || /[^A-Za-z0-9+/=]/.test(file.data)) {
      return sendError(res, 400, "Please attach a JPG, PNG, GIF, or WebP image no larger than 3 MB.");
    }
    const content = Buffer.from(file.data, "base64");
    if (!content.length || content.length > MAX_IMAGE_BYTES || content.toString("base64") !== file.data || !imageType.matches(content)) {
      return sendError(res, 400, "The selected file does not appear to be a valid image.");
    }
    const nameBase = text(file.name, 160).split(/[\\/]/).pop().replace(/[^a-zA-Z0-9._-]/g, "_").replace(/\.+$/, "").replace(/\.[^.]+$/, "");
    attachments.push({
      filename: (nameBase || "sample-image").slice(0, 120) + imageType.extension,
      content,
      contentType: file.type
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: gmailUser, pass: appPassword.replace(/\s/g, "") },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 20000
    });
    await transporter.sendMail({
      from: { name: "Surface Imageworks Website", address: gmailUser },
      to: contactTo,
      bcc: bccEmails,
      replyTo: email,
      subject: "New quote request from Surface Imageworks",
      text: fields.map(([label, value]) => `${label}: ${value || "Not provided"}`).join("\n"),
      attachments
    });
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Contact form email delivery failed:", error.message);
    return sendError(res, 502, "We couldn't send your request right now. Please try again or email surfaceimageworks@gmail.com.");
  }
};
