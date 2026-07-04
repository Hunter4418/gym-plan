import { useState } from "react";

// ── Tokens ────────────────────────────────────────────────────
const C = {
  bg:         "#F7F5F2",
  white:      "#FFFFFF",
  black:      "#0F0F0F",
  blackSoft:  "#1A1A1A",
  beige:      "#EDE8DF",
  beigeDeep:  "#D9D0C0",
  red:        "#E8002D",
  redLight:   "#FFF0F3",
  blue:       "#003D99",
  blueLight:  "#EEF2FA",
  grey:       "#6B6B6B",
  greyLight:  "#A09A93",
  greyBorder: "#E0DAD2",
  greyLine:   "#EDEBE8",
};
const MONO = "'Courier New', Courier, monospace";
const SANS = "'Inter','Helvetica Neue',Arial,sans-serif";

// ── Data ──────────────────────────────────────────────────────
const PHASES = {
  Foundation: { intensity: 4, color: C.grey,    bg: "#F2F0ED", desc: "Form over weight. Learn every movement. Moderate load, full range of motion.", focus: "Technique · Consistency · Mind-muscle connection" },
  Build:      { intensity: 6, color: "#8B6914", bg: "#FBF6EC", desc: "Progressive overload. Add weight each session. Push near failure on the last set.", focus: "Load progression · Volume · Controlled failure" },
  Push:       { intensity: 9, color: C.red,     bg: C.redLight, desc: "Drop-sets and supersets. Max lean-phase stimulus. This is where the body changes.", focus: "Intensity techniques · Max effort · Metabolic stress" },
  Taper:      { intensity: 7, color: C.blue,    bg: C.blueLight, desc: "Maintain intensity, cut volume. Let the body consolidate and show the work.", focus: "Quality over quantity · Recovery · Lock in gains" },
};

const DAYS = [
  { dow: "Mon", label: "MONDAY",    type: "Chest", sub: "CHEST", rest: false },
  { dow: "Tue", label: "TUESDAY",   type: "Back",  sub: "BACK",  rest: false },
  { dow: "Wed", label: "WEDNESDAY", type: "Legs",  sub: "LEGS",  rest: false },
  { dow: "Thu", label: "THURSDAY",  type: "Arms",  sub: "ARMS",  rest: false },
  { dow: "Fri", label: "FRIDAY",    type: "Abs",   sub: "CORE",  rest: false },
  { dow: "Sat", label: "SATURDAY",  type: null,    sub: "REST",  rest: true  },
  { dow: "Sun", label: "SUNDAY",    type: null,    sub: "REST",  rest: true  },
];

