import ChatListItem from './ChatListItem';
import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {removeDuplicates,getsessionsfromsocket,removeDuplicatesWebChat,updatechatstatus,previousChat,getgroups,getGroupAgents,getspecificuserchats_mobile,updateChatList,getchatsfromsocket,getmobilesessions,updateAgentList,getuserchats,getresponses,getcustomers,setsocketid,filterbystatus,selectCustomerChat,filterbyDept,filterbyChannel,filterbyAgent}  from '../../redux/actions/actions'

import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import CustomerChatView from './CustomerChatView';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router'

import io from 'socket.io-client';
var callMobileChatSessions
var callOnce
var callSocketChat
class Chat extends Component {

 constructor(props, context) {
      //call action to get user teams
    callMobileChatSessions =  false;
    callOnce = false;
    callSocketChat = false
    if(props.userdetails.accountVerified == "No"){
    browserHistory.push('/notverified');
   }
    const usertoken = auth.getToken();
    if(usertoken != null)
    {

        console.log(usertoken);
       //for webclients no need to fetch sessions and customer list from server

       //but for mobile clients we will fetch list of sessions and customers from server
        props.getmobilesessions(usertoken);
        props.getuserchats(usertoken);

        props.getresponses(usertoken);

      // get groups list and agents
        props.getgroups(usertoken);
        props.getGroupAgents(usertoken);


      }

        super(props, context);
        this.create_agentsession = this.create_agentsession.bind(this);
        this.getupdatedSessions = this.getupdatedSessions.bind(this);
        this.updateOnlineAgents = this.updateOnlineAgents.bind(this);
        this.getupdatedChats = this.getupdatedChats.bind(this);
        this.getSessionInfo = this.getSessionInfo.bind(this);
        this.getSocketmessage = this.getSocketmessage.bind(this);
        this.syncdata = this.syncdata.bind(this);
      

  }

syncdata(){
 // alert('You are connected to socket. Joining now!');
  this.props.route.socket.emit('create or join meeting for agent', {room: this.props.userdetails.uniqueid,agentEmail : this.props.userdetails.email,agentName : this.props.userdetails.firstname+' ' + this.props.userdetails.lastname,agentId:this.props.userdetails._id});
  this.props.route.socket.emit('getOnlineAgentList');
  //this.props.route.socket.emit('returnMySocketId');
  this.props.route.socket.emit('getuserchats',this.props.userdetails.uniqueid);

}
updateOnlineAgents(data){
  console.log('updating updateOnlineAgents');
  this.props.updateAgentList(data);
  this.forceUpdate();
}
 create_agentsession(socketid){
    console.log('your socket id is : ' + socketid);
    this.props.setsocketid(socketid);
    //this.refs.agentsocketfield.value = socketid;
    //alert('setting agentsocket value :' + this.refs.agentsocketfield.value);
  }
  getSocketmessage(message){
   alert('socket called for message');
   console.log(message);
   if(this.props.customerchat_selected){
   if((this.props.customerchat_selected.request_id != message.request_id)  && message.status && message.status == 'sent' && message.fromMobile && message.fromMobile == 'yes'){
       const usertoken = auth.getToken();
      /*** call api to update status field of chat message received from mobile to 'delivered'
      ***/
      var messages = [];
      messages.push({'uniqueid' : message.uniqueid,'request_id' : message.request_id,'status' :'delivered'});
       if(messages.length > 0){
      //   alert('New message arrived chat!');
        // highlight chat box

        this.props.updatechatstatus(messages,message.from,usertoken,this.props.mobileuserchat);
        this.props.updateChatList(message,this.props.new_message_arrived_rid);
         message.status = 'delivered';

    }
   }

    else if((this.props.customerchat_selected.request_id != message.request_id) && message.fromMobile == 'no'){
     // alert(' i m called2')
     this.props.userchats.push(message);

     this.props.updateChatList(message,this.props.new_message_arrived_rid);
     //this.props.removeDuplicatesWebChat(this.props.userchats,'uniqueid');
     this.forceUpdate();
  }


 }
 else if(!this.props.customerchat_selected && message.fromMobile == 'yes' && message.status && message.status == 'sent'){
     const usertoken = auth.getToken();
      /*** call api to update status field of chat message received from mobile to 'delivered'
      ***/
      var messages = [];
      messages.push({'uniqueid' : message.uniqueid,'request_id' : message.request_id,'status' :'delivered'});
       if(messages.length > 0){
      //   alert('New message arrived!');
     this.props.updatechatstatus(messages,message.from,usertoken,this.props.mobileuserchat);
     this.props.updateChatList(message,this.props.new_message_arrived_rid);
     message.status = 'delivered';
      }

      //this.props.mobileuserchat.push(message);
      this.props.userchats.push(message);
      this.props.removeDuplicates(this.props.mobileuserchat,'uniqueid');


 }

    else if(!this.props.customerchat_selected  && message.fromMobile == 'no' ){
    // alert(' i m called');

     this.props.userchats.push(message);
     this.props.updateChatList(message,this.props.new_message_arrived_rid);
    // this.props.removeDuplicatesWebChat(this.props.userchats,'uniqueid');

   }






   this.forceUpdate();

  }


//this code was for fetching previous chat messages when the agent is assigned a chat message

getSessionInfo(message){
   this.props.previousChat(message,this.props.chatlist);
   this.forceUpdate();
  }

componentWillReceiveProps(props) {
  // this will ensure that mobile sessions are completely fetched from server before merging it with socket sesisons
  const usertoken = auth.getToken();
  if(props.customerchat  && callMobileChatSessions == false && props.serverresponse && props.serverresponse == 'received'){
     this.props.route.socket.emit('getCustomerSessionsListFirst',props.customerchat,props.userdetails.uniqueid);

      callMobileChatSessions = true
      this.forceUpdate();
  }
  if(props.userchats && callSocketChat == false){
     this.props.route.socket.emit('getuserchats',this.props.userdetails.uniqueid);
     callSocketChat = true
  }

}

componentDidMount(){
       //get online agents list
       callMobileChatSessions = false
       callSocketChat = false;

       //alert('componentDidMount is called');
       const usertoken = auth.getToken();
        this.props.route.socket.emit('getOnlineAgentList');
        this.props.route.socket.emit('returnMySocketId');
       // this.props.route.socket.emit('getCustomerSessionsList');

        this.props.route.socket.on('send:message',this.getSocketmessage);
        this.props.route.socket.on('informAgent',this.getSessionInfo);
        this.props.route.socket.on('getmysocketid',this.create_agentsession);
        this.props.route.socket.on('customer_joined',this.getupdatedSessions);
        this.props.route.socket.on('updateOnlineAgentList',this.updateOnlineAgents);
        this.props.route.socket.on('returnCustomerSessionsList',this.getupdatedSessions);
        this.props.route.socket.on('returnUserChat',this.getupdatedChats);
        this.props.route.socket.on('syncdata',this.syncdata);

}




