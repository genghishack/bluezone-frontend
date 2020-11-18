import React, { Component, createRef } from 'react';
import ReactMapGl, { MapLoadEvent, NavigationControl, ViewportChangeHandler } from 'react-map-gl';
import { ensureMapFullRender } from '../utils/MapHelpers';

import Config from '../config';

interface IMapProps {
  map: any;
  viewport: any;
  setViewport: ViewportChangeHandler;
  handleMapLoad: (event: MapLoadEvent) => void;
  handleMapClick: Function;
  handleMouseMove: Function;
  mapLoaded: boolean;
  setMapLoaded: Function;
}

const mapConf = Config.mapbox;

export class Map extends Component<IMapProps, {}> {
  mapRef = createRef(); // this is not in state because it creates an infinite loop when trying to use it to set a ref from the instance when it is

  onMapLoad = () => {
    //@ts-ignore
    this.props.handleMapLoad(this.mapRef); // changes value of map prop

    const { map, setMapLoaded } = this.props;
    ensureMapFullRender(map, setMapLoaded);
  };

  render() {
    const { 
      handleMapClick, 
      handleMouseMove, 
      viewport, 
      setViewport 
    } = this.props;

    // console.log('mapProps: ', this.props)

    return (
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
