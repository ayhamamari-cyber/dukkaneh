
document.documentElement.setAttribute("data-theme","light"); // الموقع دايمًا فاتح (خلفية بيضا)
// ===== عدّل هون =====
const SHOP_NAME = "دكانتنا";
const WHATSAPP = "972502486206"; // رقمك مع رمز الدولة بدون + أو صفر البداية
const CUR = "₪";
const PRODUCTS = window.__DATA||[];PRODUCTS.forEach((p,k)=>{if(!p.id)p.id="p"+String(k+1).padStart(3,"0")});
// =====================
const $=id=>document.getElementById(id), cart={};
const fmt=n=>n.toFixed(2).replace(/\.00$/,"").replace(/(\.\d)0$/,"$1")+" "+CUR;
const cats=["الكل",...new Set(PRODUCTS.map(p=>p.c))]; let cur="الكل",term="";

const GROUPS=[
 {n:"خضار وفواكه",i:"🥬",c:["خضار","فواكه","ورقيات","خضار وفواكه"]},
 {n:"ألبان وأجبان",i:"🧀",c:["حليب","مشروبات حليب","لبن ويوغورت","أجبان","قشطة","لبنة","زبدة","بيض","حلويات مبردة","ألبان وبيض","ألبان وأجبان"]},
 {n:"مشروبات",i:"🥤",c:["مشروبات","قهوة وشاي"]},
 {n:"حلويات وشيبس",i:"🍫",c:["شوكولاتة","لواكر","بسكوت","وافل","كرمبو","علكة وسكاكر","جيلي وبودينغ","بسكوت وحلويات","حلويات","شيبس","بمبا","بيسلي","أبروبو","بيجلا","كراكر","فشار","مكسرات","سناكات","حلويات وشيبس"]},
 {n:"مخبوزات",i:"🥖",c:["مخبوزات","خبز","كيك وحلويات مخبوزة","بقسماط"]},
 {n:"مجمدات",i:"❄️",c:["مجمدات"]},
 {n:"معلبات",i:"🥫",c:["معلبات","فول مدمس","معلبات ومونة"]},
 {n:"مونة وطبخ",i:"🍚",c:["رز","سكر","زيوت","معكرونة ونودلز","مرقة وشوربة","خبيز وطبخ","صلصات وكاتشب","عسل ومربى","مونة","صلصات","مونة وطبخ"]},
 {n:"سلطات ومقبلات",i:"🥗",c:["حمص","سلطات جاهزة","طحينة","سلطات ومقبلات"]},
 {n:"مواد تنظيف",i:"🧼",c:["منظفات","ورقيات ومناديل","تنظيف","مواد تنظيف"]},
 {n:"عناية شخصية وأطفال",i:"🧴",c:["عناية شخصية","منتجات أطفال","أطفال","عناية شخصية وأطفال"]}
];
const OTHER={n:"أخرى",i:"🛒",c:[]};
function groupOf(c){return (GROUPS.find(g=>g.c.includes(c))||OTHER).n}
function groupsPresent(){const out=[];for(const g of [...GROUPS,OTHER]){const cs=[...new Set(PRODUCTS.filter(p=>groupOf(p.c)===g.n).map(p=>p.c))];if(cs.length)out.push({...g,cs,count:PRODUCTS.filter(p=>groupOf(p.c)===g.n).length})}return out}
let sub="",sortBy="",fAvail=false,fSale=false;
function curCat(){if(sub)return sub;if(cur.startsWith("G:")){const g=groupsPresent().find(x=>x.n===cur.slice(2));if(g)return g.cs[0]}return cats[1]||"عام"}
function openGroup(n){cur="G:"+n;sub="";term="";const q=$("q");if(q)q.value="";const cp=$("catPage");if(cp)cp.style.display="none";drawCats();drawGrid();const f=$("fbar")||$("grid");f.scrollIntoView({behavior:"smooth",block:"start"})}
function openCatPage(){const cp=$("catPage");if(!cp)return;const GP=groupsPresent();$("catGrid").innerHTML=GP.map(g=>`<button type="button" class="gcard" data-g="${g.n}"><span class="gi">${g.i}</span><b>${g.n}</b><small>${g.count} منتج</small><em>${g.cs.slice(0,4).join(" • ")}${g.cs.length>4?" …":""}</em></button>`).join("")+GROUPS.filter(g=>!GP.some(x=>x.n===g.n)).map(g=>`<div class="gcard soon"><span class="gi">${g.i}</span><b>${g.n}</b><small>قريبًا</small></div>`).join("");cp.style.display="flex"}
window.openCatPage=openCatPage;
function showFavs(){cur="المفضلة";sub="";term="";const q=$("q");if(q)q.value="";drawCats();drawGrid();($("fbar")||$("grid")).scrollIntoView({behavior:"smooth",block:"start"})}window.showFavs=showFavs;
function updFavTop(){const c=$("favCnt");if(c){c.textContent=favs.size;c.style.display=favs.size?"grid":"none"}}
window.openGroup=openGroup;
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function norm(s){return String(s||"").toLowerCase().replace(/[\u064B-\u0652\u0640]/g,"").replace(/[أإآٱ]/g,"ا").replace(/ة/g,"ه").replace(/ى/g,"ي").replace(/ؤ/g,"و").replace(/ئ/g,"ي").replace(/[\u0591-\u05C7]/g,"")}
function matchQ(p,q){const toks=norm(q).split(/\s+/).filter(Boolean);if(!toks.length)return true;const hay=norm(p.n+" "+p.c+" "+groupOf(p.c));return toks.every(t=>hay.includes(t))}
try{const s=JSON.parse(localStorage.getItem("dk_cart")||"{}");for(const [n,v] of Object.entries(s)){const i=PRODUCTS.findIndex(p=>p.n===n);if(i>=0&&PRODUCTS[i].p>0&&!PRODUCTS[i].oos)cart[i]=v}}catch(e){}
let favs=new Set();try{favs=new Set(JSON.parse(localStorage.getItem("dk_favs")||"[]"))}catch(e){}
function toggleFav(i){const n=PRODUCTS[i]&&PRODUCTS[i].n;if(!n)return;favs.has(n)?favs.delete(n):favs.add(n);try{localStorage.setItem("dk_favs",JSON.stringify([...favs]))}catch(e){}drawCats();drawGrid();updFavTop()}
const hues=Object.fromEntries(cats.slice(1).map((c,i)=>[c,[10,45,200,150,270,330][i%6]]));
$("shop").textContent=SHOP_NAME; document.title=SHOP_NAME;
const ce=Object.fromEntries([["الكل","🛍️"],...PRODUCTS.map(p=>[p.c,p.e])].reverse());ce["عروض"]="🔥";
function drawHero(){const el=$("heroCol");if(!el||el.children.length)return;const pick=[];const want=["بندورة","موز","خيار","تفاح","حليب","فلفل","برتقال","بطاطا"];
 want.forEach(w=>{const p=PRODUCTS.find(q=>q.img&&q.n.startsWith(w)&&!pick.includes(q));if(p&&pick.length<4)pick.push(p)});
 PRODUCTS.forEach(p=>{if(pick.length<4&&p.img&&p.p>0&&!pick.includes(p))pick.push(p)});
 el.innerHTML=pick.map((p,k)=>`<span class="hb${k}"><img src="${p.img}" alt=""></span>`).join("")}
function promoAuto(){const s=$("promos"),dots=$("promoDots");if(!s||!dots)return;const slides=[...s.children].filter(x=>x.offsetParent!==null);
 dots.innerHTML=slides.map((x,k)=>`<i class="${k?"":"on"}"></i>`).join("");let k=0,user=0;
 s.addEventListener("scroll",()=>{const w=s.clientWidth;const n=Math.round(Math.abs(s.scrollLeft)/Math.max(1,slides[0].offsetWidth+10));[...dots.children].forEach((d2,j)=>d2.classList.toggle("on",j===n));k=n},{passive:true});
 s.addEventListener("touchstart",()=>{user=Date.now()},{passive:true});
 setInterval(()=>{if(document.hidden||Date.now()-user<8000||slides.length<2)return;k=(k+1)%slides.length;slides[k].scrollIntoView({behavior:"smooth",block:"nearest",inline:"start"})},5000)}
function catImg(g){const p=PRODUCTS.find(q=>groupOf(q.c)===g&&q.img&&q.p>0)||PRODUCTS.find(q=>groupOf(q.c)===g&&q.img);return p?p.img:""}
function drawCats(){const hasSale=PRODUCTS.some(p=>p.s);ce["المفضلة"]="❤️";const list=["الكل",...(hasSale?["عروض"]:[]),...(favs.size?["المفضلة"]:[]),...groupsPresent().map(g=>{ce["G:"+g.n]=g.i;return "G:"+g.n})];{const p2=document.querySelector(".promo.p2");if(p2)p2.style.display=hasSale?"":"none"}$("cats").innerHTML=list.map(c=>`<button class="${c===cur?"on":""}" data-c="${c}"><span class="ci">${c.startsWith("G:")&&catImg(c.slice(2))?`<img src="${catImg(c.slice(2))}" alt="">`:ce[c]}</span><span class="cl">${c.startsWith("G:")?c.slice(2):c}</span></button>`).join("");drawDeals()}
function drawDeals(){
 const deals=PRODUCTS.map((p,i)=>({p,i})).filter(o=>o.p.s&&!o.p.oos);
 const el=$("dealsBanner");if(!el)return;
 if(!deals.length){el.classList.remove("on");el.innerHTML="";return}
 el.classList.add("on");
 const hint=deals.length>1?`<div class="dhint">⬅ زيح عشان تشوف باقي العروض (${deals.length})</div>`:"";
 el.innerHTML='<div class="dhead">🔥 عروض وحملات اليوم</div><div class="drow">'+deals.map(({p,i})=>{
  const priceHtml=p.op>p.p?`<span class="op">${fmt(p.op)}</span>${fmt(p.p)}`:fmt(p.p);
  const pct=p.op>p.p?Math.round((1-p.p/p.op)*100):0;
  const tag=pct>0?`خصم ${pct}%`:"🔥 عرض خاص";
  return `<div class="dcard" data-di="${i}"><div class="di">${p.img?`<img src="${p.img}" alt="${p.n}" loading="lazy">`:p.e}<span class="dtag">${tag}</span></div><div class="dinfo"><div class="dn">${p.n}</div><div class="dp">${priceHtml}</div></div></div>`;
 }).join("")+'</div>'+hint;
}
function isAmt(v){return typeof v==="string"}
function bundleCost(p,qty){
 if(p.bq>1&&p.bp>0){const sets=Math.floor(qty/p.bq),rem=qty%p.bq;return sets*p.bp+rem*p.p}
 return p.p*qty;
}
// ===== إعدادات التوصيل (غيّرها هون) =====
// ===== إعدادات الدكانة: بتتغير من لوحة الإدارة ← ⚙️ إعدادات الدكانة =====
let CFG=window.__CFG||{};
const cfgNum=v=>(v===null||v===undefined||v==="")?null:(isFinite(+v)?+v:null);
const DELIVERY_FEE=cfgNum(CFG.fee);        // سعر التوصيل. null = بيتحدد على واتساب
const FREE_DELIVERY_OVER=cfgNum(CFG.freeOver);
// مواعيد التوصيل: [من ساعة, لساعة]. فاضية [] = بس "بأسرع وقت"
const DELIVERY_SLOTS=Array.isArray(CFG.slots)?CFG.slots:[[10,12],[12,14],[16,18],[18,20]];
const MIN_ORDER=cfgNum(CFG.minOrder);
const DELIVERY_ETA=CFG.eta||"خلال ساعة لساعتين تقريبًا";   // الوقت المتوقع لما يختار "بأسرع وقت"
const PICKUP_ETA=CFG.pickEta||"بيكون جاهز خلال نص ساعة تقريبًا"; // الوقت المتوقع للاستلام من الدكانة
// كوبونات: "الكود":{pct:نسبة} أو {amt:مبلغ}، ومع min اختياري (أقل مبلغ للطلب). مثال: {"WELCOME10":{pct:10,min:50}}
const COUPONS=(CFG.coupons&&typeof CFG.coupons==="object")?CFG.coupons:{};
let shipMode="d",shipDay=0,shipSlot=-1,subPref="call",payMode="cash",bags="",callBefore=false,leaveDoor=false,coupon="",coupMsg="";
const SUBS={same:"🔁 استبدله بأقرب منتج مشابه",call:"📞 اتصل بي أولًا",none:"❌ احذف المنتج ولا تستبدله"};
const SUBS_S={same:"🔁 بديل مشابه",call:"📞 اتصلوا أول",none:"❌ احذفه"};
let isub={},later=[];try{isub=JSON.parse(localStorage.getItem("dk_isub")||"{}")||{};later=JSON.parse(localStorage.getItem("dk_later")||"[]")||[]}catch(e){}
function saveX(){try{localStorage.setItem("dk_isub",JSON.stringify(isub));localStorage.setItem("dk_later",JSON.stringify(later))}catch(e){}}
function subOf(i){const n=PRODUCTS[i]&&PRODUCTS[i].n;return (n&&isub[n])||subPref}
function coupVal(paid){const c=COUPONS[coupon];if(!c)return 0;if(c.min&&paid<c.min)return 0;return Math.min(paid,c.pct?paid*c.pct/100:(c.amt||0))}
function etaTxt(){if(shipMode==="p")return PICKUP_ETA;if(shipSlot>=0)return (shipDay?"بكرا":"اليوم")+" بين "+slotTxt(DELIVERY_SLOTS[shipSlot]);return DELIVERY_ETA}
function slotTxt(s){const f=h=>String(h).padStart(2,"0")+":00";return f(s[0])+"–"+f(s[1])}
function slotsFor(day){const now=new Date(),h=now.getHours()+now.getMinutes()/60;return DELIVERY_SLOTS.map((s,k)=>({s,k})).filter(o=>day>0||o.s[1]-1>h)}
function shipLabel(){if(shipMode==="p")return "استلام من الدكانة";const day=shipDay?"بكرا":"اليوم";return shipSlot<0?"توصيل للبيت • بأسرع وقت":`توصيل للبيت • ${day} ${slotTxt(DELIVERY_SLOTS[shipSlot])}`}
function drawShip(){const el=$("ship");if(!el)return;
 let h=`<div class="shead">طريقة الاستلام</div><div class="stog"><button type="button" data-sm="d" class="${shipMode==="d"?"on":""}"><span>🚚</span>توصيل للبيت</button><button type="button" data-sm="p" class="${shipMode==="p"?"on":""}"><span>🏪</span>استلام من الدكانة</button></div>`;
 if(shipMode==="d"){
  h+=`<div class="shead">وقت التوصيل</div>`;
  if(DELIVERY_SLOTS.length){h+=`<div class="sday"><button type="button" data-sd="0" class="${shipDay===0?"on":""}">اليوم</button><button type="button" data-sd="1" class="${shipDay===1?"on":""}">بكرا</button></div>`}
  const av=slotsFor(shipDay);if(shipSlot>=0&&!av.some(o=>o.k===shipSlot))shipSlot=-1;
  h+=`<div class="stimes"><button type="button" data-ss="-1" class="${shipSlot<0?"on":""}">⚡ بأسرع وقت</button>${av.map(o=>`<button type="button" data-ss="${o.k}" class="${shipSlot===o.k?"on":""}"><bdi dir="ltr">${slotTxt(o.s)}</bdi></button>`).join("")}</div>`;
  if(DELIVERY_SLOTS.length&&shipDay===0&&!av.length)h+=`<div class="snote">خلصت مواعيد اليوم، اختار "بكرا" أو "بأسرع وقت"</div>`;
  h+=`<div class="snote">🚚 تكلفة التوصيل: <b>${DELIVERY_FEE===null?"بنحكيلك إياها على واتساب":DELIVERY_FEE===0?"مجاني":fmt(DELIVERY_FEE)}</b>${DELIVERY_FEE&&FREE_DELIVERY_OVER!==null?` • مجاني للطلبات فوق ${fmt(FREE_DELIVERY_OVER)}`:""}</div>`;
 }else h+=`<div class="snote">🏪 بتيجي تستلم طلبك من الدكانة، وما في رسوم توصيل. رح نبعتلك على واتساب لما يجهز.</div>`;
 h+=`<div class="eta">⏱️ <span>الوقت المتوقع:</span> <b>${etaTxt().replace(/(\d\d:\d\d–\d\d:\d\d)/,'<bdi dir="ltr">$1</bdi>')}</b></div>`;
 h+=`<div class="shead">خيارات إضافية</div><div class="xopts"><button type="button" data-bg="yes" class="${bags==="yes"?"on":""}">🛍️ بدي أكياس</button><button type="button" data-bg="no" class="${bags==="no"?"on":""}">♻️ بدون أكياس</button>${shipMode==="d"?`<button type="button" data-xo="cb" class="${callBefore?"on":""}">📞 اتصل فيّ قبل ما توصل</button><button type="button" data-xo="door" class="${leaveDoor?"on":""}">🚪 اترك الطلب عند الباب</button>`:""}</div>`;
 h+=`<div class="shead">طريقة الدفع</div><div class="pays"><button type="button" data-pm="cash" class="${payMode==="cash"?"on":""}"><span>💵</span>نقدًا عند الاستلام<small>${shipMode==="p"?"بتدفع بالدكانة":"بتدفع للموصّل"}</small></button>${CFG.card===false?"":`<button type="button" data-pm="card" class="${payMode==="card"?"on":""}"><span>💳</span>بطاقة عند الاستلام<small>${shipMode==="p"?"بالدكانة":"الموصّل معه جهاز"}</small></button>`}</div>`;
 h+=`<div class="shead">إذا نفد منتج وقت تجهيز الطلب؟</div><div class="snote" style="margin:0 0 6px">هاد الاختيار لكل المنتجات، وبتقدر تغيّره لكل منتج لحال فوق بالسلة.</div><div class="subs2">${Object.entries(SUBS).map(([k,t])=>`<button type="button" data-sp="${k}" class="${subPref===k?"on":""}">${t}</button>`).join("")}</div>`;
 el.innerHTML=h;
 const a=$("addr");if(a)a.style.display=shipMode==="p"?"none":"";
}

