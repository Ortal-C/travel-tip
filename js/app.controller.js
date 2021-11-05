import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';
import { utils } from './services/utils.service.js';

window.onload = onInit;
window.onPanTo = onPanTo;
window.onDeleteLoc = onDeleteLoc;
window.showLocs = showLocs;
window.onGetUserPos = onGetUserPos;
window.onSearchLoc = onSearchLoc;
window.onCopyLocation = onCopyLocation;

function onInit() {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const lat = +urlParams.get('lat');
	const lng = +urlParams.get('lng');
	mapService.initMap().then((map) => {
		map.addListener('click', addMapListener);
		if (lat && lng) onPanTo(lat, lng);
	});
	showLocs();
}

function onCopyLocation() {
	locService.getCurrLoc().then((loc) => {
		var str = `https://ortal-c.github.io/travel-tip/index.html?lat=${+loc.lat}&lng=${+loc.lng}`;
		navigator.clipboard.writeText(str);
		const elBtn = document.querySelector('.btn-copy-location');
		elBtn.innerText = 'Copied!';
		setTimeout(() => {
			elBtn.innerText = 'Copy current location 📄';
		}, 3000);
	});
}

function addMapListener(ev) {
	//TODO: function can stay here / move to service
	let infoWindow = new google.maps.InfoWindow();
	console.log('infoWindow:', infoWindow);
	const pos = {
		lat: ev.latLng.lat(),
		lng: ev.latLng.lng(),
	};
	const name = prompt('Enter name:');
	locService.setLocs(name, pos.lat, pos.lng);
	infoWindow.setPosition(pos);
	infoWindow.setContent(name);
	infoWindow.open(this);
	showLocs();
	onPanTo(name, pos.lat, pos.lng);
}

function onSearchLoc() {
	const searchKey = document.querySelector('.input-search').value;
	mapService.getGeoLoc(searchKey).then((res) => {
		console.log('res', res);
		showLocs();
		onPanTo(res.lat, res.lng);
	});
}

function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

function showLocs() {
	locService.getLocs().then(renderLocs);
}

function renderLocs(locs) {
    var strHtml = `
	<h3>My saved locations</h3>
	<table><thead>
    <th>Name</th>
    <th>Lat</th>
    <th>Lng</th>
    <th>Added at</th>
    <th>Go</th>
    <th>Delete</th>
    </thead><tbody>`;
	for (const loc in locs) {
		const value = locs[loc];
		strHtml += `<tr>
            <td>${value.name}</td>
            <td>${value.lat.toFixed(5)}</td>
            <td>${value.lng.toFixed(5)}</td>
            <td>${utils.getDate(value.createdAt)}</td>
            <td><button class="btn-go" onclick="onPanTo('${value.name}', '${value.lat}','${value.lng}')" title="See location in map">👀</button></td>
            <td><button class="btn-delete" onclick="onDeleteLoc('${value.name}')" title="Delete location">❌</button></td>
			</tr>`;
		}
	strHtml += '</tbody></table>';
	document.querySelector('.user-locations').innerHTML = strHtml;
	renderWeather();
}

function onGetUserPos() {
	getPosition()
		.then(pos => onPanTo(pos.coords.latitude, pos.coords.longitude))
		.catch(err => console.log('Can not find user position', err));
}

function onPanTo(name, lat, lng) {
	mapService.panTo(lat, lng); 
	renderWeather(name, lat, lng)
}

function onDeleteLoc(name) {
	locService.deleteLoc(name);
	showLocs();
}

function renderWeather(name, lat, lng) {
	locService.getWeather(lat, lng).then(weather =>{
		document.querySelector(`.weather-container`).innerHTML =
		`<h3>Current temperature in ${name}</h3>
		${weather}°C`;
	})
}
