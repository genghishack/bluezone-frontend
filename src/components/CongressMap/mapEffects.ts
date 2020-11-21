import { Map as TMap } from 'mapbox-gl';
import geoViewport from "@mapbox/geo-viewport/index";
import { continentalBbox } from '../../constants';

export const setDistrictHoverState = (
    map: TMap,
    districtId: string,
    hoverState: boolean,
) => {
    map.setFeatureState({
        source: 'districts2018',
        sourceLayer: 'districts',
        id: districtId
    }, {
        hover: hoverState
    });
}

export const setDistrictFillByParty = (map: TMap, legislatorIndex: any) => {
    const features = map.querySourceFeatures('districts2018', {
        sourceLayer: 'districts',
        // filter: ['has', 'id']
    });
    // console.log('features: ', features);

    features.forEach(feature => {
        //@ts-ignore
        const stateAbbr = feature.properties.state;
        //@ts-ignore
        const districtNum = parseInt(feature.properties.number, 10);
        let districtData = {};
        if (legislatorIndex && legislatorIndex[stateAbbr]) {
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
}

export const filterDataset = (
    map: TMap,
    selectedState: string,
    selectedDistrict: string
) => {
    let existingFilter = map.getFilter('districts_hover');

    if (existingFilter[0] === 'all') {
        existingFilter = existingFilter[existingFilter.length - 1];
    }
    const filter = ['all'];
    // @ts-ignore
    if (selectedState) filter.push(['==', 'state', selectedState]);
    // @ts-ignore
    if (selectedDistrict) filter.push(['==', 'number', selectedDistrict]);

    //@ts-ignore
    const layerFilter = filter.concat([existingFilter]);

    map.setFilter('districts_hover', layerFilter);
    map.setFilter('districts_boundary', layerFilter);
    map.setFilter('districts_label', layerFilter);
    map.setFilter('districts_fill', layerFilter);
}

const filterUnderlyingStyle = (
    map: TMap,
    selectedState: string,
    selectedDistrict: string
) => {
    for (var i = 1; i <= 5; i++) {
        let existingFilter = map.getFilter('districts_' + i);
        if (existingFilter[0] === 'all') {
            existingFilter = existingFilter[existingFilter.length - 1];
        }
        const filter = ['all'];
        // @ts-ignore
        if (selectedState) filter.push(['==', 'state', selectedState]);
        // @ts-ignore
        if (selectedDistrict) filter.push(['==', 'number', selectedDistrict]);

        //@ts-ignore
        const layerFilter = filter.concat([existingFilter]);
        map.setFilter('districts_' + i, layerFilter);
        map.setFilter('districts_' + i + '_boundary', layerFilter);
        map.setFilter('districts_' + i + '_label', layerFilter);
    }
}

export const focusMap = (
    map: TMap,
    bboxes: any,
    stateAbbr: string, 
    districtNum: string
) => {
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
        map.easeTo(view);
    }
}


