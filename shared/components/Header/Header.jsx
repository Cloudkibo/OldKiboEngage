import React, { PropTypes } from 'react';
import { Link } from 'react-router';

function Header() {
  return (
              <div>
                   <div className ="pre-header">
                    <div className = "container">
                      <div className = "row">
                        <div className = "col-md-6 col-sm-6 additional-shop-info">
                            <ul className = "list-unstyled list-inline">
                              <li>
                                <i className='fa fa-phone'/>
                                <span> 1-425-890-9414</span>
                              </li>
                              <li>
                                  <i className='fa fa-envelope-o'/>
                                  <Link to='/contact'/>
                                  <span> support@cloudkibo.com</span>
                              </li>
                            </ul>
                       </div>

                      <div  className ="col-md-6 col-sm-6 additional-nav">
                          <ul className = "list-unstyled list-inline pull-right">
                                          <li>
                                            <Link to='/login'> Login </Link>
                                          </li>
                                          <li>
                                          <Link to='/signup'> Signup </Link>
                                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  </div>
                  <div className = "header">
                    <div className = "container">
                        <Link to="/" className ="site-logo"> KiboEngage</Link>
                    </div>
                  </div>
              </div>

);
}


export default Header;
