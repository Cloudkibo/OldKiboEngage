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
class createGroup extends Component {

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
                  <Link to="/userDocumentation/createGroup" >createGroup</Link>
                </li>
              </ul>
              <div className="uk-card uk-card-body uk-card-default">
               <h1>Add new Group</h1>
<p>Groups are the organizational units like IT,Customer Support ,Sales e.t.c within a Company. Your chats will&nbsp;be organised w.r.t groups so it be easier to organise and manage.<br />Customer will initiate chat in one or more groups and assigned agents can respond to them.</p>
<p>To add a new group, click on the "Groups" tab on the left hand side.<br />This will show the list of groups you have created.<br />To create a new group, click on&nbsp;"Create Group" button at top.</p>
<p><img src="../../documentationPics/createGroups.png" alt="" /> <br /><br /></p>
<p>You will be shown a form to fill in details like group name, description etc.<br />Note: Please, add at least one team to the group to make it operational. <br />Click on the name in the list to add teams.</p>
<p><img src="../../documentationPics/createGroup.png" alt="" />&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
                    
                 
             
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

export default connect(mapStateToProps)(createGroup);
