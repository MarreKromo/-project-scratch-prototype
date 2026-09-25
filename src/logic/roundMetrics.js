export function completeHole(x){return x.touched&&x.score!=null&&x.putts!=null&&x.gir!=null&&(x.par===3||x.tee!=null)&&x.penalty!=null}
export function metrics(round){
 const eligible=round.filter(completeHole); const n=eligible.length;
 const sum=k=>eligible.reduce((a,x)=>a+(Number(x[k])||0),0);
 const tee=eligible.filter(x=>x.par!==3); const count=v=>tee.filter(x=>x.tee===v).length;
 const score=sum('score'), par=eligible.reduce((a,x)=>a+x.par,0), putts=sum('putts'), penalties=sum('penalty');
 const gir=eligible.filter(x=>x.gir).length, threePutts=eligible.filter(x=>x.putts>=3).length;
 return {n,score,par,toPar:score-par,putts,penalties,gir,girPct:n?Math.round(gir/n*100):0,threePutts,teeN:tee.length,fairways:count('Fairway'),left:count('Left'),right:count('Right'),long:count('Long'),short:count('Short'),teePenalty:count('Penalty')};
}
