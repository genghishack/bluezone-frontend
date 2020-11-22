import React from 'react';

import "./InfoBox.scss";

import closeSVG from "../../assets/close_icon.png"
import { connect } from "react-redux";
import CongressInfo from './CongressInfo';

interface IInfoBoxProps {
  district: any;
  expanded: boolean;
  closeClick: Function;
  legislatorIndex?: any;
}

const InfoBox = (props: IInfoBoxProps) => {
  const { district, expanded, closeClick, legislatorIndex } = props;

  const handleCloseClick = (e) => {
    console.log(e)
    e.preventDefault()
    closeClick();
  }

  const expandedClass = expanded ? "expanded" : "";
  const districtTitle = (district.properties) ? district.properties.title_long : '';

  if (district.properties) {
    const state = district.properties.state;
    const district_num = parseInt(district.properties.number, 10);
    const rep = legislatorIndex[state].rep[district_num];

    const sens = legislatorIndex[state].sen ? Object.values(legislatorIndex[state].sen) : [];

    // console.log(rep, sens);

    return (
      <div className={`InfoBox ${expandedClass}`}>
        <img
          className="closeIcon"
          src={closeSVG}
          alt="close"
          onClick={handleCloseClick}
        ></img>
        <CongressInfo 
          districtTitle={districtTitle}
          rep={rep}
          sens={sens}
        />
      </div>
    )
  } else {
    return (
      <div className={`info_box_wrapper no-info ${expandedClass}`}>No Info</div>
    )
  }
};

function mapStateToProps(state) {
  return {
    legislatorIndex: state.legislators.legislatorsByState,
  }
}

export default connect(mapStateToProps)(InfoBox);
