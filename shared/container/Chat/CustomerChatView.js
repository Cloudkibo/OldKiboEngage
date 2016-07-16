import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import { getChatRequest,getcustomers,updatestatus,assignToAgent,movedToMessageChannel,getsessions}  from '../../redux/actions/actions'
import { updateChatList}  from '../../redux/actions/actions'
import {updateSessionList} from '../../redux/actions/actions'
import moment from 'moment';
import {savechat}  from '../../redux/actions/actions'

class CustomerChatView extends Component {

  constructor(props, context) {
      //call action to get user groups 
     const usertoken = auth.getToken();
     console.log('constructor is called');
    if(usertoken != null)
     {
       
        console.log(usertoken);
        console.log(props.sessiondetails.customerid);
        props.getChatRequest(props.sessiondetails.customerid,usertoken,props.chatlist);
      }

        super(props, context);
        this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
        this.assignSessionToAgent = this.assignSessionToAgent.bind(this);
        this.moveToChannel = this.moveToChannel.bind(this);
     
  }
  componentDidMount() {
    
  
    this.props.route.socket.on('send:message',message => this.props.updateChatList(message,this.props.new_message_arrived_rid,this.props.sessiondetails.request_id));
  //  this.props.route.socket.on('customer_joined',data =>this.props.updateSessionList(data));
   
  }


  componentDidUpdate() {
    const messageList = this.refs.messageList;
    messageList.scrollTop = messageList.scrollHeight;
  }

 
 
   handleMessageSubmit(e) {
    const { socket,dispatch } = this.props;
     if (e.which === 13) {
          
        e.preventDefault();
        var message = {
          sender : this.props.userdetails.firstname,
          msg : this.refs.msg.value,
          time : moment.utc().format('lll'),
          to : this.refs.socketid_customer.value,
          request_id : this.props.sessiondetails.request_id,
                          
        }

        this.props.chatlist.push(message);
        
        socket.emit('send:message', message);

        
         var saveChat = { 
                          'to' : this.refs.customername.value,
                          'from' : this.props.userdetails.firstname,
                          'visitoremail' : this.refs.customeremail.value,
                          'socketid' : this.refs.socketid_customer.value,
                          'type': 'message',
                           'msg' : this.refs.msg.value,
                           'datetime' : Date.now(),
                           'request_id' : this.props.sessiondetails.request_id,
                           'messagechannel': this.refs.channelid.value,
                           'companyid': this.props.sessiondetails.companyid,
                           'is_seen':'no'
                      }
        this.props.savechat(saveChat);               
        this.refs.msg.value ='';
        this.forceUpdate();
      }
    }

 
  assignSessionToAgent(e){
     const { socket,dispatch } = this.props;
     const usertoken = auth.getToken();
    
    alert('Are you sure,you want to assign this session to agent ?');
   
    // 1. Broadcast a log message to all agents and customer that session is assigned to agent

    var message = {
          sender : this.props.userdetails.firstname + ' ' + this.props.userdetails.lastname,
          msg : 'Session is assigned to Agent ' + this.props.userdetails.firstname +' ' + this.props.userdetails.lastname ,
          time : moment.utc().format('lll'),
          customersocket : this.refs.socketid_customer.value,
          agentsocket : this.refs.agentsocket.value,
          type : 'log',
          agentid : this.props.userdetails._id,
          request_id : this.props.sessiondetails.request_id,
                          

        }

        this.props.chatlist.push(message);
        
        socket.emit('send:message', message);
        socket.emit('send:agentsocket' , message);
         var saveChat = { 
                           'to' : this.refs.customername.value,
                           'from' : this.props.userdetails.firstname,
                           'visitoremail' : this.refs.customeremail.value,
                           'socketid' : this.refs.socketid_customer.value,
                           'type': 'log',
                           'msg' : 'Session is assigned to Agent ' + this.props.userdetails.firstname +' ' + this.props.userdetails.lastname ,
                           'datetime' : Date.now(),
                           'request_id' : this.props.sessiondetails.request_id,
                           'messagechannel': this.refs.channelid.value,
                           'companyid': this.props.sessiondetails.companyid,
                           'is_seen':'no'
                      }
        this.props.savechat(saveChat); 


   // 2. Send socket id of assigned agent to customer,all chat between agent and customer will now be point to point

    // 3. update session status on server   
     var session = {
      request_id : this.refs.requestid.value,
      status : 'assigned',
      usertoken :usertoken,
    
    }
    this.props.updatestatus(session);

    //4. update agent assignment table on server

    // considering the use case of self assigning
    var assignment = {
      assignedto : this.props.userdetails._id,
      assignedby : this.props.userdetails._id,
      sessionid : this.refs.requestid.value,
      companyid : this.props.userdetails.uniqueid,
      datetime : Date.now(),

    }

    this.props.assignToAgent(assignment,usertoken);
   // this.props.getcustomers(usertoken);
   // this.props.getsessions(usertoken);
     this.forceUpdate();
  }
 



