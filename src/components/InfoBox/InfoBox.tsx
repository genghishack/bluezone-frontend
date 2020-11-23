import React from 'react';

import "./InfoBox.scss";

import closeSVG from "../../assets/close_icon.png"
import { connect } from "react-redux";
import CongressInfo from './CongressInfo';

interface IInfoBoxProps {
  district: any;
  slide?: boolean;
  expanded?: boolean;
  setExpanded?: Function;
  legislatorIndex?: any;
}

const InfoBox = (props: IInfoBoxProps) => {
  const { district, slide, expanded, setExpanded, legislatorIndex } = props;

  const handleCloseClick = (e) => {
    if (setExpanded) {
      setExpanded(false);
    }
  }

  const expandedClass = expanded ? "expanded" : "";
  const districtTitle = (district.properties) ? district.properties.title_long : '';


  const renderCongressInfo = () => {
    if (district.properties) {
      const state = district.properties.state;
      const district_num = parseInt(district.properties.number, 10);
      const rep = legislatorIndex[state].rep[district_num];
      const sens = legislatorIndex[state].sen ? Object.values(legislatorIndex[state].sen) : [];
      return (
        <CongressInfo
          districtTitle={districtTitle}
          rep={rep}
          sens={sens}
        />
      );
    } else {
      return (
        <div className="no-info">No Info</div>
      );
    }
  }

  const renderContent = () => (
    <div className="content">
      {renderCongressInfo()}
    </div>
  )

  if (slide) {
    return (
      <div className={`InfoBox slide ${expandedClass}`}>
        <img
          className="closeIcon"
          src={closeSVG}
          alt="close"
          onClick={handleCloseClick}
        ></img>
        {renderContent()}
      </div>
    )
  } else {
    return (
      <div className="InfoBox">
        {renderContent()}
      </div>
    )
  }
};

function mapStateToProps(state) {
  return {
    legislatorIndex: state.legislators.legislatorsByState,
  }
}

export default connect(mapStateToProps)(InfoBox);
