import { useState, useMemo } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=IBM+Plex+Mono:wght@400;500;600&family=Barlow:wght@400;500;600&display=swap');`;

const K = {
  bg:"#07070f", bg2:"#0e0e1c", bg3:"#141428", bg4:"#1a1a30",
  border:"#1e1e35", border2:"#2a2a48",
  text:"#ddddf0", text2:"#8888a8", text3:"#55557a",
  amber:"#f59e0b", amberDim:"rgba(245,158,11,0.12)",
  green:"#10b981", greenDim:"rgba(16,185,129,0.12)",
  red:"#ef4444", redDim:"rgba(239,68,68,0.12)",
  cyan:"#22d3ee",
};

const MAKE_THEME = {
  "BMW":            ["#040d1e","#0a2450","#1c69d4"],
  "Tesla":          ["#180404","#3a0d0d","#ef4444"],
  "Ford":           ["#02091c","#031558","#3b82f6"],
  "Porsche":        ["#160d00","#3a2400","#c8a052"],
  "Toyota":         ["#180002","#3a0006","#dc2626"],
  "Mercedes-Benz":  ["#001018","#00283d","#22d3ee"],
  "Audi":           ["#140002","#360008","#f43f5e"],
  "Rivian":         ["#001416","#003438","#2dd4bf"],
  "Chevrolet":      ["#141000","#362800","#eab308"],
  "Land Rover":     ["#001208","#003018","#22c55e"],
  "Lexus":          ["#141000","#362800","#f59e0b"],
  "Volkswagen":     ["#02060e","#030d32","#38bdf8"],
};

const VEHICLES = [
  { id:1,  make:"BMW",           model:"M3 Competition",   year:2022, trim:"xDrive",       price:58900,  marketAvg:68500,  mileage:18400, condition:"Used", bodyType:"Sedan",    location:"Miami, FL",       zip:"33101", daysOnMarket:12, color:"Brooklyn Grey",  extColor:"grey",   intColor:"black",  transmission:"8-Spd Auto",    drivetrain:"AWD", fuel:"gas",     cylinders:6, doors:4, titleStatus:"clean", saleBy:"dealer", engine:"3.0L TT I6",       hp:503, mpg:"16/23",   dropped:true,  dropAmt:2500, dealer:"South Florida BMW" },
  { id:2,  make:"Tesla",         model:"Model Y",          year:2023, trim:"Long Range",   price:38500,  marketAvg:44200,  mileage:8200,  condition:"Used", bodyType:"SUV",      location:"Atlanta, GA",     zip:"30301", daysOnMarket:5,  color:"Pearl White",    extColor:"white",  intColor:"white",  transmission:"Single-Spd",    drivetrain:"AWD", fuel:"electric",cylinders:0, doors:4, titleStatus:"clean", saleBy:"dealer", engine:"Dual Motor EV",    hp:384, mpg:"122 MPGe",dropped:false, dropAmt:0,    dealer:"Tesla Certified" },
  { id:3,  make:"Ford",          model:"F-150 Raptor R",   year:2023, trim:"Raptor R",     price:86500,  marketAvg:98000,  mileage:4200,  condition:"Used", bodyType:"Truck",    location:"Dallas, TX",      zip:"75201", daysOnMarket:8,  color:"Race Red",       extColor:"red",    intColor:"black",  transmission:"10-Spd Auto",   drivetrain:"4WD", fuel:"gas",     cylinders:8, doors:4, titleStatus:"clean", saleBy:"dealer", engine:"5.2L S/C V8",      hp:700, mpg:"10/16",   dropped:false, dropAmt:0,    dealer:"Lone Star Ford" },
  { id:4,  make:"Porsche",       model:"911 Carrera S",    year:2020, trim:"Carrera S",    price:89500,  marketAvg:98000,  mileage:14200, condition:"CPO",  bodyType:"Coupe",    location:"Los Angeles, CA", zip:"90001", daysOnMarket:21, color:"Guards Red",     extColor:"red",    intColor:"black",  transmission:"PDK 7-Spd",     drivetrain:"RWD", fuel:"gas",     cylinders:6, doors:2, titleStatus:"clean", saleBy:"dealer", engine:"3.0L Flat-6",      hp:443, mpg:"18/24",   dropped:false, dropAmt:0,    dealer:"Porsche Beverly Hills" },
  { id:5,  make:"Toyota",        model:"Tacoma TRD Pro",   year:2023, trim:"TRD Pro",      price:54200,  marketAvg:56800,  mileage:3100,  condition:"Used", bodyType:"Truck",    location:"Denver, CO",      zip:"80201", daysOnMarket:3,  color:"Solar Octane",   extColor:"orange", intColor:"black",  transmission:"6-Spd Auto",    drivetrain:"4WD", fuel:"gas",     cylinders:6, doors:4, titleStatus:"clean", saleBy:"dealer", engine:"3.5L V6",          hp:278, mpg:"17/21",   dropped:false, dropAmt:0,    dealer:"Mountain Toyota" },
  { id:6,  make:"Mercedes-Benz", model:"AMG GT 63 S",      year:2021, trim:"4-Door",       price:112000, marketAvg:142000, mileage:19800, condition:"Used", bodyType:"Sedan",    location:"New York, NY",    zip:"10001", daysOnMarket:34, color:"Obsidian Black", extColor:"black",  intColor:"black",  transmission:"9G-Tronic",     drivetrain:"AWD", fuel:"gas",     cylinders:8, doors:4, titleStatus:"clean", saleBy:"dealer", engine:"4.0L V8 Biturbo",  hp:630, mpg:"15/21",   dropped:true,  dropAmt:8000, dealer:"Mercedes Manhattan" },
  { id:7,  make:"Audi",          model:"RS6 Avant",        year:2022, trim:"RS 6 Avant",   price:104000, marketAvg:118000, mileage:11200, condition:"CPO",  bodyType:"Wagon",    location:"Chicago, IL",     zip:"60601", daysOnMarket:9,  color:"Nardo Grey",     extColor:"grey",   intColor:"grey",   transmission:"8-Spd Tiptronic",drivetrain:"AWD", fuel:"gas",    cylinders:8, doors:4, titleStatus:"clean", saleBy:"dealer", engine:"4.0L V8 TFSI",    hp:591, mpg:"15/22",   dropped:true,  dropAmt:4000, dealer:"Audi Chicago" },
  { id:8,  make:"Rivian",        model:"R1T",              year:2022, trim:"Launch Ed.",   price:62000,  marketAvg:71000,  mileage:15600, condition:"Used", bodyType:"Truck",    location:"Seattle, WA",     zip:"98101", daysOnMarket:7,  color:"Midnight Blue",  extColor:"blue",   intColor:"black",  transmission:"Single-Spd",    drivetrain:"AWD", fuel:"electric",cylinders:0, doors:4, titleStatus:"clean", saleBy:"private", engine:"Quad Motor EV",   hp:835, mpg:"61 MPGe", dropped:false, dropAmt:0,    dealer:"Private Seller" },
  { id:9,  make:"Chevrolet",     model:"Corvette Z06",     year:2023, trim:"3LZ",          price:118500, marketAvg:119000, mileage:4800,  condition:"Used", bodyType:"Coupe",    location:"Nashville, TN",   zip:"37201", daysOnMarket:2,  color:"Amplify Orange", extColor:"orange", intColor:"black",  transmission:"8-Spd DCT",     drivetrain:"RWD", fuel:"gas",     cylinders:8, doors:2, titleStatus:"clean", saleBy:"dealer", engine:"5.5L Flat-V8",     hp:670, mpg:"13/21",   dropped:false, dropAmt:0,    dealer:"Bowman Chevrolet" },
  { id:10, make:"Land Rover",    model:"Defender 110 X",   year:2022, trim:"X",            price:79000,  marketAvg:88000,  mileage:22100, condition:"Used", bodyType:"SUV",      location:"Boston, MA",      zip:"02101", daysOnMarket:18, color:"Gondwana Stone", extColor:"white",  intColor:"grey",   transmission:"8-Spd Auto",    drivetrain:"4WD", fuel:"gas",     cylinders:6, doors:4, titleStatus:"clean", saleBy:"dealer", engine:"3.0L I6 MHEV",     hp:395, mpg:"17/22",   dropped:true,  dropAmt:3500, dealer:"Land Rover Boston" },
  { id:11, make:"Lexus",         model:"LC 500",           year:2021, trim:"Base",         price:72000,  marketAvg:84000,  mileage:16900, condition:"CPO",  bodyType:"Coupe",    location:"Phoenix, AZ",     zip:"85001", daysOnMarket:27, color:"Structural Blue",extColor:"blue",   intColor:"black",  transmission:"10-Spd Auto",   drivetrain:"RWD", fuel:"gas",     cylinders:8, doors:2, titleStatus:"clean", saleBy:"dealer", engine:"5.0L V8",          hp:471, mpg:"16/26",   dropped:false, dropAmt:0,    dealer:"Lexus of Scottsdale" },
  { id:12, make:"Volkswagen",    model:"Golf R",           year:2022, trim:"Golf R",       price:32800,  marketAvg:39500,  mileage:13700, condition:"Used", bodyType:"Hatchback",location:"Portland, OR",    zip:"97201", daysOnMarket:6,  color:"Lapiz Blue",     extColor:"blue",   intColor:"black",  transmission:"7-Spd DSG",     drivetrain:"AWD", fuel:"gas",     cylinders:4, doors:4, titleStatus:"clean", saleBy:"dealer", engine:"2.0L TSI",         hp:315, mpg:"22/29",   dropped:true,  dropAmt:1200, dealer:"Pacific VW" },
];

