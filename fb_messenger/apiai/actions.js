"use strict";
const fb_messaging = require('../messaging.js');
const fb_sample = require('../templates/sample_listing.js');
const templateGeneration = require('../../generateResourceListing.js');
const config = require('../../conf.js');
const meetup = require('../../meetup_api.js');
const templating = require('../../generateResourceListing.js');
const messaging = require('../messaging.js');

module.exports.requestUserLocation = function (sender, action, message, contexts, parameters) {
    var replies = [{"content_type":"location"}];
    fb_messaging.sendQuickReply(sender, message, replies, "request_location");
}

//// parameters
//module.exports.findResource = async function (sender, action, message, contexts, parameters){
//    // send text response from API.ai to user first
//    fb_messaging.sendTextMessage(sender, message);
//    var usrLocation = parameters.location;
//    //fb_messaging.sendTemplateMessage(sender, fb_sample.samplePayload);
//    let latitude = usrLocation.latitude;
//    let longitude = usrLocation.longitude;
//    let resource_categories = await askdarcel_querying.getCategoryMapping();
//    let resource_id = resource_categories.get(parameters["resource-category"]);
//
//    let resources = await askdarcel_querying.getResourcesByIdLoc(resource_id, longitude,latitude);
//    resources = resources["resources"];
//    let templateMessage = templateGeneration.generateListing(resources, 4);
//    console.log(templateMessage);
//    fb_messaging.sendTemplateMessage(sender, templateMessage);
//}
//
module.exports.findMeetups = async function (sender, action, message, contexts, parameters) {
    let usrLocation = parameters.location;
    let query = parameters.term ? parameters.term : parameters.fallback_term;
    let latitude = usrLocation.latitude;
    let longitude = usrLocation.longitude;
    let end_date = parameters.date.length==0? undefined: parameters.date;

    console.log("Got location from user: ",latitude, longitude);
    console.log("end_date=", end_date);
    let events = await meetup.findEvents(longitude, latitude, query, end_date);
    events = events['events'];
    if (events.length == 0) {
        messaging.sendTextMessage(sender, "Sorry, I can't find any events.");
    } else {
        let payload = templating.generateListing(events);
        messaging.sendTemplateMessage(sender, payload);
    }
}
