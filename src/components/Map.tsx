import React from 'react';
import ReactMapGl, { NavigationControl, ViewportChangeHandler } from 'react-map-gl';
import { ensureMapFullyLoaded } from '../utils/MapHelpers';

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

const Map = (props: IMapProps) => {
  const { map, setMap, setMapLoaded, viewport, setViewport, handleMapClick, handleMouseMove } = props;

  const onMapLoad = () => {
    ensureMapFullyLoaded(map, setMapLoaded);
  };

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
      onLoad={onMapLoad}
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

export default Map;
