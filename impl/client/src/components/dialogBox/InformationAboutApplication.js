import React from 'react'
import { ReactDialogBox } from 'react-js-dialog-box'
import 'react-js-dialog-box/dist/index.css'
import infoImage from '../../images/Information.svg.png';
import axios from 'axios';
import randExp from 'randexp';

import './dialogBox.css';

class InformationAboutApplication extends React.Component {
  constructor() {
    super()
    this.state = {
      isOpen: false,
      data:{}
    }
  }

  openBox = async () => {
    this.setState({
      data : await this.getApplicationInformation(),
      isOpen: true,
    })
  }

  closeBox = () => {
    this.setState({
      isOpen: false
    })
  }
  render() {
    return (
      <div>
        <a style={{color:'white'}} onClick={this.openBox} href='#'>
          info
        </a>
         {this.state.isOpen && (
          <><div>
            <i>
            <ReactDialogBox
              closeBox={this.closeBox}
              headerBackgroundColor='rgb(0, 102, 255)'
              headerTextColor='white'
              headerHeight='50px'
              closeButtonColor='white'
              bodyBackgroundColor='white'
              bodyTextColor='black'
              modalWidth='auto'
              headerText='Information about the application'
            >
              {this.getApplicationInformationPanel()}
            </ReactDialogBox>
            </i>
            </div>
          </>
        )}
      </div>
    )
  }  

  getApplicationInformationPanel(){
    return(
      <div>
        <table>
          <tr>
            <td>
            application-name
            </td>
            <td>
            {this.state.data["application-name"]} 
            </td>
          </tr>
          <tr>
            <td>
            release-number
            </td>
            <td>
            {this.state.data["release-number"]}
            </td>
          </tr>
          <tr>
            <td>
            application-purpose
            </td>
            <td>
            {this.state.data["application-purpose"]}
            </td>
          </tr>
          <tr>
            <td>
            data-update-period
            </td>
            <td>
            {this.state.data["data-update-period"]} 
            </td>
          </tr>
          <tr>
            <td>
            owner-name
            </td>
            <td>
            {this.state.data["owner-name"]}
            </td>
          </tr>
          <tr>
            <td>
            owner-email-address
            </td>
            <td>
            {this.state.data["owner-email-address"]}
            </td>
          </tr>
        </table>
      </div>
    );
  }

  async getApplicationInformation() {
    let applicationInformation = {};
    try {
        let requestHeader = {
            'accept': 'application/json',
            'user': 'RequestSequenceRepresentation',
            'originator': 'RequestSequenceRepresentation',
            'x-correlator': new randExp(/^[0-9A-Fa-f]{8}(?:-[0-9A-Fa-f]{4}){3}-[0-9A-Fa-f]{12}$/).gen(),
            'trace-indicator': '1',
            'customer-journey': 'Unknown value',
            'Content-Type': 'application/json'
        }
        let request = {
            method: "post",
            url: origin +"/v1/inform-about-application",
            headers: requestHeader
        }
        let response = await axios(request);
        if(response && response.data){
          applicationInformation = response.data;
        }
    } catch (error) {
      console.log(error);
    }      
    return applicationInformation;
  }
}

export default InformationAboutApplication;