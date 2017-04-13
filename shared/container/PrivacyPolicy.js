import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Header from '../components/Header/Header.jsx';
import Footer from '../components/Footer/Footer.jsx';

class PrivacyPolicy extends Component {
  constructor(props, context) {
       super(props, context);
    
  }


 
  render() {
    return (
      <div className="corporate">
     <div className="pre-header">
        <div className="container">
            <div className="row">
                 <div className="col-md-6 col-sm-6 additional-shop-info">
                    <ul className="list-unstyled list-inline">
                        <li><i className="fa fa-phone"></i><span>1-425-890-9414</span></li>
                        <li><i className="fa fa-envelope-o"></i><span>support@cloudkibo.com</span></li>
                        <li><button onClick={this.handleClick}> Live Help </button></li>
                        <li><button onClick={this.handleBotClick}> Chat Bot Help </button></li>
                    </ul>
                </div>
               
                <div className="col-md-6 col-sm-6 additional-nav">
                    <ul className="list-unstyled list-inline pull-right">
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
      <div className="header">
          <div className="container">
                 <Link to="/" className ="site-logo"> KiboEngage</Link>
                 <div className="header-navigation pull-right font-transform-inherit">
                 <ul>
                    <li className="dropdown">
                      <a className="dropdown-toggle" data-toggle="dropdown" data-target="#" href="javascript:;">
                      Home 
                      
                    </a>
                      
                   </li>
                    <li className="dropdown">
                      <a className="dropdown-toggle" data-toggle="dropdown" data-target="#" href="javascript:;">
                        Features 
                        
                      </a>
                        
                    </li>
                    <li className="dropdown">
                      <a className="dropdown-toggle" data-toggle="dropdown" data-target="#" href="javascript:;">
                      About Us
                        
                      </a>
                    </li>
                    <li className="dropdown">
                      <a className="dropdown-toggle" data-toggle="dropdown" data-target="#" href="javascript:;">
                        Developers
                      </a>
                        
                    </li>
                    <li className="dropdown">
                      <a className="dropdown-toggle" data-toggle="dropdown" data-target="#" href="javascript:;">
                        Contact Us
                        
                      </a>
                        
                    </li>

                   <li className="dropdown dropdown-megamenu">
                    <a className="dropdown-toggle" data-toggle="dropdown" data-target="#" href="javascript:;">
                      User Guide
                      
                    </a>
                  </li>   
                </ul>
                </div>
    
          </div>
        </div>

     
      <div className ="main">
      <div className ="container">
        <h1>Application Privacy Statement </h1>
        <p> 
            This privacy statement (“Privacy Statement”) applies to the treatment of personally identifiable information submitted by, or otherwise obtained from, you in connection with the associated application (KiboEngage). 
            The Application is provided by CloudKibo. By using or otherwise accessing the Application, you acknowledge that you accept the practices and policies outlined in this Privacy Statement. 
        </p>

        <h3> What personal information does Cloudkibo collect? </h3>
        <p>
             We collect the following types of information from our facebook users: 
             <br/>
             <br/>
             <ol>
              <li> 
              <h4>Personal Information You Provide to Us: </h4>
              We may receive and store any information you submit to the KiboEngage (or otherwise authorize us to obtain – such as, from (for example) your Facebook account). The types of personal information collected may include your full name, email address, gender, IP address, browser information, username, profile picture, demographic information, and any other information necessary for us to provide the Application services. 
              </li>
              <br/>
              <li>

              <h4>Personal Information Collected Automatically:</h4>
              We receive and store certain types of usage related information whenever you interact with KiboEngage. For example, CloudKibo may automatically receive and record information regarding your computer’s IP address, browser information, Facebook user ID. Such information may be shared in aggregate (non-personally identifiable) form with our partners. 
              </li>

             </ol>
        </p>

        <h3>How does CloudKibo use the information it collected? </h3>

        <p> CloudKibo uses the information described in this Privacy Statement  internally, to enable customer support agents to communicate with the facebook users through facebook messenger. The collected information will be displayed to customer support agent. 
        </p>
       </div>
       </div>
      <br/>
      <br/>
      <br/>
      <br/>
    
    <div className="footer">
      <div className="container">
        <div className="row">
       
          <div className="col-md-6 col-sm-6 padding-top-10">
            2014-2017 © KiboEngage. ALL Rights Reserved.
          </div>
        </div>
       </div>
       </div> 

      </div>

    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(PrivacyPolicy);
