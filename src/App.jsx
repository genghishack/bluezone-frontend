import React, {Component} from 'react';
import {connect} from "react-redux";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Header from './components/Header';
import CongressMap from './components/Map';
import Config from './config';

import {getLegislatorsByState} from './utils/data-index';

import {setBBoxes, setDistrictsByState, setStates} from "./redux/actions/states";
import {setLegislators, setLegislatorsByState} from './redux/actions/legislators';
import {setError} from "./redux/actions/errors";

import './App.scss';

const apiConfig = Config.apiGateway;

class App extends Component {
  state = {
    selectedState: '',
    selectedDistrict: '',
  };

  componentDidMount = () => {
    fetch(`${apiConfig.URL}/public/state/districts`)
      .then(res => res.json())
      .then(
        (result) => {
          this.props.dispatch(setDistrictsByState(result.data));
        },
        (error) => {
          this.props.dispatch(setError(error));
        }
      );
    fetch(`${apiConfig.URL}/public/state/bboxes`)
      .then(res => res.json())
      .then(
        (result) => {
          this.props.dispatch(setBBoxes(result.data));
        },
        (error) => {
          this.props.dispatch(setError(error));
        }
      )
    fetch(`${apiConfig.URL}/public/state`)
      .then(res => res.json())
      .then(
        (result) => {
          this.props.dispatch(setStates(result.data));
        },
        (error) => {
          this.props.dispatch(setError(error));
        }
      )
    fetch(`${apiConfig.URL}/public/legislator`)
      .then(res => res.json())
      .then(
        (result) => {
          this.props.dispatch(setLegislators(result.data));
          this.props.dispatch(setLegislatorsByState(getLegislatorsByState(JSON.parse(JSON.stringify(result.data)))));
        },
        (error) => {
          this.props.dispatch(setError(error));
        }
      )
  };

  Map = () => (
    <CongressMap
      selectedState={this.state.selectedState}
      selectedDistrict={this.state.selectedDistrict}
      getMapHandle={this.getMapHandle}
      handleDistrictSelection={this.handleDistrictSelection}
    />
  );

  getMapHandle = (map) => {
    this.map = map;
  };

  handleDistrictSelection = (stateAbbr, districtNum = '') => {
    this.setState({
      selectedState: stateAbbr,
      selectedDistrict: districtNum
    });
  };

  handleYearSelection = (year) => {
    fetch(`${apiConfig.URL}/public/legislator?date=${year}`)
      .then(res => res.json())
      .then(
        (result) => {
          this.props.dispatch(setLegislators(result.data));
          this.props.dispatch(setLegislatorsByState(getLegislatorsByState(JSON.parse(JSON.stringify(result.data)))));
        },
        (error) => {
          this.props.dispatch(setError(error));
        }
      )
  };

  render = () => {
    return (
      <div className="App">
        <Header
          handleYearSelection={this.handleYearSelection}
        />
        <Router>
          <Switch>
            <Route path="/" component={this.Map}/>
          </Switch>
        </Router>
      </div>
    )
  };

}

function mapStateToProps(state) {
  return {
    errors: state.errors,
    districts: state.states.districtsByState,
    states: state.states.states,
    legislators: state.legislators.legislators,
    legislatorsByState: state.legislators.legislatorsByState,
  };
}

export default connect(mapStateToProps)(App);