// ===== حساب الزبون، الطلبات، التواصل، المعلومات =====
const SHOP_PHONE="0502486206";
const SHOP_HOURS=CFG.hours||null;     // مثلًا "كل يوم 7:00–22:00، الجمعة لحد 16:00"
const SHOP_LOCATION=CFG.loc||null;  // مثلًا "الشارع الرئيسي، جنب الجامع"
const SHOP_MAPS=CFG.maps||null;      // رابط Google Maps أو Waze للدكانة
// ===== صفحات المعلومات (مسودات، راجعها وعدّلها) =====
const DELIVERY_AREAS=CFG.areas||null; // مثلًا "كفر قاسم، جلجولية، كفر برا". null = بنحكيلك على واتساب
const INFO=[
 ["🏪 من نحن",()=>"دكانتنا — دكانة الحارة، وهلأ صار فيك تطلب منا من البيت بدقيقة. منحاول نوفرلك أغراضك اليومية بأسعار منيحة وخدمة قريبة. أي سؤال أو طلب خاص؟ احكينا على واتساب."],
 ["☎️ تواصل معنا",()=>"واتساب أو اتصال على "+SHOP_PHONE+". ساعات العمل: "+(SHOP_HOURS||"بنحدّثها قريبًا")+". الموقع: "+(SHOP_LOCATION||"بنحدّثه قريبًا")+". وفي نموذج تواصل وأسئلة شائعة بصفحة «تواصل»."],
 ["🚚 سياسة التوصيل",()=>"بتختار بالسلة: توصيل للبيت أو استلام من الدكانة بدون رسوم. للتوصيل بتختار اليوم والوقت، أو «بأسرع وقت» ("+DELIVERY_ETA+"). "+(DELIVERY_FEE===null?"سعر التوصيل بيتحدد حسب المنطقة ومنحكيلك إياه قبل ما نطلع.":"سعر التوصيل "+fmt(DELIVERY_FEE)+(FREE_DELIVERY_OVER!==null?"، ومجاني للطلبات فوق "+fmt(FREE_DELIVERY_OVER):"")+".")+(MIN_ORDER!==null?" الحد الأدنى للطلب "+fmt(MIN_ORDER)+".":"")+" إذا صار تأخير منبلغك على واتساب."],
 ["📍 مناطق التوصيل",()=>DELIVERY_AREAS?"منوصّل لـ: "+DELIVERY_AREAS+". لمنطقة ثانية اسألنا على واتساب.":"منوصّل للمناطق القريبة من الدكانة. اسألنا على واتساب إذا منوصل لعندك."],
 ["❌ سياسة الإلغاء",()=>"بتقدر تلغي الطلب من «طلباتي» خلال أول 15 دقيقة وقبل ما يبلش التجهيز. بعد ما يبلش التجهيز أو يطلع للتوصيل، احكي معنا على واتساب ومنشوف شو منقدر نعمل. الإلغاء بيتأكد لما نرد عليك."],
 ["🔄 الاستبدال والاسترجاع",()=>"إذا وصلك منتج ناقص أو غلط أو تالف، بلّغنا بنفس اليوم من «طلباتي ← الإبلاغ عن مشكلة» أو على واتساب، مع رقم الطلب وصورة للمنتج، ومنعوضك باستبدال أو إرجاع المبلغ. الخضار والفواكه والمنتجات المبرّدة والمجمّدة ما بتنرجع إلا إذا كان فيها عيب. إذا منتج خلص وقت التجهيز، منعمل حسب اختيارك بالسلة (بديل مشابه، نتصل فيك، أو نحذفه) وما بتدفع حقه إذا انحذف."],
 ["💳 طرق الدفع",()=>"الدفع عند الاستلام: نقدًا، أو ببطاقة ائتمان للموصّل أو بالدكانة. المبلغ النهائي ممكن يتغير شوي بالمنتجات اللي بالوزن أو إذا انستبدل أو انحذف منتج، ومنحكيلك قبل. الدفع الإلكتروني بالموقع قريبًا."],
 ["🔒 سياسة الخصوصية",()=>"ما في حساب ولا كلمة سر. اسمك ورقمك وعناوينك وطلباتك ومفضلتك بينحفظوا على تلفونك انت بس. لما تبعت طلب، تفاصيله بتوصل للدكانة برسالة واتساب، ومنستعملها بس عشان نجهز طلبك ونوصله ونتواصل معك بخصوصه. رسائل العروض بتوصلك بس إذا وافقت عليها، وبتقدر توقفها بأي وقت. ما منبيع ولا منشارك معلوماتك مع حدا. بتقدر تمسح كل بياناتك من «حسابي ← تسجيل الخروج»."],
 ["📄 الشروط والأحكام",()=>"الأسعار والتوفر ممكن يتغيروا بدون إشعار مسبق، والصور للتوضيح. الطلب بيتأكد لما الدكانة ترد عليك على واتساب. الأوزان التقريبية (الشراء بمبلغ محدد) ممكن تختلف شوي. العروض والكوبونات لفترة محدودة وما بتنجمع مع بعض إلا إذا انذكر غير هيك. باستعمالك للموقع إنت موافق على هالشروط."]
];
function askYes(msg,yes,no){return new Promise(res=>{const w=document.createElement("div");w.className="askw";w.innerHTML=`<div class="askb"><p></p><div><button type="button" class="ay">${yes||"أيوا"}</button><button type="button" class="an2">${no||"لا"}</button></div></div>`;w.querySelector("p").textContent=msg;document.body.appendChild(w);const done=v=>{w.remove();res(v)};w.querySelector(".ay").onclick=()=>done(true);w.querySelector(".an2").onclick=()=>done(false);w.onclick=e=>{if(e.target===w)done(false)}})}
function LS(k,def){try{const v=JSON.parse(localStorage.getItem(k));return v==null?def:v}catch(e){return def}}
function LSset(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
let curNo=null;
function orderNo(){if(!curNo){const t=new Date();curNo="DK-"+String(t.getMonth()+1).padStart(2,"0")+String(t.getDate()).padStart(2,"0")+"-"+Math.floor(1000+Math.random()*9000)}return curNo}
function waLink(text){return "https://wa.me/"+WHATSAPP+"?text="+encodeURIComponent(text)}
function recordOrder(){const b=build();const S=cartSums();const items={};for(const [i,v] of Object.entries(cart))items[PRODUCTS[i].n]=v;
 const o={no:orderNo(),ts:Date.now(),items,total:S.grand,delUnknown:S.del===null&&shipMode!=="p",ship:shipLabel(),addr:shipMode==="p"?"":$("addr").value.trim(),pay:payLabel(),eta:etaTxt(),lines:Object.entries(cart).map(([i,v])=>({n:PRODUCTS[i].n,q:v,c:+lineFor(i,v).cost.toFixed(2)})),sums:S,coupon,notes:$("notes")?$("notes").value.trim():"",name:$("name").value.trim(),phone:$("phone").value.trim(),msg:b.msg};
 o.id=o.no+"-"+Math.random().toString(36).slice(2,8)+Math.random().toString(36).slice(2,8);o.st=0;o.mk=!!($("mktChk")&&$("mktChk").checked);
 const L=LS("dk_orders",[]);L.unshift(o);LSset("dk_orders",L.slice(0,30));
 FB.createOrder(o).then(()=>watchMine()).catch(e=>console.warn("order",e));
 LSset("dk_prof",{name:o.name,phone:o.phone});if($("mktChk")){const ns=LS("dk_ns",{});const mk=$("mktChk").checked;if(!!ns.mkt!==mk){ns.mkt=mk;ns.log=(ns.log||[]).concat([{v:mk,t:Date.now(),via:"طلب #"+o.no}]).slice(-20);LSset("dk_ns",ns);LSset("dk_mkt",mk)}}
 if(o.addr){const A=LS("dk_addrs",[]);if(!A.includes(o.addr)){A.unshift(o.addr);LSset("dk_addrs",A.slice(0,6))}}
 curNo=null;return o}
function pg(html){if(typeof curOrderK!=="undefined")curOrderK=-1;const p=$("pg");if(!p)return;$("pgBody").innerHTML=html;p.style.display="flex";$("pgBody").scrollTop=0;const s=$("sheet");if(s)s.classList.remove("open")}
function pgClose(){const p=$("pg");if(p)p.style.display="none"}
let OST={};
const ST_D=["تم استلام الطلب","جاري التجهيز 📦","جاهز","خرج للتوصيل 🛵","وصل السائق 📍","تم التوصيل ✅"];
const ST_P=["تم استلام الطلب","جاري التجهيز 📦","جاهز للاستلام","تم الاستلام ✅"];
function isPick(o){return String(o.ship||"").startsWith("استلام")}
function stOf(o){const s=OST[o.no];return s?+s.st:0}
function stIdx(o){const s=stOf(o);return isPick(o)?({0:0,1:1,2:2,3:2,4:2,5:3})[s]:s}
function stTxt(o){const s=stOf(o);if(s<0)return "❌ ملغي";return (isPick(o)?ST_P:ST_D)[stIdx(o)]}
function tsTxt(t){return new Date(t).toLocaleString("ar",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}
function qTxt(q){return typeof q==="string"?q:"× "+q}
function timeline(o){const s=stOf(o),S=OST[o.no]||{};const L=isPick(o)?ST_P:ST_D,k=stIdx(o);
 if(s<0)return `<div class="tln bad">❌ الطلب ملغي${S.note?" — "+esc(S.note):""}</div>`;
 const eta=S.eta||o.eta;
 return `<div class="tl t${L.length}">${L.map((t,j)=>`<div class="tls${j<=k?" done":""}${j===k?" now":""}"><i>${j<k||j===L.length-1&&j===k?"✓":j===k?"●":j+1}</i><span>${t}</span></div>`).join("")}</div>`
 +(eta&&k<L.length-1?`<div class="eta2">⏱️ الوقت المتوقع: <b>${esc(eta).replace(/(\d\d:\d\d–\d\d:\d\d)/,'<bdi dir="ltr">$1</bdi>')}</b>${S.eta?" <em>محدّث</em>":""}</div>`:"")
 +(S.note?`<div class="tln warn">📝 من الدكانة: ${esc(S.note)}</div>`:"")
 +`<div class="tln">${S.t?"🔄 آخر تحديث: "+tsTxt(S.t)+"<br>":""}الحالة بتتحدّث لايف هون، وبتوصلك كمان على واتساب.</div>`}
function itemsHtml(o){const L=o.lines||Object.entries(o.items||{}).map(([n,q])=>({n,q}));
 return `<div class="rlist">${L.map(l=>`<div class="rl"><span>${esc(l.n.split(" (")[0])} <em>${esc(qTxt(l.q))}</em></span>${l.c!==undefined?`<b>${fmt(l.c)}</b>`:""}</div>`).join("")}</div>`}
function canCancel(o){return !o.cancel&&stOf(o)===0&&Date.now()-o.ts<15*60e3}
function showConfirm(o){pg(`<div class="okbig">✅</div><h3 class="pgt c">تم إرسال طلبك بنجاح!</h3><p class="pgs c">رح توصلك رسالة تأكيد من الدكانة على واتساب. إذا ما انبعتت الرسالة، دوس "ابعت مرة ثانية".</p>
 <div class="kv"><div><span>رقم الطلب</span><b><bdi dir="ltr">#${o.no}</bdi></b></div><div><span>المجموع</span><b>${fmt(o.total)}${o.delUnknown?" + توصيل":""}</b></div><div><span>الاستلام</span><b>${esc(o.ship)}</b></div>${o.addr?`<div><span>العنوان</span><b>${esc(o.addr)}</b></div>`:""}<div><span>الدفع</span><b>${esc(o.pay)}</b></div>${o.eta?`<div><span>الموعد المتوقع</span><b>${esc(o.eta).replace(/(\d\d:\d\d–\d\d:\d\d)/,'<bdi dir="ltr">$1</bdi>')}</b></div>`:""}</div>
 <div class="shead">🧺 المنتجات</div>${itemsHtml(o)}
 <div class="pgbtns"><button type="button" class="pbtn g" data-go="order" data-k="0">📍 تتبع الطلب</button><a class="pbtn" href="${waLink("مرحبا، بخصوص طلبي رقم #"+o.no)}" target="_blank" rel="noopener">💬 تواصل مع الدكانة</a><a class="pbtn" href="${waLink(o.msg)}" target="_blank" rel="noopener">🔁 ابعت الطلب مرة ثانية</a><button type="button" class="pbtn" data-go="close">🏠 رجوع للمتجر</button></div>`)}
let curOrderK=-1;function pageOrder(k){setTimeout(()=>{curOrderK=k},0);const o=LS("dk_orders",[])[k];if(!o)return pageOrders();const s=stOf(o);
 pg(`<button type="button" class="pback" data-go="orders">→ طلباتي</button><h3 class="pgt">طلب <bdi dir="ltr">#${o.no}</bdi></h3><p class="pgs">${tsTxt(o.ts)} • <b class="stb${s<0?" bad":s>=5?" ok":""}">${stTxt(o)}</b></p>
 ${timeline(o)}
 <div class="kv"><div><span>المبلغ</span><b>${fmt(o.total)}${o.delUnknown?" + توصيل":""}</b></div><div><span>الاستلام</span><b>${esc(o.ship)}</b></div>${o.addr?`<div><span>عنوان التوصيل</span><b>${esc(o.addr)}</b></div>`:""}<div><span>الدفع</span><b>${esc(o.pay||"")}</b></div></div>
 <div class="shead">🧺 المنتجات</div>${itemsHtml(o)}
 ${o.cancel?`<div class="tln warn">⏳ بعتت طلب إلغاء — الدكانة رح تأكدلك على واتساب.</div>`:""}
 <div class="pgbtns">${s>=5||Date.now()-o.ts>60*60e3?`<button type="button" class="pbtn rate" data-go="rate" data-k="${k}">${o.rated?"⭐".repeat(o.rated)+" قيّمت الطلب — قيّم مرة ثانية":"⭐ قيّم الطلب والتوصيل والمنتجات"}</button>`:""}<button type="button" class="pbtn g" data-re="${k}">🔁 اطلب نفس الطلب مرة ثانية</button><button type="button" class="pbtn" data-go="inv" data-k="${k}">🧾 الفاتورة</button><a class="pbtn" href="${waLink("مرحبا، بخصوص طلبي رقم #"+o.no+": ")}" target="_blank" rel="noopener">💬 تواصل بخصوص الطلب</a>${canCancel(o)?`<button type="button" class="pbtn danger" data-go="cancel" data-k="${k}">❌ إلغاء الطلب</button>`:""}<button type="button" class="pbtn warn" data-go="issue" data-k="${k}">⚠️ الإبلاغ عن مشكلة</button></div>
 ${!canCancel(o)&&!o.cancel&&s>=0&&s<5?`<p class="pgs c" style="margin-top:8px">الإلغاء متاح أول 15 دقيقة وقبل ما يبلش التجهيز. بعدها احكي معنا على واتساب.</p>`:""}`)}
function pageInvoice(k){const o=LS("dk_orders",[])[k];if(!o)return;const S=o.sums||{};
 pg(`<button type="button" class="pback" data-go="order" data-k="${k}">→ رجوع للطلب</button><div class="inv"><div class="invh"><b>🧺 ${SHOP_NAME}</b><span>فاتورة / ملخص طلب</span></div>
 <div class="invm"><div>رقم الطلب: <b><bdi dir="ltr">#${o.no}</bdi></b></div><div>التاريخ: ${tsTxt(o.ts)}</div>${o.name?`<div>الاسم: ${esc(o.name)}</div>`:""}${o.phone?`<div>الهاتف: <bdi dir="ltr">${esc(o.phone)}</bdi></div>`:""}${o.addr?`<div>العنوان: ${esc(o.addr)}</div>`:""}</div>
 ${o.lines?`<table class="invt"><tr><th>المنتج</th><th>الكمية</th><th>السعر</th></tr>${o.lines.map(l=>`<tr><td>${esc(l.n.split(" (")[0])}</td><td>${esc(String(l.q))}</td><td>${fmt(l.c)}</td></tr>`).join("")}</table>
 <div class="invs">${S.sub!==undefined?`<div><span>المجموع</span><span>${fmt(S.sub)}</span></div>`:""}${S.disc>0.001?`<div><span>الخصم</span><span>− ${fmt(S.disc)}</span></div>`:""}${S.cp>0.001?`<div><span>كوبون ${esc(o.coupon||"")}</span><span>− ${fmt(S.cp)}</span></div>`:""}<div><span>التوصيل</span><span>${isPick(o)?"بدون":S.del===null||S.del===undefined?"بيتحدد":S.del===0?"مجاني":fmt(S.del)}</span></div><div class="g"><span>الإجمالي</span><span>${fmt(o.total)}${o.delUnknown?" + توصيل":""}</span></div></div>`:`<pre class="invpre">${esc(o.msg||"")}</pre>`}
 <div class="invm"><div>الدفع: ${esc(o.pay||"")}</div><div>الاستلام: ${esc(o.ship||"")}</div></div><p class="u c">هاد ملخص الطلب كما انبعت. المبلغ النهائي ممكن يتغير إذا انستبدل أو انحذف منتج.</p></div>
 <div class="pgbtns"><button type="button" class="pbtn g" onclick="window.print()">🖨️ اطبع / احفظ PDF</button></div>`)}
let RT={k:-1,o:0,d:0,it:{}};
const ISSUES=[["missing","📭 منتج ناقص"],["wrong","🔀 منتج خاطئ"],["damaged","💔 منتج تالف"],["pay","💳 مشكلة بالدفع"],["deliv","🚚 مشكلة بالتوصيل"],["other","❓ إشي ثاني"]];
function starsH(key,v){return `<div class="rstars">${[1,2,3,4,5].map(n=>`<button type="button" data-rs="${key}" data-v="${n}" class="${n<=v?"on":""}">★</button>`).join("")}</div>`}
function pageRate(k){const o=LS("dk_orders",[])[k];if(!o)return;if(RT.k!==k)RT={k,o:0,d:0,it:{}};const names=Object.keys(o.items||{});
 pg(`<button type="button" class="pback" data-go="order" data-k="${k}">→ رجوع للطلب</button><h3 class="pgt">⭐ قيّم طلبك</h3><p class="pgs">رأيك بيساعدنا نتحسن. التقييم بينبعت للدكانة على واتساب.</p>
 <div class="rbox"><b>كيف كان الطلب بشكل عام؟</b>${starsH("o",RT.o)}</div>
 ${isPick(o)?"":`<div class="rbox"><b>كيف كان التوصيل؟ (السرعة والتعامل)</b>${starsH("d",RT.d)}</div>`}
 <div class="rbox"><b>قيّم المنتجات (اختياري)</b>${names.map((n,j)=>`<div class="rprod"><span>${esc(n.split(" (")[0])}</span>${starsH("i"+j,RT.it[j]||0)}</div>`).join("")}</div>
 <textarea id="rCom" class="rcom" rows="3" placeholder="✍️ اكتب تعليق (اختياري)"></textarea>
 <div class="pgbtns"><button type="button" class="pbtn g" data-go="rsend" data-k="${k}">📤 ابعت التقييم</button><button type="button" class="pbtn warn" data-go="issue" data-k="${k}">⚠️ في مشكلة بالطلب؟</button></div>`)}
function sendRate(k){const o=LS("dk_orders",[])[k];if(!o)return;if(!RT.o){alert("اختار عدد النجوم للطلب أول ⭐");return}const names=Object.keys(o.items||{});
 const pr=Object.entries(RT.it).filter(([j,v])=>v).map(([j,v])=>`• ${names[j].split(" (")[0]}: ${"⭐".repeat(v)}`);const c=($("rCom")&&$("rCom").value.trim())||"";
 const msg=`تقييم طلب #${o.no}\nالطلب: ${"⭐".repeat(RT.o)}${RT.d?`\nالتوصيل: ${"⭐".repeat(RT.d)}`:""}${pr.length?"\nالمنتجات:\n"+pr.join("\n"):""}${c?"\nتعليق: "+c:""}`;
 window.open(waLink(msg),"_blank");const L=LS("dk_orders",[]);L[k].rated=RT.o;LSset("dk_orders",L);
 pg(`<div class="okbig">🙏</div><h3 class="pgt c">شكرًا على تقييمك!</h3><p class="pgs c">${"⭐".repeat(RT.o)}</p><div class="pgbtns"><button type="button" class="pbtn" data-go="order" data-k="${k}">→ رجوع للطلب</button></div>`)}
let IS={k:-1,t:"",p:{}};
function pageIssue(k){const o=LS("dk_orders",[])[k];if(!o)return;if(IS.k!==k)IS={k,t:"",p:{}};const names=Object.keys(o.items||{});const needP=["missing","wrong","damaged"].includes(IS.t);
 pg(`<button type="button" class="pback" data-go="order" data-k="${k}">→ رجوع للطلب</button><h3 class="pgt">⚠️ الإبلاغ عن مشكلة</h3><p class="pgs">طلب <bdi dir="ltr">#${o.no}</bdi> — اختار نوع المشكلة ومنحلّها معك بأسرع وقت.</p>
 <div class="isg">${ISSUES.map(([k2,t])=>`<button type="button" data-is="${k2}" class="${IS.t===k2?"on":""}">${t}</button>`).join("")}</div>
 ${needP?`<div class="shead">أي منتج؟</div><div class="isp">${names.map((n,j)=>`<button type="button" data-ip="${j}" class="${IS.p[j]?"on":""}">${IS.p[j]?"☑":"☐"} ${esc(n.split(" (")[0])}</button>`).join("")}</div>`:""}
 <textarea id="iCom" class="rcom" rows="3" placeholder="📝 احكيلنا شو صار (وإذا في، صوّر المنتج وابعت الصورة على واتساب)"></textarea>
 <div class="pgbtns"><button type="button" class="pbtn g" data-go="isend" data-k="${k}">📤 ابعت البلاغ على واتساب</button><a class="pbtn" href="tel:${SHOP_PHONE}">📞 اتصل بالدكانة</a></div>`)}
function sendIssue(k){const o=LS("dk_orders",[])[k];if(!o)return;if(!IS.t){alert("اختار نوع المشكلة أول");return}const names=Object.keys(o.items||{});const ps=Object.keys(IS.p).filter(j=>IS.p[j]).map(j=>"• "+names[j].split(" (")[0]);const c=($("iCom")&&$("iCom").value.trim())||"";
 window.open(waLink(`⚠️ بلاغ عن مشكلة — طلب #${o.no}\nالنوع: ${ISSUES.find(x=>x[0]===IS.t)[1].replace(/^\S+\s/,"")}${ps.length?"\nالمنتجات:\n"+ps.join("\n"):""}${c?"\nالتفاصيل: "+c:""}`),"_blank");
 pg(`<div class="okbig">📨</div><h3 class="pgt c">وصلنا بلاغك</h3><p class="pgs c">رح نحكي معك على واتساب بأسرع وقت ونحلّها.</p><div class="pgbtns"><button type="button" class="pbtn" data-go="order" data-k="${k}">→ رجوع للطلب</button></div>`)}
function cancelOrder(k){const L=LS("dk_orders",[]);const o=L[k];if(!o||!canCancel(o))return pageOrder(k);askYes("أكيد بدك تلغي الطلب #"+o.no+"؟","أيوا، ألغيه","لا").then(ok=>{if(!ok)return;if(o.id)FB.requestCancel(o.id).catch(()=>{});window.open(waLink("مرحبا، بدي ألغي طلبي رقم #"+o.no+" لو سمحتوا."),"_blank");o.cancel=true;LSset("dk_orders",L);pageOrder(k)})}
function pageOrders(){const L=LS("dk_orders",[]);
 pg(`<h3 class="pgt">📦 طلباتي</h3>`+(L.length?`<button type="button" class="pbtn" data-go="past" style="margin-bottom:10px">🔁 مشترياتي السابقة</button>`+L.map((o,k)=>{const s=stOf(o);return `<div class="ocard"><div class="oh"><b><bdi dir="ltr">#${o.no}</bdi></b><span>${tsTxt(o.ts)}</span></div>
 <div class="oi"><b class="stb${s<0?" bad":s>=5?" ok":""}">${stTxt(o)}</b> • ${Object.keys(o.items).length} أغراض • <b>${fmt(o.total)}${o.delUnknown?" + توصيل":""}</b></div>
 <div class="oitems">${Object.entries(o.items).map(([n,v])=>esc(n.split(" (")[0])+" "+esc(qTxt(v))).join("، ")}</div>${o.addr?`<div class="oitems">📍 ${esc(o.addr)}</div>`:""}
 <div class="obtns"><button type="button" class="pbtn g" data-go="order" data-k="${k}">📍 التفاصيل والتتبع</button><button type="button" class="pbtn" data-re="${k}">🔁 اطلبه مرة ثانية</button></div></div>`}).join(""):`<div class="cempty"><div>📦</div><b>لسا ما في طلبات</b><span>أول طلب بتبعته بيطلع هون، وبتقدر تعيده بكبسة.</span></div>`))}
function pastItems(){const M={};LS("dk_orders",[]).forEach(o=>Object.entries(o.items||{}).forEach(([n,q])=>{const k=PRODUCTS.findIndex(p=>p.n===n);if(k<0)return;if(!M[n])M[n]={k,n,times:0,last:o.ts,q};M[n].times++}));return Object.values(M).sort((a,b)=>b.last-a.last)}
let pgRe=null;
function pgRefresh(){if(!pgRe||$("pg").style.display!=="flex")return;const b=$("pgBody"),bx=b.closest(".cpbox"),s1=b.scrollTop,s2=bx?bx.scrollTop:0;const f=pgRe;f();pgRe=f;b.scrollTop=s1;if(bx)bx.scrollTop=s2}
function pagePast(){const P=pastItems();const rep=P.filter(x=>x.times>1);
 pg(`<h3 class="pgt">🔁 مشترياتي السابقة</h3><p class="pgs">كل إشي اشتريته قبل، آخر إشي أول. اطلبه مرة ثانية بكبسة.</p>`+(P.length?`<div class="pgbtns" style="margin:0 0 10px"><button type="button" class="pbtn g" data-re="0">🛒 ضيف كل أغراض آخر طلب للسلة</button>${rep.length?`<button type="button" class="pbtn" data-go="pastrep">⭐ ضيف الأغراض اللي بتشتريها دايمًا (${rep.length})</button>`:""}</div><div class="pgcards">${P.map(x=>cardHtml(PRODUCTS[x.k],x.k).replace('<div class="bd">',`<div class="bd"><span class="pastb">اشتريتها ${x.times>1?x.times+" مرات":"مرة"} • آخر مرة ${new Date(x.last).toLocaleDateString("ar",{day:"numeric",month:"short"})}</span>`)).join("")}</div>`:`<div class="cempty"><div>🔁</div><b>لسا ما اشتريت إشي</b><span>بعد أول طلب، أغراضك بتطلع هون.</span></div>`));pgRe=pagePast}
function pageOffers(){const A=PRODUCTS.map((p,i)=>({p,i})).filter(o=>!o.p.oos&&o.p.p>0);const sec=(t,L)=>L.length?`<div class="shead">${t}</div><div class="pgcards">${L.map(({p,i})=>cardHtml(p,i)).join("")}</div>`:"";
 const pub=Object.entries(COUPONS).filter(([c,v])=>v.show);
 const fd=DELIVERY_FEE&&FREE_DELIVERY_OVER!==null?`<div class="ofban">🚚 <b>توصيل مجاني</b> لكل طلب فوق ${fmt(FREE_DELIVERY_OVER)}</div>`:"";
 const cp=pub.length?`<div class="shead">🎟️ كوبونات</div>${pub.map(([c,v])=>`<div class="cprow"><div><b dir="ltr">${esc(c)}</b><span>${v.pct?v.pct+"% خصم":fmt(v.amt)+" خصم"}${v.min?" • فوق "+fmt(v.min):""}${v.desc?" • "+esc(v.desc):""}</span></div><button type="button" data-go="applyc" data-c="${esc(c)}">استعمله</button></div>`).join("")}`:"";
 const body=fd+cp+sec("🔥 عروض اليوم",A.filter(o=>o.p.s&&!o.p.wk))+sec("📅 عروض الأسبوع",A.filter(o=>o.p.wk))+sec("🎁 اشتري أكثر ووفّر",A.filter(o=>o.p.bq>1&&o.p.bp>0));
 pg(`<h3 class="pgt">🎁 العروض والكوبونات</h3>`+(body||`<div class="cempty"><div>🎁</div><b>ما في عروض هلأ</b><span>ارجع بعدين، أو فعّل إشعارات العروض من «الإشعارات».</span></div>`));pgRe=pageOffers}
// ===== الإشعارات (داخل الموقع) =====
function addNote(t){const N=LS("dk_notes",[]);N.unshift({t,ts:Date.now(),u:1});LSset("dk_notes",N.slice(0,40));updNoteCnt()}
function updNoteCnt(){const b=document.querySelector('.tbtns [aria-label="حسابي"]');if(!b)return;let i=b.querySelector(".ncnt");if(!i){i=document.createElement("i");i.className="ncnt";b.appendChild(i)}const n=LS("dk_notes",[]).filter(x=>x.u).length;i.textContent=n||"";i.style.display=n?"":"none"}
function toast(h,fn){const t=document.createElement("div");t.className="toast";t.innerHTML=h;t.onclick=()=>{t.remove();fn&&fn()};document.body.appendChild(t);setTimeout(()=>t.remove(),9000)}
function checkOrders(){const L=LS("dk_orders",[]),seen=LS("dk_seen",{}),ns=LS("dk_ns",{});let first=null;
 L.forEach(o=>{const S=OST[o.no];if(!S)return;const sig=S.st+"|"+(S.eta||"")+"|"+(S.note||"");if(seen[o.no]===sig)return;seen[o.no]=sig;
  const msg=`📦 طلبك <bdi dir="ltr">#${o.no}</bdi>: <b>${stTxt(o)}</b>${S.eta&&S.st<5&&S.st>=0?" • ⏱️ "+esc(S.eta):""}${S.note?"<br>📝 "+esc(S.note):""}`;if(!ns.off_order||(S.note&&!ns.off_stock)){addNote(msg);if(!first)first=msg}});
 LSset("dk_seen",seen);if(first)toast("🔔 "+first,()=>pageOrders())}
function checkOffers(){const cur=PRODUCTS.filter(p=>(p.s||p.wk)&&!p.oos).map(p=>p.n).concat(Object.entries(COUPONS).filter(([c,v])=>v.show).map(([c])=>"🎟️"+c));
 const seen=LS("dk_seenOff",null);LSset("dk_seenOff",cur);if(!seen||!LS("dk_mkt",false))return;const nw=cur.filter(x=>!seen.includes(x));if(!nw.length)return;
 const t="🎁 عروض جديدة: "+nw.slice(0,3).map(x=>esc(x.startsWith("🎟️")?"كوبون "+x.slice(3):x.split(" (")[0])).join("، ")+(nw.length>3?" وغيرها":"");addNote(t);toast(t,()=>pageOffers())}
const CH={wa:"💬 واتساب",sms:"📩 SMS",site:"🔔 إشعارات الموقع",mail:"📧 البريد الإلكتروني"};
const NT=[["order","📦 تحديثات الطلب (استلام، تجهيز، خرج للتوصيل، تم التوصيل)"],["stock","⚠️ منتج غير متوفر أو تم استبداله"],["back","🔔 رجوع منتج للمخزون"],["mkt","🎁 العروض والخصومات والكوبونات والمنتجات الجديدة"]];
function pageNSet(){const ns=LS("dk_ns",{}),P=LS("dk_prof",{});const on=k=>k==="mkt"?!!ns.mkt:ns["off_"+k]?false:true;
 pg(`<button type="button" class="pback" data-go="notes">→ الإشعارات</button><h3 class="pgt">⚙️ إعدادات الإشعارات</h3>
 <div class="pcard"><b class="pch">شو بدك يوصلك؟</b>${NT.map(([k,t])=>`<label class="tgl"><span>${t}</span><input type="checkbox" data-nt="${k}" ${on(k)?"checked":""}><i></i></label>`).join("")}${ns.log&&ns.log.length?`<small class="u">آخر تغيير لموافقة العروض: ${ns.log[ns.log.length-1].v?"موافق":"مش موافق"} • ${tsTxt(ns.log[ns.log.length-1].t)}</small>`:""}</div>
 <div class="pcard"><b class="pch">طريقة التواصل المفضّلة</b><div class="chs">${Object.entries(CH).map(([k,t])=>`<button type="button" data-ch="${k}" class="${(ns.ch||"wa")===k?"on":""}" ${k==="sms"||k==="mail"?"disabled":""}>${t}${k==="sms"||k==="mail"?" <small>قريبًا</small>":""}</button>`).join("")}</div></div>
 <div class="pcard"><b class="pch">رقم الهاتف</b><label>الرقم اللي بتوصله الرسائل<input id="nsPhone" value="${esc(normPhone(P.phone||""))}" inputmode="tel" placeholder="05XXXXXXXX"></label></div>
 <div class="pgbtns"><button type="button" class="pbtn g" data-go="nssave">💾 احفظ وبلّغ الدكانة</button></div><span id="nsErr" class="pok"></span>
 <p class="pgs c" style="margin-top:8px">التغييرات بتوصل للدكانة برسالة واتساب عشان يلتزموا فيها. إشعارات الموقع بتطلع لما تفتح الموقع.</p>`)}
function saveNSet(){const ns=LS("dk_ns",{}),P=LS("dk_prof",{});const ph=normPhone($("nsPhone").value.trim());if(ph&&!phoneOk(ph)){$("nsErr").style.color="#c0392b";$("nsErr").textContent="رقم الهاتف مش صحيح. اكتبه هيك: 05XXXXXXXX";return}
 const before=JSON.stringify([!!ns.mkt,ns.ch||"wa",P.phone||"",NT.map(([k])=>ns["off_"+k]||0)]);
 document.querySelectorAll("[data-nt]").forEach(x=>{const k=x.dataset.nt;if(k==="mkt"){if(!!ns.mkt!==x.checked){ns.mkt=x.checked;ns.log=(ns.log||[]).concat([{v:x.checked,t:Date.now(),via:"الإعدادات"}]).slice(-20)}}else ns["off_"+k]=x.checked?0:1});
 const sel=document.querySelector("[data-ch].on");ns.ch=sel?sel.dataset.ch:"wa";LSset("dk_ns",ns);LSset("dk_mkt",!!ns.mkt);const old=P.phone||"";P.phone=ph;LSset("dk_prof",P);
 const after=JSON.stringify([!!ns.mkt,ns.ch,ph,NT.map(([k])=>ns["off_"+k]||0)]);
 if(before!==after){const off=NT.filter(([k])=>k!=="mkt"&&ns["off_"+k]).map(([k,t])=>t.replace(/\s*\(.*\)/,"").replace(/^\S+\s/,""));
  window.open(waLink(`⚙️ تحديث إعدادات الرسائل\n${P.name?"الاسم: "+P.name+"\n":""}الرقم: ${ph||"-"}${old&&old!==ph?" (بدل "+old+")":""}\nرسائل العروض: ${ns.mkt?"موافق ✅":"إلغاء الاشتراك 🚫"} (${new Date().toLocaleDateString("en-GB")})\nطريقة التواصل: ${CH[ns.ch].replace(/^\S+\s/,"")}${off.length?"\nما بدي: "+off.join("، "):""}`),"_blank")}
 $("nsErr").style.color="var(--g)";$("nsErr").textContent="✓ انحفظ"}
function pageNotes(){const N=LS("dk_notes",[]);const mk=LS("dk_mkt",false);
 pg(`<h3 class="pgt">🔔 الإشعارات</h3><p class="pgs">حالة طلباتك، منتجات رجعت للمخزون، وعروض جديدة — بتطلع هون لما تفتح الموقع، والتحديثات المهمة بتوصلك كمان على واتساب.</p>
 <button type="button" class="pbtn" data-go="nset" style="margin-bottom:10px">⚙️ إعدادات الإشعارات والرسائل</button>
 ${N.length?N.map(x=>`<div class="nrow${x.u?" un":""}"><div>${x.t}</div><span>${tsTxt(x.ts)}</span></div>`).join(""):`<div class="cempty"><div>🔔</div><b>ما في إشعارات</b><span>لما تتغير حالة طلبك أو يرجع منتج بتستناه، بيطلع هون.</span></div>`}`);
 LSset("dk_notes",N.map(x=>({...x,u:0})));updNoteCnt()}
function reorder(k){const o=LS("dk_orders",[])[k];if(!o)return;let add=0,miss=[];for(const [n,v] of Object.entries(o.items)){const i=PRODUCTS.findIndex(p=>p.n===n);if(i>=0&&PRODUCTS[i].p>0&&!PRODUCTS[i].oos){cart[i]=v;add++}else miss.push(n)}
 upd();pgClose();drawList();$("sheet").classList.add("open");prefill();if(miss.length)$("err").textContent="ما قدرنا نضيف: "+miss.join("، ")+" (مش متوفر هلأ)"}
function pageOrders(){const L=LS("dk_orders",[]);
 pg(`<h3 class="pgt">📦 طلباتي</h3>`+(L.length?L.map((o,k)=>`<div class="ocard"><div class="oh"><b><bdi dir="ltr">#${o.no}</bdi></b><span>${new Date(o.ts).toLocaleDateString("ar",{day:"numeric",month:"short"})} • ${new Date(o.ts).toLocaleTimeString("ar",{hour:"2-digit",minute:"2-digit"})}</span></div>
 <div class="oi">${Object.keys(o.items).length} أغراض • <b>${fmt(o.total)}${o.delUnknown?" + توصيل":""}</b> • ${esc(o.ship)}</div>
 <div class="oitems">${Object.entries(o.items).map(([n,v])=>esc(n.split(" (")[0])+(typeof v==="string"?" "+v:" ×"+v)).join("، ")}</div>${timeline(o)}
 <div class="pgbtns"><button type="button" class="pbtn g" data-re="${k}">🔁 اطلب نفس الطلب مرة ثانية</button><a class="pbtn" href="${waLink("مرحبا، بدي أسأل عن طلبي رقم #"+o.no)}" target="_blank" rel="noopener">💬 اسأل عن الطلب</a></div></div>`).join(""):`<div class="cempty"><div>📦</div><b>لسا ما في طلبات</b><span>أول طلب بتبعته بيطلع هون، وبتقدر تعيده بكبسة.</span></div>`))}
function pageAccount(){const P=LS("dk_prof",{}),A=LS("dk_addrs",[]),n=LS("dk_orders",[]).length;
 pg(`<h3 class="pgt">👤 حسابي</h3><p class="pgs">🙋 بتطلب كضيف — ما في داعي تفتح حساب. اسمك وعناوينك وطلباتك محفوظين على هالتلفون بس.</p>
 <div class="pcard"><label>الاسم<input id="pfName" value="${esc(P.name||"")}" placeholder="اسمك" autocomplete="name"></label><label>رقم الهاتف<input id="pfPhone" value="${esc(P.phone||"")}" placeholder="05X-XXXXXXX" inputmode="tel" autocomplete="tel"></label><button type="button" class="pbtn g" data-go="saveprof">💾 احفظ البيانات</button><span id="pfOk" class="pok"></span></div>
 <div class="pcard"><b class="pch">📍 العناوين المحفوظة</b>${A.length?A.map((a,k)=>`<div class="arow2"><span>${esc(a)}</span><button type="button" data-da="${k}" aria-label="احذف">🗑</button></div>`).join(""):`<span class="u">لسا ما في عناوين.</span>`}<div class="aadd"><input id="newAddr" placeholder="ضيف عنوان جديد (المنطقة، الشارع، البناية)"><button type="button" class="pbtn g" data-go="addaddr">+</button></div></div>
 <div class="plinks"><button type="button" data-go="nset">⚙️ إعدادات الإشعارات والرسائل</button><button type="button" data-go="notes">🔔 الإشعارات <em>${LS("dk_notes",[]).filter(x=>x.u).length||""}</em></button><button type="button" data-go="orders">📦 طلباتي <em>${n}</em></button><button type="button" data-go="past">🔁 مشترياتي السابقة</button><button type="button" data-go="offers">🎁 العروض والكوبونات</button><button type="button" data-go="favs">❤️ المفضلة <em>${favs.size}</em></button><button type="button" data-go="contact">☎️ تواصل معنا</button><button type="button" data-go="info">ℹ️ معلومات وسياسات</button><button type="button" data-go="install">📲 ثبّت التطبيق على تلفونك</button><button type="button" data-go="ownerlogin">🔑 دخول صاحب الدكانة</button><button type="button" class="danger" data-go="wipe">🚪 تسجيل الخروج ومسح بياناتي من هالتلفون</button></div>`)}
const FAQ=[
 ["كيف بطلب؟","اختار الأغراض وضيفها للسلة، عبّي اسمك ورقمك وعنوانك، ودوس «ابعت الطلب على واتساب». الطلب بيوصلنا جاهز ومنأكدلك."],
 ["لازم أفتح حساب؟","لا. بتطلب كضيف. اسمك وعناوينك بينحفظوا على تلفونك بس عشان المرة الجاية تكون أسرع."],
 ["قديش التوصيل ولوين بتوصلوا؟",()=>DELIVERY_FEE===null?"سعر التوصيل بيتحدد حسب المنطقة، ومنحكيلك إياه على واتساب قبل ما نطلع.":"التوصيل "+(DELIVERY_FEE?fmt(DELIVERY_FEE):"مجاني")+(FREE_DELIVERY_OVER!==null&&DELIVERY_FEE?"، ومجاني للطلبات فوق "+fmt(FREE_DELIVERY_OVER):"")+". لأي منطقة اسألنا على واتساب."],
 ["إمتى بيوصل الطلب؟",()=>"بتختار «بأسرع وقت» ("+DELIVERY_ETA+") أو موعد معين. ولو بدك تستلم من الدكانة: "+PICKUP_ETA+"."],
 ["كيف بدفع؟","نقدًا أو ببطاقة عند الاستلام — للموصّل أو بالدكانة."],
 ["شو بصير إذا منتج خلص؟","بتختار مسبقًا: نستبدله بأقرب منتج مشابه، نتصل فيك أول، أو نحذفه. وبتقدر تختار لكل منتج لحال من السلة."],
 ["بقدر أشتري خضار بمبلغ معين؟","أيوا، دوس «₪ بمبلغ محدد» تحت المنتج واكتب المبلغ (مثلًا بندورة بـ 10 ₪)."],
 ["كيف بتابع طلبي أو بلغيه؟","من «حسابي ← طلباتي». الإلغاء متاح أول 15 دقيقة وقبل ما يبلش التجهيز، وبعدها احكي معنا على واتساب."],
 ["وصلني منتج ناقص أو تالف، شو بعمل؟","من «طلباتي» افتح الطلب ودوس «الإبلاغ عن مشكلة»، أو صوّر المنتج وابعته على واتساب ومنحلّها."]
];
let cfTopic="سؤال عام";
function pageContact(){const L=LS("dk_orders",[]),P=LS("dk_prof",{});const act=L.map((o,k)=>({o,k})).filter(x=>{const s=stOf(x.o);return s>=0&&s<5&&Date.now()-x.o.ts<3*864e5}).slice(0,3);
 pg(`<h3 class="pgt">☎️ التواصل والمساعدة</h3>
 <div class="cgrid"><a href="${waLink("مرحبا 👋")}" target="_blank" rel="noopener"><span>💬</span>واتساب</a><a href="tel:${SHOP_PHONE}"><span>📞</span>اتصال<small><bdi dir="ltr">${SHOP_PHONE}</bdi></small></a></div>
 ${act.length?`<div class="shead">🆘 مساعدة بطلب حالي</div>${act.map(({o,k})=>`<div class="hord"><div><b><bdi dir="ltr">#${o.no}</bdi></b><span>${stTxt(o)} • ${fmt(o.total)}</span></div><div class="hbtns"><button type="button" data-go="order" data-k="${k}">📍 تتبع</button><button type="button" data-go="issue" data-k="${k}">⚠️ مشكلة</button><a href="${waLink("مرحبا، بخصوص طلبي رقم #"+o.no+": ")}" target="_blank" rel="noopener">💬 اسأل</a></div></div>`).join("")}`:""}
 <div class="plinks"><div class="pinfo">🕒 ساعات العمل: <b>${SHOP_HOURS?esc(SHOP_HOURS):"بنحدّثها قريبًا"}</b></div>
 <div class="pinfo">📍 الموقع: <b>${SHOP_LOCATION?esc(SHOP_LOCATION):"بنحدّثه قريبًا"}</b></div>${SHOP_MAPS?`<a href="${SHOP_MAPS}" target="_blank" rel="noopener">🗺️ افتح بالخريطة</a>`:""}</div>
 <div class="shead">✉️ نموذج تواصل</div>
 <div class="pcard cform"><div class="ctop">${["سؤال عام","طلب منتج مش موجود","اقتراح","شكوى","تعاون أو جملة"].map(t=>`<button type="button" data-ct="${t}" class="${t===cfTopic?"on":""}">${t}</button>`).join("")}</div>
 <input id="cfName" placeholder="الاسم" value="${esc(P.name||"")}" autocomplete="name"><input id="cfPhone" placeholder="رقم الهاتف" inputmode="tel" value="${esc(P.phone||"")}" autocomplete="tel">
 <textarea id="cfMsg" rows="4" placeholder="اكتب رسالتك هون…"></textarea><button type="button" class="pbtn g" data-go="cfsend">📤 ابعت الرسالة</button><span id="cfErr" class="pok" style="color:#c0392b"></span></div>
 <div class="shead">❓ الأسئلة الشائعة</div>${FAQ.map(([q,a2])=>`<details class="inf"><summary>${q}</summary><p>${esc(typeof a2==="function"?a2():a2)}</p></details>`).join("")}
 <div class="plinks" style="margin-top:10px"><button type="button" data-go="info">ℹ️ معلومات وسياسات</button></div>`)}
function sendContact(){const n=$("cfName").value.trim(),ph=$("cfPhone").value.trim(),m=$("cfMsg").value.trim();if(!m){$("cfErr").textContent="اكتب رسالتك أول.";return}
 window.open(waLink(`📩 رسالة من الموقع — ${cfTopic}\n${n?"الاسم: "+n+"\n":""}${ph?"الهاتف: "+ph+"\n":""}\n${m}`),"_blank");
 pg(`<div class="okbig">📨</div><h3 class="pgt c">شكرًا! وصلتنا رسالتك</h3><p class="pgs c">منرد عليك على واتساب بأسرع وقت.</p><div class="pgbtns"><button type="button" class="pbtn" data-go="close">🏠 رجوع للمتجر</button></div>`)}
function pageInfo(){pg(`<h3 class="pgt">ℹ️ معلومات</h3>`+INFO.map(([t,x],k)=>`<details class="inf"${k===0?" open":""}><summary>${t}</summary><p>${esc(typeof x==="function"?x():x)}</p></details>`).join("")+`<div class="plinks" style="margin-top:10px"><button type="button" data-go="contact">☎️ تواصل معنا</button></div>`)}
window.pageAccount=pageAccount;window.pageContact=pageContact;window.pageOrders=pageOrders;window.pageInfo=pageInfo;
function prefill(){const P=LS("dk_prof",{});if(!$("name").value&&P.name)$("name").value=P.name;if(!$("phone").value&&P.phone)$("phone").value=P.phone;
 const A=LS("dk_addrs",[]),ap=$("addrPick");if(ap){ap.innerHTML=(A.length&&shipMode!=="p")?`<div class="apick">${A.map((a,k)=>`<button type="button" data-pa="${k}">📍 ${esc(a)}</button>`).join("")}</div>`:"";}
 if(!$("addr").value&&A[0])$("addr").value=A[0];link()}

// ===== صفحة المنتج =====
const BRANDS=["أوسم","تنوفا","شتراوس","عيليت","يطفاتا","دانونه","نستله","يد مردخاي","شقحة","SHUKHA","أحلا","تسبار","لورباك","ألبرو","كيري","البقرة الضاحكة","لواكر","بريغات","جاكوبس","ويسوצקي","نسكافيه","إيدن","بيرفكتو","كرمبو","DCL","عيمك","غوش حلاف","بازوكا","دوريتوس","بمبا","بيسلي","أبروبو","تسيماح","سنوايت"];
function brandOf(p){if(p.br)return p.br;return BRANDS.find(b=>p.n.includes(b))||""}
function sizeOf(p){const m=p.n.match(/(\d+(?:[.,]\d+)?)\s*(غرام|غ|مل|لتر|كيلو|كغ)/);if(!m)return null;const v=parseFloat(m[1].replace(",","."));const u=m[2];
 if(u==="غرام"||u==="غ")return {txt:v+" غرام",base:v/1000,bu:"كيلو"};if(u==="مل")return {txt:v+" مل",base:v/1000,bu:"لتر"};if(u==="لتر")return {txt:v+" لتر",base:v,bu:"لتر"};return {txt:v+" كيلو",base:v,bu:"كيلو"}}
function baseName(n){return norm(n.split(" (")[0].replace(/[-–]/g," ").replace(/\d+(?:[.,]\d+)?\s*(غرام|غ|مل|لتر|كيلو|كغ|%)?/g," ")).replace(/\s+/g," ").trim()}
function variantsOf(i){const p=PRODUCTS[i],b=baseName(p.n).split(" ").slice(0,2).join(" ");if(b.length<3)return[];
 return PRODUCTS.map((q,k)=>({q,k})).filter(o=>o.q.c===p.c&&baseName(o.q.n).split(" ").slice(0,2).join(" ")===b).slice(0,8)}
function varLabel(q,p){const s=sizeOf(q);const a=q.n.split(" (")[0],bn=p.n.split(" (")[0];if(s&&sizeOf(p)&&s.txt!==sizeOf(p).txt)return s.txt;
 const wa=a.split(" "),wb=bn.split(" ");const diff=wa.filter(w=>!wb.includes(w)).join(" ");return diff||(s?s.txt:a)}
const PAIRS={"معكرونة ونودلز":["صلصات وكاتشب","أجبان"],"صلصات وكاتشب":["معكرونة ونودلز"],"قهوة وشاي":["حليب","بسكوت","لواكر","سكر"],"حليب":["قهوة وشاي","بسكوت"],"حمص":["خضار","سلطات جاهزة","طحينة"],"سلطات جاهزة":["حمص","خضار"],"شيبس":["مشروبات","بمبا"],"بمبا":["مشروبات","بيسلي"],"بيسلي":["مشروبات","بمبا"],"خضار":["ورقيات","زيوت","سلطات جاهزة"],"ورقيات":["خضار"],"فواكه":["لبن ويوغورت"],"أجبان":["خضار","لبن ويوغورت"],"رز":["زيوت","مرقة وشوربة","معلبات"],"مشروبات":["شيبس","بمبا","بيسلي"],"شوكولاتة":["مشروبات حليب","قهوة وشاي"],"لبن ويوغورت":["فواكه","عسل ومربى"],"عسل ومربى":["لبنة","زبدة"]};
function withIt(i){const p=PRODUCTS[i];const cs=PAIRS[p.c]||[];const all=PRODUCTS.map((q,k)=>({q,k})).filter(o=>o.k!=i&&o.q.p>0&&!o.q.oos);
 let L=all.filter(o=>cs.includes(o.q.c));try{JSON.parse(localStorage.getItem("dk_orders")||"[]").forEach(od=>{if(od.items&&od.items[p.n]!==undefined)Object.keys(od.items).forEach(n=>{const o=all.find(x=>x.q.n===n);if(o&&!L.includes(o))L.unshift(o)})})}catch(e){}
 return L.slice(0,10)}
function similarOf(i){const p=PRODUCTS[i],V=new Set(variantsOf(i).map(o=>o.k));return PRODUCTS.map((q,k)=>({q,k})).filter(o=>o.k!=i&&!V.has(o.k)&&o.q.c===p.c).sort((a,b)=>(b.q.p>0)-(a.q.p>0)).slice(0,10)}
let pdQty=1,pdIdx=-1;
function openProduct(i){pdIdx=i;pdQty=1;renderProduct()}
function renderProduct(){const i=pdIdx,p=PRODUCTS[i];if(!p)return;const imgs=[...(p.img?[p.img]:[]),...(Array.isArray(p.imgs)?p.imgs:[])];
 const sz=sizeOf(p),br=brandOf(p),pct=p.s&&p.op>p.p&&p.p>0?Math.round((1-p.p/p.op)*100):0;
 const per=(sz&&p.p>0&&p.u!=="كيلو"&&sz.base>0)?`<span class="pper">${fmt(p.p/sz.base)} لكل ${sz.bu}</span>`:"";
 const V=variantsOf(i);const inCart=cart[i];
 const gal=imgs.length?`<div class="pgal">${imgs.map(s=>`<img src="${s}" alt="">`).join("")}</div>${imgs.length>1?`<div class="pdots">${imgs.map(()=>"<i></i>").join("")}</div>`:""}`:`<div class="pgal emo">${p.e}</div>`;
 const st=p.oos?`<span class="av no">✕ غير متوفر حاليًا</span>`:p.p>0?`<span class="av">✓ متوفر</span>`:`<span class="u">السعر قريباً</span>`;
 const mini=L=>L.length?`<div class="rs">${L.map(o=>cardHtml(o.q,o.k)).join("")}</div>`:"";
 const watch=LS("dk_watch",[]).includes(p.n);
 let buy="";
 if(p.oos){buy=`<button type="button" class="pbtn${watch?"":" g"}" data-pd="notify">${watch?"✓ رح نبلغك لما يتوفر":"🔔 خبّرني لما يتوفر"}</button>`}
 else if(p.p>0){buy=`<div class="pqty"><button type="button" data-pd="m">−</button><b>${pdQty}</b><button type="button" data-pd="p">+</button></div><button type="button" class="pbtn g" data-pd="add">🧺 أضف للسلة • ${fmt(p.p*pdQty)}</button>${(p.u==="كيلو"||["خضار","فواكه"].includes(p.c))?`<button type="button" class="pbtn" data-pd="amt">₪ اشتري بمبلغ محدد</button>`:""}${inCart?`<div class="pinc">بالسلة: ${isAmt(inCart)?inCart:inCart+" "+p.u}</div>`:""}`}
 pg(`<div class="pdp">${gal}
 <div class="pdh"><h3>${esc(p.n)}</h3><button type="button" class="fav${favs.has(p.n)?" on":""}" data-pd="fav">${favs.has(p.n)?"♥":"♡"}</button></div>
 <div class="pmeta">${br?`<span>🏷️ ${esc(br)}</span>`:""}${sz?`<span>⚖️ ${sz.txt}</span>`:`<span>📦 لكل ${esc(p.u)}</span>`}<span>${esc(p.c)}</span></div>
 <div class="pprice">${p.p>0?`<b>${fmt(p.p)}</b>${pct?`<s>${fmt(p.op)}</s><em>خصم ${pct}%</em>`:""}`:""}${per}</div>${st}
 ${V.length>1?`<div class="shead">اختار الحجم / النوع</div><div class="pvars">${V.map(o=>`<button type="button" class="${o.k==i?"on":""}" data-pv="${o.k}">${esc(varLabel(o.q,p))}</button>`).join("")}</div>`:""}
 ${p.d?`<div class="pdesc">${esc(p.d)}</div>`:""}
 <div class="pbuy">${buy}</div>
 <div class="pact"><button type="button" data-pd="share">📤 شارك</button><button type="button" data-pd="rate">⭐ قيّم المنتج</button></div>
 ${withIt(i).length?`<div class="rh"><b>🛒 ممكن تحتاج معه</b></div>${mini(withIt(i))}`:""}
 ${similarOf(i).length?`<div class="rh"><b>🔄 منتجات مشابهة</b></div>${mini(similarOf(i))}`:""}</div>`)}
window.openProduct=openProduct;
function pdAction(a,b){const i=pdIdx,p=PRODUCTS[i];
 if(a==="m"){pdQty=Math.max(1,pdQty-1);return renderProduct()}
 if(a==="p"){pdQty++;return renderProduct()}
 if(a==="add"){cart[i]=(typeof cart[i]==="number"?cart[i]:0)+pdQty;upd();pdQty=1;renderProduct();const t=$("pgBody").querySelector(".pinc");if(t)t.classList.add("flash");return}
 if(a==="amt"){pgClose();openAmt(i);return}
 if(a==="fav"){toggleFav(i);return renderProduct()}
 if(a==="notify"){const W=LS("dk_watch",[]);if(!W.includes(p.n)){W.push(p.n);LSset("dk_watch",W);window.open(waLink("مرحبا، خبروني لما يتوفر: "+p.n),"_blank")}return renderProduct()}
 if(a==="share"){const txt=`شوف ${p.n}${p.p>0?" بـ "+fmt(p.p):""} بـ${SHOP_NAME} 🧺`;if(navigator.share){navigator.share({title:p.n,text:txt}).catch(()=>{})}else window.open("https://wa.me/?text="+encodeURIComponent(txt),"_blank");return}
 if(a==="rate"){$("pgBody").querySelector(".pact").innerHTML=`<div class="stars">${[1,2,3,4,5].map(n=>`<button type="button" data-rt="${n}">☆</button>`).join("")}</div><div class="u" style="text-align:center">تقييمك بيوصل للدكانة على واتساب</div>`;return}
}
function checkWatch(){const W=LS("dk_watch",[]);if(!W.length)return;const back=W.filter(n=>{const p=PRODUCTS.find(q=>q.n===n);return p&&!p.oos&&p.p>0});if(!back.length)return;
 LSset("dk_watch",W.filter(n=>!back.includes(n)));if(!LS("dk_ns",{}).off_back)addNote("🔔 رجع للمخزون: "+back.map(n=>esc(n.split(" (")[0])).join("، "));const t=document.createElement("div");t.className="toast";t.innerHTML="🔔 صار متوفر: "+back.map(n=>esc(n.split(" (")[0])).join("، ");t.onclick=()=>{const i=PRODUCTS.findIndex(q=>q.n===back[0]);if(i>=0)openProduct(i);t.remove()};document.body.appendChild(t);setTimeout(()=>t.remove(),9000)}
function normPhone(s){let x=String(s||"").replace(/[^\d+]/g,"");if(x.startsWith("+972"))x="0"+x.slice(4);else if(x.startsWith("972"))x="0"+x.slice(3);return x}
function phoneOk(s){return /^0(5\d{8}|[2-489]\d{7}|7\d{8})$/.test(normPhone(s))}
function reqMsg(){const ph=$("phone").value.trim();if(ph&&!phoneOk(ph))return "رقم الهاتف مش صحيح. اكتبه هيك: 05XXXXXXXX";if(MIN_ORDER!==null&&cartSums().paid<MIN_ORDER)return "الحد الأدنى للطلب "+fmt(MIN_ORDER)+". ضيف أغراض كمان.";return shipMode==="p"?"عبّي الاسم والرقم أول.":"عبّي الاسم والرقم والعنوان أول."}
function regularCost(i,v){const p=PRODUCTS[i];const base=(p.s&&p.op>p.p)?p.op:p.p;if(isAmt(v)){const amt=parseFloat(v.slice(1));return p.p>0?amt/p.p*base:amt}return base*v}
function cartSums(){let sub=0,paid=0;for(const [i,v] of Object.entries(cart)){sub+=regularCost(i,v);paid+=lineFor(i,v).cost}
 const disc=Math.max(0,sub-paid);let del=null;if(shipMode==="p")del=0;else if(DELIVERY_FEE!==null){del=(FREE_DELIVERY_OVER!==null&&paid>=FREE_DELIVERY_OVER)?0:DELIVERY_FEE}
 const cp=coupVal(paid);return {sub,disc,paid,del,cp,grand:paid-cp+(del||0)}}
function saveCart(){try{const o={};for(const [i,v] of Object.entries(cart))if(PRODUCTS[i])o[PRODUCTS[i].n]=v;localStorage.setItem("dk_cart",JSON.stringify(o))}catch(e){}}
function lineFor(i,v){
 const p=PRODUCTS[i];
 if(isAmt(v)){const amt=parseFloat(v.slice(1));return {label:`${p.n} بمبلغ ₪${amt} (~${(amt/p.p).toFixed(2)} ${p.u})`,cost:amt}}
 const cost=bundleCost(p,v);
 const dealNote=(p.bq>1&&p.bp>0&&v>=p.bq)?" 🎁 (اتحسب عرض الكمية)":"";
 return {label:`${p.n} × ${v}${dealNote}`,cost};
}
function drawGrid(){
 const L=PRODUCTS.map((p,i)=>({p,i})).filter(o=>(term?matchQ(o.p,term):(cur==="الكل"||(cur==="عروض"?o.p.s:cur==="المفضلة"?favs.has(o.p.n):cur.startsWith("G:")?(groupOf(o.p.c)===cur.slice(2)&&(!sub||o.p.c===sub)):o.p.c===cur)))&&(!fAvail||(o.p.p>0&&!o.p.oos))&&(!fSale||o.p.s));
 if(sortBy==="asc")L.sort((a,b)=>(a.p.p>0?a.p.p:1e9)-(b.p.p>0?b.p.p:1e9));else if(sortBy==="desc")L.sort((a,b)=>b.p.p-a.p.p);else if(sortBy==="name")L.sort((a,b)=>a.p.n.localeCompare(b.p.n,"ar"));else L.sort((a,b)=>((b.p.p>0)-(a.p.p>0))||(a.i-b.i));
 drawFbar(L.length);
 $("grid").innerHTML=L.length?L.map(({p,i})=>cardHtml(p,i)).join(""):(term?`<div class="none nores"><div class="nri">🔍</div><b>ما لقينا ولا نتيجة لـ «${esc(term)}»</b><span>جرّب كلمة أقصر أو كتابة ثانية (مثلًا «حليب» بدل «حليب تنوفا 3%»)، أو دوّر بالعبري.</span><div class="nrb"><button type="button" onclick="var q=document.getElementById('q');q.value='';q.dispatchEvent(new Event('input'));q.focus()">✕ امسح البحث</button><a href="https://wa.me/972502486206?text=${encodeURIComponent("مرحبا، بدي أسأل إذا في عندكم: "+term)}" target="_blank" rel="noopener">💬 اسألنا على واتساب</a></div></div>`:`<div class="none">${cur==="المفضلة"?"لسا ما ضفت إشي للمفضلة. دوس ♡ على أي غرض.":(fAvail||fSale)?"ما في منتجات بهالفلتر. جرّب تشيل الفلتر.":"ما لقينا هالغرض. جرب اسم ثاني."}</div>`);drawHome()}
function cardHtml(p,i){{
  const v=cart[i],isLeafy=p.u==="ربطة"||/نعنع|كزبرة|شبت|بقدونس|كرفس|بصل أخضر|خس|جرجير|سبانخ|ملوخية|سلق|زعتر أخضر|ميرمية/.test(p.n),isKilo=p.u==="كيلو"||((p.c==="خضار"||p.c==="فواكه"||p.c==="خضار وفواكه")&&!isLeafy);
  let ctr;
  if(p.oos){
   ctr="";
  }else if(isAmt(v)){const amt=parseFloat(v.slice(1));
   ctr=`<div class="amtqty" data-amt="${i}"><b>₪${amt}</b><span class="u">(~${(amt/p.p).toFixed(2)} ${p.u})</span><span class="rm" data-ramt="${i}">إزالة ×</span></div>`;
  }else if(v){
   ctr=`<div class="qty"><button data-m="${i}" aria-label="نقص">−</button><b>${v}</b><button data-a="${i}" aria-label="زيد">+</button></div>`;
  }else if(!(p.p>0)){
   ctr="";
  }else if(isKilo){
   ctr=`<div class="addwrap"><button class="add" data-a="${i}" aria-label="أضف ${p.n}">+ أضف</button><button class="amtbtn" data-amt="${i}">₪ بمبلغ</button></div>`;
  }else{
   ctr=`<button class="add" data-a="${i}" aria-label="أضف ${p.n}">+ أضف للسلة</button>`;
  }
  const saleBadge=p.s&&!p.oos?`<span class="sale">🔥 ${p.op>p.p&&p.p>0?"خصم "+Math.round((1-p.p/p.op)*100)+"%":"מבצע"}</span>`:'';
  const oosBadge=p.oos?'<span class="oos">غير متوفر</span>':'';
  const priceHtml=p.p>0?(p.s&&p.op>p.p?`<span class="op">${fmt(p.op)}</span>${fmt(p.p)}`:fmt(p.p)):'<small style="font-size:14px;color:var(--mut)">السعر قريباً</small>';
  const bundleHtml=(p.bq>1&&p.bp>0)?`<span class="bdl">🎁 ${Math.abs(p.bp-(p.bq-1)*p.p)<0.01?`اشتري ${p.bq-1} وخذ 1 مجانًا`:`${p.bq} بـ${fmt(p.bp)}`}</span>`:'';
  return `<div class="p${p.oos?" oos":""}${p.p>0?"":" nop"}" data-pi="${i}"><div class="ic" style="background:linear-gradient(145deg,hsl(${hues[p.c]} 85% 90%),hsl(${hues[p.c]} 80% 80%))"><button type="button" class="fav${favs.has(p.n)?" on":""}" data-fav="${i}" aria-label="مفضلة">${favs.has(p.n)?"♥":"♡"}</button>${saleBadge}${oosBadge}${p.img?`<img src="${p.img}" alt="${p.n}" loading="lazy">`:p.e}<span class="nm">${p.n}</span></div>`+
  `<div class="bd"><span class="pr">${priceHtml}</span><span class="u">لكل ${p.u}</span>${bundleHtml}${p.oos?`<span class="av no">✕ غير متوفر حاليًا</span>`:(p.p>0?`<span class="av">✓ متوفر</span>`:"")}</div>`+ctr+`</div>`}}
function drawFbar(n){const f=$("fbar");if(!f)return;
 let subs="";if(!term&&cur.startsWith("G:")){const g=groupsPresent().find(x=>x.n===cur.slice(2));if(g&&g.cs.length>1)subs=`<div class="subs">${["",...g.cs].map(c=>`<button type="button" class="${c===sub?"on":""}" data-sub="${c}">${c||"الكل"}</button>`).join("")}</div>`}
 const title=term?`🔎 نتائج «${esc(term)}»`:cur.startsWith("G:")?`${ce[cur]||""} ${cur.slice(2)}`:cur==="الكل"?"":cur;
 f.innerHTML=(title?`<div class="fh"><b>${title}</b><span class="u">${n} منتج</span></div>`:"")+subs+`<div class="ftools"><select id="sortSel" aria-label="ترتيب"><option value="">↕️ ترتيب: الافتراضي</option><option value="asc"${sortBy==="asc"?" selected":""}>السعر: من الأرخص</option><option value="desc"${sortBy==="desc"?" selected":""}>السعر: من الأغلى</option><option value="name"${sortBy==="name"?" selected":""}>الاسم: أ ← ي</option></select><button type="button" class="fchip${fAvail?" on":""}" data-ft="avail">✓ متوفر وإله سعر</button><button type="button" class="fchip${fSale?" on":""}" data-ft="sale">🔥 عروض بس</button>${cur==="المفضلة"&&favs.size?`<button type="button" class="fchip favall" data-ft="favall">🛒 ضيف كل المفضلة للسلة</button>`:""}</div>`}
function drawHome(){const h=$("home");if(!h)return;if(cur!=="الكل"||term){h.innerHTML="";return}
 const all=PRODUCTS.map((p,i)=>({p,i}));
 const row=(t,items0)=>{const items=items0.filter(o=>o.p.p>0);return items.length?`<section class="hrow"><div class="rh"><b>${t}</b><span class="u">زيح ⬅</span></div><div class="rs">${items.map(({p,i})=>cardHtml(p,i)).join("")}</div></section>`:""};
 const info=`<div class="hrow"><button type="button" class="infostrip" onclick="window.pageContact&&window.pageContact()"><span>🚚 ${typeof DELIVERY_FEE!=="undefined"&&DELIVERY_FEE!==null?"توصيل بـ "+fmt(DELIVERY_FEE):"توصيل للبيت"} أو استلام من الدكانة</span><span>🕒 ${typeof SHOP_HOURS!=="undefined"&&SHOP_HOURS?esc(SHOP_HOURS):"ساعات العمل: بنحدّثها قريبًا"}</span><span>💵 الدفع عند الاستلام</span><span>🥬 طازة كل يوم</span></button></div>`;
 const P=pastItems().filter(x=>PRODUCTS[x.k].p>0&&!PRODUCTS[x.k].oos).slice(0,12);
 const past=P.length?`<section class="hrow"><div class="rh"><b>🔁 اشتريتها سابقًا</b><button type="button" class="rhl" onclick="window.pagePast&&window.pagePast()">اطلبها مرة ثانية ←</button></div><div class="rs">${P.map(x=>cardHtml(PRODUCTS[x.k],x.k)).join("")}</div></section>`:"";
 const offb=`<div class="hrow"><button type="button" class="offbtn" onclick="window.pageOffers&&window.pageOffers()">🎁 كل العروض والكوبونات <span>←</span></button></div>`;
 h.innerHTML=info+offb+past+row("🔥 عروض اليوم",all.filter(o=>o.p.s&&!o.p.oos&&!o.p.wk))+row("📅 عروض الأسبوع",all.filter(o=>o.p.wk&&!o.p.oos))+row("⭐ الأكثر مبيعًا",all.filter(o=>o.p.top))+row("🆕 منتجات جديدة",all.filter(o=>o.p.nw))+row("✨ مقترحة إلك",suggest(all))+`<div class="sec allh">🛍️ كل المنتجات</div>`}
function suggest(all){const ok=o=>o.p.p>0&&!o.p.oos&&o.p.img&&!cart[o.i];
 const liked=new Set([...favs]);try{(JSON.parse(localStorage.getItem("dk_orders")||"[]")).forEach(o=>Object.keys(o.items||{}).forEach(n=>liked.add(n)))}catch(e){}
 const gs=new Set(PRODUCTS.filter(p=>liked.has(p.n)).map(p=>groupOf(p.c)));
 let pool=all.filter(o=>ok(o)&&!liked.has(o.p.n)&&!o.p.top&&(gs.size?gs.has(groupOf(o.p.c)):true));
 if(pool.length<6)pool=pool.concat(all.filter(o=>ok(o)&&!liked.has(o.p.n)&&!pool.includes(o)));
 const seed=new Date().toDateString();let h=0;for(const ch of seed)h=(h*31+ch.charCodeAt(0))>>>0;
 return pool.map(o=>({o,k:((o.i+1)*2654435761^h)>>>0})).sort((a,b)=>a.k-b.k).slice(0,10).map(x=>x.o)}
function total(){return Object.entries(cart).reduce((s,[i,v])=>s+lineFor(i,v).cost,0)}
function drawBar(){
 const n=Object.entries(cart).reduce((a,[i,v])=>a+(isAmt(v)?1:v),0);
 $("bar").style.display=n?"block":"none";
 $("cnt").textContent="🛒 شوف السلة ("+n+")";{const bc=document.getElementById("bnCnt");if(bc){bc.textContent=n;bc.style.display=n?"grid":"none"}const cc=document.getElementById("cartCnt");if(cc){cc.textContent=n;cc.style.display=n?"grid":"none"}} $("sum").textContent=fmt(total());
 $("bar").classList.remove("pop");void $("bar").offsetWidth;$("bar").classList.add("pop");
}
function laterHtml(){const L=later.map(n=>({n,k:PRODUCTS.findIndex(p=>p.n===n)})).filter(o=>o.k>=0);if(!L.length)return "";
 return `<div class="shead">🕒 محفوظ لوقت لاحق (${L.length})</div><div class="later">${L.map(({k})=>{const p=PRODUCTS[k];return `<div class="litem"><div class="cth">${p.img?`<img src="${p.img}" alt="">`:`<span>${p.e}</span>`}</div><div class="cinfo"><b>${p.n}</b><small>${p.p>0?fmt(p.p)+" لكل "+p.u:"السعر قريباً"}${p.oos?" • غير متوفر حاليًا":""}</small></div><div class="lbtns"><button type="button" data-lb="${k}" ${p.p>0&&!p.oos?"":"disabled"}>🛒 رجّعه</button><button type="button" data-lx="${k}" aria-label="احذف">✕</button></div></div>`}).join("")}</div>`}
function forgotHtml(){const inC=new Set(Object.keys(cart).map(Number)),seen=new Set(),L=[];const ok=k=>{const p=PRODUCTS[k];return p&&p.p>0&&!p.oos&&!inC.has(k)&&!later.includes(p.n)&&!seen.has(k)};
 const push=k=>{if(ok(k)){seen.add(k);L.push(k)}};
 for(const i of inC)withIt(i).slice(0,4).forEach(o=>push(o.k));
 PRODUCTS.forEach((p,k)=>{if(p.top)push(k)});
 const S=L.slice(0,10);if(!S.length)return "";
 return `<div class="shead">🤔 ممكن نسيت؟</div><div class="fgrow">${S.map(k=>{const p=PRODUCTS[k];return `<div class="fgc"><div class="fgi">${p.img?`<img src="${p.img}" alt="">`:`<span>${p.e}</span>`}</div><b>${p.n.split(" (")[0]}</b><div class="fgp"><span>${fmt(p.p)}</span><button type="button" data-fa="${k}" aria-label="أضف">+</button></div></div>`}).join("")}</div>`}
function drawList(){
 const E=Object.entries(cart);drawShip();
 if(!E.length){$("list").innerHTML=`<div class="cempty"><div>🛒</div><b>السلة فاضية</b><span>ضيف أغراض من الأقسام أو من المفضلة ❤️</span></div>`+laterHtml();$("tot").innerHTML="";return}
 $("list").innerHTML=E.map(([i,v])=>{const p=PRODUCTS[i],l=lineFor(i,v),reg=regularCost(i,v);
  const th=p.img?`<img src="${p.img}" alt="">`:`<span>${p.e}</span>`;
  const ctl=isAmt(v)?`<button type="button" class="camt" data-le="${i}">₪${parseFloat(v.slice(1))} ✎</button>`:`<div class="cstep"><button type="button" data-lm="${i}" aria-label="نقص">−</button><b>${v}</b><button type="button" data-lp="${i}" aria-label="زيد">+</button></div>`;
  const own=isub[p.n]||"";
  const sel=`<label class="csub"><span>إذا نفد:</span><select data-si="${i}"><option value="" ${own?"":"selected"}>${SUBS_S[subPref]} (العام)</option>${Object.keys(SUBS).map(k=>`<option value="${k}" ${own===k?"selected":""}>${SUBS_S[k]}</option>`).join("")}</select></label>`;
  return `<div class="citem"><div class="cth">${th}</div><div class="cinfo"><b>${p.n}</b><small>${fmt(p.p)} لكل ${p.u}${isAmt(v)?` • تقريبًا ${(parseFloat(v.slice(1))/p.p).toFixed(2)} ${p.u}`:""}</small>${ctl}${sel}</div><div class="cend"><button type="button" class="cdel" data-ld="${i}" aria-label="احذف">🗑</button><b>${fmt(l.cost)}</b>${reg>l.cost+0.001?`<s>${fmt(reg)}</s>`:""}<button type="button" class="clater" data-sl="${i}">🕒 لبعدين</button></div></div>`}).join("")+forgotHtml()+laterHtml();
 const s=cartSums();
 const delTxt=s.del===null?`<span class="u">بنحكيلك على واتساب</span>`:s.del===0?`<span class="free">مجاني 🎉</span>`:fmt(s.del);
 let bars="";
 if(MIN_ORDER!==null&&s.paid<MIN_ORDER){const pc=Math.min(100,s.paid/MIN_ORDER*100);bars+=`<div class="pbar warn"><div class="pbt">باقي <b>${fmt(MIN_ORDER-s.paid)}</b> لتوصل للحد الأدنى للطلب (${fmt(MIN_ORDER)}) 🧺</div><div class="pbtrack"><i style="width:${pc}%"></i></div></div>`}
 if(shipMode==="d"&&DELIVERY_FEE&&FREE_DELIVERY_OVER!==null){const pc=Math.min(100,s.paid/FREE_DELIVERY_OVER*100);bars+=s.paid>=FREE_DELIVERY_OVER?`<div class="pbar ok"><div class="pbt">🎉 مبروك! التوصيل عليك مجاني</div><div class="pbtrack"><i style="width:100%"></i></div></div>`:`<div class="pbar"><div class="pbt">باقي <b>${fmt(FREE_DELIVERY_OVER-s.paid)}</b> لتحصل على توصيل مجاني 🚚</div><div class="pbtrack"><i style="width:${pc}%"></i></div></div>`}
 const C=COUPONS[coupon];const cpNote=coupon&&C&&C.min&&s.paid<C.min?`<div class="cpmsg bad">الكود بيشتغل على طلبات فوق ${fmt(C.min)}</div>`:coupMsg?`<div class="cpmsg ${C?"good":"bad"}">${coupMsg}</div>`:"";
 const cbox=`<div class="coup"><input id="coupIn" placeholder="🎟️ عندك كود خصم؟" value="${esc(coupon)}" autocomplete="off"><button type="button" id="coupBtn">${coupon&&C?"✕ شيل":"فعّل"}</button></div>${cpNote}`;
 $("tot").innerHTML=bars+cbox+`<div class="srow"><span>السعر قبل الخصم</span><span>${fmt(s.sub)}</span></div>${s.disc>0.001?`<div class="srow disc"><span>🔥 قيمة الخصم</span><span>− ${fmt(s.disc)}</span></div>`:""}${s.cp>0.001?`<div class="srow disc"><span>🎟️ كوبون ${esc(coupon)}</span><span>− ${fmt(s.cp)}</span></div>`:""}<div class="srow"><span>${shipMode==="p"?"🏪 استلام من الدكانة":"🚚 التوصيل"}</span>${shipMode==="p"?`<span class="free">بدون رسوم</span>`:delTxt}</div><div class="srow grand"><span>الإجمالي النهائي</span><span>${fmt(s.grand)}${s.del===null?" + توصيل":""}</span></div>`;
}
function upd(){saveCart();drawGrid();drawBar();if($("sheet").classList.contains("open"))drawList()}
$("cats").onclick=e=>{const bt=e.target.closest("button");const c=bt&&bt.dataset.c;if(c){cur=c;sub="";drawCats();drawGrid()}};
if($("dealsBanner"))$("dealsBanner").onclick=e=>{const c=e.target.closest(".dcard");if(!c)return;cur="عروض";sub="";term="";$("q").value="";drawCats();drawGrid();$("grid").scrollIntoView({behavior:"smooth",block:"start"})};
$("q").oninput=e=>{term=e.target.value.trim();drawGrid();const c=$("qx");if(c)c.style.display=term?"grid":"none"};
$("q").onkeydown=e=>{if(e.key==="Enter"){e.preventDefault();e.target.blur();($("fbar")||$("grid")).scrollIntoView({behavior:"smooth",block:"start"})}};
let amtIdx=null;
function openAmt(i){amtIdx=i;$("atitle").textContent="اشتري "+PRODUCTS[i].n+" بمبلغ محدد";$("amtIn").value=isAmt(cart[i])?cart[i].slice(1):"";$("aerr").textContent="";$("amtSheet").classList.add("open")}
$("grid").onclick=e=>{const t=e.target;{const fb=t.closest&&t.closest("[data-fav]");if(fb){toggleFav(+fb.dataset.fav);if($("pg")&&$("pg").style.display==="flex"&&pdIdx>=0)renderProduct();return}}
 {const pc=t.closest&&t.closest("[data-pi]");if(pc&&!t.closest("button")&&(t.closest(".ic")||t.closest(".bd"))){openProduct(+pc.dataset.pi);return}}
 if(t.dataset.a!==undefined){cart[t.dataset.a]=(typeof cart[t.dataset.a]==="number"?cart[t.dataset.a]:0)+1;upd()}
 if(t.dataset.m!==undefined){const i=t.dataset.m;if(typeof cart[i]==="number"){cart[i]--;if(cart[i]<=0)delete cart[i]}upd()}
 if(t.dataset.amt!==undefined){openAmt(+t.dataset.amt)}
 if(t.dataset.ramt!==undefined){delete cart[t.dataset.ramt];upd()}};
if($("home"))$("home").onclick=e=>$("grid").onclick(e);
if($("fbar")){$("fbar").onclick=e=>{const s=e.target.closest("[data-sub]");if(s){sub=s.dataset.sub;drawGrid();return}const t=e.target.closest("[data-ft]");if(t){if(t.dataset.ft==="favall"){let k=0;PRODUCTS.forEach((p,i)=>{if(favs.has(p.n)&&p.p>0&&!p.oos&&!cart[i]){cart[i]=1;k++}});upd();return}if(t.dataset.ft==="avail")fAvail=!fAvail;else fSale=!fSale;drawGrid()}};$("fbar").onchange=e=>{if(e.target.id==="sortSel"){sortBy=e.target.value;drawGrid()}}}
if($("pg"))$("pg").onclick=e=>{if(e.target.id==="pg"){pgClose();return}
 {const c2=e.target.closest("[data-ch]");if(c2&&!c2.disabled){document.querySelectorAll(".chs [data-ch]").forEach(x=>x.classList.toggle("on",x===c2));return}}
 {const ct=e.target.closest("[data-ct]");if(ct){cfTopic=ct.dataset.ct;document.querySelectorAll(".ctop [data-ct]").forEach(x=>x.classList.toggle("on",x===ct));return}}
 {const r=e.target.closest("[data-rs],[data-is],[data-ip]");if(r){const D=r.dataset,c=$("rCom")?$("rCom").value:($("iCom")?$("iCom").value:"");
  if(D.rs){const v=+D.v;if(D.rs==="o")RT.o=v;else if(D.rs==="d")RT.d=v;else RT.it[D.rs.slice(1)]=v;const bx=$("pgBody").closest(".cpbox"),st=bx?bx.scrollTop:0;pageRate(RT.k);if($("rCom"))$("rCom").value=c;if(bx)bx.scrollTop=st}
  else{if(D.is!==undefined)IS.t=D.is;else IS.p[D.ip]=!IS.p[D.ip];pageIssue(IS.k);if($("iCom"))$("iCom").value=c}return}}{const x=e.target.closest("[data-pd],[data-pv],[data-rt]");if(x){const D=x.dataset;if(D.pv!==undefined){openProduct(+D.pv);return}if(D.rt){const p=PRODUCTS[pdIdx];window.open(waLink(`تقييمي لـ ${p.n}: ${"⭐".repeat(+D.rt)}`),"_blank");x.parentNode.innerHTML=`<b style="color:var(--g)">شكرًا! ${"⭐".repeat(+D.rt)}</b>`;return}pdAction(D.pd);return}}
 if(e.target.closest(".pdp [data-pi]")){$("grid").onclick(e);return}
 if(e.target.closest(".pgcards [data-pi]")){const f=pgRe;$("grid").onclick(e);if(f&&$("pg").style.display==="flex"&&!document.querySelector(".pdp")){pgRe=f;pgRefresh()}return}
 const b=e.target.closest("[data-go],[data-re],[data-da]");if(b)pgRe=null;if(!b)return;const D=b.dataset;
 if(D.re!==undefined)return reorder(+D.re);
 if(D.da!==undefined){const A=LS("dk_addrs",[]);A.splice(+D.da,1);LSset("dk_addrs",A);return pageAccount()}
 const g=D.go;pgRe=null;
 if(g==="cfsend")return sendContact();if(g==="ownerlogin"){pgClose();return ownerLogin()}if(g==="install")return doInstall();if(g==="nset")return pageNSet();if(g==="nssave")return saveNSet();if(g==="order")return pageOrder(+D.k);if(g==="rate")return pageRate(+D.k);if(g==="rsend")return sendRate(+D.k);if(g==="issue")return pageIssue(+D.k);if(g==="isend")return sendIssue(+D.k);if(g==="inv")return pageInvoice(+D.k);if(g==="cancel")return cancelOrder(+D.k);if(g==="past")return pagePast();if(g==="offers")return pageOffers();if(g==="notes")return pageNotes();
 if(g==="pastrep"){pastItems().filter(x=>x.times>1).forEach(x=>{const p=PRODUCTS[x.k];if(p.p>0&&!p.oos&&!cart[x.k])cart[x.k]=x.q});upd();pgClose();drawList();$("sheet").classList.add("open");prefill();return}
 if(g==="applyc"){coupon=D.c;const c=COUPONS[coupon];coupMsg=c?"✓ تفعّل الكود: "+(c.pct?c.pct+"% خصم":fmt(c.amt)+" خصم"):"";pgClose();drawList();$("sheet").classList.add("open");prefill();return}
 if(g==="close")pgClose();else if(g==="orders")pageOrders();else if(g==="contact")pageContact();else if(g==="info")pageInfo();else if(g==="favs"){pgClose();showFavs()}
 else if(g==="saveprof"){LSset("dk_prof",{name:$("pfName").value.trim(),phone:$("pfPhone").value.trim()});$("pfOk").textContent="✓ انحفظ"}
 else if(g==="addaddr"){const v=$("newAddr").value.trim();if(v){const A=LS("dk_addrs",[]);if(!A.includes(v))A.unshift(v);LSset("dk_addrs",A.slice(0,6));pageAccount()}}
 else if(g==="wipe"){askYes("أكيد بدك تمسح اسمك وعناوينك وطلباتك ومفضلتك وسلتك من هالتلفون؟","أيوا، امسح","لا").then(ok=>{if(ok){["dk_prof","dk_addrs","dk_orders","dk_favs","dk_cart","dk_notes","dk_seen","dk_later","dk_isub","dk_watch"].forEach(k=>{try{localStorage.removeItem(k)}catch(e){}});favs.clear();for(const k in cart)delete cart[k];upd();drawCats();updFavTop();pageAccount()}})}};
if($("catGrid"))$("catGrid").onclick=e=>{const b=e.target.closest("[data-g]");if(b)openGroup(b.dataset.g)};
if($("catPage"))$("catPage").onclick=e=>{if(e.target.id==="catPage")e.target.style.display="none"};
if(!$("chips").children.length)$("chips").innerHTML=[5,10,15,20,50].map(v=>`<button type="button" data-v="${v}">₪${v}</button>`).join("");
$("chips").onclick=e=>{if(e.target.dataset.v)$("amtIn").value=e.target.dataset.v};
$("aclose").onclick=()=>$("amtSheet").classList.remove("open");
$("amtSheet").onclick=e=>{if(e.target.id==="amtSheet")$("amtSheet").classList.remove("open")};
$("amtOk").onclick=()=>{
 const v=parseFloat(String($("amtIn").value).replace(",","."));
 if(!(v>0)){$("aerr").textContent="اكتب مبلغ صحيح أكبر من صفر.";return}
 cart[amtIdx]="₪"+v;$("amtSheet").classList.remove("open");upd();
};
$("list").onchange=e=>{const s=e.target.closest("[data-si]");if(!s)return;const n=PRODUCTS[s.dataset.si].n;if(s.value)isub[n]=s.value;else delete isub[n];saveX();link()};
$("tot").onclick=e=>{if(e.target.id!=="coupBtn")return;const C=COUPONS[coupon];if(coupon&&C){coupon="";coupMsg=""}else{const v=($("coupIn").value||"").trim().toUpperCase();if(!v){coupMsg="اكتب الكود أول.";coupon=""}else if(COUPONS[v]){coupon=v;const c=COUPONS[v];coupMsg="✓ تفعّل الكود: "+(c.pct?c.pct+"% خصم":fmt(c.amt)+" خصم")}else{coupon="";coupMsg="الكود مش صحيح أو خلص."}}drawList();link()};
$("list").onclick=e=>{const b=e.target.closest("button");if(!b)return;const D=b.dataset;
 if(D.sl!==undefined){const n=PRODUCTS[D.sl].n;delete cart[D.sl];if(!later.includes(n))later.unshift(n);saveX()}
 else if(D.lb!==undefined){const n=PRODUCTS[D.lb].n;later=later.filter(x=>x!==n);cart[D.lb]=cart[D.lb]||1;saveX()}
 else if(D.lx!==undefined){const n=PRODUCTS[D.lx].n;later=later.filter(x=>x!==n);saveX()}
 else if(D.fa!==undefined){cart[D.fa]=(typeof cart[D.fa]==="number"?cart[D.fa]:0)+1}
 else if(D.lp!==undefined){cart[D.lp]=(+cart[D.lp]||0)+1}
 else if(D.lm!==undefined){cart[D.lm]--;if(cart[D.lm]<=0)delete cart[D.lm]}
 else if(D.ld!==undefined){delete cart[D.ld]}
 else if(D.le!==undefined){openAmt(+D.le);return}
 upd();drawList();link()};
if($("ship"))$("ship").onclick=e=>{const b=e.target.closest("button");if(!b)return;const D=b.dataset;if(D.sp)subPref=D.sp;else if(D.pm)payMode=D.pm;else if(D.bg)bags=bags===D.bg?"":D.bg;else if(D.xo==="cb")callBefore=!callBefore;else if(D.xo==="door")leaveDoor=!leaveDoor;else if(D.sm)shipMode=D.sm;else if(D.sd!==undefined){shipDay=+D.sd}else if(D.ss!==undefined)shipSlot=+D.ss;else return;drawList();link()};
$("open").onclick=()=>{drawList();$("sheet").classList.add("open");prefill();if($("mktChk"))$("mktChk").checked=!!LS("dk_ns",{}).mkt};
if($("addrPick"))$("addrPick").onclick=e=>{const b=e.target.closest("[data-pa]");if(b){$("addr").value=LS("dk_addrs",[])[+b.dataset.pa]||"";link()}};
$("x").onclick=()=>$("sheet").classList.remove("open");
$("sheet").onclick=e=>{if(e.target.id==="sheet")$("sheet").classList.remove("open")};
function payLabel(){if(CFG.card===false)payMode="cash";return (payMode==="card"?"بطاقة":"نقدًا")+" عند الاستلام ("+(shipMode==="p"?"بالدكانة":"للموصّل")+")"}
function build(){
 const name=$("name").value.trim(),phone=$("phone").value.trim(),addr=$("addr").value.trim(),notes=$("notes")?$("notes").value.trim():"";
 const lines=Object.entries(cart).map(([i,v])=>{const l=lineFor(i,v),o=isub[PRODUCTS[i].n];return `• ${l.label} = ${fmt(l.cost)}`+(o&&o!==subPref?`\n   ↳ إذا نفد: ${SUBS[o].replace(/^\S+\s/,"")}`:"")});
 const S=cartSums();const sumTxt=`المجموع: ${fmt(S.sub)}`+(S.disc>0.001?`\nالخصم: − ${fmt(S.disc)}`:"")+(S.cp>0.001?`\nكوبون ${coupon}: − ${fmt(S.cp)}`:"")+(shipMode==="p"?"":`\nالتوصيل: ${S.del===null?"بتحددوه معي":S.del===0?"مجاني":fmt(S.del)}`)+`\nالإجمالي: ${fmt(S.grand)}${S.del===null?" + توصيل":""}`;
 const extras=[bags==="yes"?"بدي أكياس":bags==="no"?"بدون أكياس":"",shipMode==="d"&&callBefore?"اتصلوا فيّ قبل ما توصلوا":"",shipMode==="d"&&leaveDoor?"اتركوا الطلب عند الباب":""].filter(Boolean);
 const minOk=MIN_ORDER===null||S.paid>=MIN_ORDER;const mk=$("mktChk")&&$("mktChk").checked;
 return {ok:!!(name&&phoneOk(phone)&&(addr||shipMode==="p")&&lines.length&&minOk),msg:`طلب جديد من ${SHOP_NAME}\nرقم الطلب: #${orderNo()}\n\n${lines.join("\n")}\n\n${sumTxt}\n\nالاسم: ${name}\nالهاتف: ${phone}\n${shipMode==="p"?"":"العنوان: "+addr+"\n"}طريقة الاستلام: ${shipLabel()}\nالوقت المتوقع: ${etaTxt()}\nالدفع: ${payLabel()}\nإذا نفد منتج (الافتراضي): ${SUBS[subPref].replace(/^\S+\s/,"")}${extras.length?"\nخيارات: "+extras.join(" • "):""}${notes?"\nملاحظات: "+notes:""}\nرسائل العروض: ${mk?"موافق ✅ ("+new Date().toLocaleDateString("en-GB")+")"+" عبر "+CH[(LS("dk_ns",{}).ch)||"wa"].replace(/^\S+\s/,""):"غير موافق"}`};
}
function link(){$("send").href="https://wa.me/"+WHATSAPP+"?text="+encodeURIComponent(build().msg)}
["name","phone","addr","notes"].forEach(id=>{if($(id))$(id).addEventListener("input",link)});
if($("mktChk"))$("mktChk").addEventListener("change",link);
if($("phone"))$("phone").addEventListener("blur",()=>{const v=$("phone").value.trim();$("phone").classList.toggle("bad",!!v&&!phoneOk(v));if(v&&!phoneOk(v))$("err").textContent="رقم الهاتف مش صحيح. اكتبه هيك: 05XXXXXXXX";else if($("err").textContent.startsWith("رقم الهاتف"))$("err").textContent=""});
$("open").addEventListener("click",link);
$("send").onclick=e=>{link();if(!build().ok){e.preventDefault();$("err").textContent=reqMsg();return}$("err").textContent="";const o=recordOrder();for(const k in cart)delete cart[k];upd();setTimeout(()=>showConfirm(o),350)};
$("copy").onclick=async()=>{
 if(!build().ok){$("err").textContent=reqMsg();return}
 try{await navigator.clipboard.writeText(build().msg);{const o=recordOrder();for(const k in cart)delete cart[k];upd();setTimeout(()=>showConfirm(o),900)}$("err").textContent="اننسخ الطلب. افتح واتساب والصقه وابعته على 0"+WHATSAPP.slice(3)}
 catch(e){$("err").textContent="ما زبط النسخ. جرب الزر الأخضر."}
};

// ===== إدارة الأغراض: لصاحب/مديري هالصفحة بس (صلاحية تعديل على الرابط) =====
let isOwner=false,taps=0,tt,draft=[];
const SHOP_EMAIL="ayhamamari@gmail.com";
let ownerUser=null;
FB.onAuth(u=>{ownerUser=u;isOwner=!!(u&&u.email&&u.email.toLowerCase()===SHOP_EMAIL);$("gear").style.display=isOwner?"flex":"none";if(isOwner)startOwner();if(u&&!isOwner){alert("هاد الحساب ("+u.email+") مش حساب صاحب الدكانة.");FB.signOut()}});
async function ownerLogin(){if(isOwner)return openAdm();try{await FB.signInGoogle()}catch(e){alert("ما زبط الدخول: "+((e&&e.message)||e))}}
window.ownerLogin=ownerLogin;
$("em").onclick=()=>{taps++;clearTimeout(tt);tt=setTimeout(()=>taps=0,1500);if(taps>=5){taps=0;ownerLogin()}};
$("gear")?.addEventListener?.("click",openAdm);
function openAdm(){
 if(!isOwner)return;
 draft=PRODUCTS.map((p,k)=>({...p,_k:k}));const nDraft=applyDraft();admQ="";if($("admQ"))$("admQ").value="";
 const nNo=PRODUCTS.filter(p=>!(p.p>0)).length;
 if(!admGrp||(admGrp==="$0"&&!nNo)||(admGrp!=="$0"&&admGrp!=="*"&&!draft.some(p=>groupOf(p.c)===admGrp)))admGrp=nNo?"$0":((groupsPresent()[0]||{}).n||"*");
 renderAdmin();
 $("am").style.color="#b26a00";$("am").textContent=nDraft?`✏️ رجّعنالك تعديلات ما انحفظت على ${nDraft} ${nDraft===1?"منتج":"منتجات"} — دوس «احفظ» عليهن.`:"";$("adm").style.display="flex";
}
let admGrp="",admQ="";
function rowHtml(p,i){return `<div class="arow${p._d?" dirty":""}${p._k===undefined?" isnew":""}" id="ar-${i}">
  <div class="aline1"><button type="button" class="adrag" data-drag="${i}" aria-label="اسحب لتغيير القسم" title="اسحب لقسم ثاني">⠿</button>${p.img?`<img class="athumb" src="${p.img}" alt="">`:""}<input class="ae" data-f="e" data-i="${i}" maxlength="4" value="${p.e||""}" aria-label="أيقونة"><input class="an" data-f="n" data-i="${i}" placeholder="اسم الغرض" value="${esc(p.n||"")}" aria-label="اسم الغرض"><button type="button" class="adel" data-del="${i}" aria-label="احذف ${esc(p.n||"الغرض")}">🗑</button></div>
  <div class="aline2"><input data-f="c" data-i="${i}" placeholder="القسم" value="${esc(p.c||"")}" aria-label="القسم"><input data-f="u" data-i="${i}" placeholder="الوحدة (كيلو/قنينة..)" value="${esc(p.u||"")}" aria-label="الوحدة"></div><div class="aline2"><input data-f="br" data-i="${i}" placeholder="الماركة (اختياري)" value="${esc(p.br||"")}" aria-label="الماركة"><input data-f="d" data-i="${i}" placeholder="وصف قصير (اختياري)" value="${esc(p.d||"")}" aria-label="الوصف"></div>
  <div class="aline3"><button type="button" data-dn="${i}" aria-label="نقص السعر">−</button><input data-f="p" data-i="${i}" inputmode="decimal" value="${p.p}" aria-label="السعر"><button type="button" data-up="${i}" aria-label="زيد السعر">+</button><span>₪</span></div>
  <div class="aline4"><label><input type="checkbox" data-f="s" data-i="${i}" ${p.s?"checked":""}> 🔥 على عرض؟</label>${p.s?`<input data-f="op" data-i="${i}" inputmode="decimal" placeholder="السعر قبل الخصم" value="${p.op||""}">`:""}<label><input type="checkbox" data-f="oos" data-i="${i}" ${p.oos?"checked":""}> ⛔ غير متوفر؟</label><label><input type="checkbox" data-f="top" data-i="${i}" ${p.top?"checked":""}> ⭐ الأكثر طلبًا</label><label><input type="checkbox" data-f="nw" data-i="${i}" ${p.nw?"checked":""}> 🆕 جديد</label><label><input type="checkbox" data-f="wk" data-i="${i}" ${p.wk?"checked":""}> 📅 عرض الأسبوع</label></div>
  <div class="aline4"><label><input type="checkbox" data-f="bd" data-i="${i}" ${p.bq>1&&p.bp>0?"checked":""}> 🎁 عرض على الكمية؟ <small class="u">(اشتري 2 وخذ 1 = كل 3 بسعر 2)</small></label>${(p.bq>1&&p.bp>0)?`<span style="display:flex;align-items:center;gap:5px">كل <input data-f="bq" data-i="${i}" inputmode="numeric" style="width:44px" value="${p.bq}"> بسعر <input data-f="bp" data-i="${i}" inputmode="decimal" style="width:60px" value="${p.bp}"> ₪</span>`:""}</div>
  <div class="asvrow"><span class="asvst">${p._d?"✏️ في تعديل ما انحفظ":p._k===undefined?"🆕 جديد — لسا ما انحفظ":"✓ محفوظ"}</span><button type="button" class="asv1" data-sv="${i}">💾 احفظ هالمنتج</button></div>
 </div>`}
function quickRow(p,i){return `<div class="arow qrow${p._d?" dirty":""}" id="ar-${i}"><button type="button" class="adrag" data-drag="${i}" aria-label="اسحب لتغيير القسم" title="اسحب لقسم ثاني">⠿</button>${p.img?`<img class="athumb" src="${p.img}" alt="">`:`<span class="athumb qe">${p.e||"🛒"}</span>`}<div class="qn"><b>${esc((p.n||"").split(" (")[0])}</b><small>${esc((p.n||"").includes(" (")?p.n.slice(p.n.indexOf(" (")+1):"")}</small></div><div class="qin"><input data-f="p" data-i="${i}" inputmode="decimal" placeholder="₪" value="${p.p>0?p.p:""}" aria-label="السعر"><input data-f="u" data-i="${i}" value="${esc(p.u||"")}" aria-label="الوحدة" class="qu"></div></div>`}
function updSaveBtn(){const n=draft.filter(p=>p._d||p._k===undefined).length;const b=$("asave");if(b){b.textContent=n?`💾 احفظ كل التعديلات (${n})`:"💾 احفظ كل التعديلات مرة وحدة";b.classList.toggle("hot",!!n)}}
function renderAdmin(){
 const G={};draft.forEach((p,i)=>{if(p._k===undefined)return;const g=groupOf(p.c);(G[g]=G[g]||[]).push(i)});
 const order=[...GROUPS.map(g=>g.n),OTHER.n].filter(g=>G[g]);Object.keys(G).forEach(g=>{if(!order.includes(g))order.push(g)});
 const NO=draft.map((p,i)=>i).filter(i=>draft[i]._k!==undefined&&!(PRODUCTS[draft[i]._k].p>0));
 if(admGrp!=="*"&&admGrp!=="$0"&&!G[admGrp])admGrp=order[0]||"*";if(admGrp==="$0"&&!NO.length)admGrp=order[0]||"*";
 const dirty=draft.filter(p=>p._d||p._k===undefined).length;
 $("admTabs").innerHTML=[...(NO.length?[["$0","بدون سعر",NO.length]]:[]),["*","الكل",draft.filter(p=>p._k!==undefined).length],...order.map(g=>[g,g,G[g].length])].map(([k,t,n])=>`<button type="button" data-ag="${esc(k)}" class="${!admQ&&admGrp===k?"on":""}${k==="$0"?" t0":""}">${k==="*"?"📋":k==="$0"?"💰":(GROUPS.find(x=>x.n===k)||OTHER).i} ${esc(t)} <em>${n}</em></button>`).join("");
 const nq=admQ?norm(admQ):"";
 let idx=draft.map((p,i)=>i).filter(i=>draft[i]._k!==undefined&&(nq?norm(draft[i].n||"").includes(nq)||norm(draft[i].c||"").includes(nq)||norm(draft[i].br||"").includes(nq):(admGrp==="*"||(admGrp==="$0"?!(PRODUCTS[draft[i]._k].p>0):groupOf(draft[i].c)===admGrp))));
 const byC={};idx.forEach(i=>{const c=draft[i].c||"بدون قسم";(byC[c]=byC[c]||[]).push(i)});
 const news=draft.map((p,i)=>i).filter(i=>draft[i]._k===undefined);
 let h="";
 if(dirty)h+=`<div class="adirty">✏️ عندك ${dirty} ${dirty===1?"منتج":"منتجات"} ما انحفظت. احفظ كل واحد بزرّه، أو كلهم بالزر تحت.</div>`;
 if(news.length)h+=`<div class="acat new">🆕 منتجات جديدة (لسا ما انحفظت)</div>`+news.map(i=>rowHtml(draft[i],i)).join("");
 const quick=admGrp==="$0"&&!nq;
 if(quick)h+=`<div class="qhint">💰 هدول المنتجات لسا ما إلهن سعر، فالزبون ما بيقدر يشتريهن. اكتب السعر (وغيّر الوحدة إذا لازم)، وبالآخر دوس <b>«💾 احفظ كل التعديلات»</b> تحت — بيحفظهن كلهن مرة وحدة. اللي ما بتعرف سعره هلأ اتركه فاضي.</div>`;
 h+=Object.entries(byC).map(([c,L])=>`<div class="acat">${esc(c)} <em>${L.length}</em></div>`+L.map(i=>quick?quickRow(draft[i],i):rowHtml(draft[i],i)).join("")).join("");
 $("admList").innerHTML=h||`<p class="u">${admQ?"ما لقينا منتج بهالاسم.":"ما في أغراض. دوس \"أضف غرض جديد\"."}</p>`;
 updSaveBtn();
}
function admRow(i){let r=$("ar-"+i);if(!r&&draft[i]){admQ="";if($("admQ"))$("admQ").value="";admGrp=groupOf(draft[i].c);renderAdmin();r=$("ar-"+i)}return r}
function markDirty(i){const p=draft[i];if(!p)return;p._d=1;setTimeout(()=>{keepDraft();updSaveBtn()},0);const r=$("ar-"+i);if(r){r.classList.add("dirty");const s=r.querySelector(".asvst");if(s)s.textContent="✏️ في تعديل ما انحفظ"}}
function keepDraft(){const D={};draft.forEach(p=>{if(p._d&&p._k!==undefined){const q={...p};delete q.img;delete q.imgs;D[PRODUCTS[p._k]?PRODUCTS[p._k].n:p.n]=q}});LSset("dk_admDraft",D)}
function applyDraft(){const D=LS("dk_admDraft",{});let n=0;for(const [name,q] of Object.entries(D)){const i=draft.findIndex(p=>p._k!==undefined&&PRODUCTS[p._k].n===name);if(i<0)continue;const keep={img:draft[i].img,imgs:draft[i].imgs,_k:draft[i]._k};draft[i]={...q,...keep,_d:1};n++}return n}
function sanP(p){return {id:p.id||("p"+Date.now().toString(36)+Math.random().toString(36).slice(2,5)),
  c:(p.c||"").trim()||"عام", n:p.n.trim(), u:(p.u||"").trim()||"وحدة",
  p:Math.max(0,+p.p||0), e:(p.e||"").trim()||"🛒", ...(p.img?{img:p.img}:{}),
  ...(p.s?{s:true}:{}), ...(p.s&&+p.op>0?{op:+p.op}:{}), ...(p.oos?{oos:true}:{}), ...(p.top?{top:true}:{}), ...(p.nw?{nw:true}:{}), ...(p.wk?{wk:true}:{}),
  ...(p.bq>1&&p.bp>0?{bq:+p.bq,bp:+p.bp}:{}), ...((p.br||"").trim()?{br:p.br.trim()}:{}), ...((p.d||"").trim()?{d:p.d.trim()}:{}), ...(Array.isArray(p.imgs)&&p.imgs.length?{imgs:p.imgs}:{})}}
async function admPublish(list,note,focusName){
 $("am").style.color="var(--mut)";$("am").textContent="عم أحفظ...";
 try{await FB.saveCatalog(list)}catch(e){keepDraft();$("am").style.color="var(--r)";$("am").textContent="⚠️ ما انحفظ: "+((e&&e.message)||e)+". تعديلاتك محفوظة على تلفونك، جرّب كمان مرة.";return false}
 PRODUCTS.splice(0,PRODUCTS.length,...list);
 const keepG=admGrp;draft=PRODUCTS.map((p,k)=>({...p,_k:k}));admGrp=keepG;renderAdmin();
 drawCats();drawGrid();drawBar();
 $("am").style.color="var(--g)";$("am").textContent=note+" — وصل لكل الزبائن";
 if(focusName){const i=draft.findIndex(p=>p.n===focusName);const row=i>=0?admRow(i):null;if(row){row.classList.add("flash","saved");row.scrollIntoView({block:"center"})}}
 return true}
function saveRows(ids,delK){
 let others=draft.map((p,i)=>i).filter(i=>(draft[i]._d||draft[i]._k===undefined)&&!ids.includes(i)&&(draft[i].n||"").trim());
 if(others.length)ids=ids.concat(others);
 const list=PRODUCTS.map(p=>({...p}));const add=[];
 for(const i of ids){const p=draft[i];if(!p||!(p.n||"").trim()){$("am").style.color="var(--r)";$("am").textContent="لازم يكون للمنتج اسم قبل الحفظ.";admRow(i)?.scrollIntoView({block:"center"});return}
  if(p._k!==undefined)list[p._k]=p;else add.push(p)}
 let out=list.concat(add);if(delK!==undefined)out=out.filter((p,k)=>k!==delK);
 const one=ids.length===1&&delK===undefined?draft[ids[0]].n.trim():"";
 if(!out.length){$("am").textContent="لازم يضل غرض واحد ع الأقل.";return}
 const prevD=LS("dk_admDraft",{});{const D={...prevD};ids.forEach(i=>{const p=draft[i];if(p&&p._k!==undefined)delete D[PRODUCTS[p._k].n]});LSset("dk_admDraft",D)}
 admPublish(out.map(sanP),delK!==undefined?"🗑 انحذف المنتج":one?`✓ انحفظ «${one.split(" (")[0]}»`:`✓ انحفظ ${ids.length} منتجات`,one);
}
function restoreAdm(){const r=LS("dk_admRe",null);if(!r)return;try{localStorage.removeItem("dk_admRe")}catch(e){}if(Date.now()-r.t>120000)return;
 admGrp=r.g||"";openAdm();$("am").style.color="var(--g)";$("am").textContent=r.msg||"✓ انحفظ";
 if(r.n){const i=draft.findIndex(p=>p.n===r.n);const row=i>=0?admRow(i):null;if(row){row.classList.add("flash","saved");setTimeout(()=>row.scrollIntoView({block:"center"}),100)}}}
$("ax").onclick=()=>$("adm").style.display="none";
$("aaddnew").onclick=()=>{
 draft.push({c:curCat(),n:"",p:0,u:"كيلو",e:"🛒"});
 renderAdmin();
 const last=admRow(draft.length-1);
 last?.classList.add("flash");
 last?.scrollIntoView({behavior:"smooth",block:"center"});
 last?.querySelector(".an")?.focus();
 $("am").style.color="var(--mut)";$("am").textContent="✓ انضاف غرض جديد فاضي تحت. عبّي بياناته.";
};

// ===== أضف غرض بالصورة: تصوير من الموبايل + تحسين الصورة + كلود بيحزر الاسم والقسم =====
let smp=null;
(async()=>{
 try{smp=await claude.use("sample")}catch(e){smp=null}
 if(smp){$("acamnew").style.display="block";$("aihint").style.display="block"}
})();
function medianOf(a){a.sort((x,y)=>x-y);const n=a.length;if(!n)return 255;return n%2?a[(n-1)/2]:Math.round((a[n/2-1]+a[n/2])/2)}
function estimateBg(d,w,h){
 const rs=[],gs=[],bs=[],step=Math.max(1,Math.floor(Math.min(w,h)/80));
 for(let x=0;x<w;x+=step){for(const y of [0,1,h-2,h-1]){if(y<0||y>=h)continue;const i=(y*w+x)*4;rs.push(d[i]);gs.push(d[i+1]);bs.push(d[i+2])}}
 for(let y=0;y<h;y+=step){for(const x of [0,1,w-2,w-1]){if(x<0||x>=w)continue;const i=(y*w+x)*4;rs.push(d[i]);gs.push(d[i+1]);bs.push(d[i+2])}}
 return [medianOf(rs),medianOf(gs),medianOf(bs)];
}
function whitenBg(ctx,w,h,tol){
 tol=tol||34;
 const id=ctx.getImageData(0,0,w,h),d=id.data,n=w*h,bg=estimateBg(d,w,h);
 const isBgColor=new Uint8Array(n);
 for(let k=0;k<n;k++){
  const pi=k*4,r=d[pi],g=d[pi+1],b=d[pi+2];
  const dr=r-bg[0],dg=g-bg[1],db=b-bg[2];
  const dist=Math.sqrt(dr*dr+dg*dg+db*db);
  const sat=Math.max(r,g,b)-Math.min(r,g,b);
  if(dist<tol||(sat<40&&dist<tol*2.6))isBgColor[k]=1;
 }
 const reached=new Uint8Array(n),visited=new Uint8Array(n);
 const qx=new Int32Array(n),qy=new Int32Array(n);
 let qh=0,qt=0;
 function idxOf(x,y){return y*w+x}
 function push(x,y){
  const k=idxOf(x,y);
  if(visited[k]||!isBgColor[k])return;
  visited[k]=1;reached[k]=1;
  qx[qt]=x;qy[qt]=y;qt++;
 }
 for(let x=0;x<w;x++){push(x,0);push(x,h-1)}
 for(let y=0;y<h;y++){push(0,y);push(w-1,y)}
 while(qh<qt){
  const x=qx[qh],y=qy[qh];qh++;
  const nb=[[x-1,y],[x+1,y],[x,y-1],[x,y+1]];
  for(const[nx,ny] of nb){
   if(nx<0||ny<0||nx>=w||ny>=h)continue;
   const nk=idxOf(nx,ny);
   if(visited[nk])continue;
   visited[nk]=1;
   if(isBgColor[nk]){reached[nk]=1;qx[qt]=nx;qy[qt]=ny;qt++}
  }
 }
 const feather=new Uint8Array(n);
 for(let y=0;y<h;y++){
  for(let x=0;x<w;x++){
   const k=idxOf(x,y);
   if(reached[k])continue;
   let nearBg=false;
   for(const[nx,ny] of [[x-1,y],[x+1,y],[x,y-1],[x,y+1],[x-1,y-1],[x+1,y-1],[x-1,y+1],[x+1,y+1]]){
    if(nx<0||ny<0||nx>=w||ny>=h)continue;
    if(reached[idxOf(nx,ny)]){nearBg=true;break}
   }
   if(nearBg)feather[k]=1;
  }
 }
 for(let k=0;k<n;k++){
  const pi=k*4;
  if(reached[k]){d[pi]=255;d[pi+1]=255;d[pi+2]=255}
  else if(feather[k]){
   const t=0.4;
   d[pi]=Math.round(255*t+d[pi]*(1-t));
   d[pi+1]=Math.round(255*t+d[pi+1]*(1-t));
   d[pi+2]=Math.round(255*t+d[pi+2]*(1-t));
  }
 }
 ctx.putImageData(id,0,0);
}
function cropSquare(file,size){
 return new Promise((resolve,reject)=>{
  const img=new Image(),url=URL.createObjectURL(file);
  img.onload=()=>{
   try{
    URL.revokeObjectURL(url);
    const iw=img.naturalWidth||1,ih=img.naturalHeight||1;
    const cap=1000,capScale=Math.min(1,cap/Math.max(iw,ih));
    const pw=Math.max(1,Math.round(iw*capScale)),ph=Math.max(1,Math.round(ih*capScale));
    const pcv=document.createElement("canvas");pcv.width=pw;pcv.height=ph;
    const pctx=pcv.getContext("2d");
    pctx.drawImage(img,0,0,iw,ih,0,0,pw,ph);
    try{whitenBg(pctx,pw,ph,38)}catch(e){}
    const scale=Math.min(size/pw,size/ph);
    const dw=Math.max(1,Math.round(pw*scale)),dh=Math.max(1,Math.round(ph*scale));
    const dx=Math.round((size-dw)/2),dy=Math.round((size-dh)/2);
    const cv=document.createElement("canvas");cv.width=size;cv.height=size;
    const ctx=cv.getContext("2d");
    ctx.fillStyle="#ffffff";ctx.fillRect(0,0,size,size);
    if(ctx.filter!==undefined)ctx.filter="contrast(1.06) saturate(1.1) brightness(1.02)";
    ctx.drawImage(pcv,0,0,pw,ph,dx,dy,dw,dh);
    resolve(cv.toDataURL("image/jpeg",.9));
   }catch(err){reject(err)}
  };
  img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error("bad image"))};
  img.src=url;
 });
}
function loadImageEl(file){
 return new Promise((resolve,reject)=>{
  const img=new Image(),url=URL.createObjectURL(file);
  img.onload=()=>{URL.revokeObjectURL(url);resolve(img)};
  img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error("bad image"))};
  img.src=url;
 });
}
function drawRawCanvas(img,cap){
 const iw=img.naturalWidth||1,ih=img.naturalHeight||1;
 const capScale=Math.min(1,cap/Math.max(iw,ih));
 const pw=Math.max(1,Math.round(iw*capScale)),ph=Math.max(1,Math.round(ih*capScale));
 const cv=document.createElement("canvas");cv.width=pw;cv.height=ph;
 const ctx=cv.getContext("2d");
 ctx.drawImage(img,0,0,iw,ih,0,0,pw,ph);
 return cv;
}
async function aiAnalyzeProduct(rawDataUrl,hintText){
 if(!smp)return null;
 try{
  const caps=await smp.limits().catch(()=>null);
  if(!caps||!caps.images)return null;
  const blob=await(await fetch(rawDataUrl)).blob();
  const catList=[...new Set(draft.map(p=>p.c).filter(Boolean))].join("، ")||"عام";
  const extra=hintText?(' ملاحظة من صاحب الدكانة: "'+hintText+'". إذا ذكر سعر أو اسم أو قسم بالملاحظة، استخدمه بالظبط.'):"";
  const j=await smp.json(
   'هاي صورة ملتقطة بمحل بقالة، ممكن يكون فيها أكتر من غرض جنب بعض أو خلفية فيها رف أو سلة أو أشياء تانية. حدد الغرض الرئيسي (الأوضح والأقرب للكاميرا، يلي المفروض يتصوّر لحاله) وطلعلي بس JSON على هالشكل بالظبط، بدون أي كلام ثاني: '
   +'{"name":"اسم الغرض بالعربي مختصر متل ما مكتوب أو معروف","category":"أقرب قسم من هاي القائمة، وإذا ولا وحدة مناسبة اقترح قسم جديد قصير","unit":"وحدة البيع الأنسب متل كيلو أو قنينة أو علبة أو كيس أو حبة","price":"رقم السعر بالشيكل إذا مذكور بالملاحظة، غير هيك 0","crop":{"x0":0.0,"y0":0.0,"x1":1.0,"y1":1.0}}. '
   +'قيم crop لازم تكون كسور عشرية من 0 لـ1 نسبة لعرض وطول الصورة الأصلية، وتحدد أضيق مربع ممكن حوالين الغرض الرئيسي بس (بعيد قد ما يمكن عن أي منتج تاني جنبو أو خلفية الرف أو السلة). '
   +"الأقسام الموجودة حاليا بالدكانة: "+catList+"."+extra,
   {images:blob,modelTier:"quick",cache:false}
  );
  return j&&typeof j==="object"?j:null;
 }catch(err){return null}
}
async function smartCropSquare(file,size,hintText){
 const img=await loadImageEl(file);
 const rawCv=drawRawCanvas(img,1280);
 const rawUrl=rawCv.toDataURL("image/jpeg",.88);
 const guess=await aiAnalyzeProduct(rawUrl,hintText);
 const rawCtx=rawCv.getContext("2d");
 try{whitenBg(rawCtx,rawCv.width,rawCv.height,34)}catch(e){}
 let sx=0,sy=0,sw=rawCv.width,sh=rawCv.height;
 if(guess&&guess.crop&&typeof guess.crop==="object"){
  let x0=+guess.crop.x0,y0=+guess.crop.y0,x1=+guess.crop.x1,y1=+guess.crop.y1;
  if([x0,y0,x1,y1].every(v=>isFinite(v))){
   x0=Math.max(0,Math.min(1,x0));y0=Math.max(0,Math.min(1,y0));
   x1=Math.max(0,Math.min(1,x1));y1=Math.max(0,Math.min(1,y1));
   if(x1>x0+0.05&&y1>y0+0.05){
    const pad=0.035;
    x0=Math.max(0,x0-pad);y0=Math.max(0,y0-pad);
    x1=Math.min(1,x1+pad);y1=Math.min(1,y1+pad);
    sx=Math.round(x0*rawCv.width);sy=Math.round(y0*rawCv.height);
    sw=Math.max(1,Math.round((x1-x0)*rawCv.width));sh=Math.max(1,Math.round((y1-y0)*rawCv.height));
   }
  }
 }
 const pcv=document.createElement("canvas");pcv.width=sw;pcv.height=sh;
 const pctx=pcv.getContext("2d");
 pctx.drawImage(rawCv,sx,sy,sw,sh,0,0,sw,sh);
 try{whitenBg(pctx,sw,sh,30)}catch(e){}
 const scale=Math.min(size/sw,size/sh);
 const dw=Math.max(1,Math.round(sw*scale)),dh=Math.max(1,Math.round(sh*scale));
 const dx=Math.round((size-dw)/2),dy=Math.round((size-dh)/2);
 const cv=document.createElement("canvas");cv.width=size;cv.height=size;
 const ctx=cv.getContext("2d");
 ctx.fillStyle="#ffffff";ctx.fillRect(0,0,size,size);
 if(ctx.filter!==undefined)ctx.filter="contrast(1.06) saturate(1.1) brightness(1.02)";
 ctx.drawImage(pcv,0,0,sw,sh,dx,dy,dw,dh);
 const dataUrl=cv.toDataURL("image/jpeg",.9);
 return {dataUrl,guess};
}

