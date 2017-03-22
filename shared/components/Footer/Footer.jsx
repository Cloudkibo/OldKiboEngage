import React from 'react';

function Footer() {
  return (
   <div className="footer">
    <div className ="container">
      <div className="col-md-6 col-sm-6 padding-top-10">
           2014-2017 © KiboEngage. ALL Rights Reserved.
      </div>
      <div className="col-md-6 col-sm-6">
         <ul className="social-footer list-unstyled list-inline pull-right">
           <li>
              <a href='javascript:;'>
                <i className="fa fa-facebook"/>
              </a>
          </li>
          <li>
            <a href='javascript:;'>
                <i className="fa fa-google-plus"/>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>

 );
}

export default Footer;
