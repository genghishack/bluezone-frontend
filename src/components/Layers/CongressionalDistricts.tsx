import {useCallback, useEffect} from 'react';
import { connect } from "react-redux";

interface ICongressionalDistrictsProps {
  map: any;
  legislatorIndex?: any;
}

const CongressionalDistricts = (props: ICongressionalDistrictsProps) => {
  const { map, legislatorIndex} = props;

  const addDistrictSource = useCallback(() => {
    if (!map.getSource('districts2018')) {
      map.addSource('districts2018', {
        type: 'vector',
        url: 'mapbox://genghishack.cd-116-2018'
      });
    }
  }, [map]);

  const addDistrictBoundariesLayer = useCallback(() => {
    map.addLayer({
      'id': 'districts_boundary',
      'type': 'line',
      'source': 'districts2018',
      'source-layer': 'districts',
      'paint': {
        'line-color': 'rgba(128, 128, 128, 0.9)',
        'line-width': 1
      },
      'filter': ['all']
    });
  }, [map]);

  const addDistrictLabelsLayer = useCallback(() => {
    map.addLayer({
      'id': 'districts_label',
      'type': 'symbol',
      'source': 'districts2018',
      'source-layer': 'districts',
      'layout': {
        'text-field': '{title_short}',
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Regular'],
        'text-size': {'base': 1, stops: [[1, 8], [7, 18]]}
      },
      'paint': {
        'text-color': 'hsl(0, 0%, 27%)',
        'text-halo-color': '#decbe4',
        'text-halo-width': {
          'base': 1,
          'stops': [
            [1, 1],
            [8, 2]
          ]
        }
      }
    });
  }, [map]);

  const addDistrictHoverLayer = useCallback(() => {
    map.addLayer({
      'id': 'districts_hover',
      'type': 'fill',
      'source': 'districts2018',
      'source-layer': 'districts',
      'filter': ['!=', 'fill', ''],
      'paint': {
        'fill-color': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          'rgba(123, 104, 238, 0.3)', // medium slate blue
          'rgba(0, 0, 0, 0)'
        ],
        // 'fill-opacity': [
        //   'case',
        //   ['boolean', ['feature-state', 'hover'], false],
        //   1,
        //   0.2
        // ],
        // 'fill-outline-color': 'rgba(128, 128, 128, 0.4)',
        'fill-antialias': true
      }
    });

  }, [map]);

  const addDistrictFillLayer = useCallback(() => {
    map.addLayer({
      'id': 'districts_fill',
      'type': 'fill',
      'source': 'districts2018',
      'source-layer': 'districts',
      'filter': ['!=', 'fill', ''],
      'paint': {
        'fill-color': [
          'case',
          ['boolean', ['feature-state', 'party'], true],
          '#9999ff', // dem
          '#ff9999' // rep
        ],
        'fill-antialias': true,
        'fill-opacity': 0.5
      }
    });
  }, [map]);

  const setDistrictFillByParty = useCallback(() => {
    const features = map.querySourceFeatures('districts2018', {
      sourceLayer: 'districts',
      // filter: ['has', 'id']
    });
    // console.log('features: ', features);

    features.forEach(feature => {
      const stateAbbr = feature.properties.state;
      const districtNum = parseInt(feature.properties.number, 10);
      let districtData = {};
      if(legislatorIndex && legislatorIndex[stateAbbr]) {
        districtData = legislatorIndex[stateAbbr].rep[districtNum] || {};
      }
      // @ts-ignore
      if (districtData.name) {
        // @ts-ignore
        const party = districtData.terms.slice(-1)[0].party;
        const partyBoolean = !!(party === 'Democrat');
        map.setFeatureState({
          source: 'districts2018',
          sourceLayer: 'districts',
          id: feature.id
        }, {
          party: partyBoolean
        });
      }
    });
  }, [legislatorIndex, map]);

  const onMapFullRender = useCallback(() => {
    const mapIsLoaded = map.loaded();
    const styleIsLoaded = map.isStyleLoaded();
    const tilesAreLoaded = map.areTilesLoaded();
    if (!mapIsLoaded || !tilesAreLoaded || !styleIsLoaded || !legislatorIndex.AK) {
      setTimeout(onMapFullRender, 200);
    } else {
      addDistrictFillLayer();
      setDistrictFillByParty();
    }
  }, [addDistrictFillLayer, legislatorIndex.AK, map, setDistrictFillByParty]);

  useEffect(() => {
    onMapFullRender()
  }, [onMapFullRender]);

  useEffect(() => {
    setDistrictFillByParty();
  }, [legislatorIndex, setDistrictFillByParty]);

  addDistrictSource();
  addDistrictBoundariesLayer();
  addDistrictLabelsLayer();
  addDistrictHoverLayer();
  return null;
}

function mapStateToProps(state) {
  return {
    legislatorIndex: state.legislators.legislatorsByState,
  }
}

export default connect(mapStateToProps)(CongressionalDistricts);
