import{i as w,a as x}from"./vendor-CZmbFGfX.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function s(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(r){if(r.ep)return;r.ep=!0;const o=s(r);fetch(r.href,o)}})();document.addEventListener("DOMContentLoaded",function(){const e=document.querySelectorAll(".nav-link");let t=window.location.pathname.split("/").pop();t!=="index.html"&&t!=="favorites.html"&&(t="index.html"),e.forEach(s=>{s.getAttribute("href")===t&&s.classList.add("active")})});const m=document.querySelector(".js-header"),g=document.querySelector("main"),h="is-scrolling",T=e=>{e?m.classList.add(h):m.classList.remove(h)},q=e=>{e?g.style.marginTop=`${m.offsetHeight}px`:g.style.marginTop=0},v=()=>{let e=window.scrollY>m.offsetTop;T(e),q(e)};document.addEventListener("DOMContentLoaded",()=>{v(),document.addEventListener("scroll",v)});async function C(){try{return await(await fetch("https://your-energy.b.goit.study/api/quote")).json()}catch(e){return console.error("Error fetching the quote:",e),null}}function O(e){const t=new Date().toISOString().split("T")[0];localStorage.setItem("dailyQuote",JSON.stringify({quote:e,date:t}))}function $(){const e=localStorage.getItem("dailyQuote");return e?JSON.parse(e):null}async function I(){const e=$(),t=new Date().toISOString().split("T")[0];if(e&&e.date===t)return e.quote;{const s=await C();return s?(O(s),s):e?e.quote:null}}async function M(){const e=await I();if(e){const t=e.quote,s=e.author;document.querySelector(".quote").textContent=t,document.querySelector(".quote-author").textContent=s}}M();const E=(e,t,s,n)=>{w.show({message:e,drag:!0,close:!1,timeout:5e3,position:"bottomRight",messageColor:"#2a2a2a",closeOnClick:!0,animateInside:!0,backgroundColor:t??"#fca664",title:s??""})},c="https://your-energy.b.goit.study/api",a=async(e,t,s)=>{const o=await fetch(e,{headers:{"Content-type":"application/json"},method:t,body:s});if(!o.ok)throw new Error(`Error: status: ${o.status}, ${o.statusText}`);return o.json()},A={async getExercises(e){const t=new URLSearchParams(e),s=`${c}/exercises?${t}`;return await a(s)},async getExercisesId(e){const t=`${c}/exercises/${e}`;return await a(t)},async editExercisesIdRating(e,t){const s="PATCH",n=`${c}/exercises/${e}/rating`,r=JSON.stringify(t);return await a(n,s,r)},async getExercisesFilter(e){const t=new URLSearchParams(e),s=`${c}/filters?${t}`;return await a(s)},async getExercisesQuote(){const e=`${c}/quote`;return await a(e)},async addSubscription(e){const t="POST",s=`${c}/subscription`,n=JSON.stringify(e);return await a(s,t,n)}},b=x.create({baseURL:c,headers:{"Content-type":"application/json"}}),y=document.querySelector(".subscribe-form");y.addEventListener("submit",B);async function B(e){e.preventDefault();const t=e.target.elements.email.value;try{await A.addSubscription({email:t}),E("You have subscribed 🥳","#f4f4f4","Congratulations!")}catch{E("Subscription already exists 😊","#c6cdd1")}finally{e.target.reset(),localStorage.removeItem("subscribe-form-email")}}const f={email:""},N=e=>{const t=JSON.parse(localStorage.getItem("subscribe-form-email"));if(t!==null)for(const s in t)t.hasOwnProperty(s)&&(e.elements[s].value=t[s],f[s]=t[s])};N(y);y.addEventListener("input",e=>{const t=e.target.name,s=e.target.value.trim();f[t]=s,localStorage.setItem("subscribe-form-email",JSON.stringify(f))});(()=>{let e=document.querySelector(".js-menu-container"),t=document.querySelector(".js-open-menu"),s=document.querySelector(".js-close-menu"),n=[...document.getElementsByClassName("mobile-menu-link")],r=()=>{let i=t.getAttribute("aria-expanded")==="true";t.setAttribute("aria-expanded",!i),e.classList.toggle("is-open"),document.body.style.overflow=i?"auto":"hidden"};const o=()=>{window.matchMedia("(max-width: 767px)").matches?(t.addEventListener("click",r),s.addEventListener("click",r),n.forEach(i=>{i.addEventListener("click",r)})):(t.removeEventListener("click",r),s.removeEventListener("click",r),n.forEach(i=>{i.removeEventListener("click",r)}),e.classList.remove("is-open"),t.setAttribute("aria-expanded",!1))};window.addEventListener("resize",o),o()})();const d={MUSCLES:"Muscles",BODY_PARTS:"Body parts",EQUIPMENT:"Equipment"};document.addEventListener("DOMContentLoaded",async()=>{const e=document.querySelectorAll(".filter-btn"),t=document.getElementById("search-form"),s=document.getElementById("search-input"),n=await L(d.MUSCLES);S(n),e.forEach(r=>{r.addEventListener("click",async()=>{e.forEach(l=>l.classList.remove("active")),r.classList.add("active");const o=r.getAttribute("data-filter");o==="Body parts"||o==="Equipment"?t.style.display="flex":t.style.display="none";const i=await L(o);S(i)})}),t.addEventListener("submit",function(r){r.preventDefault();const o=s.value.trim(),i=document.querySelector(".filter-btn.active");if(!i){console.error("No active filter button found.");return}const l=i.getAttribute("data-filter");k(l,o)})});const L=async(e,t=1,s=12)=>{try{const r=(await b.get("/filters",{params:{filter:e,page:t,limit:s}})).data;return r.results?r.results:[]}catch(n){return console.error("Error fetching categories:",n),[]}},D=async(e,t)=>{try{const n=(await b.get("/exercises",{params:{...e===d.MUSCLES&&{muscles:t},...e===d.BODY_PARTS&&{bodypart:t},...e===d.EQUIPMENT&&{equipment:t}}})).data;return n.results?n.results:[]}catch(s){return console.error("Error fetching categories:",s),[]}},S=e=>{const t=document.querySelector(".exercises-grid");if(t.innerHTML="",e.length===0){t.innerHTML="<p>No categories found.</p>";return}e.forEach(s=>{const n=document.createElement("div");n.classList.add("category-card"),n.innerHTML=`
          <img src="${s.imgURL}" alt="${s.name}" />
          <h3>${s.name}</h3>
          <p>${s.filter}</p>
      `,n.addEventListener("click",async()=>{const r=await D(s.filter,s.name);u(r)}),t.appendChild(n)})};function k(e,t){const s=`https://your-energy.b.goit.study/api/exercises?filter=${e}&keyword=${t}&page=1&limit=12`;fetch(s).then(n=>n.json()).then(n=>{console.log("Received exercises data:",n),n.results&&Array.isArray(n.results)?u(n.results):u([])}).catch(n=>{console.error("Error fetching exercises by keyword:",n),u([])})}function u(e){const t=document.querySelector(".exercises-grid");if(t.innerHTML="",e.length===0){t.innerHTML="<p>No exercises found.</p>";return}const s=e.map(({bodyPart:n,burnedCalories:r,target:o,name:i,rating:l})=>`
    <div class="exercise-card">
      <div class="exercise-card-header">
        <div class="label">WORKOUT</div>
        <div class="rating">
          <span>
            ${l}
          </span>
          <svg class="icon-star">
            <use href="./img/icons/icons.svg#icon-star"></use>
          </svg>
        </div>
        <button class="start-btn">
          Start
          <svg class="icon-arrow">
            <use href="./img/icons/icons.svg#icon-arrow-start"></use>
          </svg>
        </button>
      </div>
      <div class="title-wrapper">
        <div class="icon-run-exercises">
          <svg class="icon-run">
            <use href="./img/icons/icons.svg#icon-run"></use>
          </svg>
        </div>
        <div class="title">${i}</div>
      </div>
      <div class="details">
        <div class="details-item">
          Burned calories: <span>${r}</span>
        </div>
        <div class="details-item">
          Body part: <span>${n}</span>
        </div>
        <div class="details-item">
          Target:<span>${o}</span>
        </div>
      </div>
    </div>
  `).join(" ");t.insertAdjacentHTML("afterbegin",s)}const P=()=>{document.querySelector(".preloader").classList.add("preloader--hidden")};document.addEventListener("DOMContentLoaded",()=>{setTimeout(()=>{P()},1e3)});let p=document.getElementById("myBtn");document.getElementsByClassName(".footer");p.onclick=function(){F()};window.onscroll=function(){Q()};function Q(){document.body.scrollTop>20||document.documentElement.scrollTop>20?p.style.display="block":p.style.display="none"}function F(){document.body.scrollTop=0,document.documentElement.scrollTop=0}
//# sourceMappingURL=main-DtZuxQn3.js.map
