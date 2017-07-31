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

class deleteGroup extends Component {

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
<h1>Delete a&nbsp;Group</h1>
<p>Admin and Supervisors within a company has the rights to delete a specific group. Deleting a group will also delete its Sub groups and any chat session which was linked up with that group.<br />This operation cannot be undone therefore we should be very careful when using this option.</p>
<p>To&nbsp;delete a group, click on the "Groups" tab on the left hand side. This will show the list of groups.<br />There are 2 ways to delete a group.<br /><br />1- We can use 'Delete' button corresponding to the group which needs to be deleted</p>
<p>&nbsp;</p>
<p><img src="../../documentationPics/deleteGroup1.png" alt="" />&nbsp;</p>
<p>&nbsp;</p>
<p>2- We can select group/groups using checkboxes on left side of group and click on "Delete" button. This option is usually used when more than one groups needs to be deleted</p>
<p>&nbsp;</p>
<p><img src="../../documentationPics/deleteGroup2.png" alt="" />&nbsp;</p>
<p>&nbsp;&nbsp;</p>
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

export default connect(mapStateToProps)(deleteGroup);
