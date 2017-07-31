import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
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
class MainPagePopup extends Component {

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

componentWillMount()
{
	return this.loadUserDocFunc
}
  componentDidMount()
  {
  	
		return this.loadUserDocFunc
  }

  
loadUserDocFunc(e){
	e.preventDefault();
	 loadUserDoc()
}

  render() {

    const token = auth.getToken()
    //console.log(token)

    return (
    		<div>
		{this.loadUserDocFunc}
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

export default connect(mapStateToProps)(MainPagePopup);
