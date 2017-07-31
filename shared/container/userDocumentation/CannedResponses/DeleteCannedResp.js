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
class DeleteCannedResp extends Component {

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
                  <Link to="/userDocumentation/CannedResponses/DeleteCannedResp" >DeleteCannedResponses</Link>
                </li>
              </ul>
              <div className="uk-card uk-card-body uk-card-default">
                <h1>Delete&nbsp;Canned Responses</h1>
<p>Support agents are on a typing spree when they are answering large number of customers and typing same thing over and over may bore them and reduce their productivity.</p>
<p>To keep things up and up for your agents and maintain their pace, you can create well-formatted - predetermined responses for commonly asked questions. We call these 'Canned Responses'.</p>
<p>Select "Canned Responses" tab from left bar.&nbsp;This will show the list of all the pre-defined Canned Responses.</p>
<p>Canned Responses can be deleted in two ways. Either you can use 'bin' icon attached to every row:<br /><br /></p>
<img src="../../documentationPics/delCannedResponses1.png" alt="" /> <br /><br />
<p>OR you can select one or more canned responses using checkboxes on left of each row. After making selection, click on "Delete" button to delete canned response(s).</p>
<img src="../../documentationPics/delCannedResponses2.png" alt="" /> <br /><br />
<p>&nbsp;</p>
</div>
</div>
<div class="col-md-3">
<div class="sidebar-nav-fixed pull-right affix"><br />
<h3>&nbsp;</h3>
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

export default connect(mapStateToProps)(DeleteCannedResp);
