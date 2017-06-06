import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {chatbotsession, sendchatToBot, chatbotChatAdd}  from '../../redux/actions/actions'
import * as ReactDOM from 'react-dom';
var handleDate = function (d) {
  var c = new Date(d);
  return c.getHours() + ':' + c.getMinutes() + ' ' + c.toDateString();
};
class ClientChatView2 extends Component {

  constructor(props, context) {
    super(props, context);
    this.handleMessageSubmit = this.handleMessageSubmit.bind(this);

    this.sendMessage = this.sendMessage.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }

  componentDidMount() {

    // also broadcast a notification message
    //generate unique id of session with bot
    var today = new Date();
    var uid = Math.random().toString(36).substring(7);
    var unique_id = 'h' + uid + '' + today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate() + '' + today.getHours() + '' + today.getMinutes() + '' + today.getSeconds();
    this.props.chatbotsession(unique_id);
    this.scrollToBottom();
    //var username = prompt("Hi! I am Kitt. Whats your good name?");
    this.refs.username.value = '';
  }

  componentWillReceiveProps(props) {
    if (props.chatbotsessionid && !this.props.chatbotsessionid) {

      var query = [];
      query.push('Hi');
      var saveChat = {
        query,
        lang: 'en',
        sessionId: props.chatbotsessionid,
        from: 'user',
        msg: query[0],
        timestamp: Date.now(),
      };

      this.refs.msg.value = '';
      this.props.sendchatToBot(saveChat, this.refs.username.value);
    }
  }

  componentWillUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    const node = ReactDOM.findDOMNode(this.messagesEnd);
    node.scrollIntoView({behavior: "smooth"});
  }


  componentDidUpdate() {
    this.scrollToBottom();
  }


  handleMessageSubmit(e) {

    if (e.which === 13 && this.refs.msg.value != '') {

      var message;
      e.preventDefault();
      var query = []
      query.push(this.refs.msg.value);
      var saveChat = {

        query: query,
        lang: 'en',
        sessionId: this.props.chatbotsessionid,
        from: this.refs.username.value,
        msg: query[0],
        timestamp: Date.now(),


      }

      this.refs.msg.value = '';
      this.props.chatbotChatAdd(saveChat);
      this.props.sendchatToBot(saveChat);
      this.forceUpdate();
    }

  }

  sendMessage(e) {

    var message;
    e.preventDefault();
    var query = []
    query.push(this.refs.msg.value);
    var saveChat = {

      query: query,
      lang: 'en',
      sessionId: this.props.chatbotsessionid,
      from: this.refs.username.value,
      msg: query[0],
      timestamp: Date.now(),


    }

    this.refs.msg.value = '';
    this.props.chatbotChatAdd(saveChat);
    this.props.sendchatToBot(saveChat);
    this.forceUpdate();

  }

  render() {

    var leftStyle = {
      float: 'left',
      width: '100%',
      background: '#ddd',

    };
    var rightStyle = {
      float: 'right',
      width: '100%',
      background: '#cceeff',

    };
    var clearStyle = {
      clear: 'both',

    };
    return (

      <div>

        <div className="panel-body" style={{height: '353'}}>
          <input ref="username" type="hidden"/>

          <ul className="chat" ref="messageList">
            {this.props.chatbotlist &&
            this.props.chatbotlist.filter((chat) => chat.sessionId == this.props.chatbotsessionid).map((chat, i) => (
              (chat.from == 'Kitt' ?
                  <li className="left clearfix userChatBoxTemp">
                                       <span className="chat-img pull-left userChat"> {chat.from.substr(0, 1)}
                                      </span>
                    <div className="chat-body clearfix">
                      <div>

                        <strong className="primary-font">{chat.from}</strong>
                        <small className="pull-right text-muted">

                          <span className="glyphicon glyphicon-time"></span>{handleDate(chat.timestamp)}
                        </small>
                      </div>
                      <br/>
                      <p className="chatmsgBot">
                        {chat.msg}
                      </p>
                    </div>
                  </li> :

                  <li className="left clearfix agentChatBoxTemp">
                                      <span className="chat-img pull-left agentChat">
                                      Y
                                      </span>
                    <div className="chat-body clearfix">
                      <div>
                        <strong className="primary-font">You</strong>
                        <small className="pull-right text-muted">
                          <span className="glyphicon glyphicon-time"></span>{handleDate(chat.timestamp)}
                        </small>
                      </div>
                      <br/>
                      <p className="chatmsgBot">
                        {chat.msg}
                      </p>
                    </div>
                  </li>

              )


            ))
            }
          </ul>
          <div style={ {float: "left", clear: "both"} }
               ref={(el) => {
                 this.messagesEnd = el;
               }}>
          </div>

        </div>

        <div className="panel-footer"  style={{height: '50'}}>
          <div className="input-group">
            <input id="btn-input" type="text" ref="msg" className="form-control input-sm"
                   placeholder="Type your message here..." onKeyDown={this.handleMessageSubmit}/>
            <span className="input-group-btn">
                            <button className="btn btn-warning btn-sm" id="btn-chat" onClick={this.sendMessage}>
                                Send</button>
                        </span>
          </div>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    chatbotlist: (state.widget.chatbotlist),
    chatbotsessionid: (state.widget.chatbotsessionid)
  };
}

export default connect(mapStateToProps, {chatbotsession, sendchatToBot, chatbotChatAdd})(ClientChatView2);