const WORKOUTS = {
  Chest: {
    sections: [
      { title: "COMPOUND PRESS", exercises: [
        { name: "Barbell Bench Press",    sets: "4 × 8–10",  rest: "90s", detail: "Lie flat, grip just outside shoulder-width. Lower bar to mid-chest, elbows at ~75°. Drive through chest not arms. Back slightly arched, feet flat. No bouncing." },
        { name: "Incline Dumbbell Press", sets: "3 × 10–12", rest: "75s", detail: "Bench at 30–45°. Press dumbbells upward and slightly inward. Squeeze at the top. Targets upper chest — essential for a defined look from every angle." },
      ]},
      { title: "ISOLATION & DETAIL", exercises: [
        { name: "Cable Fly (Low-to-High)",  sets: "3 × 12–15", rest: "60s", detail: "Cables set low. Pull upward in a wide arc, hands meet at chest height. Slight elbow bend. Hard squeeze at the top — great for lean muscle separation." },
        { name: "Push-Ups (weighted)",      sets: "3 × 15–20", rest: "60s", detail: "Chest to floor, hands slightly wider than shoulders. Core braced, body straight. Add a plate on your back once bodyweight feels easy." },
        { name: "Dumbbell Lateral Raise",   sets: "3 × 15",    rest: "45s", detail: "Arms out to shoulder height, leading with elbows. Pause at top. Builds shoulder width — the V-taper that makes a lean physique actually look lean." },
      ]},
      { title: "TRICEPS", exercises: [
        { name: "Tricep Rope Pushdown", sets: "3 × 12–15", rest: "60s", detail: "Rope at face height, elbows pinned to sides. Push down and splay rope ends outward at the bottom. Full lockout each rep. Defines the outer tricep." },
      ]},
    ],
  },
  Back: {
    sections: [
      { title: "VERTICAL PULL", exercises: [
        { name: "Pull-Ups / Lat Pulldown",     sets: "4 × 6–8",   rest: "90s", detail: "Dead hang, grip just outside shoulders, pull chest to bar. Can't hit 6? Lat pulldown — pull to upper chest, lean back slightly, lead with elbows." },
        { name: "Straight-Arm Lat Pulldown",   sets: "3 × 12–15", rest: "60s", detail: "Stand at cable, bar or rope overhead. Arms nearly straight — pull down to thighs using only your lats. Squeeze hard at the bottom. Isolates the lat fully, builds the V-taper wing width." },
      ]},
      { title: "HORIZONTAL ROW", exercises: [
        { name: "Bent-Over Barbell Row",    sets: "4 × 8–10",  rest: "90s", detail: "Hip hinge to near parallel. Pull bar to lower ribs. Squeeze shoulder blades at the top. Lower back neutral — your main back thickness builder." },
        { name: "Seated Cable Row",         sets: "3 × 10–12", rest: "75s", detail: "Retract shoulder blades first, then bend elbows to pull handle to lower abs. Pause at contraction. Slow return. No torso rocking." },
        { name: "Single-Arm Dumbbell Row",  sets: "3 × 10 ea", rest: "60s", detail: "Brace hand and knee on bench. Let dumbbell hang straight down. Pull elbow up and back — elbow to ceiling. Fixes left-right strength imbalances." },
      ]},
      { title: "REAR DELT & HEALTH", exercises: [
        { name: "Face Pulls", sets: "3 × 15", rest: "60s", detail: "Cable at eye height with rope. Pull toward face, elbows flaring high. Rotate hands outward at the end. Protects shoulder health, builds rear-delt detail." },
      ]},
    ],
  },
  Legs: {
    sections: [
      { title: "QUAD DOMINANT", exercises: [
        { name: "Barbell Back Squat", sets: "4 × 8–10",  rest: "2m",  detail: "Bar on upper traps, feet shoulder-width, toes slightly out. Sit back and down — chest up, knees track over toes. Hit parallel or below. Drive through heels. You squat 110 — push that number progressively." },
        { name: "Leg Press",          sets: "3 × 12–15", rest: "90s", detail: "Feet shoulder-width on plate. Lower to 90°. Press through full foot, no complete lockout. Pause at the bottom — no bouncing. Good volume builder after squats." },
      ]},
      { title: "POSTERIOR CHAIN", exercises: [
        { name: "Romanian Deadlift",   sets: "3 × 10–12", rest: "90s", detail: "Hold bar at hips. Push hips back and lower along your legs until a deep hamstring stretch. Stop before lower back rounds. Drive hips forward to stand. Best hamstring and glute builder in the gym." },
        { name: "Leg Curl (Machine)",  sets: "3 × 12–15", rest: "60s", detail: "Lie face down. Curl heels toward glutes through full range. Pause at peak contraction. Lower slowly over 3 seconds. Isolates hamstrings — critical for balanced leg development and injury prevention." },
      ]},
      { title: "SINGLE-LEG & CALVES", exercises: [
        { name: "Walking Lunges (DBs)", sets: "3 × 12 ea", rest: "75s", detail: "Dumbbells at sides. Step forward, lower back knee toward floor, front shin vertical. Drive off front heel. Hits quad/glute tie-in that shapes the leg." },
        { name: "Standing Calf Raise",  sets: "4 × 15–20", rest: "45s", detail: "Full ROM — deep stretch at bottom, full rise on tiptoes. Hold top for 1 second. High reps and slow tempo. Use machine or barbell on a step." },
      ]},
    ],
  },
  Arms: {
    sections: [
      { title: "BICEPS", exercises: [
        { name: "Barbell Curl",           sets: "4 × 8–10",  rest: "75s", detail: "EZ-bar or straight bar. Elbows pinned to sides throughout. Squeeze at top, lower in 3 seconds. Zero swinging. Your main bicep mass builder." },
        { name: "Incline Dumbbell Curl",  sets: "3 × 10–12", rest: "60s", detail: "Bench at 45°, arms hanging straight down. Curl up, supinating as you go. Incline stretches the long head — gives that peak when flexed." },
      ]},
      { title: "TRICEPS", exercises: [
        { name: "Close-Grip Bench Press",              sets: "4 × 8–10",  rest: "75s", detail: "Shoulder-width grip, elbows tucked close. Lower to lower chest, press up. Loads all three tricep heads — main thickness builder for the arm." },
        { name: "Overhead Tricep Extension (EZ-bar)",  sets: "3 × 10–12", rest: "60s", detail: "Hold EZ-bar overhead, elbows forward. Lower behind head, extend. Overhead position stretches the long head — the part most people never train. Elbows stay stable." },
      ]},
      { title: "FOREARMS & DETAIL", exercises: [
        { name: "Hammer + Reverse Curl (superset)", sets: "3 × 10 ea", rest: "60s", detail: "Hammer curl (neutral grip) hits brachialis and forearms. Reverse curl (overhand) hits brachioradialis. Back to back, no rest between. Gives arms thickness and defined forearm shape." },
      ]},
    ],
  },
  Abs: {
    sections: [
      { title: "LOWER ABS", exercises: [
        { name: "Hanging Leg Raise", sets: "4 × 10–15", rest: "60s", detail: "Hang from pull-up bar. Raise legs to 90° or higher. Controlled — no swinging. Lower slowly. King of lower ab exercises. Hard squeeze at the top." },
        { name: "Ab Wheel Rollout",  sets: "3 × 10–12", rest: "60s", detail: "Start on knees, roll forward until hips nearly touch the floor, core braced throughout. Pull back with abs, not arms. One of the hardest ab movements — incredible full-core developer." },
      ]},
      { title: "WEIGHTED CORE", exercises: [
        { name: "Cable Crunch",    sets: "3 × 15–20", rest: "60s", detail: "Kneel at cable with rope overhead. Pull down by crunching your torso — not your arms. Round your spine into it. Abs need resistance to develop — this delivers it." },
        { name: "Weighted Plank", sets: "3 × 45–60s", rest: "45s", detail: "Forearms flat, body straight head to heels. No hip sag or spike. Add a plate on your back once 60s feels easy. Builds the TVA — the 'corset' muscle for a lean waist." },
      ]},
      { title: "OBLIQUES & ROTATION", exercises: [
        { name: "Bicycle Crunch", sets: "3 × 20 ea", rest: "45s", detail: "Hands behind head (don't pull neck). Opposite knee and elbow meet while other leg extends. Slow and deliberate. Defines the side abs and V-taper." },
      ]},
    ],
  },
};

