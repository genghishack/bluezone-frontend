import React, { Component, createRef } from 'react';
import ReactMapGl, { MapLoadEvent, NavigationControl, ViewportChangeHandler } from 'react-map-gl';
import CongressionalDistricts from './Layers/CongressionalDistricts';
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
  filterMap: Function;
  selectedState: string;
  selectedDistrict: string;
}

const mapConf = Config.mapbox;

export class Map extends Component<IMapProps, {}> {
  mapRef = createRef(); // this is not in state because it creates an infinite loop when trying to use it to set a ref from the instance when it is

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

  render() {
    const { 
      map, 
      handleMapClick, 
      handleMouseMove, 
      mapLoaded, 
      viewport, 
      setViewport 
    } = this.props;

    console.log('mapProps: ', this.props)

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
    );
  }
}

export default Map;