const ALL_MAKES  = [...new Set(VEHICLES.map(v=>v.make))].sort();
const MODEL_MAP  = ALL_MAKES.reduce((acc,m) => { acc[m] = VEHICLES.filter(v=>v.make===m).map(v=>v.model); return acc; }, {});
const BODY_TYPES = [...new Set(VEHICLES.map(v=>v.bodyType))].sort();
const EXT_COLORS = [...new Set(VEHICLES.map(v=>v.extColor))].sort();
const INT_COLORS = [...new Set(VEHICLES.map(v=>v.intColor))].sort();
const DRIVE_OPTS = ["AWD","4WD","FWD","RWD"];
const CYL_OPTS   = ["0 (Electric)","4","6","8","10","12"];
const DOOR_OPTS  = ["2","4","5"];
const RADIUS_OPTS= ["25","50","100","200","300","500","country"];

const DEFAULT_FILTERS = {
  make:"", model:"", trimKw:"",
  zip:"", radius:"country", includeIntl:false,
  minPrice:"", maxPrice:"",
  minYear:"", maxYear:"",
  minMileage:"", maxMileage:"",
  conditions:[], fuelTypes:[],
  transmission:"any", saleType:"any", saleBy:"any",
  bodyTypes:[], driveTypes:[], extColors:[], intColors:[],
  doors:[], cylinders:[], titleStatus:"",
  keywords:"", filterDays:"",
  minScore:0, sort:"score_desc",
};

function calcScore(v) {
  let s = 50;
  s += ((v.marketAvg - v.price) / v.marketAvg) * 120;
  const age = 2025 - v.year;
  const expMi = age * 12000;
  if (expMi > 0) s += ((expMi - v.mileage) / expMi) * 12;
  if (v.condition === "CPO") s += 6;
  if (v.daysOnMarket > 30) s -= 6;
  if (v.daysOnMarket <= 5) s += 4;
  if (v.dropped) s += 5;
  return Math.min(100, Math.max(1, Math.round(s)));
}
function dealTag(score) {
  if (score >= 82) return { label:"🔥 Hot Deal",   color:K.green };
  if (score >= 66) return { label:"✅ Good Deal",  color:K.cyan };
  if (score >= 50) return { label:"👍 Fair Deal",  color:K.amber };
  return                   { label:"⚠️ Overpriced", color:K.red };
}
const $  = n => "$" + n.toLocaleString();
const mi = n => n.toLocaleString() + " mi";

/* ── COLLAPSIBLE SECTION ──────────────────────────────── */
function Section({ title, defaultOpen=true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom:4, borderBottom:`1px solid ${K.border}`, paddingBottom: open ? 14 : 0 }}>
      <button
        onClick={()=>setOpen(o=>!o)}
        style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", background:"transparent", border:"none", cursor:"pointer", padding:"10px 0 6px", color:K.text2, fontFamily:"monospace", fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" }}
      >
        {title}
        <span style={{ fontSize:10, color:K.text3, transition:"transform 0.2s", transform: open?"rotate(180deg)":"rotate(0deg)" }}>▾</span>
      </button>
      {open && <div style={{ paddingTop:4 }}>{children}</div>}
    </div>
  );
}

