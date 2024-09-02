import{i as V,a as W}from"./vendor-BRPE7r0H.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();document.addEventListener("DOMContentLoaded",function(){const e=document.querySelectorAll(".nav-link");let t=window.location.pathname.split("/").pop();t!=="index.html"&&t!=="favorites.html"&&(t="index.html"),e.forEach(n=>{n.getAttribute("href")===t&&n.classList.add("active")})});const h=document.querySelector(".js-header"),k=document.querySelector("main"),A="is-scrolling",X=e=>{e?h.classList.add(A):h.classList.remove(A)},z=e=>{e?k.style.marginTop=`${h.offsetHeight}px`:k.style.marginTop=0},O=()=>{let e=window.scrollY>h.offsetTop;X(e),z(e)};document.addEventListener("DOMContentLoaded",()=>{O(),document.addEventListener("scroll",O)});const i=(e,t,n,a)=>{V.show({message:e,drag:!0,close:!1,timeout:5e3,position:"bottomRight",messageColor:"#2a2a2a",closeOnClick:!0,animateInside:!0,backgroundColor:n??"#f4f4f4",title:t??""})};async function K(){try{return await(await fetch("https://your-energy.b.goit.study/api/quote")).json()}catch{return i("Error fetching the quote:","Error ❌"),null}}function Z(e){const t=new Date().toISOString().split("T")[0];localStorage.setItem("dailyQuote",JSON.stringify({quote:e,date:t}))}function ee(){const e=localStorage.getItem("dailyQuote");return e?JSON.parse(e):null}async function te(){const e=ee(),t=new Date().toISOString().split("T")[0];if(e&&e.date===t)return e.quote;{const n=await K();return n?(Z(n),n):e?e.quote:null}}async function ne(){const e=await te();if(e){const t=e.quote,n=e.author;document.querySelector(".quote").textContent=t,document.querySelector(".quote-author").textContent=n}}ne();const b=()=>JSON.parse(localStorage.getItem("favorites"))||[];function ae(e){if(!e._id){i("Exercise ID is missing.","Error ❌");return}const t=b();t.find(n=>n._id===e._id)?i("This exercise is already in your favorites.","Error ❌"):(t.push(e),localStorage.setItem("favorites",JSON.stringify(t)),i("Exercise added to favorites!","Success ✅"))}function F(e,t){if(!e){i("Exercise ID is missing.","Error ❌");return}const n=b();if(!n.find(a=>a._id===e))i("This exercise is not in your favorites.","Error ❌");else{const a=n.filter(r=>r._id!==e);localStorage.setItem("favorites",JSON.stringify(a)),i("Exercise removed from favorites!","Success ✅"),t&&t()}}const d="https://your-energy.b.goit.study/api",u=async(e,t,n)=>{const s=await fetch(e,{headers:{"Content-type":"application/json"},method:t,body:n});if(!s.ok)throw new Error(`Error: status: ${s.status}, ${s.statusText}`);return s.json()},x={async getExercises(e){const t=new URLSearchParams(e),n=`${d}/exercises?${t}`;return await u(n)},async getExercisesId(e){const t=`${d}/exercises/${e}`;return await u(t)},async editExercisesIdRating(e,t){const n="PATCH",a=`${d}/exercises/${e}/rating`,r=JSON.stringify(t);return await u(a,n,r)},async getExercisesFilter(e){const t=new URLSearchParams(e),n=`${d}/filters?${t}`;return await u(n)},async getExercisesQuote(){const e=`${d}/quote`;return await u(e)},async addSubscription(e){const t="POST",n=`${d}/subscription`,a=JSON.stringify(e);return await u(n,t,a)}},B=W.create({baseURL:d,headers:{"Content-type":"application/json"}}),g="/project-ilurgym2/assets/icons-DPmJyXT3.svg",m={MUSCLES:"Muscles",BODY_PARTS:"Body parts",EQUIPMENT:"Equipment"},v={EXERCISE:"exercises",CATEGORY:"categories"},P=768;let w=m.MUSCLES,q=null;document.addEventListener("DOMContentLoaded",async()=>{if(document.getElementById("favorites"))$();else{const{categories:t,page:n,totalPages:a}=await C(m.MUSCLES);M(t),f(v.CATEGORY,n,a,m.MUSCLES),re()}});const re=()=>{const e=document.querySelectorAll(".filter-btn");e.forEach(t=>{t.addEventListener("click",async()=>{e.forEach(o=>o.classList.remove("active")),t.classList.add("active");const n=t.getAttribute("data-filter"),{categories:a,page:r,totalPages:s}=await C(n);M(a),f(v.CATEGORY,r,s,n)})})},C=async(e,t=1)=>{const n=window.innerWidth<P?9:12;try{const r=(await B.get("/filters",{params:{filter:e,page:t,limit:n}})).data;return r.results?{categories:r.results,page:Number(r.page),totalPages:Number(r.totalPages)}:{categories:[],page:1,totalPages:1}}catch(a){return i(`Error fetching categories: ${a}`,"Error ❌"),{categories:[],page:1,totalPages:1}}},I=async(e,t,n=1,a=null)=>{const r=window.innerWidth<P?8:10;try{const o=(await B.get("/exercises",{params:{page:n,limit:r,...e===m.MUSCLES&&{muscles:t},...e===m.BODY_PARTS&&{bodypart:t},...e===m.EQUIPMENT&&{equipment:t},...a&&{keyword:a}}})).data;return o.results?{exercises:o.results,page:Number(o.page),totalPages:Number(o.totalPages)}:{exercises:[],page:1,totalPages:1}}catch(s){return i(`Error fetching categories: ${s}`,"Error ❌"),{exercises:[],page:1,totalPages:1}}},M=e=>{const t=document.querySelector(".exercises-grid");if(!t)return;if(t.innerHTML="",R(!1),D(!1),e.length===0){t.innerHTML="<p>No categories found.</p>";return}const n=document.createDocumentFragment();e.forEach(a=>{const r=document.createElement("div");r.classList.add("category-card"),r.innerHTML=`
      <img src="${a.imgURL}" alt="${a.name}" width="300px" height="300px"/>
      <h3>${a.name}</h3>
      <p>${a.filter}</p>
    `,r.addEventListener("click",async()=>{const{exercises:s,page:o,totalPages:c}=await I(a.filter,a.name);w=a.filter,q=a.name,L(s),f(v.EXERCISE,o,c,a.filter)}),n.appendChild(r)}),t.appendChild(n)},se=e=>`
  <div class="rating">
    <span>
      ${e}
    </span>
    <svg class="icon-star">
      <use href="${g}#icon-star-full"></use>
    </svg>
  </div>
