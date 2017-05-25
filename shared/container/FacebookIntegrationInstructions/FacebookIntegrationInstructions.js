import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router'

class FacebookIntegrationInstruction extends Component {

  constructor(props, context) {

    //call action to get user teams
    if(props.userdetails.accountVerified == "No"){
      browserHistory.push('/notverified');
    }

    const usertoken = auth.getToken();
    console.log('componentWillMount is called');
    super(props, context);
  }

  render() {
    const token = auth.getToken()
    console.log(token)

    return (
     <div className="vbox viewport">
        <AuthorizedHeader name = {this.props.userdetails.firstname} user={this.props.userdetails}/>
        <div className="page-container hbox space-between">
          <SideBar isAdmin ={this.props.userdetails.isAdmin}/>
          <div className="page-content-wrapper">
            <div className="page-content">
              <h3 className ="page-title">Facebook Integration - Instructions </h3>
              <ul className="page-breadcrumb breadcrumb">
                <li>
                  <i className="fa fa-home"/>
                  <Link to="/dashboard"> Dashboard </Link>
                  <i className="fa fa-angle-right"/>
                </li>
                <li>
                  <Link to="/instructionsforintegratingfacebook">Facebook Integration - Instructions</Link>
                </li>
              </ul>
              <div className="portlet box grey-cascade">
                <div className="portlet-title">
                  <div className="caption">
                    <i className="fa fa-group"/>
                    Facebook Integration - Instructions
                  </div>
                </div>
                <div className="portlet-body">
                  In order to integrate Facebook with KiboEngage Dashboard please follow the steps described below.
                  <br /><br />
                  <ol>
                    <li>Setting up a Facebook App and Page</li>
                    <li>Configuring KiboEngage Webhook in the Facebook App</li>
                    <li>Add Facebook Page Information in KiboEngage Dashboard</li>
                    <li>Testing Facebook Chat</li>
                  </ol>
                  <h4><b>1. Setting up a Facebook App and Page</b></h4>
                    <ul>
                      <li>Log in to the <a href="https://developers.facebook.com/">Facebook Developer Console</a> and select 'Add a New App' from the 'My Apps' menu.</li>
                      <br /><br />
                      <img src="../../FacebookIntegration/AddNewApp.png" style={{width: '600px'}}></img>
                      <br /><br />
                      <li>Provide the app name, email address, choose a category, and click 'Create App ID'.</li>
                      <br /><br />
                      <img src="../../FacebookIntegration/CreateNewApp.png" style={{width: '600px'}}></img>
                      <br /><br />
                      <li>In the Product Setup, click on 'Get Started' in the Messenger section.</li>
                      <br /><br />
                      <img src="../../FacebookIntegration/ProductSetup.png" style={{width: '600px'}}></img>
                      <br /><br />
                      <li>On the Messenger Platform welcome page, click 'Get Started'.</li>
                      <br /><br />
                      <img src="../../FacebookIntegration/MessengerPlatform.png" style={{width: '600px'}}></img>
                      <br /><br />
                      <li>On the next page, select a Facebook page in the Token Generation section. If you don't have a Facebook page yet, you'll need to create one.</li>
                      <br /><br />
                      <img src="../../FacebookIntegration/FBSelectPage.png" style={{width: '600px'}}></img>
                      <br /><br />
                      <li>After you have selected a page, you will see your Page Access Token. Copy it to the clipboard.</li>
                      <br /><br />
                      <img src="../../FacebookIntegration/PageAccessToken.png" style={{width: '600px'}}></img>
                      <br /><br />
                    </ul>
                  <h4><b>2. Configuring KiboEngage Webhook in the Facebook App</b></h4>
                    <ul>
                      <li>Go back to the Facebook app settings and click 'Setup Webhooks' in the Webhook section.</li>
                      <br /><br />
                      <img src="../../FacebookIntegration/SetupWebhook.png" style={{width: '600px'}}></img>
                      <br /><br />
                      To set up the webhook, do the following:
                      <br /><br />
                      <ul>
                        <li>Insert this url "http://kiboengage.kibosupport.com/api/webhook" in the Callback Url field.</li>
                        <li>Fill in the verify token field with token VERIFY_ME</li>
                        <li>Check the "messages" and "messaging postbacks" checkboxes.</li>
                        <li>Click the 'Verify and Save' button and wait until the "Complete" status appears.</li>
                      </ul>
                      <img src="../../FacebookIntegration/WebhookSettings.png" style={{width: '600px'}}></img>
                      <br /><br />
                      <li>Select a Facebook page to subscribe your webhook to the page events.</li>
                      <br /><br />
                      <img src="../../FacebookIntegration/SelectPageWebhook.png" style={{width: '600px'}}></img>
                      <br /><br />
                      <li>After selecting a page, click on Subscribe button to subscribe your page.</li>
                      <br /><br />
                      <img src="../../FacebookIntegration/SubscribePage.png" style={{width: '600px'}}></img>
                      <br /><br />
                    </ul>
                  <h4><b>3. Add Facebook Page Information in KiboEngage Dashboard</b></h4>
                    <ul>
                      <li>Once you have configured the KiboEngage webhook, go to KiboEngage Dashboard and click on Facebook Pages.
                      On Facebook Pages Management click on Add Facebook Page button and enter the information.</li>
                      <br />
                      Please note that:
                      <ul>
                        <li>You need to enter the valid information, otherwise Facebook Chat will not work.</li>
                        <li>You can easily get your Facebook page ID from Facebook page address.</li>
                        <li>Facebook page name and Page title must be same.</li>
                        <li>You can get the App ID from Facebook Developer Console.</li>
                        <li>Page token is your Page Access Token. The one you have copied to clipboard.</li>
                        </ul>
                      <img src="../../FacebookIntegration/AddFBPage.png" style={{width: '600px'}}></img>
                      <br /><br />
                      <li>After adding Facebook page information Facebook Messenger will be integrated with KiboEngage. But only admin and testers would be able to chat.</li>
                      <br />
                      <li>In order to make it public you will be required to publish the Facebook page.</li>
                      <br /><br />
                    </ul>
                  <h4><b>4. Testing Chat</b></h4>
                    <ul>
                      <li>Now you can test the Facebook Chat by sending a message to your Facebook page.
                      If both agent and Facebook customer is able to send and receive the messages
                      then you have successfully integrated the Facebook Messenger. Enjoy!!</li>
                      <br /><br />
                      <b>Agent's Screen</b>
                      <br /><br />
                      <img src="../../FacebookIntegration/AgentChat.png" align='bottom' style={{width: '600px'}}></img>
                      <br /><br />
                      <b>Facebook Customer's Screen</b>
                      <br /><br />
                      <img src="../../FacebookIntegration/CustomerChat.png" ></img>
                      <br /><br />
                    </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
  }
}

function mapStateToProps(state) {

  return {
  userdetails:(state.dashboard.userdetails),
  agents:(state.dashboard.agents),
  deptagents:(state.dashboard.deptagents),
  teamdetails:(state.dashboard.teamdetails),
  channels :(state.dashboard.channels),
  onlineAgents:(state.dashboard.onlineAgents),
  news : (state.dashboard.news),
   }
}

export default connect(mapStateToProps)(FacebookIntegrationInstruction);
