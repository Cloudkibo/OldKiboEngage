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

class AddSubGroup extends Component {

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
                  <Link to="/userDocumentation/SubGroups/AddSubGroup" >subGroups</Link>
                </li>
              </ul>
              <div className="uk-card uk-card-body uk-card-default">
              <h1>Add new Subgroup</h1>
<p>Subgroups are topical conversation threads within the Group. Subgroups are&nbsp;attached to Groups. A group can&nbsp;one or more Sub groups. When we create a new Group, a subgroup called 'General' is created by default.</p>
<p>To add a new sub group, click on the "Sub Groups" tab on the left hand side.<br />This will show the list of sub groups. To create a new subgroup, click on&nbsp;"Create Subgroup" button at top.</p>
<p><img src="../../documentationPics/createSubGroup.png" alt="" /> <br /><br /></p>
<p>You will be shown a form to fill in details like sub group name, description etc.</p>
<p><img src="../../documentationPics/createSubgroupForm.png" alt="" />&nbsp;</p>
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

export default connect(mapStateToProps)(AddSubGroup);