   getupdatedSessions(data)
  {
    const usertoken = auth.getToken();
    // not asking from server to give updated sessions
   // alert('updating session list');
    //this.props.getcustomers(usertoken);
    //this.props.getsessions(usertoken);
    //this.props.getuserchats(usertoken);

     this.props.getsessionsfromsocket(data);
     this.forceUpdate();
  }

   getupdatedChats(data)
  {
    //const usertoken = auth.getToken();
    // not asking from server to give updated sessions

    //this.props.getcustomers(usertoken);
    //this.props.getsessions(usertoken);
    //this.props.getuserchats(usertoken);
    //alert('getupdatedChats is called' + data.length);
/*    if(this.props.userchats){
    this.props.getchatsfromsocket(this.props.userchats,data);
  }
  else{
    this.props.getchatsfromsocket([],data);
  }*/
        //this.props.mobileuserchat.push(message);
    /*  alert(this.props.userchats.length);
      this.props.userchats.push(data);*/
      //this.props.getchatsfromsocket(this.props.userchats,'uniqueid');
     // alert(this.props.userchats.length);
  //  this.forceUpdate();
  }



   handleChange(e){
     //alert(e.target.value);
     this.props.filterbystatus(e.target.value,this.props.customerchatold);
     this.forceUpdate();


    }


    handleChangeDepartment(e){
     //alert(e.target.value);
     this.props.filterbyDept(e.target.value,this.props.customerchatold);
     this.forceUpdate();


    }
     handleChangeChannel(e){
     //lert(e.target.value);
     this.props.filterbyChannel(e.target.value,this.props.customerchatold);
     this.forceUpdate();


    }

    handleChangeAgents(e){
    // alert(e.target.value);
     this.props.filterbyAgent(e.target.value,this.props.customerchatold);
     this.forceUpdate();


    }

