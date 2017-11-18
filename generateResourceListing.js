'use strict';

// Generate a List template of resources. 
// 
module.exports.generateListing = function (events){
    let fbPayload = {
        template_type: "list", 
        top_element_style: "compact", 
        elements: []
    }
    for (let i=0; i<events.length; i++) {
        let e = events[i];
        let listItem = {
            title: e.name, 
            subtitle: e.description, 
            buttons: [
                {
                    title: "Get Details",
                    type: "postback", 
                    payload: "GET_EVENT_DETAILS"+"|"+e.id+"|"+e.group.urlname
                }
            ]
        }
        fbPayload.elements.push(listItem);
    }

    return fbPayload;
}

//module.exports.generateResourceGeneric = function (resource) {
//    let resource = resource["resource"];
//    let fbPayload = {
//        template_type: "generic", 
//        elements: [{
//            title: resource.name,
//            subtitle: resource.long_description,
//            buttons: [
//                {
//                    title: "Directions", 
//                    type: "postback", 
//                    // not working atm
//                    payload: "GET_DIRECTIONS"+"|",
//                }, 
//                {
//                    title: "Website", 
//                    type: "web_url", 
//                    url: "https//askdarcel.org/resource?id="+resource.id
//                }]
//        }]
//    }
//
//    return fbPayload;
//}
