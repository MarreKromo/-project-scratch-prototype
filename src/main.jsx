import React,{useMemo,useState} from "react";
import {createRoot} from "react-dom/client";
import {Home,PlusCircle,Sparkles,TrendingUp,ChevronRight,Check,WifiOff,RotateCcw,Info} from "lucide-react";
import "./styles.css";

const journeys=["Break 100","Sub-90","Sub-80","Project Single","Project Scratch"];
const teeOptions=["Fairway","Left","Right","Long","Short","Penalty"];

function App(){
 const [screen,setScreen]=useState("welcome");
 const [journey,setJourney]=useState("Project Single");
 const [hole,setHole]=useState(1);
 const [round,setRound]=useState(()=>Array.from({length:18},(_,i)=>({hole:i+1,par:[4,4,3,5,4,4,3,5,4,4,4,3,5,4,4,3,5,4][i],score:null,putts:null,gir:null,tee:null,penalty:null})));
 const [offline,setOffline]=useState(false);
 const goto=s=>{setScreen(s);scrollTo(0,0)};
 const cur=round[hole-1];
 const update=(k,v)=>setRound(r=>r.map((x,i)=>i===hole-1?{...x,[k]:v}:x));
 const complete=x=>x.score!==null&&x.putts!==null&&x.gir!==null&&(x.par===3||x.tee!==null)&&x.penalty!==null;
 const completed=round.filter(complete).length;

 const demoFill=()=>setRound(r=>r.map((x,i)=>({...x,
  score:[5,4,3,6,4,5,3,5,4,5,4,3,6,4,4,4,5,4][i],
  putts:[2,2,1,2,2,2,2,2,2,2,2,1,2,2,1,2,2,2][i],
  gir:i%3===0,
  tee:x.par===3?null:(i===4||i===12?"Right":i===7?"Penalty":"Fairway"),
  penalty:i===7?1:(i===12?1:0)
 })));

 const score=round.reduce((a,x)=>a+(x.score||0),0);
 const putts=round.reduce((a,x)=>a+(x.putts||0),0);
 const penalties=round.reduce((a,x)=>a+(x.penalty||0),0);

 const next=()=>{
  if(hole<18){setHole(h=>h+1)}
  else goto("review")
 };

 const nav=(id,Icon,label)=>
  <button className={screen===id?"navOn":""} onClick={()=>goto(id)}>
   <Icon size={21}/>
   <span>{label}</span>
  </button>;

 return <div className="shell">
  <header>
   <b>PROJECT SCRATCH</b>
   <span className="status">
    {offline?<><WifiOff size={13}/> OFFLINE</>:"PROTOTYPE v0.2"}
   </span>
  </header>

  <main>

   {screen==="welcome"&&
    <Page>
     <Eyebrow>Better every round</Eyebrow>
     <h1>Know what matters after every round.</h1>
     <p>Turn your scorecard into one clear development priority, one action and one target for your next round.</p>
     <Card>
      <Feature t="Understand" d="See what shaped your score."/>
      <Feature t="Focus" d="One priority — not twenty charts."/>
      <Feature t="Improve" d="Carry a measurable target into the next round."/>
     </Card>
     <Primary onClick={()=>goto("journey")}>Start</Primary>
    </Page>
   }

   {screen==="journey"&&
    <Page>
     <Eyebrow>Your journey</Eyebrow>
     <h1>What are you chasing?</h1>
     <p>Choose your next meaningful scoring level.</p>

     {journeys.map(x=>
      <Choice key={x} on={journey===x} click={()=>setJourney(x)}>
       {x}
      </Choice>
     )}

     <Primary onClick={()=>goto("home")}>Continue</Primary>
    </Page>
   }

   {screen==="home"&&
    <Page>
     <Card hero>
      <Eyebrow>{journey}</Eyebrow>
      <h2>16.2 → 9.9</h2>
      <Bar n={42}/>
      <small>Your journey is built round by round.</small>
     </Card>

     <Card focus>
      <Eyebrow>One Focus</Eyebrow>
      <h2>Keep the tee ball in play</h2>
      <p>Right-side misses and penalties are the clearest measured weakness.</p>
      <TextButton onClick={()=>goto("evidence")}>Why this focus?</TextButton>
     </Card>

     <Card>
      <b>Next-round target</b>
      <div className="big">≤ 1</div>
      <small>tee penalty</small>
     </Card>

     <Primary onClick={()=>goto("course")}>Log a round</Primary>
    </Page>
   }

   {screen==="course"&&
    <Page>
     <Eyebrow>Round</Eyebrow>
     <h1>Where did you play?</h1>

     <Card>
      <b>Recent</b>
      <Choice on click={()=>goto("setup")}>
       Hulta Golfklubb<br/>
       <small>Yellow • 18 holes</small>
      </Choice>
     </Card>

     <Card>
      <b>Course missing?</b>
      <p>Create a personal course without an external provider.</p>
      <Secondary onClick={()=>goto("create")}>Create course</Secondary>
     </Card>
    </Page>
   }

   {screen==="create"&&
    <Page>
     <Eyebrow>Personal course</Eyebrow>
     <h1>Create course</h1>

     <Label>Course name</Label>
     <input defaultValue="My course"/>

     <Label>Tee</Label>
     <input defaultValue="Yellow"/>

     <Label>Par sequence</Label>
     <input defaultValue="4,4,3,5,4,4,3,5,4..."/>

     <p><small>Rating, Slope and distances are optional.</small></p>

     <Primary onClick={()=>goto("setup")}>Save personal course</Primary>
    </Page>
   }

   {screen==="setup"&&
    <Page>
     <Eyebrow>Round setup</Eyebrow>
     <h1>Hulta Golfklubb</h1>

     <Card>
      <Label>Tee</Label>
      <Choice on>Yellow</Choice>

      <Label>Round</Label>
      <div className="grid2">
       <Choice on>18 holes</Choice>
       <Choice>9 holes</Choice>
      </div>

      <Label>Mode</Label>
      <div className="grid2">
       <Choice on>Standard</Choice>
       <Choice>Practice</Choice>
      </div>
     </Card>

     <Primary onClick={()=>{setHole(1);goto("hole")}}>Start round</Primary>
    </Page>
   }

   {screen==="hole"&&
    <Page>
     <div className="between">
      <div>
       <Eyebrow>Hole {hole} • Par {cur.par}</Eyebrow>
       <h1>Enter the truth.</h1>
      </div>
      <button className="bare" onClick={()=>goto("home")}>Save & exit</button>
     </div>

     <div className="holes">
      {round.map(x=>
       <button
        key={x.hole}
        className={`${x.hole===hole?"current":""} ${complete(x)?"done":""}`}
        onClick={()=>setHole(x.hole)}
       >
        {x.hole}
       </button>
      )}
     </div>

     <Label>Gross score</Label>
     <Stepper v={cur.score??cur.par} set={v=>update("score",v)}/>

     <Label>Putts</Label>
     <Stepper v={cur.putts??2} set={v=>update("putts",v)}/>

     <Label>GIR</Label>
     <div className="grid2">
      <Choice on={cur.gir===true} click={()=>update("gir",true)}>Yes</Choice>
      <Choice on={cur.gir===false} click={()=>update("gir",false)}>No</Choice>
     </div>

     {cur.par!==3&&<>
      <Label>Tee result</Label>
      <div className="chips">
       {teeOptions.map(x=>
        <Choice key={x} on={cur.tee===x} click={()=>update("tee",x)}>
         {x}
        </Choice>
       )}
      </div>
     </>}

     <Label>Penalty strokes</Label>
     <div className="grid3">
      {[0,1,2].map(x=>
       <Choice key={x} on={cur.penalty===x} click={()=>update("penalty",x)}>
        {x}
       </Choice>
      )}
     </div>

     <div className="actions">
      <Secondary onClick={demoFill}>Fill demo round</Secondary>
      <Primary onClick={next}>{hole===18?"Review round":"Next hole"}</Primary>
     </div>
    </Page>
   }

   {screen==="review"&&
    <Page>
     <Eyebrow>Round review</Eyebrow>
     <h1>{completed===18?"Ready to save.":"Round needs attention."}</h1>

     <Card>
      <Stat a="Completed" b={`${completed}/18`}/>
      <Stat a="Score" b={completed===18?score:"—"}/>
      <Stat a="Putts" b={completed===18?putts:"—"}/>
      <Stat a="Penalties" b={completed===18?penalties:"—"}/>
     </Card>

     {completed<18?
      <>
       <Notice>Complete all required fields before eligible analysis.</Notice>
       <Secondary onClick={()=>{
        const i=round.findIndex(x=>!complete(x));
        setHole(i+1);
        goto("hole");
       }}>
        Fix missing holes
       </Secondary>
      </>
      :
      <Primary onClick={()=>goto("saved")}>Save round</Primary>
     }
    </Page>
   }

   {screen==="saved"&&
    <Page>
     <Notice ok><Check size={18}/> Round saved safely</Notice>
     <Eyebrow>AI Coach</Eyebrow>
     <h1>{offline?"Analysis queued.":"Your recap is ready."}</h1>
     <p>Your golf data is saved independently of AI and network status.</p>

     {offline?
      <Primary onClick={()=>goto("home")}>Back Home</Primary>
      :
      <Primary onClick={()=>goto("recap")}>View recap</Primary>
     }

     <Secondary onClick={()=>setOffline(x=>!x)}>
      {offline?"Restore connection":"Simulate offline"}
     </Secondary>
    </Page>
   }

   {screen==="recap"&&
    <Page>
     <Eyebrow>Round recap • 84</Eyebrow>
     <h1>The big number came from tee-ball damage.</h1>

     <Card>
      <b>What shaped the score</b>
      <p><strong>2 penalty strokes</strong> and repeated right-side misses created the clearest measured cost.</p>
      <p><strong>Putting held up:</strong> no three-putt spike.</p>
      <TextButton onClick={()=>goto("evidence")}>See the evidence</TextButton>
     </Card>

     <Card focus>
      <Eyebrow>One Focus</Eyebrow>
      <h2>Tee-ball survival</h2>
      <p>Keep the ball playable before chasing more distance.</p>
      <Primary onClick={()=>goto("focus")}>Open One Focus</Primary>
     </Card>
    </Page>
   }

   {screen==="evidence"&&
    <Page>
     <Eyebrow>Why this focus?</Eyebrow>
     <h1>Evidence, not a story.</h1>

     <Card>
      <Stat a="Penalty strokes" b="2"/>
      <Stat a="Right misses" b="4"/>
     </Card>

     <Card>
      <b>Your recent pattern</b>
      <p>Right-side tee misses repeat across the current personal-history window.</p>
      <small>Sample and confidence are shown in production.</small>
     </Card>

     <Primary onClick={()=>goto("focus")}>Continue</Primary>
    </Page>
   }

   {screen==="focus"&&
    <Page>
     <Eyebrow>One Focus</Eyebrow>
     <h1>Tee-ball survival</h1>
     <p>Reduce severe misses before adding speed or distance.</p>

     <Card>
      <b>Practice</b>
      <p>Start-line gate • 2 × 15 balls this week.</p>
      <hr/>
      <b>Success criterion</b>
      <p>≥ 12/15 playable starts in two sessions.</p>
     </Card>

     <Card>
      <b>Next-round target</b>
      <p>≤ 1 tee penalty.</p>
     </Card>

     <Primary onClick={()=>goto("home")}>Use this focus</Primary>
     <Secondary onClick={()=>goto("feedback")}>This doesn't feel right</Secondary>
    </Page>
   }

   {screen==="feedback"&&
    <Page>
     <Eyebrow>Coach feedback</Eyebrow>
     <h1>What feels wrong?</h1>

     {["Wrong data","Wrong interpretation","Not actionable","Other"].map(x=>
      <Choice key={x}>{x}</Choice>
     )}

     <p><small>The original recommendation remains in history.</small></p>
     <Primary onClick={()=>goto("recap")}>Submit</Primary>
    </Page>
   }

   {screen==="coach"&&
    <Page>
     <Eyebrow>AI Coach</Eyebrow>
     <h1>One useful decision.</h1>

     <Card focus>
      <h2>Tee-ball survival</h2>
      <p>Current focus</p>
      <Primary onClick={()=>goto("focus")}>Open focus</Primary>
     </Card>

     <Card>
      <b>Latest round</b>
      <p>84 • Hulta Golfklubb</p>
      <TextButton onClick={()=>goto("recap")}>Open recap</TextButton>
     </Card>
    </Page>
   }

   {screen==="progress"&&
    <Page>
     <Eyebrow>Progress</Eyebrow>
     <h1>Build proof over time.</h1>

     <Card>
      <b>Active focus</b>
      <p>Tee-ball survival • CONTINUE</p>
      <Bar n={58}/>
     </Card>

     <Card>
      <b>Own history</b>
      <p>5 / 10 / 20-round windows appear when enough eligible evidence exists.</p>
     </Card>

     <Notice>One good round is not automatically a sustained level change.</Notice>
    </Page>
   }

  </main>

  {screen!=="welcome"&&screen!=="journey"&&
   <nav>
    {nav("home",Home,"Home")}
    {nav("course",PlusCircle,"Round")}
    {nav("coach",Sparkles,"Coach")}
    {nav("progress",TrendingUp,"Progress")}
   </nav>
  }
 </div>
}

