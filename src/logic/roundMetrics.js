export function completeHole(x){
  return x.touched &&
    x.score != null &&
    x.putts != null &&
    x.gir != null &&
    (x.par === 3 || x.tee != null) &&
    x.penalty != null;
}

export function metrics(round){
  const eligible = round.filter(completeHole);
  const n = eligible.length;

  const sum = k =>
    eligible.reduce((a,x)=>a+(Number(x[k])||0),0);

  const tee = eligible.filter(x=>x.par!==3);

  const count = v =>
    tee.filter(x=>x.tee===v).length;

  const score = sum('score');
  const par = eligible.reduce((a,x)=>a+x.par,0);
  const putts = sum('putts');
  const penalties = sum('penalty');

  const gir = eligible.filter(x=>x.gir).length;
  const threePutts = eligible.filter(x=>x.putts>=3).length;

  const birdies =
    eligible.filter(x=>x.score<x.par).length;

  const pars =
    eligible.filter(x=>x.score===x.par).length;

  const bogeys =
    eligible.filter(x=>x.score===x.par+1).length;

  const doublesPlus =
    eligible.filter(x=>x.score>=x.par+2).length;

  return {
    n,
    score,
    par,
    toPar:score-par,
    putts,
    penalties,

    gir,
    girPct:n ? Math.round(gir/n*100) : null,

    threePutts,

    teeN:tee.length,
    fairways:count('Fairway'),
    left:count('Left'),
    right:count('Right'),
    long:count('Long'),
    short:count('Short'),
    teePenalty:count('Penalty'),

    birdies,
    pars,
    bogeys,
    doublesPlus
  };
}

export function historyMetrics(rounds=[]){
  const valid = rounds.filter(r=>r?.metrics?.n);

  const sum = k =>
    valid.reduce(
      (a,r)=>a+(Number(r.metrics[k])||0),
      0
    );

  const holes = sum('n');
  const teeN = sum('teeN');

  const rate = (a,b) =>
    b ? Math.round(a/b*100) : null;

  const avg = k =>
    valid.length
      ? +(sum(k)/valid.length).toFixed(1)
      : null;

  const scoreAvg =
    valid.length
      ? +(sum('score')/valid.length).toFixed(1)
      : null;

  return {
    rounds:valid.length,
    holes,

    scoreAvg,

    bestScore:valid.length
      ? Math.min(...valid.map(r=>r.metrics.score))
      : null,

    girPct:rate(sum('gir'),holes),

    firPct:rate(sum('fairways'),teeN),
    leftPct:rate(sum('left'),teeN),
    rightPct:rate(sum('right'),teeN),

    birdiePct:rate(sum('birdies'),holes),
    parPct:rate(sum('pars'),holes),
    bogeyPct:rate(sum('bogeys'),holes),
    doublePlusPct:rate(sum('doublesPlus'),holes),

    puttsPerRound:avg('putts'),
    threePuttsPerRound:avg('threePutts'),
    penaltiesPerRound:avg('penalties')
  };
}

export const windowMetrics=(rounds,n)=>
  historyMetrics(rounds.slice(-n));
