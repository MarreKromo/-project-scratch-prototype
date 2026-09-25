export const journeys=['Break 100','Sub-90','Sub-80','Project Single','Project Scratch'];
export const defaultCourse={id:'hulta-yellow',name:'Hulta Golfklubb',tee:'Yellow',holes:18,pars:[4,4,3,5,4,4,3,5,4,4,4,3,5,4,4,3,5,4]};
export const makeRound=(course=defaultCourse,holeCount=18)=>course.pars.slice(0,holeCount).map((par,i)=>({hole:i+1,par,score:par,putts:2,gir:null,tee:par===3?null:null,penalty:0,touched:false}));