// Build schedule
function buildSchedule() {
  const start = new Date("2026-07-01");
  const end   = new Date("2026-08-20");
  const slotMap = { Mon:"Chest", Tue:"Back", Wed:"Legs", Thu:"Arms", Fri:"Abs" };
  const days = [];
  let cur = new Date(start);
  while (cur <= end) {
    const dow = cur.toLocaleDateString("en-US",{weekday:"short"});
    if (slotMap[dow]) {
      const dn = Math.floor((cur-start)/86400000)+1;
      let phase="Foundation";
      if(dn>49) phase="Taper";
      else if(dn>35) phase="Push";
      else if(dn>14) phase="Build";
      days.push({
        date: cur.toISOString().split("T")[0],
        dow, phase,
        label: cur.toLocaleDateString("en-US",{month:"short",day:"numeric"}),
        type: slotMap[dow],
      });
    }
    cur=new Date(cur); cur.setDate(cur.getDate()+1);
  }
  return days;
}

const schedule = buildSchedule();
const today = new Date().toISOString().split("T")[0];
const todayDow = new Date().toLocaleDateString("en-US",{weekday:"short"});

// sessions for a given dow, grouped by week index
function getSessions(dow) {
  return schedule.filter(d=>d.dow===dow).map((d,i)=>({...d, weekNum:i+1}));
}

// ── Intensity bar ──────────────────────────────────────────────
function IntBar({ level, color }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:3}}>
      {Array.from({length:10}).map((_,i)=>(
        <div key={i} style={{width:13,height:3,borderRadius:2,background:i<level?color:C.greyBorder}} />
      ))}
      <span style={{fontFamily:MONO,fontSize:10,color,marginLeft:5,fontWeight:700}}>{level}/10</span>
    </div>
  );
}

// ── Exercise row ───────────────────────────────────────────────
function ExRow({ ex, phaseColor, phaseBg }) {
  const [open,setOpen]=useState(false);
  return (
    <div style={{
      borderBottom:`1px solid ${C.greyLine}`,
      background: open ? phaseBg : "transparent",
      transition:"background 0.15s",
    }}>
      <button onClick={()=>setOpen(o=>!o)} style={{
        width:"100%",background:"none",border:"none",cursor:"pointer",
        padding:"11px 0",display:"flex",alignItems:"center",
        justifyContent:"space-between",textAlign:"left",
      }}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <span style={{fontFamily:MONO,fontSize:10,fontWeight:700,color:phaseColor,minWidth:76,letterSpacing:"0.04em"}}>{ex.sets}</span>
          <span style={{fontSize:13,fontWeight:500,color:C.black}}>{ex.name}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <span style={{fontFamily:MONO,fontSize:9,color:C.greyLight,letterSpacing:"0.06em"}}>REST {ex.rest}</span>
          <div style={{
            width:18,height:18,borderRadius:"50%",
            border:`1.5px solid ${open?phaseColor:C.greyBorder}`,
            display:"flex",alignItems:"center",justifyContent:"center",
            transition:"all 0.18s",transform:open?"rotate(180deg)":"none",
            background:open?phaseColor+"18":"transparent",
          }}>
            <span style={{color:open?phaseColor:C.greyLight,fontSize:9,lineHeight:1}}>▾</span>
          </div>
        </div>
      </button>
      {open&&(
        <div style={{padding:"0 0 12px 90px",fontSize:13,color:C.grey,lineHeight:1.75,borderLeft:`2px solid ${phaseColor}`,marginLeft:0}}>
          {ex.detail}
        </div>
      )}
    </div>
  );
}

