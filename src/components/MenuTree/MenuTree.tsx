import React, {Component} from 'react';
import {connect} from "react-redux";
import {getUSStateJsonData} from '../../utils/DataHelpers';
import EntityItem from '../EntityItem/EntityItem';

interface IMenuTreeProps {
  filterMap: Function;
  handleSelection: Function;
  showMenuTree?: boolean;
  states?: any;
}

export class MenuTree extends Component<IMenuTreeProps, {}> {
  state = {
    USStateOptions: [],
  };

  componentDidMount() {
    this.getUSStateOptions();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.states !== this.props.states) {
      this.getUSStateOptions();
    }
  }

  getUSStateOptions() {
    const {states} = this.props;
    const USStateData = getUSStateJsonData(states);
    // console.log('USStateData: ', USStateData);
    const USStates = USStateData.data.map((USState) => {
      return {
        value: USState.attributes.value,
        label: USState.attributes.label
      }
    });
    this.setState({
      USStateOptions: USStates
    }, () => {
      // console.log(this.state.USStateOptions);
    });
  }

  render() {
    const showMenuTreeClass = this.props.showMenuTree ? "show" : "";
    const {filterMap, handleSelection} = this.props;

    const USStateList = this.state.USStateOptions.map((USState: any, index) => {
      return <EntityItem
        key={`USState${index}`}
        name={USState.label}
        id={USState.value}
        type="states"
        filterMap={filterMap}
        handleSelection={handleSelection}
      />;
    });
    // console.log(USStateList);
    return (
      <div className={`menuTreeWrapper ${showMenuTreeClass}`}>
        <div
          className="focus-on-usa"
          onClick={() => this.props.handleSelection()}
        >Show Entire US
        </div>
        <div>{USStateList}</div>
      </div>
    );
  };
}

function mapStateToProps(state) {
  return {
    showMenuTree: state.entities.showMenuTree,
    states: state.states.states
  };
}

export default connect(mapStateToProps)(MenuTree);