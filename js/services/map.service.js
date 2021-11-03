export const mapService = {
    initMap,
    addMarker,
    panTo
}

var gMap;
var gNextId = 0;

function initMap(lat = 31.91100, lng = 35.00576) {
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            console.log('Map!', gMap, gMap.center);
            gMap.addListener("click", (event) => {
                // google.maps.event.addListener(gMap, "click", (event) => {
                var lat = event.latLng.lat()
                var lng = event.latLng.lng()
                console.log(lat, lng);
                // var placeName = prompt('Enter place name');
                // onAddPlace(placeName, lat, lng)
                console.log('Map', gMap.center.lat(), gMap.center.lng());
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