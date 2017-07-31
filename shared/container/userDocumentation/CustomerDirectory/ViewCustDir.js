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
class ViewCustDir extends Component {

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
                  <Link to="/userDocumentation/CustomerDirectory/ViewCustDir">CustomerDirectory</Link>
                </li>
              </ul>
              <div className="uk-card uk-card-body uk-card-default">
         <h1>Customer Directory</h1>
<p>Kiboengage&nbsp;maintains the history of its customers which helps in maintaining good business relationships.&nbsp;<br /><br />To view the details of customers, click on "Customer Directory" tab from left pane. This will show customer details such as Customer name, email address, phone number, country etc.<br /><br /></p>
<img src="../../documentationPics/emailCustomer.png " alt="" /> <br /><br />
<p>You can send an email to any customer using "envelope" icon attached to every row. When you click on envelope, it will show the form to send an email. Fill in the fields and type the email. Once done, click on 'Submit" button.</p>
<img src="../../documentationPics/emailCustomerForm.png " alt="" /> <br /><br />
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

export default connect(mapStateToProps)(ViewCustDir);
