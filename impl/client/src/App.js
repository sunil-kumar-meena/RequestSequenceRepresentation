import { useState } from 'react'
import { AdvancedForm } from './components/forms/AdvancedForm'
import { FlowDiagram } from './components/forms/Flow/FlowDiagram'
import {Buffer} from 'buffer';
import axios from 'axios';
import randExp from 'randexp';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import axiostime from 'axios-time'

const ERROR_MESSAGES = {
  "401" : "Username or Password is incorrect",
  "404" : "No data found",
  "500" : "Error in fetching data",
  "other" : "Error in fetching data"
}

const ERROR_STYLING = {
  "warning" : "alert alert-warning",
  "danger" : "alert alert-danger"
}
export default function App() {
  const [formValues, setFormValues] = useState([])
  const [flowValues, setFlowValues] = useState([])
  const [loader, setLoader] = useState(false) ;
  let errorMessage = false

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoader(true)
    let xCorrelator = values.xCorrelator;
    let userName = values.username;
    let password = values.password;
    let basicAuth = "Basic " + Buffer.from(userName + ":" + password).toString('base64');   

    setSubmitting(true)

    getListOfRecords(xCorrelator, basicAuth).then((recordList) => {
      let message;
      let classname
      let recordListLength;

      if(recordList.catch){
        recordListLength = 0;
        message = recordList.message
        errorMessage = true
        classname = ERROR_STYLING.danger
      }else{
        if(recordList.data != undefined){
          recordListLength = recordList.data.length
        }else{
          recordListLength = recordList.length 
        }

        if(recordListLength == 0){
          errorMessage = true
          if(recordList.status == 200){
            message = ERROR_MESSAGES[404]
            classname = ERROR_STYLING.warning
          }
          else if(recordList.status != 200){
            message = ERROR_MESSAGES[401]
            classname = ERROR_STYLING.danger
          }
        }
      }
      
      let listOfRecords = {
        "recordList": recordList.data,
        "errorMessage": errorMessage,
        "message": message,
        "css": classname 
      }
      setFormValues(recordList.data);
      setFlowValues(listOfRecords);
      setLoader(false)
      handleFailedConnector(recordList)
      handleConnectorAndResponseTextPosition(recordList)
    })
    setSubmitting(false)
  }

  const formSchema = [
    { name: 'username', label: 'Username', componentType: 'text', required: true },
    { name: 'password', label: 'Password', componentType: 'password', required: true },
    { name: 'xCorrelator', label: 'x-correlator', componentType: 'text', required: true },
  ]

  return (
    <>
      <Header />
      <div className="flex form-container">
        <div className="form section mr-top-100">
          { (flowValues.errorMessage) ? <div className={flowValues.css}>{flowValues.message}</div>: '' }
          <AdvancedForm schema={formSchema} onSubmit={handleSubmit} />
        </div>
      </div>
      <br/>
      {
        (formValues != undefined && formValues.length > 0) ? <div className="flexLog"><div className="results section"><pre>"{JSON.stringify(formValues, null, 2)}"</pre></div></div> : ""
      }
      <br/>

      <FlowDiagram input={flowValues.recordList} isLoading = {loader} setLoading = {setLoader} />
      <Footer />
    </>
  )

  async function getListOfRecords(xCorrelator, basicAuth) {
    let listOfRecords = [];
    try {
        let requestHeader = {
            'accept': 'application/json',
            'user': 'RequestSequenceRepresentation',
            'originator': 'RequestSequenceRepresentation',
            'x-correlator': getRandomXCorrelator(),
            'trace-indicator': '1',
            'customer-journey': 'Unknown value',
            'Authorization': basicAuth,
            'Content-Type': 'application/json'
        }
    
        let requestBody = {
            "x-correlator": xCorrelator
        };
        let request = {
            method: "post",
            url: origin +"/v1/update-flow-visualization-page",
            headers: requestHeader,
            data: requestBody
        }
        axiostime(axios)
        listOfRecords = (await axios(request));
        return listOfRecords;
    } catch (error) {
        let listOfRecords;
        let message
        if(error.toString().includes("401")){
          message = ERROR_MESSAGES[401]
        }else if(error.toString().includes("500")){
          message = ERROR_MESSAGES[500]
        }else{
          message = ERROR_MESSAGES.other
        }

        listOfRecords = {
          "message" : message,
          "catch" : true
        }

        return listOfRecords;
    }    
    
}

