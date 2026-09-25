const K='project-scratch-v03';

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
  rounds:Array.isArray(x?.rounds)
    ? x.rounds
    : (x?.lastRound ? [x.lastRound] : [])
});
