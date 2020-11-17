import React, { Component, createRef } from 'react';
import { connect } from "react-redux";
import ReactMapGl, { MapLoadEvent, NavigationControl, ViewportChangeHandler } from 'react-map-gl';
import InfoBox from './InfoBox/InfoBox';
import MenuTree from './MenuTree/MenuTree';
import CongressionalDistricts from './Layers/CongressionalDistricts';
import { ensureMapFullRender } from '../utils/MapHelpers';

import Config from '../config';

interface IMapProps {
  map: any;
  setMap: Function;
  viewport: any;
  setViewport: ViewportChangeHandler;
  handleMapLoad: (event: MapLoadEvent) => void;
  handleMapClick: Function;
  mapLoaded: boolean;
  setMapLoaded: Function;
  focusMap: Function;
  filterMap: Function;
  filterDataset: Function;
  expanded: boolean;
  setExpanded: Function;
  district: any;
  setDistrict: Function;
  selectedState: string;
  selectedDistrict: string;
  handleDistrictSelection: Function;
  currentEntity?: string;
  currentType?: string;
}

const mapConf = Config.mapbox;

export class Map extends Component<IMapProps, {}> {
  mapRef = createRef(); // this is not in state because it creates an infinite loop when trying to use it to set a ref from the instance when it is
  hoveredDistrictId = null; // this is not in state because it doesn't un-hover the districts when it is

  componentDidUpdate = (prevProps) => {
    if (prevProps.selectedState !== this.props.selectedState
      || prevProps.selectedDistrict !== this.props.selectedDistrict) {
      this.props.filterMap();
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

  render() {
    const { map, handleDistrictSelection, handleMapClick, mapLoaded, viewport, setViewport } = this.props;

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
          onClick={handleMapClick}
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
        </ReactMapGl>
        <InfoBox
          district={this.props.district}
          expanded={this.props.expanded}
          closeClick={() => this.props.setExpanded(false)}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentId: state.entities.currentEntity,
    currentType: state.entities.currentType,
  };
}

export default connect(mapStateToProps)(Map);
