import OsGridRef, { LatLon } from "geodesy/osgridref";

let polygonGrid = []

export const OsGridFunctions ={
    renderOsGridReference
}

/**
 * Function that will complete the render of polygons onto the map.
 * @param {} map 
 */
function renderOsGridReference(map) {
    var column = 10;
    var row = 7;
    var size = 100000;

    var defaultSizeLat = 0;
    for (var i = 0; i < column; i++) {
        var rowWeight = defaultSizeLat;
        if (rowWeight >= 1400000) {
            continue;
        }
        var defaultSizeLng = 0;
        for (var j = 0; j < row; j++) {
            var columnWeight = defaultSizeLng;
            if (columnWeight >= 800000 || columnWeight < 0) {
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

            var centreLng = (right.lng() + left.lng()) / 2;
            var centreLat = (topRight.lat() + right.lat()) /2; 
            
            var centrePointOsGrid = new OsGridRef(
                columnWeight + size / 2,
                rowWeight + size / 2
            ).toString(2).substring(0,2);

            var polygon = new window.google.maps.Polygon({
                paths: [
                    left,
                    right,
                    topRight,
                    topLeft
                ],
                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                strokeWeight: 3,
                geodesic: true
            });

            var marker = new window.google.maps.Marker({
                position: new window.google.maps.LatLng({
                    lat: centreLat,
                    lng: centreLng
                }),
                label: centrePointOsGrid,
                icon: 'hidden',
                map: map
            });

            marker.set(map)
            polygon.setMap(map);
            polygonGrid.push(polygon);

            defaultSizeLng += size;
        }
        defaultSizeLat += size;
    }
}
