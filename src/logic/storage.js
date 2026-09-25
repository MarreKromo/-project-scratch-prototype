const K='project-scratch-v04';

const emptyProfile=()=>({
  selfReportedHandicap:null,
  targetHandicap:null,
  handicapHistory:[]
});

export const load=()=>{
  try{
    return JSON.parse(localStorage.getItem(K)||'{}')
  }catch{
    return {}
  }
};

export const save=x=>
  localStorage.setItem(K,JSON.stringify(x));

export const normalize=x=>({
  ...x,
  profile:{
    ...emptyProfile(),
    ...(x?.profile||{}),
    handicapHistory:Array.isArray(x?.profile?.handicapHistory)
      ? x.profile.handicapHistory
      : []
  },
  rounds:Array.isArray(x?.rounds) ? x.rounds : []
});

export const updateHandicap=(profile,value)=>{
  const handicap=Number(value);

  if(!Number.isFinite(handicap))
    return profile;

  if(profile?.selfReportedHandicap===handicap)
    return profile;

  return {
    ...emptyProfile(),
    ...profile,
    selfReportedHandicap:handicap,
    handicapHistory:[
      ...(profile?.handicapHistory||[]),
      {
        id:`hcp-${Date.now()}`,
        value:handicap,
        recordedAt:new Date().toISOString(),
        source:'user'
      }
    ]
  };
};
