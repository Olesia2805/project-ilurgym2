import{i as b}from"./vendor-I1I71QQ2.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function s(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(n){if(n.ep)return;n.ep=!0;const o=s(n);fetch(n.href,o)}})();document.addEventListener("DOMContentLoaded",function(){const t=document.querySelectorAll(".nav-link");let e=window.location.pathname.split("/").pop();e!=="index.html"&&e!=="favorites.html"&&(e="index.html"),t.forEach(s=>{s.getAttribute("href")===e&&s.classList.add("active")})});const u=document.querySelector(".js-header"),g=document.querySelector("main"),y="is-scrolling",E=t=>{t?u.classList.add(y):u.classList.remove(y)},S=t=>{t?g.style.marginTop=`${u.offsetHeight}px`:g.style.marginTop=0},p=()=>{let t=window.scrollY>u.offsetTop;E(t),S(t)};document.addEventListener("DOMContentLoaded",()=>{p(),document.addEventListener("scroll",p)});async function w(){try{return await(await fetch("https://your-energy.b.goit.study/api/quote")).json()}catch(t){return console.error("Error fetching the quote:",t),null}}function x(t){const e=new Date().toISOString().split("T")[0];localStorage.setItem("dailyQuote",JSON.stringify({quote:t,date:e}))}function $(){const t=localStorage.getItem("dailyQuote");return t?JSON.parse(t):null}async function q(){const t=$(),e=new Date().toISOString().split("T")[0];if(t&&t.date===e)return t.quote;{const s=await w();return s?(x(s),s):t?t.quote:null}}async function O(){const t=await q();if(t){const e=t.quote,s=t.author;document.querySelector(".quote").textContent=e,document.querySelector(".quote-author").textContent=s}}O();const h=(t,e,s,r)=>{b.show({message:t,drag:!0,close:!1,timeout:5e3,position:"bottomRight",messageColor:"#2a2a2a",closeOnClick:!0,animateInside:!0,backgroundColor:e??"#fca664",title:s??""})},c="https://your-energy.b.goit.study/api",a=async(t,e,s)=>{const o=await fetch(t,{headers:{"Content-type":"application/json"},method:e,body:s});if(!o.ok)throw new Error(`Error: status: ${o.status}, ${o.statusText}`);return o.json()},C={async getExercises(t){const e=new URLSearchParams(t),s=`${c}/exercises?${e}`;return await a(s)},async getExercisesId(t){const e=`${c}/exercises/${t}`;return await a(e)},async editExercisesIdRating(t,e){const s="PATCH",r=`${c}/exercises/${t}/rating`,n=JSON.stringify(e);return await a(r,s,n)},async getExercisesFilter(t){const e=new URLSearchParams(t),s=`${c}/filters?${e}`;return await a(s)},async getExercisesQuote(){const t=`${c}/quote`;return await a(t)},async addSubscription(t){const e="POST",s=`${c}/subscription`,r=JSON.stringify(t);return await a(s,e,r)}},m=document.querySelector(".subscribe-form");m.addEventListener("submit",A);async function A(t){t.preventDefault();const e=t.target.elements.email.value;try{await C.addSubscription({email:e}),h("You have subscribed 🥳","#f4f4f4","Congratulations!")}catch{h("Subscription already exists 😊","#c6cdd1")}finally{t.target.reset(),localStorage.removeItem("subscribe-form-email")}}const f={email:""},T=t=>{const e=JSON.parse(localStorage.getItem("subscribe-form-email"));if(e!==null)for(const s in e)e.hasOwnProperty(s)&&(t.elements[s].value=e[s],f[s]=e[s])};T(m);m.addEventListener("input",t=>{const e=t.target.name,s=t.target.value.trim();f[e]=s,localStorage.setItem("subscribe-form-email",JSON.stringify(f))});(()=>{let t=document.querySelector(".js-menu-container"),e=document.querySelector(".js-open-menu"),s=document.querySelector(".js-close-menu"),r=[...document.getElementsByClassName("mobile-menu-link")],n=()=>{let i=e.getAttribute("aria-expanded")==="true";e.setAttribute("aria-expanded",!i),t.classList.toggle("is-open"),document.body.style.overflow=i?"auto":"hidden"};const o=()=>{window.matchMedia("(max-width: 767px)").matches?(e.addEventListener("click",n),s.addEventListener("click",n),r.forEach(i=>{i.addEventListener("click",n)})):(e.removeEventListener("click",n),s.removeEventListener("click",n),r.forEach(i=>{i.removeEventListener("click",n)}),t.classList.remove("is-open"),e.setAttribute("aria-expanded",!1))};window.addEventListener("resize",o),o()})();document.addEventListener("DOMContentLoaded",function(){const t=document.querySelectorAll(".filter-btn"),e=document.getElementById("search-form"),s=document.getElementById("search-input");v("Muscles"),t.forEach(r=>{r.addEventListener("click",()=>{t.forEach(o=>o.classList.remove("active")),r.classList.add("active");const n=r.getAttribute("data-filter");n==="Body parts"||n==="Equipment"?e.style.display="flex":e.style.display="none",v(n)})}),e.addEventListener("submit",function(r){r.preventDefault();const n=s.value.trim(),o=document.querySelector(".filter-btn.active");if(!o){console.error("No active filter button found.");return}const i=o.getAttribute("data-filter");M(i,n)})});function v(t){fetch(`https://your-energy.b.goit.study/api/filters?filter=${t}&page=1&limit=12`).then(e=>e.json()).then(e=>{console.log("Received data:",e),e.results&&Array.isArray(e.results)?d(e.results):d([])}).catch(e=>{console.error("Error fetching categories:",e),d([])})}function d(t){const e=document.querySelector(".category-container");if(e.innerHTML="",t.length===0){e.innerHTML="<p>No categories found.</p>";return}t.forEach(s=>{const r=document.createElement("div");r.classList.add("category-card"),r.innerHTML=`
            <img src="${s.imgURL}" alt="${s.name}" />
            <h3>${s.name}</h3>
            <p>${s.filter}</p>
        `,r.addEventListener("click",()=>{e.style.display="none",I(s.name)}),e.appendChild(r)})}function I(t){fetch(`https://your-energy.b.goit.study/api/exercises?muscles=${t}`).then(e=>e.json()).then(e=>{console.log("data.exercises",e),e.results&&Array.isArray(e.results)?l(e.results):l([])}).catch(e=>{console.error("Error fetching exercises:",e),l([])})}function M(t,e){const s=`https://your-energy.b.goit.study/api/exercises?filter=${t}&keyword=${e}&page=1&limit=12`;fetch(s).then(r=>r.json()).then(r=>{console.log("Received exercises data:",r),r.results&&Array.isArray(r.results)?l(r.results):l([])}).catch(r=>{console.error("Error fetching exercises by keyword:",r),l([])})}function l(t){const e=document.querySelector(".exercise-container");if(e.innerHTML="",t.length===0){e.innerHTML="<p>No exercises found.</p>";return}const s=t.map(({bodyPart:r,burnedCalories:n,target:o,name:i,rating:L})=>`
      <div class="exercise-card">
        <div class="exercise-card-header">
          <div class="label">WORKOUT</div>
          <div class="rating-wrapper">
            <div class="rating">
              ${L}
              <svg class="icon-star">
                <use href="./img/icons/icons.svg#icon-star"></use>
              </svg>
            </div>
            <div class="start-btn-wrapper">
              <div class="start-btn">
                Start
                <svg class="icon-arrow">
                  <use href="./img/icons/icons.svg#icon-arrow-start"></use>
                </svg>
              </div>
            </div>
          </div>
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
          <div class="details-calories">
            Burned calories: <span class="details-calories-info">${n}</span>
          </div>
          <div class="details-body-part">
            Body part: <span class="details-body-part-info">${r}</span>
          </div>
          <div class="details-target">
            Target:<span class="details-target-info">${o}</span>
          </div>
        </div>
      </div>
    `).join(" ");e.insertAdjacentHTML("afterbegin",s)}
//# sourceMappingURL=main-DR76_ZlE.js.map