`,oe=e=>`
  <button class="trash-btn" data-id="${e}">
    <svg width="16px" height="16px">
      <use href="${g}#icon-trash"></use>
    </svg>
  </button>
`,L=(e,t=!1)=>{const n=document.querySelector(".exercises-grid");if(!n)return;if(n.innerHTML="",R(!0),D(!0,q),e.length===0){n.innerHTML="<p>No exercises found.</p>";return}const a=e.map(({bodyPart:r,burnedCalories:s,target:o,name:c,rating:l,_id:y})=>`
    <div class="exercise-card">
      <div class="exercise-card-header">
        <div class="label">WORKOUT</div>
        ${t?oe(y):se(l)}
        <button class="start-btn" data-id="${y}">
          Start
          <svg class="icon-arrow">
            <use href="${g}#icon-arrow-start"></use>
          </svg>
        </button>
      </div>
      <div class="title-wrapper">
        <div class="icon-run-exercises">
          <svg class="icon-run">
            <use href="${g}#icon-run"></use>
          </svg>
        </div>
        <div class="title">${c}</div>
      </div>
      <div class="details">
        <div class="details-item">
          Burned calories: <span>${s}</span>
        </div>
        <div class="details-item">
          Body part: <span>${r}</span>
        </div>
        <div class="details-item">
          Target:<span>${o}</span>
        </div>
      </div>
    </div>
  `).join(" ");n.insertAdjacentHTML("afterbegin",a),document.querySelectorAll(".exercise-card .start-btn").forEach(r=>{const s=r.getAttribute("data-id");s?r.addEventListener("click",async()=>{await ge(s)}):i("Exercise ID is missing.","Error ❌")}),document.querySelectorAll(".trash-btn").forEach(r=>{const s=r.getAttribute("data-id");s?r.addEventListener("click",()=>{F(s,$)}):i("Exercise ID is missing.","Error ❌")})},f=(e,t,n,a)=>{const r=document.getElementById("pagination");if(!r||(r.innerHTML="",n<=1))return;const s=document.createDocumentFragment();for(let o=1;o<=n;o++){const c=document.createElement("div");c.innerText=o,c.className=o===t?"page current":"page",c.addEventListener("click",async()=>{if(e===v.CATEGORY){const{categories:l}=await C(a,o);M(l),f(e,o,n,a)}else{const{exercises:l}=await I(a,null,o);L(l),f(e,o,n,a)}}),s.appendChild(c)}r.appendChild(s)},$=()=>{const e=document.querySelector(".exercises-grid"),t=b();t.length>0?L(t,!0):e.innerHTML=`<p class="empty-favorites">It appears that you haven't added any exercises to your favorites yet. To get started, you can add exercises that you like to your favorites for easier access in the future.</p>`},R=e=>{const t=document.getElementById("search-form");t&&(t.style.display=e?"block":"none",e?t.addEventListener("submit",N):t.removeEventListener("submit",N))},N=async e=>{e.preventDefault();const t=document.getElementById("search-input"),n=t.value.trim();if(t.value="",n==="")return;const{exercises:a}=await I(w,q,1,n);L(a),f(v.EXERCISE,1,1,w)},D=(e,t="")=>{const n=document.querySelector(".exercises-header-span"),a=document.querySelector(".exercises-subcategory");!n||!a||(n.style.display=e?"flex":"none",a.textContent=t)},H=async e=>{const n=b().find(r=>r._id===e);return{exercise:await x.getExercisesId(e),isFavorite:n}};function ie(){const e=document.querySelector(".modal__block").getAttribute("data-id");if(e){_();const t=document.getElementById("ratingModal");t&&(U(),de(),t.setAttribute("data-exercise-id",e),t.classList.add("is-visible"),le(),document.addEventListener("keydown",j))}else i("Exercise ID is missing when trying to open the rating modal.","Error ❌")}document.addEventListener("click",function(e){e.target.closest(".rating-modal__exit")&&p()});document.addEventListener("click",function(e){const t=document.getElementById("ratingModal"),n=document.querySelector(".rating-modal__block");t.classList.contains("is-visible")&&t&&!n.contains(e.target)&&p()});const j=e=>{e.key==="Escape"&&p()};document.addEventListener("click",function(e){e.target.matches(".rating-modal__cancel-btn")&&p()});function p(){const e=document.getElementById("ratingModal");e&&(e.classList.remove("is-visible"),U(),document.removeEventListener("keydown",j))}function ce(e){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e).toLowerCase())}function le(){const e=document.querySelector(".rating-modal__stars");if(!e)return;const t=e.querySelectorAll("span");t.length!==0&&t.forEach((n,a)=>{n.addEventListener("click",function(){t.forEach(o=>o.classList.remove("selected"));for(let o=0;o<=a;o++)t[o].classList.add("selected");const r=a+1,s=document.querySelector(".rating-modal__value");if(s){s.textContent=r.toFixed(1),s.setAttribute("data-selected-rating",r);const o=JSON.parse(localStorage.getItem("rating-form-data"))||{};o.rating=r,localStorage.setItem("rating-form-data",JSON.stringify(o))}})})}function U(){const e=document.querySelector(".rating-modal__email"),t=document.querySelector(".rating-modal__comment"),n=document.querySelectorAll(".rating-modal__stars span"),a=document.querySelector(".rating-modal__value");e&&(e.value=""),t&&(t.value=""),n.length>0&&n.forEach(r=>r.classList.remove("selected")),a&&(a.textContent="0.0",a.removeAttribute("data-selected-rating")),localStorage.removeItem("rating-form-data")}function de(){const e=JSON.parse(localStorage.getItem("rating-form-data"));e!==null&&(e.email&&(document.querySelector(".rating-modal__email").value=e.email),e.comment&&(document.querySelector(".rating-modal__comment").value=e.comment),e.rating&&(document.querySelectorAll(".rating-modal__stars span").forEach((n,a)=>{a<e.rating&&n.classList.add("selected")}),document.querySelector(".rating-modal__value").textContent=e.rating,document.querySelector(".rating-modal__value").setAttribute("data-selected-rating",e.rating)))}document.addEventListener("input",e=>{var t,n,a;if(e.target.matches(".rating-modal__email")||e.target.matches(".rating-modal__comment")){const r=(t=document.querySelector(".rating-modal__email"))==null?void 0:t.value.trim(),s=(n=document.querySelector(".rating-modal__comment"))==null?void 0:n.value.trim(),o=(a=document.querySelector(".rating-modal__value"))==null?void 0:a.getAttribute("data-selected-rating"),c={email:r||"",comment:s||"",rating:o||""};localStorage.setItem("rating-form-data",JSON.stringify(c))}});document.addEventListener("DOMContentLoaded",function(){document.addEventListener("click",function(e){var t,n,a;if(e.target.matches(".rating-btn")&&ie(),e.target.matches(".rating-modal__submit-btn")){const r=document.getElementById("ratingModal"),s=r==null?void 0:r.getAttribute("data-exercise-id");if(!s)return;const o=(t=document.querySelector(".rating-modal__value"))==null?void 0:t.getAttribute("data-selected-rating");if(!o){i("Please select a rating.","Error ❌");return}const c=(n=document.querySelector(".rating-modal__email"))==null?void 0:n.value.trim(),l=(a=document.querySelector(".rating-modal__comment"))==null?void 0:a.value.trim();if(!o||!c||!l){i("Please fill in all fields.","Error ❌");return}if(!ce(c)){i("Please enter a valid email address.","Error ❌");return}const y={rate:Number(o),email:c,review:l};x.editExercisesIdRating(s,y).then(T=>{i("Thank you for your feedback","Done ✅"),localStorage.removeItem("rating-form-data"),p()}).catch(T=>{T.message.includes("Rating already submitted with this email")?i("You have already submitted a rating using this email address.","Error ❌"):i("Error submitting rating. Please try again later.","Error ❌")})}})});const ue=e=>{const t=Math.round(e),n=Array(t).fill(`<svg class="icon-star"><use href="${g}#icon-star-full"></use></svg>`),a=Array(5-t).fill(`<svg class="icon-star"><use href="${g}#icon-star-empty"></use></svg>`);return`
    ${n.join("")}
    ${a.join("")}
  `},J=()=>`
  <span class="js-favorite-add">Add to favorites</span>
  <svg class="js-favorite-add favorite-icon favorite-icon--heart" width="20" height="20">
    <use href="./img/icons/icons.svg#icon-heart" />
  </svg>
