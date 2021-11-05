export const mapService = {
	initMap,
	addMarker,
	panTo,
	getGeoLoc,
};

import { locService } from './loc.service.js';
import { storage } from './storage.js';

var gMap;

function initMap(lat = 32.0853, lng = 34.781769) {
	return _connectGoogleApi().then(() => {
		gMap = new google.maps.Map(document.querySelector('#map'), {
			center: { lat, lng },
			zoom: 14,
		});
		return gMap;
	});
}

function addMarker(loc) {
	var marker = new google.maps.Marker({
		position: loc,
		map: gMap,
		title: 'Hello World!',
	});
	return marker;
}

function panTo(lat, lng)  {
	var laLatLng = new google.maps.LatLng(lat, lng);
	gMap.panTo(laLatLng);
    const pos =  {lat, lng};
    storage.save('currLoc', pos)
}

function getGeoLoc(key) {
	return axios
		.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${key}&key=API_KEY`)
		.then((res) => {
			//data.results[0].geometry.location.lat
			console.log(res);
			var {lat,lng}=res.data.results[0].geometry.location
			const loc = {
				name: key,
				lat,
				lng,
			};
			locService.setLocs(loc.name, loc.lat, loc.lng);
		
			return loc;
		});
}

function _connectGoogleApi() {
	if (window.google) return Promise.resolve();
	var elGoogleApi = document.createElement('script');
	elGoogleApi.src =
		'https://maps.googleapis.com/maps/api/js?key=&callback=mapReady';
	elGoogleApi.async = true;
	document.body.append(elGoogleApi);

	return new Promise((resolve, reject) => {
		elGoogleApi.onload = resolve;
		elGoogleApi.onerror = () => reject('Google script failed to load');
	});
}