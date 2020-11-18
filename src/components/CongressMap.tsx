import React, { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import geoViewport from "@mapbox/geo-viewport/index";
import { continentalBbox, continentalViewport, layerIds } from '../constants';
import Map from './Map';
import MenuTree from './MenuTree/MenuTree';
import InfoBox from './InfoBox/InfoBox';

interface ICongressMapProps {
    bboxes?: any;
    legislatorIndex?: any;
}

const CongressMap = (props: ICongressMapProps) => {
    const { bboxes, legislatorIndex } = props;

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

    const addDistrictSource = useCallback(() => {
        if (map && mapLoaded) {
            //@ts-ignore
            if (!map.getSource('districts2018')) {
                //@ts-ignore
                map.addSource('districts2018', {
                    type: 'vector',
                    url: 'mapbox://genghishack.cd-116-2018'
                });
            }
        }
    }, [map, mapLoaded]);

    const addDistrictBoundariesLayer = useCallback(() => {
        if (map && mapLoaded) {
            //@ts-ignore
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
        }
    }, [map, mapLoaded]);

    const addDistrictLabelsLayer = useCallback(() => {
        if (map && mapLoaded) {
            //@ts-ignore
            map.addLayer({
                'id': 'districts_label',
                'type': 'symbol',
                'source': 'districts2018',
                'source-layer': 'districts',
                'layout': {
                    'text-field': '{title_short}',
                    'text-font': ['Open Sans Bold', 'Arial Unicode MS Regular'],
                    'text-size': { 'base': 1, stops: [[1, 8], [7, 18]] }
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
        }
    }, [map, mapLoaded]);

    const addDistrictHoverLayer = useCallback(() => {
        if (map && mapLoaded) {
            //@ts-ignore
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
        }
    }, [map, mapLoaded]);

    const addDistrictFillLayer = useCallback(() => {
        if (map && mapLoaded) {
            // @ts-ignore
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
        }
    }, [map, mapLoaded]);

    const setDistrictFillByParty = useCallback(() => {
        if (map && mapLoaded) {
            // @ts-ignore
            const features = map.querySourceFeatures('districts2018', {
                sourceLayer: 'districts',
                // filter: ['has', 'id']
            });
            // console.log('features: ', features);

            features.forEach(feature => {
                const stateAbbr = feature.properties.state;
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
                    // @ts-ignore
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
    }, [legislatorIndex, map, mapLoaded]);

    const onMapFullRender = useCallback(() => {
        if (map && mapLoaded) {
            //@ts-ignore
            const mapIsLoaded = map.loaded();
            //@ts-ignore
            const styleIsLoaded = map.isStyleLoaded();
            //@ts-ignore
            const tilesAreLoaded = map.areTilesLoaded();
            if (!mapIsLoaded || !tilesAreLoaded || !styleIsLoaded || !legislatorIndex.AK) {
                setTimeout(onMapFullRender, 200);
            } else {
                addDistrictFillLayer();
                setDistrictFillByParty();
            }
        }
    }, [map, mapLoaded, addDistrictFillLayer, setDistrictFillByParty, legislatorIndex.AK]);

    useEffect(() => {
        addDistrictSource();
        addDistrictBoundariesLayer();
        addDistrictLabelsLayer();
        addDistrictHoverLayer();
        onMapFullRender();
    }, [
        map,
        mapLoaded,
        addDistrictSource,
        addDistrictBoundariesLayer,
        addDistrictLabelsLayer,
        addDistrictHoverLayer,
        onMapFullRender,
    ]);

    useEffect(() => {
        setDistrictFillByParty();
    }, [legislatorIndex, setDistrictFillByParty]);

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
        legislatorIndex: state.legislators.legislatorsByState,
    };
}

export default connect(mapStateToProps)(CongressMap);
