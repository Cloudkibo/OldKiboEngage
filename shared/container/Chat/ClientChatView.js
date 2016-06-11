import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import { getChatRequest}  from '../../redux/actions/actions'
 var socket =  io.connect('');
class ClientChatView extends Component {


  constructor(props, context) {
        console.log(props.customerid);
        props.getChatRequest(props.customerid);
        super(props, context);
       this.handleMessageSubmit= this.handleMessageSubmit.bind(this);
     //  this.callme= this.callme.bind(this);

  }
componentDidMount() {
   
    socket.on('send:message', this._messageRecieve);
    
  }
 
 
   _messageRecieve(message) {
    callme(message);
   
  }
 
  callme(message){
     this.props.chatlist.push(message);
    this.forceUpdate();
  }

   handleMessageSubmit(e) {
    alert(this.props.chatlist);
    e.preventDefault();
    var message = {
      sender : 'zarmeen',
      msg : 'hello',
      time :'7:40am'
    }
    this.props.chatlist.push(message);
    
    socket.emit('send:message', message);
    this.forceUpdate();
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
          <div className="panel-body">
            <ul className="chat">
                          {this.props.chatlist &&
                            this.props.chatlist.map((chat, i) => (
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
                                   </li>
                               )
                               
                                                          
                            )
                          }
            </ul>
            </div>

             <div className="panel-footer">
                    <div className="input-group">
                        <input id="btn-input" type="text" className="form-control input-sm" placeholder="Type your message here..." />
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

export default connect(mapStateToProps,{ getChatRequest})(ClientChatView);
