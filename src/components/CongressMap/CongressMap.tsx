import React, { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import geoViewport from "@mapbox/geo-viewport/index";
import { Map as TMap } from 'mapbox-gl';
import { continentalBbox, continentalViewport, layerIds } from '../../constants';
import Map from '../Map';
import MenuTree from '../MenuTree/MenuTree';
import InfoBox from '../InfoBox/InfoBox';
import { setDistrictFillByParty, setDistrictHoverState } from './mapEffects';
import { addDistrictBoundaryLayer, addDistrictFillLayer, addDistrictHoverLayer, addDistrictLabelLayer, addDistrictSource } from "./mapLayers";

interface ICongressMapProps {
    bboxes?: any;
    legislatorIndex?: any;
}

const CongressMap = (props: ICongressMapProps) => {
    const { bboxes, legislatorIndex } = props;

    const [map, setMap] = useState<TMap | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
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
        if (map && mapLoaded) {
            if (prevHoveredDistrictId) {
                setDistrictHoverState(map, prevHoveredDistrictId!, false)
            }
            setDistrictHoverState(map, hoveredDistrictId!, true);
        }
    }, [map, mapLoaded, prevHoveredDistrictId, hoveredDistrictId]);

    const addLayers = useCallback(() => {
        addDistrictSource(map!);
        addDistrictBoundaryLayer(map!);
        addDistrictLabelLayer(map!);
        addDistrictHoverLayer(map!);
    }, [map]);

    const onMapFullLoad = useCallback(() => {
        if (map && mapLoaded) {
            if (!map.loaded() || !map.isStyleLoaded() || !map.areTilesLoaded() || !legislatorIndex.AK) {
                setTimeout(onMapFullLoad, 100);
            } else {
                addDistrictFillLayer(map);
                setDistrictFillByParty(map, legislatorIndex);
            }
        }
    }, [map, mapLoaded, legislatorIndex]);

    useEffect(() => {
        if (map && mapLoaded) {
            addLayers();
            onMapFullLoad();
        }
    }, [
        map,
        mapLoaded,
        addLayers,
        onMapFullLoad,
    ]);

    useEffect(() => {
        if (map) {
            setDistrictFillByParty(map!, legislatorIndex);
        }
    }, [map, legislatorIndex]);

    const handleDistrictSelection = (stateAbbr: string, districtNum: string = '') => {
        setSelectedState(stateAbbr);
        setSelectedDistrict(districtNum);
    };

    const filterDataset = useCallback(() => {
        if (map) {
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
    }, [map, selectedState, selectedDistrict]);

    const filterUnderlyingStyle = useCallback(() => {
        if (map) {
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
    }, [map, selectedState, selectedDistrict]);

    const focusMap = useCallback((stateAbbr, districtNum) => {
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
    }, [bboxes, map]);

    const filterMap = useCallback(() => {
        if (map && (selectedState || selectedDistrict)) {
            // this.filterUnderlyingStyle();
            filterDataset();
            focusMap(selectedState, selectedDistrict);
        }
    }, [map, filterDataset, focusMap, selectedState, selectedDistrict]);

    useEffect(() => {
        filterMap();
    }, [filterMap, selectedState, selectedDistrict]);

    const handleMapClick = (evt) => {
        if (map) {
            const features = map.queryRenderedFeatures(evt.point);

            // console.log('features: ', features);

            let district;
            const rFilteredDistricts = features.filter(feature => {
                return layerIds.indexOf(feature.layer.id) !== -1;
            });
            if (rFilteredDistricts.length) {
                district = rFilteredDistricts[0];
            }

            if (!district) {
                setDistrict({});
                setExpanded(false);
                return;
            }

            focusMap(
                district.properties.state,
                district.properties.number
            );

            // this.props.map.setFeatureState({
            //   source: 'districts2018',
            //   sourceLayer: 'districts',
            //   id: district.id,
            // }, {
            //   color: true
            // });

            setDistrict(district);
            setExpanded(true);
            // console.log('district: ', district);
            // console.log('source: ', this.props.map.getSource('composite'));
            // console.log('layer: ', this.props.map.getLayer('districts'));
        }
    };

    const handleMouseMove = (evt) => {
        if (map && mapLoaded) {
            const features = map.queryRenderedFeatures(evt.point);

            let cursorStyle = '';

            // Make sure the district we are hovering is being displayed by the filter
            const hoveredDistrict = features.filter(feature => {
                return layerIds.indexOf(feature.layer.id) !== -1;
            });

            if (hoveredDistrict.length) {
                // Make sure the cursor is a pointer over any visible district.
                cursorStyle = 'pointer';
                // set the hovered district id
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
                setMapLoaded={setMapLoaded}
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
