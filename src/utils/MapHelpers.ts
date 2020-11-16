type TMap = { 
  loaded: () => any; 
  isStyleLoaded: () => any; 
  areTilesLoaded: () => any; 
} | null

type TMapLoaded = (arg0: boolean) => void; // Function would work

export const onMapFullRender = (map: TMap, setMapLoaded: TMapLoaded) => {
  if (map) {
    // @ts-ignore
    const mapIsLoaded = map.loaded();
    // @ts-ignore
    const styleIsLoaded = map.isStyleLoaded();
    // @ts-ignore
    const tilesAreLoaded = map.areTilesLoaded();
    if (!mapIsLoaded || !tilesAreLoaded || !styleIsLoaded) {
      setTimeout(onMapFullRender, 200);
    } else {
      setMapLoaded(true);
    }
  }
};

export function createGeoJsonPolys(data) {
  const newArray = data.map((item) => {
    return {
      "id": item.id,
      "properties": item.attributes,
      "geometry": item.attributes.boundary
    }
  });
  const featureCollection = {
    "id": "farms",
    "type": "FeatureCollection",
    "boundingBox": [-115.996822, 25.589321, -71.372368, 55.571981],
    "features": newArray
  };
  return featureCollection;
}

export function createGeoJsonPoints(data) {
  const newArray = data.map((item) => {
    return {
      "id": item.id,
      "properties": item.attributes,
      "geometry": item.attributes.centroid
    }
  });
  const featureCollection = {
    "id": "farms",
    "type": "FeatureCollection",
    "features": newArray
  };
  return featureCollection;
}
