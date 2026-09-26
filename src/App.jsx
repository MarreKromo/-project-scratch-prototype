import React,{useMemo,useState,useEffect} from 'react';
import {WifiOff,Sparkles,Target,Activity,ChevronLeft} from 'lucide-react';
import {journeys,defaultCourse,makeRound} from './data/prototypeData.js';
import {metrics,completeHole,historyMetrics,windowMetrics} from './logic/roundMetrics.js';
import {coach as buildCoach} from './logic/coachEngine.js';
import {load,save,normalize,updateHandicap,createId} from './logic/storage.js';
import BottomNav from './components/BottomNav.jsx'; import HeroCard from './components/HeroCard.jsx'; import {Page,Eyebrow,Card,Primary,Secondary,TextButton,Choice,Label,Stat,Notice,Stepper} from './components/UI.jsx';
const tees=['Fairway','Left','Right','Long','Short','Penalty'],show=(v,s='')=>v==null?'—':`${String(v).replace('.',',')}${s}`;
export default function App(){
 const stored=normalize(load()); const [profile,setProfile]=useState(stored.profile);const [onboarding,setOnboarding]=useState(stored.onboarding); const [handicapInput,setHandicapInput]=useState(''); const [screen,setScreen]=useState(
  stored.activeRound?.meta?.status==='in_progress'
    ? 'hole'
    : stored.onboarding?.status==='complete'
      ? 'home'
      : stored.onboarding?.status==='handicap'
        ? 'handicap'
        : stored.onboarding?.status==='journey'
          ? 'journey'
          : 'welcome'
);
  
 const [journey,setJourney]=useState(stored.journey); const [courses,setCourses]=useState(stored.courses||[defaultCourse]); const [course,setCourse]=useState(courses.find(c=>c.id===stored.activeRound?.meta?.courseId)||courses[0]||defaultCourse); const [holeCount,setHoleCount]=useState(stored.activeRound?.meta?.roundType||18); const [mode,setMode]=useState(stored.activeRound?.meta?.mode==='practice'?'Practice':'Standard'); const [round,setRound]=useState(stored.activeRound?.holes||makeRound(course,18)); const [hole,setHole]=useState(stored.activeRound?.meta?.currentHole||1); const [rounds,setRounds]=useState(stored.rounds||[]); const [selectedRound,setSelectedRound]=useState(null); const [offline,setOffline]=useState(false); const [newCourse,setNewCourse]=useState({name:'',tee:'Yellow',holes:18,pars:'4,4,3,5,4,4,3,5,4,4,4,3,5,4,4,3,5,4'});
 const [roundActive,setRoundActive]=useState(Boolean(stored.activeRound));  
 const [roundDraft,setRoundDraft]=useState(stored.activeRound?.meta||null);
 const eligibleRounds=rounds.filter(r=>r?.eligibility?.progression!==false);
 const lastRound=eligibleRounds.at(-1)||null,goto=s=>{setScreen(s);window.scrollTo(0,0)},m=useMemo(()=>metrics(round),[round]),analysis=useMemo(()=>buildCoach(lastRound?.metrics||m),[lastRound,m]),history=useMemo(()=>historyMetrics(eligibleRounds),[eligibleRounds]);
 useEffect(()=>save({
  identity:stored.identity,
  onboarding,
  journey,
  profile,
  courses,
  activeRound:roundActive ? {meta:roundDraft,holes:round} : null,
  rounds,
  coach:stored.coach,
  sync:stored.sync
}),[onboarding,journey,profile,courses,round,rounds,roundActive,roundDraft]); 
 const cur=round[hole-1],touch=(k,v)=>setRound(r=>r.map((x,i)=>i===hole-1?{...x,[k]:v,touched:true}:x));
useEffect(()=>{
  if(roundActive) setRoundDraft(d=>d?{...d,currentHole:hole}:d);
},[hole,roundActive]);
 const startRound=()=>{
  setRound(makeRound(course,holeCount));
  setRoundDraft({id:createId('round'),
    ownerId:stored.identity.id,
    status:'in_progress',
    currentHole:1,
    courseId:course.id,
    tee:course.tee,
    roundType:holeCount,
    mode:mode.toLowerCase(),
    startedAt:new Date().toISOString()
  });
  setRoundActive(true);
  setHole(1);
  goto('hole');
};
 const demo=()=>setRound(r=>r.map((x,i)=>({...x,score:[5,4,3,6,4,5,3,5,4,5,4,3,6,4,4,4,5,4][i]??x.par,putts:[2,2,1,2,2,2,2,2,2,2,2,1,2,2,1,2,2,2][i]??2,gir:i%3===0,tee:x.par===3?null:(i===4||i===12?'Right':i===7?'Penalty':'Fairway'),penalty:i===7||i===12?1:0,touched:true})));
 const saveRound=()=>{
  const mm=metrics(round);

    const saved={
    id:roundDraft?.id||createId('round'),
    ownerId:stored.identity.id,
    roundType:holeCount,
    mode:mode.toLowerCase(),
    eligibility:{
      progression:mode==='Standard',
      coach:mode==='Standard'
    },
     status:'complete',
    revision:1,
    createdAt:new Date().toISOString(),
    updatedAt:new Date().toISOString(),
    course:course.name,
    tee:course.tee,
    date:new Date().toISOString(),
    round:[...round],
    metrics:mm,
    analysis:buildCoach(mm)
  };

  setRounds(prev=>{
    const next=[...prev,saved];

    save({
      identity:stored.identity,
      onboarding,
      journey,
      profile,
      courses,
      activeRound:null,
      lastRound:saved,
      rounds:next
    });

    return next;
  });

  setRound(makeRound(course,holeCount));
  setRoundActive(false);
  goto('saved');
  
};
 const addCourse=()=>{const pars=newCourse.pars.split(',').map(x=>Number(x.trim())).filter(x=>[3,4,5,6].includes(x));if(!newCourse.name.trim()||pars.length!==Number(newCourse.holes))return alert(`Enter ${newCourse.holes} valid par values.`);const c={id:`personal-${Date.now()}`,name:newCourse.name.trim(),tee:newCourse.tee.trim()||'Tee',holes:Number(newCourse.holes),pars};setCourses(x=>[c,...x]);setCourse(c);setHoleCount(c.holes);goto('setup')};
 const a=lastRound?.analysis||analysis,lm=lastRound?.metrics;
 const StatGrid=()=> <><div className="statsGrid"><Card className="mini"><small>ROUNDS SAVED</small><strong>{history.rounds}</strong></Card><Card className="mini"><small>AVG SCORE</small><strong>{show(history.scoreAvg)}</strong></Card><Card className="mini"><small>GIR</small><strong>{show(history.girPct,'%')}</strong></Card><Card className="mini"><small>FIR</small><strong>{show(history.firPct,'%')}</strong></Card><Card className="mini"><small>BIRDIE %</small><strong>{show(history.birdiePct,'%')}</strong></Card><Card className="mini"><small>BOGEY %</small><strong>{show(history.bogeyPct,'%')}</strong></Card><Card className="mini"><small>PUTTS / ROUND</small><strong>{show(history.puttsPerRound)}</strong></Card><Card className="mini"><small>3-PUTTS / ROUND</small><strong>{show(history.threePuttsPerRound)}</strong></Card><Card className="mini"><small>PENALTIES / ROUND</small><strong>{show(history.penaltiesPerRound)}</strong></Card><Card className="mini"><small>BEST SCORE</small><strong>{show(history.bestScore)}</strong></Card></div><Card><Eyebrow>Tee shot · typical miss</Eyebrow><div className="missGrid"><div><b>{show(history.leftPct,'%')}</b><small>← Left</small></div><div><b>{show(history.firPct,'%')}</b><small>Fairway</small></div><div><b>{show(history.rightPct,'%')}</b><small>Right →</small></div></div></Card></>;
 return <div className="shell"><header><button className="brand" onClick={()=>goto('home')}>PROJECT SCRATCH</button><span className="status">{offline?<><WifiOff size={13}/> OFFLINE</>:'PROTOTYPE v0.3.1'}</span></header><main>
 {screen==='welcome'&&<Page className="welcome"><Eyebrow>Better every round</Eyebrow><h1>Turn every round into your next advantage.</h1><p>Understand what shaped your score, commit to one focus and carry a measurable target into the next round.</p><Primary onClick={()=>{setOnboarding({status:'journey',completedAt:null});goto('journey')}}>Start your journey</Primary></Page>}
 {screen==='journey'&&<Page><Eyebrow>Your journey</Eyebrow><h1>What are you chasing?</h1><p>Choose the next scoring level that matters to you.</p>{journeys.map(x=><Choice key={x} on={journey===x} onClick={()=>setJourney(x)}>{x}</Choice>)}<Primary onClick={()=>{if(!journey)return;setOnboarding({status:'handicap',completedAt:null});goto('handicap')}}>Continue</Primary></Page>}
 {screen==='handicap'&&<Page><Eyebrow>Your profile</Eyebrow><h1>What's your current handicap?</h1><p>Enter your current handicap. The number you provide is used for your development profile and does not calculate or change your official handicap.</p><Label>Current handicap</Label><input type="number" inputMode="decimal" step="0.1" value={handicapInput} onChange={e=>setHandicapInput(e.target.value)} placeholder="e.g. 18.4"/><Primary onClick={()=>{const value=Number(handicapInput);if(!handicapInput.trim()||!Number.isFinite(value))return;setProfile(p=>updateHandicap(p,value));setOnboarding({status:'complete',completedAt:new Date().toISOString()});goto('home')}}>Continue</Primary><TextButton onClick={()=>{setOnboarding({status:'complete',completedAt:new Date().toISOString()});goto('home')}}>I don't know my handicap</TextButton></Page>}
 {screen==='home'&&<Page><div className="homeHello"><div><Eyebrow>Your development</Eyebrow><h1>Make the next round count.</h1></div></div><HeroCard journey={journey} currentHandicap={profile?.selfReportedHandicap} lastScore={lm?.score}/><div className="sectionTitle"><span>ONE FOCUS</span><small>{a.confidence} confidence</small></div><Card className="focusCard"><div className="focusIcon"><Target/></div><h2>{a.label}</h2><p>{a.reason}</p><TextButton onClick={()=>goto('evidence')}>Why this focus →</TextButton></Card><div className="dashGrid"><Card className="mini"><small>NEXT ROUND</small><strong>{a.target}</strong></Card><Card className="mini"><small>LATEST</small><strong>{lm?`${lm.score} · ${lastRound.course}`:'No round yet'}</strong></Card></div><Primary onClick={()=>goto('course')}>Start a round</Primary></Page>}
 {screen==='course'&&<Page><Eyebrow>Round</Eyebrow><h1>Where did you play?</h1>{courses.map(c=><Card key={c.id} className="courseCard"><button className="coursePick" onClick={()=>{setCourse(c);setHoleCount(c.holes);goto('setup')}}><div><b>{c.name}</b><small>{c.tee} • {c.holes} holes</small></div><span>→</span></button></Card>)}<Card><b>Course missing?</b><p>Create a personal course. No external provider required.</p><Secondary onClick={()=>goto('create')}>Create course</Secondary></Card></Page>}
 {screen==='create'&&<Page><button className="back" onClick={()=>goto('course')}><ChevronLeft/> Courses</button><Eyebrow>Personal course</Eyebrow><h1>Create course</h1><Label>Course name</Label><input value={newCourse.name} onChange={e=>setNewCourse({...newCourse,name:e.target.value})} placeholder="e.g. Hulta Golfklubb"/><Label>Tee</Label><input value={newCourse.tee} onChange={e=>setNewCourse({...newCourse,tee:e.target.value})}/><Label>Round</Label><div className="grid2"><Choice on={newCourse.holes===18} onClick={()=>setNewCourse({...newCourse,holes:18})}>18 holes</Choice><Choice on={newCourse.holes===9} onClick={()=>setNewCourse({...newCourse,holes:9,pars:newCourse.pars.split(',').slice(0,9).join(',')})}>9 holes</Choice></div><Label>Par sequence</Label><textarea value={newCourse.pars} onChange={e=>setNewCourse({...newCourse,pars:e.target.value})}/><small>Use comma-separated pars. Rating, Slope and distances stay optional.</small><Primary onClick={addCourse}>Save personal course</Primary></Page>}
 {screen==='setup'&&<Page><Eyebrow>Round setup</Eyebrow><h1>{course.name}</h1><Card><Label>Tee</Label><Choice on>{course.tee}</Choice><Label>Round</Label><div className="grid2"><Choice on={holeCount===18} onClick={()=>course.holes>=18&&setHoleCount(18)}>18 holes</Choice><Choice on={holeCount===9} onClick={()=>setHoleCount(9)}>9 holes</Choice></div><Label>Mode</Label><div className="grid2"><Choice on={mode==='Standard'} onClick={()=>setMode('Standard')}>Standard</Choice><Choice on={mode==='Practice'} onClick={()=>setMode('Practice')}>Practice</Choice></div></Card><Primary onClick={startRound}>Start {holeCount}-hole round</Primary></Page>}
 {screen==='hole'&&cur&&<Page><div className="between"><div><Eyebrow>Hole {hole} · Par {cur.par}</Eyebrow><h1>Enter the truth.</h1></div><button className="bare" onClick={()=>goto('home')}>Save & exit</button></div><div className="roundProgress"><b>{round.filter(completeHole).length}/{round.length}</b><span>complete</span></div><div className="holes">{round.map(x=><button key={x.hole} className={`${x.hole===hole?'current':''} ${completeHole(x)?'done':''}`} onClick={()=>setHole(x.hole)}>{x.hole}</button>)}</div><Label>Gross score</Label><Stepper v={cur.score} set={v=>touch('score',v)}/><Label>Putts</Label><Stepper v={cur.putts} set={v=>touch('putts',v)}/><Label>GIR</Label><div className="grid2"><Choice on={cur.gir===true} onClick={()=>touch('gir',true)}>Yes</Choice><Choice on={cur.gir===false} onClick={()=>touch('gir',false)}>No</Choice></div>{cur.par!==3&&<><Label>Tee result</Label><div className="chips">{tees.map(x=><Choice key={x} on={cur.tee===x} onClick={()=>touch('tee',x)}>{x}</Choice>)}</div></>}<Label>Penalty strokes</Label><div className="grid3">{[0,1,2].map(x=><Choice key={x} on={cur.penalty===x&&cur.touched} onClick={()=>touch('penalty',x)}>{x}</Choice>)}</div><div className="actions"><Secondary onClick={demo}>Fill demo round</Secondary><Primary onClick={()=>hole<round.length?setHole(h=>h+1):goto('review')}>{hole===round.length?'Review round':'Next hole'}</Primary></div></Page>}
 {screen==='review'&&<Page><Eyebrow>Round review</Eyebrow><h1>{m.n===round.length?'Ready to save.':'Round needs attention.'}</h1><Card><Stat a="Completed" b={`${m.n}/${round.length}`}/><Stat a="Score" b={m.n===round.length?m.score:'—'}/><Stat a="Putts" b={m.n===round.length?m.putts:'—'}/><Stat a="Penalties" b={m.n===round.length?m.penalties:'—'}/></Card>{m.n<round.length?<><Notice>Complete all required fields before analysis.</Notice><Secondary onClick={()=>{const i=round.findIndex(x=>!completeHole(x));setHole(i+1);goto('hole')}}>Fix missing holes</Secondary></>:<Primary onClick={saveRound}>Save round</Primary>}</Page>}
 {screen==='saved'&&<Page><Notice ok>Round saved safely on this device.</Notice><Eyebrow>Coach</Eyebrow><h1>{offline?'Analysis queued.':'Your recap is ready.'}</h1><p>Your round has been added to your saved history. It will remain after refresh on this browser.</p>{offline?<Primary onClick={()=>goto('home')}>Back Home</Primary>:<Primary onClick={()=>goto('recap')}>View recap</Primary>}<Secondary onClick={()=>setOffline(x=>!x)}>{offline?'Restore connection':'Simulate offline'}</Secondary></Page>}
 {screen==='recap'&&<Page><Eyebrow>Round recap · {lm?.score??'—'}</Eyebrow><h1>{a.headline}</h1><div className="scoreStrip"><div><small>SCORE</small><b>{lm?.score??'—'}</b></div><div><small>PUTTS</small><b>{lm?.putts??'—'}</b></div><div><small>GIR</small><b>{lm?.girPct!=null?`${lm.girPct}%`:'—'}</b></div><div><small>PEN</small><b>{lm?.penalties??'—'}</b></div></div><Card><b>What shaped the score</b><p>{a.reason}</p><p><strong>Positive:</strong> {a.positive}</p><TextButton onClick={()=>goto('evidence')}>See the evidence →</TextButton></Card><Card className="focusCard"><Eyebrow>One Focus</Eyebrow><h2>{a.label}</h2><p>{a.practice}</p><Primary onClick={()=>goto('focus')}>Open One Focus</Primary></Card></Page>}
 {screen==='roundDetail'&&selectedRound&&<Page><button className="back" onClick={()=>goto('progress')}><ChevronLeft/> History</button><Eyebrow>Round history</Eyebrow><h1>{selectedRound.course}</h1><p>{new Date(selectedRound.date).toLocaleDateString('sv-SE')} · {selectedRound.round.length} holes · {selectedRound.tee}</p><Card><Stat a="Score" b={selectedRound.metrics.score}/><Stat a="Putts" b={selectedRound.metrics.putts}/><Stat a="GIR" b={`${selectedRound.metrics.girPct}%`}/><Stat a="Penalties" b={selectedRound.metrics.penalties}/></Card><Eyebrow>Hole by hole</Eyebrow>{selectedRound.round.map(h=><Card key={h.hole} className="roundHistory"><div><b>Hole {h.hole} · Par {h.par}</b><small>{h.par!==3?`Tee: ${h.tee||'—'} · `:''}GIR: {h.gir?'Yes':'No'}</small></div><strong>{h.score}</strong></Card>)}</Page>}
 {screen==='evidence'&&<Page><Eyebrow>Why this focus?</Eyebrow><h1>Evidence, not a story.</h1>{lm?<Card><Stat a="Penalty strokes" b={lm.penalties}/><Stat a="Right misses" b={lm.right}/><Stat a="Three-putts" b={lm.threePutts}/><Stat a="GIR" b={`${lm.girPct}%`}/></Card>:<Notice>Complete a round to build evidence.</Notice>}<Card><b>Coach interpretation</b><p>{a.reason}</p><small>Confidence: {a.confidence}. This prototype uses deterministic rules, not an LLM, to keep the evidence traceable.</small></Card><Primary onClick={()=>goto('focus')}>Continue</Primary></Page>}
 {screen==='focus'&&<Page><Eyebrow>One Focus</Eyebrow><h1>{a.label}</h1><p>{a.reason}</p><Card><b>Practice</b><p>{a.practice}</p><hr/><b>Success criterion</b><p>{a.criterion}</p></Card><Card><b>Next-round target</b><p>{a.target}</p></Card><Primary onClick={()=>goto('home')}>Use this focus</Primary></Page>}
 {screen==='coach'&&<Page><Eyebrow>AI Coach</Eyebrow><h1>One useful decision.</h1><Card className="focusCard"><Sparkles/><h2>{a.label}</h2><p>{a.reason}</p><Primary onClick={()=>goto('focus')}>Open focus</Primary></Card>{lastRound&&<Card><b>Latest round</b><p>{lm.score} · {lastRound.course}</p><TextButton onClick={()=>goto('recap')}>Open recap →</TextButton></Card>}<Notice>The prototype coach is deterministic: different round patterns produce different recommendations.</Notice></Page>}
 {screen==='progress'&&<Page><Eyebrow>Progress</Eyebrow><h1>Your game, in numbers.</h1><Card className="progressCard"><Activity/><div><small>ACTIVE FOCUS</small><h2>{a.label}</h2><p>{a.confidence} confidence from current eligible evidence.</p></div></Card><StatGrid/><div className="windowTitle"><Eyebrow>Recent windows</Eyebrow><p>Personal trends unlock as history grows.</p></div><div className="dashGrid">{[5,10,20].map(n=>{const w=eligibleRounds.length>=n?windowMetrics(eligibleRounds,n):null;return <Card className="mini" key={n}><small>LAST {n}</small><strong>{w?`${show(w.scoreAvg)} avg`:'—'}</strong><span>{w?`${show(w.girPct,'%')} GIR`:`Need ${n-eligibleRounds.length} more`}</span></Card>})}</div>{rounds.length>0&&<><div className="windowTitle"><Eyebrow>Round history</Eyebrow></div>{[...rounds].reverse().map(r=><Card className="roundHistory" key={r.id||r.date} onClick={()=>{setSelectedRound(r);goto('roundDetail')}}><div><b>{r.course}</b><small>{new Date(r.date).toLocaleDateString('sv-SE')} · {r.round.length} holes</small></div><strong>{r.metrics.score}</strong></Card>)}</>}<Notice>Up & Down and Sand Save intentionally remain unavailable until the round-entry model captures the required opportunities. Missing data is not shown as 0%.</Notice></Page>}
 </main>{!['welcome','journey','handicap'].includes(screen)&&<BottomNav screen={screen} goto={goto}/>}</div>
}
