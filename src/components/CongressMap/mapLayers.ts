import { Map as TMap } from 'mapbox-gl';


export const addDistrictSource = (map: TMap) => {
    if (!map.getSource('districts2018')) {
        map.addSource('districts2018', {
            type: 'vector',
            url: 'mapbox://genghishack.cd-116-2018'
        });
    }
};

export const addDistrictBoundaryLayer = (map: TMap) => {
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
};

export const addDistrictLabelLayer = (map: TMap) => {
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
};

export const addDistrictHoverLayer = (map: TMap) => {
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
                'rgba(123, 104, 238, 0.3)',
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
};

export const addDistrictFillLayer = (map: TMap) => {
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