$("acamnew").onclick=()=>{if(!$("acamnew").disabled)$("camIn").click()};
$("camIn").onchange=async e=>{
 const f=e.target.files&&e.target.files[0];e.target.value="";
 if(!f)return;
 const camLabel=$("acamnew").textContent;
 $("acamnew").disabled=true;$("aaddnew").disabled=true;
 $("acamnew").textContent="⏳ عم أعزل الغرض وأحزر الاسم...";
 $("am").style.color="var(--mut)";$("am").textContent="عم أعزل الغرض عن أي شي جنبو، أحط خلفية بيضا، وأحزر الاسم والقسم... ممكن ياخد شوي وقت.";
 try{
  let dataUrl,guess=null;
  try{
   const res=await smartCropSquare(f,640,null);
   dataUrl=res.dataUrl;guess=res.guess;
  }
  catch(err){$("am").style.color="var(--r)";$("am").textContent="ما قدرنا نقرا الصورة. جرب صورة ثانية.";return}
  const sug={n:"",c:curCat(),u:"قطعة",p:0};
  if(guess&&typeof guess==="object"){
   if(guess.name)sug.n=String(guess.name).trim();
   if(guess.category)sug.c=String(guess.category).trim();
   if(guess.unit)sug.u=String(guess.unit).trim();
   if(guess.price)sug.p=Math.max(0,+guess.price||0);
  }
  draft.push({c:sug.c||"عام",n:sug.n,p:sug.p||0,u:sug.u||"قطعة",e:"🛒",img:dataUrl});
  renderAdmin();
  $("am").style.color=sug.n?"var(--mut)":"var(--r)";
  $("am").textContent=(sug.n?"✓ ضفنا الغرض من الصورة (تحت). راجع الاسم والقسم والسعر قبل ما تحفظ.":"✓ ضفنا الغرض والصورة (تحت)، بس ما قدرنا نحزر الاسم. اكتبه إنت.");
  const last=admRow(draft.length-1);
  last?.classList.add("flash");
  last?.scrollIntoView({behavior:"smooth",block:"center"});
  last?.querySelector(".an")?.focus();
 }catch(err){
  $("am").style.color="var(--r)";$("am").textContent="صار خطأ وإحنا عم نعالج الصورة. جرب مرة كمان.";
 }finally{
  $("acamnew").disabled=false;$("acamnew").textContent=camLabel;$("aaddnew").disabled=false;
 }
};
if($("admTabs"))$("admTabs").onclick=e=>{const b=e.target.closest("[data-ag]");if(!b)return;admGrp=b.dataset.ag;admQ="";$("admQ").value="";renderAdmin();$("admList").scrollIntoView({block:"start"})};
if($("admQ"))$("admQ").oninput=e=>{admQ=e.target.value.trim();renderAdmin()};
$("admList").oninput=e=>{
 const i=e.target.dataset.i,f=e.target.dataset.f;
 if(i===undefined)return;markDirty(+i);
 if(f==="s"){draft[i].s=e.target.checked;renderAdmin();return}
 if(f==="oos"){draft[i].oos=e.target.checked;return}
 if(f==="top"||f==="nw"||f==="wk"){draft[i][f]=e.target.checked;return}
 if(f==="bd"){
  if(e.target.checked){draft[i].bq=draft[i].bq&&draft[i].bq>1?draft[i].bq:2;draft[i].bp=draft[i].bp&&draft[i].bp>0?draft[i].bp:Math.max(0,Math.round((+draft[i].p||0)*1.8*100)/100)}
  else{delete draft[i].bq;delete draft[i].bp}
  renderAdmin();return;
 }
 if(f==="bq"){draft[i].bq=Math.max(2,parseInt(e.target.value)||2);return}
 if(f==="bp"){draft[i].bp=parseFloat(String(e.target.value).replace(",","."))||0;return}
 draft[i][f]=(f==="p"||f==="op")?(parseFloat(String(e.target.value).replace(",","."))||0):e.target.value;
};
$("admList").onclick=e=>{
 {const sv=e.target.closest("[data-sv]");if(sv){saveRows([+sv.dataset.sv]);return}}
 if(e.target.dataset.del!==undefined){const i=+e.target.dataset.del,p=draft[i];
  if(p._k===undefined){draft.splice(i,1);renderAdmin();return}
  askYes(`تحذف «${(p.n||"").split(" (")[0]}» من الموقع نهائيًا؟`,"🗑 احذفه","لا").then(ok=>{if(ok)saveRows([],p._k)});return}
 const up=e.target.dataset.up,dn=e.target.dataset.dn;
 if(up===undefined&&dn===undefined)return;
 const i=+(up??dn);draft[i]._d=1;
 draft[i].p=Math.max(0,Math.round((( +draft[i].p||0)+(up!==undefined?.5:-.5))*100)/100);
 renderAdmin();
};