function getRandomXCorrelator() {
    let randomXCorrelatorString;
    try {
        randomXCorrelatorString = new randExp(/^[0-9A-Fa-f]{8}(?:-[0-9A-Fa-f]{4}){3}-[0-9A-Fa-f]{12}$/).gen();
    } catch (error) {
        console.log("error");
        console.log(error);
    }
    return randomXCorrelatorString;
}

  /**
   * Function is to change Response text position and it's connector position
   */
  function handleConnectorAndResponseTextPosition(recordList){
    setTimeout(()=>{
      const FlowDiagramTexts = document.querySelectorAll('text tspan');
      let FlowDiagramResponsePath;
      let FlowDiagramTextParent
      let isResponseCodeTest
      let FlowDiagramResponsePathCoordinates
      let PathCoordinatesArray
      let PathCoordinatesArrayLastValue
      let PathCoordinatesChanged
      let FlowDiagramTextParentYaxis
      let regularExpress

      FlowDiagramTexts.forEach((FlowDiagramText)=>{
        isResponseCodeTest = FlowDiagramText.innerHTML.includes("ResponseCode")
        if(isResponseCodeTest){
          FlowDiagramTextParent = FlowDiagramText.parentElement
          FlowDiagramResponsePath = FlowDiagramTextParent.nextElementSibling
          FlowDiagramTextParentYaxis = FlowDiagramTextParent.getAttribute("y")
          FlowDiagramResponsePathCoordinates = FlowDiagramResponsePath.getAttribute("d")
          PathCoordinatesArray = FlowDiagramResponsePathCoordinates.split(',')
          PathCoordinatesArrayLastValue = PathCoordinatesArray[PathCoordinatesArray.length - 1]
          regularExpress = new RegExp('('+ PathCoordinatesArrayLastValue +')','gi')
          PathCoordinatesChanged = FlowDiagramResponsePathCoordinates.replace(regularExpress, FlowDiagramTextParentYaxis)
          FlowDiagramResponsePath.setAttribute("d",PathCoordinatesChanged)
          FlowDiagramTextParent.setAttribute("y",PathCoordinatesArrayLastValue)          
        }
      })
    },recordList.timings)
  }

  /**
   * Function is to change style for failed connectors
   */
  function handleFailedConnector(recordList){
    setTimeout(()=>{
      const path = document.querySelectorAll('[stroke-dasharray="6,2"]');
      path.forEach((element)=>{
        element.setAttribute("stroke", "red")
        let markerEnd = element.getAttribute("marker-end")
        let markerId = markerEnd.replace(/(url\(\#)|(\))/gi,'')
        let markerElement = document.getElementById(markerId)
        let markerAttributes = {
          "markerWidth": "20",
          "markerHeight": "20",
          "refX": "9.5",
          "refY": "11.5"
        }
        setMultipleAttributes(markerElement,markerAttributes)
        let markerChild = document.querySelector("#"+markerId + " use")
        markerChild.remove()
        markerElement.innerHTML += '<path fill="none" stroke="red" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.758 17.243L12.001 12m5.243-5.243L12 12m0 0L6.758 6.757M12.001 12l5.243 5.243"></path>'
      })
      for(let i =0; i< path.length; i++){
          path[i].setAttribute("stroke", "red")
      }
    },recordList.timings)
  }

  function setMultipleAttributes(markerElement, attribute){
    for(let key in attribute){
      markerElement.setAttribute(key,attribute[key])
    }
  }
}