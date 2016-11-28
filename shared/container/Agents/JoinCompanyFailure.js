import React, { Component,PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/SideBar/SideBar.jsx';

class JoinCompanyFailure extends React.Component {


  render() {

    return (
        <div>
                <div  className="pageContainer">
                     <Header/>
                    <div className = "mainBody">
                      <div className ="row margin-bottom-40">
                          <SideBar/>
                          <div className="col-md-9 col-sm-9">
                            <h1>Link Expired!</h1>
                            <div className="content-form-page">
                                <div className ="row">
                                  <div className ="col-md-7 col-sm-7">
                                        <p>The link to join company has been expired. Please contact your admin.</p>
                                  <br/>
                                  <br/>
                                  <br/>
                                  <Link to="/" className='btn-password btn btn-send'>
                                   Go to Home Page
                                  </Link>
                                  </div>
                                  </div>
                                  </div>


                                  </div>

                              <div id="topcontrol" title="Scroll Back to Top">
                              <img src="/img/up.png"/>
                              </div>

                    </div>
                    </div>


        <Footer/>
      </div>
  </div>
);

}
}



export default JoinCompanyFailure;
