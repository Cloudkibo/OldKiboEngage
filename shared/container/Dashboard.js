import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {getuser} from '../redux/actions/actions'
import {getAgents} from '../redux/actions/actions'
import {getDeptAgents,getnews} from '../redux/actions/actions'
import {getuserteams} from '../redux/actions/actions'
import {getchannels,updateAgentList,setjoinedState} from '../redux/actions/actions'
import {getresponses} from '../redux/actions/actions';
import AuthorizedHeader from '../components/Header/AuthorizedHeader';
import Footer from '../components/Footer/Footer.jsx';
import SideBar from '../components/Header/SideBar';
import auth from '../services/auth';
import ReactTimeout from 'react-timeout'
import { browserHistory } from 'react-router'

//const socket = io('');
var dontCall = false;
var is_routed = false;
var fetchnews = false;
class Dashboard extends Component {
 constructor(props, context) {


    super(props, context);
     this.updateOnlineAgents = this.updateOnlineAgents.bind(this);
     this.create_agentsession = this.create_agentsession.bind(this);
     this.callSocket= this.callSocket.bind(this);


  }
  create_agentsession(){
    //alert('joined socket');
     dontCall = true;
     this.props.setjoinedState('joined');

  }
  componentWillMount(){
    const usertoken = auth.getToken();
     if(usertoken != null)
    {
       console.log('usertoken');
        console.log(usertoken);
       
        this.props.getuser(usertoken);
        this.props.getAgents(usertoken);
        this.props.getDeptAgents(usertoken);
        this.props.getuserteams(usertoken);
        this.props.getchannels(usertoken);
        this.props.getresponses(usertoken);

   }


  }
 componentWillReceiveProps(props){
   if(props.userdetails && props.userdetails.accountVerified == "No" && is_routed == false){
    is_routed = true;
    browserHistory.push('/notverified');


   }

   
  


 }

  updateOnlineAgents(data){
  console.log('updating updateOnlineAgents');
  this.props.updateAgentList(data);
  //this.forceUpdate();
}

componentDidMount(){
 //dontCall = false;
 //this.props.route.socket.on('updateOnlineAgentList',this.updateOnlineAgents);
 this.props.route.socket.on('agentjoined',this.create_agentsession)

  

}

callSocket(){ 
    if(this.props.userdetails.uniqueid && this.props.userjoinedroom == 'notjoined'){
      this.props.setjoinedState('joining');
     
      alert('calling meeting')
      this.props.route.socket.emit('create or join meeting for agent', {room: this.props.userdetails.uniqueid,agentEmail : this.props.userdetails.email,agentName : this.props.userdetails.firstname+' ' + this.props.userdetails.lastname,agentId:this.props.userdetails._id});
  

     
    //  socket.on('join',room => this.props.show_notifications(room)); // use this function to show notifications
      this.forceUpdate();
     

     // this.props.setTimeout(() => { alert('I do not leak!' + this.props.userdetails.uniqueid); }, 1000);
    }
     }

  componentWillUpdate(){
  //on component mount,join room
  
   // this.props.route.socket.on('updateOnlineAgentList',this.updateOnlineAgents);
    setTimeout(this.callSocket, 3000);

  }





  render() {
    //console.log(this.props.userdetails)
    const token = auth.getToken()
    const username = this.props.userdetails.firstname
    console.log(username)
    return (
       <div>
       {
        this.props.userdetails &&

       <AuthorizedHeader name = {this.props.userdetails.firstname} isAdmin ={this.props.userdetails.isAdmin} user ={this.props.userdetails} roomid = {this.props.userdetails.uniqueid} />
       }
       <div className="page-container">
          <SideBar isAdmin ={this.props.userdetails.isAdmin}/>
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
  teamdetails:(state.dashboard.teamdetails),
  channels :(state.dashboard.channels),
  onlineAgents:(state.dashboard.onlineAgents),
  news : (state.dashboard.news),
  userjoinedroom:(state.dashboard.userjoinedroom)

   }
}

export default connect(mapStateToProps,{getuser,getnews,updateAgentList,getAgents,setjoinedState,getresponses,getchannels,getDeptAgents,getuserteams})(ReactTimeout(Dashboard));
