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

class EditGroup extends Component {

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
                  <Link to="/userDocumentation/EditGroup" >EditGroup</Link>
                </li>
              </ul>
              <div className="uk-card uk-card-body uk-card-default">
               <h1>Edit Group</h1>
<p>Group information can be updated after it has been created. You can change Group name, description, add or remove team(s) allocated to that group.<br /><br />For editing group information, select Groups from left tab bar. This will display all the groups. Only Admin and supervisors can edit a group.</p>
<p><br />Click on 'Edit' button on right of group which needs to be updated.</p>
<p>&nbsp;<img src="../../documentationPics/createGroups.png" alt="" /></p>
<p>&nbsp;</p>
<p>This will open a page from where you can change group details. Once done, Click on "Submit" button. If you want to discard the changes, click on "Back"</p>
<p><img src="../../documentationPics/editGroup2.png" alt="" /> <br /><br /></p>
             
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

export default connect(mapStateToProps)(EditGroup);