 //move message to another message channel
 moveToChannel(e){
     const { socket,dispatch } = this.props;
     const usertoken = auth.getToken();
    
    alert('Are you sure,you want to move this session to another channel ?');
   
    // 1. Broadcast a log message to all agents and customer that session is moved

    var message = {
          sender : this.props.userdetails.firstname,
          msg : 'Session is moved to Channel ' + this.refs.channellist.options[this.refs.channellist.selectedIndex].text ,
          time : moment.utc().format('lll'),
          customersocket : this.refs.socketid_customer.value,
          agentsocket : this.props.socketid,
          type : 'log',
          request_id : this.props.sessiondetails.request_id,
                          
        }

        this.props.chatlist.push(message);
        
        socket.emit('send:message', message);
         var saveChat = { 
                           'to' : this.refs.customername.value,
                           'from' : this.props.userdetails.firstname,
                           'visitoremail' : this.refs.customeremail.value,
                           'socketid' : this.refs.socketid_customer.value,
                           'type': 'log',
                           'msg' : 'Session is moved to Channel ' + this.refs.channellist.options[this.refs.channellist.selectedIndex].text ,
                           'datetime' : Date.now(),
                           'request_id' : this.props.sessiondetails.request_id,
                           'messagechannel': this.refs.channelid.value,
                           'companyid': this.props.sessiondetails.companyid,
                           'is_seen':'no'
                      }
        this.props.savechat(saveChat); 

        //save new channel id on server
        var assignment = {
            movedto : this.refs.channellist.value,
            movedfrom : this.refs.channelid.value,
            movedby : this.props.userdetails._id,
            sessionid : this.refs.requestid.value,
            companyid : this.props.userdetails.uniqueid,
            datetime : Date.now(),

    }

    this.props.movedToMessageChannel(assignment,usertoken);
   //  this.props.getcustomers(usertoken);
   
   // this.props.getsessions(usertoken);

    this.forceUpdate();

}

   handleChange(e){
     alert(e.target.value);
   
    }

