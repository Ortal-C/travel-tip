export const mapService = {
    initMap,
    addMarker,
    panTo
}

import { locService } from './loc.service.js';

var gMap;

function initMap(lat = 32.085300, lng = 34.781769) {
    let infoWindow;
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 14
            })
            infoWindow = new google.maps.InfoWindow();
            console.log('Map!', gMap, gMap.center);
            // google.maps.event.addListener(gMap, "click", (event) => {
            gMap.addListener("click", (event) => {
                const pos = {
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng()
                }
                console.log(event.latLng.lat(), event.latLng.lng());
                console.log('Map', gMap.center.lat(), gMap.center.lng());
                infoWindow.setPosition(pos);
                infoWindow.setContent("Location found.");
                infoWindow.open(gMap);
                gMap.setCenter(pos);
            });
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    //TODO: Enter your API Key
    // const API_KEY = 'AIzaSyCjX1gvqOY0fpuqdi5Uqny6MDtVKqOX2rU';
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = "https://maps.googleapis.com/maps/api/js?key=&callback=mapReady";
    // elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}