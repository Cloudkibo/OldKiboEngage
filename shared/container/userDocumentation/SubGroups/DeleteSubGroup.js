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

class DeleteSubGroup extends Component {

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
                  <Link to="/userDocumentation/MainPage"> User Guide </Link>
                </li>
              
                <li>
                  <Link to="/userDocumentation/SubGroups/DeleteSubGroup" >DeleteSubgroup</Link>
                </li>
              </ul>
              <div className="uk-card uk-card-body uk-card-default">
              <h1>Delete a Subgroup</h1>
<p>Admin and Supervisors within a company has the rights to delete a specific subgroup. Deleting a subgroup will also delete any chat session which was linked up with that subgroup.<br />This operation cannot be undone therefore we should be very careful when using this option.</p>
<p>To&nbsp;delete a subgroup, click on the "Subgroup" tab on the left hand side. This will show the list of subgroups.<br />There are 2 ways to delete a subgroup.<br /><br />1- We can use 'Bin' button corresponding to the subgroup which needs to be deleted&nbsp;</p>
<p><img src="../../documentationPics/deleteSubGroupBin.png" alt="" />&nbsp;</p>
<p>&nbsp;</p>
<p>2- We can select subgroup/subgroups using checkboxes on left side of subgroup and click on "Delete" button. This option is usually used when more than one subgroups needs to be deleted</p>
<p><img src="../../documentationPics/deleteSubGroup.png" alt="" />&nbsp;</p>
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

export default connect(mapStateToProps)(DeleteSubGroup);
