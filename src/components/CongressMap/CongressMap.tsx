import React, { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Map as TMap } from 'mapbox-gl';
import { continentalViewport, layerIds } from '../../constants';
import Map from '../Map';
import MenuTree from '../MenuTree/MenuTree';
import InfoBox from '../InfoBox/InfoBox';
import { setDistrictFillByParty, setDistrictHoverState, filterDataset, focusMap } from './mapEffects';
import { addDistrictBoundaryLayer, addDistrictFillLayer, addDistrictHoverLayer, addDistrictLabelLayer, addDistrictSource } from "./mapLayers";

interface ICongressMapProps {
    bboxes?: any;
    legislatorIndex?: any;
}

const CongressMap = (props: ICongressMapProps) => {
    const { bboxes, legislatorIndex } = props;

    const [map, setMap] = useState<TMap | null>(null);
    const [mapFullyLoaded, setMapFullyLoaded] = useState(false);
    const [viewport, setViewport] = useState(continentalViewport);
    const [expanded, setExpanded] = useState(false);
    const [district, setDistrict] = useState({});
    const [selectedState, setSelectedState] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [hoveredDistrictId, setHoveredDistrictId] = useState(null);

    const usePrevious = (value) => {
        const ref = useRef();
        useEffect(() => {
            ref.current = value;
        });
        return ref.current;
    }

    const prevHoveredDistrictId = usePrevious(hoveredDistrictId);

    useEffect(() => {
        if (map && mapFullyLoaded) {
            if (prevHoveredDistrictId) {
                setDistrictHoverState(map, prevHoveredDistrictId!, false)
            }
            setDistrictHoverState(map, hoveredDistrictId!, true);
        }
    }, [map, mapFullyLoaded, prevHoveredDistrictId, hoveredDistrictId]);

    const addLayers = useCallback(() => {
        addDistrictSource(map!);
        addDistrictBoundaryLayer(map!);
        addDistrictLabelLayer(map!);
        addDistrictHoverLayer(map!);
    }, [map]);

    const onMapFullLoad = useCallback(() => {
        if (!legislatorIndex.AK) {
            setTimeout(onMapFullLoad, 100);
        } else {
            addDistrictFillLayer(map!);
            setDistrictFillByParty(map!, legislatorIndex);
        }
    }, [map, legislatorIndex]);

    useEffect(() => {
        if (mapFullyLoaded) {
            addLayers();
            onMapFullLoad();
        }
    }, [
        mapFullyLoaded,
        addLayers,
        onMapFullLoad,
    ]);

    useEffect(() => {
        if (map) {
            setDistrictFillByParty(map!, legislatorIndex);
        }
    }, [map, legislatorIndex]);

    useEffect(() => {
        if (map && (selectedState || selectedDistrict)) {
            // filterUnderlyingStyle();
            filterDataset(map, selectedState, selectedDistrict);
            focusMap(map, bboxes, selectedState, selectedDistrict);
        }
    }, [map, bboxes, selectedState, selectedDistrict]);

    const handleDistrictSelection = (stateAbbr: string, districtNum: string = '') => {
        setSelectedState(stateAbbr);
        setSelectedDistrict(districtNum);
    };

    const handleMapClick = (evt) => {
        if (map) {
            const features = map.queryRenderedFeatures(evt.point);
            let district;

            const rFilteredDistricts = features.filter(feature => {
                return layerIds.indexOf(feature.layer.id) !== -1;
            });
            if (rFilteredDistricts.length) {
                district = rFilteredDistricts[0];
                focusMap(
                    map,
                    bboxes,
                    district.properties.state,
                    district.properties.number
                );
                setDistrict(district);
                setExpanded(true);
                return;
            }
            setDistrict({});
            setExpanded(false);
        }
    };

    const handleMouseMove = (evt) => {
        if (map && mapFullyLoaded) {
            const features = map.queryRenderedFeatures(evt.point);
            let cursorStyle = '';

            // Make sure the district we are hovering is being displayed by the filter
            const hoveredDistrict = features.filter(feature => {
                return layerIds.indexOf(feature.layer.id) !== -1;
            });

            if (hoveredDistrict.length) {
                cursorStyle = 'pointer';
                //@ts-ignore
                setHoveredDistrictId(hoveredDistrict[0].id);
            }

            //TODO: Fix this - it's not changing the cursor
            map.getCanvas().style.cursor = cursorStyle;
        }
    };

    return (
        <div id="main-container">
            <MenuTree
                handleSelection={handleDistrictSelection}
            />

            <Map
                map={map}
                setMap={setMap}
                setMapFullyLoaded={setMapFullyLoaded}
                viewport={viewport}
                setViewport={setViewport}
                handleMapClick={handleMapClick}
                handleMouseMove={handleMouseMove}
            />

            <InfoBox
                district={district}
                expanded={expanded}
                closeClick={() => setExpanded(false)}
            />
        </div>
    );
}

const mapStateToProps = state => {
    return {
        bboxes: state.states.bboxes,
        legislatorIndex: state.legislators.legislatorsByState,
    };
}

export default connect(mapStateToProps)(CongressMap);
