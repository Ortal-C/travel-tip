import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';
import { utils } from './services/utils.service.js';

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onDeleteLoc = onDeleteLoc;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onSearchLoc = onSearchLoc;

function onInit() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const lat = +urlParams.get('lat')
    console.log(lat);
    const lng = +urlParams.get('lng')
    console.log(lng);
    if (lat && lng) onPanTo(+lat, +lng)

    mapService.initMap().then((map) => {
        map.addListener('click', addMapListener);
    });
    onGetLocs();
}

function addMapListener(ev) {
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
    this.setCenter(pos);
    onGetLocs();
}

function onSearchLoc() {
    const searchKey = document.querySelector('.input-search').value;
    mapService.getGeoLoc(searchKey).then((res) => {
        console.log('res', res);
        onGetLocs();
        onPanTo(res.lat, res.lng);
    });
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

function onAddMarker() {
    console.log('Adding a marker');
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
    locService.getLocs().then(renderLocs);
}

function renderLocs(locs) {
    var strHtml = `<table><thead>
    <th>Name</th>
    <th>Lat</th>
    <th>Lng</th>
    <th>added at</th>
    <th>Go</th>
    <th>Delete</th>
    </thead><tbody>`;
    for (const loc in locs) {
        const value = locs[loc];
        strHtml += `<tr>
            <td>${value.name}</td>
            <td>${value.lat}</td>
            <td>${value.lng}</td>
            <td>${utils.getDate(value.createdAt)}</td>
            <td><button class="btn-go" onclick="onPanTo('${value.lat}','${value.lng
            }')">Go</button></td>
            <td><button class="btn-delete" onclick="onDeleteLoc('${value.name
            }')">Delete</button></td>
        </tr>`;
    }
    strHtml += '</tbody></table>';
    document.querySelector('.user-locations').innerHTML = strHtml;
}

function onGetUserPos() {
    getPosition()
        .then((pos) => onPanTo(pos.coords.latitude, pos.coords.longitude))
        .catch((err) => {
            console.log('Can not find user position', err);
        });
}

function onPanTo(lat, lng) {
    mapService.panTo(lat, lng);
}

function onDeleteLoc(name) {
    locService.deleteLoc(name);
    onGetLocs();
}
