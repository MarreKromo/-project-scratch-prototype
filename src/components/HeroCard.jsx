import React from 'react';
import {ArrowUpRight,Flag} from 'lucide-react';

export default function HeroCard({journey,lastScore}){
  return (
    <div className="heroCard">
      <div className="heroGlow"/>

      <div className="heroTop">
        <span className="pill">
          <Flag size={13}/>
          {journey}
        </span>
        <ArrowUpRight size={20}/>
      </div>

      <div className="heroNumbers">
        <div>
          <small>CURRENT</small>
          <strong>—</strong>
        </div>

        <span>→</span>

        <div>
          <small>TARGET</small>
          <strong>—</strong>
        </div>
      </div>

      <div className="heroFoot">
        <span>Journey progress</span>
        <b>
          {lastScore
            ? `Last round ${lastScore}`
            : 'Complete your first round'}
        </b>
      </div>
    </div>
  );
}
