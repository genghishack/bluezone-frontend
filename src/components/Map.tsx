import React from 'react';
import ReactMapGl, { NavigationControl, ViewportChangeHandler } from 'react-map-gl';
import { Map as TMap } from 'mapbox-gl';

import Config from '../config';

interface IMapProps {
  map: TMap | null;
  setMap: Function;
  setMapFullyLoaded: Function;
  viewport: any;
  setViewport: ViewportChangeHandler;
  handleMapClick: Function;
  handleMouseMove: Function;
}

const mapConf = Config.mapbox;

const Map = (props: IMapProps) => {
  const { map, setMap, setMapFullyLoaded, viewport, setViewport, handleMapClick, handleMouseMove } = props;

  const onMapLoad = () => {
    if (map) {
      if (!map.loaded() || !map.isStyleLoaded() || !map.areTilesLoaded()) {
        setTimeout(onMapLoad, 100);
      } else {
        setMapFullyLoaded(true);
      }
    }
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
