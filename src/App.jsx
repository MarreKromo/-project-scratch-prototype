import React,{useMemo,useState,useEffect} from 'react';
import {WifiOff,Sparkles,Target,Activity,ChevronLeft} from 'lucide-react';
import {journeys,defaultCourse,makeRound} from './data/prototypeData.js';
import {metrics,METRICS_VERSION,completeHole,historyMetrics,windowMetrics} from './logic/roundMetrics.js';
import {coach as buildCoach} from './logic/coachEngine.js';
import { persistCompletedRound } from './logic/roundSave.js';
import {load,save,normalize,updateHandicap,createId,createClub,updateClub,retireClub,replaceClub,createTrainingActivity,updateTrainingActivity,voidTrainingActivity} from './logic/storage.js';
import BottomNav from './components/BottomNav.jsx'; import HeroCard from './components/HeroCard.jsx'; import {Page,Eyebrow,Card,Primary,Secondary,TextButton,Choice,Label,Stat,Notice,Stepper} from './components/UI.jsx';
import { supabase, signOut, getMyProfile, saveMyOnboarding, testProfileIsolation, getMyRounds, saveMyRound, getMyCourses, saveMyCourse, testSupabaseConnection } from './lib/supabase.js';
import AuthScreen from './components/AuthScreen.jsx';
const tees=['Fairway','Left','Right','Long','Short','Penalty'],show=(v,s='')=>v==null?'—':`${String(v).replace('.',',')}${s}`;
const getRoundPlayingMinutes=round=>{
  if(!round?.createdAt||!round?.completedAt)return null;

  const startedAt=new Date(round.createdAt).getTime();
  const completedAt=new Date(round.completedAt).getTime();
  const pausedMinutes=Number(round.totalPausedMinutes??0);

  if(
    !Number.isFinite(startedAt)||
    !Number.isFinite(completedAt)||
    !Number.isFinite(pausedMinutes)||
    pausedMinutes<0
  ){
    return null;
  }

  const elapsedMinutes=(completedAt-startedAt)/60000;
  const playingMinutes=elapsedMinutes-pausedMinutes;

  if(
  elapsedMinutes<=0||
  pausedMinutes>elapsedMinutes||
  playingMinutes<=0
){
  return null;
}

  return playingMinutes;
};

const formatRoundPlayingTime=round=>{
  const minutes=getRoundPlayingMinutes(round);

  if(minutes===null)return 'Utan tid';

  if(minutes<1){
    return `${Math.max(1,Math.round(minutes*60))} sec`;
  }

  return `${Math.round(minutes)} min`;
};

const readStartupData = (userId = null) => {

  try {
    return {
      stored: normalize(load(userId)),
      storageError: null
    };
  } catch (error) {
    return {
      stored: null,
      storageError: error
    };
  }
};

const StorageErrorScreen = () => (
  <main style={{ padding: 24, maxWidth: 480, margin: '48px auto' }}>
    <h1>Din golfdata kunde inte läsas</h1>
    <p>
      Vi har stoppat appens uppstart för att skydda
      din sparade historik.
    </p>
    <p>
      Rensa inte webbläsarens lagring och installera
      inte om appen. Ingen automatisk återställning
      har genomförts.
    </p>
  </main>
);


  function AppContent({ stored, userId }) {
  const [profile,setProfile]=useState(stored.profile);const [onboarding,setOnboarding]=useState(stored.onboarding); const [handicapInput,setHandicapInput]=useState(''); const [screen,setScreen]=useState(

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
  
 const [journey,setJourney]=useState(stored.journey);
 const [courses,setCourses]=useState(stored.courses||[]);
 const [course,setCourse]=useState(courses.find(c=>c.id===stored.activeRound?.meta?.courseId)||courses[0]||defaultCourse); const [holeCount,setHoleCount]=useState(stored.activeRound?.meta?.roundType||18); const [mode,setMode]=useState(stored.activeRound?.meta?.mode==='practice'?'Practice':'Standard'); const [round,setRound]=useState(stored.activeRound?.holes||makeRound(course,18)); const [hole,setHole]=useState(stored.activeRound?.meta?.currentHole||1); 
 const [rounds,setRounds]=useState(stored.rounds || []);
 const [selectedRound,setSelectedRound]=useState(null); const [offline,setOffline]=useState(false); const [newCourse,setNewCourse]=useState({name:'',tee:'Yellow',holes:18,pars:'4,4,3,5,4,4,3,5,4,4,4,3,5,4,4,3,5,4'});
 
useEffect(() => {
  let cancelled = false;

  async function loadCloudRounds() {
    const { data, error } = await getMyRounds();

    if (cancelled) return;

    if (error) {
      console.error('CLOUD_ROUNDS_LOAD_FAILED', error);
      return;
    }

    const validRounds = (data || [])
      .map(row => row.round_data)
      .filter(round =>
        round &&
        Array.isArray(round.round) &&
        round.metrics
      );

    
    setRounds(current => {
      const merged = new Map();

      for (const round of current) {
        if (round?.id) {
          merged.set(round.id, round);
        }
      }

      for (const round of validRounds) {
        if (round?.id && !merged.has(round.id)) {
          merged.set(round.id, round);
        }
      }

      return [...merged.values()];
    });

  }

  loadCloudRounds();

  return () => {
    cancelled = true;
  };
}, []);

useEffect(() => {
  let cancelled = false;

  async function loadCloudCourses() {
    const { data, error } = await getMyCourses();

    if (cancelled) return;

    if (error) {
      console.error('CLOUD_COURSES_LOAD_FAILED', error);
      return;
    }

    const cloudCourses = (data || [])
      .map(row => row.course_data)
      .filter(c =>
        c &&
        typeof c.id === 'string' &&
        typeof c.name === 'string' &&
        Array.isArray(c.pars)
      );

   
  setCourses(cloudCourses);

 }

  loadCloudCourses();

  return () => {
    cancelled = true;
  };
}, []);

useEffect(() => {
  let cancelled = false;

  async function loadCloudOnboarding() {
    const { data, error } = await getMyProfile();

    if (cancelled) return;

    if (error) {
      console.error('ONBOARDING_LOAD_FAILED', error);
      return;
    }

    const saved = data?.onboarding_data;

    if (saved?.onboarding?.status !== 'complete') {
      return;
    }

    setOnboarding(saved.onboarding);

    if (saved.journey) {
      setJourney(saved.journey);
    }

    if (typeof saved.handicap === 'number') {
      setProfile(current =>
        updateHandicap(current, saved.handicap)
      );
    }

    setScreen('home');
  }

  loadCloudOnboarding();

  return () => {
    cancelled = true;
  };
}, []);

 const [equipment,setEquipment]=useState(stored.equipment); 
 const [training,setTraining]=useState(stored.training);
 
 const [trainingForm,setTrainingForm]=useState({
  type:'',
  durationMinutes:'',
  category:'',
  clubIds:[]
});

const [selectedTrainingId,setSelectedTrainingId]=useState(null);

 const activeTraining=training.activities.filter(
  activity=>activity.status==='active'
);

const totalTrainingMinutes=activeTraining.reduce(
  (sum,activity)=>sum+(Number(activity.durationMinutes)||0),
  0
);

const totalTrainingHours=totalTrainingMinutes/60;

 const trainingByType=activeTraining.reduce(
  (totals,activity)=>{
    const type=activity.type||'other';
    totals[type]=(totals[type]||0)+(Number(activity.durationMinutes)||0);
    return totals;
  },
  {}
);

const recentTrainingMinutes=activeTraining
  .filter(activity=>{
    const occurredAt=new Date(activity.occurredAt);
    const thirtyDaysAgo=new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate()-30);

    return occurredAt>=thirtyDaysAgo;
  })
  .reduce(
    (sum,activity)=>sum+(Number(activity.durationMinutes)||0),
    0
  );

 const recentTrainingHours=recentTrainingMinutes/60;
 
 const playingMinutes=rounds.reduce(
  (sum,round)=>{
    const minutes=getRoundPlayingMinutes(round);
    return sum+(minutes??0);
  },
  0
);

const playingHours=playingMinutes/60;
const totalGolfHours=totalTrainingHours+playingHours;

const timedRounds=rounds.filter(
  round=>getRoundPlayingMinutes(round)!==null
);

 const untimedRoundsCount=
  rounds.length-timedRounds.length;

 const recentPlayingMinutes=timedRounds
  .filter(round=>{
    const completedAt=new Date(round.completedAt);
    const thirtyDaysAgo=new Date();

    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate()-30);

    return completedAt>=thirtyDaysAgo;
  })
