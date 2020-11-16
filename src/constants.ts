import geoViewport, { BoundingBox } from "@mapbox/geo-viewport";

export const continentalBbox: BoundingBox = [-128.8, 23.6, -65.4, 50.2];

export const continentalViewport = (() => {
    // Use GeoViewport and the window size to determine an
    // appropriate center and zoom for the continental US
    const continentalView = (w, h) => {
        return geoViewport.viewport(continentalBbox, [w, h]);
    };
    const continental = continentalView(window.innerWidth / 2, window.innerHeight / 2);

    return {
        longitude: continental.center[0],
        latitude: continental.center[1],
        zoom: continental.zoom,
        bearing: 0,
        pitch: 0
    }
})();