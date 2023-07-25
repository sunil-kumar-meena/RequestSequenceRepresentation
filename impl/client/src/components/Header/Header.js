import React, { Component } from 'react'
import LogoImage from '../../images/Telefonica_logo.png';
import './Header.css';

export class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <header className="header">
        <div className="header-container">
          <div>
            <img className="logo" src={LogoImage} alt="Logo" />
          </div>
          <div className="header-title-container">
            <h1 className='header-text'>Request Sequence Representation</h1>
          </div>
        </div>
      </header>
    )
  }
}
export default Header;