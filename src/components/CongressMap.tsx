import React, { useState } from 'react';
import { continentalViewport } from '../constants';
import Map from './Map';

interface ICongressMapProps {
}

const CongressMap = (props: ICongressMapProps) => {
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

    return (
        <Map
            map={map}
            setMap={setMap}
            viewport={viewport}
            setViewport={setViewport}
            handleMapLoad={handleMapLoad}
            mapLoaded={mapLoaded}
            setMapLoaded={setMapLoaded}
            filterDataset={filterDataset}
            selectedState={selectedState}
            selectedDistrict={selectedDistrict}
            handleDistrictSelection={handleDistrictSelection}
        />
    );
}

export default CongressMap;
