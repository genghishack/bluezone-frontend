import React, {useState} from 'react';
import {connect} from "react-redux";
import {getCongressionalDistrictJsonData} from '../../utils/DataHelpers';
import darkChevron from "../../assets/chevron.svg"
import lightChevron from "../../assets/light_chevron.svg"
import {setCurrentEntity, menuTreeClick} from '../../redux/actions/entities';

interface IEntityItemProps {
  name: string;
  id: string;
  type: string | null;
  handleSelection: Function;
  stateAbbr?: string;
  currentId?: string;
  districts?: any;
  dispatch: Function;
}

const EntityItem = (props: IEntityItemProps) => {
  const { name, id, type, handleSelection, stateAbbr, currentId, districts, dispatch } = props;
  const [children, setChildren] = useState([]);
  const [childrenType, setChildrenType] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleChevronClick = () => {
    setIsOpen(!isOpen);
    if (type === 'states') {
      const USStateDistricts = getCongressionalDistrictJsonData(districts, id);
      console.log('USStateDistrictData: ', USStateDistricts);
      setChildren(USStateDistricts.data);
      setChildrenType('districts');
    }
  }

  const entityClick = () => {
    // console.log('entity clicked', this.props);
    if (type === 'states') {
      handleSelection(id);
    } else {
      handleSelection(stateAbbr, id);
    }
    dispatch(menuTreeClick(false));
    dispatch(setCurrentEntity({id: id || name, type: type}));
  }

  const openClass = isOpen ? "open" : "closed";
  const childEntities = children.map((entity: any, index) => {
    return (
      <EntityItemExport
        key={`entity${index}`}
        id={entity.attributes.value}
        name={entity.attributes.label}
        type={childrenType}
        handleSelection={handleSelection}
        stateAbbr={id}
      />
    );
  });
  const hideChevron = type === "districts" ? "hidden" : "";
  const entityId = id || name;
  const activeClass = currentId === entityId ? "active" : "";
  const chevron = currentId === entityId ? lightChevron : darkChevron;
  
  return (
    <div className="entityItem">
      <div className={`entityNameAndChevron ${activeClass}`}>
        <div className="entityName" onClick={entityClick}>
          <span>{name}</span>
        </div>
        <div className={`chevronContainer ${hideChevron}`}>
          <img
            className={`entityChevron ${openClass}`}
            src={chevron}
            alt="chevron"
            onClick={handleChevronClick}
          />
        </div>
      </div>
      <div className={`entityChildren ${openClass}`}>
        {childEntities}
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    currentId: state.entities.currentEntity,
    districts: state.states.districtsByState,
  };
}

const EntityItemExport = connect(mapStateToProps)(EntityItem);

export default EntityItemExport;