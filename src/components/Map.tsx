import React, { Component, createRef } from 'react';
import { connect } from "react-redux";
import ReactMapGl, { MapLoadEvent, NavigationControl, ViewportChangeHandler } from 'react-map-gl';
import geoViewport from "@mapbox/geo-viewport/index";
import InfoBox from './InfoBox/InfoBox';
import MenuTree from './MenuTree/MenuTree';
import CongressionalDistricts from './Layers/CongressionalDistricts';
import { ensureMapFullRender } from '../utils/MapHelpers';

import { continentalBbox } from '../constants';
import Config from '../config';

interface IMapProps {
  map: any;
  setMap: Function;
  viewport: any;
  setViewport: ViewportChangeHandler;
  handleMapLoad: (event: MapLoadEvent) => void;
  mapLoaded: boolean;
  setMapLoaded: Function;
  focusMap: Function;
  filterDataset: Function;
  selectedState: string;
  selectedDistrict: string;
  handleDistrictSelection: Function;
  bboxes?: any;
  currentEntity?: string;
  currentType?: string;
}

const mapConf = Config.mapbox;

export class Map extends Component<IMapProps, {}> {
  mapRef = createRef(); // this is not in state because it creates an infinite loop when trying to use it to set a ref from the instance when it is
  hoveredDistrictId = null; // this is not in state because it doesn't un-hover the districts when it is

  state = {
    expanded: false,
    district: {},
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.selectedState !== this.props.selectedState
      || prevProps.selectedDistrict !== this.props.selectedDistrict) {
      this.filterMap();
    }
  };

  onMapLoad = () => {
    //@ts-ignore
    this.props.handleMapLoad(this.mapRef); // changes value of map prop

    const { map, setMapLoaded } = this.props;
    ensureMapFullRender(map, setMapLoaded);
  };

  setHoveredDistrict(district) {
    // remove the hover setting from whatever district was being hovered before
    if (this.hoveredDistrictId) {
      // @ts-ignore
      this.props.map.setFeatureState({
        source: 'districts2018',
        sourceLayer: 'districts',
        id: this.hoveredDistrictId
      }, {
        hover: false
      });
    }

    // Change the hovered district id to the current one
    this.hoveredDistrictId = district[0].id;

    // Set hover to true on the currently hovered district
    // @ts-ignore
    this.props.map.setFeatureState({
      source: 'districts2018',
      sourceLayer: 'districts',
      id: this.hoveredDistrictId
    }, {
      hover: true
    });
  }

  handleMouseMove = (evt) => {
    /*
    TODO: the mouse is no longer being changed with the new map.
     */
    const { mapLoaded } = this.props;

    if (mapLoaded) {
      // @ts-ignore
      const features = this.props.map.queryRenderedFeatures(evt.point);

      let cursorStyle = '';

      const { layerIds } = mapConf;

      // Make sure the district we are hovering is being displayed by the filter
      const hoveredDistrict = features.filter(feature => {
        return layerIds.indexOf(feature.layer.id) !== -1;
      });

      // console.log('hovered district: ', hoveredDistrict);

      if (hoveredDistrict.length) {

        // Make sure the cursor is a pointer over any visible district.
        cursorStyle = 'pointer';

        this.setHoveredDistrict(hoveredDistrict);

      }

      // @ts-ignore
      this.props.map.getCanvas().style.cursor = cursorStyle;
    }

  };

  handleMapClick = (evt) => {
    // @ts-ignore
    const features = this.props.map.queryRenderedFeatures(evt.point);

    // console.log('features: ', features);

    const layerIds = mapConf.layerIds;

    let district;
    const rFilteredDistricts = features.filter(feature => {
      return layerIds.indexOf(feature.layer.id) !== -1;
    });
    if (rFilteredDistricts.length) {
      district = rFilteredDistricts[0];
    }

    if (!district) {
      this.setState({
        district: {},
        expanded: false
      });
      return;
    }

    this.props.focusMap(
      district.properties.state,
      district.properties.number
    );

    // this.props.map.setFeatureState({
    //   source: 'districts2018',
    //   sourceLayer: 'districts',
    //   id: district.id,
    // }, {
    //   color: true
    // });

    this.setState({
      district: district,
      expanded: true
    }, () => {
      // console.log('district: ', district);
      // console.log('source: ', this.props.map.getSource('composite'));
      // console.log('layer: ', this.props.map.getLayer('districts'));
    });

  };

  handleCloseClick = () => {
    /*
     TODO: There's a bug in this which makes whatever district
      is underneath the X become selected when the X is clicked.
    */
    this.setState({ expanded: false });
  };

  // focusMap = (stateAbbr, districtNum) => {
  //   const { bboxes } = this.props;
  //   let bbox = continentalBbox;
  //   if (stateAbbr) {
  //     bbox = bboxes[stateAbbr + districtNum];
  //   }
  //   const view = geoViewport.viewport(
  //     bbox,
  //     [window.innerWidth / 2.75, window.innerHeight / 2.75]
  //   );
  //   // console.log('bbox: ', bbox, 'view: ', view);
  //   // @ts-ignore
  //   this.props.map.easeTo(view);
  // };

  filterMap = () => {

    const {
      selectedState,
      selectedDistrict
    } = this.props;

    // this.filterUnderlyingStyle();
    this.props.filterDataset();
    this.props.focusMap(selectedState, selectedDistrict);
  };

  render() {
    const { map, handleDistrictSelection, mapLoaded, viewport, setViewport } = this.props;

    console.log('mapProps: ', this.props)

    return (
      <div id="main-container">

        <MenuTree
          handleSelection={handleDistrictSelection}
        />

        <ReactMapGl
          ref={map => {
            // @ts-ignore
            this.mapRef = map;
          }}
          {...viewport}
          width="100%"
          height="100%"
          mapStyle={mapConf.style}
          mapboxApiAccessToken={mapConf.accessToken}
          onViewportChange={setViewport}
          onLoad={this.onMapLoad}
          onMouseMove={this.handleMouseMove}
          onClick={this.handleMapClick}
        >

          {mapLoaded ? (
            <CongressionalDistricts
              map={map}
            />
          ) : null}

          <div style={{ position: 'absolute', right: 10, top: 10 }}>
            <NavigationControl
              onViewportChange={setViewport}
            />
          </div>
          <InfoBox
            district={this.state.district}
            expanded={this.state.expanded}
            closeClick={this.handleCloseClick}
          />
        </ReactMapGl>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    bboxes: state.states.bboxes,
    currentId: state.entities.currentEntity,
    currentType: state.entities.currentType,
  };
}

export default connect(mapStateToProps)(Map);
