import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {getuser} from '../redux/actions/actions'
import {getAgents} from '../redux/actions/actions'
import {getDeptAgents} from '../redux/actions/actions'
import {getusergroups} from '../redux/actions/actions'
import {getchannels} from '../redux/actions/actions'

import AuthorizedHeader from '../components/Header/AuthorizedHeader';
import Footer from '../components/Footer/Footer.jsx';
import SideBar from '../components/Header/SideBar';
import auth from '../services/auth';
import ReactTimeout from 'react-timeout'

import io from 'socket.io-client';
const socket = io('');
var dontCall = false;

class Dashboard extends Component {
 constructor(props, context) {
    super(props, context);
    
  }
  componentWillMount(){
    const usertoken = auth.getToken();
    this.props.getuser(usertoken)
    this.props.getAgents(usertoken);
    this.props.getDeptAgents(usertoken);
    this.props.getusergroups(usertoken);
    this.props.getchannels(usertoken)
  
   
  }

  
  componentWillUpdate(){
  
  //on component mount,join room
    if(this.props.userdetails.uniqueid && dontCall == false){

      socket.emit('create or join meeting for agent', {room: this.props.userdetails.uniqueid});
    //  socket.on('join',room => this.props.show_notifications(room)); // use this function to show notifications
     

      dontCall = true;  

     // this.props.setTimeout(() => { alert('I do not leak!' + this.props.userdetails.uniqueid); }, 1000);
    } 
  }
 
  render() {
    //console.log(this.props.userdetails)
    const token = auth.getToken()
    const username = this.props.userdetails.firstname
    console.log(username)
    return (
      <div>
       <AuthorizedHeader name = {this.props.userdetails.firstname} roomid = {this.props.userdetails.uniqueid} />
       <div className="page-container">
          <SideBar/> 
          <div className="page-content-wrapper">
            <div className="page-content"> 
                <h1>Dashboard</h1>
                <p>You made it!</p>
                <p>My token {token} {this.props.userdetails.firstname}</p>
               
            </div>
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
  groupdetails:(state.dashboard.groupdetails),
  channels :(state.dashboard.channels),
   }
}

export default connect(mapStateToProps,{getuser,getAgents,getchannels,getDeptAgents,getusergroups})(ReactTimeout(Dashboard));