$("asave").onclick=async()=>{
 const list=draft.filter(p=>p.n&&p.n.trim()).map(sanP);
 if(!list.length){$("am").textContent="لازم يضل غرض واحد ع الأقل قبل الحفظ.";return}
 const prevAll=LS("dk_admDraft",{});LSset("dk_admDraft",{});admPublish(list,"✓ انحفظت كل التعديلات","").then(ok=>{if(!ok)LSset("dk_admDraft",prevAll)});
};

function navGo(w,btn){document.querySelectorAll("#bnav button").forEach(b=>b.classList.toggle("on",b===btn&&w!=="cart"));pgClose();const cp=$("catPage");if(cp&&w!=="cats")cp.style.display="none";
 if(w==="home"){cur="الكل";sub="";term="";const q=$("q");if(q)q.value="";drawCats();drawGrid();window.scrollTo({top:0,behavior:"smooth"})}
 else if(w==="cats")openCatPage();
 else if(w==="search"){const q=$("q");if(q){q.scrollIntoView({behavior:"smooth",block:"center"});setTimeout(()=>q.focus(),250)}}
 else if(w==="favs")showFavs();
 else if(w==="cart")$("open").click()}
window.navGo=navGo;
// ===== نقل منتج لقسم ثاني: سحب وإفلات (أو كبسة) =====
function allCats(){const have=new Set(draft.map(p=>p.c).filter(Boolean));const out=[];
 [...GROUPS,OTHER].forEach(g=>{const cs=[...new Set([...g.c.filter(c=>have.has(c)),...[...have].filter(c=>groupOf(c)===g.n&&!g.c.includes(c))])];if(cs.length)out.push({g,cs})});return out}