// ── Week pill selector + content ───────────────────────────────
function DayContent({ dow, type }) {
  if (!type || !WORKOUTS[type]) return null;
  const sessions = getSessions(dow);
  const phases = ["Foundation","Build","Push","Taper"];

  // Active phase tab = the phase of today's session for this dow, or first
  const todaySession = sessions.find(s=>s.date===today);
  const [activePhase, setActivePhase] = useState(
    todaySession ? todaySession.phase : "Foundation"
  );

  // Filter sessions by active phase
  const phaseSessions = sessions.filter(s=>s.phase===activePhase);
  const ph = PHASES[activePhase];
  const w = WORKOUTS[type];

  // Week filter within the active phase
  const [activeWeek, setActiveWeek] = useState(
    todaySession && todaySession.phase===activePhase
      ? todaySession.weekNum
      : phaseSessions[0]?.weekNum
  );

  // When phase changes, reset week to today's week in that phase or first
  const handlePhase = (p) => {
    setActivePhase(p);
    const ps = sessions.filter(s=>s.phase===p);
    const tw = todaySession && todaySession.phase===p ? todaySession.weekNum : ps[0]?.weekNum;
    setActiveWeek(tw);
  };

  const currentSession = sessions.find(s=>s.weekNum===activeWeek);
  const isToday = currentSession?.date===today;
  const isPast  = currentSession && currentSession.date<today;

  return (
    <div>
      {/* Phase tabs */}
      <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap"}}>
        {phases.map(p=>{
          const hasSessions = sessions.some(s=>s.phase===p);
          if(!hasSessions) return null;
          const active = activePhase===p;
          const col = PHASES[p].color;
          const hasToday = sessions.some(s=>s.phase===p&&s.date===today);
          return (
            <button key={p} onClick={()=>handlePhase(p)} style={{
              padding:"6px 14px",borderRadius:20,border:`1.5px solid ${active?col:C.greyBorder}`,
              background: active ? (p==="Push"?C.redLight:p==="Taper"?C.blueLight:p==="Build"?"#FBF6EC":"#F2F0ED") : C.white,
              color: active?col:C.grey,
              fontSize:12,fontWeight:active?700:500,cursor:"pointer",
              fontFamily:MONO,letterSpacing:"0.06em",
              transition:"all 0.15s",
              boxShadow: active?`0 2px 8px ${col}22`:"none",
            }}>
              {p.toUpperCase()}
              {hasToday&&<span style={{marginLeft:6,width:6,height:6,borderRadius:"50%",background:C.blue,display:"inline-block",verticalAlign:"middle",marginBottom:1}} />}
            </button>
          );
        })}
      </div>

      {/* Phase desc */}
      <div style={{
        background:ph.bg,border:`1px solid ${ph.color}22`,borderRadius:8,
        padding:"11px 16px",marginBottom:18,
        display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10,
      }}>
        <div>
          <div style={{fontSize:12,color:C.grey,lineHeight:1.6,marginBottom:4}}>{ph.desc}</div>
          <div style={{fontFamily:MONO,fontSize:10,color:ph.color,letterSpacing:"0.06em"}}>{ph.focus}</div>
        </div>
        <IntBar level={ph.intensity} color={ph.color} />
      </div>

      {/* Week selector */}
      <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
        <span style={{fontFamily:MONO,fontSize:9,color:C.greyLight,letterSpacing:"0.12em",marginRight:4}}>WEEK</span>
        {phaseSessions.map(s=>{
          const active = activeWeek===s.weekNum;
          const isT = s.date===today;
          const isP = s.date<today;
          return (
            <button key={s.weekNum} onClick={()=>setActiveWeek(s.weekNum)} style={{
              padding:"5px 12px",borderRadius:20,
              border:`1.5px solid ${isT?C.blue:active?C.beigeDeep:C.greyBorder}`,
              background: isT?(active?C.blueLight:C.blueLight) : active?C.beige:C.white,
              color: isT?C.blue:active?C.blackSoft:isP?C.greyLight:C.grey,
              fontSize:11,fontWeight:active||isT?700:400,cursor:"pointer",
              fontFamily:MONO,letterSpacing:"0.06em",
              opacity: isP&&!active ? 0.55 : 1,
              transition:"all 0.15s",
            }}>
              {`WK ${s.weekNum}`}
              {isT&&<span style={{marginLeft:5,fontFamily:MONO,fontSize:8,color:C.blue}}>●</span>}
            </button>
          );
        })}
      </div>

      {/* Session header */}
      {currentSession && (
        <div style={{
          display:"flex",gap:8,marginBottom:18,
        }}>
          <div style={{
            flex:1,background:C.white,borderRadius:8,padding:"10px 14px",
            border:`1px solid ${C.greyBorder}`,
          }}>
            <div style={{fontFamily:MONO,fontSize:9,color:C.greyLight,letterSpacing:"0.12em",marginBottom:3}}>MORNING</div>
            <div style={{fontSize:13,fontWeight:600,color:C.black}}>2-mile run</div>
            <div style={{fontSize:11,color:C.grey,marginTop:1}}>Target: 16–18 min</div>
          </div>
          <div style={{
            flex:1,background:isToday?C.blueLight:C.white,borderRadius:8,padding:"10px 14px",
            border:`1.5px solid ${isToday?C.blue:C.greyBorder}`,
          }}>
            <div style={{fontFamily:MONO,fontSize:9,color:isToday?C.blue:C.greyLight,letterSpacing:"0.12em",marginBottom:3}}>
              EVENING · {currentSession.label}
              {isToday&&<span style={{marginLeft:6,background:C.blue,color:"#fff",fontSize:8,fontWeight:800,padding:"1px 5px",borderRadius:8,letterSpacing:"0.08em"}}>TODAY</span>}
            </div>
            <div style={{fontSize:13,fontWeight:600,color:isToday?C.blue:C.black}}>{w.sections.map(s=>s.title.split(" ").slice(-1)[0]).join(" · ")}</div>
            <div style={{fontSize:11,color:C.grey,marginTop:1}}>{isPast&&!isToday?"Completed":isToday?"Go time":"Upcoming"}</div>
          </div>
        </div>
      )}

      {/* Exercise sections */}
      {w.sections.map((sec,si)=>(
        <div key={si} style={{marginBottom:18}}>
          <div style={{
            fontFamily:MONO,fontSize:10,fontWeight:700,color:ph.color,
            letterSpacing:"0.14em",marginBottom:10,paddingBottom:6,
            borderBottom:`1.5px solid ${ph.color}33`,
          }}>{sec.title}</div>
          {sec.exercises.map((ex,ei)=>(
            <ExRow key={ei} ex={ex} phaseColor={ph.color} phaseBg={ph.bg} />
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────
export default function GymPlan() {
  const todayDowLocal = new Date().toLocaleDateString("en-US",{weekday:"short"});
  const defaultDay = DAYS.find(d=>d.dow===todayDowLocal)?.dow ?? "Mon";
  const [activeDay, setActiveDay] = useState(defaultDay);

  const totalTraining = schedule.length;
  const done = schedule.filter(d=>d.date<today).length;
  const pct = Math.round((done/totalTraining)*100);

  const activeDayData = DAYS.find(d=>d.dow===activeDay);
  const todayStr = new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});

  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:SANS,paddingBottom:80}}>

      {/* ── Header ── */}
      <div style={{background:C.black,boxShadow:"0 2px 20px rgba(0,0,0,0.25)",position:"sticky",top:0,zIndex:20}}>
        <div style={{height:3,background:C.red}} />
        <div style={{maxWidth:700,margin:"0 auto",padding:"14px 20px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontFamily:MONO,fontSize:9,fontWeight:700,letterSpacing:"0.22em",color:C.red,marginBottom:4}}>
                SCUDERIA LEAN · JUL 1 → AUG 20, 2026
              </div>
              <div style={{fontFamily:SANS,fontSize:22,fontWeight:900,color:"#fff",letterSpacing:"-0.02em",lineHeight:1}}>
                RACE TO LEAN
              </div>
              <div style={{fontFamily:MONO,fontSize:9,color:"#444",marginTop:4,letterSpacing:"0.08em"}}>
                LEAN, ATHLETIC BUILD — TAP A DAY, THEN A PHASE
              </div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:MONO,fontSize:9,color:"#555",letterSpacing:"0.1em",marginBottom:2}}>CHECK-IN</div>
              <div style={{fontFamily:MONO,fontSize:16,fontWeight:900,color:C.red,lineHeight:1}}>Aug 20</div>
              <div style={{fontFamily:MONO,fontSize:9,color:"#555",marginTop:4,letterSpacing:"0.06em"}}>{done}/{totalTraining} DONE</div>
            </div>
          </div>
          {/* progress */}
          <div style={{background:"#2A2A2A",height:2,borderRadius:1,marginTop:10,overflow:"hidden"}}>
            <div style={{width:`${Math.max(pct,0)}%`,height:"100%",background:C.red,transition:"width 0.5s"}} />
          </div>
        </div>
      </div>

      {/* ── Day tabs ── */}
      <div style={{background:C.white,borderBottom:`1px solid ${C.greyBorder}`,boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
        <div style={{maxWidth:700,margin:"0 auto",padding:"0 16px",display:"flex",gap:0}}>
          {DAYS.map(d=>{
            const active = activeDay===d.dow;
            const isT = d.dow===todayDowLocal;
            const isRest = d.rest;
            const accentColor = isRest ? C.greyLight : C.red;
            return (
              <button key={d.dow} onClick={()=>setActiveDay(d.dow)} style={{
                flex:1,background:"none",border:"none",cursor:"pointer",
                padding:"12px 4px 10px",textAlign:"center",
                borderBottom:`3px solid ${active?(isRest?C.greyLight:C.red):"transparent"}`,
                transition:"all 0.15s",
                opacity: isRest && !active && !isT ? 0.5 : 1,
              }}>
                <div style={{
                  fontFamily:MONO,fontSize:11,fontWeight:active?900:600,
                  color:active?accentColor:isT?C.blue:C.blackSoft,
                  letterSpacing:"0.04em",lineHeight:1,
                }}>{d.dow.toUpperCase()}</div>
                <div style={{
                  fontFamily:MONO,fontSize:8,
                  color:active?accentColor:isT?C.blue:C.greyLight,
                  marginTop:3,letterSpacing:"0.08em",
                }}>{d.sub}</div>
                {isT&&(
                  <div style={{width:4,height:4,borderRadius:"50%",background:C.blue,margin:"4px auto 0"}} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{maxWidth:700,margin:"0 auto",padding:"24px 16px 0"}}>

        {/* Date + title */}
        <div style={{marginBottom:20}}>
          <div style={{fontFamily:MONO,fontSize:10,color:C.greyLight,letterSpacing:"0.14em",marginBottom:4}}>
            {todayDowLocal===activeDay ? todayStr.toUpperCase() : activeDayData?.label}
          </div>
          <div style={{fontSize:24,fontWeight:900,color:C.black,letterSpacing:"-0.02em",lineHeight:1}}>
            {activeDayData?.label} —{" "}
            <span style={{color:C.red}}>{activeDayData?.sub}</span>
          </div>
          <div style={{fontFamily:MONO,fontSize:10,color:C.greyLight,marginTop:5,letterSpacing:"0.08em"}}>
            SAT + SUN — REST (light walk / stretch only)
          </div>
        </div>

        {activeDayData && !activeDayData.rest && (
          <DayContent key={activeDay} dow={activeDay} type={activeDayData.type} />
        )}
        {activeDayData && activeDayData.rest && (
          <RestDayPanel day={activeDayData} />
        )}

        <QuoteBar />
      </div>
    </div>
  );
}


// ── Rest Day Panel ────────────────────────────────────────────
function RestDayPanel({ day }) {
  const activities = [
    { icon: "🚶", title: "Light Walk", desc: "20–30 min easy walk. Keeps blood flowing, aids recovery." },
    { icon: "🧘", title: "Stretch / Mobility", desc: "Hip flexors, hamstrings, chest, thoracic. Hold each 30–60s." },
    { icon: "😴", title: "Sleep 8+ hrs", desc: "Growth hormone peaks during deep sleep. This is when you actually build muscle." },
    { icon: "🥗", title: "Eat & Hydrate", desc: "Hit your protein target (~150g). Drink 3L+ water. Refuel for Monday." },
    { icon: "🛁", title: "Recovery", desc: "Cold shower or contrast shower. Reduces soreness, boosts circulation." },
  ];
  return (
    <div>
      <div style={{
        background: C.beige, borderRadius: 10, padding: "24px 22px",
        border: `1px solid ${C.greyBorder}`, marginBottom: 16,
        textAlign: "center",
      }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>🏁</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: C.black, marginBottom: 6 }}>
          {day.label} — Rest & Recover
        </div>
        <div style={{ fontFamily: MONO, fontSize: 11, color: C.greyLight, letterSpacing: "0.1em" }}>
          NO GYM · NO RUN · FULL RECOVERY
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {activities.map((a, i) => (
          <div key={i} style={{
            background: C.white, borderRadius: 8, padding: "14px 16px",
            border: `1px solid ${C.greyBorder}`,
            display: "flex", alignItems: "flex-start", gap: 14,
          }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>{a.icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.black, marginBottom: 3 }}>{a.title}</div>
              <div style={{ fontSize: 12, color: C.grey, lineHeight: 1.6 }}>{a.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Quotes ────────────────────────────────────────────────────
const QUOTES = [
  // F1 Drivers
  { text: "If you no longer go for a gap that exists, you are no longer a racing driver.", author: "Ayrton Senna", tag: "F1" },
  { text: "I have no idols. I admire work, dedication and competence.", author: "Ayrton Senna", tag: "F1" },
  { text: "Being second is to be the first of the ones who lose.", author: "Ayrton Senna", tag: "F1" },
  { text: "You commit yourself to such a level where there is no compromise.", author: "Ayrton Senna", tag: "F1" },
  { text: "I've always believed that you should never, ever give up and you should always keep fighting even when there's only the slightest chance.", author: "Michael Schumacher", tag: "F1" },
  { text: "First, you have to finish.", author: "Michael Schumacher", tag: "F1" },
  { text: "Keep fighting through every difficulty.", author: "Michael Schumacher", tag: "F1" },
  { text: "In racing there are always things you can learn, every single day. There is always space for improvement.", author: "Lewis Hamilton", tag: "F1" },
  { text: "Still I rise.", author: "Lewis Hamilton", tag: "F1" },
  { text: "I am not afraid of challenges. I embrace them.", author: "Lewis Hamilton", tag: "F1" },
  { text: "Just leave me alone, I know what to do.", author: "Kimi Räikkönen", tag: "F1" },
  { text: "A lot of people criticize Formula 1 as an unnecessary risk. But what would life be like if we only did what is necessary?", author: "Niki Lauda", tag: "F1" },
  { text: "There are more important things in life than the world championship, like staying alive.", author: "Niki Lauda", tag: "F1" },
  { text: "I am an artist. The track is my canvas and my car is my brush.", author: "Graham Hill", tag: "F1" },
  { text: "You don't expect to be at the top of the mountain the day you start climbing.", author: "Ron Dennis", tag: "F1" },
  { text: "When you give up your hunger for success you are not racing full heartedly anymore.", author: "Felipe Massa", tag: "F1" },
  { text: "Race cars are neither ugly nor beautiful. They become beautiful when they win.", author: "Enzo Ferrari", tag: "F1" },
  { text: "You want to be the best, you have to do what the best do.", author: "Sebastian Vettel", tag: "F1" },
  { text: "Multi-21 Seb, multi-21.", author: "Sebastian Vettel", tag: "F1" },
  { text: "Pressure is a privilege.", author: "Charles Leclerc", tag: "F1" },
  { text: "I work hard, I never give up, and I believe in myself. That is my mindset.", author: "Max Verstappen", tag: "F1" },
  { text: "Every day I try to improve myself and give 110 percent.", author: "Max Verstappen", tag: "F1" },
  { text: "I believe you have to be willing to be miserable to be great.", author: "Fernando Alonso", tag: "F1" },
  { text: "Sometimes you don't know what you've got until you've done it.", author: "Jenson Button", tag: "F1" },
  { text: "The first thing that happens when you hit the throttle is nothing. The second thing that happens is everything.", author: "James Hunt", tag: "F1" },
  { text: "To achieve anything in this game you must be prepared to dabble in the boundary of disaster.", author: "Stirling Moss", tag: "F1" },
  { text: "In order to finish first, you must first finish.", author: "Juan Manuel Fangio", tag: "F1" },
  { text: "Winning is not everything, but making the effort to win is.", author: "Vince Lombardi (F1 motto)", tag: "F1" },
  { text: "IF is F1 spelled backwards.", author: "Murray Walker", tag: "F1" },
  // Indian Cricket
  { text: "Enjoy the game and chase your dreams.", author: "Sachin Tendulkar", tag: "🏏" },
  { text: "When people throw stones at you, you turn them into milestones.", author: "Sachin Tendulkar", tag: "🏏" },
  { text: "I hate losing and once I enter the ground it's a different zone altogether — that hunger for winning is always there.", author: "Sachin Tendulkar", tag: "🏏" },
  { text: "Hard work, commitment, and perseverance — that is the only formula I know.", author: "Sachin Tendulkar", tag: "🏏" },
  { text: "I have never tried to compare myself to anyone else.", author: "Sachin Tendulkar", tag: "🏏" },
  { text: "Self-belief and hard work will always earn you success.", author: "Virat Kohli", tag: "🏏" },
  { text: "Whatever you want to do, do with full passion and work really hard towards it.", author: "Virat Kohli", tag: "🏏" },
  { text: "No cricket team in the world depends on one or two players. The team always plays to win.", author: "Virat Kohli", tag: "🏏" },
  { text: "The people you choose to have around you make all the difference.", author: "Virat Kohli", tag: "🏏" },
  { text: "You don't play for the crowd; you play for the country.", author: "MS Dhoni", tag: "🏏" },
  { text: "If you don't really have a dream, you can't really push yourself.", author: "MS Dhoni", tag: "🏏" },
  { text: "I don't regret anything in my life. What does not kill you makes you stronger.", author: "MS Dhoni", tag: "🏏" },
  { text: "Take care of the process, and the results will take care of themselves.", author: "MS Dhoni", tag: "🏏" },
  { text: "Stay grounded, even when you're flying high.", author: "MS Dhoni", tag: "🏏" },
  { text: "Success is not in lifting the cup; it's in lifting your team.", author: "MS Dhoni", tag: "🏏" },
  { text: "Respect the game and it will respect you back.", author: "Rahul Dravid", tag: "🏏" },
  { text: "We judge talent wrong. Determination, courage, discipline, temperament — these are also talent.", author: "Rahul Dravid", tag: "🏏" },
  { text: "No dream is ever chased alone.", author: "Rahul Dravid", tag: "🏏" },
  { text: "If you play good cricket, a lot of bad things get hidden.", author: "Kapil Dev", tag: "🏏" },
  { text: "I always believed India could win the World Cup. You have to believe before you can achieve.", author: "Kapil Dev", tag: "🏏" },
  { text: "Cricket is such a sport that you get to learn something from someone every day.", author: "Ravindra Jadeja", tag: "🏏" },
  { text: "Life changes a lot if you have the right mind and keep working hard.", author: "Hardik Pandya", tag: "🏏" },
  { text: "Virender Sehwag: Every day I go out there I try to dominate.", author: "Virender Sehwag", tag: "🏏" },
  { text: "Play every game as if it is your last.", author: "Sunil Gavaskar", tag: "🏏" },
  { text: "Talent is God-given, be humble. Fame is man-given, be grateful. Conceit is self-given, be careful.", author: "Sourav Ganguly", tag: "🏏" },
];

function QuoteBar() {
  // Rotate by day-of-year so it changes daily but is stable per day
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const [idx, setIdx] = useState(dayOfYear % QUOTES.length);
  const q = QUOTES[idx];
  const isF1 = q.tag === "F1";

  return (
    <div style={{
      marginTop: 32,
      background: C.black,
      borderRadius: 10,
      padding: "28px 28px 24px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Red top stripe */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: C.red }} />

      {/* Tag */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontFamily: MONO, fontSize: 9, color: "#333", letterSpacing: "0.18em" }}>
          DAILY IGNITION · {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase()}
        </div>
        <span style={{
          fontFamily: MONO, fontSize: 10, fontWeight: 700,
          color: isF1 ? C.red : "#4CAF50",
          background: isF1 ? C.red + "18" : "#4CAF5018",
          padding: "3px 10px", borderRadius: 10, letterSpacing: "0.1em",
        }}>{isF1 ? "F1" : "CRICKET"}</span>
      </div>

      {/* Quote */}
      <div style={{
        fontSize: 18, fontWeight: 700, color: C.white,
        lineHeight: 1.5, letterSpacing: "-0.01em",
        marginBottom: 14,
        fontStyle: "italic",
      }}>
        "{q.text}"
      </div>
      <div style={{ fontFamily: MONO, fontSize: 11, color: C.red, letterSpacing: "0.08em", marginBottom: 20 }}>
        — {q.author}
      </div>

      {/* Nav arrows */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button onClick={() => setIdx(i => (i - 1 + QUOTES.length) % QUOTES.length)} style={{
          background: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: 6,
          color: "#555", padding: "6px 14px", cursor: "pointer", fontSize: 14,
          transition: "all 0.15s",
        }}>←</button>
        <button onClick={() => setIdx(i => (i + 1) % QUOTES.length)} style={{
          background: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: 6,
          color: "#555", padding: "6px 14px", cursor: "pointer", fontSize: 14,
          transition: "all 0.15s",
        }}>→</button>
        <span style={{ fontFamily: MONO, fontSize: 9, color: "#333", marginLeft: 4 }}>
          {idx + 1} / {QUOTES.length}
        </span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          {QUOTES.map((_, i) => (
            <div key={i} onClick={() => setIdx(i)} style={{
              width: i === idx ? 16 : 4, height: 4, borderRadius: 2,
              background: i === idx ? C.red : "#2A2A2A",
              cursor: "pointer", transition: "all 0.2s",
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}
