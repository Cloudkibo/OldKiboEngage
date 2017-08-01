import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import AuthorizedHeader from '../../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../../components/Footer/Footer.jsx';
import SideBar from '../../../components/Header/SideBar';
import auth from '../../../services/auth';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import PopoutWindow from 'react-popout';
import Popout from 'react-popout';
import ReactDom from 'react-dom';
import Popup from 'react-popup';
import {
                  PopupboxManager,
                  PopupboxContainer
                } from 'react-popupbox';
import $ from 'jquery';
class AddNotifications extends Component {

  constructor(props, context) {

    //call action to get user teams
    if(props.userdetails.accountVerified == "No"){
    console.log('not verified');
      browserHistory.push('/notverified');
    }

    const usertoken = auth.getToken();
    //console.log('componentWillMount is called');
    super(props, context);
  }

   
  render() {

    const token = auth.getToken()
    //console.log(token)

    return (
    	 <div className="page-content-wrapper">
            <div className="page-content">
              <h3 className ="page-title">User Guide </h3>
              <ul className="uk-breadcrumb">
                <li>
                  <i className="fa fa-home"/>
                  <Link to="/dashboard"> User Guide </Link>
                </li>
              
                <li>
                  <Link to="/userDocumentation/AddNotifications">addNotifications</Link>
                </li>
              </ul>
              <div className="uk-card uk-card-body uk-card-default">
              <h1>Send&nbsp;Notifications</h1>
<p>Kiboengage helps you communicate effectively with your customers. Keep them updated and retained by sending email notifications for any product promotions, sale, discount offers and product launch.<br /><br />Notification feature lets you send notifications to all of your customers on just single click.</p>
<p>To add a new notification, click on the "Notifications" tab on the left hand side.</p>
<p>This will show the list of notifications&nbsp;you have sent. To create a new notification, click on&nbsp;"Add Notification" button at top.</p>
<p><img src="../../documentationPics/notifications.png" alt="" /> <br /><br /></p>
<p>Fill in the details : Notification title and description and click "Submit" when you are done. This will send notification message to all the customers. If you want to discard this notification, click "Cancel"</p>
<p><img src="../../documentationPics/addNotificationsForm.png" alt="" />&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
                    
                 
             
            </div>

          </div>
           <div class="col-md-3">

             <div class="sidebar-nav-fixed pull-right affix">
               
                <br/>
                <h3><b>&nbsp; More Related Articles &nbsp;</b></h3>
                    <ul class="nav ">
                        
                       
                        <li><h5><a href="#">Assign Agents</a></h5>
                        </li>
                        <li><h5><a href="#">Create Groups</a></h5>
                        </li>
                        <li><h5><a href="#">Create Sub Groups</a></h5>
                        </li>
                    </ul>
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

export default connect(mapStateToProps)(AddNotifications);