let drg=null;
function dropPanel(i,mode){const p=draft[i];let el=$("dropPanel");if(!el){el=document.createElement("div");el.id="dropPanel";document.body.appendChild(el)}
 el.className="dpanel"+(mode==="tap"?" tap":"");
 el.innerHTML=`<div class="dph"><b>${mode==="tap"?"لوين بدك تنقل":"اسحب لهون"} «${esc((p.n||"").split(" (")[0])}»؟</b><button type="button" data-dpx aria-label="إغلاق">×</button></div><div class="dpb">${allCats().map(({g,cs})=>`<div class="dpg"><span>${g.i} ${esc(g.n)}</span><div>${cs.map(c=>`<button type="button" class="dz${c===p.c?" cur":""}" data-dz="${esc(c)}">${esc(c)}</button>`).join("")}</div></div>`).join("")}</div>`;
 el.style.display="flex";el.onclick=e=>{if(e.target.closest("[data-dpx]")){closeDrop();return}const z=e.target.closest("[data-dz]");if(z&&el.classList.contains("tap"))moveTo(i,z.dataset.dz)}}
function closeDrop(){const el=$("dropPanel");if(el)el.style.display="none";const gh=$("dragGhost");if(gh)gh.remove();drg=null}
function moveTo(i,c){closeDrop();const p=draft[i];if(!p||!c||p.c===c)return;const old=p.c;p.c=c;markDirty(i);renderAdmin();
 $("am").style.color="var(--g)";$("am").textContent=`✓ «${(p.n||"").split(" (")[0]}» انتقل من «${old}» لـ «${c}» — دوس «💾 احفظ كل التعديلات» تحت.`;$("am").scrollIntoView({block:"nearest"})}
