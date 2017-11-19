"use strict";

const templating = require('../generateResourceListing.js');
const messaging = require('./messaging.js');
const meetup = require('../meetup_api.js');

module.exports.handleGetEventDetails = async function (sender, postback_payload, sessionIDs) {
    console.log("Received postback with content ", postback_payload[1], postback_payload[2]);
    let details = await meetup.getEventDetails(postback_payload[1], postback_payload[2]);
    let payload = templating.generateEventGeneric(details);
    console.log(payload);
    messaging.sendTemplateMessage(sender, payload);
}
