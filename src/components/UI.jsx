import React from 'react'; import {ChevronRight,Check} from 'lucide-react';
export const Page=({children,className=''})=><section className={'page '+className}>{children}</section>;
export const Eyebrow=({children})=><div className="eyebrow">{children}</div>;
export const Card=({children,className='',onClick})=><div className={'card '+className} onClick={onClick}>{children}</div>;
export const Primary=({children,onClick,disabled=false})=><button disabled={disabled} className="primary" onClick={onClick}>{children}<ChevronRight size={17}/></button>;
export const Secondary=({children,onClick})=><button className="secondary" onClick={onClick}>{children}</button>;
export const TextButton=({children,onClick})=><button className="textBtn" onClick={onClick}>{children}</button>;
export const Choice=({children,on=false,onClick})=><button className={'choice '+(on?'selected':'')} onClick={onClick}>{children}</button>;
export const Label=({children})=><div className="label">{children}</div>;
export const Stat=({a,b})=><div className="stat"><span>{a}</span><b>{b}</b></div>;
export const Notice=({children,ok=false})=><div className={'notice '+(ok?'ok':'')}>{ok&&<Check size={17}/>} {children}</div>;
export const Bar=({n})=><div className="bar"><i style={{width:`${Math.max(0,Math.min(100,n))}%`}}/></div>;
export function Stepper({v,set}){return <div className="step"><button onClick={()=>set(Math.max(0,v-1))}>−</button><b>{v}</b><button onClick={()=>set(v+1)}>+</button></div>}