const Page=({children})=><section className="page">{children}</section>;
const Eyebrow=({children})=><div className="eyebrow">{children}</div>;
const Card=({children,hero,focus})=><div className={`card ${hero?"hero":""} ${focus?"focus":""}`}>{children}</div>;
const Primary=({children,onClick})=><button className="primary" onClick={onClick}>{children}<ChevronRight size={17}/></button>;
const Secondary=({children,onClick})=><button className="secondary" onClick={onClick}>{children}</button>;
const TextButton=({children,onClick})=><button className="textBtn" onClick={onClick}>{children}</button>;
const Choice=({children,on=false,click})=><button className={`choice ${on?"selected":""}`} onClick={click}>{children}</button>;
const Label=({children})=><div className="label">{children}</div>;

const Feature=({t,d})=>
 <div className="feature">
  <Check size={17}/>
  <div>
   <b>{t}</b>
   <small>{d}</small>
  </div>
 </div>;

const Bar=({n})=><div className="bar"><i style={{width:n+"%"}}/></div>;
const Stat=({a,b})=><div className="stat"><span>{a}</span><b>{b}</b></div>;
const Notice=({children,ok})=><div className={`notice ${ok?"ok":""}`}>{children}</div>;

function Stepper({v,set}){
 return <div className="step">
  <button onClick={()=>set(Math.max(0,v-1))}>−</button>
  <b>{v}</b>
  <button onClick={()=>set(v+1)}>+</button>
 </div>
}

createRoot(document.getElementById("root")).render(<App/>);
