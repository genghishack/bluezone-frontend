import React, { Component, createRef, useCallback, useEffect, useState } from 'react';
import { connect } from "react-redux";
import ReactMapGl, { NavigationControl } from 'react-map-gl';
import geoViewport from "@mapbox/geo-viewport/index";
import InfoBox from './InfoBox/InfoBox';
import MenuTree from './MenuTree/MenuTree';
import CongressionalDistricts from './Layers/CongressionalDistricts';
import { onMapFullRender } from '../utils/MapHelpers';

import Config from '../config';

interface IMapProps {
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

const Map1 = (props: IMapProps) => {
  const { selectedState, selectedDistrict, handleDistrictSelection, bboxes, currentEntity, currentType } = props;
  let mapRef = createRef();
  let map = null;
  // let hoveredDistrictId = null;

  const [viewport, setViewport] = useState({
    longitude: continental.center[0],
    latitude: continental.center[1],
    zoom: continental.zoom,
    bearing: 0,
    pitch: 0
  });
  const [mapLoaded, setMapLoaded] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [hoveredDistrictId, setHoveredDistrictId] = useState(null);
  const [district, setDistrict] = useState({});

  const filterDataset = useCallback(() => {
    if (map) {
      // @ts-ignore
      let existingFilter = map.getFilter('districts_hover');

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
      map.setFilter('districts_hover', layerFilter);
      // @ts-ignore
      map.setFilter('districts_boundary', layerFilter);
      // @ts-ignore
      map.setFilter('districts_label', layerFilter);
      // @ts-ignore
      map.setFilter('districts_fill', layerFilter);
    }
  }, [map, selectedState, selectedDistrict]);

  const focusMap = useCallback((stateAbbr, districtNum) => {
    if (map) {
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
      map.easeTo(view);
    }
  }, [map, bboxes]);

  const filterUnderlyingStyle = useCallback(() => {
    if (map) {
      for (var i = 1; i <= 5; i++) {
        // @ts-ignore
        let existingFilter = map.getFilter('districts_' + i);
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
        map.setFilter('districts_' + i, layerFilter);
        // @ts-ignore
        map.setFilter('districts_' + i + '_boundary', layerFilter);
        // @ts-ignore
        map.setFilter('districts_' + i + '_label', layerFilter);
      }
    }
  }, [map, selectedState, selectedDistrict]);

  const filterMap = useCallback(() => {
    // filterUnderlyingStyle();
    filterDataset();
    focusMap(selectedState, selectedDistrict);
  }, [filterDataset, focusMap, selectedState, selectedDistrict]);

  useEffect(() => {
    filterMap();
  }, [selectedState, selectedDistrict, filterMap]);

  const onMapLoad = () => {
    // @ts-ignore
    map = mapRef.getMap();
    onMapFullRender(map, setMapLoaded);
  };

  const updateViewport = viewport => {
    setViewport(viewport);
  };

  const setHoveredDistrict = (district) => {
    if (map) {
      // remove the hover setting from whatever district was being hovered before
      if (hoveredDistrictId) {
        // @ts-ignore
        map.setFeatureState({
          source: 'districts2018',
          sourceLayer: 'districts',
          id: hoveredDistrictId
        }, {
          hover: false
        });
      }

      // Change the hovered district id to the current one
      setHoveredDistrictId(district[0].id);

      // Set hover to true on the currently hovered district
      // @ts-ignore
      map.setFeatureState({
        source: 'districts2018',
        sourceLayer: 'districts',
        id: hoveredDistrictId
      }, {
        hover: true
      });
    }
  }

  const mouseMove = (evt) => {
    // TODO: the mouse is no longer being changed with the new map.
    if (map && mapLoaded) {
      // @ts-ignore
      const features = map.queryRenderedFeatures(evt.point);

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

        setHoveredDistrict(hoveredDistrict);

      }

      // @ts-ignore
      map.getCanvas().style.cursor = cursorStyle;
    }
  };

