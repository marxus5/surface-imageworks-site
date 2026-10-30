(function(){
var CONTACT_EMAIL="contact@surfaceimageworks.com";
var T={
qo:{n:"Quarter-cut white oak",d:"Straight, even grain with a tight linear figure.",c:"wood",f:".5 .005",o:3,s:3,m:[.74,.6,.42],k:2,w:[.9,.7]},
ro:{n:"Rift-cut white oak",d:"Fine, consistent lines with minimal flare.",c:"wood",f:".9 .004",o:3,s:8,m:[.72,.62,.48],k:1.7,w:[.9,.75]},
so:{n:"Rift-cut smoked oak",d:"Deep, even tone with a restrained line.",c:"wood",f:".8 .004",o:3,s:5,m:[.4,.34,.29],k:1.6,w:[.9,.8],h:1},
wa:{n:"Walnut",d:"Broad, variable grain with a rich tonal range.",c:"wood",f:".16 .006",o:4,s:11,m:[.34,.24,.17],k:1.9,w:[.8,.6]},
ma:{n:"Maple",d:"Pale, quiet grain for light, clean surfaces.",c:"wood",f:".3 .005",o:3,s:2,m:[.87,.77,.6],k:1.15,w:[.9,.75]},
st:{n:"Limestone",d:"Soft mineral variation across a matte field.",c:"stone",f:".008 .012",o:5,s:14,m:[.78,.76,.71],k:1.4,w:[1,.95]},
tx:{n:"Woven textile",d:"Fine horizontal thread structure.",c:"fabric",f:".7 .08",o:2,s:6,m:[.6,.6,.58],k:1.1,w:[1,1]}};
function bg(t,w,h){var a=t.k,b=t.k*t.w[0],c=t.k*t.w[1],m=t.m;
var v=a+" 0 0 0 "+(m[0]-.5*a)+" "+b+" 0 0 0 "+(m[1]-.5*b)+" "+c+" 0 0 0 "+(m[2]-.5*c)+" 0 0 0 0 1";
var s="<svg xmlns='http://www.w3.org/2000/svg' width='"+w+"' height='"+h+"'><filter id='f' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='"+t.f+"' numOctaves='"+t.o+"' seed='"+t.s+"'/><feColorMatrix type='matrix' values='"+v+"'/></filter><rect width='100%' height='100%' filter='url(#f)'/></svg>";
return 'url("data:image/svg+xml,'+encodeURIComponent(s)+'")'}
function el(tag,cls,attrs){var e=document.createElement(tag);if(cls)e.className=cls;for(var k in attrs||{})e.setAttribute(k,attrs[k]);return e}
// hero planks
var P=document.getElementById("planks");
["qo","ro","so","wa","ma"].forEach(function(id,i){var t=T[id],b=el("button","plank",{type:"button","aria-label":t.n});
b.style.backgroundImage=bg(t,420,1000);var s=el("span");s.textContent=t.n;b.appendChild(s);
b.addEventListener("click",function(){[].forEach.call(P.children,function(x){x.classList.remove("on")});b.classList.add("on")});
if(i===0)b.classList.add("on");P.appendChild(b)});
document.querySelectorAll("[data-t]").forEach(function(e){e.style.backgroundImage=bg(T[e.dataset.t],800,500)});
// gallery
var G=document.getElementById("grid"),lb=document.getElementById("lb");
Object.keys(T).filter(function(k){return!T[k].h}).forEach(function(id){var t=T[id],b=el("button","tile",{type:"button","data-c":t.c});
var i=el("div","img");i.style.backgroundImage=bg(t,600,750);var n=el("b");n.textContent=t.n;var d=el("small");d.textContent=t.d;
b.append(i,n,d);b.addEventListener("click",function(){document.getElementById("big").style.backgroundImage=bg(t,1400,1000);document.getElementById("cap").textContent=t.n;lb.showModal()});G.appendChild(b)});
document.getElementById("close").onclick=function(){lb.close()};
lb.addEventListener("click",function(e){if(e.target===lb)lb.close()});
document.querySelectorAll(".filters button").forEach(function(btn){btn.addEventListener("click",function(){
document.querySelectorAll(".filters button").forEach(function(x){x.setAttribute("aria-pressed",x===btn)});
G.querySelectorAll(".tile").forEach(function(t){t.hidden=btn.dataset.f!=="all"&&t.dataset.c!==btn.dataset.f})})});
document.querySelectorAll("section h2,section .lede,.filters,.pt,.svc,.tile,.steps li,#f").forEach(function(e){e.classList.add("rise");var i=[].indexOf.call(e.parentNode.children,e);e.style.setProperty("--d",(i%3)*90+"ms")});
[].forEach.call(P.children,function(p,i){p.style.setProperty("--i",i)});
// header border + reveals
var H=document.querySelector("header");function sc(){H.classList.toggle("scrolled",scrollY>8)}sc();addEventListener("scroll",sc,{passive:true});
if("IntersectionObserver"in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.15});document.querySelectorAll(".rise").forEach(function(r){io.observe(r)})}else document.querySelectorAll(".rise").forEach(function(r){r.classList.add("in")});
document.getElementById("yr").textContent=new Date().getFullYear();
// form
var F=document.getElementById("f"),S=document.getElementById("status");
F.addEventListener("submit",function(e){e.preventDefault();
if(!F.checkValidity()){var bad=F.querySelector(":invalid");S.textContent="Please complete the "+(bad.closest("label").firstChild.textContent||"required").toLowerCase()+" field.";bad.focus();return}
var d=new FormData(F),body=["Name: "+d.get("name"),"Company: "+d.get("company"),"Email: "+d.get("email"),"Role: "+d.get("role"),"Material: "+d.get("material"),"","Details:",d.get("details")].join("\n");
S.textContent="Opening your email app with the request.";
location.href="mailto:"+CONTACT_EMAIL+"?subject="+encodeURIComponent("Quote request from "+d.get("company"))+"&body="+encodeURIComponent(body)});
})();
