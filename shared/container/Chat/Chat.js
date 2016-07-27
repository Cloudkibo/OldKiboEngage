import ChatListItem from './ChatListItem';
import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {getsessions,updateAgentList,getuserchats,getresponses,getcustomers,setsocketid,filterbystatus,selectCustomerChat,filterbyDept,filterbyChannel,filterbyAgent}  from '../../redux/actions/actions'

import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import CustomerChatView from './CustomerChatView';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import { bindActionCreators } from 'redux';

import io from 'socket.io-client';

class Chat extends Component {

 constructor(props, context) {
      //call action to get user groups 
    const usertoken = auth.getToken();
     console.log('componentWillMount is called');
    if(usertoken != null)
    {
       
        console.log(usertoken);
        props.getcustomers(usertoken);
        props.getsessions(usertoken);
        props.getuserchats(usertoken);
        props.getresponses(usertoken);
     

      }
      
        super(props, context);
        this.create_agentsession = this.create_agentsession.bind(this);
        this.getupdatedSessions = this.getupdatedSessions.bind(this);
        this.updateOnlineAgents = this.updateOnlineAgents.bind(this);
  
    
  }
updateOnlineAgents(data){
  console.log('updating updateOnlineAgents');
  this.props.updateAgentList(data);
  this.forceUpdate();
}
componentDidMount(){
        console.log('calling component will mount');
       //get online agents list
        this.props.route.socket.emit('getOnlineAgentList');


}



  create_agentsession(data){
    console.log('your socket id is : ' + data.socketid);
    this.refs.agentsocketfield.value = data.socketid;
  // alert('setting agentsocket value :' + this.refs.agentsocketfield.value);
  }
   getupdatedSessions(data)
  {
    const usertoken = auth.getToken();
    this.props.getcustomers(usertoken);
    this.props.getsessions(usertoken);
    this.props.getuserchats(usertoken);

    this.forceUpdate();
  }
 
  componentWillUpdate(){
      console.log('calling componentWillUpdate');
    //   this.props.route.socket.emit('create or join meeting for agent', {room: this.props.userdetails.uniqueid});
       this.props.route.socket.on('agentjoined',this.create_agentsession)
       this.props.route.socket.on('customer_joined',this.getupdatedSessions);
       this.props.route.socket.on('updateOnlineAgentList',this.updateOnlineAgents);

    } 
  
   handleChange(e){
     alert(e.target.value);
     this.props.filterbystatus(e.target.value,this.props.customerchatold);
     this.forceUpdate();
   
   
    }

    handleChangeDepartment(e){
     alert(e.target.value);
     this.props.filterbyDept(e.target.value,this.props.customerchatold);
     this.forceUpdate();
   
   
    }
     handleChangeChannel(e){
     alert(e.target.value);
     this.props.filterbyChannel(e.target.value,this.props.customerchatold);
     this.forceUpdate();
   
   
    }

    handleChangeAgents(e){
     alert(e.target.value);
     this.props.filterbyAgent(e.target.value,this.props.customerchatold);
     this.forceUpdate();
   
   
    }

     handleSession(id,e){
      e.preventDefault();
      this.refs.sessionid.value = id;
      alert(this.refs.sessionid.value);
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
                
       <AuthorizedHeader name = {this.props.userdetails.firstname} />
    
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
             		<th className="col-md-1">Group</th>
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
             		  
             		  <select  ref = "grouplist" onChange={this.handleChangeDepartment.bind(this)}   >
                           <option value="all">All</option>
                          {
                         	this.props.groupdetails && this.props.groupdetails.map((group,i) =>
                         		<option value={group._id}>{group.deptname}</option>

                         		)
                         }
                         

                         
                      </select>
             
             		</td>
             		<td className="col-md-1">
             		  <select  ref = "channellist" onChange={this.handleChangeChannel.bind(this)}   >
                             <option value="all">All</option>
                           {
                         	this.props.channels && this.props.channels.map((channel,i) =>
                         		<option value={channel._id}>{channel.msg_channel_name}</option>

                         		)
                         }
                       
                      </select>
             
             		</td>
             	</tr>
             	</tbody>
                </table>
                </div>
             	
             	<div className="table-responsive">
              {
                this.props.customerchat &&
                <input type="hidden" ref = "sessionid" />
             		}

                <table className="table">

             			<tbody>
                  <tr>
                  <input  type = "text" ref = "agentsocketfield" name="agentsocketfield" value=""/>
      
                  </tr>
			             	<tr>
			             		<td  className="col-md-3">
			             			<div>
					                      {this.props.userchats && this.props.customerchat && this.props.customerchat.length > 0  && this.props.customers && 
					                        this.props.customerchat.map((customer, i) => (
                                  
                                    (this.props.new_message_arrived_rid ?
                                  
                                    <ChatListItem userchats = {this.props.userchats.filter((ch) => ch.request_id == customer.request_id)} selectedsession =  {(this.refs.sessionid)? this.refs.sessionid.value :"" }  new_message_arrived_rid = {this.props.new_message_arrived_rid} customer={customer} key={i} onClickSession={this.handleSession.bind(this,customer.request_id)} group = {this.props.groupdetails.filter((grp) => grp._id == customer.departmentid)}  channel= {this.props.channels.filter((c) => c._id == customer.messagechannel[customer.messagechannel.length-1])}  cust = {this.props.customers.filter((c) => c._id == customer.customerid)}/>
                                    :  
                                    <ChatListItem userchats = {this.props.userchats.filter((ch) => ch.request_id == customer.request_id)} selectedsession =  {(this.refs.sessionid)? this.refs.sessionid.value :""} customer={customer} key={i} onClickSession={this.handleSession.bind(this,customer.request_id)} group = {this.props.groupdetails.filter((grp) => grp._id == customer.departmentid)}  channel= {this.props.channels.filter((c) => c._id == customer.messagechannel[customer.messagechannel.length-1])}  cust = {this.props.customers.filter((c) => c._id == customer.customerid)}/>
                                  )
                                  
					                                                      
					                        ))
					                      }
			                     	</div>
			                    </td>

                          <td className="col-md-6">
                          {
                            this.refs.sessionid && this.refs.sessionid.value && this.props.customerchat && this.props.customerchat.length > 0 && this.props.customerchat_selected && this.props.customers && this.props.onlineAgents &&
			                    	<CustomerChatView  cust = {this.props.customers.filter((c) => c._id == this.props.customerchat_selected.customerid)}  socket={ this.props.route.socket} {...this.props} sessiondetails = {this.props.customerchat_selected} socketid = {this.refs.agentsocketfield.value} onlineAg = {this.props.onlineAgents}/>
			                   }
                          </td> 	
			                </tr>
			            </tbody>
                </table>
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
  console.log(state.dashboard.groupdetails);
  console.log(state.dashboard.errorMessage);

  return {
          groupdetails:(state.dashboard.groupdetails),
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
                  
                    };
}

export default connect(mapStateToProps,{getsessions,getresponses,updateAgentList,getuserchats,getcustomers,selectCustomerChat,filterbystatus,filterbyAgent,filterbyDept,filterbyChannel})(Chat);
