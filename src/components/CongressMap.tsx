import React, { useState } from 'react';
import Map from './Map';

interface ICongressMapProps {
}

const CongressMap = (props: ICongressMapProps) => {
    const [mapLoaded, setMapLoaded] = useState(false);
    // const [map, setMap] = useStateWithCallback(null, () => onMapFullRender(map, setMapLoaded));
    const [map, setMap] = useState(null);
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

    return (
        <Map
            map={map}
            setMap={setMap}
            handleMapLoad={handleMapLoad}
            mapLoaded={mapLoaded}
            setMapLoaded={setMapLoaded}
            selectedState={selectedState}
            selectedDistrict={selectedDistrict}
            handleDistrictSelection={handleDistrictSelection}
        />
    );
}

export default CongressMap;
