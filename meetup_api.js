"use strict";

const config = require("./conf.js");
const rp = require('request-promise-native');

const BASE_URL = config.MEETUP_URL;

module.exports.findEvents = async function (lon, lat, q, end_date) {
    let options = {
        uri: BASE_URL+"/find/upcoming_events",
        qs: {
            key: config.MEETUP_API_KEY,
            lon: lon, 
            lat: lat, 
            end_date_range: end_date,
            text: q,
            page: "4"
        },
        transform: function (body) {
            return JSON.parse(body);
        },
        method: 'GET'
    }

    try {
        return await rp(options);
    } catch (err) {
        console.log(err); 
    }
}

module.exports.getEventDetails = async function (id, urlname) {
    let options = {
        uri: BASE_URL+"/"+urlname+"/events/"+id,
        transform: function (body) {
            return JSON.parse(body);
        }, 
        method: "GET"
    }
    try {
        return await rp(options);
    } catch (err) {
        console.log(err);
    }
}
