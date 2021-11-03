export const locService = {
	getLocs,
	setLocs,
};

import { storage } from './storage.js';

var gNextId = 0;
const KEY = 'locsDB';

function getLocs() {
    const locs = storage.load(KEY) || {}
	return new Promise(resolve => setTimeout(resolve, 2000, locs));
}

function _createLoc(name = 'My place', lat, lng) {
	return {
		id: gNextId++,
		name,
		lat,
		lng,
		weather: null,
		createdAt: Date.now(),
		updatedAt: Date.now(),
	};
}

function setLocs(name, lat, lng) {
	var locs = storage.load(KEY) || {};
	if (locs && locs[name]) {
		console.log('exists');
	} else {
		locs[name] = _createLoc(name, lat, lng);
		storage.save(KEY, locs);
	}
}
