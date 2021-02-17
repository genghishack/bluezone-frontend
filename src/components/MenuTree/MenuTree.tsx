import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getUSStateJsonData} from '../../utils/DataHelpers';
import EntityItem from './EntityItem';

import './MenuTree.scss';

interface IMenuTreeProps {
  handleSelection: Function;
  showMenuTree?: boolean;
  states?: any;
}

const MenuTree = (props: IMenuTreeProps) => {
  const { handleSelection, showMenuTree, states } = props;
  const [USStateOptions, setUSStateOptions] = useState([]);

  useEffect(() => {
    const getUSStateOptions = () => {
      const USStateData = getUSStateJsonData(states);
      // console.log('USStateData: ', USStateData);
      const USStates = USStateData.data.map((USState) => {
        return {
          value: USState.attributes.value,
          label: USState.attributes.label
        }
      });
      setUSStateOptions(USStates)
    }

    getUSStateOptions();
  }, [states]);

  const showMenuTreeClass = showMenuTree ? "show" : "";
  const USStateList = USStateOptions.map((USState: any, index) => {
    return <EntityItem
      key={`USState${index}`}
      name={USState.label}
      id={USState.value}
      type="states"
      handleSelection={handleSelection}
    />;
  });

  return (
    <div className={`menuTreeWrapper ${showMenuTreeClass}`}>
      <div
        className="focus-on-usa"
        onClick={() => handleSelection()}
      >Show Entire US
      </div>
      <div>{USStateList}</div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    showMenuTree: state.entities.showMenuTree,
    states: state.states.states
  };
}

export default connect(mapStateToProps)(MenuTree);