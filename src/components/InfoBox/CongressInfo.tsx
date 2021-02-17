import React from 'react';
import Legislator from './Legislator';

import './CongressInfo.scss';

interface ICongressInfoProps {
  districtTitle: string;
  rep: any;
  sens: any;
}

const CongressInfo = (props: ICongressInfoProps) => {
  const { districtTitle, rep, sens } = props;
  return (
    <div className="CongressInfo">
      <div className="districtName">
        {districtTitle}
      </div>
      <section id="repSection">
        <div className="title">Representative</div>
        <Legislator
          data={rep}
        />
      </section>
      <section id="senSection">
        <div className="title">Senators</div>
        {sens.length ?
          sens.map((sen: any) => (
            <Legislator
              key={sen.id.bioguide}
              data={sen}
            />
          )) : (
            <div className="noSenators">
              Non-State U.S. Territories and the District of Columbia have no senators.
            </div>
          )}
      </section>
    </div>
  )
}

export default CongressInfo;
