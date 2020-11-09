import React, {Component, createRef} from 'react';
import { connect } from "react-redux";
import ReactMapGl, {NavigationControl} from 'react-map-gl';
import geoViewport from "@mapbox/geo-viewport/index";
import InfoBox from './InfoBox/InfoBox';
import MenuTree from './MenuTree/MenuTree';
import CongressionalDistricts from './Layers/CongressionalDistricts';

import Config from '../config';

type MapProps = {
  selectedState: string;
  selectedDistrict: string;
  handleDistrictSelection: Function;
  bboxes?: any;
  currentEntity?: string;
  currentType?: string;
}

// Use GeoViewport and the window size to determine an
// appropriate center and zoom for the continental US
const continentalBbox = [-128.8, 23.6, -65.4, 50.2];
const continentalView = (w, h) => {
  return geoViewport.viewport(continentalBbox, [w, h]);
};
const continental = continentalView(window.innerWidth / 2, window.innerHeight / 2);

const mapConf = Config.mapbox;

export class CongressMap extends Component<MapProps, {}> {
  private mapRef = createRef();
  map = null;
  hoveredDistrictId = null;
  state = {
    viewport: {
      longitude: continental.center[0],
      latitude: continental.center[1],
      zoom: continental.zoom,
      bearing: 0,
      pitch: 0
    },
    mapLoaded: false,
    expanded: false,
    hoveredDistrictId: null,
    district: {},
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.selectedState !== this.props.selectedState
    || prevProps.selectedDistrict !== this.props.selectedDistrict) {
      this.filterMap();
    }
  };

  onMapLoad = () => {
    // @ts-ignore
    this.map = this.mapRef.getMap();
    this.onMapFullRender();
  };

  onMapFullRender = () => {
    // @ts-ignore
    const mapIsLoaded = this.map.loaded();
    // @ts-ignore
    const styleIsLoaded = this.map.isStyleLoaded();
    // @ts-ignore
    const tilesAreLoaded = this.map.areTilesLoaded();
    if (!mapIsLoaded || !tilesAreLoaded || !styleIsLoaded) {
      setTimeout(this.onMapFullRender, 200);
    } else {
      this.setState({ mapLoaded: true });
    }
  };

  updateViewport = viewport => {
    this.setState({ viewport });
  };


  setHoveredDistrict(district) {
    // remove the hover setting from whatever district was being hovered before
    if (this.hoveredDistrictId) {
      // @ts-ignore
      this.map.setFeatureState({
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
    this.map.setFeatureState({
      source: 'districts2018',
      sourceLayer: 'districts',
      id: this.hoveredDistrictId
    }, {
      hover: true
    });
  }

  mouseMove = (evt) => {
    /*
    TODO: the mouse is no longer being changed with the new map.
     */
    const { mapLoaded } = this.state;

    if (mapLoaded) {
      // @ts-ignore
      const features = this.map.queryRenderedFeatures(evt.point);

      let cursorStyle = '';

      const {layerIds} = mapConf;

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
      this.map.getCanvas().style.cursor = cursorStyle;
    }

  };

  mapClick = (evt) => {
    // @ts-ignore
    const features = this.map.queryRenderedFeatures(evt.point);

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

    this.focusMap(
      district.properties.state,
      district.properties.number
    );

    // this.map.setFeatureState({
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
      // console.log('source: ', this.map.getSource('composite'));
      // console.log('layer: ', this.map.getLayer('districts'));
    });

  };

  closeClick = (e) => {
    e.preventDefault();
    /*
     TODO: There's a bug in this which makes whatever district
      is underneath the X become selected when the X is clicked.
    */
    this.setState({expanded: false});
  };

  focusMap = (stateAbbr, districtNum) => {
    const { bboxes } = this.props;
    let bbox = continentalBbox;
    if (stateAbbr) {
      bbox = bboxes[stateAbbr + districtNum];
    }
    const view = geoViewport.viewport(
      bbox,
      [window.innerWidth / 2.75, window.innerHeight / 2.75]
    );
    // console.log('bbox: ', bbox, 'view: ', view);
    // @ts-ignore
    this.map.easeTo(view);
  };

  filterMap = () => {

    const {
      selectedState,
      selectedDistrict
    } = this.props;

    // this.filterUnderlyingStyle();
    this.filterDataset();
    this.focusMap(selectedState, selectedDistrict);
  };

  filterUnderlyingStyle = () => {
    const {
      selectedState,
      selectedDistrict
    } = this.props;

    for (var i = 1; i <= 5; i++) {
      // @ts-ignore
      let existingFilter = this.map.getFilter('districts_' + i);
      if (existingFilter[0] === 'all') {
        existingFilter = existingFilter[existingFilter.length - 1];
      }
      const filter = ['all'];
      // @ts-ignore
      if (selectedState) filter.push(['==', 'state', selectedState]);
      // @ts-ignore
      if (selectedDistrict) filter.push(['==', 'number', selectedDistrict]);

      const layerFilter = filter.concat([existingFilter]);
      // @ts-ignore
      this.map.setFilter('districts_' + i, layerFilter);
      // @ts-ignore
      this.map.setFilter('districts_' + i + '_boundary', layerFilter);
      // @ts-ignore
      this.map.setFilter('districts_' + i + '_label', layerFilter);
    }
  };

  filterDataset = () => {
    const {
      selectedState,
      selectedDistrict
    } = this.props;

    // @ts-ignore
    let existingFilter = this.map.getFilter('districts_hover');

    if (existingFilter[0] === 'all') {
      existingFilter = existingFilter[existingFilter.length - 1];
    }
    const filter = ['all'];
    // @ts-ignore
    if (selectedState) filter.push(['==', 'state', selectedState]);
    // @ts-ignore
    if (selectedDistrict) filter.push(['==', 'number', selectedDistrict]);

    const layerFilter = filter.concat([existingFilter]);

    // @ts-ignore
    this.map.setFilter('districts_hover', layerFilter);
    // @ts-ignore
    this.map.setFilter('districts_boundary', layerFilter);
    // @ts-ignore
    this.map.setFilter('districts_label', layerFilter);
    // @ts-ignore
    this.map.setFilter('districts_fill', layerFilter);
  };

  render() {
    const { handleDistrictSelection } = this.props;
    const { viewport, mapLoaded } = this.state;

    const congressionalDistricts = mapLoaded ? (
      <CongressionalDistricts
        map={this.map}
        mapLoaded={mapLoaded}
      />
    ) : null;

    return (
      <div id="main-container">

        <MenuTree
          filterMap={this.filterMap}
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
          mapStyle={ mapConf.style }
          mapboxApiAccessToken={ mapConf.accessToken }
          onViewportChange={this.updateViewport}
          onLoad={this.onMapLoad}
          onMouseMove={this.mouseMove}
          onClick={this.mapClick}
        >

          {congressionalDistricts}

          <InfoBox
            district={this.state.district}
            expanded={this.state.expanded}
            closeClick={this.closeClick}
          />
          <div style={{position: 'absolute', left: 10, top: 10}}>
            <NavigationControl
              onViewportChange={this.updateViewport}
            />
          </div>
        </ReactMapGl>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    bboxes: state.states.bboxes,
    currentId: state.entities.currentEntity,
    currentType: state.entities.currentType,
  };
}

export default connect(mapStateToProps)(CongressMap);
