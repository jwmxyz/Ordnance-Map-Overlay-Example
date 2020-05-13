import React from 'react';

class GoogleMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            googleMap: {},
        };
    }

    googleMapRef = React.createRef();

    componentDidMount() {
        let self = this;
        if (window.google == undefined) {
            const googleMapScript = document.createElement("script");
            googleMapScript.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyD_OQnW1d1XkEEQmimGB-7bI24VT9pYaQA&libraries=places&libraries=geometry,visualization";
            window.document.body.appendChild(googleMapScript);
            googleMapScript.addEventListener("load", function () {
                self.setState({ googleMap: self.createGoogleMap() });
            });
        }
    }

    createGoogleMap = () => {
        var map = new window.google.maps.Map(this.googleMapRef.current, {                                  
            zoom: 8,    
            center: new window.google.maps.LatLng(-24.939602, 31.578375), 
        });

        return map;
    }

    render() {
        return (
            <div
                id="google-map"
                ref={this.googleMapRef}
                style={{ width: "1000px", height: "500px", minHeight: "inherit" }}>
            </div>
        );
    }
}


export default GoogleMap;
