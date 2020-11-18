import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import geoViewport from "@mapbox/geo-viewport/index";
import { continentalBbox, continentalViewport, layerIds } from '../constants';
import Map from './Map';
import MenuTree from './MenuTree/MenuTree';
import InfoBox from './InfoBox/InfoBox';

interface ICongressMapProps {
    bboxes?: any;
}

const CongressMap = (props: ICongressMapProps) => {
    const { bboxes } = props;

    const [mapLoaded, setMapLoaded] = useState(false);
    // const [map, setMap] = useStateWithCallback(null, () => onMapFullRender(map, setMapLoaded));
    const [map, setMap] = useState(null);
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

    const filterMap = () => {
        // this.filterUnderlyingStyle();
        filterDataset();
        focusMap(selectedState, selectedDistrict);
    };

    const handleMapClick = (evt) => {
        if (map) {
            // @ts-ignore
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

    useEffect(() => {
        if (map) {
            // remove the hover setting from whatever district was being hovered before
            if (prevHoveredDistrictId) {
                // @ts-ignore
                map.setFeatureState({
                    source: 'districts2018',
                    sourceLayer: 'districts',
                    id: prevHoveredDistrictId
                }, {
                    hover: false
                });
            }

            // Set hover to true on the currently hovered district
            // @ts-ignore
            map.setFeatureState({
                source: 'districts2018',
                sourceLayer: 'districts',
                id: hoveredDistrictId
            }, {
                hover: true
            });
        }
    }, [map, prevHoveredDistrictId, hoveredDistrictId]);

    const handleMouseMove = (evt) => {
        if (map && mapLoaded) {
            // @ts-ignore
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
                setHoveredDistrictId(hoveredDistrict[0].id);
            }

            //TODO: Fix this - it's not changing the cursor
            // @ts-ignore
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
                viewport={viewport}
                setViewport={setViewport}
                handleMapLoad={handleMapLoad}
                handleMapClick={handleMapClick}
                handleMouseMove={handleMouseMove}
                mapLoaded={mapLoaded}
                setMapLoaded={setMapLoaded}
                filterMap={filterMap}
                selectedState={selectedState}
                selectedDistrict={selectedDistrict}
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
    };
}

export default connect(mapStateToProps)(CongressMap);
