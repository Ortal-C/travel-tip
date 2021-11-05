export const locService = {
	getLocs,
    getCurrLoc,
	setLocs,
    deleteLoc,
	getWeather
};

import { storage } from './storage.js';

var gNextId = 0;
const KEY = 'locsDB';
const KEY_CURR_lOC = 'currLoc';

function getLocs() {
    const locs = storage.load(KEY) || {}
	return new Promise(resolve => setTimeout(resolve, 200, locs));
}

function getCurrLoc(){
    const currLoc = storage.load(KEY_CURR_lOC ) || {}
    if (currLoc){
        return Promise.resolve(currLoc);
    }
}



function setLocs(name, lat, lng) {
	var locs = storage.load(KEY) || {};
	if (locs && locs[name]) {
        console.log('Already exists in DB.');
	} else {
		locs[name] = _createLoc(name, lat, lng);
		storage.save(KEY, locs);
	}
}

function deleteLoc(name){
    var locs = storage.load(KEY);
    if (!locs || !locs[name]) return;
    delete locs[name];
    storage.save(KEY, locs)
}

function getWeather(lat, lng) {
	return axios
		.get(`https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${+lat}&lon=${+lng}&APPID=API_KEY`)
		.then(res => res.data.main.temp);
}

function _createLoc(name = 'My place', lat, lng) {
	return {
		id: ++gNextId,
		name,
		lat,
		lng,
		weather: null,
		createdAt: Date.now(),
		updatedAt: Date.now(),
	};
}
