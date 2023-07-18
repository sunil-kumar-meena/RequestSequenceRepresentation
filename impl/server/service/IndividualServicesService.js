'use strict';

const ForwardingAutomationServiceWithResponse = require('./individualServices/ForwardingAutomationServiceWithResponse');
const prepareForwardingAutomation = require('./individualServices/PrepareForwardingAutomation');



/**
 * Initiates authentication of the user and updating the flow visualization page with information about flow
 *
 * body V1_updateflowvisualizationpage_body 
 * user String User identifier from the system starting the service call
 * originator String 'Identification for the system consuming the API, as defined in  [/core-model-1-4:control-construct/logical-termination-point={uuid}/layer-protocol=0/http-client-interface-1-0:http-client-interface-pac/http-client-interface-configuration/application-name]' 
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * returns List
 **/
exports.updateFlowVisualizationPage1 = function(body,user,originator,xCorrelator,traceIndicator,customerJourney) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "x-correlator" : "550e8400-e29b-11d4-a716-446655440000",
  "trace-indicator" : "1.1",
  "user" : "User Name",
  "originator" : "Resolver",
  "application-name" : "CurrentController",
  "operation-name" : "/v1/provide-current-controller",
  "response-code" : 200
}, {
  "x-correlator" : "550e8400-e29b-11d4-a716-446655440000",
  "trace-indicator" : "1",
  "user" : "User Name",
  "originator" : "x:akta",
  "application-name" : "Resolver",
  "operation-name" : "/v1/resolve-get-request",
  "response-code" : 200
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

exports.updateFlowVisualizationPage = function (body, user, originator, xCorrelator, traceIndicator, customerJourney, operationServerName) {
  let response = {};
  return new Promise(async function (resolve, reject) {
    try {

      /****************************************************************************************
       * Setting up required local variables from the request body
       ****************************************************************************************/
      let flowToBeChecked = body["x-correlator"];
      let latestMatch = 0;
      let numberOfRecords = 500;
      

      /****************************************************************************************
       * Prepare attributes to automate forwarding-construct
       ****************************************************************************************/
      let forwardingAutomationInputList = await prepareForwardingAutomation.updateFlowVisualizationPage(
        flowToBeChecked,
        latestMatch,
        numberOfRecords
      );
      let headers = {
        user,
        xCorrelator,
        traceIndicator,
        customerJourney
      }

      let recordListResponse = await ForwardingAutomationServiceWithResponse.automateForwardingConstructAsync(
        forwardingAutomationInputList[0],
        headers
      );
      
      /****************************************************************************************
       * Setting 'application/json' response body
       ****************************************************************************************/
      response['application/json'] = recordListResponse.data;
    } catch (error) {
      reject(error);
    }
    if (Object.keys(response).length > 0) {
      resolve(response[Object.keys(response)[0]]);
    } else {
      resolve();
    }
  });
}

