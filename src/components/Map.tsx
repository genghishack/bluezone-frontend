import React, { Component, createRef } from 'react';
import ReactMapGl, { MapLoadEvent, NavigationControl, ViewportChangeHandler } from 'react-map-gl';
import { ensureMapFullyLoaded as ensureMapFullyLoaded } from '../utils/MapHelpers';

import Config from '../config';

interface IMapProps {
  map: any;
  setMap: Function;
  setMapLoaded: Function;
  viewport: any;
  setViewport: ViewportChangeHandler;
  handleMapClick: Function;
  handleMouseMove: Function;
}

const mapConf = Config.mapbox;

export class Map extends Component<IMapProps, {}> {
  onMapLoad = () => {
    const { map, setMapLoaded } = this.props;
    ensureMapFullyLoaded(map, setMapLoaded);
  };

  render() {
    const { 
      setMap,
      handleMapClick, 
      handleMouseMove, 
      viewport, 
      setViewport 
    } = this.props;

    return (
        <ReactMapGl
          ref={mapRef => {
            setMap(mapRef?.getMap);
          }}
          {...viewport}
          width="100%"
          height="100%"
          mapStyle={mapConf.style}
          mapboxApiAccessToken={mapConf.accessToken}
          onViewportChange={setViewport}
          onLoad={this.onMapLoad}
          onMouseMove={handleMouseMove}
          onClick={handleMapClick}
        >
          <div style={{ position: 'absolute', right: 10, top: 10 }}>
            <NavigationControl
              onViewportChange={setViewport}
            />
          </div>
        </ReactMapGl>
    );
  }
}

export default Map;
