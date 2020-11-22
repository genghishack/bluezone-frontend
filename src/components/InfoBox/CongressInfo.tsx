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
    <div className="congress-info">
      <div className="district-name">
        {districtTitle}
      </div>
      <section id="rep-section">
        <div className="title">Representative</div>
        <Legislator
          data={rep}
        />
      </section>
      <section id="sen-section">
        <div className="title">Senators</div>
        {sens.length ?
          sens.map((sen: any) => (
            <Legislator
              key={sen.id.bioguide}
              data={sen}
            />
          )
          ) : (
            <div className="no-senators">
              Non-State U.S. Territories and the District of Columbia have no senators.
            </div>
          )}
      </section>
    </div>
  )
}

export default CongressInfo;