`,Q=()=>`
  <span class="js-favorite-remove">Remove from favorites</span>
  <svg class="js-favorite-remove favorite-icon favorite-icon--trash" width="20" height="20">
    <use href="./img/icons/icons.svg#icon-trash" />
  </svg>
`,me=(e,t)=>`
  <div class="modal">
    <div class="modal__block" data-id="${e._id}">
      <div class="modal__block-content">
        <div class="modal__block-wrapper">
          <svg class="modal__exit modal-close">
            <use href="./img/icons/icons.svg#icon-close"></use>
          </svg>
          <div class="modal__img">
            <img src="${e.gifUrl||""}" class="modal-image" alt="${e.name||"Exercise image"}" />
          </div>
          <div class="modal__content">
            <h2 class="modal-title">${e.name||"No name available"}</h2>
            <div class="modal__rating">
              <span>${e.rating}</span>
              <span>${ue(e.rating)}</span>
            </div>
            <div class="modal__info">
              <div>
                <div>Target</div>
                <div class="modal-target">${e.target||"No target available"}</div>
              </div>
              <div>
                <div>Body Part</div>
                <div class="modal-bodyPart">${e.bodyPart||"No body part available"}</div>
              </div>
              <div>
                <div>Equipment</div>
                <div class="modal-equipment">${e.equipment||"No equipment available"}</div>
              </div>
              <div>
                <div>Popular</div>
                <div class="modal-popular">${e.popularity||0}</div>
              </div>
              <div>
                <div>Burned calories</div>
                <div class="modal-calories">${e.burnedCalories||"N/A"}</div>
              </div>
            </div>
            <p class="modal__description">
              ${e.description||"No description available"}
            </p>
          </div>
        </div>
        <div class="modal__btns">
          <button class="favorites-btn" data-id="${e._id}">
            ${t?Q():J()}
          </button>
          <button class="rating-btn">Give a rating</button>
        </div>
      </div>
    </div>
  </div>