.reduce(
  (sum,round)=>{
    const minutes=getRoundPlayingMinutes(round);
    return sum+(minutes??0);
  },
  0
);
  
 const recentPlayingHours=recentPlayingMinutes/60;

 const recentGolfHours=
  recentTrainingHours+recentPlayingHours;

 const [editTrainingForm,setEditTrainingForm]=useState({
  type:'',
  durationMinutes:'',
  category:''
});
 
 const addTrainingActivity = activityData => {
 const activity = createTrainingActivity({
    ownerId: stored.identity.id,
    ...activityData
  });

  setTraining(current => ({
    ...current,
    activities: [...current.activities, activity]
  }));

  return activity;
};

 const editTrainingActivity = (activityId, changes) => {
  setTraining(current => ({
    ...current,
    activities: current.activities.map(activity =>
      activity.id === activityId
        ? updateTrainingActivity(activity, changes)
        : activity
    )
  }));
};

const removeTrainingActivity = activityId => {
  setTraining(current => ({
    ...current,
    activities: current.activities.map(activity =>
      activity.id === activityId
        ? voidTrainingActivity(activity)
        : activity
    )
  }));
};
 
 const [clubForm,setClubForm]=useState({
  type:'',
  label:'',
  loft:''
});

 const [selectedClubId,setSelectedClubId]=useState(null);

 const [editClubForm,setEditClubForm]=useState({
  type:'',
  label:'',
  loft:''
});

 const [replaceClubForm,setReplaceClubForm]=useState({
  type:'',
  label:'',
  loft:''
});
 
 const addClub = ({type,label,loft=null}) => {
  const club = createClub({
    ownerId: stored.identity.id,
    type,
    label,
    loft
  });

  setEquipment(current => ({
    ...current,
    clubs: [...current.clubs, club]
  }));

  return club;
};
 
 const editClub = (clubId, changes) => {
  setEquipment(current => ({
    ...current,
    clubs: current.clubs.map(club =>
      club.id === clubId
        ? updateClub(club, changes)
        : club
    )
  }));
};

const removeClub = clubId => {
  setEquipment(current => ({
    ...current,
    clubs: current.clubs.map(club =>
      club.id === clubId
        ? retireClub(club)
        : club
    )
  }));
};

 const replaceBagClub = (clubId, replacement) => {
  setEquipment(current => {
    const oldClub = current.clubs.find(
      club => club.id === clubId
    );

    const result = replaceClub(oldClub, replacement);

    if (!result) {
      return current;
    }

    return {
      ...current,
      clubs: [
        ...current.clubs.map(club =>
          club.id === clubId
            ? result.retiredClub
            : club
        ),
        result.newClub
      ]
    };
  });
};
 
 const [roundActive,setRoundActive]=useState(Boolean(stored.activeRound));  
 const [roundDraft,setRoundDraft]=useState(stored.activeRound?.meta||null);
 const [storageError, setStorageError] = useState(false);
 const [pendingRoundSync, setPendingRoundSync] = useState(
  () => Array.isArray(stored.sync?.pendingRoundIds)
    ? [...new Set(
        stored.sync.pendingRoundIds.filter(
          id => typeof id === 'string' && id.length > 0
        )
      )]
    : []
);

 const eligibleRounds=rounds.filter(r=>r?.eligibility?.progression!==false);
 const lastRound=eligibleRounds.at(-1)||null,goto=s=>{setScreen(s);window.scrollTo(0,0)},m=useMemo(()=>metrics(round),[round]),analysis=useMemo(()=>buildCoach(lastRound?.metrics||m),[lastRound,m]),history=useMemo(()=>historyMetrics(eligibleRounds),[eligibleRounds]); 
 useEffect(()=>{
  try {
    save({
  identity:stored.identity,
  onboarding,
  journey,
  profile,
  equipment,
  training,
  courses,
  activeRound:roundActive ? {meta:roundDraft,holes:round} : null,
  rounds,
  coach:stored.coach,
  
  sync: {
    ...stored.sync,
    pendingRoundIds: pendingRoundSync
  }
   
    }, userId);
    setStorageError(false);
  } catch (error) {
    console.error('STORAGE_WRITE_FAILED', error);
    setStorageError(true);
  }
},[onboarding,journey,profile,equipment,training,courses,round,rounds,roundActive,roundDraft,pendingRoundSync]);
 
useEffect(() => {
  if (storageError) {
    alert(
      'VARNING: Din golfdata kunde inte sparas. ' +
      'Stäng inte sidan och rensa inte webbläsarens data. ' +
      'Kontrollera lagringsutrymmet innan du fortsätter.'
    );
  }
}, [storageError]);
 
 const cur=round[hole-1],touch=(k,v)=>setRound(r=>r.map((x,i)=>i===hole-1?{...x,[k]:v,touched:true}:x));