  render() {
   
    var leftStyle = {
          float: 'left',
          width:'100%',
          background:'#ddd',
 
    };
        var rightStyle = {
          float: 'right',
          width:'100%',
          background:'#cceeff',
 
    };
    var clearStyle = {
             clear:'both',
 
      };

var c = []
      {
         this.props.cust &&
                        this.props.cust.map((customerd, i) => (
                           c.push(customerd)                            
                        ))

      }  

 
     return (

      <div>
           <div className="table-responsive">
             <table className="table table-colored">
             <tbody>
             <tr>
             <td className="col-md-4">
                
                  
                  <label className="control-label text-right">Assigned To</label>
                  <div className="input-group">
                  <select  ref = "agentList" className="form-control" onChange={this.handleChange.bind(this)} aria-describedby="basic-addon3"   >
                         {
                          this.props.agents && this.props.agents.map((agent,i) =>
                            <option value={agent._id}>{agent.firstname + ' ' + agent.lastname}</option>

                            )
                         }

                      </select>
                    
                 </div>     
                </td>
              <td className="col-md-4">
                  <label className="control-label text-right">Move To</label>
                  <div className="input-group">
                   <select  ref = "channellist" className="form-control" onChange={this.handleChange.bind(this)}   >
                          {
                          this.props.channels && this.props.channels.filter((c) => c.groupid == this.props.sessiondetails.departmentid).map((channel,i) =>
                            <option value={channel._id}>{channel.msg_channel_name}</option>

                            )
                         }
                         
                      </select>
                   </div>   
                </td>
              <td className="col-md-1">
                <button className="btn btn-primary" onClick = {this.assignSessionToAgent}> Assign </button>
              </td> 
              <td className="col-md-1">
                <button className="btn btn-primary" onClick = {this.moveToChannel}> Move </button>
              </td> 
                
              <td className="col-md-1">
                <button className="btn btn-primary"> Resolved </button>
              </td> 
              <td className="col-md-1">
                <button className="btn btn-primary"> Archive </button>
              </td>  
              </tr>
              </tbody>
            </table>

          </div>
          <div className="panel-body">
          {
            this.props.sessiondetails &&
          <div>
          <input value = {c[0].name} ref="customername"/>
          <input value = {c[0].email} ref="customeremail"/>
          <input value = {this.props.sessiondetails.request_id} ref = "requestid"/>
          <input defaultValue = {this.props.socketid} ref = "agentsocket"/>
         
          <input value = {this.props.sessiondetails.messagechannel[this.props.sessiondetails.messagechannel.length - 1]} ref="channelid"/>
          <input value = {this.props.sessiondetails.socketid} ref = "socketid_customer"/>
          </div>
          }
            <ul className="chat" style={{wordWrap: 'break-word', margin: '0', overflowY: 'auto', padding: '0', paddingBottom: '1em', flexGrow: '1', order: '1'}}  ref="messageList">
                          {this.props.chatlist &&
                            this.props.chatlist.filter((chat) => chat.request_id == this.props.sessiondetails.request_id).map((chat, i) => (
                             
                               (this.props.userdetails.firstname === chat.sender?
                                   <li className="right clearfix agentChatBox">
                                      <span className="chat-img pull-right agentChat"> {chat.sender.substr(0,1)}
                                      </span>
                                      <div className="chat-body clearfix">
                                        <div>
                                            <strong className="pull-right primary-font">{chat.sender}</strong> 
                                            <small className=" text-muted">
                                                <span className="glyphicon glyphicon-time"></span>{chat.time}
                                            </small>
                                        </div>
                                       <p  className='pull-right chatmsg'>
                                            {chat.msg}
                                       </p>
                                     </div>
                                   </li> :

                                    <li className="left clearfix userChatBox">
                                      <span className="chat-img pull-left userChat">
                                      {chat.sender.substr(0,1)}
                                      </span>
                                      <div className="chat-body clearfix">
                                        <div>
                                            <strong className="primary-font">{chat.sender}</strong> 
                                            <small className="pull-right text-muted">
                                                <span className="glyphicon glyphicon-time"></span>{chat.time}
                                            </small>
                                        </div>
                                       <p className="chatmsg">
                                            {chat.msg}
                                       </p>
                                     </div>
                                   </li>

                               )
                               
                                                          
                            ))
                          }
            </ul>
            </div>

             <div className="panel-footer">
                    <div className="input-group">
                        <input id="btn-input" ref = "msg" type="text" className="form-control input-sm" placeholder="Type your message here..."  onKeyDown={this.handleMessageSubmit}/>
                        <span className="input-group-btn">
                            <button className="btn btn-warning btn-sm" id="btn-chat" onClick={this.handleMessageSubmit}>
                                Send</button>
                        </span>
                    </div>
                </div>
      </div> 
  )
  }
}





function mapStateToProps(state) {
  console.log('mapStateToProps of GroupDetailView is called');
  console.log(state.dashboard.group);
  return {
    
          groupdetails:(state.dashboard.groupdetails),
          userdetails:(state.dashboard.userdetails),
          errorMessage:(state.dashboard.errorMessage),
          agents:(state.dashboard.agents),
          deptagents:(state.dashboard.deptagents),
          customerchat :(state.dashboard.customerchat),
          chatlist :(state.dashboard.chatlist),
          channels :(state.dashboard.channels),
          customers:(state.dashboard.customers),
          new_message_arrived_rid :(state.dashboard.new_message_arrived_rid)        
          
  };
}

export default connect(mapStateToProps,{ getChatRequest,updateChatList,movedToMessageChannel,getsessions,getcustomers,updateSessionList,savechat,assignToAgent,updatestatus})(CustomerChatView);
