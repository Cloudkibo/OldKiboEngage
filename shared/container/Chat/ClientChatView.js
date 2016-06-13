import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import { getChatRequest}  from '../../redux/actions/actions'
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
    alert(messageList.scrollTop);
    messageList.scrollTop = messageList.scrollHeight;
  }

   handleMessageSubmit(e) {
    const { socket,dispatch } = this.props;
     if (e.which === 13) {
          
        e.preventDefault();
        var message = {
          sender : this.refs.name.value,
          msg : this.refs.msg.value,
          time : moment.utc().format('lll')
        }

        this.props.chatlist.push(message);
        
        socket.emit('send:message', message);
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
            <input ref="name" placeholder = "Enter your name ..." />
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
     
     };
}

export default connect(mapStateToProps,{ getChatRequest,updateChatList})(ClientChatView);
