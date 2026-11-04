// ===== تشغيل التطبيق: Firebase + تحميل المنتجات والإعدادات، وبعدين app.js =====
const V="10.12.2",G="https://www.gstatic.com/firebasejs/"+V+"/";
const cfg=window.FIREBASE_CONFIG||{};
const LSget=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}};
const LSput=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const timeout=(p,ms)=>Promise.race([p,new Promise((_,r)=>setTimeout(()=>r(new Error("timeout")),ms))]);
async function sha(s){const b=await crypto.subtle.digest("SHA-1",new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("").slice(0,20)}
const clean=o=>JSON.parse(JSON.stringify(o));

let FB=null;
async function initFirebase(){
 if(window.__FBMOCK)return window.__FBMOCK;               // للتجارب
 if(!cfg.projectId||String(cfg.apiKey||"").startsWith("PASTE"))return null;
 const [A,F,U]=await timeout(Promise.all([import(G+"firebase-app.js"),import(G+"firebase-firestore.js"),import(G+"firebase-auth.js")]),8000);
 const app=A.initializeApp(cfg),db=F.getFirestore(app),auth=U.getAuth(app);
 const {doc,getDoc,setDoc,updateDoc,onSnapshot,collection,query,orderBy,limit}=F;
 const upImg=new Set();
 async function packImg(u){if(!u||!u.startsWith("data:"))return u;const h=await sha(u);if(!upImg.has(h)){await setDoc(doc(db,"images",h),{d:u});upImg.add(h);LSput("dk_img_"+h,u)}return "fs:"+h}
 return {
  live:true,
  async loadCatalog(){const s=await getDoc(doc(db,"catalog","main"));return s.exists()?s.data().items:null},
  async loadConfig(){const s=await getDoc(doc(db,"config","main"));return s.exists()?(s.data().cfg||{}):null},
  async saveConfig(c){await setDoc(doc(db,"config","main"),clean({cfg:c,t:Date.now()}));LSput("dk_cfg",c)},
  async loadImage(h){const s=await getDoc(doc(db,"images",h));return s.exists()?s.data().d:""},
  async saveCatalog(list){const out=[];for(const p of list){const q={...p};q.img=await packImg(q.img);if(Array.isArray(q.imgs))q.imgs=await Promise.all(q.imgs.map(packImg));out.push(q)}
   const size=new Blob([JSON.stringify(out)]).size;if(size>950000)throw new Error("الكتالوج كبير كتير ("+Math.round(size/1024)+"KB)");
   await setDoc(doc(db,"catalog","main"),clean({items:out,t:Date.now()}));LSput("dk_catalog",out);return out},
  async createOrder(o){await setDoc(doc(db,"orders",o.id),clean(o))},
  watchOrder(id,cb){return onSnapshot(doc(db,"orders",id),s=>{if(s.exists())cb(s.data())},()=>{})},
  watchAllOrders(cb,err){return onSnapshot(query(collection(db,"orders"),orderBy("ts","desc"),limit(80)),s=>cb(s.docs.map(d=>({...d.data(),id:d.id}))),e=>err&&err(e))},
  async setStatus(id,v){await updateDoc(doc(db,"orders",id),clean({...v,t:Date.now()}))},
  async requestCancel(id){await updateDoc(doc(db,"orders",id),{cancelReq:true})},
  onAuth(cb){U.onAuthStateChanged(auth,cb)},
  async signInGoogle(){const pr=new U.GoogleAuthProvider();try{return await U.signInWithPopup(auth,pr)}catch(e){if(/popup/.test(e.code||""))return U.signInWithRedirect(auth,pr);throw e}},
  signOut(){return U.signOut(auth)}
 };
}
const offline={live:false,onAuth(cb){cb(null)},watchOrder(){},watchAllOrders(){},async createOrder(){},async requestCancel(){},async setStatus(){throw new Error("قاعدة البيانات مش موصولة")},async saveCatalog(){throw new Error("قاعدة البيانات مش موصولة لسا")},async saveConfig(){throw new Error("قاعدة البيانات مش موصولة لسا")},signInGoogle:async()=>{throw new Error("قاعدة البيانات مش موصولة لسا")},signOut(){}};

async function resolveImgs(items){
 const need=new Set();items.forEach(p=>[p.img,...(p.imgs||[])].forEach(u=>{if(u&&u.startsWith("fs:"))need.add(u.slice(3))}));
 const map={};await Promise.all([...need].map(async h=>{let d=LSget("dk_img_"+h,null);if(!d&&FB&&FB.loadImage){try{d=await FB.loadImage(h);if(d)LSput("dk_img_"+h,d)}catch(e){}}map[h]=d||""}));
 items.forEach(p=>{if(p.img&&p.img.startsWith("fs:"))p.img=map[p.img.slice(3)];if(p.imgs)p.imgs=p.imgs.map(u=>u.startsWith("fs:")?map[u.slice(3)]:u).filter(Boolean)});
 return items}

(async()=>{
 try{FB=await initFirebase()}catch(e){console.warn("firebase",e);FB=null}
 window.FB=FB||offline;
 let items=null,conf=null,src="";
 if(FB&&FB.live){
  try{[items,conf]=await timeout(Promise.all([FB.loadCatalog(),FB.loadConfig()]),6000);if(items){src="db";LSput("dk_catalog",items)}if(conf)LSput("dk_cfg",conf)}catch(e){console.warn("load",e)}
 }
 if(!items){items=LSget("dk_catalog",null);if(items)src="cache"}
 if(!items){try{items=await (await fetch("products.json",{cache:"no-cache"})).json();src="file"}catch(e){items=[]}}
 if(!conf)conf=LSget("dk_cfg",null);
 if(!conf){try{conf=await (await fetch("settings.json",{cache:"no-cache"})).json()}catch(e){conf={}}}
 window.__CFG=conf||{};
 // منتجات جديدة جهّزها Claude (public/import.json): قبل أول حفظ بتنضاف لحالها، وبعدها صاحب الدكانة بيضيفها بكبسة
 let imp=[];try{imp=await (await fetch("import.json",{cache:"no-cache"})).json()}catch(e){imp=[]}
 if(!Array.isArray(imp))imp=[];
 if(src!=="db"){const have=new Set(items.map(p=>p.id));imp.forEach(p=>{if(p&&p.id&&!have.has(p.id))items.push(p)});imp=[]}
 window.__IMPORT=imp;
 window.__DATA=await resolveImgs(items.map(p=>({...p})));window.__SRC=src;
 const s=document.createElement("script");s.src="app.js?v="+(window.APP_V||"1");s.onload=()=>{const sp=document.getElementById("splash");if(sp)sp.remove()};document.body.appendChild(s);
})();
if("serviceWorker" in navigator&&location.protocol==="https:")navigator.serviceWorker.register("sw.js").catch(()=>{});
