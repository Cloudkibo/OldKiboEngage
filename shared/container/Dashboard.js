import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {getuser} from '../redux/actions/actions'
import {getAgents} from '../redux/actions/actions'
import {getDeptAgents} from '../redux/actions/actions'
import {getusergroups} from '../redux/actions/actions'
import {getchannels,updateAgentList} from '../redux/actions/actions'

import AuthorizedHeader from '../components/Header/AuthorizedHeader';
import Footer from '../components/Footer/Footer.jsx';
import SideBar from '../components/Header/SideBar';
import auth from '../services/auth';
import ReactTimeout from 'react-timeout'
//const socket = io('');
var dontCall = false;

class Dashboard extends Component {
 constructor(props, context) {
    super(props, context);
     this.updateOnlineAgents = this.updateOnlineAgents.bind(this);
  
    
  }
  componentWillMount(){
    const usertoken = auth.getToken();
    this.props.getuser(usertoken)
    this.props.getAgents(usertoken);
    this.props.getDeptAgents(usertoken);
    this.props.getusergroups(usertoken);
    this.props.getchannels(usertoken)
  
   
  }

  updateOnlineAgents(data){
  console.log('updating updateOnlineAgents');
  this.props.updateAgentList(data);
  this.forceUpdate();
}

  componentWillUpdate(){
   console.log(this.props.route.socket);
    
  //on component mount,join room
    if(this.props.userdetails.uniqueid && dontCall == false){

      this.props.route.socket.emit('create or join meeting for agent', {room: this.props.userdetails.uniqueid,agentEmail : this.props.userdetails.email});
    //  socket.on('join',room => this.props.show_notifications(room)); // use this function to show notifications
     

      dontCall = true;  

     // this.props.setTimeout(() => { alert('I do not leak!' + this.props.userdetails.uniqueid); }, 1000);
    } 
    this.props.route.socket.on('updateOnlineAgentList',this.updateOnlineAgents);

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
                <p>Hi  {this.props.userdetails.firstname} ! Welcome to Dashboard</p>
               
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
  onlineAgents:(state.dashboard.onlineAgents),       
       
   }
}

export default connect(mapStateToProps,{getuser,updateAgentList,getAgents,getchannels,getDeptAgents,getusergroups})(ReactTimeout(Dashboard));
