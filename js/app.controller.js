import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { utils } from './services/utils.service.js'

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onDeleteLoc = onDeleteLoc;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;

function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready');
        })
        .catch(() => console.log('Error: cannot init map'));
}



// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker');
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
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
                console.log(value);
                strHtml += 
                `<tr>
                    <td>${value.name}</td>
                    <td>${value.lat}</td>
                    <td>${value.lng}</td>
                    <td>${utils.getDate(value.createdAt)}</td>
                    <td><button class="btn-go" onclick="onPanTo('${value.lat}','${value.lng}')">Go</button></td>
                    <td><button class="btn-delete" onclick="onDeleteLoc('${value.id}','${value.name}')">Delete</button></td>
                </tr>`
            }
            strHtml+='</tbody></table>'
            document.querySelector('.user-locations').innerHTML = strHtml;
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

function onPanTo(lat, lng) {
    mapService.panTo(lat, lng);
}
function onDeleteLoc(id, name) {
    console.log('Mefanek in delete', id, name);
}