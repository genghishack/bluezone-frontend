import React, {Component} from 'react';
import {connect} from "react-redux";
import {getCongressionalDistrictJsonData} from '../../utils/DataHelpers';
import darkChevron from "../../assets/chevron.svg"
import lightChevron from "../../assets/light_chevron.svg"
import {setCurrentEntity, menuTreeClick} from '../../redux/actions/entities';

interface IEntityItemProps {
  name: string;
  id: string;
  type: string | null;
  filterMap?: Function;
  handleSelection: Function;
  stateAbbr?: string;
  currentId?: string;
  districts?: any;
  dispatch: Function;
}

class EntityItem extends Component<IEntityItemProps, {}> {
  state = {
    children: [],
    childrenType: null,
    open: false
  };

  handleChevronClick = () => {
    const {districts, id} = this.props;
    this.setState({open: !this.state.open});
    if (this.props.type === 'states') {
      const USStateDistricts = getCongressionalDistrictJsonData(districts, id);
      console.log('USStateDistrictData: ', USStateDistricts);
      this.setState({
        children: USStateDistricts.data,
        childrenType: 'districts'
      });
    }
  }

  entityClick = () => {
    // console.log('entity clicked', this.props);
    if (this.props.type === 'states') {
      this.props.handleSelection(this.props.id);
    } else {
      this.props.handleSelection(this.props.stateAbbr, this.props.id);
    }
    this.props.dispatch(menuTreeClick(false));
    this.props.dispatch(setCurrentEntity({id: this.props.id || this.props.name, type: this.props.type}));
  }

  render() {
    const openClass = this.state.open ? "open" : "closed";
    const children = this.state.children.map((entity: any, index) => {
      return (
        <EntityItemExport
          key={`entity${index}`}
          id={entity.attributes.value}
          name={entity.attributes.label}
          type={this.state.childrenType}
          handleSelection={this.props.handleSelection}
          stateAbbr={this.props.id}
        />
      );
    });
    const hideChevron = this.props.type === "districts" ? "hidden" : "";
    const entityId = this.props.id || this.props.name;
    const activeClass = this.props.currentId === entityId ? "active" : "";
    const chevron = this.props.currentId === entityId ? lightChevron : darkChevron;
    return (
      <div className="entityItem">
        <div className={`entityNameAndChevron ${activeClass}`}>
          <div className="entityName" onClick={this.entityClick}>
            <span>{this.props.name}</span>
          </div>
          <div className={`chevronContainer ${hideChevron}`}>
            <img
              className={`entityChevron ${openClass}`}
              src={chevron}
              alt="chevron"
              onClick={this.handleChevronClick}
            />
          </div>
        </div>
        <div className={`entityChildren ${openClass}`}>
          {children}
        </div>
      </div>
    );
  };
}

function mapStateToProps(state) {
  return {
    currentId: state.entities.currentEntity,
    districts: state.states.districtsByState,
  };
}

const EntityItemExport = connect(mapStateToProps)(EntityItem);

export default EntityItemExport;