$("admList").addEventListener("pointerdown",e=>{const h=e.target.closest("[data-drag]");if(!h)return;e.preventDefault();const i=+h.dataset.drag;
 drg={i,x:e.clientX,y:e.clientY,moved:false,id:e.pointerId,over:null};try{h.setPointerCapture(e.pointerId)}catch(_){}
 h.onpointermove=ev=>{if(!drg)return;const dx=ev.clientX-drg.x,dy=ev.clientY-drg.y;
  if(!drg.moved&&Math.hypot(dx,dy)>8){drg.moved=true;dropPanel(i,"drag");const p=draft[i],g=document.createElement("div");g.id="dragGhost";g.className="dghost";g.innerHTML=(p.img?`<img src="${p.img}" alt="">`:`<span>${p.e||"🛒"}</span>`)+`<b>${esc((p.n||"").split(" (")[0])}</b>`;document.body.appendChild(g);if(navigator.vibrate)try{navigator.vibrate(15)}catch(_){}}
  if(!drg.moved)return;const g=$("dragGhost");if(g){g.style.left=ev.clientX+"px";g.style.top=ev.clientY+"px"}
  const t=document.elementFromPoint(ev.clientX,ev.clientY);const z=t&&t.closest&&t.closest("[data-dz]");if(drg.over&&drg.over!==z)drg.over.classList.remove("hov");if(z)z.classList.add("hov");drg.over=z;
  const pb=document.querySelector("#dropPanel .dpb");if(pb){const r=pb.getBoundingClientRect();if(ev.clientY<r.top+30&&ev.clientY>r.top-10)pb.scrollTop-=12;else if(ev.clientY>r.bottom-30)pb.scrollTop+=12}};
 h.onpointerup=h.onpointercancel=ev=>{h.onpointermove=h.onpointerup=h.onpointercancel=null;if(!drg)return;const st=drg;
  if(!st.moved){drg=null;dropPanel(i,"tap");return}
  const z=st.over;closeDrop();if(z&&ev.type==="pointerup")moveTo(i,z.dataset.dz)}});
