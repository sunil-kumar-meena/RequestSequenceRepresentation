import React from 'react';
import './index.css';
import Spinner from '../../Spinner/Spinner';
import SequenceDiagram from 'react-sequence-diagram';

export const FlowDiagram = (props) => {
    let flowList = formulateFlowList(props.input);
    const options = {
        theme: 'simple'
    };

    function onError(error) {
        console.log(error);
    }

    function formulateFlowList(input) {
        let map = new Map();
        let traceIndicatorInput = [];
        let formulatedFlowList = [];
        if (!(input instanceof Array)) {
            return formulatedFlowList;
        }
        input.forEach((trace) => {
            map.set(trace["trace-indicator"], trace);
            traceIndicatorInput.push(trace["trace-indicator"]);
        });
        traceIndicatorInput.sort();
        let flowList = findNextSequence({
            start: traceIndicatorInput[0],
            sequenceList: []
        }, traceIndicatorInput);

        let completeFlow = [];
        flowList.forEach(element => {
            let trace = formulateTrace(element.previousHop, element.sequenceList)
            if (trace.length == 0) {
                trace.push(element.previousHop + " --> " + element.nextHop);
            }
            trace.forEach(element => {
                completeFlow.push(element);
            });
        });

        console.log(completeFlow);
        formulatedFlowList = formulateFlowDiagramInput(map, completeFlow);
        console.log(formulatedFlowList);
        return formulatedFlowList;
    }


    function formulateTrace(previousHop, sequenceList) {
        let flowDetailsList = [];
        sequenceList.forEach(element => {
            let hop = previousHop;
            if (element.sequenceList.length == 0) {
                hop = hop + " --> " + element.previousHop + " --> " + element.nextHop;
                flowDetailsList.push(hop);
            } else {
                let nextHop = formulateTrace(element.previousHop, element.sequenceList);
                nextHop.forEach(element => {
                    let newHop = hop + " --> " + element;
                    flowDetailsList.push(newHop);
                });
            }
        });
        return flowDetailsList;
    }

function findNextSequence(current, traceIndicatorList) {
  traceIndicatorList.forEach(traceIndicator => {
      if (traceIndicator.startsWith(current.start + ".")) {
          let slicedTraceIndicator = traceIndicator.slice(current.start.length);
          let isEligibleForNext = slicedTraceIndicator.split(".").length == 2 ? true : false;
          if (isEligibleForNext) {
              let newSequence = current.start + " --> " + traceIndicator;
              let currentSequenceList = current.sequenceList;
              let ifSequenceAlreadyExist = false;
              if (currentSequenceList.length > 0) {
                  currentSequenceList.forEach(element => {
                      let sequenceIdentifier = element.trace;
                      if (sequenceIdentifier == newSequence) {
                          ifSequenceAlreadyExist = true;
                      }
                  });
              }
              if (!ifSequenceAlreadyExist) {
                  let newSequenceInstance = {
                      trace: newSequence,
                      previousHop: current.start,
                      nextHop: traceIndicator,
                      start: traceIndicator,
                      sequenceList: []
                  };
                  current.sequenceList.push(newSequenceInstance);
                  newSequenceInstance.sequenceList = findNextSequence(newSequenceInstance, traceIndicatorList);
              }
          }
      }
  });
  return current.sequenceList;
}

function formulateFlowDiagramInput(map, completeFlow) {
  let FlowDiagramInputList = [];
  completeFlow.forEach(element => {
      let flowSplit = element.split(" --> ");
      let sequenceStringForAFlow = "";
      flowSplit.forEach(flowElement => {
          let traceContent = map.get(flowElement);
          let origination = traceContent["originator"];
          let destination = traceContent["application-name"];
          let responseCode = traceContent["response-code"];
          let serviceName = traceContent["operation-name"];
          let traceNote = "Note right of " + origination + ": " + flowElement + "\n"
          let connector;
          if (responseCode.toString().startsWith("2")) {
              connector = "->";
          } else {
              connector = "-->";
          }
          sequenceStringForAFlow = sequenceStringForAFlow +
              traceNote +
              origination + connector + destination + ": " + serviceName + "\n" + 
              destination + connector + origination + ": " + "ResponseCode " + responseCode + "\n" ;
      });
      FlowDiagramInputList.push(sequenceStringForAFlow);
  });
  return FlowDiagramInputList;
}

let flowNumber = 1;
  if (props.isLoading) {
        return (<Spinner />)
    } else {
return (
  <div>
  {   
  flowList.map(element => (    
    <div>
    <div className="flex"></div>
    <div className="flex flow-diagram-section">
        <div className="flow section">
        <h2 className='form-title'>Flow {flowNumber++}</h2>
        <div className='flow-diagram'>
        <SequenceDiagram input={element} options={options} onError={onError} />
        </div>
        </div>
      </div>
      </div>
  ))}
  </div>    

        )
    }
}