     handleSession(id,platform,e){
     // console.log(platform);
      console.log(id);
      e.preventDefault();
      const usertoken = auth.getToken();

      this.refs.sessionid.value = id;
     // alert(this.refs.sessionid.value);

      //retrieve chat history for mobile clients Only
        if(platform == "mobile"){

            this.props.getspecificuserchats_mobile(this.refs.sessionid.value,this.props.userdetails.uniqueid,usertoken)
            //this.forceUpdate()
        }

      // when the user clicks on session,reset unread message Count to zero and also remove Red Background Color from Chatlist item
     // this.props.updateUnreadCount(id,this.props.new_message_arrived_rid)

      this.props.selectCustomerChat(id,this.props.customerchat,this.props.new_message_arrived_rid);
      this.forceUpdate();

    }


  render() {
    const token = auth.getToken()
    console.log(token)

    return (
      <div>

       <AuthorizedHeader name = {this.props.userdetails.firstname} user={this.props.userdetails}/>

       <div className="page-container">

         <SideBar isAdmin ={this.props.userdetails.isAdmin}/>
          <div className="page-content-wrapper">
            <div className="page-content">
            <div className="portlet box grey-cascade">
              <div className="portlet-title">
                <div className="caption">
                    <i className="fa fa-group"/>
                   Chat
                </div>
              </div>

           <div className="portlet-body">
       		<div className="table-responsive">
             <table className="table">
             	<tbody>
             	<tr>
             		<th className="col-md-1">Status</th>
             		<th className="col-md-1">Medium</th>
             		<th className="col-md-1">Agents</th>
             		<th className="col-md-1">Team</th>
             		<th className="col-md-1">Message Channel</th>
             	</tr>
             	<tr>
             		<td className="col-md-1">

             		  <select  ref = "status" onChange={this.handleChange.bind(this)}   >
                          <option value="all">All</option>
                          <option value="new">New</option>
                          <option value="assigned">Assigned</option>
                          <option value="resolved">Resolved</option>
                          <option value="archived">Archived</option>
                      </select>
             		</td>
             		<td className="col-md-1">

             		  <select  ref = "client" onChange={this.handleChange.bind(this)}   >
                          <option value="all">All</option>
                          <option value="mobile">Mobile</option>
                          <option value="web">Web</option>

                      </select>
             		</td>
             		<td className="col-md-1">

             		  <select  ref = "agentList" onChange={this.handleChangeAgents.bind(this)}   >
                        <option value="all">All</option>

                         {
                         	this.props.agents && this.props.agents.map((agent,i) =>
                         		<option value={agent._id}>{agent.firstname + ' ' + agent.lastname}</option>

                         		)
                         }


                      </select>
             		</td>
             		<td className="col-md-1">

             		  <select  ref = "teamlist" onChange={this.handleChangeDepartment.bind(this)}   >
                           <option value="all">All</option>
                          {
                         	this.props.teamdetails && this.props.teamdetails.map((team,i) =>
                         		<option value={team._id}>{team.deptname}</option>

                         		)
                         }



                      </select>

             		</td>
             		<td className="col-md-1">
             		  <select  ref = "channellist" onChange={this.handleChangeChannel.bind(this)}   >
                             <option value="all">All</option>
                           {
                         	this.props.channels && this.props.channels.map((channel,i) =>
                         		<option value={channel._id}>{this.props.teamdetails.filter((d) => d._id == channel.groupid)[0].deptname + ' : ' +channel.msg_channel_name}</option>

                         		)
                         }

                      </select>

             		</td>
             	</tr>
             	</tbody>
                </table>
                </div>

             	<div className="table-responsive">
                <input type="hidden" ref = "sessionid" />
                <p>Chat Sessions assigned to your Team will be listed here.</p>
                {!this.props.customerchat?
                  <p>Loading Chat Sessions...</p>:
                  <br/>
                }
                {this.props.customerchatold && this.props.customerchatold.length == 0?
                  <p>No Customer is online currently.</p>

                  :
                <table className="table">

             			<tbody>
                  <tr>
                  {
                  this.props.yoursocketid &&
                  <input  type = "hidden" ref = "agentsocketfield" name="agentsocketfield" value={this.props.yoursocketid}/>
                  }
                  </tr>
			             	<tr>
			             		<td  className="col-md-3">
			             			<div>
					                      {this.props.userchats && this.props.agents && this.props.groupdetails && this.props.teamdetails && this.props.customerchat && this.props.customerchat.length > 0  &&
					                        this.props.customerchat.map((customer, i) => (

                                    (this.props.new_message_arrived_rid ?

                                    <ChatListItem userchat = {this.props.userchats.filter((ch) => ch.request_id == customer.request_id)} selectedsession =  {(this.refs.sessionid)? this.refs.sessionid.value :"" }  new_message_arrived_rid = {this.props.new_message_arrived_rid} customer={customer} key={i} onClickSession={this.handleSession.bind(this,customer.request_id,customer.platform)} team = {this.props.teamdetails.filter((grp) => grp._id == customer.departmentid)}  channel= {this.props.channels.filter((c) => c._id == customer.messagechannel[customer.messagechannel.length-1])}  agents = {this.props.agents} group = {this.props.groupdetails}/>
                                    :
                                    <ChatListItem userchat = {this.props.userchats.filter((ch) => ch.request_id == customer.request_id)} selectedsession =  {(this.refs.sessionid)? this.refs.sessionid.value :""} customer={customer} key={i} onClickSession={this.handleSession.bind(this,customer.request_id,customer.platform)} team = {this.props.teamdetails.filter((grp) => grp._id == customer.departmentid)}  channel= {this.props.channels.filter((c) => c._id == customer.messagechannel[customer.messagechannel.length-1])}  agents = {this.props.agents} group = {this.props.groupdetails}/>
                                  )


					                        ))
					                      }
			                     	</div>
			                    </td>
                          {this.refs.sessionid?
                          <td className="col-md-6">
                          {
                            this.props.customerchat_selected && this.props.customerchat_selected.platform == 'mobile' ?
                            (this.refs.sessionid && this.refs.sessionid.value && this.props.customerchat && this.props.customerchat.length > 0 && this.props.customerchat_selected &&  this.refs.agentsocketfield&& this.props.onlineAgents && this.props.responses && this.props.mobileuserchat &&
			                    	<CustomerChatView newChatClicked = "true" socket={ this.props.route.socket} {...this.props} sessiondetails = {this.props.customerchat_selected} socketid = {this.refs.agentsocketfield.value} onlineAg = {this.props.onlineAgents} mobileuserchat = {this.props.mobileuserchat} deptagents = {this.props.deptagents}/>
                            ):
                            (
                            this.refs.sessionid && this.refs.sessionid.value && this.props.customerchat && this.props.customerchat.length > 0 && this.props.customerchat_selected &&  this.refs.agentsocketfield&& this.props.onlineAgents && this.props.responses &&  this.props.customerchat_selected.platform == 'web' &&
                            <CustomerChatView socket={ this.props.route.socket} {...this.props} sessiondetails = {this.props.customerchat_selected} socketid = {this.refs.agentsocketfield.value} onlineAg = {this.props.onlineAgents} mobileuserchat = {this.props.mobileuserchat} deptagents = {this.props.deptagents}/>
                            )

                         }
                          </td>:
                         <td className="col-md-6">
                              <p>Click on session to view Chat messages</p>
                         </td>


                          }
			                </tr>
			            </tbody>
                </table>
              }
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

function mapStateToProps(state) {
  console.log("mapStateToProps is called");
  console.log(state.dashboard.userdetails);
  console.log(state.dashboard.teamdetails);
  console.log(state.dashboard.errorMessage);

  return {
          teamdetails:(state.dashboard.teamdetails),
          userdetails:(state.dashboard.userdetails),
          errorMessage:(state.dashboard.errorMessage),
          agents:(state.dashboard.agents),
          deptagents:(state.dashboard.deptagents),
          customerchat :(state.dashboard.customerchat),
          customerchatold :(state.dashboard.customerchatold),
          chatlist :(state.dashboard.chatlist),
 		      channels :(state.dashboard.channels),
          customers:(state.dashboard.customers),
          customerchat_selected :(state.dashboard.customerchat_selected),
          new_message_arrived_rid :(state.dashboard.new_message_arrived_rid),
          userchats :(state.dashboard.userchats),
          responses :(state.dashboard.responses),
          onlineAgents:(state.dashboard.onlineAgents),
          yoursocketid :(state.dashboard.yoursocketid),
          mobileuserchat : (state.dashboard.mobileuserchat),
          serverresponse : (state.dashboard.serverresponse) ,
          groupagents : (state.dashboard.groupagents),
          groupdetails :(state.dashboard.groupdetails),
                    };
}

export default connect(mapStateToProps,{removeDuplicates,removeDuplicatesWebChat,updatechatstatus,getmobilesessions,getgroups,getGroupAgents,previousChat,getspecificuserchats_mobile,updateChatList,getchatsfromsocket,getsessionsfromsocket,getresponses,setsocketid,updateAgentList,getuserchats,getcustomers,selectCustomerChat,filterbystatus,filterbyAgent,filterbyDept,filterbyChannel})(Chat);
