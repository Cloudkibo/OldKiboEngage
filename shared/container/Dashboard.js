import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {getuser} from '../redux/actions/actions'
import {getAgents} from '../redux/actions/actions'
import {getDeptAgents,getnews} from '../redux/actions/actions'
import {getusergroups} from '../redux/actions/actions'
import {getsubgroups,updateAgentList,setjoinedState, getcompanysettings} from '../redux/actions/actions'
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

     const usertoken = auth.getToken();
    console.log('componentWillMount is called');
    if(usertoken != null)
    {

        console.log(usertoken);
        props.getcompanysettings(usertoken,props.userdetails.uniqueid);
      }
    super(props, context);
     this.updateOnlineAgents = this.updateOnlineAgents.bind(this);
     this.create_agentsession = this.create_agentsession.bind(this);
     this.callSocket= this.callSocket.bind(this);


  }
  create_agentsession(){
   // alert('joined socket');
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
        this.props.getusergroups(usertoken);
        this.props.getsubgroups(usertoken);
        this.props.getresponses(usertoken);

   }


  }
 componentWillReceiveProps(props){
   if(props.userdetails && props.userdetails.accountVerified == "No" && is_routed == false){
    is_routed = true;
    browserHistory.push('/notverified');
    

   }

    if(props.userdetails.uniqueid && props.userjoinedroom == 'notjoined'){
      this.props.setjoinedState('joining');
     
   
     
    //  alert('calling room join')
      this.props.route.socket.emit('create or join meeting for agent', {room: props.userdetails.uniqueid,agentEmail : props.userdetails.email,agentName : props.userdetails.firstname+' ' + props.userdetails.lastname,agentId:props.userdetails._id});
  

     
    //  socket.on('join',room => this.props.show_notifications(room)); // use this function to show notifications
      //this.forceUpdate();
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
     
     // alert('calling meeting')
      this.props.route.socket.emit('create or join meeting for agent', {room: this.props.userdetails.uniqueid,agentEmail : this.props.userdetails.email,agentName : this.props.userdetails.firstname+' ' + this.props.userdetails.lastname,agentId:this.props.userdetails._id});
  

     
    //  socket.on('join',room => this.props.show_notifications(room)); // use this function to show notifications
      this.forceUpdate();
     

     // this.props.setTimeout(() => { alert('I do not leak!' + this.props.userdetails.uniqueid); }, 1000);
    }
     }

  componentWillUpdate(){
  //on component mount,join room
  
   // this.props.route.socket.on('updateOnlineAgentList',this.updateOnlineAgents);
    //setTimeout(this.callSocket, 3000);
    /*if(this.props.userjoinedroom == 'notjoined'){
      this.callSocket();
    }*/
    
  }





  render() {
    //console.log(this.props.userdetails)
    const token = auth.getToken()
    const username = this.props.userdetails.firstname
    console.log(username)
    return (
       <div className="vbox viewport">
       {
        this.props.userdetails &&

       <AuthorizedHeader className= "headerclass" name = {this.props.userdetails.firstname} isAdmin ={this.props.userdetails.isAdmin} user ={this.props.userdetails} roomid = {this.props.userdetails.uniqueid} />
       }

        <div className="page-container hbox space-between">
          <SideBar isAdmin ={this.props.userdetails.isAdmin}/>
          <div className="page-content-wrapper">
            <div className="page-content">
                <h1>Dashboard</h1>
                {/*<p>Hi  {this.props.userdetails.firstname} ! Welcome to Dashboard</p>*/}

                <div className="row">
                            <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                                <div className="dashboard-stat2 ">
                                    <div className="display">
                                        <div className="number">
                                            <h3 className="font-green-sharp">
                                                <span data-counter="counterup" data-value="3">3</span>
                                                <small className="font-green-sharp"></small>
                                            </h3>
                                            <small>Assigned</small>
                                        </div>
                                        <div className="icon">
                                            <i className="icon-pie-chart"></i>
                                        </div>
                                    </div>
                                    <div className="progress-info">
                                        {/*<div className="progress">
                                            <span style={styles.w1} className="progress-bar progress-bar-success green-sharp">
                                                <span className="sr-only">76% progress</span>
                                            </span>
                                        </div>
                                        <div className="status">
                                            <div className="status-title"> progress </div>
                                            <div className="status-number"> 76% </div>
                                        </div>*/}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                                <div className="dashboard-stat2 ">
                                    <div className="display">
                                        <div className="number">
                                            <h3 className="font-red-haze">
                                                <span data-counter="counterup" data-value="14">14</span>
                                            </h3>
                                            <small>Abandoned</small>
                                        </div>
                                        <div class="icon">
                                            <i class="icon-like"></i>
                                        </div>
                                    </div>
                                    <div className="progress-info">
                                        {/*<div className="progress">
                                            <span style={styles.w2} className="progress-bar progress-bar-success red-haze">
                                                <span className="sr-only">85% change</span>
                                            </span>
                                        </div>
                                        <div className="status">
                                            <div className="status-title"> change </div>
                                            <div className="status-number"> 85% </div>
                                        </div>*/}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                                <div className="dashboard-stat2 ">
                                    <div className="display">
                                        <div className="number">
                                            <h3 className="font-blue-sharp">
                                                <span data-counter="counterup" data-value="17">17</span>
                                            </h3>
                                            <small>Resolved</small>
                                        </div>
                                        <div class="icon">
                                            <i class="icon-basket"></i>
                                        </div>
                                    </div>
                                    <div className="progress-info">
                                        {/*<div className="progress">
                                            <span style={styles.w3} className="progress-bar progress-bar-success blue-sharp">
                                                <span className="sr-only">45% grow</span>
                                            </span>
                                        </div>
                                        <div className="status">
                                            <div className="status-title"> grow </div>
                                            <div className="status-number"> 45% </div>
                                        </div>*/}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                                <div className="dashboard-stat2 ">
                                    <div className="display">
                                        <div className="number">
                                            <h3 className="font-purple-soft">
                                                <span data-counter="counterup" data-value="276">6</span>
                                            </h3>
                                            <small>Facebook Customers</small>
                                        </div>
                                        <div className="icon">
                                            <i className="icon-user"></i>
                                        </div>
                                    </div>
                                    <div className="progress-info">
                                        {/*<div className="progress">
                                            <span style={styles.w4} className="progress-bar progress-bar-success purple-soft">
                                                <span className="sr-only">56% change</span>
                                            </span>
                                        </div>
                                        <div className="status">
                                            <div className="status-title"> change </div>
                                            <div className="status-number"> 57% </div>
                                        </div>*/}
                                    </div>
                                </div>
                            </div>
                        </div>

                        

            </div>
          </div>
       </div>
       </div>

     


  )
  }
}

const styles = { 
  w1 : {
    width: '76%',
  },
  w2 : {
    width: '85%',
  },
  w3 : {
    width: '45%',
  },
  w4 : {
    width: '57%',
  }
};


function mapStateToProps(state) {

  return {
  userdetails:(state.dashboard.userdetails),
  agents:(state.dashboard.agents),
  deptagents:(state.dashboard.deptagents),
  groupdetails:(state.dashboard.groupdetails),
  subgroups :(state.dashboard.subgroups),
  onlineAgents:(state.dashboard.onlineAgents),
  news : (state.dashboard.news),
  userjoinedroom:(state.dashboard.userjoinedroom),
  companysettings:(state.dashboard.companysettings),

   }
}

export default connect(mapStateToProps,{getuser,getnews,updateAgentList,getAgents,setjoinedState,getresponses,getsubgroups,getDeptAgents,getusergroups, getcompanysettings})(ReactTimeout(Dashboard));
