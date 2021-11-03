export const locService = {
    getLocs,
    createLoc
}

import { storage } from './storage.js';

var gNextId = 0;
const KEY = 'locsDB'
const locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}

function createLoc(name = 'My place', lat, lng) {
    var loc = {
        id: gNextId++,
        name,
        lat,
        lng,
        weather: null,
        createdAt: Date.now(),
        updatedAt: Date.now()
    }
    locs.push(loc)
    storage.save(KEY, locs)
}