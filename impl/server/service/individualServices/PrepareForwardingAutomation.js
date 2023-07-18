const prepareALTForwardingAutomation = require('onf-core-model-ap-bs/basicServices/services/PrepareALTForwardingAutomation');
const forwardingConstructAutomationInput = require('onf-core-model-ap/applicationPattern/onfModel/services/models/forwardingConstruct/AutomationInput');
const OnfAttributeFormatter = require('onf-core-model-ap/applicationPattern/onfModel/utility/OnfAttributeFormatter');

exports.OAMLayerRequest = function (uuid) {
    return new Promise(async function (resolve, reject) {
        let forwardingConstructAutomationList = [];
        try {

            /***********************************************************************************         
                        forwardings for application layer topology            
             *************************************************************************************/
            let applicationLayerTopologyForwardingInputList = await prepareALTForwardingAutomation.getALTForwardingAutomationInputForOamRequestAsync(
                uuid
            );

            if (applicationLayerTopologyForwardingInputList) {
                for (let i = 0; i < applicationLayerTopologyForwardingInputList.length; i++) {
                    let applicationLayerTopologyForwardingInput = applicationLayerTopologyForwardingInputList[i];
                    forwardingConstructAutomationList.push(applicationLayerTopologyForwardingInput);
                }
            }
            resolve(forwardingConstructAutomationList);
        } catch (error) {
            reject(error);
        }
    });
}

exports.updateFlowVisualizationPage = function (xCorrelator, latestMatch, numberOfRecords) {
    return new Promise(async function (resolve, reject) {
        let forwardingConstructAutomationList = [];
        try {
            let forwardingAutomation;

            /***********************************************************************************
             * NewApplicationCausesRequestForTopologyChangeInformation /v1/redirect-topology-change-information
             ************************************************************************************/
            let retrievingListOfRecordsForwardingName = "RequestForVisualizingFlowCausesRetrievingListOfRecordsIfAuthenticationSucceeds";
            let retrievingListOfRecordsContext;
            let retrievingListOfRecordsRequestBody = {};
            retrievingListOfRecordsRequestBody.xCorrelator = xCorrelator;
            retrievingListOfRecordsRequestBody.latestMatch = latestMatch;
            retrievingListOfRecordsRequestBody.numberOfRecords = numberOfRecords;

            topologyChangeInformationRequestBody = OnfAttributeFormatter.modifyJsonObjectKeysToKebabCase(retrievingListOfRecordsRequestBody);
            forwardingAutomation = new forwardingConstructAutomationInput(
                retrievingListOfRecordsForwardingName,
                retrievingListOfRecordsRequestBody,
                retrievingListOfRecordsContext
            );
            forwardingConstructAutomationList.push(forwardingAutomation);
            resolve(forwardingConstructAutomationList);
        } catch (error) {
            reject(error);
        }
    });
}