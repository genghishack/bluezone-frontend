import React, { useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import Header from '../Header';
import CongressMap from '../CongressMap/CongressMap';
import Config from '../../config';

import { getLegislatorsByState } from '../../utils/data-index';
import { setBBoxes, setDistrictsByState, setStates } from '../../redux/actions/states';
import { setLegislators, setLegislatorsByState } from '../../redux/actions/legislators';
import { setError } from '../../redux/actions/errors';

interface ICongressViewProps {
  dispatch: Function;
}

const apiConfig = Config.apiGateway;

const CongressView = (props: ICongressViewProps) => {
  const { dispatch } = props;

  useLayoutEffect(() => {
    fetch(`${apiConfig.URL}/public/state/districts`)
      .then(res => res.json())
      .then(
        (result) => {
          dispatch(setDistrictsByState(result.data));
        },
        (error) => {
          dispatch(setError(error));
        }
      );
    fetch(`${apiConfig.URL}/public/state/bboxes`)
      .then(res => res.json())
      .then(
        (result) => {
          dispatch(setBBoxes(result.data));
        },
        (error) => {
          dispatch(setError(error));
        }
      )
    fetch(`${apiConfig.URL}/public/state`)
      .then(res => res.json())
      .then(
        (result) => {
          dispatch(setStates(result.data));
        },
        (error) => {
          dispatch(setError(error));
        }
      )
    fetch(`${apiConfig.URL}/public/legislator`)
      .then(res => res.json())
      .then(
        (result) => {
          dispatch(setLegislators(result.data));
          dispatch(setLegislatorsByState(getLegislatorsByState(JSON.parse(JSON.stringify(result.data)))));
        },
        (error) => {
          dispatch(setError(error));
        }
      )

  }, [dispatch]);

  const handleYearSelection = (year) => {
    fetch(`${apiConfig.URL}/public/legislator?date=${year}`)
      .then(res => res.json())
      .then(
        (result) => {
          dispatch(setLegislators(result.data));
          dispatch(setLegislatorsByState(getLegislatorsByState(JSON.parse(JSON.stringify(result.data)))));
        },
        (error) => {
          dispatch(setError(error));
        }
      )
  };

  return (
    <div className="CongressView">
      <Header
        handleYearSelection={handleYearSelection}
      />
      <CongressMap/>
    </div>
  )
}

function mapStateToProps(state: { errors: any; states: { districtsByState: any; states: any; }; legislators: { legislators: any; legislatorsByState: any; }; }) {
  return {
    errors: state.errors,
    districts: state.states.districtsByState,
    states: state.states.states,
    legislators: state.legislators.legislators,
    legislatorsByState: state.legislators.legislatorsByState,
  };
}

export default connect(mapStateToProps)(CongressView);