/* ── FILTER PRIMITIVES ────────────────────────────────── */
function FInput({ value, onChange, placeholder, type="text", inputmode }) {
  return (
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} inputMode={inputmode}
      style={{ width:"100%", background:K.bg3, border:`1px solid ${K.border}`, borderRadius:6, padding:"6px 10px", color:K.text, fontSize:12, outline:"none", fontFamily:"Barlow,sans-serif" }} />
  );
}
function FSelect({ value, onChange, options, placeholder }) {
  return (
    <select value={value} onChange={e=>onChange(e.target.value)}
      style={{ width:"100%", background:K.bg3, border:`1px solid ${K.border}`, borderRadius:6, padding:"6px 10px", color: value ? K.text : K.text2, fontSize:12, outline:"none", fontFamily:"Barlow,sans-serif" }}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => <option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}
    </select>
  );
}
function FToggle({ value, onChange, options }) {
  return (
    <div style={{ display:"flex", gap:3 }}>
      {options.map(o => (
        <button key={o.value} onClick={()=>onChange(o.value)}
          style={{ flex:1, padding:"5px 0", borderRadius:5, border:`1px solid ${value===o.value ? K.amber+"66" : K.border}`, background: value===o.value ? K.amberDim : "transparent", color: value===o.value ? K.amber : K.text2, fontSize:11, cursor:"pointer", fontFamily:"Barlow,sans-serif", fontWeight: value===o.value ? 600 : 400, transition:"all 0.15s" }}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
function FCheck({ label, checked, onChange }) {
  return (
    <label style={{ display:"flex", alignItems:"center", gap:7, cursor:"pointer", fontSize:12, color: checked ? K.text : K.text2, marginBottom:4 }}>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ accentColor:K.amber, width:12, height:12 }} />
      {label}
    </label>
  );
}
function FMulti({ options, selected, onToggle, cols=1 }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:`repeat(${cols},1fr)`, gap:"2px 6px" }}>
      {options.map(o => {
        const val = typeof o === "string" ? o : o.value;
        const lbl = typeof o === "string" ? o : o.label;
        const on  = selected.includes(val);
        return (
          <label key={val} style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer", fontSize:11, color: on ? K.text : K.text2, padding:"3px 0" }}>
            <input type="checkbox" checked={on} onChange={()=>onToggle(val)} style={{ accentColor:K.amber, width:11, height:11 }} />
            {lbl}
          </label>
        );
      })}
    </div>
  );
}
function RangePair({ minVal, maxVal, onMin, onMax, minPh, maxPh, inputmode="numeric" }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
      <FInput value={minVal} onChange={onMin} placeholder={minPh} inputmode={inputmode} />
      <FInput value={maxVal} onChange={onMax} placeholder={maxPh} inputmode={inputmode} />
    </div>
  );
}
function ColorSwatch({ color, selected, onToggle }) {
  const HEX = { white:"#f1f0ed", black:"#1a1a1a", grey:"#888888", red:"#dc2626", blue:"#3b82f6", orange:"#f97316", yellow:"#eab308", green:"#22c55e", silver:"#c0c0c0", brown:"#92400e", purple:"#9333ea", gold:"#d97706" };
  const hex = HEX[color] || "#888";
  return (
    <button onClick={()=>onToggle(color)} title={color.charAt(0).toUpperCase()+color.slice(1)}
      style={{ width:22, height:22, borderRadius:"50%", background:hex, border:`2px solid ${selected ? K.amber : "transparent"}`, cursor:"pointer", outline: selected ? `2px solid ${K.amber}` : "none", outlineOffset:1, transition:"all 0.15s" }} />
  );
}

