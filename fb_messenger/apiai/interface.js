"use strict";
const actions = require('./actions.js');
const fb_messaging = require('../messaging.js');
const config = require('../../conf.js');
const apiai = require('apiai');
const utils = require('../../utils.js');

module.exports = {
    handleApiAiResponse: handleApiAiResponse, 
    handleApiAiAction: handleApiAiAction, 
    sendToApiAi: sendToApiAi,       
    sendEventToApiAi: sendEventToApiAi
}

const apiAiService = apiai(config.API_AI_CLIENT_ACCESS_TOKEN, {
    language: "en",
    requestSource: "fb"
});

function handleApiAiResponse(sender, response) {
    let responseText = response.result.fulfillment.speech;
    let responseData = response.result.fulfillment.data;
    let messages = response.result.fulfillment.messages;
    let action = response.result.action;
    let contexts = response.result.contexts;
    let parameters = response.result.parameters;

    console.log("Data from api.ai:");
    console.log(response.result);

    fb_messaging.sendTypingOff(sender);
    
    if (messages.length == 0 && !utils.isDefined(action)){
        console.log('Unknown query' + response.result.resolvedQuery);
        fb_messaging.sendTextMessage(sender, "I'm not sure what you want. Can you be more specific?");
    } else {
        console.log(messages);
        //Facebook doesn't send messages in order, join the messages together for now
//        for (let msg of messages) {
//            console.log("Sending message from handleApiAiAction");
//            // not differentiating between default text message and custom payloads for now.
//            fb_messaging.sendTextMessage(sender, msg.speech);
//        }
        let final_msg = "";
        for (let m of messages) {
            final_msg = final_msg.concat(m.speech);
        }
        handleApiAiAction(sender, action, final_msg, contexts, parameters);
    }
}

function handleApiAiAction(sender, action, message, contexts, parameters) {
    switch (action) {
        case 'request_location': //asks the user to share their location
            actions.requestUserLocation(sender, action, message, contexts, parameters);
            break;
        case 'find_meetups': //search for resource with given location
            actions.findMeetups(sender, action, message, contexts, parameters);
            break;
        default:
            fb_messaging.sendTextMessage(sender, message);
    }
}

function sendToApiAi(sender, sessionID, text) {

    fb_messaging.sendTypingOn(sender);
    let apiaiRequest = apiAiService.textRequest(text, {
        sessionId: sessionID
    });

    apiaiRequest.on('response', (response) => {
        if (utils.isDefined(response.result)) {
            handleApiAiResponse(sender, response);
        }
    });

    apiaiRequest.on('error', (error) => console.error(error));
    apiaiRequest.end();
}

function sendEventToApiAi(sender, sessionID, event_obj) {
    fb_messaging.sendTypingOn(sender);
    let apiaiRequest = apiAiService.eventRequest(event_obj, {
        sessionId: sessionID
    });

    apiaiRequest.on('response', (response) => {
        if (utils.isDefined(response.result)) {
            handleApiAiResponse(sender, response);
        }
    });

    apiaiRequest.on('error', (error) => console.error(error));
    apiaiRequest.end();
}