`;async function ge(e){const{exercise:t,isFavorite:n}=await H(e),a=me(t,n);document.body.insertAdjacentHTML("beforeend",a);const r=document.querySelector(".favorites-btn");r.addEventListener("click",G(r)),document.addEventListener("keydown",Y)}function _(){const e=document.querySelector(".modal"),t=document.querySelector(".favorites-btn");t.removeEventListener("click",G(t)),e?(e.remove(),document.removeEventListener("keydown",Y)):i("Modal element is missing.","Error ❌")}const Y=e=>{e.key==="Escape"&&_()},G=e=>async()=>{const t=e.getAttribute("data-id"),n=document.getElementById("favorites"),{exercise:a,isFavorite:r}=await H(t);if(r){const s=n?$:void 0;F(a._id,s)}else ae(a);e.innerHTML=r?J():Q()},fe=e=>{e.addEventListener("click",_)};document.addEventListener("DOMContentLoaded",()=>{document.addEventListener("click",e=>{const t=document.querySelector(".modal"),n=t==null?void 0:t.querySelector(".modal__block");t&&n&&!n.contains(e.target)&&_();const a=document.querySelector(".modal-close");a&&fe(a)})});const E=document.querySelector(".subscribe-form");if(E!==null){E.addEventListener("submit",e);async function e(a){a.preventDefault();const r=a.target.elements.email.value;try{await x.addSubscription({email:r}),i("You have subscribed 🥳","Congratulations!","#f4f4f4")}catch{i("Subscription already exists 😊","","#c6cdd1")}finally{a.target.reset(),localStorage.removeItem("subscribe-form-email")}}const t={email:""};(a=>{const r=JSON.parse(localStorage.getItem("subscribe-form-email"));if(r!==null)for(const s in r)r.hasOwnProperty(s)&&(a.elements[s].value=r[s],t[s]=r[s])})(E),E.addEventListener("input",a=>{const r=a.target.name,s=a.target.value.trim();t[r]=s,localStorage.setItem("subscribe-form-email",JSON.stringify(t))})}(()=>{let e=document.querySelector(".js-menu-container"),t=document.querySelector(".js-open-menu"),n=document.querySelector(".js-close-menu"),a=[...document.getElementsByClassName("mobile-menu-link")],r=()=>{let o=t.getAttribute("aria-expanded")==="true";t.setAttribute("aria-expanded",!o),e.classList.toggle("is-open"),document.body.style.overflow=o?"auto":"hidden"};const s=()=>{window.matchMedia("(max-width: 767px)").matches?(t.addEventListener("click",r),n.addEventListener("click",r),a.forEach(o=>{o.addEventListener("click",r)})):(t.removeEventListener("click",r),n.removeEventListener("click",r),a.forEach(o=>{o.removeEventListener("click",r)}),e.classList.remove("is-open"),t.setAttribute("aria-expanded",!1))};window.addEventListener("resize",s),s()})();const ve=()=>{document.querySelector(".preloader").classList.add("preloader--hidden")};document.addEventListener("DOMContentLoaded",()=>{setTimeout(()=>{ve()},500)});let S=document.getElementById("myBtn");document.getElementsByClassName(".footer");S&&(S.onclick=function(){ye()});window.onscroll=function(){pe()};function pe(){document.body.scrollTop>20||document.documentElement.scrollTop>20?S.style.display="block":S.style.display="none"}function ye(){document.body.scrollTop=0,document.documentElement.scrollTop=0}
//# sourceMappingURL=main-DVTdRhw0.js.map