  const mapClick = (evt) => {
    if (map) {
      // @ts-ignore
      const features = map.queryRenderedFeatures(evt.point);

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
        setDistrict({});
        setExpanded(false);
        return;
      }

      focusMap(
        district.properties.state,
        district.properties.number
      );

      // map.setFeatureState({
      //   source: 'districts2018',
      //   sourceLayer: 'districts',
      //   id: district.id,
      // }, {
      //   color: true
      // });

      setDistrict(district);
      setExpanded(true);
    }
  };

  const closeClick = () => {
    /*
     TODO: There's a bug in this which makes whatever district
      is underneath the X become selected when the X is clicked.
    */
    setExpanded(false);
  };

  console.log('mapProps: ', props)
  const congressionalDistricts = mapLoaded ? (
    <CongressionalDistricts
      map={map}
    />
  ) : null;

  return (
    <div id="main-container">

      <MenuTree
        handleSelection={handleDistrictSelection}
      />

      <ReactMapGl
        ref={map => {
          // @ts-ignore
          mapRef = map;
        }}
        {...viewport}
        width="100%"
        height="100%"
        mapStyle={mapConf.style}
        mapboxApiAccessToken={mapConf.accessToken}
        onViewportChange={updateViewport}
        onLoad={onMapLoad}
        onMouseMove={mouseMove}
        onClick={mapClick}
      >

        {congressionalDistricts}

        <InfoBox
          district={district}
          expanded={expanded}
          closeClick={closeClick}
        />
        <div style={{ position: 'absolute', left: 10, top: 10 }}>
          <NavigationControl
            onViewportChange={updateViewport}
          />
        </div>
      </ReactMapGl>
    </div>
  )
};

export class Map extends Component<IMapProps, {}> {
  mapRef = createRef(); // this is not in state because it creates an infinite loop when trying to use it to set a ref from the instance when it is
  hoveredDistrictId = null; // this is not in state because it doesn't un-hover the districts when it is

  state = {
    map: null,
    viewport: {
      longitude: continental.center[0],
      latitude: continental.center[1],
      zoom: continental.zoom,
      bearing: 0,
      pitch: 0
    },
    mapLoaded: false,
    expanded: false,
    district: {},
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.selectedState !== this.props.selectedState
      || prevProps.selectedDistrict !== this.props.selectedDistrict) {
      this.filterMap();
    }
  };

  setMapLoaded = (bool: boolean) => {
    this.setState({mapLoaded: bool});
  }

  onMapLoad = () => {
    // @ts-ignore
    this.setState({map: this.mapRef.getMap()}, () => {
      onMapFullRender(this.state.map, this.setMapLoaded);
    });
  };

  setViewport = viewport => {
    this.setState({ viewport });
  };

  setHoveredDistrict(district) {
    // remove the hover setting from whatever district was being hovered before
    if (this.hoveredDistrictId) {
      // @ts-ignore
      this.state.map.setFeatureState({
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
    this.state.map.setFeatureState({
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
    const { mapLoaded } = this.state;

    if (mapLoaded) {
      // @ts-ignore
      const features = this.state.map.queryRenderedFeatures(evt.point);

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
      this.state.map.getCanvas().style.cursor = cursorStyle;
    }

  };

  handleMapClick = (evt) => {
    // @ts-ignore
    const features = this.state.map.queryRenderedFeatures(evt.point);

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

    // this.state.map.setFeatureState({
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
      // console.log('source: ', this.state.map.getSource('composite'));
      // console.log('layer: ', this.state.map.getLayer('districts'));
    });

  };

  handleCloseClick = () => {
    /*
     TODO: There's a bug in this which makes whatever district
      is underneath the X become selected when the X is clicked.
    */
    this.setState({ expanded: false });
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
    this.state.map.easeTo(view);
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
      let existingFilter = this.state.map.getFilter('districts_' + i);
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
      this.state.map.setFilter('districts_' + i, layerFilter);
      // @ts-ignore
      this.state.map.setFilter('districts_' + i + '_boundary', layerFilter);
      // @ts-ignore
      this.state.map.setFilter('districts_' + i + '_label', layerFilter);
    }
  };

  filterDataset = () => {
    const {
      selectedState,
      selectedDistrict
    } = this.props;

    // @ts-ignore
    let existingFilter = this.state.map.getFilter('districts_hover');

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
    this.state.map.setFilter('districts_hover', layerFilter);
    // @ts-ignore
    this.state.map.setFilter('districts_boundary', layerFilter);
    // @ts-ignore
    this.state.map.setFilter('districts_label', layerFilter);
    // @ts-ignore
    this.state.map.setFilter('districts_fill', layerFilter);
  };

  render() {
    const { handleDistrictSelection } = this.props;
    const { viewport, mapLoaded } = this.state;

    console.log('mapProps: ', this.props)
    const congressionalDistricts = mapLoaded ? (
      <CongressionalDistricts
        map={this.state.map}
      />
    ) : null;

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
          onViewportChange={this.setViewport}
          onLoad={this.onMapLoad}
          onMouseMove={this.handleMouseMove}
          onClick={this.handleMapClick}
        >

          {congressionalDistricts}

          <InfoBox
            district={this.state.district}
            expanded={this.state.expanded}
            closeClick={this.handleCloseClick}
          />
          <div style={{ position: 'absolute', left: 10, top: 10 }}>
            <NavigationControl
              onViewportChange={this.setViewport}
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

export default connect(mapStateToProps)(Map);
