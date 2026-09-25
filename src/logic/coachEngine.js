export function coach(m){
 if(m.n<9) return {key:'insufficient',label:'Build the baseline',headline:'Good data first. Coaching second.',reason:'There is not enough eligible round data yet to make a strong recommendation.',positive:'You are building a usable baseline.',practice:'Log complete, honest hole data.',criterion:'Complete the next eligible round.',target:'Finish the next round with complete data.',confidence:'LOW'};
 const candidates=[
  {key:'tee',cost:m.penalties*3+m.right*1.25+m.left*.8+m.teePenalty*2,label:'Tee-ball survival',headline:'The biggest opportunity is keeping tee shots playable.',reason:`${m.penalties} penalty strokes and ${m.right+m.left+m.teePenalty} severe-direction tee misses created the clearest measured risk.`,practice:'Start-line gate • 2 × 15 drives this week.',criterion:'≥ 12/15 playable starts in two sessions.',target:'≤ 1 tee penalty.',confidence:m.penalties>=2?'HIGH':'MEDIUM'},
  {key:'putting',cost:m.threePutts*3+Math.max(0,m.putts-m.n*1.9),label:'Lag putting control',headline:'Putting is where the round leaked most clearly.',reason:`${m.putts} putts with ${m.threePutts} three-putts created avoidable scoring pressure.`,practice:'Distance ladder • 20 putts from 6–12 m.',criterion:'Finish 16/20 inside a 1 m circle.',target:'0 three-putts.',confidence:m.threePutts>=3?'HIGH':'MEDIUM'},
  {key:'approach',cost:Math.max(0,55-m.girPct)/8,label:'Green-finding',headline:'Approach play is the clearest next scoring lever.',reason:`GIR was ${m.girPct}%. More greens can reduce pressure on both short game and putting.`,practice:'Random approach set • 3 × 10 balls to changing targets.',criterion:'≥ 6/10 solid target-window strikes in the final set.',target:'Hit one more GIR than this round.',confidence:'MEDIUM'}
 ];
 const best=candidates.sort((a,b)=>b.cost-a.cost)[0];
 const positive=m.threePutts===0?'Putting held up: no three-putt spike.':m.penalties===0?'You kept penalty damage off the card.':m.girPct>=50?'Green finding was a positive signal.':'You completed enough data for a useful review.';
 return {...best,positive};
}
