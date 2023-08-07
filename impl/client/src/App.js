import { useState } from 'react'
import { AdvancedForm } from './components/forms/AdvancedForm'
import { FlowDiagram } from './components/forms/Flow/FlowDiagram'
import {Buffer} from 'buffer';
import axios from 'axios';
import randExp from 'randexp';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

export default function App() {
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
      if(recordList.data != undefined){
        recordListLength = recordList.data.length
      }else{
        recordListLength = recordList.length 
      }
      if(recordListLength == 0){
        errorMessage = true
        if(recordList.status == 200){
          message = "No data found"
          classname = "alert alert-warning"
        }
        else if(recordList.status != 200){
          message = "Error in fetching data"
          classname = "alert alert-danger"
        }
      }
      
      let listOfRecords = {
        "recordList": recordList.data,
        "errorMessage": errorMessage,
        "message": message,
        "css": classname 
      }
      setFlowValues(listOfRecords);
      setLoader(false)
    });
    
    await new Promise((r) => setTimeout(r, 1000))
    setSubmitting(false)
  }

  const numberOfRecordsArray = [];
  for(let i=0;i<10000;i++){
    let numberOfRecords =  { label: i, value: i };
    numberOfRecordsArray.push(numberOfRecords);
  }

  const formSchema = [
    { name: 'xCorrelator', label: 'x-correlator', componentType: 'text', required: true },
    { name: 'username', label: 'Username', componentType: 'text', required: true },
    { name: 'password', label: 'Password', componentType: 'password', required: true },
  ]

  return (
    <>
      <Header />
      <div className="flex">
        <div className="form section mr-top-100">
          { (flowValues.errorMessage) ? <div className={flowValues.css}>{flowValues.message}</div>: '' }
          <AdvancedForm schema={formSchema} onSubmit={handleSubmit} />
        </div>
      </div>
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
        listOfRecords = (await axios(request));
    } catch (error) {
        console.log(error);
    }    
    return listOfRecords;
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
}