useEffect(()=>{
  if(roundActive) setRoundDraft(d=>d?{
    ...d,
    currentHole:hole,
    updatedAt:new Date().toISOString()
  }:d);
},[hole,round,roundActive]);
 const startRound=()=>{
  if (!courses.some(c => c.id === course?.id)) {
    alert('Välj eller skapa en golfbana innan du startar rundan.');
    goto('course');
    return;
  }

  setRound(makeRound(course,holeCount));
  setRoundDraft({id:createId('round'),
    ownerId:stored.identity.id,
    status:'in_progress',
    currentHole:1,
    courseId:course.id,
    tee:course.tee,
    roundType:holeCount,
    mode:mode.toLowerCase(),
    startedAt:new Date().toISOString(),
    pausedAt:null,
    totalPausedMinutes:0,
    updatedAt:new Date().toISOString()
  });
  setRoundActive(true);
  setHole(1);
  goto('hole');
};

 const toggleRoundPause=()=>{
  setRoundDraft(current=>{
    if(!current)return current;

    if(current.pausedAt){
      const pausedAt=new Date(current.pausedAt);
      const resumedAt=new Date();

      const pausedMinutes=
        (resumedAt.getTime()-pausedAt.getTime())/60000;

      return {
        ...current,
        pausedAt:null,
        totalPausedMinutes:
          (Number(current.totalPausedMinutes)||0)+pausedMinutes,
        updatedAt:resumedAt.toISOString()
      };
    }

    const pausedAt=new Date();

    return {
      ...current,
      pausedAt:pausedAt.toISOString(),
      updatedAt:pausedAt.toISOString()
    };
  });
};
 
 const demo=()=>setRound(r=>r.map((x,i)=>({...x,score:[5,4,3,6,4,5,3,5,4,5,4,3,6,4,4,4,5,4][i]??x.par,putts:[2,2,1,2,2,2,2,2,2,2,2,1,2,2,1,2,2,2][i]??2,gir:i%3===0,tee:x.par===3?null:(i===4||i===12?'Right':i===7?'Penalty':'Fairway'),penalty:i===7||i===12?1:0,touched:true})));
 const saveRound=async ()=>{
   const mm=metrics(round);
     const completedAt=new Date();

  const activePauseMinutes=roundDraft?.pausedAt
    ? Math.max(
        0,
        (completedAt.getTime()-new Date(roundDraft.pausedAt).getTime())/60000
      )
    : 0;

  const totalPausedMinutes=
    (Number(roundDraft?.totalPausedMinutes)||0)+activePauseMinutes;
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
    createdAt:roundDraft?.startedAt||new Date().toISOString(),
    completedAt:completedAt.toISOString(),
    totalPausedMinutes,
    updatedAt:new Date().toISOString(),
    course:course.name,
    tee:course.tee,
    date:new Date().toISOString(),
    round:[...round],
    metricsVersion:METRICS_VERSION,
    metrics:mm,
    analysis:mode==='Standard'?buildCoach(mm):null
  };
  

  try {
    const next = persistCompletedRound(
      save,
      {
        identity: stored.identity,
        onboarding,
        journey,
        profile,
        equipment,
        training,
        courses,
        activeRound: roundActive
          ? { meta: roundDraft, holes: round }
          : null,
        rounds,
        coach: stored.coach,
        sync: {
  ...stored.sync,
  pendingRoundIds: [
    ...new Set([...pendingRoundSync, saved.id])
  ]
}
      },
      saved
    );

    setRounds(next);
    setPendingRoundSync(current => [
  ...new Set([...current, saved.id])
   ]);
    setStorageError(false);

  } catch (error) {
    console.error('ROUND_SAVE_FAILED', error);
    setStorageError(true);
    alert('Rundan kunde inte sparas. Försök igen. Lämna inte sidan.');
    return;
  }

try {
  const { error } = await saveMyRound(saved);

  if (error) {
    console.error('CLOUD_ROUND_SAVE_FAILED', error);
    alert(
      'Rundan sparades lokalt, men inte i molnet. ' +
      'Försök inte spara samma runda igen.'
    );
  }
 
else {
  setPendingRoundSync(current =>
    current.filter(id => id !== saved.id)
  );
}
 
} catch (error) {
  console.error('CLOUD_ROUND_SAVE_FAILED', error);
  alert(
    'Rundan sparades lokalt, men molnlagringen misslyckades.'
  );
}

setSelectedRound(saved);
setRound(makeRound(course,holeCount));
setRoundActive(false);
goto('saved');
  
};
 
const addCourse = async () => {
  const pars = newCourse.pars
    .split(',')
    .map(x => Number(x.trim()))
    .filter(x => [3, 4, 5, 6].includes(x));

  if (!newCourse.name.trim() ||
      pars.length !== Number(newCourse.holes)) {
    alert(`Ange ${newCourse.holes} giltiga parvärden.`);
    return;
  }

  const c = {
    id: `personal-${Date.now()}`,
    name: newCourse.name.trim(),
    tee: newCourse.tee.trim() || 'Tee',
    holes: Number(newCourse.holes),
    pars
  };

  try {
    const { error } = await saveMyCourse(c);

    if (error) throw error;

    setCourses(current => [...current, c]);
    setCourse(c);
    setHoleCount(c.holes);
    goto('setup');
  } catch (error) {
    console.error('COURSE_SAVE_FAILED', error);
    alert('Golfbanan kunde inte sparas i molnet: ' + error.message);
  }
};

 const a=lastRound?.analysis||analysis,lm=lastRound?.metrics;
 const recapRound=selectedRound||lastRound;
 const recapMetrics=recapRound?.metrics;
 const recapAnalysis=recapRound?.analysis||buildCoach(recapMetrics||m);
 const StatGrid=()=> <><div className="statsGrid"><Card className="mini"><small>SPARADE RUNDOR</small><strong>{history.rounds}</strong></Card><Card className="mini"><small>AVG 9 HÅL</small><strong>{show(history.scoreAvg9)}</strong></Card><Card className="mini"><small>AVG 18 HÅL</small><strong>{show(history.scoreAvg18)}</strong></Card><Card className="mini"><small>GIR</small><strong>{show(history.girPct,'%')}</strong></Card><Card className="mini"><small>FIR</small><strong>{show(history.firPct,'%')}</strong></Card><Card className="mini"><small>BIRDIE %</small><strong>{show(history.birdiePct,'%')}</strong></Card><Card className="mini"><small>BOGEY %</small><strong>{show(history.bogeyPct,'%')}</strong></Card><Card className="mini"><small>PUTTAR / RUNDA</small><strong>{show(history.puttsPerRound)}</strong></Card><Card className="mini"><small>TREPUTTAR / RUNDA</small><strong>{show(history.threePuttsPerRound)}</strong></Card><Card className="mini"><small>PLIKTSLAG / RUNDA</small><strong>{show(history.penaltiesPerRound)}</strong></Card><Card className="mini">
