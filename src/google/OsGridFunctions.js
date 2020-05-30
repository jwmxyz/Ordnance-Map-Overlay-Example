import OsGridRef, { LatLon } from "geodesy/osgridref";
import { GoogleConstants } from "../helpers/GoogleConstants";

let polygonGrid = []
let polygonGridToRender = {}

export const OsGridFunctions ={
    renderOsGridReference,
    renderAdvancedOsGridReference
}

/**
 * Function that will complete the render of polygons onto the map.
 * @param {} map 
 */
function renderAdvancedOsGridReference(map) {
    clearExistingGridFromMap()
    var zoomLevel = map.getZoom() < 3 ? 3 : map.getZoom();
    var scale = GoogleConstants.zoomScale[zoomLevel].gScale;
    var mapBounds = map.getBounds();
    var xOffset = Math.floor(getWestSide(map.getBounds().getSouthWest()) / scale) * scale;
    var yOffset = Math.floor(getSouthSide(map.getBounds().getSouthWest()) / scale) * scale;
    xOffset = xOffset < 0 ? 0 : xOffset;
    yOffset = yOffset < 0 ? 0 : yOffset;
    var left = new window.google.maps.LatLng({
        lat: mapBounds.getSouthWest().lat(),
        lng: mapBounds.getSouthWest().lng()
    });
    var right = new window.google.maps.LatLng({
        lat: mapBounds.getSouthWest().lat(),
        lng: mapBounds.getNorthEast().lng()
    });
    var horizonalLoop = Math.ceil(window.google.maps.geometry.spherical.computeDistanceBetween(left, right) / scale) + 1;
    var top = new window.google.maps.LatLng({
        lat: mapBounds.getSouthWest().lat(),
        lng: mapBounds.getSouthWest().lng()
    });
    var bottom = new window.google.maps.LatLng({
        lat: mapBounds.getNorthEast().lat(),
        lng: mapBounds.getSouthWest().lng()
    });
    var verticalLoop = Math.ceil(window.google.maps.geometry.spherical.computeDistanceBetween(bottom, top) / scale) + 1;
    createPolygonMatrix({
        x: xOffset,
        y: yOffset
    },
        horizonalLoop,
        verticalLoop,
        scale
    );

    Object.keys(polygonGridToRender).forEach(x => {
        var currobject = polygonGridToRender[x];
        var polygon = new window.google.maps.Polygon({
            paths: [
                currobject.left,
                currobject.right,
                currobject.topRight,
                currobject.topLeft
            ],
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 3,
            fillColor: '#000000',
            fillOpacity: 0.2,
            geodesic: true
        });

        polygon.setMap(map);
        polygonGrid.push(polygon);
    });
}


/**
 * Function that will create the polygon matrix of polygons that are to be rendered onto the map
 * @param {*} offsets The starting offset such that only the area on screen is rendered
 * @param {*} row  the number of rows required
 * @param {*} column The number of columns required
 * @param {*} size The size of the grids in metres.
 */
function createPolygonMatrix(offsets, row, column, size) {
    polygonGridToRender = {}

    var defaultSizeLat = 0;
    for (var i = 0; i < column; i++) {
        var rowWeight = offsets.y + defaultSizeLat;
        if (size + rowWeight >= 1300000) {
            continue;
        }
        var defaultSizeLng = 0;
        for (var j = 0; j < row; j++) {
            var columnWeight = offsets.x + defaultSizeLng;
            if (size + columnWeight >= 700000 || size + columnWeight < 0) {
                continue;
            }
            var latLng = new OsGridRef(columnWeight, rowWeight).toLatLon();
            var left = new window.google.maps.LatLng({
                lat: latLng.lat,
                lng: latLng.lng
            });
            latLng = new OsGridRef(size + columnWeight, rowWeight).toLatLon();
            var right = new window.google.maps.LatLng({
                lat: latLng.lat,
                lng: latLng.lng
            });
            latLng = new OsGridRef(columnWeight, size + rowWeight).toLatLon();
            var topLeft = new window.google.maps.LatLng({
                lat: latLng.lat,
                lng: latLng.lng
            });
            latLng = new OsGridRef(
                size + columnWeight,
                size + rowWeight
            ).toLatLon();
            var topRight = new window.google.maps.LatLng({
                lat: latLng.lat,
                lng: latLng.lng
            });

            var centrePointOsGrid = new OsGridRef(
                columnWeight + size / 2,
                rowWeight + size / 2
            ).toString(10);

            polygonGridToRender[centrePointOsGrid] = {
                left: left,
                right: right,
                topRight: topRight,
                topLeft: topLeft,
                count: 0,
                opacity: 0
            };
            defaultSizeLng += size;
        }
        defaultSizeLat += size;
    }
}


/**
 * Function that will complete the render of polygons onto the map.
 * @param {} map 
 */
function renderOsGridReference(map) {
    clearExistingGridFromMap()

    var column = 13;
    var row = 7;
    var size = 100000;
    createPolygonMatrix({x: 0, y: 0}, row, column, size)

    Object.keys(polygonGridToRender).forEach(x => {
        var currobject = polygonGridToRender[x];
        var polygon = new window.google.maps.Polygon({
            paths: [
                currobject.left,
                currobject.right,
                currobject.topRight,
                currobject.topLeft
            ],
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 3,
            fillColor: '#000000',
            fillOpacity: 0.2,
            geodesic: true
        });

        polygon.setMap(map);
        polygonGrid.push(polygon);
        var centreLat = (currobject.left.lat() + currobject.topRight.lat()) / 2
        var centreLng = (currobject.left.lng() + currobject.right.lng()) / 2
        new window.google.maps.Marker({
            position: new window.google.maps.LatLng({
                lat: centreLat,
                lng: centreLng
            }),
            label: x.substring(0,2),
            icon: 'hidden',
            map: map
        });
    });
}

/**
 * Method that gets the easting of the west side of the map
 * @param {*} southWest the southwest coordinates of the map
 */
function getWestSide(southWest) {
    var ref = new LatLon(southWest.lat(), southWest.lng());
    var osReference = null;
    try {
        osReference = ref.toOsGrid(LatLon.datums.OSGB36);
    } catch {
        return 0;
    }
    return osReference.easting;
}

/**
 * Method that gets the northing of the south side of the map
 * @param {*} southWest the southwest corners of the map
 */
function getSouthSide(southWest) {
    var ref = new LatLon(southWest.lat(), southWest.lng());
    var osReference = null;
    try {
        osReference = ref.toOsGrid(LatLon.datums.OSGB36);
    } catch {
        return 0;
    }
    return osReference.northing;
}

/**
 * Clears existing polygons from the map
 * @param {*} map the map we want to clear from.
 */
function clearExistingGridFromMap() {
    polygonGrid.forEach(x => {
        x.setMap(null);
        x = null;
    });
}
