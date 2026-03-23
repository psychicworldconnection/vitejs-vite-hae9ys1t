import { useState, useEffect, useRef } from "react";


// ── FONTS ──
const fl = document.createElement("link");
fl.href = "https://fonts.googleapis.com/css2?family=Russo+One&family=Nunito:wght@400;600;700;800;900&display=swap";


fl.rel = "stylesheet";

document.head.appendChild(fl);

// ── THEME ──
const G=”#22c55e”,R=”#ef4444”,DARK=”#080c14”,CARD=”#131b2a”,CARD2=”#1a2438”,
MUTED=”#8899bb”,BORDER=“rgba(255,255,255,0.07)”,YELLOW=”#fbbf24”,BLUE=”#60a5fa”;
const RUSSO=”‘Russo One’,sans-serif”;
const BODY=”‘Nunito’,sans-serif”;

// ── SAFETY SCANNER ──
const SCAN = [
/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/,
/\b\d{10}\b/,
/(\d{3})\s?\d{3}[-.\s]?\d{4}/,
/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}/,
/\b(my number|call me|text me|my phone|my email|reach me at|contact me at|venmo|cashapp|zelle|paypal)\b/i,
];
const scanMsg = t => SCAN.some(p => p.test(t));

// ── FAKE LISTINGS DATA ──
const LISTINGS = [
{id:1,emoji:“🚗”,bg:”#0a1a0a”,cat:“Vehicles”,sub:“Cars”,title:“2019 Toyota Camry SE — Low Miles, Clean Title”,price:18500,city:“Houston”,state:“TX”,age:“2h”,badge:“New”,seller:“Marcus J.”,trust:87,verified:true,views:284,saves:12},
{id:2,emoji:“📱”,bg:”#0a0a1a”,cat:“Electronics”,sub:“Phones”,title:“iPhone 15 Pro Max 256GB — Unlocked”,price:850,city:“Miami”,state:“FL”,age:“30m”,badge:“Hot”,seller:“Keisha R.”,trust:92,verified:true,views:512,saves:34},
{id:3,emoji:“🏠”,bg:”#0a0818”,cat:“Real Estate”,sub:“For Sale”,title:“3BR/2BA Home — Great Neighborhood, Move-In Ready”,price:285000,city:“Atlanta”,state:“GA”,age:“1h”,badge:“New”,seller:“David M.”,trust:78,verified:true,views:189,saves:8},
{id:4,emoji:“💎”,bg:”#18100a”,cat:“Jewelry”,sub:“Bracelets”,title:“14K Gold Diamond Tennis Bracelet — Authenticated”,price:1200,city:“Dallas”,state:“TX”,age:“3h”,badge:“New”,seller:“Lisa T.”,trust:95,verified:true,views:97,saves:19},
{id:5,emoji:“🏍️”,bg:”#1a0a0a”,cat:“Vehicles”,sub:“Motorcycles”,title:“2021 Harley Davidson Iron 883 — Garage Kept”,price:9200,city:“Phoenix”,state:“AZ”,age:“5h”,badge:“Hot”,seller:“Tony B.”,trust:88,verified:true,views:341,saves:27},
{id:6,emoji:“💻”,bg:”#080f1a”,cat:“Electronics”,sub:“Laptops”,title:‘MacBook Pro M3 14” — Mint Condition, AppleCare’,price:1650,city:“Las Vegas”,state:“NV”,age:“6h”,badge:“New”,seller:“Amy C.”,trust:91,verified:true,views:203,saves:15},
{id:7,emoji:“🛋️”,bg:”#0f180a”,cat:“Furniture”,sub:“Sofas”,title:“L-Shape Sectional Sofa — Like New, No Pet/Smoke”,price:450,city:“Dallas”,state:“TX”,age:“3h”,badge:“New”,seller:“Ron P.”,trust:74,verified:false,views:88,saves:6},
{id:8,emoji:“🎮”,bg:”#180a1a”,cat:“Gaming”,sub:“Consoles”,title:“PS5 Console + 3 Games + Extra Controller”,price:420,city:“Chicago”,state:“IL”,age:“1h”,badge:“Hot”,seller:“Mike D.”,trust:89,verified:true,views:628,saves:44},
{id:9,emoji:“👶”,bg:”#1a1200”,cat:“Baby Items”,sub:“Strollers”,title:“Baby Jogger City Mini GT2 — Used 6 Months”,price:180,city:“Austin”,state:“TX”,age:“4h”,badge:“New”,seller:“Sarah K.”,trust:96,verified:true,views:67,saves:9},
{id:10,emoji:“🏋️”,bg:”#0a180a”,cat:“Fitness”,sub:“Bikes”,title:“Peloton Bike+ with Shoes — Like New”,price:1200,city:“Denver”,state:“CO”,age:“2h”,badge:“New”,seller:“Chris F.”,trust:85,verified:true,views:154,saves:21},
{id:11,emoji:“🎸”,bg:”#180a0a”,cat:“Music”,sub:“Guitars”,title:“Fender Stratocaster American Pro II — Sunburst”,price:1500,city:“Nashville”,state:“TN”,age:“7h”,badge:“New”,seller:“Brad L.”,trust:93,verified:true,views:112,saves:17},
{id:12,emoji:“🚤”,bg:”#0a1018”,cat:“Vehicles”,sub:“Boats”,title:“2018 Sea Ray 21ft Boat with Trailer — Excellent”,price:22000,city:“Tampa”,state:“FL”,age:“8h”,badge:“New”,seller:“Jake W.”,trust:82,verified:true,views:78,saves:11},
];

const CATS = [“All”,“Vehicles”,“Electronics”,“Real Estate”,“Furniture”,“Jewelry”,“Clothing”,“Gaming”,“Baby Items”,“Fitness”,“Music”,“Boats”,“Tools”,“Free Items”];
const QUICK_REPLIES = [
{icon:“🟢”,text:“Is this still available?”},
{icon:“💰”,text:“Is the price negotiable?”},
{icon:“📍”,text:“Where can we meet?”},
{icon:“📸”,text:“Can you send more photos?”},
{icon:“⏰”,text:“When can I pick this up?”},
{icon:“🤝”,text:“I’ll take it! Let’s meet up.”},
];
const MEETUPS = [
{icon:“☕”,name:“Starbucks”,desc:“Public, busy, well-lit”,safe:“Safest”,sc:G},
{icon:“🏦”,name:“Bank Lobby”,desc:“Secure, has cameras”,safe:“Safest”,sc:G},
{icon:“🚔”,name:“Police Station”,desc:“Safe exchange zone”,safe:“Safest”,sc:G},
{icon:“🛒”,name:“Walmart / Target”,desc:“Public parking, cameras”,safe:“Safest”,sc:G},
{icon:“🏠”,name:“My Home”,desc:“Address shared privately”,safe:“Caution”,sc:YELLOW},
];

// ── HELPERS ──
const fmt = n => `$${n.toLocaleString()}`;
const now = () => new Date().toLocaleTimeString([],{hour:“2-digit”,minute:“2-digit”});

function CartLogo({size=40}) {
return (
<svg width={size} height={size} viewBox="0 0 100 100" fill="none">
<rect width="100" height="100" rx="20" fill="url(#lg)"/>
<defs>
<linearGradient id="lg" x1="0" y1="0" x2="100" y2="100">
<stop offset="0%" stopColor="#1e3a2a"/>
<stop offset="100%" stopColor="#0a1520"/>
</linearGradient>
</defs>
<path d="M18 28L27 28L38 62L74 62L82 36L32 36" stroke="#22c55e" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
<circle cx="44" cy="73" r="5.5" fill="#22c55e"/>
<circle cx="67" cy="73" r="5.5" fill="#22c55e"/>
<path d="M62 20L76 20M69 13L76 20L69 27" stroke="#ef4444" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M38 20L24 20M31 13L24 20L31 27" stroke="#22c55e" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
);
}

function Logo({onClick,size=“md”}) {
const fs={sm:17,md:22,lg:36}[size];
const ns={sm:22,md:30,lg:46}[size];
const ms={sm:8,md:9,lg:12}[size];
const is={sm:30,md:40,lg:56}[size];
return (
<div onClick={onClick} style={{display:“flex”,alignItems:“center”,gap:10,cursor:“pointer”,userSelect:“none”}}>
<CartLogo size={is}/>
<div style={{display:“flex”,flexDirection:“column”,lineHeight:1}}>
<span style={{fontFamily:RUSSO,fontSize:fs,color:“white”,letterSpacing:0.5}}>
Buy<span style={{color:G,fontSize:ns}}>N</span>Sell
</span>
<span style={{fontFamily:RUSSO,fontSize:ms,color:MUTED,letterSpacing:3,textTransform:“uppercase”}}>
Marketplace
</span>
</div>
</div>
);
}

function Nav({page,setPage,openAuth,city,user}) {
return (
<nav style={{position:“sticky”,top:0,zIndex:200,background:“rgba(8,12,20,0.97)”,backdropFilter:“blur(20px)”,borderBottom:`1px solid ${BORDER}`,padding:“0 20px”,height:64,display:“flex”,alignItems:“center”,gap:12}}>
<Logo onClick={()=>setPage(“home”)}/>
<div style={{flex:1,display:“flex”,alignItems:“center”,background:“rgba(255,255,255,.05)”,border:`1px solid ${BORDER}`,borderRadius:10,padding:“0 14px”,gap:8,maxWidth:480}}>
<span style={{fontSize:15}}>🔍</span>
<input style={{flex:1,background:“none”,border:“none”,outline:“none”,color:“white”,fontFamily:BODY,fontSize:13,fontWeight:700}} placeholder={`Search in ${city||"your area"}...`}/>
{city&&<span style={{fontFamily:BODY,fontSize:10,fontWeight:800,color:G,background:“rgba(34,197,94,.1)”,border:“1px solid rgba(34,197,94,.2)”,borderRadius:6,padding:“2px 8px”,whiteSpace:“nowrap”,flexShrink:0}}>📍 {city}</span>}
</div>
<div style={{display:“flex”,gap:8,alignItems:“center”}}>
{user
? <div onClick={()=>setPage(“profile”)} style={{display:“flex”,alignItems:“center”,gap:8,cursor:“pointer”,background:CARD,border:`1px solid ${BORDER}`,borderRadius:9,padding:“6px 12px”}}>
<div style={{width:26,height:26,borderRadius:“50%”,background:`linear-gradient(135deg,${G},#16a34a)`,display:“flex”,alignItems:“center”,justifyContent:“center”,fontFamily:RUSSO,fontSize:11,color:“white”}}>{user.name[0]}</div>
<span style={{fontFamily:BODY,fontSize:12,fontWeight:700}}>{user.name}</span>
</div>
: <button onClick={openAuth} style={{padding:“8px 14px”,borderRadius:9,fontWeight:800,fontSize:12,cursor:“pointer”,border:`1px solid ${BORDER}`,background:“transparent”,color:MUTED,fontFamily:BODY}}>Sign In</button>
}
<button onClick={()=>setPage(“post”)} style={{padding:“8px 14px”,borderRadius:9,fontWeight:800,fontSize:12,cursor:“pointer”,border:“none”,background:`linear-gradient(135deg,${R},#dc2626)`,color:“white”,fontFamily:BODY,display:“flex”,alignItems:“center”,gap:5}}>
<span style={{fontSize:14}}>+</span> Post Ad
</button>
</div>
</nav>
);
}

function LCard({l,onClick,view=“grid”,saved,onSave}) {
if(view===“list”) return (
<div onClick={onClick} style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:14,overflow:“hidden”,cursor:“pointer”,display:“flex”,transition:“all .2s”}}>
<div style={{width:148,height:118,flexShrink:0,background:`linear-gradient(135deg,${CARD2},${l.bg})`,display:“flex”,alignItems:“center”,justifyContent:“center”,fontSize:38,position:“relative”}}>
{l.emoji}
<span style={{position:“absolute”,top:7,left:7,background:l.badge===“Hot”?`linear-gradient(135deg,${R},#dc2626)`:`linear-gradient(135deg,${G},#16a34a)`,color:“white”,fontSize:8,fontWeight:800,padding:“2px 7px”,borderRadius:5,textTransform:“uppercase”,fontFamily:BODY}}>{l.badge}</span>
{l.verified&&<span style={{position:“absolute”,bottom:7,left:7,background:“rgba(34,197,94,.2)”,border:`1px solid ${G}`,borderRadius:4,padding:“1px 6px”,fontSize:8,fontWeight:800,color:G,fontFamily:BODY}}>✅ Verified</span>}
</div>
<div style={{padding:“12px 14px”,flex:1,minWidth:0}}>
<div style={{fontFamily:BODY,fontWeight:700,fontSize:13,marginBottom:4,overflow:“hidden”,whiteSpace:“nowrap”,textOverflow:“ellipsis”}}>{l.title}</div>
<div style={{fontFamily:RUSSO,fontSize:19,color:G,marginBottom:5}}>{fmt(l.price)}</div>
<div style={{display:“flex”,gap:12,fontSize:11,color:MUTED,fontWeight:600,fontFamily:BODY,flexWrap:“wrap”}}>
<span>📍 {l.city}, {l.state}</span>
<span>🕑 {l.age}</span>
<span style={{color:l.trust>=90?G:l.trust>=75?YELLOW:MUTED}}>⭐ {l.trust}</span>
<span>👁️ {l.views}</span>
</div>
</div>
</div>
);
return (
<div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:14,overflow:“hidden”,cursor:“pointer”,transition:“all .22s”,display:“flex”,flexDirection:“column”}} onClick={onClick}>
<div style={{height:170,background:`linear-gradient(135deg,${CARD2},${l.bg})`,display:“flex”,alignItems:“center”,justifyContent:“center”,fontSize:46,position:“relative”,flexShrink:0}}>
{l.emoji}
<span style={{position:“absolute”,top:9,left:9,background:l.badge===“Hot”?`linear-gradient(135deg,${R},#dc2626)`:`linear-gradient(135deg,${G},#16a34a)`,color:“white”,fontSize:9,fontWeight:800,padding:“3px 8px”,borderRadius:6,textTransform:“uppercase”,fontFamily:BODY}}>{l.badge}</span>
<button onClick={e=>{e.stopPropagation();onSave&&onSave(l.id);}} style={{position:“absolute”,top:9,right:9,width:30,height:30,background:“rgba(0,0,0,.55)”,borderRadius:“50%”,border:“none”,cursor:“pointer”,fontSize:14,display:“flex”,alignItems:“center”,justifyContent:“center”,color:saved?”#ef4444”:“white”}}>{saved?“❤️”:“🤍”}</button>
{l.verified&&<span style={{position:“absolute”,bottom:9,left:9,background:“rgba(8,12,20,.8)”,border:`1px solid ${G}`,borderRadius:5,padding:“2px 7px”,fontSize:9,fontWeight:800,color:G,fontFamily:BODY}}>✅ Verified Seller</span>}
</div>
<div style={{padding:“12px 13px”,flex:1}}>
<div style={{fontFamily:RUSSO,fontSize:18,color:G,marginBottom:4}}>{fmt(l.price)}</div>
<div style={{fontFamily:BODY,fontWeight:700,fontSize:13,marginBottom:5,overflow:“hidden”,whiteSpace:“nowrap”,textOverflow:“ellipsis”}}>{l.title}</div>
<div style={{fontFamily:BODY,fontSize:11,color:MUTED,fontWeight:600,marginBottom:7}}>📍 {l.city}, {l.state} · {l.age} ago</div>
<div style={{display:“flex”,alignItems:“center”,gap:7}}>
<div style={{width:22,height:22,borderRadius:“50%”,background:`linear-gradient(135deg,${G},#16a34a)`,display:“flex”,alignItems:“center”,justifyContent:“center”,fontSize:10,fontWeight:800,color:“white”,fontFamily:BODY}}>{l.seller[0]}</div>
<span style={{fontFamily:BODY,fontSize:11,color:MUTED,fontWeight:600,flex:1,overflow:“hidden”,whiteSpace:“nowrap”,textOverflow:“ellipsis”}}>{l.seller}</span>
<span style={{fontFamily:BODY,fontSize:10,fontWeight:800,color:l.trust>=90?G:l.trust>=75?YELLOW:MUTED}}>⭐{l.trust}</span>
</div>
</div>
</div>
);
}

function HomePage({setPage,openAuth,city,setSelectedListing,savedIds,setSavedIds,user}) {
const [cat,setCat]=useState(“All”);
const [view,setView]=useState(“grid”);
const [sort,setSort]=useState(“newest”);
const [search,setSearch]=useState(””);
const [showDisclaimerModal,setShowDisclaimerModal]=useState(false);

const filtered = LISTINGS
.filter(l=>cat===“All”||l.cat===cat)
.filter(l=>!search||l.title.toLowerCase().includes(search.toLowerCase()))
.sort((a,b)=>sort===“price_low”?a.price-b.price:sort===“price_high”?b.price-a.price:0);

const toggleSave = id => setSavedIds(prev=>prev.includes(id)?prev.filter(x=>x!==id):[…prev,id]);

return (
<div>
{showDisclaimerModal&&<DisclaimerModal onClose={()=>setShowDisclaimerModal(false)}/>}

```
  {/* HERO */}
  <div style={{position:"relative",minHeight:560,display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"60px 20px 70px",overflow:"hidden"}}>
    <div style={{position:"absolute",inset:0,background:"url('https://images.unsplash.com/photo-1555421689-d68471e189f2?w=1600&q=80') center/cover no-repeat"}}></div>
    <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom, rgba(8,12,20,0.85) 0%, rgba(8,12,20,0.75) 50%, rgba(8,12,20,0.92) 100%)"}}></div>
    <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(rgba(34,197,94,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,.04) 1px,transparent 1px)`,backgroundSize:"52px 52px"}}></div>
    <div style={{position:"relative",maxWidth:700,zIndex:1}}>
      <h1 style={{fontFamily:RUSSO,fontSize:"clamp(34px,6vw,62px)",lineHeight:1.05,letterSpacing:0.5,marginBottom:16,textShadow:"0 2px 20px rgba(0,0,0,.5)"}}>
        Buy &amp; Sell<br/>
        <span style={{color:G}}>in {city||"Your City"}</span>
      </h1>
      <p style={{fontFamily:BODY,fontSize:16,color:"rgba(255,255,255,.8)",maxWidth:460,margin:"0 auto 28px",lineHeight:1.7,fontWeight:600,textShadow:"0 1px 10px rgba(0,0,0,.5)"}}>
        Real photos. Verified sellers. Safe meetups.
      </p>
      <div style={{background:"rgba(8,12,20,.85)",border:"1px solid rgba(255,255,255,.15)",borderRadius:14,padding:"6px 6px 6px 18px",display:"flex",alignItems:"center",gap:10,maxWidth:580,margin:"0 auto 20px",backdropFilter:"blur(20px)"}}>
        <span style={{fontSize:16}}>🔍</span>
        <input value={search} onChange={e=>setSearch(e.target.value)} style={{flex:1,background:"none",border:"none",outline:"none",color:"white",fontFamily:BODY,fontSize:14,fontWeight:700}} placeholder="Search for cars, phones, furniture..."/>
        <select style={{background:"rgba(255,255,255,.07)",border:"none",color:MUTED,fontFamily:BODY,fontSize:12,fontWeight:700,outline:"none",padding:"8px 10px",borderRadius:10}} onChange={e=>setCat(e.target.value)}>
          {CATS.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <button style={{background:`linear-gradient(135deg,${G},#16a34a)`,color:"white",border:"none",borderRadius:11,padding:"11px 20px",fontFamily:RUSSO,fontSize:13,cursor:"pointer",whiteSpace:"nowrap"}}>Search</button>
      </div>
      <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
        <button onClick={openAuth} style={{padding:"13px 28px",borderRadius:12,fontWeight:800,fontSize:14,cursor:"pointer",border:"none",background:`linear-gradient(135deg,${G},#16a34a)`,color:"white",fontFamily:RUSSO,boxShadow:`0 4px 20px rgba(34,197,94,.3)`}}>Create Free Account</button>
        <button onClick={()=>user?setPage("post"):openAuth()} style={{padding:"13px 28px",borderRadius:12,fontWeight:800,fontSize:14,cursor:"pointer",border:"none",background:`linear-gradient(135deg,${R},#dc2626)`,color:"white",fontFamily:RUSSO,boxShadow:`0 4px 20px rgba(239,68,68,.3)`}}>+ Post an Ad — Free</button>
      </div>
      <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",marginTop:20}}>
        {["🔒 Verified Sellers","📍 Safe Meetup Pin","⭐ Trust Score™"].map(b=>(
          <span key={b} style={{fontFamily:BODY,fontSize:11,fontWeight:800,color:"rgba(255,255,255,.7)",background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",borderRadius:20,padding:"5px 12px"}}>{b}</span>
        ))}
      </div>
    </div>
  </div>

  {/* STATS BAR */}
  <div style={{background:CARD,borderTop:`1px solid ${BORDER}`,borderBottom:`1px solid ${BORDER}`,padding:"18px 20px",display:"flex",justifyContent:"center",gap:48,flexWrap:"wrap"}}>
    {[["125K+","Active Listings"],["84K+","Verified Users"],["$2.4M","Items Sold"],["50","States Covered"]].map(([n,l])=>(
      <div key={l} style={{textAlign:"center"}}>
        <div style={{fontFamily:RUSSO,fontSize:22,background:`linear-gradient(135deg,${G},#86efac)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{n}</div>
        <div style={{fontFamily:BODY,fontSize:10,color:MUTED,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>{l}</div>
      </div>
    ))}
  </div>

  {/* CATEGORY BAR */}
  <div style={{background:CARD,borderBottom:`1px solid ${BORDER}`,padding:"0 20px",display:"flex",gap:0,overflowX:"auto",scrollbarWidth:"none"}}>
    {CATS.map(c=>(
      <div key={c} onClick={()=>setCat(c)} style={{padding:"13px 16px",fontFamily:BODY,fontSize:13,fontWeight:700,color:cat===c?"white":MUTED,cursor:"pointer",borderBottom:`2px solid ${cat===c?G:"transparent"}`,whiteSpace:"nowrap",transition:"all .2s",flexShrink:0}}>{c}</div>
    ))}
  </div>

  {/* TOOLBAR */}
  <div style={{padding:"12px 20px",display:"flex",alignItems:"center",gap:10,background:DARK,borderBottom:`1px solid ${BORDER}`,flexWrap:"wrap"}}>
    <span style={{fontFamily:BODY,fontSize:13,color:MUTED,fontWeight:700}}>{filtered.length} listings near {city||"you"}</span>
    <div style={{display:"flex",gap:3,background:CARD,border:`1px solid ${BORDER}`,borderRadius:9,padding:3,marginLeft:"auto"}}>
      {[["grid","⊞"],["list","☰"],["map","🗺️"]].map(([v,i])=>(
        <button key={v} onClick={()=>setView(v)} style={{padding:"6px 10px",borderRadius:7,border:"none",background:view===v?G:"transparent",color:view===v?"white":MUTED,fontWeight:800,fontSize:14,cursor:"pointer"}}>{i}</button>
      ))}
    </div>
    <select onChange={e=>setSort(e.target.value)} style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:9,color:"white",fontFamily:BODY,fontSize:12,fontWeight:700,padding:"7px 10px",outline:"none"}}>
      <option value="newest">Newest First</option>
      <option value="price_low">Price: Low → High</option>
      <option value="price_high">Price: High → Low</option>
    </select>
  </div>

  {/* MAP VIEW */}
  {view==="map"&&(
    <div style={{margin:"20px",background:CARD,border:`1px solid ${BORDER}`,borderRadius:16,height:300,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:12}}>
      <div style={{fontSize:44}}>🗺️</div>
      <div style={{fontFamily:RUSSO,fontSize:18}}>Map View — {city||"Your Area"}</div>
      <div style={{fontFamily:BODY,fontSize:13,color:MUTED,fontWeight:600}}>Listings show as price pins on an interactive map in the live app</div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center"}}>
        {filtered.slice(0,5).map(l=>(
          <div key={l.id} onClick={()=>{setSelectedListing(l);setPage("detail");}} style={{background:DARK,border:`2px solid ${G}`,borderRadius:20,padding:"5px 12px",fontFamily:BODY,fontSize:12,fontWeight:800,color:G,cursor:"pointer"}}>
            {fmt(l.price)} · {l.emoji}
          </div>
        ))}
      </div>
    </div>
  )}

  {/* LISTINGS GRID */}
  <div style={{padding:"20px",maxWidth:1200,margin:"0 auto"}}>
    {filtered.length===0
      ? <div style={{textAlign:"center",padding:"60px 20px",color:MUTED,fontFamily:BODY}}>
          <div style={{fontSize:44,marginBottom:12}}>🔍</div>
          <div style={{fontWeight:700,fontSize:18}}>No listings found</div>
          <div style={{fontSize:14,marginTop:8}}>Try a different search or category</div>
        </div>
      : <div style={{display:view==="list"?"flex":"grid",flexDirection:"column",gridTemplateColumns:view==="grid"?"repeat(auto-fill,minmax(230px,1fr))":"unset",gap:16}}>
          {filtered.map(l=><LCard key={l.id} l={l} view={view} saved={savedIds.includes(l.id)} onSave={toggleSave} onClick={()=>{setSelectedListing(l);setPage("detail");}}/>)}
        </div>
    }
  </div>

  {/* HOW IT WORKS */}
  <div style={{maxWidth:1100,margin:"0 auto",padding:"20px 20px 60px"}}>
    <div style={{textAlign:"center",marginBottom:36}}>
      <div style={{fontFamily:BODY,fontSize:10,fontWeight:800,letterSpacing:3,textTransform:"uppercase",color:G,marginBottom:8}}>Simple as 1-2-3</div>
      <div style={{fontFamily:RUSSO,fontSize:30}}>How BuyNSell Works</div>
    </div>
    <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:20,padding:"44px 32px"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:36,position:"relative"}}>
        <div style={{position:"absolute",top:33,left:"calc(16.66% + 18px)",right:"calc(16.66% + 18px)",height:2,background:`linear-gradient(90deg,${G},#86efac,${G})`,opacity:.22}}></div>
        {[
          {n:"01",icon:"📸",title:"Post Your Ad",desc:"Take photos with your phone, write a description, set your price. Goes live free in minutes.",c:"rgba(34,197,94,.12)",b:"rgba(34,197,94,.3)"},
          {n:"02",icon:"💬",title:"Chat Safely",desc:"Buyers contact you through our secure in-app chat only. Your phone number and email are NEVER shared.",c:"rgba(96,165,250,.12)",b:"rgba(96,165,250,.3)"},
          {n:"03",icon:"📍",title:"Meet Safely",desc:"Use our unique Safe Meetup Pin — pick Starbucks, bank, or police station and send a location pin. No home address needed!",c:"rgba(239,68,68,.12)",b:"rgba(239,68,68,.3)"},
        ].map(s=>(
          <div key={s.n} style={{textAlign:"center"}}>
            <div style={{width:68,height:68,borderRadius:18,background:s.c,border:`2px solid ${s.b}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 16px"}}>{s.icon}</div>
            <div style={{fontFamily:RUSSO,fontSize:17,marginBottom:8}}>{s.title}</div>
            <div style={{fontFamily:BODY,fontSize:13,color:MUTED,lineHeight:1.7,fontWeight:600}}>{s.desc}</div>
          </div>
        ))}
      </div>
    </div>
  </div>

</div>
```

);
}

// ══════════════════════════════════════════
// DISCLAIMER MODAL — all disclaimers in one place
// ══════════════════════════════════════════
function DisclaimerModal({onClose}) {
return (
<div style={{position:“fixed”,inset:0,background:“rgba(0,0,0,.85)”,backdropFilter:“blur(10px)”,zIndex:600,display:“flex”,alignItems:“center”,justifyContent:“center”,padding:20}} onClick={e=>e.target===e.currentTarget&&onClose()}>
<div style={{background:DARK,border:“1px solid rgba(251,191,36,.25)”,borderRadius:22,width:“100%”,maxWidth:560,maxHeight:“88vh”,overflowY:“auto”,scrollbarWidth:“none”}}>
{/* Header */}
<div style={{background:CARD,borderBottom:`1px solid ${BORDER}`,padding:“18px 22px”,display:“flex”,alignItems:“center”,justifyContent:“space-between”,position:“sticky”,top:0,zIndex:5,borderRadius:“22px 22px 0 0”}}>
<div style={{display:“flex”,alignItems:“center”,gap:10}}>
<span style={{fontSize:22}}>⚠️</span>
<div>
<div style={{fontFamily:RUSSO,fontSize:16,color:YELLOW}}>Platform Disclaimer</div>
<div style={{fontFamily:BODY,fontSize:10,color:MUTED,fontWeight:700}}>Last updated: March 2026 · BuyNSellMarketplace.com</div>
</div>
</div>
<button onClick={onClose} style={{background:“none”,border:“none”,color:MUTED,fontSize:22,cursor:“pointer”,lineHeight:1}}>×</button>
</div>
<div style={{padding:“22px”}}>
{[
{icon:“🏪”,title:“1. Platform Role”,color:BLUE,text:“BuyNSellMarketplace.com is an independent online classifieds platform that connects buyers and sellers. We do not own, sell, inspect, guarantee, or take responsibility for any item listed on this platform.”},
{icon:“🤝”,title:“2. Transaction Responsibility”,color:YELLOW,text:“All transactions are solely between the buyer and seller. BuyNSellMarketplace.com is not a party to any transaction and is not responsible for the accuracy of listings, the condition of items, or any disputes that arise between users. Users agree to conduct all transactions at their own risk.”},
{icon:“🛡️”,title:“3. Safety Recommendations”,color:G,text:“We strongly encourage all users to: meet in safe public locations (Starbucks, banks, police stations), inspect all items before purchasing, never send payment before receiving and verifying the item, and use our in-app Safe Meetup Pin feature.”},
{icon:“⚖️”,title:“4. Section 230 Protection”,color:MUTED,text:“BuyNSellMarketplace.com is protected under Section 230 of the Communications Decency Act as a platform provider. We are not liable for content posted by users.”},
{icon:“🔒”,title:“5. Phone Verification & Privacy”,color:G,text:“All user phone numbers are verified through Twilio carrier lookup. Google Voice, TextNow, and all VOIP internet numbers are automatically blocked. Only real carrier numbers (AT&T, Verizon, T-Mobile, etc.) are accepted. User phone numbers and email addresses are NEVER shown publicly — all communication happens through secure in-app chat only.”},
{icon:“📧”,title:“6. Contact Us”,color:BLUE,text:“For questions, disputes, or to report issues contact: buynsellmarketplaceofficial@gmail.com”},
].map(s=>(
<div key={s.title} style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:14,padding:“16px 18px”,marginBottom:12,display:“flex”,gap:13,alignItems:“flex-start”}}>
<div style={{fontSize:22,flexShrink:0,marginTop:2}}>{s.icon}</div>
<div>
<div style={{fontFamily:RUSSO,fontSize:13,color:s.color,marginBottom:7}}>{s.title}</div>
<div style={{fontFamily:BODY,fontSize:12,color:MUTED,fontWeight:600,lineHeight:1.8}}>{s.text}</div>
</div>
</div>
))}
<div style={{background:“rgba(34,197,94,.06)”,border:“1px solid rgba(34,197,94,.2)”,borderRadius:12,padding:“14px 16px”,marginTop:4}}>
<div style={{fontFamily:BODY,fontSize:11,fontWeight:700,color:”#4ade80”,lineHeight:1.8}}>
By using BuyNSellMarketplace.com you agree to these terms and our Privacy Policy and Terms of Service.
</div>
</div>
<button onClick={onClose} style={{width:“100%”,marginTop:16,padding:“13px”,background:`linear-gradient(135deg,${G},#16a34a)`,border:“none”,borderRadius:12,color:“white”,fontFamily:RUSSO,fontSize:14,cursor:“pointer”}}>I Understand ✓</button>
</div>
</div>
</div>
);
}

function AuthModal({onClose,setUser,setPage}) {
const [mode,setMode]=useState(“signup”);
const [step,setStep]=useState(1);
const [emailSent,setEmailSent]=useState(false);
const [phoneSent,setPhoneSent]=useState(false);
const [pills,setPills]=useState([]);
const [form,setForm]=useState({name:””,city:””,bio:””,email:””,phone:””,password:””});
const upd = k => e => setForm(f=>({…f,[k]:e.target.value}));

const inp = (label,key,type=“text”,ph=””,required=false) => (
<div style={{display:“flex”,flexDirection:“column”,gap:6,marginBottom:13}}>
<label style={{fontFamily:BODY,fontSize:10,fontWeight:800,color:MUTED,textTransform:“uppercase”,letterSpacing:1}}>{label}{required&&<span style={{color:R}}> *</span>}</label>
<input type={type} value={form[key]} onChange={upd(key)} placeholder={ph}
style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:“11px 13px”,color:“white”,fontFamily:BODY,fontSize:14,fontWeight:600,outline:“none”,width:“100%”,boxSizing:“border-box”}}/>
</div>
);

const handleLogin = () => {
setUser({name:form.name||“Tammy”,email:form.email||“user@email.com”,city:“Houston”,verified:true});
onClose();setPage(“profile”);
};

const pillOpts = [“🚗 Vehicles”,“🏠 Real Estate”,“📱 Electronics”,“🛋️ Furniture”,“💎 Jewelry”,“👗 Clothing”,“🎮 Gaming”,“🔧 Tools”,“👶 Baby Items”,“🏋️ Fitness”];

return (
<div style={{position:“fixed”,inset:0,background:“rgba(0,0,0,.85)”,backdropFilter:“blur(10px)”,zIndex:400,display:“flex”,alignItems:“center”,justifyContent:“center”,padding:20}} onClick={e=>e.target===e.currentTarget&&onClose()}>
<div style={{background:DARK,border:`1px solid ${BORDER}`,borderRadius:22,width:“100%”,maxWidth:440,maxHeight:“90vh”,overflowY:“auto”,scrollbarWidth:“none”}}>
<div style={{background:CARD,borderBottom:`1px solid ${BORDER}`,padding:“18px 22px”,display:“flex”,alignItems:“center”,justifyContent:“space-between”,position:“sticky”,top:0,zIndex:5}}>
<Logo size="sm"/>
<div style={{display:“flex”,alignItems:“center”,gap:10}}>
<div style={{display:“flex”,gap:0,background:DARK,border:`1px solid ${BORDER}`,borderRadius:8,padding:3}}>
{[“signup”,“login”].map(m=>(
<button key={m} onClick={()=>{setMode(m);setStep(1);}} style={{padding:“6px 14px”,borderRadius:6,border:“none”,background:mode===m?G:“transparent”,color:mode===m?“white”:MUTED,fontFamily:RUSSO,fontSize:11,cursor:“pointer”}}>{m===“signup”?“Sign Up”:“Log In”}</button>
))}
</div>
<button onClick={onClose} style={{background:“none”,border:“none”,color:MUTED,fontSize:22,cursor:“pointer”}}>×</button>
</div>
</div>
<div style={{padding:24}}>
{mode===“login”&&(
<div>
<div style={{fontSize:40,textAlign:“center”,marginBottom:14}}>👋</div>
<div style={{fontFamily:RUSSO,fontSize:17,textAlign:“center”,marginBottom:20}}>Welcome Back!</div>
{inp(“Email Address”,“email”,“email”,“yourname@gmail.com”,true)}
{inp(“Password”,“password”,“password”,”••••••••”,true)}
<button onClick={handleLogin} style={{width:“100%”,padding:13,background:`linear-gradient(135deg,${G},#16a34a)`,border:“none”,borderRadius:12,color:“white”,fontFamily:RUSSO,fontSize:14,cursor:“pointer”}}>Log In →</button>
<div style={{textAlign:“center”,marginTop:16,fontFamily:BODY,fontSize:13,color:MUTED,fontWeight:600}}>
Don’t have an account? <span onClick={()=>setMode(“signup”)} style={{color:G,cursor:“pointer”,fontWeight:800}}>Sign Up Free</span>
</div>
</div>
)}
{mode===“signup”&&(
<div>
<div style={{display:“flex”,gap:4,marginBottom:24}}>
{[1,2,3,4].map(i=>(
<div key={i} style={{flex:1,display:“flex”,flexDirection:“column”,alignItems:“center”,gap:5}}>
<div style={{height:4,width:“100%”,borderRadius:4,background:i<=step?G:BORDER,transition:“background .3s”}}></div>
<span style={{fontFamily:BODY,fontSize:9,fontWeight:800,color:i===step?G:MUTED,textTransform:“uppercase”,letterSpacing:0.5}}>{[“Profile”,“Email”,“Phone”,“Done”][i-1]}</span>
</div>
))}
</div>
{step===1&&(
<div>
<div style={{fontSize:40,textAlign:“center”,marginBottom:10}}>👋</div>
<div style={{fontFamily:RUSSO,fontSize:16,textAlign:“center”,marginBottom:20}}>Create Your Profile</div>
{inp(“First Name”,“name”,“text”,“Your first name only”,true)}
{inp(“City & State”,“city”,“text”,“e.g. Houston, TX”,true)}
<div style={{fontFamily:BODY,fontSize:10,fontWeight:800,color:MUTED,textTransform:“uppercase”,letterSpacing:1,marginBottom:10}}>What do you mostly sell?</div>
<div style={{display:“flex”,flexWrap:“wrap”,gap:7,marginBottom:20}}>
{pillOpts.map(p=>(
<div key={p} onClick={()=>setPills(prev=>prev.includes(p)?prev.filter(x=>x!==p):[…prev,p])} style={{background:pills.includes(p)?“rgba(34,197,94,.12)”:CARD,border:`1px solid ${pills.includes(p)?"rgba(34,197,94,.35)":BORDER}`,borderRadius:8,padding:“7px 12px”,fontFamily:BODY,fontSize:12,fontWeight:700,color:pills.includes(p)?”#4ade80”:MUTED,cursor:“pointer”}}>{p}</div>
))}
</div>
<button onClick={()=>setStep(2)} style={{width:“100%”,padding:13,background:`linear-gradient(135deg,${G},#16a34a)`,border:“none”,borderRadius:12,color:“white”,fontFamily:RUSSO,fontSize:14,cursor:“pointer”}}>Continue →</button>
</div>
)}
{step===2&&(
<div>
<div style={{fontSize:40,textAlign:“center”,marginBottom:10}}>📧</div>
<div style={{fontFamily:RUSSO,fontSize:16,textAlign:“center”,marginBottom:16}}>Verify Your Email</div>
{inp(“Email Address”,“email”,“email”,“yourname@gmail.com”,true)}
{!emailSent&&(
<button onClick={()=>form.email&&setEmailSent(true)} style={{width:“100%”,padding:13,background:`linear-gradient(135deg,${G},#16a34a)`,border:“none”,borderRadius:12,color:“white”,fontFamily:RUSSO,fontSize:14,cursor:“pointer”}}>Send Verification Code →</button>
)}
{emailSent&&(
<div>
<div style={{background:“rgba(34,197,94,.07)”,border:“1px solid rgba(34,197,94,.18)”,borderRadius:10,padding:“11px 13px”,fontFamily:BODY,fontSize:12,fontWeight:700,color:”#4ade80”,marginBottom:16}}>✅ Code sent! Enter the 6-digit code:</div>
<div style={{display:“flex”,gap:8,justifyContent:“center”,marginBottom:16}}>
{[0,1,2,3,4,5].map(i=><input key={i} maxLength={1} style={{width:46,height:54,borderRadius:11,background:CARD,border:`2px solid ${BORDER}`,color:“white”,fontFamily:RUSSO,fontWeight:900,fontSize:22,textAlign:“center”,outline:“none”}}/>)}
</div>
<button onClick={()=>setStep(3)} style={{width:“100%”,padding:13,background:`linear-gradient(135deg,${G},#16a34a)`,border:“none”,borderRadius:12,color:“white”,fontFamily:RUSSO,fontSize:14,cursor:“pointer”}}>Confirm Email ✅</button>
</div>
)}
<div style={{textAlign:“center”,marginTop:12}}><span onClick={()=>setStep(1)} style={{fontFamily:BODY,fontSize:12,color:MUTED,fontWeight:700,cursor:“pointer”}}>← Back</span></div>
</div>
)}
{step===3&&(
<div>
<div style={{fontSize:40,textAlign:“center”,marginBottom:10}}>📱</div>
<div style={{fontFamily:RUSSO,fontSize:16,textAlign:“center”,marginBottom:16}}>Verify Your Phone</div>
<div style={{display:“flex”,gap:8,marginBottom:14}}>
<select style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:“11px 10px”,color:“white”,fontFamily:BODY,fontSize:14,fontWeight:700,outline:“none”,width:82,flexShrink:0}}>
<option>🇺🇸 +1</option>
</select>
<input type=“tel” value={form.phone} onChange={upd(“phone”)} placeholder=”(555) 000-0000” style={{flex:1,background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:“11px 13px”,color:“white”,fontFamily:BODY,fontSize:14,fontWeight:600,outline:“none”}}/>
</div>
{!phoneSent&&(
<button onClick={()=>form.phone&&setPhoneSent(true)} style={{width:“100%”,padding:13,background:`linear-gradient(135deg,${G},#16a34a)`,border:“none”,borderRadius:12,color:“white”,fontFamily:RUSSO,fontSize:14,cursor:“pointer”}}>Send Text Code →</button>
)}
{phoneSent&&(
<div>
<div style={{background:“rgba(34,197,94,.07)”,border:“1px solid rgba(34,197,94,.18)”,borderRadius:10,padding:“11px 13px”,fontFamily:BODY,fontSize:12,fontWeight:700,color:”#4ade80”,marginBottom:14}}>✅ Text sent! Enter the 6-digit code:</div>
<div style={{display:“flex”,gap:8,justifyContent:“center”,marginBottom:16}}>
{[0,1,2,3,4,5].map(i=><input key={i} maxLength={1} style={{width:46,height:54,borderRadius:11,background:CARD,border:`2px solid ${BORDER}`,color:“white”,fontFamily:RUSSO,fontWeight:900,fontSize:22,textAlign:“center”,outline:“none”}}/>)}
</div>
<button onClick={()=>setStep(4)} style={{width:“100%”,padding:13,background:`linear-gradient(135deg,${G},#16a34a)`,border:“none”,borderRadius:12,color:“white”,fontFamily:RUSSO,fontSize:14,cursor:“pointer”}}>Confirm Phone ✅</button>
</div>
)}
<div style={{textAlign:“center”,marginTop:12}}><span onClick={()=>setStep(2)} style={{fontFamily:BODY,fontSize:12,color:MUTED,fontWeight:700,cursor:“pointer”}}>← Back</span></div>
</div>
)}
{step===4&&(
<div style={{textAlign:“center”}}>
<div style={{fontSize:52,marginBottom:14}}>🎉</div>
<div style={{fontFamily:RUSSO,fontSize:18,marginBottom:8}}>You’re Verified & Ready!</div>
<div style={{background:“rgba(34,197,94,.08)”,border:“1px solid rgba(34,197,94,.2)”,borderRadius:14,padding:16,marginBottom:22,textAlign:“left”}}>
{[“✅ Email Verified”,“📱 Real Phone Confirmed”,“🏆 Trust Score Started: 50/100”,“🔒 Your personal info is never shown publicly”,“🚫 Safety Scanner active on all your chats”].map(l=>(
<div key={l} style={{fontFamily:BODY,fontSize:13,fontWeight:700,color:”#4ade80”,marginBottom:7}}>{l}</div>
))}
</div>
<div style={{display:“flex”,flexDirection:“column”,gap:10}}>
<button onClick={()=>{setUser({name:form.name||“User”,email:form.email,city:form.city||“Houston”,verified:true});onClose();setPage(“profile”);}} style={{width:“100%”,padding:13,background:`linear-gradient(135deg,${G},#16a34a)`,border:“none”,borderRadius:12,color:“white”,fontFamily:RUSSO,fontSize:14,cursor:“pointer”}}>View My Profile →</button>
<button onClick={()=>{setUser({name:form.name||“User”,email:form.email,city:form.city||“Houston”,verified:true});onClose();setPage(“post”);}} style={{width:“100%”,padding:13,background:`linear-gradient(135deg,${R},#dc2626)`,border:“none”,borderRadius:12,color:“white”,fontFamily:RUSSO,fontSize:14,cursor:“pointer”}}>+ Post My First Ad</button>
</div>
</div>
)}
</div>
)}
</div>
</div>
</div>
);
}

function ChatModal({listing,onClose}) {
const l = listing||LISTINGS[0];
const scrollRef = useRef(null);
const [msgs,setMsgs]=useState([
{id:1,type:“system”,text:`Conversation about "${l.title}"`},
{id:2,type:“them”,text:“Hey! Thanks for your interest. What would you like to know?”,time:“10:22 AM”},
]);
const [input,setInput]=useState(””);
const [showQR,setShowQR]=useState(true);
const [showMeetup,setShowMeetup]=useState(false);
const [showOffer,setShowOffer]=useState(false);
const [showSafety,setShowSafety]=useState(false);
const [showReview,setShowReview]=useState(false);
const [blockedTxt,setBlockedTxt]=useState(””);
const [offerAmt,setOfferAmt]=useState(””);
const [stars,setStars]=useState({item:0,comms:0,meetup:0});
const [reviewTxt,setReviewTxt]=useState(””);
const [reviewDone,setReviewDone]=useState(false);

useEffect(()=>{if(scrollRef.current)scrollRef.current.scrollTop=scrollRef.current.scrollHeight;},[msgs]);
const addMsg = m => setMsgs(p=>[…p,{id:Date.now(),…m,time:now()}]);

const send = () => {
if(!input.trim())return;
if(scanMsg(input)){setBlockedTxt(input);setShowSafety(true);return;}
addMsg({type:“me”,text:input});setInput(””);setShowQR(false);
setTimeout(()=>addMsg({type:“them”,text:“Thanks! I’ll get back to you shortly.”}),1200);
};

const sendQR = qr => {
addMsg({type:“me”,text:qr.text});setShowQR(false);
const replies={“Is this still available?”:“Yes, still available! Are you interested? 😊”,“Is the price negotiable?”:“I can come down a little — what’s your offer?”,“Where can we meet?”:“I prefer a public place — Starbucks or a bank lobby!”,“Can you send more photos?”:“Sure, give me a moment to grab a few more shots.”,“I’ll take it! Let’s meet up.”:“Great! Use the 📍 pin button to suggest a meetup spot!”};
setTimeout(()=>addMsg({type:“them”,text:replies[qr.text]||“Good question! Let me check on that.”}),1000);
};

const sendPin = spot => {
addMsg({type:“pin”,spot});setShowMeetup(false);
setTimeout(()=>addMsg({type:“them”,text:`${spot.icon} ${spot.name} works for me! What time works?`}),1200);
};

const sendOffer = () => {
if(!offerAmt)return;
addMsg({type:“offer”,amount:parseInt(offerAmt),asking:l.price});
setShowOffer(false);setOfferAmt(””);
setTimeout(()=>addMsg({type:“counter”,counter:Math.round(parseInt(offerAmt)*1.1)}),2000);
};

return (
<div style={{position:“fixed”,inset:0,background:“rgba(0,0,0,.8)”,backdropFilter:“blur(8px)”,zIndex:500,display:“flex”,alignItems:“center”,justifyContent:“center”,padding:20}} onClick={e=>e.target===e.currentTarget&&onClose()}>
<div style={{background:DARK,border:`1px solid ${BORDER}`,borderRadius:20,width:“100%”,maxWidth:440,height:620,display:“flex”,flexDirection:“column”,overflow:“hidden”,position:“relative”}}>
<div style={{background:CARD,borderBottom:`1px solid ${BORDER}`,padding:“13px 16px”,display:“flex”,alignItems:“center”,gap:10,flexShrink:0}}>
<button onClick={onClose} style={{background:“none”,border:“none”,color:MUTED,fontSize:20,cursor:“pointer”}}>←</button>
<div style={{width:38,height:38,borderRadius:“50%”,background:`linear-gradient(135deg,${G},#16a34a)`,display:“flex”,alignItems:“center”,justifyContent:“center”,fontFamily:RUSSO,fontSize:15,color:“white”,flexShrink:0}}>{l.seller[0]}</div>
<div style={{flex:1,minWidth:0}}>
<div style={{fontFamily:RUSSO,fontSize:13}}>{l.seller}</div>
<div style={{fontFamily:BODY,fontSize:11,fontWeight:700,display:“flex”,alignItems:“center”,gap:5}}>
<span style={{width:6,height:6,background:G,borderRadius:“50%”,display:“inline-block”}}></span>
<span style={{color:G}}>Online</span>
{l.verified&&<span style={{color:”#4ade80”,background:“rgba(34,197,94,.1)”,border:“1px solid rgba(34,197,94,.2)”,borderRadius:4,padding:“1px 6px”,fontSize:10}}>✅ Verified</span>}
</div>
</div>
<div style={{background:CARD2,border:`1px solid ${BORDER}`,borderRadius:9,padding:“6px 10px”,textAlign:“right”,flexShrink:0}}>
<div style={{fontFamily:BODY,fontSize:10,fontWeight:700,color:MUTED,overflow:“hidden”,whiteSpace:“nowrap”,textOverflow:“ellipsis”,maxWidth:100}}>{l.title.slice(0,18)}…</div>
<div style={{fontFamily:RUSSO,fontSize:13,color:G}}>{fmt(l.price)}</div>
</div>
</div>
<div style={{background:“rgba(251,191,36,.06)”,borderBottom:“1px solid rgba(251,191,36,.1)”,padding:“7px 14px”,flexShrink:0}}>
<span style={{fontFamily:BODY,fontSize:10,fontWeight:700,color:YELLOW}}>🔒 Keep conversations safe — never share phone numbers or email addresses here</span>
</div>
<div ref={scrollRef} style={{flex:1,overflowY:“auto”,padding:“14px”,display:“flex”,flexDirection:“column”,gap:10,scrollbarWidth:“none”}}>
{msgs.map(m=>(
<div key={m.id}>
{m.type===“system”&&<div style={{textAlign:“center”,margin:“6px 0”}}><span style={{fontFamily:BODY,fontSize:10,fontWeight:700,color:MUTED,background:CARD,borderRadius:20,padding:“3px 12px”}}>{m.text}</span></div>}
{(m.type===“me”||m.type===“them”)&&(
<div style={{display:“flex”,flexDirection:“column”,alignItems:m.type===“me”?“flex-end”:“flex-start”,gap:2}}>
<div style={{maxWidth:“78%”,padding:“10px 13px”,borderRadius:16,fontFamily:BODY,fontSize:13,fontWeight:600,lineHeight:1.5,background:m.type===“me”?`linear-gradient(135deg,${G},#16a34a)`:CARD,border:m.type===“them”?`1px solid ${BORDER}`:“none”,borderBottomRightRadius:m.type===“me”?3:16,borderBottomLeftRadius:m.type===“them”?3:16}}>{m.text}</div>
{m.time&&<div style={{fontFamily:BODY,fontSize:9,color:MUTED,fontWeight:600,paddingInline:3}}>{m.time}{m.type===“me”&&” · Delivered”}</div>}
</div>
)}
{m.type===“pin”&&(
<div style={{display:“flex”,flexDirection:“column”,alignItems:“flex-end”,gap:2}}>
<div style={{background:“rgba(34,197,94,.08)”,border:“1px solid rgba(34,197,94,.22)”,borderRadius:14,padding:“12px 14px”,maxWidth:“82%”}}>
<div style={{fontFamily:BODY,fontSize:9,fontWeight:800,color:G,textTransform:“uppercase”,letterSpacing:1,marginBottom:4}}>📍 Safe Meetup Pin</div>
<div style={{fontFamily:RUSSO,fontSize:14,marginBottom:3}}>{m.spot.icon} {m.spot.name}</div>
<div style={{fontFamily:BODY,fontSize:10,color:MUTED,fontWeight:600,marginBottom:8}}>Public location · No address shared</div>
<div style={{background:CARD,borderRadius:9,height:65,display:“flex”,alignItems:“center”,justifyContent:“center”,fontSize:26,border:`1px solid ${BORDER}`}}>🗺️</div>
<span style={{fontFamily:BODY,fontSize:9,fontWeight:800,padding:“2px 8px”,borderRadius:20,background:m.spot.safe===“Safest”?“rgba(34,197,94,.12)”:“rgba(251,191,36,.12)”,color:m.spot.safe===“Safest”?G:YELLOW,display:“inline-block”,marginTop:7}}>{m.spot.safe}</span>
</div>
<div style={{fontFamily:BODY,fontSize:9,color:MUTED,fontWeight:600}}>{m.time}</div>
</div>
)}
{m.type===“offer”&&(
<div style={{display:“flex”,flexDirection:“column”,alignItems:“flex-end”,gap:2}}>
<div style={{background:“rgba(96,165,250,.08)”,border:“1px solid rgba(96,165,250,.25)”,borderRadius:14,padding:“13px 15px”,maxWidth:“80%”}}>
<div style={{fontFamily:BODY,fontSize:9,fontWeight:800,color:BLUE,textTransform:“uppercase”,letterSpacing:1,marginBottom:5}}>💰 Formal Offer</div>
<div style={{fontFamily:RUSSO,fontSize:24,color:BLUE,marginBottom:3}}>{fmt(m.amount)}</div>
<div style={{fontFamily:BODY,fontSize:10,color:MUTED,fontWeight:600}}>Asking: {fmt(m.asking)} · You offered {Math.round((m.amount/m.asking)*100)}%</div>
</div>
</div>
)}
{m.type===“counter”&&(
<div style={{display:“flex”,flexDirection:“column”,alignItems:“flex-start”,gap:2}}>
<div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:14,padding:“13px 15px”,maxWidth:“86%”}}>
<div style={{fontFamily:BODY,fontSize:10,fontWeight:800,color:YELLOW,marginBottom:5}}>🤔 Counter Offer from {l.seller}</div>
<div style={{fontFamily:RUSSO,fontSize:22,color:YELLOW,marginBottom:8}}>{fmt(m.counter)}</div>
<div style={{display:“flex”,gap:8}}>
<button onClick={()=>addMsg({type:“me”,text:`✅ I accept ${fmt(m.counter)}! Let's meet up.`})} style={{flex:1,padding:“9px”,background:`linear-gradient(135deg,${G},#16a34a)`,border:“none”,borderRadius:9,color:“white”,fontFamily:RUSSO,fontSize:11,cursor:“pointer”}}>✅ Accept</button>
<button onClick={()=>setShowOffer(true)} style={{flex:1,padding:“9px”,background:“rgba(96,165,250,.12)”,border:“1px solid rgba(96,165,250,.3)”,borderRadius:9,color:BLUE,fontFamily:RUSSO,fontSize:11,cursor:“pointer”}}>💰 Counter</button>
<button onClick={()=>addMsg({type:“me”,text:“I’ll pass, but thanks for considering it.”})} style={{flex:1,padding:“9px”,background:“rgba(239,68,68,.1)”,border:“1px solid rgba(239,68,68,.25)”,borderRadius:9,color:R,fontFamily:RUSSO,fontSize:11,cursor:“pointer”}}>✗ Decline</button>
</div>
</div>
</div>
)}
</div>
))}
</div>
{showQR&&(
<div style={{padding:“10px 14px”,borderTop:`1px solid ${BORDER}`,background:DARK,flexShrink:0}}>
<div style={{fontFamily:BODY,fontSize:10,fontWeight:800,color:MUTED,textTransform:“uppercase”,letterSpacing:1,marginBottom:8}}>Quick Replies — tap to send</div>
<div style={{display:“flex”,gap:7,overflowX:“auto”,scrollbarWidth:“none”,paddingBottom:2}}>
{QUICK_REPLIES.map((qr,i)=>(
<button key={i} onClick={()=>sendQR(qr)} style={{flexShrink:0,padding:“8px 12px”,background:CARD,border:`1px solid ${BORDER}`,borderRadius:20,color:“white”,fontFamily:BODY,fontWeight:700,fontSize:12,cursor:“pointer”,display:“flex”,alignItems:“center”,gap:5,whiteSpace:“nowrap”}}>
<span>{qr.icon}</span>{qr.text}
</button>
))}
</div>
</div>
)}
<div style={{padding:“8px 12px”,borderTop:`1px solid ${BORDER}`,background:CARD2,display:“flex”,gap:6,flexShrink:0,overflowX:“auto”,scrollbarWidth:“none”}}>
{[{i:“💬”,l:“Quick Reply”,a:()=>setShowQR(v=>!v)},{i:“💰”,l:“Make Offer”,a:()=>setShowOffer(true)},{i:“📍”,l:“Meetup Pin”,a:()=>setShowMeetup(v=>!v)},{i:“⭐”,l:“Leave Review”,a:()=>setShowReview(true)}].map(b=>(
<button key={b.l} onClick={b.a} style={{flexShrink:0,padding:“7px 11px”,background:CARD,border:`1px solid ${BORDER}`,borderRadius:9,color:“white”,fontFamily:BODY,fontWeight:700,fontSize:11,cursor:“pointer”,display:“flex”,alignItems:“center”,gap:5}}>
<span style={{fontSize:13}}>{b.i}</span>{b.l}
</button>
))}
</div>
{showMeetup&&(
<div style={{padding:“12px 14px”,borderTop:`1px solid ${BORDER}`,background:CARD,flexShrink:0}}>
<div style={{fontFamily:RUSSO,fontSize:12,marginBottom:10}}>📍 Choose a Safe Meetup Spot</div>
<div style={{display:“flex”,flexDirection:“column”,gap:6}}>
{MEETUPS.map((m,i)=>(
<div key={i} onClick={()=>sendPin(m)} style={{display:“flex”,alignItems:“center”,gap:9,background:CARD2,border:`1px solid ${BORDER}`,borderRadius:10,padding:“9px 11px”,cursor:“pointer”}}>
<span style={{fontSize:18}}>{m.icon}</span>
<div style={{flex:1}}><div style={{fontFamily:BODY,fontSize:12,fontWeight:800}}>{m.name}</div><div style={{fontFamily:BODY,fontSize:10,color:MUTED,fontWeight:600}}>{m.desc}</div></div>
<span style={{fontFamily:BODY,fontSize:9,fontWeight:800,padding:“2px 8px”,borderRadius:20,background:m.safe===“Safest”?“rgba(34,197,94,.12)”:“rgba(251,191,36,.12)”,color:m.sc}}>{m.safe}</span>
</div>
))}
</div>
</div>
)}
<div style={{padding:“10px 12px”,borderTop:`1px solid ${BORDER}`,background:DARK,display:“flex”,gap:8,alignItems:“center”,flexShrink:0}}>
<input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key===“Enter”&&send()} style={{flex:1,background:CARD,border:`1px solid ${BORDER}`,borderRadius:11,padding:“10px 13px”,color:“white”,fontFamily:BODY,fontSize:13,fontWeight:600,outline:“none”}} placeholder=“Type a message…”/>
<button onClick={send} style={{background:`linear-gradient(135deg,${G},#16a34a)`,border:“none”,borderRadius:10,width:40,height:40,display:“flex”,alignItems:“center”,justifyContent:“center”,cursor:“pointer”,fontSize:16,flexShrink:0}}>➤</button>
</div>
{showSafety&&(
<div style={{position:“absolute”,inset:0,background:“rgba(0,0,0,.9)”,backdropFilter:“blur(6px)”,display:“flex”,alignItems:“center”,justifyContent:“center”,padding:20,zIndex:10}}>
<div style={{background:DARK,border:“1px solid rgba(239,68,68,.3)”,borderRadius:18,padding:24,maxWidth:360,width:“100%”}}>
<div style={{fontSize:36,textAlign:“center”,marginBottom:12}}>🚫</div>
<div style={{fontFamily:RUSSO,fontSize:16,textAlign:“center”,marginBottom:8,color:R}}>Message Blocked</div>
<div style={{fontFamily:BODY,fontSize:13,color:MUTED,fontWeight:600,textAlign:“center”,lineHeight:1.7,marginBottom:16}}>Your message contains a phone number, email, or external contact info. For your safety, all communication must stay within BuyNSell chat.</div>
<div style={{display:“flex”,gap:8}}>
<button onClick={()=>{setShowSafety(false);setInput(blockedTxt);}} style={{flex:1,padding:“11px”,background:“rgba(255,255,255,.06)”,border:`1px solid ${BORDER}`,borderRadius:10,color:MUTED,fontFamily:BODY,fontWeight:800,fontSize:13,cursor:“pointer”}}>Edit Message</button>
<button onClick={()=>{setShowSafety(false);setInput(””);}} style={{flex:1,padding:“11px”,background:`linear-gradient(135deg,${G},#16a34a)`,border:“none”,borderRadius:10,color:“white”,fontFamily:RUSSO,fontSize:13,cursor:“pointer”}}>Got It ✓</button>
</div>
</div>
</div>
)}
{showOffer&&(
<div style={{position:“absolute”,inset:0,background:“rgba(0,0,0,.9)”,backdropFilter:“blur(6px)”,display:“flex”,alignItems:“center”,justifyContent:“center”,padding:20,zIndex:10}}>
<div style={{background:DARK,border:`1px solid ${BORDER}`,borderRadius:18,padding:24,maxWidth:360,width:“100%”}}>
<div style={{fontFamily:RUSSO,fontSize:16,marginBottom:16}}>💰 Make an Offer</div>
<div style={{display:“flex”,gap:10,alignItems:“center”,background:CARD,borderRadius:11,padding:“10px 13px”,marginBottom:16,border:`1px solid ${BORDER}`}}>
<span style={{fontSize:28}}>{l.emoji}</span>
<div><div style={{fontFamily:BODY,fontSize:12,fontWeight:700}}>{l.title.slice(0,24)}…</div><div style={{fontFamily:RUSSO,fontSize:14,color:G}}>Asking: {fmt(l.price)}</div></div>
</div>
<div style={{position:“relative”,marginBottom:14}}>
<span style={{position:“absolute”,left:14,top:“50%”,transform:“translateY(-50%)”,fontFamily:RUSSO,fontSize:18,color:BLUE}}>$</span>
<input type=“number” value={offerAmt} onChange={e=>setOfferAmt(e.target.value)} placeholder=“0” style={{width:“100%”,padding:“13px 13px 13px 32px”,background:CARD,border:`2px solid ${BLUE}`,borderRadius:11,color:“white”,fontFamily:RUSSO,fontSize:22,outline:“none”,boxSizing:“border-box”}}/>
</div>
<div style={{display:“grid”,gridTemplateColumns:“repeat(3,1fr)”,gap:8,marginBottom:16}}>
{[0.7,0.8,0.9].map(p=>{const a=Math.round(l.price*p);return <button key={p} onClick={()=>setOfferAmt(String(a))} style={{padding:“9px 6px”,background:offerAmt==a?“rgba(96,165,250,.15)”:CARD,border:`1px solid ${offerAmt==a?BLUE:BORDER}`,borderRadius:9,color:offerAmt==a?BLUE:“white”,fontFamily:BODY,fontWeight:800,fontSize:11,cursor:“pointer”,textAlign:“center”}}><div>{fmt(a)}</div><div style={{fontSize:9,color:MUTED,marginTop:2}}>{Math.round(p*100)}%</div></button>;})}
</div>
<div style={{display:“flex”,gap:8}}>
<button onClick={()=>setShowOffer(false)} style={{flex:1,padding:“11px”,background:“transparent”,border:`1px solid ${BORDER}`,borderRadius:10,color:MUTED,fontFamily:BODY,fontWeight:800,fontSize:13,cursor:“pointer”}}>Cancel</button>
<button onClick={sendOffer} style={{flex:2,padding:“11px”,background:`linear-gradient(135deg,${BLUE},#2563eb)`,border:“none”,borderRadius:10,color:“white”,fontFamily:RUSSO,fontSize:13,cursor:“pointer”}}>Send Offer 💰</button>
</div>
</div>
</div>
)}
{showReview&&(
<div style={{position:“absolute”,inset:0,background:“rgba(0,0,0,.9)”,backdropFilter:“blur(6px)”,display:“flex”,alignItems:“center”,justifyContent:“center”,padding:20,zIndex:10}}>
<div style={{background:DARK,border:`1px solid ${BORDER}`,borderRadius:18,padding:24,maxWidth:360,width:“100%”,maxHeight:“80vh”,overflowY:“auto”,scrollbarWidth:“none”}}>
{!reviewDone?(
<div>
<div style={{fontFamily:RUSSO,fontSize:16,marginBottom:16}}>⭐ Leave a Review</div>
{[[“item”,“⭐ Item as Described”],[“comms”,“💬 Communication”],[“meetup”,“🤝 Meetup & Transaction”]].map(([k,label])=>(
<div key={k} style={{marginBottom:16}}>
<div style={{fontFamily:BODY,fontSize:11,fontWeight:800,color:MUTED,textTransform:“uppercase”,letterSpacing:1,marginBottom:8}}>{label}</div>
<div style={{display:“flex”,gap:8}}>{[1,2,3,4,5].map(s=><div key={s} onClick={()=>setStars(v=>({…v,[k]:s}))} style={{fontSize:26,cursor:“pointer”,opacity:stars[k]>=s?1:0.2,transition:“opacity .15s”}}>⭐</div>)}</div>
</div>
))}
<textarea value={reviewTxt} onChange={e=>setReviewTxt(e.target.value)} placeholder=“Tell others about your experience…” rows={3} style={{width:“100%”,background:CARD,border:`1px solid ${BORDER}`,borderRadius:11,padding:“11px 13px”,color:“white”,fontFamily:BODY,fontSize:13,fontWeight:600,outline:“none”,resize:“none”,marginBottom:14,boxSizing:“border-box”}}/>
<div style={{display:“flex”,gap:8}}>
<button onClick={()=>setShowReview(false)} style={{flex:1,padding:“11px”,background:“transparent”,border:`1px solid ${BORDER}`,borderRadius:10,color:MUTED,fontFamily:BODY,fontWeight:800,fontSize:13,cursor:“pointer”}}>Cancel</button>
<button onClick={()=>setReviewDone(true)} style={{flex:2,padding:“11px”,background:`linear-gradient(135deg,${G},#16a34a)`,border:“none”,borderRadius:10,color:“white”,fontFamily:RUSSO,fontSize:13,cursor:“pointer”}}>Submit Review ⭐</button>
</div>
</div>
):(
<div style={{textAlign:“center”,padding:“20px 0”}}>
<div style={{fontSize:48,marginBottom:12}}>🎉</div>
<div style={{fontFamily:RUSSO,fontSize:17,marginBottom:8}}>Review Submitted!</div>
<button onClick={()=>setShowReview(false)} style={{padding:“11px 24px”,background:`linear-gradient(135deg,${G},#16a34a)`,border:“none”,borderRadius:10,color:“white”,fontFamily:RUSSO,fontSize:13,cursor:“pointer”}}>Close</button>
</div>
)}
</div>
</div>
)}
</div>
</div>
);
}

function PostPage({setPage,user,openAuth}) {
if(!user) return (
<div style={{minHeight:“60vh”,display:“flex”,flexDirection:“column”,alignItems:“center”,justifyContent:“center”,gap:16,padding:40,textAlign:“center”}}>
<div style={{fontSize:48}}>🔒</div>
<div style={{fontFamily:RUSSO,fontSize:22}}>Sign In to Post an Ad</div>
<button onClick={openAuth} style={{padding:“13px 28px”,background:`linear-gradient(135deg,${G},#16a34a)`,border:“none”,borderRadius:12,color:“white”,fontFamily:RUSSO,fontSize:14,cursor:“pointer”}}>Create Free Account</button>
</div>
);

const [step,setStep]=useState(1);
const [photo,setPhoto]=useState(null);
const [title,setTitle]=useState(””);
const [cat,setCat]=useState(””);
const [condition,setCondition]=useState(””);
const [price,setPrice]=useState(””);
const [firmPrice,setFirmPrice]=useState(false);
const [meetup,setMeetup]=useState(””);
const allCats=[“Home & Garden, Furniture”,“Vehicles › Cars”,“Vehicles › Trucks”,“Vehicles › Motorcycles”,“Vehicles › Boats”,“Real Estate › For Sale”,“Electronics”,“Jewelry & Watches”,“Clothing & Fashion”,“Baby & Kids”,“Sports & Outdoors”,“Gaming”,“Musical Instruments”,“Fitness Equipment”,“Tools & Hardware”,“Free Items”,“Other”];
const conditions=[“New”,“Like New”,“Reconditioned/Certified”,“Good”,“Fair”,“For Parts”];

return (
<div style={{background:“white”,minHeight:“100vh”,fontFamily:BODY}}>
<div style={{display:“flex”,alignItems:“center”,justifyContent:“space-between”,padding:“15px 20px”,borderBottom:“1px solid #eee”,background:“white”,position:“sticky”,top:0,zIndex:10}}>
<button onClick={()=>step>1?setStep(step-1):setPage(“home”)} style={{background:“none”,border:“none”,fontSize:22,cursor:“pointer”,color:”#333”,padding:“3px 7px”}}>‹</button>
<div style={{fontWeight:900,fontSize:17,color:”#111”,fontFamily:BODY}}>{[“Post an Item”,“Details”,“Price”,“Finish”][step-1]}</div>
<button onClick={()=>setPage(“home”)} style={{background:“none”,border:“none”,fontSize:20,cursor:“pointer”,color:”#999”}}>✕</button>
</div>
<div style={{padding:“22px 20px”,maxWidth:500,margin:“0 auto”}}>
{step===1&&(
<div>
{!photo?(
<div style={{marginBottom:24}}>
{[[“📷”,“Take photo”],[“🖼️”,“Select photo from library”]].map(([i,l])=>(
<button key={l} onClick={()=>setPhoto(“📸”)} style={{width:“100%”,padding:“16px”,borderRadius:50,border:`2px solid ${G}`,background:“white”,color:G,fontFamily:BODY,fontWeight:800,fontSize:15,cursor:“pointer”,marginBottom:13,display:“flex”,alignItems:“center”,justifyContent:“center”,gap:10}}>
<span style={{fontSize:20}}>{i}</span>{l}
</button>
))}
</div>
):(
<div style={{width:“100%”,height:200,background:`linear-gradient(135deg,#e8f5e9,#c8e6c9)`,borderRadius:14,display:“flex”,alignItems:“center”,justifyContent:“center”,fontSize:80,marginBottom:20,position:“relative”,border:“2px solid #e0e0e0”}}>
{photo}
<button onClick={()=>setPhoto(null)} style={{position:“absolute”,top:8,right:8,background:“rgba(0,0,0,.5)”,border:“none”,color:“white”,width:28,height:28,borderRadius:“50%”,cursor:“pointer”,fontSize:13}}>✕</button>
</div>
)}
<div style={{marginBottom:18}}>
<div style={{fontWeight:900,fontSize:15,color:”#111”,marginBottom:7}}>Title <span style={{color:R}}>*</span></div>
<input value={title} onChange={e=>setTitle(e.target.value)} placeholder=“Brand, model, color, size — be specific!” style={{width:“100%”,padding:“13px”,border:“1.5px solid #ddd”,borderRadius:10,fontFamily:BODY,fontSize:14,outline:“none”,color:”#333”,boxSizing:“border-box”}}/>
</div>
</div>
)}
{step===2&&(
<div>
{!cat?(
<div>
<div style={{fontWeight:900,fontSize:18,color:”#111”,marginBottom:16,paddingBottom:14,borderBottom:“1px solid #eee”}}>Select a category</div>
{allCats.map(c=>(
<div key={c} onClick={()=>setCat(c)} style={{padding:“13px 0”,borderBottom:“1px solid #f5f5f5”,fontSize:14,fontWeight:600,color:”#222”,cursor:“pointer”,display:“flex”,justifyContent:“space-between”,alignItems:“center”}}>
{c}<span style={{color:”#ccc”,fontSize:16}}>›</span>
</div>
))}
</div>
):(
<div>
<div style={{fontWeight:900,fontSize:18,color:”#111”,marginBottom:16,paddingBottom:14,borderBottom:“1px solid #eee”,display:“flex”,justifyContent:“space-between”,alignItems:“center”}}>
{cat}<button onClick={()=>setCat(””)} style={{background:“none”,border:“none”,color:G,fontFamily:BODY,fontWeight:700,fontSize:13,cursor:“pointer”}}>Change</button>
</div>
<div style={{display:“flex”,flexWrap:“wrap”,gap:8}}>
{conditions.map(c=>(
<div key={c} onClick={()=>setCondition(c)} style={{padding:“9px 16px”,border:`2px solid ${condition===c?G:"#eee"}`,borderRadius:20,fontSize:13,fontWeight:700,color:condition===c?G:”#555”,cursor:“pointer”,background:condition===c?“rgba(34,197,94,.05)”:“white”}}>{c}</div>
))}
</div>
</div>
)}
</div>
)}
{step===3&&(
<div>
<div style={{marginBottom:22}}>
<div style={{fontWeight:900,fontSize:15,color:”#111”,marginBottom:10,textAlign:“center”}}>Set Your Price</div>
<input value={price} onChange={e=>setPrice(e.target.value)} type=“number” placeholder=”$0” style={{width:“100%”,padding:“20px”,border:`2px solid ${G}`,borderRadius:12,fontFamily:BODY,fontSize:32,fontWeight:900,textAlign:“center”,outline:“none”,color:”#111”,boxSizing:“border-box”}}/>
</div>
<div style={{display:“flex”,alignItems:“center”,justifyContent:“space-between”,padding:“16px 0”,borderTop:“1px solid #eee”,borderBottom:“1px solid #eee”,marginBottom:22}}>
<div>
<div style={{fontSize:15,fontWeight:700,color:”#111”}}>Firm on price</div>
<div style={{fontSize:12,color:”#999”,fontWeight:600}}>Turn on if you don’t want to negotiate</div>
</div>
<div onClick={()=>setFirmPrice(!firmPrice)} style={{width:52,height:28,borderRadius:14,background:firmPrice?G:”#ccc”,cursor:“pointer”,position:“relative”,transition:“background .2s”,flexShrink:0}}>
<div style={{position:“absolute”,top:3,left:firmPrice?26:3,width:22,height:22,borderRadius:“50%”,background:“white”,transition:“left .2s”,boxShadow:“0 1px 4px rgba(0,0,0,.2)”}}></div>
</div>
</div>
<div style={{fontWeight:900,fontSize:15,color:”#111”,marginBottom:10}}>📍 Safe Meetup Preference</div>
<div style={{display:“flex”,flexDirection:“column”,gap:8}}>
{MEETUPS.map((m,i)=>(
<div key={i} onClick={()=>setMeetup(m.name)} style={{display:“flex”,alignItems:“center”,gap:10,padding:“12px 14px”,border:`2px solid ${meetup===m.name?G:"#eee"}`,borderRadius:12,cursor:“pointer”,background:meetup===m.name?“rgba(34,197,94,.04)”:“white”}}>
<div style={{width:20,height:20,borderRadius:“50%”,border:`2px solid ${meetup===m.name?G:"#ccc"}`,display:“flex”,alignItems:“center”,justifyContent:“center”,flexShrink:0}}>
{meetup===m.name&&<div style={{width:10,height:10,borderRadius:“50%”,background:G}}></div>}
</div>
<span style={{fontSize:18}}>{m.icon}</span>
<div><div style={{fontSize:14,fontWeight:700,color:”#222”}}>{m.name}</div><div style={{fontSize:11,color:”#999”,fontWeight:600}}>{m.desc}</div></div>
<span style={{marginLeft:“auto”,fontSize:10,fontWeight:800,padding:“2px 8px”,borderRadius:20,background:m.safe===“Safest”?“rgba(34,197,94,.1)”:“rgba(251,191,36,.1)”,color:m.safe===“Safest”?G:YELLOW}}>{m.safe}</span>
</div>
))}
</div>
</div>
)}
{step===4&&(
<div style={{textAlign:“center”,paddingTop:10}}>
<div style={{fontSize:60,marginBottom:14}}>🎉</div>
<div style={{fontFamily:RUSSO,fontSize:22,color:”#111”,marginBottom:8}}>Ready to Go Live!</div>
<div style={{background:”#f8f9fa”,borderRadius:16,padding:“18px”,marginBottom:20,textAlign:“left”,border:“1.5px solid #eee”}}>
<div style={{display:“flex”,gap:14,alignItems:“flex-start”}}>
<div style={{width:76,height:76,borderRadius:12,background:“linear-gradient(135deg,#e8f5e9,#c8e6c9)”,display:“flex”,alignItems:“center”,justifyContent:“center”,fontSize:34,flexShrink:0}}>{photo||“📸”}</div>
<div style={{flex:1,minWidth:0}}>
<div style={{fontWeight:900,fontSize:15,color:”#111”,marginBottom:3}}>{title||“Your Item Title”}</div>
<div style={{fontWeight:900,fontSize:21,color:G,marginBottom:3}}>{price?`$${parseInt(price).toLocaleString()}`:”$0”}</div>
<div style={{fontSize:12,color:”#999”,fontWeight:600}}>{cat||“Category”} · {condition||“Condition”}</div>
{meetup&&<div style={{fontSize:11,fontWeight:700,color:G,marginTop:3}}>📍 Meetup: {meetup}</div>}
</div>
</div>
</div>
<button onClick={()=>setPage(“home”)} style={{width:“100%”,padding:“16px”,background:`linear-gradient(135deg,${G},#16a34a)`,border:“none”,borderRadius:50,color:“white”,fontFamily:RUSSO,fontSize:15,cursor:“pointer”,marginBottom:10}}>🚀 Publish Listing — Free!</button>
</div>
)}
</div>
{step<4&&(
<div style={{position:“fixed”,bottom:0,left:0,right:0,background:“white”,borderTop:“1px solid #eee”,padding:“10px 20px 18px”}}>
<div style={{display:“flex”,gap:5,marginBottom:10,maxWidth:500,margin:“0 auto 10px”}}>
{[1,2,3,4].map((p,i)=>(
<div key={p} style={{flex:1,display:“flex”,flexDirection:“column”,alignItems:“center”,gap:4}}>
<div style={{height:3,width:“100%”,borderRadius:4,background:step>=p?G:”#e5e5e5”,transition:“background .3s”}}></div>
<span style={{fontSize:10,fontWeight:700,color:step===p?G:”#bbb”,fontFamily:BODY}}>{[“1. Post”,“2. Details”,“3. Price”,“4. Finish”][i]}</span>
</div>
))}
</div>
<button onClick={()=>setStep(s=>Math.min(s+1,4))} style={{width:“100%”,maxWidth:500,display:“block”,margin:“0 auto”,padding:“15px”,background:`linear-gradient(135deg,${G},#16a34a)`,border:“none”,borderRadius:50,color:“white”,fontFamily:RUSSO,fontSize:16,cursor:“pointer”}}>Next</button>
</div>
)}
<div style={{height:100}}></div>
</div>
);
}

function ProfilePage({setPage,user,setUser}) {
const [tab,setTab]=useState(“listings”);
if(!user) return (
<div style={{minHeight:“60vh”,display:“flex”,flexDirection:“column”,alignItems:“center”,justifyContent:“center”,gap:14,padding:40,textAlign:“center”}}>
<div style={{fontSize:48}}>👤</div>
<div style={{fontFamily:RUSSO,fontSize:22}}>Sign in to view your profile</div>
<button onClick={()=>setPage(“home”)} style={{padding:“12px 24px”,background:`linear-gradient(135deg,${G},#16a34a)`,border:“none”,borderRadius:12,color:“white”,fontFamily:RUSSO,fontSize:14,cursor:“pointer”}}>Go Home</button>
</div>
);
return (
<div style={{maxWidth:920,margin:“0 auto”,padding:“28px 20px”}}>
<div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:20,padding:24,marginBottom:18}}>
<div style={{display:“flex”,alignItems:“flex-start”,gap:16,marginBottom:18}}>
<div style={{width:76,height:76,borderRadius:“50%”,background:`linear-gradient(135deg,${G},#16a34a)`,display:“flex”,alignItems:“center”,justifyContent:“center”,fontFamily:RUSSO,fontSize:32,color:“white”,flexShrink:0}}>{user.name[0]}</div>
<div style={{flex:1}}>
<div style={{fontFamily:RUSSO,fontSize:21,marginBottom:3}}>{user.name}</div>
<div style={{fontFamily:BODY,fontSize:12,color:MUTED,fontWeight:600,marginBottom:10}}>{user.city||“Houston, TX”} · Member since 2026</div>
<div style={{display:“flex”,gap:6,flexWrap:“wrap”}}>
{[[“✅ Email Verified”,”#4ade80”,“rgba(34,197,94,.1)”],[“📱 Phone Verified”,BLUE,“rgba(96,165,250,.1)”],[“🪪 ID Confirmed”,”#4ade80”,“rgba(34,197,94,.1)”]].map(([l,c,bg])=>(
<span key={l} style={{fontFamily:BODY,fontSize:10,fontWeight:800,padding:“3px 9px”,borderRadius:6,background:bg,color:c}}>{l}</span>
))}
</div>
</div>
<div style={{display:“flex”,flexDirection:“column”,gap:8}}>
<button onClick={()=>setPage(“post”)} style={{padding:“8px 14px”,borderRadius:9,border:“none”,background:`linear-gradient(135deg,${G},#16a34a)`,color:“white”,fontFamily:RUSSO,fontSize:11,cursor:“pointer”}}>+ New Listing</button>
<button onClick={()=>setUser(null)} style={{padding:“8px 14px”,borderRadius:9,border:`1px solid ${BORDER}`,background:“transparent”,color:MUTED,fontFamily:BODY,fontWeight:700,fontSize:11,cursor:“pointer”}}>Sign Out</button>
</div>
</div>
<div style={{background:CARD2,border:`1px solid ${BORDER}`,borderRadius:13,padding:“13px 15px”,display:“flex”,alignItems:“center”,gap:14,marginBottom:16}}>
<div style={{width:62,height:62,borderRadius:“50%”,background:“conic-gradient(#22c55e 0% 87%,rgba(255,255,255,.07) 87% 100%)”,display:“flex”,alignItems:“center”,justifyContent:“center”,flexShrink:0}}>
<div style={{width:48,height:48,borderRadius:“50%”,background:CARD2,display:“flex”,flexDirection:“column”,alignItems:“center”,justifyContent:“center”}}>
<div style={{fontFamily:RUSSO,fontSize:16,color:G,lineHeight:1}}>87</div>
<div style={{fontFamily:BODY,fontSize:8,color:MUTED,fontWeight:700}}>TRUST</div>
</div>
</div>
<div style={{flex:1}}>
<div style={{fontFamily:RUSSO,fontSize:13,marginBottom:6}}>BuyNSell Trust Score™</div>
{[[“Item Accuracy”,85,BLUE],[“Communication”,95,G],[“Response Speed”,92,YELLOW]].map(([l,v,c])=>(
<div key={l} style={{display:“flex”,alignItems:“center”,gap:8,marginBottom:4}}>
<div style={{fontFamily:BODY,fontSize:10,color:MUTED,fontWeight:700,width:96,flexShrink:0}}>{l}</div>
<div style={{flex:1,height:4,background:BORDER,borderRadius:4,overflow:“hidden”}}><div style={{width:`${v}%`,height:“100%”,background:c,borderRadius:4}}></div></div>
<div style={{fontFamily:BODY,fontSize:10,fontWeight:800,color:c,width:22}}>{(v/10).toFixed(1)}</div>
</div>
))}
</div>
</div>
<div style={{display:“flex”,gap:6,flexWrap:“wrap”,marginBottom:16}}>
{[[“🏆 Top Seller”,YELLOW,“rgba(251,191,36,.12)”],[“⚡ Fast Responder”,G,“rgba(34,197,94,.12)”],[“✅ Verified”,BLUE,“rgba(96,165,250,.12)”],[“💎 Trusted Trader”,”#a78bfa”,“rgba(167,139,250,.12)”]].map(([l,c,bg])=>(
<span key={l} style={{fontFamily:BODY,fontSize:11,fontWeight:800,padding:“5px 10px”,borderRadius:8,background:bg,color:c}}>{l}</span>
))}
</div>
<div style={{display:“flex”,gap:18,flexWrap:“wrap”}}>
{[[“12”,“Listings”],[“8”,“Sold”],[“38”,“Reviews”],[”$3.2K”,“Earned”],[”<1hr”,“Response”]].map(([n,l])=>(
<div key={l} style={{textAlign:“center”}}>
<div style={{fontFamily:RUSSO,fontSize:18,color:G}}>{n}</div>
<div style={{fontFamily:BODY,fontSize:9,color:MUTED,fontWeight:700,textTransform:“uppercase”,letterSpacing:1}}>{l}</div>
</div>
))}
</div>
</div>
<div style={{display:“flex”,gap:4,background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:4,marginBottom:18}}>
{[[“listings”,“My Listings”],[“reviews”,“Reviews”],[“saved”,“Saved”],[“settings”,“Settings”]].map(([t,l])=>(
<div key={t} onClick={()=>setTab(t)} style={{flex:1,textAlign:“center”,padding:“9px”,fontFamily:BODY,fontSize:12,fontWeight:800,borderRadius:9,cursor:“pointer”,background:tab===t?G:“transparent”,color:tab===t?“white”:MUTED}}>{l}</div>
))}
</div>
{tab===“listings”&&<div style={{display:“grid”,gridTemplateColumns:“repeat(auto-fill,minmax(220px,1fr))”,gap:14}}>{LISTINGS.slice(0,3).map(l=><LCard key={l.id} l={l} view=“grid” onClick={()=>{}}/>)}</div>}
{tab===“reviews”&&(
<div style={{display:“flex”,flexDirection:“column”,gap:12}}>
{[{av:“J”,name:“James K.”,date:“March 18, 2026”,stars:“⭐⭐⭐⭐⭐”,item:“2018 Honda Civic”,text:“Car was exactly as described. She picked Starbucks for the meetup which made me feel safe. 100% would buy again!”,bg:“linear-gradient(135deg,#6366f1,#4f46e5)”},
{av:“S”,name:“Sandra M.”,date:“March 15, 2026”,stars:“⭐⭐⭐⭐”,item:“Gold Watch”,text:“Watch had a small scratch not in the photos but communication was amazing — replied instantly and was super honest.”,bg:“linear-gradient(135deg,#ef4444,#dc2626)”},
].map((r,i)=>(
<div key={i} style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:14,padding:17}}>
<div style={{display:“flex”,alignItems:“center”,gap:11,marginBottom:9}}>
<div style={{width:38,height:38,borderRadius:“50%”,background:r.bg,display:“flex”,alignItems:“center”,justifyContent:“center”,fontSize:15,fontWeight:800,color:“white”,flexShrink:0}}>{r.av}</div>
<div style={{flex:1}}><div style={{fontFamily:RUSSO,fontSize:13}}>{r.name}</div><div style={{fontFamily:BODY,fontSize:11,color:MUTED,fontWeight:600}}>{r.date}</div></div>
<div style={{fontSize:12}}>{r.stars}</div>
</div>
<div style={{fontFamily:BODY,fontSize:11,color:MUTED,fontWeight:700,marginBottom:7}}>Bought: {r.item}</div>
<div style={{fontFamily:BODY,fontSize:13,color:”#ccd6f6”,fontWeight:600,lineHeight:1.6,marginBottom:9}}>”{r.text}”</div>
</div>
))}
</div>
)}
{tab===“saved”&&<div style={{textAlign:“center”,padding:“50px 20px”,color:MUTED,fontFamily:BODY}}><div style={{fontSize:40,marginBottom:10}}>🤍</div><div style={{fontWeight:700,fontSize:16}}>No saved items yet</div></div>}
{tab===“settings”&&(
<div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:16,padding:22}}>
<div style={{fontFamily:RUSSO,fontSize:15,marginBottom:16}}>Account Settings</div>
{[[“Email”,user.email||“user@email.com”],[“Phone”,”•••-•••-••47 ✅ Verified”],[“Display Name”,user.name],[“Location”,user.city||“Houston, TX”]].map(([l,v])=>(
<div key={l} style={{display:“flex”,flexDirection:“column”,gap:5,marginBottom:13}}>
<label style={{fontFamily:BODY,fontSize:10,fontWeight:800,color:MUTED,textTransform:“uppercase”,letterSpacing:1}}>{l}</label>
<input defaultValue={v} style={{background:CARD2,border:`1px solid ${BORDER}`,borderRadius:10,padding:“10px 13px”,color:“white”,fontFamily:BODY,fontSize:13,fontWeight:600,outline:“none”}}/>
</div>
))}
<button style={{padding:“10px 22px”,borderRadius:10,border:“none”,background:`linear-gradient(135deg,${G},#16a34a)`,color:“white”,fontFamily:RUSSO,fontSize:13,cursor:“pointer”}}>Save Changes</button>
</div>
)}
</div>
);
}

function DisclaimerPage() {
return (
<div style={{maxWidth:800,margin:“0 auto”,padding:“40px 20px”}}>
<div style={{fontFamily:RUSSO,fontSize:28,marginBottom:6}}>Platform Disclaimer</div>
<div style={{fontFamily:BODY,fontSize:13,color:MUTED,fontWeight:600,marginBottom:32}}>Last updated: March 2026</div>
{[
{title:“1. Platform Role”,text:“BuyNSellMarketplace.com is an independent online classifieds platform that connects buyers and sellers. We do not own, sell, inspect, guarantee, or take responsibility for any item listed on this platform.”},
{title:“2. Transaction Responsibility”,text:“All transactions are solely between the buyer and seller. BuyNSellMarketplace.com is not a party to any transaction and is not responsible for the accuracy of listings, the condition of items, or any disputes that arise between users.”},
{title:“3. Safety Recommendations”,text:“We strongly encourage all users to: meet in safe public locations (Starbucks, banks, police stations), inspect all items before purchasing, never send payment before receiving and verifying the item, use our in-app Safe Meetup Pin feature.”},
{title:“4. Section 230 Protection”,text:“BuyNSellMarketplace.com is protected under Section 230 of the Communications Decency Act as a platform provider. We are not liable for content posted by users.”},
{title:“5. Privacy & Contact Info”,text:“User phone numbers and email addresses are never shown publicly on the platform. All buyer-seller communication happens through our secure in-app chat system only.”},
{title:“6. Contact”,text:“For questions, disputes, or to report issues: buynsellmarketplaceofficial@gmail.com”},
].map(s=>(
<div key={s.title} style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:14,padding:22,marginBottom:14}}>
<div style={{fontFamily:RUSSO,fontSize:15,color:G,marginBottom:10}}>{s.title}</div>
<div style={{fontFamily:BODY,fontSize:13,color:MUTED,fontWeight:600,lineHeight:1.8}}>{s.text}</div>
</div>
))}
</div>
);
}

function Footer({setPage,openDisclaimerModal}) {
return (
<footer style={{background:CARD,borderTop:`1px solid ${BORDER}`,padding:“28px 20px”}}>
<div style={{maxWidth:1100,margin:“0 auto”}}>
{/* Top row — logo + links */}
<div style={{display:“flex”,alignItems:“flex-start”,justifyContent:“space-between”,flexWrap:“wrap”,gap:20,marginBottom:20}}>
<div>
<Logo onClick={()=>setPage(“home”)} size=“sm”/>
<div style={{fontFamily:BODY,fontSize:12,color:MUTED,fontWeight:600,marginTop:10,maxWidth:240,lineHeight:1.7}}>The safe, free marketplace to buy and sell everything — locally and nationwide.</div>
<div style={{fontFamily:BODY,fontSize:12,color:G,fontWeight:700,marginTop:8}}>📧 buynsellmarketplaceofficial@gmail.com</div>
</div>
<div style={{display:“grid”,gridTemplateColumns:“repeat(2,1fr)”,gap:“4px 40px”}}>
{[[“Home”,“home”],[“Post an Ad”,“post”],[“My Profile”,“profile”]].map(([l,p])=>(
<span key={l} onClick={()=>setPage(p)} style={{fontFamily:BODY,fontSize:12,color:MUTED,fontWeight:700,cursor:“pointer”,padding:“4px 0”}}>{l}</span>
))}
</div>
</div>

```
    {/* Bottom row — copyright + small legal links */}
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10,paddingTop:16,borderTop:`1px solid ${BORDER}`}}>
      <div style={{fontFamily:BODY,fontSize:11,color:MUTED,fontWeight:600}}>© 2026 BuyNSellMarketplace.com · All Rights Reserved</div>
      <div style={{display:"flex",gap:16,flexWrap:"wrap",alignItems:"center"}}>
        <span style={{fontFamily:BODY,fontSize:11,color:MUTED,fontWeight:700,cursor:"pointer"}}>Terms of Service</span>
        <span style={{fontFamily:BODY,fontSize:11,color:MUTED,fontWeight:700,cursor:"pointer"}}>Privacy Policy</span>
        <span onClick={openDisclaimerModal} style={{fontFamily:BODY,fontSize:11,color:YELLOW,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
          ⚠️ Legal Disclaimer
        </span>
      </div>
    </div>
  </div>
</footer>
```

);
}

export default function App() {
const [page,setPage]=useState(“home”);
const [auth,setAuth]=useState(false);
const [chat,setChat]=useState(false);
const [selectedListing,setSelectedListing]=useState(null);
const [savedIds,setSavedIds]=useState([]);
const [city,setCity]=useState(“Houston”);
const [user,setUser]=useState(null);
const [showDisclaimer,setShowDisclaimer]=useState(false);

useEffect(()=>{ window.scrollTo(0,0); },[page]);
const openAuth = () => setAuth(true);

return (
<div style={{fontFamily:BODY,background:DARK,color:“white”,minHeight:“100vh”}}>
{page!==“post”&&<Nav page={page} setPage={setPage} openAuth={openAuth} city={city} user={user}/>}
{page===“home”&&<HomePage setPage={setPage} openAuth={openAuth} city={city} setSelectedListing={setSelectedListing} savedIds={savedIds} setSavedIds={setSavedIds} user={user}/>}
{page===“detail”&&selectedListing&&(
<div style={{maxWidth:1060,margin:“0 auto”,padding:“28px 20px”}}>
<button onClick={()=>setPage(“home”)} style={{padding:“8px 16px”,borderRadius:9,border:`1px solid ${BORDER}`,background:“transparent”,color:MUTED,fontFamily:BODY,fontWeight:800,fontSize:13,cursor:“pointer”,marginBottom:20}}>← Back to listings</button>
<div style={{display:“grid”,gridTemplateColumns:“1fr 350px”,gap:24}}>
<div>
<div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:16,overflow:“hidden”,marginBottom:14}}>
<div style={{height:300,background:`linear-gradient(135deg,${CARD2},${selectedListing.bg})`,display:“flex”,alignItems:“center”,justifyContent:“center”,fontSize:90}}>{selectedListing.emoji}</div>
</div>
<div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:14,padding:18}}>
<div style={{fontFamily:RUSSO,fontSize:14,marginBottom:9}}>Description</div>
<div style={{fontFamily:BODY,fontSize:13,color:MUTED,lineHeight:1.8,fontWeight:600}}>{selectedListing.title} — excellent condition. One careful owner. No issues. Serious buyers only please.</div>
</div>
</div>
<div style={{display:“flex”,flexDirection:“column”,gap:13}}>
<div>
<div style={{fontFamily:BODY,fontSize:10,fontWeight:800,color:G,textTransform:“uppercase”,letterSpacing:2,marginBottom:6}}>{selectedListing.cat} › {selectedListing.sub}</div>
<div style={{fontFamily:RUSSO,fontSize:20,lineHeight:1.2,marginBottom:8}}>{selectedListing.title}</div>
<div style={{fontFamily:RUSSO,fontSize:32,background:`linear-gradient(135deg,${G},#86efac)`,WebkitBackgroundClip:“text”,WebkitTextFillColor:“transparent”,marginBottom:10}}>{fmt(selectedListing.price)}</div>
<div style={{display:“flex”,gap:8,flexWrap:“wrap”}}>
{[`📍 ${selectedListing.city}, ${selectedListing.state}`,`🕑 ${selectedListing.age} ago`,`👁️ ${selectedListing.views} views`].map(m=>(
<div key={m} style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:9,padding:“6px 11px”,fontFamily:BODY,fontSize:11,fontWeight:700,color:MUTED}}>{m}</div>
))}
</div>
</div>
<div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:13,padding:15}}>
<div style={{fontFamily:BODY,fontSize:10,fontWeight:700,color:MUTED,textTransform:“uppercase”,letterSpacing:1,marginBottom:10}}>Seller</div>
<div style={{display:“flex”,alignItems:“center”,gap:10,marginBottom:10}}>
<div style={{width:42,height:42,borderRadius:“50%”,background:`linear-gradient(135deg,${G},#16a34a)`,display:“flex”,alignItems:“center”,justifyContent:“center”,fontFamily:RUSSO,fontSize:17,color:“white”}}>{selectedListing.seller[0]}</div>
<div><div style={{fontFamily:RUSSO,fontSize:14}}>{selectedListing.seller}</div><div style={{fontFamily:BODY,fontSize:11,color:MUTED,fontWeight:600}}>Member since 2023</div></div>
</div>
<div style={{background:CARD2,border:`1px solid ${BORDER}`,borderRadius:9,padding:“9px 11px”,display:“flex”,alignItems:“center”,gap:9,marginBottom:9}}>
<div style={{fontFamily:RUSSO,fontSize:19,color:selectedListing.trust>=85?G:YELLOW}}>{selectedListing.trust}</div>
<div><div style={{fontFamily:RUSSO,fontSize:11}}>Trust Score™</div><div style={{fontFamily:BODY,fontSize:10,color:MUTED}}>⭐ 4.9 · 38 reviews</div></div>
</div>
{selectedListing.verified&&<div style={{fontFamily:BODY,fontSize:11,fontWeight:700,color:”#4ade80”,background:“rgba(34,197,94,.07)”,borderRadius:8,padding:“7px 10px”}}>✅ Email & Phone Verified · 🚫 No Google Numbers</div>}
</div>
<button onClick={()=>setChat(true)} style={{width:“100%”,padding:“13px”,background:`linear-gradient(135deg,${G},#16a34a)`,border:“none”,borderRadius:11,color:“white”,fontFamily:RUSSO,fontSize:14,cursor:“pointer”}}>💬 Message Seller</button>
<button onClick={()=>setSavedIds(p=>p.includes(selectedListing.id)?p.filter(x=>x!==selectedListing.id):[…p,selectedListing.id])} style={{width:“100%”,padding:“12px”,background:“transparent”,border:`1px solid ${BORDER}`,borderRadius:11,color:“white”,fontFamily:BODY,fontWeight:800,fontSize:14,cursor:“pointer”}}>{savedIds.includes(selectedListing.id)?“❤️ Saved”:“🤍 Save Listing”}</button>
<button style={{width:“100%”,padding:“11px”,background:“transparent”,border:“1px solid rgba(239,68,68,.2)”,borderRadius:11,color:R,fontFamily:BODY,fontWeight:700,fontSize:13,cursor:“pointer”}}>🚩 Report Listing</button>
<div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:13,padding:15}}>
<div style={{fontFamily:RUSSO,fontSize:13,marginBottom:4}}>📍 Safe Meetup Spot</div>
<div style={{fontFamily:BODY,fontSize:11,color:MUTED,fontWeight:600,marginBottom:12}}>Pick a safe public spot — send a pin, never your address!</div>
<div style={{display:“flex”,flexDirection:“column”,gap:6}}>
{MEETUPS.map((m,i)=>(
<div key={i} onClick={()=>setChat(true)} style={{display:“flex”,alignItems:“center”,gap:8,background:CARD2,border:`1px solid ${BORDER}`,borderRadius:10,padding:“8px 10px”,cursor:“pointer”}}>
<span style={{fontSize:17}}>{m.icon}</span>
<div style={{flex:1}}><div style={{fontFamily:BODY,fontSize:12,fontWeight:800}}>{m.name}</div><div style={{fontFamily:BODY,fontSize:10,color:MUTED,fontWeight:600}}>{m.desc}</div></div>
<span style={{fontFamily:BODY,fontSize:9,fontWeight:800,padding:“2px 7px”,borderRadius:20,background:“rgba(34,197,94,.1)”,color:m.sc}}>{m.safe}</span>
</div>
))}
</div>
<button onClick={()=>setChat(true)} style={{width:“100%”,marginTop:10,background:`linear-gradient(135deg,${G},#16a34a)`,border:“none”,borderRadius:10,padding:“10px”,color:“white”,fontFamily:RUSSO,fontSize:12,cursor:“pointer”}}>📍 Send Meetup Pin in Chat</button>
</div>
</div>
</div>
</div>
)}
{page===“post”&&<PostPage setPage={setPage} user={user} openAuth={openAuth}/>}
{page===“profile”&&<ProfilePage setPage={setPage} user={user} setUser={setUser}/>}
{page!==“post”&&<Footer setPage={setPage} openDisclaimerModal={()=>setShowDisclaimer(true)}/>}
{auth&&<AuthModal onClose={()=>setAuth(false)} setUser={setUser} setPage={setPage}/>}
{chat&&selectedListing&&<ChatModal listing={selectedListing} onClose={()=>setChat(false)}/>}
{showDisclaimer&&<DisclaimerModal onClose={()=>setShowDisclaimer(false)}/>}
<style>{`@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.4)}}*::-webkit-scrollbar{display:none;}`}</style>
</div>
);
}
