import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import { getChatRequest}  from '../../redux/actions/actions'
import {savechat}  from '../../redux/actions/actions'

import { updateChatList}  from '../../redux/actions/actions'
import * as actions from '../../redux/actions/actions';
import moment from 'moment';

class ClientChatView extends Component {

  constructor(props, context) {
    //    console.log(props.customerid);
       props.getChatRequest(props.customerid);
       super(props, context);
       this.handleMessageSubmit= this.handleMessageSubmit.bind(this);
       this.getAgentSocket = this.getAgentSocket.bind(this);
       this.connectToCall = this.connectToCall.bind(this);
       this.connectCall = this.connectCall.bind(this);
  }

 connectCall(data){
   if(confirm("Other person is calling you to a call. Confirm to join."))
        window.location.href = data.url;
 }
  getAgentSocket(data){
    console.log(data)
    console.log('agent socket id is : ' + data.data.agentsocket);
    this.refs.agentsocket.value =  data.data.agentsocket;
    this.refs.agentid.value = data.data.agentid;
    this.refs.agentname.value = data.data.assignedagentname;
    this.refs.agentemail.value = data.data.assignedagentemail;
               


  }
  componentDidMount() {
    const { socket,dispatch } = this.props;
   // also broadcast a notification message
    //generate unique id of message - this change is for mobile clients
    var today = new Date();
    var uid = Math.random().toString(36).substring(7);
    var unique_id = 'h' + uid + '' + today.getFullYear() + '' + (today.getMonth()+1) + '' + today.getDate() + '' + today.getHours() + '' + today.getMinutes() + '' + today.getSeconds();
   
     var hellomsg = {
            to: 'All Agents',
            from : this.props.roomdetails.customerid.name,
            visitoremail:this.props.roomdetails.customerid.email,
            datetime: Date.now(),
            uniqueid : unique_id,
            msg: 'User joined a chat session',
            time : moment.utc().format('lll'),
            type : 'message',
            request_id :this.props.roomdetails.request_id,
            messagechannel:this.props.roomdetails.messagechannel[this.props.roomdetails.messagechannel.length-1],
            companyid:this.props.roomdetails.room,
            is_seen:'no',
            fromMobile : 'no'


          }
   socket.emit('send:messageToAgent',hellomsg);

   socket.on('send:message',message => this.props.updateChatList(message));
   socket.on('send:getAgent',this.getAgentSocket);
   socket.on('connecttocall',this.connectCall);
  
   
      }
 

 componentDidUpdate() {
    const messageList = this.refs.messageList;
    messageList.scrollTop = messageList.scrollHeight;
  }

   handleMessageSubmit(e) {
    const { socket,dispatch } = this.props;
     if (e.which === 13) {
        var message;  
        e.preventDefault();
        console.log('socket of agent : ' + this.refs.agentsocket.value);
           //generate unique id of message - this change is for mobile clients
        var today = new Date();
        var uid = Math.random().toString(36).substring(7);
        var unique_id = 'h' + uid + '' + today.getFullYear() + '' + (today.getMonth()+1) + '' + today.getDate() + '' + today.getHours() + '' + today.getMinutes() + '' + today.getSeconds();
       
        var saveChat={}
        if(this.refs.agentsocket.value == ''){

        saveChat = { 
                          'to' : 'All Agents',
                          'from' : this.refs.name.value,
                           'visitoremail' : this.refs.email.value,
                           'type': 'message',
                           'uniqueid' : unique_id,
                           'msg' : this.refs.msg.value,
                           'datetime' : Date.now(),
                           'request_id' : this.refs.reqId.value,
                           'messagechannel': this.refs.channelid.value,
                           'companyid': this.props.sessiondetails.companyid,
                           'is_seen':'no',
                           'time' : moment.utc().format('lll'),
                           'fromMobile' : 'no'
                           
                      }
                    }
            else{
                       saveChat = { 
                          'to' : this.refs.agentname.value,
                          'from' : this.refs.name.value,
                          'visitoremail' : this.refs.email.value,
                          'agentemail' : this.props.sessiondetails.agentemail,
                          'agentid': this.refs.agentid.value,
                          'toagent' : this.refs.agentsocket.value ,
                          'type': 'message',
                          'uniqueid' : unique_id,
                           'msg' : this.refs.msg.value,
                           'datetime' : Date.now(),
                           'time' : moment.utc().format('lll'),
                           'request_id' : this.refs.reqId.value,
                           'messagechannel': this.refs.channelid.value,
                           'companyid': this.props.sessiondetails.companyid,
                           'is_seen':'no',
                           'fromMobile' : 'no',
                           'socketid' : this.props.roomdetails.socketid
                      }
                    }
         this.props.chatlist.push(saveChat);
        
         socket.emit('send:messageToAgent', saveChat);
                   
         this.props.savechat(saveChat);           
        this.refs.msg.value ='';
        this.forceUpdate();
      }
    }

