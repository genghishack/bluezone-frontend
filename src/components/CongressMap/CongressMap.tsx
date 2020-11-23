import React, { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Map as TMap } from 'mapbox-gl';
import { continentalViewport, layerIds } from '../../constants';
import Map from '../Map';
import { setDistrictFillByParty, setDistrictHoverState, filterDataset, focusMap } from './mapEffects';
import { addDistrictBoundaryLayer, addDistrictFillLayer, addDistrictHoverLayer, addDistrictLabelLayer, addDistrictSource } from "./mapLayers";

interface ICongressMapProps {
  selectedState: string;
  selectedDistrict: string;
  setDistrict: Function;
  setInfoTrayExpanded: Function;
  bboxes?: any;
  legislatorIndex?: any;
}

const CongressMap = (props: ICongressMapProps) => {
  const { 
    selectedState, 
    selectedDistrict, 
    setDistrict, 
    setInfoTrayExpanded, 
    bboxes, 
    legislatorIndex 
  } = props;

  const [map, setMap] = useState<TMap | null>(null);
  const [mapFullyLoaded, setMapFullyLoaded] = useState(false);
  const [viewport, setViewport] = useState(continentalViewport);
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
        setInfoTrayExpanded(true);
        return;
      }
      setDistrict({});
      setInfoTrayExpanded(false);
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
    <Map
      map={map}
      setMap={setMap}
      setMapFullyLoaded={setMapFullyLoaded}
      viewport={viewport}
      setViewport={setViewport}
      handleMapClick={handleMapClick}
      handleMouseMove={handleMouseMove}
    />
  );
}

const mapStateToProps = state => {
  return {
    bboxes: state.states.bboxes,
    legislatorIndex: state.legislators.legislatorsByState,
  };
}

export default connect(mapStateToProps)(CongressMap);
