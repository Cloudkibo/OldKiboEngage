
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
class ViewReports extends Component {

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
                  <Link to="/userDocumentation/HighCharts/ViewReports" >ViewReports</Link>
                </li>
              </ul>
              <div className="uk-card uk-card-body uk-card-default">
              
              <h1>View Reports</h1>
<p>Kibo Engage also lets you monitor statistics by providing analytics of your company which can be useful for decision making purpose.<br /><br /></p>
<p>For viewing Reports/charts , click on "Reports" tab from left side pane. This will display multiple types of reports.</p>
<p>&nbsp;</p>
<p>&nbsp;<img src="../../documentationPics/Reports.png" alt="" /></p>
<p>&nbsp;</p>
<p>Also there is a filter feature which can be used to filter reports data:<br /><br /><br /></p>
<p><img src="../../documentationPics/ReportsFilterDept.png " alt="" /> <br /><br /></p>

             
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

export default connect(mapStateToProps)(ViewReports);
