import geoViewport from "@mapbox/geo-viewport";
import { continentalBbox } from '../constants';

const AKBbox = [-190, 51.214183, -129, 71.365162];

const getViewport = (bbox, w, h) => {
  return geoViewport.viewport(
    bbox,
    [w, h], 
    0,   // minZoon
    20,  // maxZoon
    256, // 512 for mapbox tiles, 256 for other (but not really, apparently)
    true // allowFloat
  );
}

export const continentalViewport = ((width = window.innerWidth, height = window.innerHeight) => {
  // Determin an appropriate center and zoom for the continental US
  const continental = getViewport(continentalBbox, width / 2, height / 2);

  return {
    longitude: continental.center[0],
    latitude: continental.center[1],
    zoom: continental.zoom,
    bearing: 0,
    pitch: 0
  }
});