import React, { useState } from 'react';
import { connect } from 'react-redux';
import geoViewport from "@mapbox/geo-viewport/index";
import { continentalBbox, continentalViewport } from '../constants';
import Map from './Map';

interface ICongressMapProps {
    bboxes?: any;
}

const CongressMap = (props: ICongressMapProps) => {
    const { bboxes } = props;

    const [mapLoaded, setMapLoaded] = useState(false);
    // const [map, setMap] = useStateWithCallback(null, () => onMapFullRender(map, setMapLoaded));
    const [map, setMap] = useState(null);
    const [viewport, setViewport] = useState(continentalViewport);
    const [selectedState, setSelectedState] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');

    const handleDistrictSelection = (stateAbbr: string, districtNum: string = '') => {
        setSelectedState(stateAbbr);
        setSelectedDistrict(districtNum);
    };

    const handleMapLoad = (mapRef) => {
        // @ts-ignore
        setMap(mapRef.getMap());
    };

    const filterDataset = () => {
        // @ts-ignore
        let existingFilter = map.getFilter('districts_hover');

        if (existingFilter[0] === 'all') {
            existingFilter = existingFilter[existingFilter.length - 1];
        }
        const filter = ['all'];
        // @ts-ignore
        if (selectedState) filter.push(['==', 'state', selectedState]);
        // @ts-ignore
        if (selectedDistrict) filter.push(['==', 'number', selectedDistrict]);

        const layerFilter = filter.concat([existingFilter]);

        // @ts-ignore
        map.setFilter('districts_hover', layerFilter);
        // @ts-ignore
        map.setFilter('districts_boundary', layerFilter);
        // @ts-ignore
        map.setFilter('districts_label', layerFilter);
        // @ts-ignore
        map.setFilter('districts_fill', layerFilter);
    };

    const filterUnderlyingStyle = () => {
        for (var i = 1; i <= 5; i++) {
            // @ts-ignore
            let existingFilter = map.getFilter('districts_' + i);
            if (existingFilter[0] === 'all') {
                existingFilter = existingFilter[existingFilter.length - 1];
            }
            const filter = ['all'];
            // @ts-ignore
            if (selectedState) filter.push(['==', 'state', selectedState]);
            // @ts-ignore
            if (selectedDistrict) filter.push(['==', 'number', selectedDistrict]);

            const layerFilter = filter.concat([existingFilter]);
            // @ts-ignore
            map.setFilter('districts_' + i, layerFilter);
            // @ts-ignore
            map.setFilter('districts_' + i + '_boundary', layerFilter);
            // @ts-ignore
            map.setFilter('districts_' + i + '_label', layerFilter);
        }
    };

    const focusMap = (stateAbbr, districtNum) => {
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
            // @ts-ignore
            map.easeTo(view);
        }
    };

    return (
        <Map
            map={map}
            setMap={setMap}
            viewport={viewport}
            setViewport={setViewport}
            handleMapLoad={handleMapLoad}
            mapLoaded={mapLoaded}
            setMapLoaded={setMapLoaded}
            focusMap={focusMap}
            filterDataset={filterDataset}
            selectedState={selectedState}
            selectedDistrict={selectedDistrict}
            handleDistrictSelection={handleDistrictSelection}
        />
    );
}

const mapStateToProps = state => {
    return {
        bboxes: state.states.bboxes,
    };
}

export default connect(mapStateToProps)(CongressMap);