/* ── FILTER SIDEBAR ───────────────────────────────────── */
function FilterSidebar({ filters, onChange }) {
  const set = (key, val) => onChange({ ...filters, [key]: val });
  const toggle = (key, val) => {
    const arr = filters[key];
    set(key, arr.includes(val) ? arr.filter(x=>x!==val) : [...arr, val]);
  };
  const modelOpts = filters.make ? (MODEL_MAP[filters.make] || []) : [];

  return (
    <div style={{ width:240, minWidth:240, background:K.bg2, borderRight:`1px solid ${K.border}`, padding:"14px 14px 20px", overflowY:"auto", display:"flex", flexDirection:"column", gap:0 }}>
      {/* header */}
      <div style={{ fontSize:10, fontWeight:700, color:K.text2, fontFamily:"monospace", letterSpacing:"0.18em", textTransform:"uppercase", marginBottom:12, paddingBottom:10, borderBottom:`1px solid ${K.border}` }}>⚙ Filters</div>

      {/* VEHICLE */}
      <Section title="Vehicle">
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          <FSelect value={filters.make} onChange={v=>onChange({...filters,make:v,model:""})}
            options={ALL_MAKES.map(m=>({value:m,label:m}))} placeholder="Any Make" />
          <FSelect value={filters.model} onChange={v=>set("model",v)}
            options={modelOpts.map(m=>({value:m,label:m}))} placeholder={filters.make?"Any Model":"Select Make First"} />
          <FInput value={filters.trimKw} onChange={v=>set("trimKw",v)} placeholder='Trim (e.g. "Grand Touring")' />
        </div>
      </Section>

      {/* LOCATION */}
      <Section title="Location">
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          <FInput value={filters.zip} onChange={v=>set("zip",v)} placeholder="Zip / Postal Code" />
          <FSelect value={filters.radius} onChange={v=>set("radius",v)}
            options={[...RADIUS_OPTS.slice(0,-1).map(r=>({value:r,label:`Within ${r} miles`})), {value:"country",label:"Nationwide"}]} />
          <label style={{ display:"flex", alignItems:"center", gap:7, cursor:"pointer", fontSize:11, color:filters.includeIntl?K.text:K.text2 }}>
            <input type="checkbox" checked={filters.includeIntl} onChange={e=>set("includeIntl",e.target.checked)} style={{ accentColor:K.amber }} />
            Include International
          </label>
        </div>
      </Section>

      {/* PRICE */}
      <Section title="Price">
        <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
            <div><div style={lbl}>Min</div><FInput value={filters.minPrice} onChange={v=>set("minPrice",v)} placeholder="$0" inputmode="numeric" /></div>
            <div><div style={lbl}>Max</div><FInput value={filters.maxPrice} onChange={v=>set("maxPrice",v)} placeholder="Any" inputmode="numeric" /></div>
          </div>
        </div>
      </Section>

      {/* YEAR */}
      <Section title="Year">
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
          <div><div style={lbl}>Min</div><FInput value={filters.minYear} onChange={v=>set("minYear",v)} placeholder="1900" inputmode="numeric" /></div>
          <div><div style={lbl}>Max</div><FInput value={filters.maxYear} onChange={v=>set("maxYear",v)} placeholder="2026" inputmode="numeric" /></div>
        </div>
      </Section>

      {/* MILEAGE */}
      <Section title="Mileage">
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
          <div><div style={lbl}>Min</div><FInput value={filters.minMileage} onChange={v=>set("minMileage",v)} placeholder="0" inputmode="numeric" /></div>
          <div><div style={lbl}>Max</div><FInput value={filters.maxMileage} onChange={v=>set("maxMileage",v)} placeholder="Any" inputmode="numeric" /></div>
        </div>
      </Section>

      {/* CONDITION */}
      <Section title="Condition">
        <FMulti options={["Used","CPO","New"]} selected={filters.conditions} onToggle={v=>toggle("conditions",v)} />
      </Section>

      {/* FUEL TYPE */}
      <Section title="Fuel Type" defaultOpen={false}>
        <FMulti options={[{value:"gas",label:"Gas"},{value:"electric",label:"Electric"},{value:"hybrid",label:"Hybrid"},{value:"diesel",label:"Diesel"}]} selected={filters.fuelTypes} onToggle={v=>toggle("fuelTypes",v)} />
      </Section>

      {/* TRANSMISSION */}
      <Section title="Transmission" defaultOpen={false}>
        <FToggle value={filters.transmission} onChange={v=>set("transmission",v)}
          options={[{value:"any",label:"Any"},{value:"man",label:"Manual"},{value:"auto",label:"Auto"}]} />
      </Section>

      {/* BODY STYLE */}
      <Section title="Body Style" defaultOpen={false}>
        <FMulti options={BODY_TYPES} selected={filters.bodyTypes} onToggle={v=>toggle("bodyTypes",v)} cols={2} />
      </Section>

      {/* DRIVE TYPE */}
      <Section title="Drive Type" defaultOpen={false}>
        <FMulti options={DRIVE_OPTS} selected={filters.driveTypes} onToggle={v=>toggle("driveTypes",v)} cols={2} />
      </Section>

      {/* EXTERIOR COLOR */}
      <Section title="Exterior Color" defaultOpen={false}>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, padding:"4px 0" }}>
          {EXT_COLORS.map(c => <ColorSwatch key={c} color={c} selected={filters.extColors.includes(c)} onToggle={v=>toggle("extColors",v)} />)}
        </div>
        {filters.extColors.length > 0 && (
          <div style={{ fontSize:10, color:K.text2, fontFamily:"monospace", marginTop:4 }}>
            {filters.extColors.map(c=>c.charAt(0).toUpperCase()+c.slice(1)).join(", ")}
          </div>
        )}
      </Section>

      {/* INTERIOR COLOR */}
      <Section title="Interior Color" defaultOpen={false}>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, padding:"4px 0" }}>
          {INT_COLORS.map(c => <ColorSwatch key={c} color={c} selected={filters.intColors.includes(c)} onToggle={v=>toggle("intColors",v)} />)}
        </div>
      </Section>

      {/* CYLINDERS */}
      <Section title="Cylinders" defaultOpen={false}>
        <FMulti options={CYL_OPTS} selected={filters.cylinders} onToggle={v=>toggle("cylinders",v)} cols={2} />
      </Section>

      {/* DOORS */}
      <Section title="Doors" defaultOpen={false}>
        <FToggle value={filters.doors[0]||""} onChange={v=>set("doors",v?[v]:[])}
          options={[{value:"",label:"Any"},{value:"2",label:"2"},{value:"4",label:"4"},{value:"5",label:"5"}]} />
      </Section>

      {/* TITLE */}
      <Section title="Title Status" defaultOpen={false}>
        <FSelect value={filters.titleStatus} onChange={v=>set("titleStatus",v)}
          options={[{value:"clean",label:"Clean"},{value:"salvage",label:"Salvage"},{value:"rebuilt",label:"Rebuilt"},{value:"lemon",label:"Lemon Law"}]}
          placeholder="Any" />
      </Section>

      {/* SALE TYPE */}
      <Section title="Sale Type" defaultOpen={false}>
        <FToggle value={filters.saleType} onChange={v=>set("saleType",v)}
          options={[{value:"any",label:"Any"},{value:"auction",label:"Auction"},{value:"classified",label:"Listed"}]} />
      </Section>

      {/* FOR SALE BY */}
      <Section title="For Sale By" defaultOpen={false}>
        <FToggle value={filters.saleBy} onChange={v=>set("saleBy",v)}
          options={[{value:"any",label:"Any"},{value:"private",label:"Private"},{value:"dealer",label:"Dealer"}]} />
      </Section>

      {/* KEYWORDS */}
      <Section title="Keywords" defaultOpen={false}>
        <FInput value={filters.keywords} onChange={v=>set("keywords",v)} placeholder='"apple carplay" -aftermarket' />
        <div style={{ fontSize:10, color:K.text3, fontFamily:"monospace", marginTop:4, lineHeight:1.5 }}>Use quotes for phrases, - to exclude</div>
      </Section>

      {/* DAYS LISTED */}
      <Section title="Days Listed" defaultOpen={false}>
        <FSelect value={filters.filterDays} onChange={v=>set("filterDays",v)}
          options={[1,2,3,5,7,10].map(n=>({value:String(n),label:`Last ${n} day${n>1?"s":""}`}))}
          placeholder="Any" />
      </Section>

      {/* DEAL SCORE */}
      <Section title="Deal Score">
        <div style={{ fontSize:11, color:K.text2, fontFamily:"monospace", marginBottom:6 }}>
          Min score: <span style={{ color:K.amber, fontWeight:600 }}>{filters.minScore}</span>
        </div>
        <input type="range" min={0} max={100} value={filters.minScore} onChange={e=>set("minScore",+e.target.value)} style={{ width:"100%", accentColor:K.amber }} />
      </Section>

      {/* SORT */}
      <Section title="Sort By">
        <FSelect value={filters.sort} onChange={v=>set("sort",v)}
          options={[
            {value:"score_desc",label:"Deal Score ↓"},
            {value:"price_asc",label:"Price ↑"},
            {value:"price_desc",label:"Price ↓"},
            {value:"savings_desc",label:"Savings ↓"},
            {value:"mileage_asc",label:"Mileage ↑"},
            {value:"newest",label:"Newest Listed"},
          ]} />
      </Section>

      <button onClick={()=>onChange(DEFAULT_FILTERS)} style={{ marginTop:10, width:"100%", background:"transparent", border:`1px solid ${K.border2}`, borderRadius:6, padding:"7px", color:K.text2, fontSize:10, cursor:"pointer", fontFamily:"monospace", letterSpacing:"0.08em" }}>
        RESET ALL FILTERS
      </button>
    </div>
  );
}

const lbl = { fontSize:10, color:"#8888a8", fontFamily:"monospace", marginBottom:3 };