// ===== إعدادات الدكانة (المشرف) =====
let cpRows=[];
function renderCfg(){const el=$("cfgForm");if(!el)return;const C=CFG;
 cpRows=Object.entries(COUPONS).map(([code,v])=>({code,kind:v.pct?"pct":"amt",val:v.pct||v.amt||"",min:v.min||"",show:!!v.show}));
 const slots=(Array.isArray(C.slots)?C.slots:DELIVERY_SLOTS).map(s=>s[0]+"-"+s[1]).join("، ");
 const f=(id,label,val,ph,extra)=>`<label class="cfl"><span>${label}</span><input id="${id}" value="${esc(val==null?"":String(val))}" placeholder="${esc(ph||"")}" ${extra||""}></label>`;
 el.innerHTML=`<div class="cfsec">🚚 التوصيل</div>
 <div class="cfg2">${f("cfFee","سعر التوصيل ₪",C.fee,"فاضي = بنحكيه على واتساب",'inputmode="decimal"')}${f("cfFree","توصيل مجاني فوق ₪",C.freeOver,"فاضي = ما في",'inputmode="decimal"')}</div>
 <div class="cfg2">${f("cfMin","الحد الأدنى للطلب ₪",C.minOrder,"فاضي = ما في",'inputmode="decimal"')}${f("cfEta","وقت التوصيل السريع",C.eta,"خلال ساعة لساعتين تقريبًا")}</div>
 ${f("cfSlots","مواعيد التوصيل (من-لـ بالساعات)",slots,"مثلًا: 10-12، 12-14، 16-18")}
 ${f("cfAreas","مناطق التوصيل",C.areas,"مثلًا: كفر قاسم، جلجولية، كفر برا")}
 ${f("cfPick","وقت تجهيز الاستلام من الدكانة",C.pickEta,"بيكون جاهز خلال نص ساعة تقريبًا")}
 <div class="cfsec">🏪 الدكانة</div>
 ${f("cfHours","ساعات العمل",C.hours,"مثلًا: كل يوم 7:00–22:00، الجمعة لحد 16:00")}
 ${f("cfLoc","العنوان",C.loc,"مثلًا: الشارع الرئيسي، جنب الجامع")}
 ${f("cfMaps","رابط الخريطة (Google Maps أو Waze)",C.maps,"https://maps.app.goo.gl/...",'dir="ltr" inputmode="url"')}
 <label class="cfchk"><input type="checkbox" id="cfCard" ${C.card===false?"":"checked"}> 💳 الدفع ببطاقة عند الاستلام متاح (الموصّل معه جهاز)</label>
 <div class="cfsec">🎟️ كوبونات الخصم</div><div id="cpList"></div><button type="button" class="sv svg" id="cpAdd" style="margin-top:6px">+ كوبون جديد</button>
 <button type="button" class="sv" id="cfSave">💾 احفظ الإعدادات</button><div id="cfMsg" class="u"></div>`;
 drawCp()}
function drawCp(){const el=$("cpList");if(!el)return;el.innerHTML=cpRows.length?cpRows.map((c,k)=>`<div class="cprw" data-ck="${k}"><input data-cf="code" value="${esc(c.code)}" placeholder="الكود" dir="ltr"><select data-cf="kind"><option value="pct" ${c.kind==="pct"?"selected":""}>%</option><option value="amt" ${c.kind==="amt"?"selected":""}>₪</option></select><input data-cf="val" value="${esc(String(c.val))}" placeholder="القيمة" inputmode="decimal"><input data-cf="min" value="${esc(String(c.min))}" placeholder="فوق ₪" inputmode="decimal"><label title="يبين بصفحة العروض"><input type="checkbox" data-cf="show" ${c.show?"checked":""}> يبين</label><button type="button" data-cx="${k}" aria-label="احذف">✕</button></div>`).join(""):`<p class="u">ما في كوبونات. مثال: WELCOME10 = خصم 10% لأول طلب.</p>`}
function readCp(){document.querySelectorAll("#cpList [data-ck]").forEach(r=>{const c=cpRows[+r.dataset.ck];r.querySelectorAll("[data-cf]").forEach(x=>{const k=x.dataset.cf;c[k]=x.type==="checkbox"?x.checked:x.value})})}
if($("cfgBox"))$("cfgBox").addEventListener("toggle",()=>{if($("cfgBox").open&&!$("cfSave"))renderCfg()});
if($("cfgBox"))$("cfgBox").addEventListener("click",async e=>{
 if(e.target.id==="cpAdd"){readCp();cpRows.push({code:"",kind:"pct",val:"",min:"",show:true});drawCp();return}
 const x=e.target.closest("[data-cx]");if(x){readCp();cpRows.splice(+x.dataset.cx,1);drawCp();return}
 if(e.target.id!=="cfSave")return;readCp();
 const v=id=>$(id).value.trim(),num=(id,label)=>{const s=v(id).replace(",",".");if(!s)return null;const n=+s;if(!(n>=0)){throw label}return n};
 let N={};try{N.fee=num("cfFee","سعر التوصيل");N.freeOver=num("cfFree","التوصيل المجاني");N.minOrder=num("cfMin","الحد الأدنى")}catch(lbl){$("cfMsg").style.color="var(--r)";$("cfMsg").textContent="⚠️ "+lbl+": اكتب رقم بس.";return}
 const sl=[];for(const part of v("cfSlots").split(/[،,;\n]+/).map(s=>s.trim()).filter(Boolean)){const m=part.match(/^(\d{1,2})(?::00)?\s*[-–]\s*(\d{1,2})(?::00)?$/);if(!m||+m[1]>=+m[2]||+m[2]>24){$("cfMsg").style.color="var(--r)";$("cfMsg").textContent="⚠️ مواعيد التوصيل لازم تكون هيك: 10-12، 16-18";return}sl.push([+m[1],+m[2]])}
 const cps={};for(const c of cpRows){const code=String(c.code||"").trim().toUpperCase().replace(/\s+/g,"");if(!code)continue;const val=+String(c.val).replace(",",".");if(!(val>0)||(c.kind==="pct"&&val>100)){$("cfMsg").style.color="var(--r)";$("cfMsg").textContent="⚠️ قيمة الكوبون "+code+" مش صحيحة.";return}const o=c.kind==="pct"?{pct:val}:{amt:val};const mn=+String(c.min).replace(",",".");if(mn>0)o.min=mn;if(c.show)o.show=true;cps[code]=o}
 CFG={...CFG,...N,slots:sl,eta:v("cfEta"),pickEta:v("cfPick"),areas:v("cfAreas"),hours:v("cfHours"),loc:v("cfLoc"),maps:v("cfMaps"),card:$("cfCard").checked,coupons:cps};
 Object.keys(CFG).forEach(k=>{if(CFG[k]===""||CFG[k]===null)delete CFG[k]});
 $("cfMsg").style.color="var(--mut)";$("cfMsg").textContent="عم أحفظ...";
 const list=PRODUCTS.map(p=>({...p}));const add=[];draft.forEach(p=>{if(!(p.n||"").trim())return;if(p._k!==undefined){if(p._d)list[p._k]=p}else add.push(p)});
 const prevD=LS("dk_admDraft",{});LSset("dk_admDraft",{});
 try{await FB.saveConfig(CFG)}catch(e){$("cfMsg").style.color="var(--r)";$("cfMsg").textContent="⚠️ ما انحفظت الإعدادات: "+((e&&e.message)||e);LSset("dk_admDraft",prevD);return}
 const ok=await admPublish(list.concat(add).map(sanP),"✓ انحفظت إعدادات الدكانة","");if(!ok)LSset("dk_admDraft",prevD);else{$("cfMsg").style.color="var(--g)";$("cfMsg").textContent="✓ انحفظت. عم نحدّث الصفحة…";setTimeout(()=>location.reload(),900)}
 if(!ok){$("cfMsg").style.color="var(--r)";$("cfMsg").textContent=$("am").textContent}});
// ===== الطلبات (لصاحب الدكانة، لايف من قاعدة البيانات) =====
let ORD=[],ordSeen=null,ordFil="open",ordUnsub=null;
const ST_ADM=[["0","✓ استلمنا"],["1","📦 تجهيز"],["2","✓ جاهز"],["3","🛵 خرج"],["4","📍 وصل"],["5","✅ تم"],["-1","❌ ملغي"]];
function startOwner(){if(ordUnsub)return;ordUnsub=FB.watchAllOrders(L=>{const fresh=ordSeen?L.filter(o=>!ordSeen.has(o.id)):[];ordSeen=new Set(L.map(o=>o.id));ORD=L;drawOrders();
  if(fresh.length){beep();toast(`🛎️ طلب جديد: <bdi dir="ltr">#${esc(fresh[0].no)}</bdi> — ${esc(fresh[0].name||"")} • ${fmt(fresh[0].total||0)}`,()=>{openAdm()});const g=$("gear");if(g)g.classList.add("ping")}},e=>{const el=$("ordList");if(el)el.innerHTML=`<p class="u">ما قدرنا نحمّل الطلبات: ${esc(e.message||e)}</p>`})}
