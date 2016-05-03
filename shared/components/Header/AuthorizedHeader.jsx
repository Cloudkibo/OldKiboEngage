import React, { Component,PropTypes } from 'react';
import { Link } from 'react-router';

export default class AuthorizedHeader extends Component
{

  render()
  {
    return (
      <div  className = "page-header-inner" >
          <div className = "page-logo" >
              <a href = '/' >
                <h4> Kibo Support System </h4>
              </a>
          </div >
             
          <p>You are loggedin {this.props.loggedin}</p>
             
    </div >

  );
  }
}

AuthorizedHeader.propTypes = {
  loggedin:PropTypes.string
}



export default AuthorizedHeader;