/* ── VEHICLE CARD ─────────────────────────────────────── */
function VehicleCard({ v, score, saved, comparing, onSave, onCompare, onClick }) {
  const mc = MAKE_THEME[v.make] || ["#0a0a1a","#1a1a30","#6666aa"];
  const savings = v.marketAvg - v.price;
  const { label, color } = dealTag(score);
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:K.bg2, borderRadius:12, overflow:"hidden", cursor:"pointer", border:`1px solid ${comparing?K.amber:hov?K.border2:K.border}`, transform:hov?"translateY(-3px)":"none", transition:"all 0.2s ease", boxShadow:hov?"0 12px 32px rgba(0,0,0,0.4)":"none" }}>
      <div style={{ background:`linear-gradient(140deg,${mc[0]} 0%,${mc[1]} 100%)`, padding:"18px 16px 14px", minHeight:118, display:"flex", flexDirection:"column", justifyContent:"space-between", position:"relative" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div style={{ background:`${color}20`, border:`1px solid ${color}50`, borderRadius:5, padding:"3px 8px", fontSize:10, fontFamily:"IBM Plex Mono,monospace", color, fontWeight:600, letterSpacing:"0.02em" }}>{label}</div>
          <div style={{ width:44, height:44, borderRadius:"50%", background:`conic-gradient(${color} ${score*3.6}deg, rgba(0,0,0,0.35) 0deg)`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ width:34, height:34, borderRadius:"50%", background:mc[0], display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, fontFamily:"IBM Plex Mono,monospace", color }}>{score}</div>
          </div>
        </div>
        <div>
          {v.dropped && <span style={{ fontSize:9, background:"rgba(16,185,129,0.2)", border:"1px solid rgba(16,185,129,0.4)", color:K.green, borderRadius:3, padding:"2px 5px", fontFamily:"monospace", fontWeight:700, marginBottom:4, display:"inline-block" }}>↓ ${v.dropAmt.toLocaleString()} DROPPED</span>}
          <div style={{ fontSize:11, color:mc[2], fontFamily:"monospace", fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase" }}>{v.year} · {v.condition}</div>
          <div style={{ fontSize:22, fontWeight:900, fontFamily:"Barlow Condensed,sans-serif", color:"#fff", lineHeight:1.05 }}>{v.make}</div>
          <div style={{ fontSize:16, fontWeight:600, fontFamily:"Barlow Condensed,sans-serif", color:"rgba(255,255,255,0.65)", lineHeight:1.1 }}>{v.model}</div>
        </div>
      </div>
      <div style={{ padding:"14px 16px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:10 }}>
          <div>
            <div style={{ fontSize:24, fontWeight:800, fontFamily:"Barlow Condensed,sans-serif", color:K.text }}>{$(v.price)}</div>
            <div style={{ fontSize:11, color:K.text2, fontFamily:"monospace" }}>avg {$(v.marketAvg)}</div>
          </div>
          {savings > 0 && <div style={{ background:K.greenDim, border:"1px solid rgba(16,185,129,0.3)", borderRadius:6, padding:"4px 10px", textAlign:"right" }}><div style={{ fontSize:12, fontWeight:700, color:K.green, fontFamily:"monospace" }}>−{$(savings)}</div><div style={{ fontSize:9, color:"rgba(16,185,129,0.6)", fontFamily:"monospace" }}>vs market</div></div>}
        </div>
        <div style={{ display:"flex", gap:6, marginBottom:10, flexWrap:"wrap" }}>
          {[`⚡ ${v.hp}hp`, `📍 ${mi(v.mileage)}`, `⛽ ${v.mpg}`].map(s => (
            <span key={s} style={{ background:K.bg3, borderRadius:4, padding:"3px 7px", fontSize:10, color:K.text2, fontFamily:"monospace", whiteSpace:"nowrap" }}>{s}</span>
          ))}
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontSize:11, color:K.text3 }}>📍 {v.location} · {v.daysOnMarket}d</div>
          <div style={{ display:"flex", gap:5 }} onClick={e=>e.stopPropagation()}>
            <IBtn active={saved}     color={K.amber} onClick={onSave}    title={saved?"Unsave":"Save"}>★</IBtn>
            <IBtn active={comparing} color={K.amber} onClick={onCompare} title={comparing?"Remove":"Compare"}>⊕</IBtn>
          </div>
        </div>
      </div>
    </div>
  );
}
function IBtn({ active, color, onClick, title, children }) {
  return <button onClick={onClick} title={title} style={{ width:28, height:28, borderRadius:6, cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.15s", background:active?`${color}20`:"transparent", border:`1px solid ${active?`${color}60`:K.border}`, color:active?color:K.text2 }}>{children}</button>;
}

/* ── COMPARE VIEW ─────────────────────────────────────── */
function CompareView({ ids, onRemove }) {
  const vehicles = ids.map(id=>VEHICLES.find(v=>v.id===id)).filter(Boolean);
  if (!vehicles.length) return <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", color:K.text2, gap:12 }}><div style={{ fontSize:48 }}>⊕</div><div style={{ fontFamily:"Barlow Condensed,sans-serif", fontSize:22, fontWeight:700 }}>Select vehicles to compare</div><div style={{ fontSize:13 }}>Use the ⊕ button on listings (max 3)</div></div>;
  const rows = [
    { label:"Deal Score",   fn:v=>{const s=calcScore(v);const{color}=dealTag(s);return <span style={{color,fontWeight:700,fontFamily:"monospace"}}>{s}/100</span>;}},
    { label:"Ask Price",    fn:v=><span style={{fontFamily:"monospace",fontWeight:700}}>{$(v.price)}</span>},
    { label:"Market Avg",   fn:v=><span style={{fontFamily:"monospace",color:K.text2}}>{$(v.marketAvg)}</span>},
    { label:"Savings",      fn:v=>{const s=v.marketAvg-v.price;return <span style={{color:s>0?K.green:K.red,fontFamily:"monospace",fontWeight:600}}>{s>0?"−":"+"}{$(Math.abs(s))}</span>;}},
    { label:"Year",         fn:v=>v.year},
    { label:"Mileage",      fn:v=>mi(v.mileage)},
    { label:"Condition",    fn:v=>v.condition},
    { label:"Engine",       fn:v=><span style={{fontSize:11}}>{v.engine}</span>},
    { label:"Horsepower",   fn:v=>`${v.hp} hp`},
    { label:"Fuel",         fn:v=>v.fuel.charAt(0).toUpperCase()+v.fuel.slice(1)},
    { label:"Fuel Economy", fn:v=>v.mpg},
    { label:"Transmission", fn:v=><span style={{fontSize:11}}>{v.transmission}</span>},
    { label:"Drivetrain",   fn:v=>v.drivetrain},
    { label:"Cylinders",    fn:v=>v.cylinders===0?"Electric":v.cylinders},
    { label:"Body Type",    fn:v=>v.bodyType},
    { label:"Ext Color",    fn:v=>v.color},
    { label:"Doors",        fn:v=>v.doors},
    { label:"Title",        fn:v=>v.titleStatus.charAt(0).toUpperCase()+v.titleStatus.slice(1)},
    { label:"For Sale By",  fn:v=>v.saleBy.charAt(0).toUpperCase()+v.saleBy.slice(1)},
    { label:"Location",     fn:v=>v.location},
    { label:"Days Listed",  fn:v=>`${v.daysOnMarket}d`},
    { label:"Dealer",       fn:v=><span style={{fontSize:11}}>{v.dealer}</span>},
  ];
  return (
    <div style={{ padding:"20px 24px", overflowX:"auto" }}>
      <div style={{ fontSize:11, color:K.text2, fontFamily:"monospace", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:18 }}>Comparing {vehicles.length} vehicle{vehicles.length>1?"s":""}</div>
      <table style={{ width:"100%", borderCollapse:"collapse", minWidth:500 }}>
        <thead><tr>
          <th style={{ width:130, textAlign:"left", padding:"10px 12px", background:K.bg3, fontSize:10, color:K.text2, fontFamily:"monospace", letterSpacing:"0.06em" }}>SPEC</th>
          {vehicles.map(v => { const mc=MAKE_THEME[v.make]||["#0a0a1a","#1a1a30","#6666aa"]; return (
            <th key={v.id} style={{ padding:"12px 14px", background:`linear-gradient(135deg,${mc[0]},${mc[1]})`, textAlign:"center", borderLeft:`1px solid ${K.border}`, position:"relative", minWidth:160 }}>
              <div style={{ fontSize:17, fontWeight:800, fontFamily:"Barlow Condensed,sans-serif", color:"#fff" }}>{v.make}</div>
              <div style={{ fontSize:13, fontWeight:600, fontFamily:"Barlow Condensed,sans-serif", color:"rgba(255,255,255,0.65)" }}>{v.model}</div>
              <button onClick={()=>onRemove(v.id)} style={{ position:"absolute", top:6, right:6, width:18, height:18, borderRadius:3, border:"1px solid rgba(255,255,255,0.2)", background:"rgba(0,0,0,0.35)", color:"rgba(255,255,255,0.6)", cursor:"pointer", fontSize:11, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
            </th>
          );})}
        </tr></thead>
        <tbody>{rows.map((row,ri) => (
          <tr key={row.label} style={{ background:ri%2===0?K.bg2:K.bg3 }}>
            <td style={{ padding:"9px 12px", fontSize:11, color:K.text2, fontFamily:"monospace", borderRight:`1px solid ${K.border}`, whiteSpace:"nowrap" }}>{row.label}</td>
            {vehicles.map(v => <td key={v.id} style={{ padding:"9px 12px", textAlign:"center", fontSize:12, color:K.text, borderLeft:`1px solid ${K.border}` }}>{row.fn(v)}</td>)}
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}

/* ── VEHICLE MODAL ────────────────────────────────────── */
function VehicleModal({ v, onClose }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const score = calcScore(v);
  const { label, color } = dealTag(score);
  const mc = MAKE_THEME[v.make]||["#0a0a1a","#1a1a30","#6666aa"];
  const savings = v.marketAvg - v.price;

  async function runAI() {
    setLoading(true); setAnalysis(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", { method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, messages:[{ role:"user", content:
          `You are an expert car buying advisor. Analyze this listing:\n\nVehicle: ${v.year} ${v.make} ${v.model} ${v.trim}\nPrice: $${v.price.toLocaleString()} (Market avg: $${v.marketAvg.toLocaleString()})\nMileage: ${v.mileage.toLocaleString()} mi | Condition: ${v.condition}\nEngine: ${v.engine} (${v.hp}hp) | ${v.mpg}\nDays Listed: ${v.daysOnMarket} | Dropped: ${v.dropped?"Yes −$"+v.dropAmt.toLocaleString():"No"}\nDeal Score: ${score}/100\n\n3 focused paragraphs: (1) Value vs market, (2) Model strengths/weaknesses at this age/miles, (3) What to verify + Buy/Watch/Pass verdict. Be direct.`
        }]}) });
      const d = await res.json();
      setAnalysis(d.content?.map(b=>b.text||"").join("") || "No analysis returned.");
    } catch { setAnalysis("Error fetching analysis."); }
    setLoading(false);
  }

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20, backdropFilter:"blur(6px)" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:K.bg2, border:`1px solid ${K.border2}`, borderRadius:16, width:"100%", maxWidth:720, maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ background:`linear-gradient(140deg,${mc[0]},${mc[1]})`, padding:"22px 22px 18px", position:"relative" }}>
          <button onClick={onClose} style={{ position:"absolute", top:14, right:14, width:30, height:30, borderRadius:7, border:"1px solid rgba(255,255,255,0.2)", background:"rgba(0,0,0,0.35)", color:"rgba(255,255,255,0.7)", cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
            <div>
              <div style={{ fontSize:11, color:mc[2], fontFamily:"monospace", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:3 }}>{v.year} · {v.condition} · {v.color}</div>
              <div style={{ fontSize:30, fontWeight:900, fontFamily:"Barlow Condensed,sans-serif", color:"#fff", lineHeight:1 }}>{v.make}</div>
              <div style={{ fontSize:20, fontWeight:600, fontFamily:"Barlow Condensed,sans-serif", color:"rgba(255,255,255,0.65)", lineHeight:1.1 }}>{v.model} {v.trim}</div>
            </div>
            <div style={{ textAlign:"center" }}>
              <div style={{ width:60, height:60, borderRadius:"50%", background:`conic-gradient(${color} ${score*3.6}deg,rgba(0,0,0,0.4) 0deg)`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:4 }}>
                <div style={{ width:46, height:46, borderRadius:"50%", background:mc[0], display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, fontWeight:800, fontFamily:"monospace", color }}>{score}</div>
              </div>
              <div style={{ fontSize:10, color, fontFamily:"monospace", fontWeight:600 }}>{label}</div>
            </div>
          </div>
        </div>
        <div style={{ padding:22 }}>
          <div style={{ background:K.bg3, borderRadius:10, padding:"14px 18px", marginBottom:18, display:"flex", gap:20, flexWrap:"wrap" }}>
            {[["Asking Price",$(v.price),K.text,28],["Market Avg",$(v.marketAvg),K.text2,20],["Savings",`${savings>0?"−":"+"}${$(Math.abs(savings))}`,savings>0?K.green:K.red,20],["Below Market",savings>0?`${((savings/v.marketAvg)*100).toFixed(1)}%`:"0%",savings>0?K.green:K.red,20]].map(([k,val,c,sz])=>(
              <div key={k}><div style={{ fontSize:10, color:K.text2, fontFamily:"monospace", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:2 }}>{k}</div><div style={{ fontSize:sz, fontWeight:800, fontFamily:"Barlow Condensed,sans-serif", color:c }}>{val}</div></div>
            ))}
          </div>
          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:10, color:K.text2, fontFamily:"monospace", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10 }}>Specifications</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))", gap:8 }}>
              {[["Engine",v.engine],["Horsepower",`${v.hp} hp`],["Fuel",v.fuel],["Fuel Economy",v.mpg],["Transmission",v.transmission],["Drivetrain",v.drivetrain],["Cylinders",v.cylinders===0?"Electric":String(v.cylinders)],["Body Type",v.bodyType],["Doors",String(v.doors)],["Ext Color",v.color],["Mileage",mi(v.mileage)],["Title",v.titleStatus],["For Sale By",v.saleBy],["Days Listed",`${v.daysOnMarket}d`],["Dealer",v.dealer],["Location",v.location]].map(([k,val])=>(
                <div key={k} style={{ background:K.bg3, borderRadius:7, padding:"9px 11px" }}>
                  <div style={{ fontSize:9, color:K.text2, fontFamily:"monospace", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:2 }}>{k}</div>
                  <div style={{ fontSize:12, color:K.text, fontWeight:500 }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background:K.bg3, border:`1px solid ${K.border2}`, borderRadius:10, padding:18 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:analysis||loading?14:0 }}>
              <div><div style={{ fontSize:14, fontWeight:700, color:K.text, fontFamily:"Barlow Condensed,sans-serif" }}>🤖 AI Deal Analyzer</div><div style={{ fontSize:11, color:K.text2, marginTop:1 }}>Powered by Claude</div></div>
              <button onClick={runAI} disabled={loading} style={{ background:loading?K.bg4:`linear-gradient(135deg,${K.amber},#d97706)`, border:"none", borderRadius:8, padding:"9px 16px", cursor:loading?"wait":"pointer", color:loading?K.text2:"#000", fontWeight:700, fontSize:13, fontFamily:"Barlow Condensed,sans-serif", letterSpacing:"0.04em", whiteSpace:"nowrap" }}>
                {loading?"Analyzing…":analysis?"Re-Analyze":"Analyze This Deal"}
              </button>
            </div>
            {loading && <div style={{ color:K.text2, fontSize:12, fontFamily:"monospace", textAlign:"center", padding:"16px 0" }}>⟳ Analyzing vehicle data…</div>}
            {analysis && !loading && <div style={{ color:K.text, fontSize:13, lineHeight:1.75, whiteSpace:"pre-wrap", fontFamily:"Barlow,sans-serif", borderTop:`1px solid ${K.border}`, paddingTop:14 }}>{analysis}</div>}
            {!analysis && !loading && <div style={{ color:K.text3, fontSize:11, fontFamily:"monospace", textAlign:"center", padding:"10px 0" }}>Get an AI-powered assessment of this deal</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── API PANEL ────────────────────────────────────────── */
function APIPanel() {
  const apis = [
    { name:"Marketcheck",  endpoint:"/v2/search/car/active",  desc:"500k+ listings, VIN decode, price history", status:"Ready" },
    { name:"CarGurus",     endpoint:"/deals/v1/listings",     desc:"Deal ratings, price drop alerts, dealer info", status:"Ready" },
    { name:"Edmunds",      endpoint:"/api/vehicle/v3",        desc:"True Market Value (TMV), incentives, reviews", status:"Ready" },
    { name:"NHTSA",        endpoint:"/api/complaints",        desc:"Safety complaints, recall history, ratings", status:"Free" },
    { name:"Cars.com",     endpoint:"/v1/listings",           desc:"Consumer reviews, photo galleries, history", status:"Ready" },
    { name:"CarFax",       endpoint:"/v3/history-report",     desc:"Title history, accident reports, service records", status:"Paid" },
    { name:"AutoTempest",  endpoint:"/results (aggregator)",  desc:"Aggregates Craigslist, eBay, Autotrader & more", status:"Scrape" },
  ];
  return (
    <div style={{ padding:"20px 24px" }}>
      <div style={{ fontSize:11, color:K.text2, fontFamily:"monospace", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:6 }}>API Integrations</div>
      <div style={{ fontSize:12, color:K.text2, marginBottom:20, lineHeight:1.6 }}>Connect these real-data sources to replace mock listings. Each adds live inventory, pricing intelligence, and history reports.</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:12 }}>
        {apis.map(api=>(
          <div key={api.name} style={{ background:K.bg2, border:`1px solid ${K.border}`, borderRadius:10, padding:"14px 16px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
              <div style={{ fontSize:15, fontWeight:700, fontFamily:"Barlow Condensed,sans-serif", color:K.text }}>{api.name}</div>
              <span style={{ fontSize:9, background:api.status==="Free"?K.greenDim:K.amberDim, border:`1px solid ${api.status==="Free"?K.green+"40":K.amber+"40"}`, color:api.status==="Free"?K.green:K.amber, borderRadius:3, padding:"2px 6px", fontFamily:"monospace", fontWeight:600 }}>{api.status}</span>
            </div>
            <div style={{ fontSize:10, color:K.text3, fontFamily:"monospace", marginBottom:5 }}>{api.endpoint}</div>
            <div style={{ fontSize:11, color:K.text2, lineHeight:1.5 }}>{api.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── MAIN APP ─────────────────────────────────────────── */
export default function CarDealHunter() {
  const [tab, setTab]         = useState("browse");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [watchlist, setWatchlist] = useState([]);
  const [compareIds, setCompareIds] = useState([]);
  const [modal, setModal]     = useState(null);

  const scores = useMemo(()=>Object.fromEntries(VEHICLES.map(v=>[v.id,calcScore(v)])), []);

  const filtered = useMemo(() => {
    let vv = VEHICLES.filter(v => {
      if (filters.make && v.make !== filters.make) return false;
      if (filters.model && v.model !== filters.model) return false;
      if (filters.trimKw && !v.trim.toLowerCase().includes(filters.trimKw.toLowerCase())) return false;
      if (filters.minPrice && v.price < +filters.minPrice) return false;
      if (filters.maxPrice && v.price > +filters.maxPrice) return false;
      if (filters.minYear  && v.year < +filters.minYear)   return false;
      if (filters.maxYear  && v.year > +filters.maxYear)   return false;
      if (filters.minMileage && v.mileage < +filters.minMileage) return false;
      if (filters.maxMileage && v.mileage > +filters.maxMileage) return false;
      if (filters.conditions.length  && !filters.conditions.includes(v.condition))  return false;
      if (filters.fuelTypes.length   && !filters.fuelTypes.includes(v.fuel))        return false;
      if (filters.bodyTypes.length   && !filters.bodyTypes.includes(v.bodyType))    return false;
      if (filters.driveTypes.length  && !filters.driveTypes.includes(v.drivetrain)) return false;
      if (filters.extColors.length   && !filters.extColors.includes(v.extColor))    return false;
      if (filters.intColors.length   && !filters.intColors.includes(v.intColor))    return false;
      if (filters.cylinders.length) {
        const cylStr = v.cylinders === 0 ? "0 (Electric)" : String(v.cylinders);
        if (!filters.cylinders.includes(cylStr)) return false;
      }
      if (filters.doors.length && !filters.doors.includes(String(v.doors))) return false;
      if (filters.titleStatus && v.titleStatus !== filters.titleStatus) return false;
      if (filters.saleBy !== "any" && v.saleBy !== filters.saleBy) return false;
      if (filters.transmission === "man" && !v.transmission.toLowerCase().includes("manual") && !v.transmission.toLowerCase().includes("dsg") && !v.transmission.toLowerCase().includes("pdk") && !v.transmission.toLowerCase().includes("dct")) return false;
      if (filters.transmission === "auto" && (v.transmission.toLowerCase().includes("manual") && !v.transmission.toLowerCase().includes("dsg") && !v.transmission.toLowerCase().includes("pdk") && !v.transmission.toLowerCase().includes("dct"))) return false;
      if (filters.keywords) {
        const kw = filters.keywords.toLowerCase();
        const haystack = `${v.make} ${v.model} ${v.trim} ${v.engine} ${v.color} ${v.dealer}`.toLowerCase();
        if (!haystack.includes(kw)) return false;
      }
      if (filters.filterDays && v.daysOnMarket > +filters.filterDays) return false;
      if (scores[v.id] < filters.minScore) return false;
      return true;
    });
    vv.sort((a,b) => {
      switch(filters.sort) {
        case "score_desc":   return scores[b.id]-scores[a.id];
        case "price_asc":    return a.price-b.price;
        case "price_desc":   return b.price-a.price;
        case "savings_desc": return (b.marketAvg-b.price)-(a.marketAvg-a.price);
        case "mileage_asc":  return a.mileage-b.mileage;
        case "newest":       return a.daysOnMarket-b.daysOnMarket;
        default: return 0;
      }
    });
    return vv;
  }, [filters, scores]);

  const watchlisted = VEHICLES.filter(v=>watchlist.includes(v.id));
  const avgSavings  = filtered.length ? Math.round(filtered.reduce((s,v)=>s+(v.marketAvg-v.price),0)/filtered.length) : 0;
  const bestScore   = filtered.length ? Math.max(...filtered.map(v=>scores[v.id])) : 0;

  const toggleSave    = id => setWatchlist(w=>w.includes(id)?w.filter(x=>x!==id):[...w,id]);
  const toggleCompare = id => setCompareIds(c=>{ if(c.includes(id)) return c.filter(x=>x!==id); if(c.length>=3) return c; return [...c,id]; });

  function CardGrid({ vehicles }) {
    if (!vehicles.length) return <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:60, color:K.text2, gap:10 }}><div style={{ fontSize:40 }}>🔍</div><div style={{ fontFamily:"Barlow Condensed,sans-serif", fontSize:20, fontWeight:700 }}>No results</div><div style={{ fontSize:12 }}>Adjust your filters</div></div>;
    return <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(268px,1fr))", gap:14 }}>{vehicles.map(v=><VehicleCard key={v.id} v={v} score={scores[v.id]} saved={watchlist.includes(v.id)} comparing={compareIds.includes(v.id)} onSave={()=>toggleSave(v.id)} onCompare={()=>toggleCompare(v.id)} onClick={()=>setModal(v)} />)}</div>;
  }

  const TABS = [
    { id:"browse",   icon:"🔍", label:"Browse" },
    { id:"watchlist",icon:"★",  label:`Watchlist (${watchlist.length})` },
    { id:"compare",  icon:"⊕", label:`Compare (${compareIds.length})` },
    { id:"api",      icon:"🔌", label:"APIs" },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", background:K.bg, color:K.text, fontFamily:"Barlow,sans-serif", overflow:"hidden" }}>
      <style>{FONTS}{`*{box-sizing:border-box}input,select,button{font-family:Barlow,sans-serif}::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-track{background:${K.bg}}::-webkit-scrollbar-thumb{background:${K.border2};border-radius:3px}`}</style>

      {/* HEADER */}
      <div style={{ background:K.bg2, borderBottom:`1px solid ${K.border}`, padding:"0 20px", display:"flex", alignItems:"center", gap:28, height:52, flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
          <div style={{ width:28, height:28, background:`linear-gradient(135deg,${K.amber},#d97706)`, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>🎯</div>
          <div>
            <div style={{ fontFamily:"Barlow Condensed,sans-serif", fontWeight:900, fontSize:16, letterSpacing:"0.03em", lineHeight:1, color:K.text }}>CAR DEAL</div>
            <div style={{ fontFamily:"IBM Plex Mono,monospace", fontSize:8, color:K.amber, letterSpacing:"0.18em", fontWeight:600 }}>HUNTER</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:3, flex:1 }}>
          {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{ padding:"5px 14px", borderRadius:6, border:"none", cursor:"pointer", fontSize:12, transition:"all 0.15s", background:tab===t.id?K.amber:"transparent", color:tab===t.id?"#000":K.text2, fontWeight:tab===t.id?700:500, fontFamily:"Barlow Condensed,sans-serif", letterSpacing:"0.04em" }}>{t.icon} {t.label}</button>)}
        </div>
        <div style={{ display:"flex", gap:18, fontSize:11, fontFamily:"monospace", flexShrink:0 }}>
          <span><span style={{ color:K.text2 }}>Found </span><span style={{ color:K.amber, fontWeight:600 }}>{filtered.length}</span></span>
          <span><span style={{ color:K.text2 }}>Avg Save </span><span style={{ color:K.green, fontWeight:600 }}>−${avgSavings.toLocaleString()}</span></span>
          <span><span style={{ color:K.text2 }}>Top </span><span style={{ color:K.green, fontWeight:600 }}>{bestScore}/100</span></span>
        </div>
      </div>

      {/* BODY */}
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
        {tab === "browse" && <FilterSidebar filters={filters} onChange={setFilters} />}
        <div style={{ flex:1, overflowY:"auto", padding:tab==="compare"||tab==="api"?0:"18px 22px" }}>
          {tab === "browse"    && <CardGrid vehicles={filtered} />}
          {tab === "watchlist" && (watchlisted.length===0 ? <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", color:K.text2, gap:10 }}><div style={{ fontSize:40 }}>★</div><div style={{ fontFamily:"Barlow Condensed,sans-serif", fontSize:20, fontWeight:700 }}>Watchlist is empty</div><div style={{ fontSize:12 }}>Tap ★ on any listing to save it here</div></div> : <CardGrid vehicles={watchlisted} />)}
          {tab === "compare"   && <CompareView ids={compareIds} onRemove={id=>setCompareIds(c=>c.filter(x=>x!==id))} />}
          {tab === "api"       && <APIPanel />}
        </div>
      </div>

      {/* COMPARE BAR */}
      {compareIds.length > 0 && tab !== "compare" && (
        <div style={{ position:"fixed", bottom:18, left:"50%", transform:"translateX(-50%)", background:K.bg3, border:`1px solid rgba(245,158,11,0.35)`, borderRadius:12, padding:"10px 18px", display:"flex", alignItems:"center", gap:14, boxShadow:"0 8px 32px rgba(0,0,0,0.5)", zIndex:100 }}>
          <span style={{ fontSize:11, color:K.text2, fontFamily:"monospace" }}>{compareIds.length}/3</span>
          {compareIds.map(id=>{const v=VEHICLES.find(x=>x.id===id);return <span key={id} style={{ fontSize:13, fontWeight:700, fontFamily:"Barlow Condensed,sans-serif", color:K.text }}>{v.year} {v.make}</span>;})}
          <button onClick={()=>setTab("compare")} style={{ background:`linear-gradient(135deg,${K.amber},#d97706)`, border:"none", borderRadius:7, padding:"7px 14px", color:"#000", fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:"Barlow Condensed,sans-serif", letterSpacing:"0.04em" }}>Compare →</button>
          <button onClick={()=>setCompareIds([])} style={{ background:"transparent", border:`1px solid ${K.border2}`, borderRadius:6, padding:"6px 9px", color:K.text2, fontSize:11, cursor:"pointer" }}>✕</button>
        </div>
      )}

      {modal && <VehicleModal v={modal} onClose={()=>setModal(null)} />}
    </div>
  );
}