<small>BÄSTA 9 HÅL</small><strong>{show(history.bestScore9)}</strong></Card><Card className="mini"><small>BÄSTA 18 HÅL</small><strong>{show(history.bestScore18)}</strong>
</Card></div><Card><Eyebrow>Utslag · vanligaste miss</Eyebrow><div className="missGrid"><div><b>{show(history.leftPct,'%')}</b><small>← Vänster</small></div><div><b>{show(history.firPct,'%')}</b><small>Fairway</small></div><div><b>{show(history.rightPct,'%')}</b><small>Höger →</small></div></div></Card></>;
 const runConnectionTest = async () => {
  const result = await testSupabaseConnection();
  alert(result.message);
};

const completeOnboarding = async (handicap = null) => {
  const completed = {
    status: 'complete',
    completedAt: new Date().toISOString()
  };

  const nextProfile = handicap === null
    ? profile
    : updateHandicap(profile, handicap);

  const { error } = await saveMyOnboarding({
    onboarding: completed,
    journey,
    handicap: nextProfile?.selfReportedHandicap ?? null
  });

  if (error) {
    alert('Kunde inte spara din profil: ' + error.message);
    return;
  }

  setProfile(nextProfile);
  setOnboarding(completed);
  goto('home');
};

  return <div className="shell"><header><button className="brand" onClick={()=>goto('home')}>PROJECT SCRATCH</button><span className="status">{offline?<><WifiOff size={13}/> OFFLINE</>:'PROTOTYPE v0.3.1'}</span></header><main> 
<button onClick={runConnectionTest}>
  Testa Supabase
</button>
 {screen==='welcome'&&<Page className="welcome"><Eyebrow>Bättre för varje runda</Eyebrow><h1>Gör varje runda till ett steg framåt.</h1><p>Förstå vad som påverkade din score, välj ett fokus och ta med dig ett tydligt mål till nästa runda.</p><Primary onClick={()=>{setOnboarding({status:'journey',completedAt:null});goto('journey')}}>Starta din resa</Primary></Page>}
 {screen==='journey'&&<Page><Eyebrow>Din resa</Eyebrow><h1>Vad siktar du på?</h1><p>Välj nästa nivå du vill nå.</p>{journeys.map(x=><Choice key={x} on={journey===x} onClick={()=>setJourney(x)}>{x}</Choice>)}<Primary onClick={()=>{if(!journey)return;setOnboarding({status:'handicap',completedAt:null});goto('handicap')}}>Fortsätt</Primary></Page>}
 