  connectToCall(e){
    const { socket,dispatch } = this.props;
    
    var call= {};
      var today = new Date();
      var uid = Math.random().toString(36).substring(7);
      var unique_id = 'h' + uid + '' + today.getFullYear() + '' + (today.getMonth()+1) + '' + today.getDate() + '' + today.getHours() + '' + today.getMinutes() + '' + today.getSeconds();

      var meetingURLString = 'https://api.cloudkibo.com/#/conference/'+ unique_id +'?role=agent&companyid='+this.props.sessiondetails.companyid+'&agentemail='+this.refs.agentemail.value+'&agentname='+this.refs.agentname.value+'&visitorname='+this.props.sessiondetails.customerName+'&visitoremail='+this.props.sessiondetails.email+'&request_id='+this.props.sessiondetails.session_id;
      
      call.from = this.props.sessiondetails.customerName;
      call.to = this.refs.agentname.value;
      call.to_id = this.refs.agentsocket.value;
      call.agentemail = this.refs.agentemail.value;
      call.visitoremail = this.props.sessiondetails.email;
      call.request_id = this.props.sessiondetails.session_id;
      call.url = meetingURLString;
      console.log(call);
      console.log(meetingURLString);
      socket.emit('connecttocall', {room: this.props.sessiondetails.companyid, stanza: call});

      var meetingURLString = 'https://api.cloudkibo.com/#/conference/'+ unique_id +'?role=visitor&companyid='+this.props.sessiondetails.companyid+'&agentemail='+this.refs.agentemail.value+'&agentname='+this.refs.agentname.value+'&visitorname='+this.props.sessiondetails.customerName+'&visitoremail='+this.props.sessiondetails.email+'&request_id='+this.props.sessiondetails.session_id;

      window.location.href = meetingURLString;
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
     return (

      <div>
          <div>
            <label>Agent socketid : </label>
            <input ref ="agentsocket" type = "text"/>
            <label>Agent Name : </label>
            <input ref ="agentname" type = "text"/>
            <label>Agent ID : </label>
            <input ref ="agentid" type = "text"/>
            <label>Agent Email: </label>
            <input ref ="agentemail" type = "text"/>
           {this.props.sessiondetails &&
            <div>
            <input ref="reqId" value = {this.props.sessiondetails.session_id} type="hidden"/>
            <input ref="name" value = {this.props.sessiondetails.customerName} type="hidden" />
            <input ref="channelid" value = {this.props.sessiondetails.messagechannel}  />
            <input ref="email" value = {this.props.sessiondetails.email} type="text" />
           </div>
           }
            </div>

          <div className="panel-body">
            <ul className="chat"  ref="messageList">
                          {this.props.chatlist &&
                            this.props.chatlist.filter((chat) => chat.request_id == this.refs.reqId.value).map((chat, i) => (
                                     (this.refs.name.value === chat.from?
                                   <li className="right clearfix agentChatBox">
                                      <span className="chat-img pull-right agentChat"> {chat.from.substr(0,1)}
                                      </span>
                                      <div className="chat-body clearfix">
                                        <div>
                                            <strong className="pull-right primary-font">{chat.from}</strong> 
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
                                      {chat.from.substr(0,1)}
                                      </span>
                                      <div className="chat-body clearfix">
                                        <div>
                                            <strong className="primary-font">{chat.from}</strong> 
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
                        <input id="btn-input" type="text" ref = "msg" className="form-control input-sm" placeholder="Type your message here..." onKeyDown={this.handleMessageSubmit}/>
                        <span className="input-group-btn">
                            <button className="btn btn-warning btn-sm" id="btn-chat" onClick ={this.handleMessageSubmit}>
                                Send</button>
                        </span>
                    </div>
                </div>

             <br/> 
             {this.refs.agentname && this.refs.agentname.value && this.refs.agentname.value != '' ? 
              <button className="btn green" onClick ={this.connectToCall}> Start Call </button> :
              <button className="btn green hide" onClick ={this.connectToCall}> Start Call </button> 
              }  
      </div> 
  )
  }
}





function mapStateToProps(state) {
  return {
    sessiondetails :(state.widget.sessiondetails),
    roomdetails :(state.widget.roomdetails), 


    groupdetails:(state.dashboard.groupdetails),
    userdetails:(state.dashboard.userdetails),
    errorMessage:(state.dashboard.errorMessage),
    agents:(state.dashboard.agents),
    deptagents:(state.dashboard.deptagents),
    customerchat :(state.dashboard.customerchat),
    chatlist :(state.dashboard.chatlist),
    channels :(state.dashboard.channels),
    customers:(state.dashboard.customers),
     };
}

export default connect(mapStateToProps,{ getChatRequest,updateChatList,savechat})(ClientChatView);
