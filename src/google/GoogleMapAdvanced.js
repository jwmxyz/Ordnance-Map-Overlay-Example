import React from 'react';
import { OsGridFunctions } from './OsGridFunctions';

class GoogleMapAdvanced extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            googleMap: {},
        };
    }

    googleMapRef = React.createRef();

    componentDidMount() {
        let self = this;
        if (window.google === undefined) {
            const googleMapScript = document.createElement("script");
            googleMapScript.src = "https://maps.googleapis.com/maps/api/js?key=API_KEY&libraries=places&libraries=geometry,visualization";
            window.document.body.appendChild(googleMapScript);
            googleMapScript.addEventListener("load", function () {
                self.setState({ googleMap: self.createGoogleMap() }, () => {
                    self.addEventListeners()
                });
            });
        } else {
            self.setState({ googleMap: self.createGoogleMap() }, () => {
                self.addEventListeners()
            });
        }
    }
    
    addEventListeners = () =>{
        let state = this.state;
        window.google.maps.event.addListener(
            state.googleMap,
            "dragend",
            function () {
                OsGridFunctions.renderAdvancedOsGridReference(state.googleMap)
            }
        );
        window.google.maps.event.addListener(
            state.googleMap,
            "zoom_changed",
            function () {
                OsGridFunctions.renderAdvancedOsGridReference(state.googleMap)
            }
        );
    }


    createGoogleMap = () => {
        var map = new window.google.maps.Map(this.googleMapRef.current, {                                  
            zoom: 9,    
            scaleControl: true,
            center: new window.google.maps.LatLng(53.67, -1.86), 
        });
        return map;
    }

    render() {
        return (
            <div>
                <div><span>Drag/Zoom in or out to show the grid</span></div>
                <div id="google-map"
                ref={this.googleMapRef}
                style={{ width: "100vw", height: "85vh", minHeight: "inherit" }}></div>
            </div>
        );
    }
}


export default GoogleMapAdvanced;