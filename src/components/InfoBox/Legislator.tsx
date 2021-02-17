import React from 'react';
import moment from 'moment';

import './Legislator.scss';

interface ILegislatorProps {
  data: any;
}

type TLegislator = {
  attributes: {
    fullName: any;
    DOB: any; 
    partyAbbrev: any; 
    links: any; 
    imgTag: any;
  }; 
  name: { 
    official_full: any; 
  }; 
  bio: { 
    birthday: moment.MomentInput; 
  }; 
  terms: string | any[]; 
  id: { 
    wikipedia: string; 
  }; 
  bioguide_id: string;
}

const Legislator = (props: ILegislatorProps) => {
  const { data } = props;

  const getImg = (id: string, fullName: string | undefined) => {
    const src = 'https://theunitedstates.io/images/congress/225x275/' + id + '.jpg';
    return <img src={src} alt={fullName} />;
  };

  const getLink = (url: string | undefined, text: {} | null | undefined) => {
    return (
      <a href={url} target="legislator">
        { text}
        <i className="fas fa-external-link-alt"></i>
      </a>
    )
  };

  const getModel = (legislator: TLegislator) => {

    // console.log('legislator: ', legislator);

    legislator.attributes = {
      fullName: '',
      DOB: '',
      partyAbbrev: '',
      imgTag: '',
      links: {
        wikipedia: '',
        bioguide: '',
        website: ''
      }
    };

    if (legislator.name) {
      legislator.attributes.fullName = legislator.name.official_full;
    }

    if (legislator.bio) {
      legislator.attributes.DOB = 'DOB: ' + moment(legislator.bio.birthday).format('MMMM Do, YYYY');
    }

    if (legislator.terms) {
      const currentTerm = legislator.terms[legislator.terms.length - 1];
      legislator.attributes.partyAbbrev = '(' + currentTerm.party[0] + ')';

      if (currentTerm.url) {
        legislator.attributes.links.website = getLink(currentTerm.url, 'Official Website');
      }
    }

    if (legislator.id) {
      legislator.attributes.imgTag = getImg(legislator.bioguide_id, legislator.attributes.fullName);

      const bioguideUrl = 'http://bioguide.congress.gov/scripts/biodisplay.pl?index=' + legislator.bioguide_id;
      legislator.attributes.links.bioguide = getLink(bioguideUrl, 'Official Bio');

      const wikipediaUrl = 'http://www.wikipedia.org/wiki/' + legislator.id.wikipedia;
      legislator.attributes.links.wikipedia = getLink(wikipediaUrl, 'Wikipedia');
    }

    return legislator;
  };

  if (!data) {
    return <div>No info available</div>;
  }

  const legislator = getModel(data);

  const l = legislator.attributes;

  return (
    <div
      key={l.fullName}
      className="Legislator"
    >
      <div className="photo">
        {l.imgTag}
      </div>
      <div className="column">
        <div className="line heading">
          <div className="name">
            {l.fullName}
          </div>
          <div className="party">
            {l.partyAbbrev}
          </div>
        </div>
        <div className="links">
          <div className="line bioguide">
            {l.links.bioguide}
          </div>
          <div className="line website">
            {l.links.website}
          </div>
          <div className="line wikipedia">
            {l.links.wikipedia}
          </div>
        </div>
        <div className="line">
          <div className="dob">
            {l.DOB}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Legislator;
