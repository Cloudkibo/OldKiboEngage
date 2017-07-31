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

class EditTeam extends Component {

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
                  <Link to="/dashboard"> Dashboard </Link>
                </li>
              
                <li>
                  <Link to="/userDocumentation/Teams/EditTeam" >EditTeam</Link>
                </li>
              </ul>
              <div className="uk-card uk-card-body uk-card-default">
            <h1>Edit&nbsp;Team</h1>
<p>Team&nbsp;information can be updated after it has been created. You can change Team&nbsp;name, description, add or remove agents(s) allocated to that team.<br /><br />For editing team&nbsp;information, select Teams&nbsp;from left tab bar. This will display all the teams. Only Admin and supervisors can edit a team.</p>
<p><br />Click on 'pencil' icon on right of team&nbsp;which needs to be updated.</p>
<p>&nbsp;<img src="../../documentationPics/editTeam.png" alt="" /></p>
<p>&nbsp;</p>
<p>This will open a page from where you can change team&nbsp;details. Once done, Click on "Save" button. If you want to discard the changes, click on "Cancel"</p>
<p><img src="../../documentationPics/editTeamForm.png" alt="" /> <br /><br /></p>     
                 
             
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

export default connect(mapStateToProps)(EditTeam);
