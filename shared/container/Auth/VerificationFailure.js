import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer.jsx';
import SideBarr from '../../components/SideBar/SideBar.jsx';

class VerificationFailure extends Component {

 constructor(props, context) {
    super(props, context);
    
    
  }
  render() {
        return (
          <div  className="pageContainer">
                     <Header/>
                        <div className = "mainBody">
                            <div className ="row margin-bottom-40">
                              <SideBarr/>
                               <div className="col-md-9 col-sm-9"> 
                                    <h1>Link Expired!</h1>
                                     <div className="content-form-page">
                                        <div className ="row">
                                          <div className ="col-md-7 col-sm-7">
                                            <p>The verification link has been expired. It is expired within 4 hours.</p>
                                            <p>Please login and apply for new verification link.</p>
                                              <br/>
                                              <br/>
                                              <br/>
                                              <Link to="/login" className='btn-password btn btn-send'>
                                               Go to Login Page
                                              </Link>
                                          </div>
                                        </div>
                                      </div>        
                             
                                </div>
                              
                            </div>
                        </div>
                        </div> 
        )
 
  

}
}



export default VerificationFailure;

