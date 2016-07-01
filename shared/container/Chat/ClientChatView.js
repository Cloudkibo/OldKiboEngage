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
        console.log(props.customerid);
        props.getChatRequest(props.customerid);
        super(props, context);
       this.handleMessageSubmit= this.handleMessageSubmit.bind(this);
    
  }
  componentDidMount() {
    const { socket,dispatch } = this.props;
   
   socket.on('send:message',message => this.props.updateChatList(message));
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
          sender: this.refs.name.value,
          msg : this.refs.msg.value,
          time : moment.utc().format('lll'),
          socketid : this.props.roomdetails.socketid
        }

        this.props.chatlist.push(message);
        
         socket.emit('send:message', message);
        var saveChat={}
        if(this.props.sessiondetails.status == 'new'){
        saveChat = { 
                          'to' : 'All Agents',
                          'from' : this.refs.name.value,
                           'visitoremail' : this.refs.email.value,
                           'type': 'message',
                           'msg' : this.refs.msg.value,
                           'datetime' : Date.now(),
                           'request_id' : this.refs.reqId.value,
                           'messagechannel': this.refs.channelid.value,
                           'companyid': this.props.sessiondetails.companyid,
                           'is_seen':'no',
                           'socketid' : this.props.roomdetails.socketid
                      }
                    }
            else{
                       saveChat = { 
                          'to' : this.props.sessiondetails.agentname,
                          'from' : this.refs.name.value,

                          'visitoremail' : this.refs.email.value,
                          'agentemail' : this.props.sessiondetails.agentemail,

                          'agentid': this.props.sessiondetails.agentid,

                          'type': 'message',

                           'msg' : this.refs.msg.value,

                           'datetime' : Date.now(),
                           'request_id' : this.refs.reqId.value,
                           'messagechannel': this.refs.channelid.value,

                           'companyid': this.props.sessiondetails.companyid,

                           'is_seen':'no',
                           'socketid' : this.props.roomdetails.socketid
                      }
                    }
         this.props.savechat(saveChat);           
        this.refs.msg.value ='';
        this.forceUpdate();
      }
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
            <label>Client Name : </label>
            <input ref="reqId" value = {this.props.sessiondetails.session_id} type="hidden"/>
            <input ref="name" value = {this.props.sessiondetails.customerName} type="hidden" />
            <input ref="channelid" value = {this.props.sessiondetails.messagechannel} type="hidden" />
            <input ref="email" value = {this.props.sessiondetails.email} type="hidden" />
           
            </div>

          <div className="panel-body">
            <ul className="chat"  ref="messageList">
                          {this.props.chatlist &&
                            this.props.chatlist.map((chat, i) => (
                                     (this.refs.name.value === chat.sender?
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
                        <input id="btn-input" type="text" ref = "msg" className="form-control input-sm" placeholder="Type your message here..." onKeyDown={this.handleMessageSubmit}/>
                        <span className="input-group-btn">
                            <button className="btn btn-warning btn-sm" id="btn-chat" onClick ={this.handleMessageSubmit}>
                                Send</button>
                        </span>
                    </div>
                </div>
      </div> 
  )
  }
}





function mapStateToProps(state) {
  return {
    customerid :(state.dashboard.customerid),
    customerchat :(state.dashboard.customerchat),
    chatlist :(state.dashboard.chatlist),
    sessiondetails :(state.widget.sessiondetails),
    roomdetails :(state.widget.roomdetails), 
     };
}

export default connect(mapStateToProps,{ getChatRequest,updateChatList,savechat})(ClientChatView);