function beep(){try{const c=new (window.AudioContext||window.webkitAudioContext)(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=880;g.gain.value=.15;o.start();setTimeout(()=>{o.frequency.value=1320},150);setTimeout(()=>{o.stop();c.close()},320)}catch(e){}}
function drawOrders(){const el=$("ordList");if(!el)return;const open=ORD.filter(o=>o.st>=0&&o.st<5);
 $("ordNew").textContent=open.length?open.length+" مفتوحة":"";
 $("ordFil").innerHTML=[["open","مفتوحة",open.length],["all","الكل",ORD.length]].map(([k,t,n])=>`<button type="button" data-of="${k}" class="${ordFil===k?"on":""}">${t} <em>${n}</em></button>`).join("");
 const L=ordFil==="open"?open:ORD;
 el.innerHTML=L.length?L.map(o=>{const ph=normPhone(o.phone||"");const wa=ph&&phoneOk(ph)?"972"+ph.slice(1):"";
  return `<div class="ocard adm-o${o.cancelReq&&o.st>=0?" creq":""}" data-oid="${esc(o.id)}"><div class="oh"><b><bdi dir="ltr">#${esc(o.no)}</bdi> • ${esc(o.name||"")}</b><span>${tsTxt(o.ts)}</span></div>
  ${o.cancelReq&&o.st>=0?`<div class="tln warn">⚠️ الزبون طلب إلغاء الطلب</div>`:""}
  <div class="oi"><b>${fmt(o.total||0)}${o.delUnknown?" + توصيل":""}</b> • ${esc(o.ship||"")} • ${esc(o.pay||"")}</div>
  ${o.addr?`<div class="oitems">📍 ${esc(o.addr)}</div>`:""}${o.phone?`<div class="oitems">📞 <a href="tel:${esc(ph)}" dir="ltr">${esc(o.phone)}</a></div>`:""}
  <div class="oitems">${(o.lines||[]).map(l=>esc(l.n.split(" (")[0])+" "+esc(qTxt(l.q))).join("، ")}</div>${o.notes?`<div class="oitems">📝 ${esc(o.notes)}</div>`:""}
  <div class="ost">${ST_ADM.map(([v,t])=>`<button type="button" data-os="${v}" class="${String(o.st)===v?"on":""}">${t}</button>`).join("")}</div>
  <div class="oext"><input data-oeta placeholder="⏱️ الوقت المتوقع" value="${esc(o.eta&&o.st>0?o.eta:"")}"><input data-onote placeholder="📝 ملاحظة للزبون" value="${esc(o.note||"")}"></div>
  <div class="otpl"><button type="button" data-tp="⚠️ أحد المنتجات غير متوفر: ">⚠️ غير متوفر</button><button type="button" data-tp="🔄 تم استبدال منتج: ">🔄 استبدال</button><button type="button" data-osave>💾 حفظ</button>${wa?`<a target="_blank" rel="noopener" href="https://wa.me/${wa}?text=${encodeURIComponent(stMsg(o.no,o.st,o.eta,o.note))}">💬 واتساب</a>`:""}</div></div>`}).join(""):`<p class="u">${ordFil==="open"?"ما في طلبات مفتوحة 👌":"لسا ما في طلبات."}</p>`}
if($("ostBox"))$("ostBox").addEventListener("click",async e=>{const f=e.target.closest("[data-of]");if(f){ordFil=f.dataset.of;drawOrders();return}
 const card=e.target.closest("[data-oid]");if(!card)return;const o=ORD.find(x=>x.id===card.dataset.oid);if(!o)return;
 const tp=e.target.closest("[data-tp]");if(tp){const n=card.querySelector("[data-onote]");n.value=tp.dataset.tp;n.focus();return}
 const s=e.target.closest("[data-os]"),sv=e.target.closest("[data-osave]");if(!s&&!sv)return;
 const st=s?+s.dataset.os:o.st,eta=card.querySelector("[data-oeta]").value.trim(),note=card.querySelector("[data-onote]").value.trim();
 const v={st,note};if(eta)v.eta=eta;if(st<0||st===0)v.cancelReq=false;
 try{await FB.setStatus(o.id,v);$("gear")&&$("gear").classList.remove("ping")}catch(err){alert("ما انحفظ: "+(err.message||err))}});
// ===== حالات الطلبات (المشرف) =====
const ST_MSG=["✅ تم استلام طلبك رقم #{no} وسنخبرك عندما يخرج للتوصيل.","📦 بدأنا نجهز طلبك #{no}.","✓ طلبك #{no} جاهز.","🛵 طلبك #{no} خرج للتوصيل.","📍 السائق قريب منك — طلبك #{no} وصل.","✅ تم توصيل طلبك #{no}. صحتين وعافية! قيّمنا من «طلباتي» ⭐"];
function stMsg(no,st,eta,note){let m=st<0?`❌ تم إلغاء طلبك #${no}.`:ST_MSG[st].replace("{no}",no);if(eta&&st>=0&&st<5)m+=`\n⏱️ الوقت المتوقع: ${eta}`;if(note)m+=`\n${note}`;return m+`\n— ${SHOP_NAME}`}
function bcText(t){const A=PRODUCTS.filter(p=>!p.oos&&p.p>0),L=(arr)=>arr.slice(0,10).map(p=>`• ${p.n.split(" (")[0]} — ${fmt(p.p)}${p.s&&p.op>p.p?" بدل "+fmt(p.op):""}`).join("\n");
 const pc=Object.entries(COUPONS)[0];
 return ({today:`🔥 عروض اليوم بـ${SHOP_NAME}!\n${L(A.filter(p=>p.s&&!p.wk))||"• (علّم منتجات «على عرض» أول)"}\nاطلب هلأ من الموقع 🛒`,
 week:`📅 عروض الأسبوع بـ${SHOP_NAME}!\n${L(A.filter(p=>p.wk))||"• (علّم منتجات «عرض الأسبوع» أول)"}\nالعروض لآخر الأسبوع 🛒`,
 coupon:`🎟️ كوبون خاص إلك: ${pc?pc[0]:"CODE"}\n${pc?(pc[1].pct?pc[1].pct+"% خصم":fmt(pc[1].amt)+" خصم")+(pc[1].min?" على الطلبات فوق "+fmt(pc[1].min):""):"(ضيف كوبون أول)"}\nاكتبه بالسلة وقت الطلب 🛒`,
 free:`🚚 توصيل مجاني${FREE_DELIVERY_OVER!==null?" لكل طلب فوق "+fmt(FREE_DELIVERY_OVER):" اليوم"}!\nاطلب من ${SHOP_NAME} هلأ 🛒`,
 new:`🆕 وصل جديد على ${SHOP_NAME}:\n${L(A.filter(p=>p.nw))||"• (علّم منتجات «جديد» أول)"}`,custom:""})[t]+(t==="custom"?"":"\n\nلإيقاف رسائل العروض ابعت «إلغاء الاشتراك».")}
if($("bcBox"))$("bcBox").addEventListener("toggle",()=>{if(!$("bcTxt").value)$("bcTxt").value=bcText($("bcT").value)});
if($("bcT"))$("bcT").onchange=()=>{$("bcTxt").value=bcText($("bcT").value)};
if($("bcCopy"))$("bcCopy").onclick=async()=>{try{await navigator.clipboard.writeText($("bcTxt").value);$("bcCopy").textContent="✓ اننسخ"}catch(e){$("bcTxt").select()}};
if($("bcWa"))$("bcWa").onclick=()=>window.open("https://wa.me/?text="+encodeURIComponent($("bcTxt").value),"_blank");

// ===== المساعد الذكي: يحكي مع المشرف وينفذله طلبات (إضافة/تعديل/حذف) عن طريق كلود =====
let chatDisplay=[],chatApi=[];
const SYS_PROMPT="إنت مساعد إدارة دكانة أونلاين اسمها \"دكانتنا\". المشرف (صاحب الدكانة) رح يحكيلك شو بدو: يضيف غرض جديد، يغيّر سعر غرض، يحط غرض بعرض (خصم)، يحدد غرض خلص من المخزون أو رجع متوفر، يحذف غرض، أو يدور على معلومات عن غرض. استخدم الأدوات المتوفرة (list_products, add_product, edit_product, delete_product) لتنفذله الطلب فعلياً بدل ما تحكيلو بس شو لازم يعمل. لو الطلب مو واضح، أو في أكثر من غرض ممكن يقصدهم، استخدم list_products أول شي وبعدين اسأل المشرف يحدد. لا تخترع أسعار أو أسماء أو أقسام من عندك؛ استخدم بس المعلومات يلي المشرف عطاك ياها بوضوح أو يلي موجودة فعلياً بالقائمة. بعد ما تنفذ أي إجراء أكّد بجملة قصيرة وواضحة بالعربي شو صار بالضبط (شو انضاف أو انعدل أو انحذف، والسعر الجديد إذا في). ذكّر المشرف إنو لازم يدوس زر \"احفظ التعديلات\" بعد ما يخلص لتثبيت أي تغيير على الموقع الحي. مهم: إنت (بالمحادثة النصية) ما فيك تضيف أو تعدّل صور بنفسك، بس هاد مو نقص صلاحية دائم — في زر 📎 جنب صندوق الكتابة يخليه يرفق صورة الغرض مباشرة، ولما يرفقها بينضاف الغرض تلقائياً بصورة بخلفية بيضا (أو تنبدّل صورة غرض موجود إذا كتب اسمه مع الصورة). فلو المشرف طلب منك بالنص بس (بدون ما يرفق صورة) إنك تضيف أو تبدّل صورة غرض، قلّه بلطف يستخدم زر 📎 ويرفق الصورة ويكتب اسم الغرض (إذا بدو يبدّل صورة موجودة) أو وصف الغرض (إذا غرض جديد)، ولا تقلّه إنك ما عندك صلاحية.";
function findProductIdx(match){
 if(!match)return -1;
 const m=String(match).trim().toLowerCase();
 if(!m)return -1;
 let idx=draft.findIndex(p=>(p.n||"").toLowerCase()===m);
 if(idx<0)idx=draft.findIndex(p=>(p.n||"").toLowerCase().includes(m));
 return idx;
}
const chatTools=[
 {name:"list_products",description:"دور على منتجات موجودة بالدكانة حسب كلمة بحث بالاسم أو القسم، أو رجّع أول 20 منتج إذا ما في كلمة بحث.",
  inputSchema:{type:"object",properties:{query:{type:"string",description:"كلمة تدور فيها بالاسم أو القسم (اختياري)"}}},
  execute:async({query}={})=>{
   let list=draft;
   if(query){const q=String(query).toLowerCase();list=draft.filter(p=>(p.n||"").toLowerCase().includes(q)||(p.c||"").toLowerCase().includes(q))}
   return list.slice(0,20).map(p=>({name:p.n,category:p.c,unit:p.u,price:p.p,onSale:!!p.s,oldPrice:p.op||null,outOfStock:!!p.oos}));
  }},
 {name:"add_product",description:"ضيف غرض جديد عالدكانة.",
  inputSchema:{type:"object",properties:{
   name:{type:"string",description:"اسم الغرض"},
   category:{type:"string",description:"القسم (متل خضار، فواكه، ورقيات، مشروبات...)"},
   unit:{type:"string",description:"وحدة البيع متل كيلو أو قنينة أو علبة أو حبة"},
   price:{type:"number",description:"السعر بالشيكل"},
   emoji:{type:"string",description:"إيموجي مناسب للغرض (اختياري)"}
  },required:["name","price"]},
  execute:async({name,category,unit,price,emoji}={})=>{
   if(!name||!String(name).trim())return {ok:false,error:"لازم اسم للغرض"};
   const p={c:(category||"عام").trim()||"عام",n:String(name).trim(),u:(unit||"وحدة").trim()||"وحدة",p:Math.max(0,+price||0),e:(emoji||"🛒").trim()||"🛒"};
   draft.push(p);renderAdmin();
   const last=admRow(draft.length-1);
   last?.classList.add("flash");
   last?.scrollIntoView({behavior:"smooth",block:"center"});
   return {ok:true,added:p.n,price:p.p};
  }},
 {name:"edit_product",description:"عدّل غرض موجود: السعر، الاسم، القسم، الوحدة، عرض/خصم، أو حالة التوفر. حدد الغرض بـmatch (اسمه أو جزء منو).",
  inputSchema:{type:"object",properties:{
   match:{type:"string",description:"اسم الغرض المطلوب تعديله أو جزء منو"},
   name:{type:"string",description:"اسم جديد (اختياري)"},
   category:{type:"string"},unit:{type:"string"},
   price:{type:"number",description:"السعر الجديد (اختياري)"},
   sale:{type:"boolean",description:"true لتفعيل عرض/خصم، false لإلغاءه"},
   oldPrice:{type:"number",description:"السعر قبل الخصم، لما sale=true"},
   outOfStock:{type:"boolean",description:"true إذا خلص من المخزون، false إذا رجع متوفر"}
  },required:["match"]},
  execute:async({match,name,category,unit,price,sale,oldPrice,outOfStock}={})=>{
   const idx=findProductIdx(match);
   if(idx<0)return {ok:false,error:"ما لقيت غرض بهاد الاسم. جرب list_products أول."};
   const p=draft[idx];
   if(name)p.n=String(name).trim();
   if(category)p.c=String(category).trim();
   if(unit)p.u=String(unit).trim();
   if(price!==undefined)p.p=Math.max(0,+price||0);
   if(sale!==undefined)p.s=!!sale;
   if(oldPrice!==undefined)p.op=Math.max(0,+oldPrice||0);
   if(outOfStock!==undefined)p.oos=!!outOfStock;
   renderAdmin();
   return {ok:true,updated:p.n,current:{price:p.p,onSale:!!p.s,oldPrice:p.op||null,outOfStock:!!p.oos}};
  }},
 {name:"delete_product",description:"احذف غرض عن طريق اسمه أو جزء من اسمه.",
  inputSchema:{type:"object",properties:{match:{type:"string",description:"اسم الغرض المطلوب حذفه أو جزء منو"}},required:["match"]},
  execute:async({match}={})=>{
   const idx=findProductIdx(match);
   if(idx<0)return {ok:false,error:"ما لقيت غرض بهاد الاسم. جرب list_products أول."};
   const name=draft[idx].n;
   draft.splice(idx,1);renderAdmin();
   return {ok:true,deleted:name};
  }}
];
function addDisplayMsg(role,text){
 chatDisplay.push({role,text});
 const div=document.createElement("div");
 div.className="cmsg "+(role==="user"?"user":"bot");
 div.textContent=text;
 $("chatMsgs").appendChild(div);
 $("chatMsgs").scrollTop=$("chatMsgs").scrollHeight;
}
function addDisplayImg(role,dataUrl){
 const div=document.createElement("div");
 div.className="cmsg "+(role==="user"?"user":"bot")+" cimgmsg";
 const img=document.createElement("img");img.src=dataUrl;img.className="cbimg";
 div.appendChild(img);
 $("chatMsgs").appendChild(div);
 $("chatMsgs").scrollTop=$("chatMsgs").scrollHeight;
}
let pendingImages=[];
function renderPending(){
 const wrap=$("chatPending");
 if(!wrap)return;
 wrap.innerHTML=pendingImages.map((p,i)=>`<span class="cpimg"><img src="${p.previewUrl}"><button type="button" class="cprm" data-i="${i}" aria-label="شيل الصورة">×</button></span>`).join("");
 wrap.style.display=pendingImages.length?"flex":"none";
}
$("chatAttach")?.addEventListener("click",()=>$("chatImgIn").click());
$("chatImgIn")?.addEventListener("change",async e=>{
 const files=[...(e.target.files||[])].slice(0,6);
 e.target.value="";
 for(const f of files){
  try{const u=URL.createObjectURL(f);pendingImages.push({file:f,previewUrl:u})}catch(err){}
 }
 renderPending();
});
$("chatPending")?.addEventListener("click",e=>{
 const i=e.target.dataset.i;
 if(i===undefined)return;
 const removed=pendingImages.splice(+i,1)[0];
 if(removed&&removed.previewUrl){try{URL.revokeObjectURL(removed.previewUrl)}catch(err){}}
 renderPending();
});
async function addProductFromImage(file,hintText){
 let rawPreview=null;
 try{rawPreview=URL.createObjectURL(file)}catch(err){}
 if(rawPreview)addDisplayImg("user",rawPreview);
 if(!smp){addDisplayMsg("assistant","المساعد بيشتغل بس لما تفتح الموقع من حسابك على كلود، مش من رابط GitHub.");return}
 let res;
 try{
  res=await smartCropSquare(file,640,hintText);
 }catch(err){
  addDisplayMsg("assistant","ما قدرت أقرا الصورة. جرب صورة ثانية.");
  return;
 }finally{
  if(rawPreview){try{URL.revokeObjectURL(rawPreview)}catch(err){}}
 }
 const dataUrl=res.dataUrl,guess=res.guess;
 const existingIdx=hintText?findProductIdx(hintText):-1;
 if(existingIdx>=0){
  const p=draft[existingIdx];
  p.img=dataUrl;
  renderAdmin();
  existingIdx>=0&&(draft[existingIdx]._d=1);const row=admRow(existingIdx);
  row?.classList.add("flash");
  row?.scrollIntoView({behavior:"smooth",block:"center"});
  addDisplayImg("assistant",dataUrl);
  addDisplayMsg("assistant","✓ بدّلت صورة \""+p.n+"\" بهاي الصورة (معزولة عن أي شي جنبها، وخلفية بيضا). ما نسيتش تدوس \"احفظ التعديلات\".");
  return;
 }
 const sug={n:"",c:curCat(),u:"قطعة",p:0};
 if(guess&&typeof guess==="object"){
  if(guess.name)sug.n=String(guess.name).trim();
  if(guess.category)sug.c=String(guess.category).trim();
  if(guess.unit)sug.u=String(guess.unit).trim();
  if(guess.price)sug.p=Math.max(0,+guess.price||0);
 }
 draft.push({c:sug.c||"عام",n:sug.n,p:sug.p||0,u:sug.u||"قطعة",e:"🛒",img:dataUrl});
 renderAdmin();
 const last=admRow(draft.length-1);
 last?.classList.add("flash");
 last?.scrollIntoView({behavior:"smooth",block:"center"});
 addDisplayImg("assistant",dataUrl);
 addDisplayMsg("assistant", sug.n?("✓ ضفت \""+sug.n+"\""+(sug.p?(" بسعر "+sug.p+"₪"):" — بس ما عرفت السعر، دخّلو إنت بلوحة التعديل.")):"✓ ضفت الصورة كغرض جديد بس ما قدرت أحزر الاسم. راجعه بلوحة التعديل.");
}
async function sendChat(){
 const val=$("chatIn").value.trim();
 const imgs=pendingImages.slice();
 if(!val&&!imgs.length)return;
 $("chatIn").value="";
 pendingImages=[];renderPending();
 if(imgs.length){
  $("chatSend").disabled=true;
  for(const p of imgs){
   await addProductFromImage(p.file,val);
  }
  $("chatSend").disabled=false;
  return;
 }
 addDisplayMsg("user",val);
 if(!smp){addDisplayMsg("assistant","المساعد بيشتغل بس لما تفتح الموقع من حسابك على كلود، مش من رابط GitHub.");return}
 const apiText=chatApi.length===0?(SYS_PROMPT+"\n\nطلب المشرف: "+val):val;
 chatApi.push({role:"user",content:apiText});
 $("chatSend").disabled=true;
 const thinking=document.createElement("div");
 thinking.className="cmsg bot";thinking.textContent="...";
 $("chatMsgs").appendChild(thinking);$("chatMsgs").scrollTop=$("chatMsgs").scrollHeight;
 try{
  const res=await smp(chatApi,{tools:chatTools,modelTier:"quick",cache:false,onText:({text:t})=>{thinking.textContent=t||"..."}});
  const answer=(res&&res.text)?res.text:"تم.";
  chatApi.push({role:"assistant",content:answer});
  thinking.remove();
  addDisplayMsg("assistant",answer);
 }catch(err){
  thinking.remove();
  addDisplayMsg("assistant","صار خطأ ومقدرتش أكمل الطلب. جرب مرة كمان.");
  chatApi.pop();
 }finally{
  $("chatSend").disabled=false;
 }
}
$("achat")?.addEventListener("click",()=>{$("chatModal").style.display="flex";$("chatIn")?.focus()});
$("chatClose")?.addEventListener("click",()=>{$("chatModal").style.display="none"});
$("chatSend")?.addEventListener("click",sendChat);
$("chatIn")?.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();sendChat()}});

const orderSubs={};
function watchMine(){LS("dk_orders",[]).slice(0,10).forEach(o=>{if(!o.id||orderSubs[o.id]||Date.now()-o.ts>7*864e5)return;orderSubs[o.id]=FB.watchOrder(o.id,x=>{OST[o.no]={st:+x.st||0,eta:x.eta||"",note:x.note||"",t:x.t||0};try{checkOrders()}catch(e){}if(curOrderK>=0&&$("pg").style.display==="flex"){const k=curOrderK,bx=$("pgBody").closest(".cpbox"),st=bx?bx.scrollTop:0;pageOrder(k);if(bx)bx.scrollTop=st}})||1})}
drawCats();drawGrid();drawBar();updFavTop();checkWatch();try{watchMine()}catch(e){}try{checkOrders();checkOffers();updNoteCnt()}catch(e){}
try{drawHero();promoAuto()}catch(e){}

// ===== تثبيت التطبيق (PWA) =====
let instEvt=null;window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();instEvt=e;showInstBar()});
function isStandalone(){return matchMedia("(display-mode: standalone)").matches||navigator.standalone}
function showInstBar(){if(isStandalone()||LS("dk_instx",0)>Date.now())return;if(document.getElementById("instBar"))return;const b=document.createElement("div");b.id="instBar";b.className="instbar";b.innerHTML=`<span>📲 ثبّت تطبيق ${SHOP_NAME} على تلفونك</span><button type="button" id="instGo">تثبيت</button><button type="button" id="instX" aria-label="إغلاق">×</button>`;document.body.appendChild(b);$("instGo").onclick=doInstall;$("instX").onclick=()=>{LSset("dk_instx",Date.now()+7*864e5);b.remove()}}
async function doInstall(){const b=document.getElementById("instBar");if(instEvt){instEvt.prompt();try{await instEvt.userChoice}catch(e){}instEvt=null;if(b)b.remove();return}
 const ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
 pg(`<h3 class="pgt">📲 ثبّت التطبيق</h3>${isStandalone()?`<p class="pgs">✓ التطبيق مثبّت عندك.</p>`:ios?`<p class="pgs">على الآيفون (Safari):</p><div class="kv"><div><span>1</span><b>دوس زر المشاركة ⬆️ تحت</b></div><div><span>2</span><b>اختار «إضافة إلى الشاشة الرئيسية»</b></div><div><span>3</span><b>دوس «إضافة»</b></div></div>`:`<p class="pgs">افتح قائمة المتصفح (⋮) واختار «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».</p>`}`)}
if(/iphone|ipad|ipod/i.test(navigator.userAgent)&&!isStandalone())setTimeout(showInstBar,4000);
window.doInstall=doInstall;
