'use strict';

var utils = require('../utils/writer.js');
var IndividualServices = require('../service/IndividualServicesService');

module.exports.updateFlowVisualizationPage = function updateFlowVisualizationPage (req, res, next, body, user, originator, xCorrelator, traceIndicator, customerJourney) {
  IndividualServices.updateFlowVisualizationPage(body, user, originator, xCorrelator, traceIndicator, customerJourney)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
