import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import { getChatRequest}  from '../../redux/actions/actions'

class CustomerChatView extends Component {

  constructor(props, context) {
      //call action to get user groups 
    const usertoken = auth.getToken();
     console.log('constructor is called');
    if(usertoken != null)
     {
       
        console.log(usertoken);
        console.log(props.customerid);
        props.getChatRequest(props.customerid,usertoken);
      }

      
        super(props, context);
       

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
                          this.props.channels && this.props.channels.map((channel,i) =>
                            <option value={channel._id}>{channel.msg_channel_name}</option>

                            )
                         }
                         
                      </select>
                   </div>   
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
            <ul className="chat">
                          {this.props.chatlist &&
                            this.props.chatlist.map((chat, i) => (
                             
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
                        <input id="btn-input" type="text" className="form-control input-sm" placeholder="Type your message here..." />
                        <span className="input-group-btn">
                            <button className="btn btn-warning btn-sm" id="btn-chat">
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
    
    group: (state.dashboard.group),
    agents:(state.dashboard.agents),
    deptagents:(state.dashboard.deptagents),
    userdetails:(state.dashboard.userdetails),
    customerid :(state.dashboard.customerid),
    customerchat :(state.dashboard.customerchat),
    chatlist :(state.dashboard.chatlist),
     channels :(state.dashboard.channels),
  };
}

export default connect(mapStateToProps,{ getChatRequest})(CustomerChatView);