{screen==='handicap'&&<Page>
  <Eyebrow>Din profil</Eyebrow>
  <h1>Vad har du i handicap?</h1>
  <p>Ange ditt nuvarande handicap. Värdet används för din utvecklingsprofil och ändrar inte ditt officiella handicap.</p>
  <Label>Nuvarande handicap</Label>
  <input
    type="number"
    inputMode="decimal"
    step="0.1"
    value={handicapInput}
    onChange={e=>setHandicapInput(e.target.value)}
    placeholder="t.ex. 18.4"
  />
  <Primary onClick={()=>{
    const value=Number(handicapInput);
    if(!handicapInput.trim()||!Number.isFinite(value))return;
    completeOnboarding(value);
  }}>
    Fortsätt
  </Primary>
  <TextButton onClick={()=>completeOnboarding()}>
    Jag vet inte mitt handicap
  </TextButton>
</Page>}

 {screen==='home'&&<Page><div className="homeHello"><div><Eyebrow>Din utveckling</Eyebrow><h1>Gör nästa runda bättre.</h1></div></div><HeroCard journey={journey} currentHandicap={profile?.selfReportedHandicap} lastScore={lm?.score}/><div className="sectionTitle"><span>ETT FOKUS</span><small>{a.confidence} tillförlitlighet</small></div><Card className="focusCard"><div className="focusIcon"><Target/></div><h2>{a.label}</h2><p>{a.reason}</p><TextButton onClick={()=>goto('evidence')}>Varför detta fokus →</TextButton></Card><div className="dashGrid"><Card className="mini"><small>NÄSTA RUNDA</small><strong>{a.target}</strong></Card><Card className="mini"><small>SENASTE</small><strong>{lm?`${lm.score} · ${lastRound.course}`:'Ingen runda ännu'}</strong></Card></div><Primary onClick={()=>goto('course')}>Starta en runda</Primary><Secondary onClick={()=>goto('training')}>Träning</Secondary><Secondary onClick={()=>goto('bag')}>Min bag</Secondary></Page>}
 {screen==='training'&&<Page>
  <button className="back" onClick={()=>goto('home')}>
    <ChevronLeft/> Home
  </button>

  <Eyebrow>Träning</Eyebrow>
  <h1>Lägg grunden för bättre rundor.</h1>
  <p>
    Registrera träningen som hjälper dig att utvecklas.
  </p>

  <Card>
  <Eyebrow>Golftid</Eyebrow>

  <h2>{totalGolfHours.toFixed(1)} h</h2>
  <p>Totalt registrerad golftid.</p>

  <div className="dashGrid">
  <div>
    <small>TRÄNING</small>
    <strong>{totalTrainingHours.toFixed(1)} h</strong>
  </div>

  <div>
    <small>SPEL</small>
    <strong>{playingHours.toFixed(1)} h</strong>
  </div>
</div>

<div className="dashGrid">
  <div>
    <small>SENASTE 30 DAGAR</small>
    <strong>{recentGolfHours.toFixed(1)} h</strong>
  </div>

 <div>
  <small>RUNDOR MED / UTAN TID</small>
  <strong>
    {timedRounds.length} / {untimedRoundsCount}
  </strong>
 </div>
</div>

<div className="dashGrid">
  <div>
    <small>30 DAGAR · TRÄNING</small>
    <strong>{recentTrainingHours.toFixed(1)} h</strong>
  </div>

  <div>
    <small>30 DAGAR · SPEL</small>
    <strong>{recentPlayingHours.toFixed(1)} h</strong>
  </div>
</div>

  {Object.keys(trainingByType).length>0&&(
    <>
      <Eyebrow>Per aktivitet</Eyebrow>

      {Object.entries(trainingByType)
        .sort((a,b)=>b[1]-a[1])
        .map(([type,minutes])=>(
          <Stat
            key={type}
            a={type.charAt(0).toUpperCase()+type.slice(1)}
            b={`${(minutes/60).toFixed(1)} h`}
          />
        ))
      }
    </>
  )}
</Card>

  <Eyebrow>Träningshistorik</Eyebrow>
  
  {training.activities.filter(activity=>activity.status==='active').length===0
    ? <Notice>Ingen träning registrerad ännu.</Notice>
    : [...training.activities]
    .filter(activity=>activity.status==='active')
    .sort((a,b)=>new Date(b.occurredAt)-new Date(a.occurredAt))
    .map(activity=>          <Card key={activity.id}>
         <b>{activity.type}</b>
         <p>{activity.durationMinutes} min</p>
        
         {activity.category&&(
         <p>{activity.category}</p>
       )}
        
        <small>
          {new Date(activity.occurredAt).toLocaleDateString()}
         </small>
           <TextButton onClick={()=>{
    setSelectedTrainingId(activity.id);

     setEditTrainingForm({
   type:activity.type,
   durationMinutes:String(activity.durationMinutes),
   category:activity.category||''
 });

    goto('editTraining');
  }}>
    Redigera träning →
  </TextButton>
</Card>
        )
  }

  <Card>
  <Eyebrow>Rundhistorik</Eyebrow>
  <p>
    Se dina sparade rundor, resultat och speltid
    på ett ställe under Utveckling.
  </p>
  <TextButton onClick={()=>goto('progress')}>
    Visa rundhistorik →
  </TextButton>
</Card>
  
  <Primary onClick={()=>goto('logTraining')}>
    Registrera träning
  </Primary>
</Page>}

  {screen==='logTraining'&&<Page>
  <button className="back" onClick={()=>goto('training')}>
    <ChevronLeft/> Training
  </button>

  <Eyebrow>Träning</Eyebrow>
  <h1>Registrera träning.</h1>
  <p>
    Registrera träningen du gör mellan rundorna.
  </p>
   

  <Label>Träningstyp</Label>

  {['range','putting','chipping','simulator','gym','lesson'].map(type=>
    <Choice
      key={type}
      on={trainingForm.type===type}
      onClick={()=>setTrainingForm({
        ...trainingForm,
        type
      })}
    >
      {type}
    </Choice>
  )}

   <Label>Kategori</Label>

{['driver','woods','irons','wedges','short game','putting'].map(category=>
  <Choice
    key={category}
    on={trainingForm.category===category}
    onClick={()=>setTrainingForm({
      ...trainingForm,
      category
    })}
  >
    {category}
  </Choice>
)}
   
  <Label>Tid · minuter</Label>
  <input
    type="number"
    inputMode="numeric"
    min="1"
    value={trainingForm.durationMinutes}
    onChange={e=>setTrainingForm({
      ...trainingForm,
      durationMinutes:e.target.value
    })}
    placeholder="t.ex. 60"
  />

  <Primary onClick={()=>{
    const durationMinutes=Number(trainingForm.durationMinutes);

    if(!trainingForm.type)return;
    if(!Number.isFinite(durationMinutes)||durationMinutes<=0)return;

 addTrainingActivity({
    type:trainingForm.type,
    durationMinutes,
    category:trainingForm.category||null
 });

    setTrainingForm({
      type:'',
      durationMinutes:'',
      category:'',
      clubIds:[]
    });

    goto('training');
  }}>
    Spara träning
  </Primary>
</Page>}

  {screen==='editTraining'&&<Page>
  <button className="back" onClick={()=>goto('training')}>
    <ChevronLeft/> Training
  </button>

  <Eyebrow>Träning</Eyebrow>
  <h1>Redigera träning.</h1>

  <Label>Träningstyp</Label>

  {['range','putting','chipping','simulator','gym','lesson'].map(type=>
    <Choice
      key={type}
      on={editTrainingForm.type===type}
      onClick={()=>setEditTrainingForm({
        ...editTrainingForm,
        type
      })}
    >
      {type}
    </Choice>
  )}

   <Label>Kategori</Label>

{['driver','woods','irons','wedges','short game','putting'].map(category=>
  <Choice
    key={category}
    on={editTrainingForm.category===category}
    onClick={()=>setEditTrainingForm({
      ...editTrainingForm,
      category
    })}
  >
    {category}
  </Choice>
)}
   
  <Label>Tid · minuter</Label>
  <input
    type="number"
    inputMode="numeric"
    min="1"
    value={editTrainingForm.durationMinutes}
    onChange={e=>setEditTrainingForm({
      ...editTrainingForm,
      durationMinutes:e.target.value
    })}
  />

  <Primary onClick={()=>{
    const durationMinutes=Number(editTrainingForm.durationMinutes);

    if(!selectedTrainingId)return;
    if(!editTrainingForm.type)return;
    if(!Number.isFinite(durationMinutes)||durationMinutes<=0)return;

    editTrainingActivity(selectedTrainingId,{
  type:editTrainingForm.type,
  durationMinutes,
  category:editTrainingForm.category||null
});

    setSelectedTrainingId(null);
    goto('training');
  }}>
    Spara ändringar
  </Primary>
   
  <Secondary onClick={()=>{
  if(!selectedTrainingId)return;

  removeTrainingActivity(selectedTrainingId);
  setSelectedTrainingId(null);
  goto('training');
}}>
  Ta bort träning
</Secondary>
  </Page>}
  
 {screen==='bag'&&<Page>
  <button className="back" onClick={()=>goto('home')}>
    <ChevronLeft/> Home
  </button>

  <Eyebrow>Min bag</Eyebrow>
  <h1>Din utrustning.</h1>
  <p>
    Håll koll på klubborna du använder.
    Historiken finns kvar när du ändrar din bag.
  </p>

  {equipment.clubs.filter(club=>club.status==='active').length===0
    ? <Notice>Inga klubbor tillagda ännu.</Notice>
    : equipment.clubs
        .filter(club=>club.status==='active')
        .map(club=>
          <Card key={club.id}>
  <b>{club.label}</b>
  <p>
    {club.type}
    {club.loft!=null ? ` · ${club.loft}°` : ''}
  </p>

  <TextButton onClick={()=>{
    setSelectedClubId(club.id);

    setEditClubForm({
      type:club.type,
      label:club.label,
      loft:club.loft==null ? '' : String(club.loft)
    });

    goto('editClub');
  }}>
    Hantera klubba →
  </TextButton>
</Card>
        )
  }

  <Primary onClick={()=>goto('addClub')}>
    Lägg till klubba
  </Primary>
</Page>}
  {screen==='addClub'&&<Page>
  <button className="back" onClick={()=>goto('bag')}>
    <ChevronLeft/> Min bag
  </button>

  <Eyebrow>Min bag</Eyebrow>
  <h1>Lägg till en klubba.</h1>
  <p>
    Lägg till utrustningen du spelar med.
    Du kan uppdatera den senare utan att förlora historiken.
  </p>

  <Label>Klubbtyp</Label>
  <input
    value={clubForm.type}
    onChange={e=>setClubForm({
      ...clubForm,
      type:e.target.value
    })}
    placeholder="t.ex. Driver"
  />

  <Label>Klubbnamn</Label>
  <input
    value={clubForm.label}
    onChange={e=>setClubForm({
      ...clubForm,
      label:e.target.value
    })}
    placeholder="t.ex. Driver"
  />

  <Label>Loft · valfritt</Label>
  <input
    type="number"
    inputMode="decimal"
    step="0.1"
    value={clubForm.loft}
    onChange={e=>setClubForm({
      ...clubForm,
      loft:e.target.value
    })}
    placeholder="t.ex. 10.5"
  />

  <Primary onClick={()=>{
    const type=clubForm.type.trim();
    const label=clubForm.label.trim();

    if(!type||!label)return;

    const loft=clubForm.loft.trim()===''
      ? null
      : Number(clubForm.loft);

    if(loft!==null&&!Number.isFinite(loft))return;

    addClub({
      type,
      label,
      loft
    });

    setClubForm({
      type:'',
      label:'',
      loft:''
    });

    goto('bag');
  }}>
    Spara klubba
  </Primary>
</Page>}
  
  {screen==='editClub'&&selectedClubId&&<Page>
  <button className="back" onClick={()=>goto('bag')}>
    <ChevronLeft/> Min bag
  </button>

  <Eyebrow>Min bag</Eyebrow>
  <h1>Hantera klubba.</h1>
  <p>
    Uppdatera klubbans uppgifter utan att ändra dess identitet
    eller förlora historiken.
  </p>

  <Label>Klubbtyp</Label>
  <input
    value={editClubForm.type}
    onChange={e=>setEditClubForm({
      ...editClubForm,
      type:e.target.value
    })}
  />

  <Label>Klubbnamn</Label>
  <input
    value={editClubForm.label}
    onChange={e=>setEditClubForm({
      ...editClubForm,
      label:e.target.value
    })}
  />

  <Label>Loft · valfritt</Label>
  <input
    type="number"
    inputMode="decimal"
    step="0.1"
    value={editClubForm.loft}
    onChange={e=>setEditClubForm({
      ...editClubForm,
      loft:e.target.value
    })}
  />

  <Primary onClick={()=>{
    const type=editClubForm.type.trim();
    const label=editClubForm.label.trim();

    if(!type||!label)return;

    const loft=editClubForm.loft.trim()===''
      ? null
      : Number(editClubForm.loft);

    if(loft!==null&&!Number.isFinite(loft))return;

    editClub(selectedClubId,{
      type,
      label,
      loft
    });

    setSelectedClubId(null);
    goto('bag');
  }}>
    Spara ändringar
  </Primary>
  <Secondary onClick={()=>{
  setReplaceClubForm({
    type:editClubForm.type,
    label:'',
    loft:''
  });

  goto('replaceClub');
}}>
  Byt ut klubba
</Secondary>
  <Secondary onClick={()=>{
    removeClub(selectedClubId);
    setSelectedClubId(null);
    goto('bag');
  }}>
    Arkivera klubba
  </Secondary>
</Page>}{screen==='replaceClub'&&selectedClubId&&<Page>
  <button className="back" onClick={()=>goto('editClub')}>
    <ChevronLeft/> Manage club
  </button>

  <Eyebrow>Min bag</Eyebrow>
  <h1>Byt ut klubba.</h1>
  <p>
    Din nuvarande klubba arkiveras och sparas i historiken.
    Ersättaren registreras som en ny klubba.
  </p>

  <Label>Klubbtyp</Label>
  <input
    value={replaceClubForm.type}
    onChange={e=>setReplaceClubForm({
      ...replaceClubForm,
      type:e.target.value
    })}
  />

  <Label>Klubbnamn</Label>
  <input
    value={replaceClubForm.label}
    onChange={e=>setReplaceClubForm({
      ...replaceClubForm,
      label:e.target.value
    })}
    placeholder="t.ex. Ping G430"
  />

  <Label>Loft · valfritt</Label>
  <input
    type="number"
    inputMode="decimal"
    step="0.1"
    value={replaceClubForm.loft}
    onChange={e=>setReplaceClubForm({
      ...replaceClubForm,
      loft:e.target.value
    })}
    placeholder="t.ex. 10.5"
  />

  <Primary onClick={()=>{
    const type=replaceClubForm.type.trim();
    const label=replaceClubForm.label.trim();

    if(!type||!label)return;

    const loft=replaceClubForm.loft.trim()===''
      ? null
      : Number(replaceClubForm.loft);

    if(loft!==null&&!Number.isFinite(loft))return;

    replaceBagClub(selectedClubId,{
      type,
      label,
      loft
    });

    setSelectedClubId(null);

    setReplaceClubForm({
      type:'',
      label:'',
      loft:''
    });

    goto('bag');
  }}>
    Byt ut klubba
  </Primary>
</Page>}
 {screen==='course'&&<Page><Eyebrow>Runda</Eyebrow><h1>Var spelade du?</h1>{courses.map(c=><Card key={c.id} className="courseCard"><button className="coursePick" onClick={()=>{setCourse(c);setHoleCount(c.holes);goto('setup')}}><div><b>{c.name}</b><small>{c.tee} • {c.holes} hål</small></div><span>→</span></button></Card>)}<Card><b>Saknas banan?</b><p>Skapa en egen bana utan extern tjänst.</p><Secondary onClick={()=>goto('create')}>Skapa bana</Secondary></Card></Page>}
 {screen==='create'&&<Page><button className="back" onClick={()=>goto('course')}><ChevronLeft/> Banor</button><Eyebrow>Egen bana</Eyebrow><h1>Skapa bana</h1><Label>Banans namn</Label><input value={newCourse.name} onChange={e=>setNewCourse({...newCourse,name:e.target.value})} placeholder="t.ex. Hulta Golfklubb"/><Label>Tee</Label><input value={newCourse.tee} onChange={e=>setNewCourse({...newCourse,tee:e.target.value})}/><Label>Runda</Label><div className="grid2"><Choice on={newCourse.holes===18} onClick={()=>setNewCourse({...newCourse,holes:18})}>18 hål</Choice><Choice on={newCourse.holes===9} onClick={()=>setNewCourse({...newCourse,holes:9,pars:newCourse.pars.split(',').slice(0,9).join(',')})}>9 hål</Choice></div><Label>Parföljd</Label><textarea value={newCourse.pars} onChange={e=>setNewCourse({...newCourse,pars:e.target.value})}/><small>Ange parvärden separerade med kommatecken. Rating, slope och avstånd är valfria.</small><Primary onClick={addCourse}>Spara egen bana</Primary></Page>}
 {screen==='setup'&&<Page><Eyebrow>Rundinställningar</Eyebrow><h1>{course.name}</h1><Card><Label>Tee</Label><Choice on>{course.tee}</Choice><Label>Runda</Label><div className="grid2"><Choice on={holeCount===18} onClick={()=>course.holes>=18&&setHoleCount(18)}>18 hål</Choice><Choice on={holeCount===9} onClick={()=>setHoleCount(9)}>9 hål</Choice></div><Label>Läge</Label><div className="grid2"><Choice on={mode==='Standard'} onClick={()=>setMode('Standard')}>Standard</Choice><Choice on={mode==='Practice'} onClick={()=>setMode('Practice')}>Träning</Choice></div></Card><Primary onClick={startRound}>Starta {holeCount}-hålsrunda</Primary></Page>}
 {screen==='hole'&&cur&&<Page><div className="between"><div><Eyebrow>Hål {hole} · Par {cur.par}</Eyebrow><h1>Registrera ditt hål.</h1></div><button className="bare" onClick={()=>goto('home')}>Spara och avsluta</button></div><div className="roundProgress"><b>{round.filter(completeHole).length}/{round.length}</b><span>klara</span></div><Secondary onClick={toggleRoundPause}>
 {roundDraft?.pausedAt?'Fortsätt rundan':'Pausa rundan'}
 </Secondary><div className="holes">{round.map(x=><button key={x.hole} className={`${x.hole===hole?'current':''} ${completeHole(x)?'done':''}`} onClick={()=>setHole(x.hole)}>{x.hole}</button>)}</div><Label>Bruttoscore</Label><Stepper v={cur.score} set={v=>touch('score',v)}/><Label>Puttar</Label><Stepper v={cur.putts} set={v=>touch('putts',v)}/><Label>GIR</Label><div className="grid2"><Choice on={cur.gir===true} onClick={()=>touch('gir',true)}>Ja</Choice><Choice on={cur.gir===false} onClick={()=>touch('gir',false)}>Nej</Choice></div>{cur.par!==3&&<><Label>Utslag</Label><div className="chips">{tees.map(x=><Choice key={x} on={cur.tee===x} onClick={()=>touch('tee',x)}>{{Fairway:'Fairway',Left:'Vänster',Right:'Höger',Long:'Lång',Short:'Kort',Penalty:'Plikt'}[x]||x}</Choice>)}</div></>}<Label>Pliktslag</Label><div className="grid3">{[0,1,2].map(x=><Choice key={x} on={cur.penalty===x&&cur.touched} onClick={()=>touch('penalty',x)}>{x}</Choice>)}</div><div className="actions"><Secondary onClick={demo}>Fyll i demorunda</Secondary><Primary onClick={()=>hole<round.length?setHole(h=>h+1):goto('review')}>{hole===round.length?'Granska rundan':'Nästa hål'}</Primary></div></Page>}
 {screen==='review'&&<Page><Eyebrow>Granska rundan</Eyebrow><h1>{m.n===round.length?'Redo att spara.':'Rundan behöver kompletteras.'}</h1><Card><Stat a="Färdiga" b={`${m.n}/${round.length}`}/><Stat a="Score" b={m.n===round.length?m.score:'—'}/><Stat a="Putts" b={m.n===round.length?m.putts:'—'}/><Stat a="Pliktslag" b={m.n===round.length?m.penalties:'—'}/></Card>{m.n<round.length?<><Notice>Fyll i alla obligatoriska fält innan analysen.</Notice><Secondary onClick={()=>{const i=round.findIndex(x=>!completeHole(x));setHole(i+1);goto('hole')}}>Komplettera saknade hål</Secondary></>:<Primary onClick={saveRound}>Spara rundan</Primary>}</Page>}
 {screen==='saved'&&<Page><Notice ok>Rundan har sparats på den här enheten.</Notice><Eyebrow>Coach</Eyebrow><h1>{offline?'Analysen väntar.':'Din sammanfattning är klar.'}</h1><p>Rundan finns i historiken och ska finnas kvar när du uppdaterar sidan i samma webbläsare.</p>{offline?<Primary onClick={()=>goto('home')}>Till startsidan</Primary>:<Primary onClick={()=>goto('recap')}>Visa sammanfattning</Primary>}<Secondary onClick={()=>setOffline(x=>!x)}>{offline?'Återställ anslutning':'Simulera offline'}</Secondary></Page>}
 {screen==='recap'&&<Page><Eyebrow>Rundsammanfattning · {recapMetrics?.score??'—'}</Eyebrow><h1>{recapAnalysis.headline}</h1><div className="scoreStrip"><div><small>SCORE</small><b>{recapMetrics?.score??'—'}</b></div><div><small>PUTTAR</small><b>{recapMetrics?.putts??'—'}</b></div><div><small>GIR</small><b>{recapMetrics?.girPct!=null?`${recapMetrics.girPct}%`:'—'}</b></div><div><small>PLIKT</small><b>{recapMetrics?.penalties??'—'}</b></div></div><Card><b>Vad påverkade resultatet?</b><p>{recapAnalysis.reason}</p><p><strong>Positivt:</strong> {recapAnalysis.positive}</p><TextButton onClick={()=>goto('evidence')}>Visa underlaget →</TextButton></Card><Card className="focusCard"><Eyebrow>One Focus</Eyebrow><h2>{recapAnalysis.label}</h2><p>{recapAnalysis.practice}</p>{recapRound?.eligibility?.coach!==false?<Primary onClick={()=>goto('focus')}>Öppna Ett fokus</Primary>:<Primary onClick={()=>goto('home')}>Till startsidan</Primary>}</Card></Page>}
 {screen==='roundDetail'&&selectedRound&&<Page><button className="back" onClick={()=>goto('progress')}><ChevronLeft/> Historik</button><Eyebrow>Rundhistorik</Eyebrow><h1>{selectedRound.course}</h1><p>{new Date(selectedRound.date).toLocaleDateString('sv-SE')} · {selectedRound.round.length} hål · {selectedRound.tee}</p><Card><Stat
  a="Speltid"
  b={formatRoundPlayingTime(selectedRound)}
/><Stat a="Score" b={selectedRound.metrics.score}/><Stat a="Putts" b={selectedRound.metrics.putts}/><Stat a="GIR" b={`${selectedRound.metrics.girPct}%`}/><Stat a="Pliktslag" b={selectedRound.metrics.penalties}/></Card><Eyebrow>Hål för hål</Eyebrow>{selectedRound.round.map(h=><Card key={h.hole} className="roundHistory"><div><b>Hål {h.hole} · Par {h.par}</b><small>{h.par!==3?`Utslag: ${{Fairway:'Fairway',Left:'Vänster',Right:'Höger',Long:'Lång',Short:'Kort',Penalty:'Plikt'}[h.tee]||h.tee||'—'} · `:''}GIR: {h.gir?'Ja':'Nej'}</small></div><strong>{h.score}</strong></Card>)}</Page>}
 {screen==='evidence'&&<Page><Eyebrow>Varför detta fokus?</Eyebrow><h1>Fakta, inte gissningar.</h1>{recapMetrics?<Card><Stat a="Pliktslag" b={recapMetrics.penalties}/><Stat a="Missar åt höger" b={recapMetrics.right}/><Stat a="Treputtar" b={recapMetrics.threePutts}/><Stat a="GIR" b={`${recapMetrics.girPct}%`}/></Card>:<Notice>Spela klart en runda för att få underlag.</Notice>}<Card><b>Coachens tolkning</b><p>{recapAnalysis.reason}</p><small>Tillförlitlighet: {recapAnalysis.confidence}. Prototypen använder fasta regler så att slutsatserna kan följas upp.</small></Card>{recapRound?.eligibility?.coach!==false?<Primary onClick={()=>goto('focus')}>Fortsätt till dagens fokus</Primary>:<Primary onClick={()=>goto('home')}>Till startsidan</Primary>}</Page>}
 {screen==='focus'&&<Page><Eyebrow>One Focus</Eyebrow><h1>{a.label}</h1><p>{a.reason}</p><Card><b>Träning</b><p>{a.practice}</p><hr/><b>Kriterium för framgång</b><p>{a.criterion}</p></Card><Card><b>Mål för nästa runda</b><p>{a.target}</p></Card><Primary onClick={()=>goto('home')}>Använd detta fokus</Primary></Page>}
 {screen==='coach'&&<Page><Eyebrow>AI Coach</Eyebrow><h1>Ett beslut som hjälper dig framåt.</h1><Card className="focusCard"><Sparkles/><h2>{a.label}</h2><p>{a.reason}</p><Primary onClick={()=>goto('focus')}>Öppna fokus</Primary></Card>{lastRound&&<Card><b>Senaste rundan</b><p>{lm.score} · {lastRound.course}</p><TextButton onClick={()=>{setSelectedRound(lastRound);goto('recap')}}>Öppna sammanfattning →</TextButton></Card>}<Notice>Prototypens coach bygger på fasta regler: olika rundor kan ge olika rekommendationer.</Notice></Page>}
 {screen==='progress'&&<Page><Eyebrow>Progress</Eyebrow><h1>Ditt spel i siffror.</h1><Card className="progressCard"><Activity/><div><small>AKTUELLT FOKUS</small><h2>{a.label}</h2><p>{a.confidence} tillförlitlighet baserat på tillgängliga rundor.</p></div></Card><StatGrid/><div className="windowTitle"><Eyebrow>Senaste rundorna</Eyebrow><p>Personliga trender visas när du har fler rundor.</p></div><div className="dashGrid">{[5,10,20].map(n=>{const w=eligibleRounds.length>=n?windowMetrics(eligibleRounds,n):null;return <Card className="mini" key={n}><small>SENASTE {n}</small><strong>{w?`${show(w.scoreAvg)} i snitt`:'—'}</strong><span>{w?`${show(w.girPct,'%')} GIR`:`Behöver ${n-eligibleRounds.length} till`}</span></Card>})}</div>{rounds.length>0&&<><div className="windowTitle"><Eyebrow>Rundhistorik</Eyebrow></div>{[...rounds].reverse().map(r=><Card className="roundHistory" key={r.id||r.date} onClick={()=>{setSelectedRound(r);goto('roundDetail')}}><div><b>{r.course}</b><small>
  {new Date(r.date).toLocaleDateString('sv-SE')}
  {' · '}
  {r.round.length} hål
  {' · '}
  {formatRoundPlayingTime(r)}
</small></div><strong>{r.metrics.score}</strong></Card>)}</>}<Notice>Up & Down och Sand Save visas först när rundregistreringen kan samla in rätt underlag. Saknade värden visas inte som 0 %.</Notice></Page>}
 </main>{!['welcome','journey','handicap'].includes(screen)&&<BottomNav screen={screen} goto={goto}/>}</div>
}


export default function App() {
  const [startup] = useState(readStartupData);
  const [session, setSession] = useState(null);

  const accountStartup = session
    ? readStartupData(session.user.id)
    : null;


useEffect(() => {
  supabase.auth.getSession().then(({ data, error }) => {
    if (!error) setSession(data.session);
  });

  const { data: listener } = supabase.auth.onAuthStateChange(
    (_event, nextSession) => {
      setSession(nextSession);
    }
  );

  return () => {
    listener.subscription.unsubscribe();
  };
}, []);
  
    if (startup.storageError || accountStartup?.storageError) {
    return <StorageErrorScreen />;
  }

  return session ? (
  <>
    <button
      type="button"
      onClick={async () => {
        const { error } = await signOut();    
        
      }}
    >
      Logga ut
    </button>
    
<button
  type="button"
  onClick={async () => {
    try {
      const { data, error } = await getMyProfile();

      if (error) {
        alert('Profiltest misslyckades: ' + error.message);
        return;
      }

      alert(
        'Profil hämtad från Supabase!\n' +
        'Användar-ID: ' + data.id
      );
    } catch (error) {
      alert('Profiltest misslyckades: ' + error.message);
    }
  }}
>
  Testa min profil
  </button>

<button
  type="button"
  onClick={async () => {
    try {
      const result = await testProfileIsolation();
      alert(
        (result.success ? 'TEST OK: ' : 'TEST FEL: ') +
        result.message
      );
    } catch (error) {
      alert('TEST FEL: ' + error.message);
    }
  }}
>
  Testa profilsäkerhet
</button>

<button
  type="button"
  onClick={async () => {
    try {
      const marker = 'cloud-test-' + crypto.randomUUID();

      const { data: saved, error: saveError } =
        await saveMyRound({
          courseName: 'Supabase Testbana',
          playedAt: new Date().toISOString(),
          testMarker: marker
        });

      if (saveError) throw saveError;

      const { data: rounds, error: readError } =
        await getMyRounds();

      if (readError) throw readError;

      const found = rounds.some(
        round =>
          round.id === saved.id &&
          round.round_data?.testMarker === marker
      );

      alert(
        found
          ? 'TEST OK: Rundan sparades och lästes tillbaka!'
          : 'TEST FEL: Rundan kunde inte hittas.'
      );
    } catch (error) {
      alert('TEST FEL: ' + error.message);
    }
  }}
>
  Testa molnlagring
</button>

    
<AppContent
  key={session.user.id}
  stored={readStartupData(session.user.id).stored}
  userId={session.user.id}
/>

  </>
) : (
  <AuthScreen onAuthenticated={setSession} />
);

}
