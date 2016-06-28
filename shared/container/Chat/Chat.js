import ChatListItem from './ChatListItem';
import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {getsessions}  from '../../redux/actions/actions'

import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import CustomerChatView from './CustomerChatView';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import { bindActionCreators } from 'redux';

import io from 'socket.io-client';

const socket = io('');
class Chat extends Component {

 constructor(props, context) {
      //call action to get user groups 
    const usertoken = auth.getToken();
     console.log('componentWillMount is called');
    if(usertoken != null)
    {
       
        console.log(usertoken);
        props.getsessions(usertoken);
      }
      
        super(props, context);
  
  
    
  }
   handleChange(e){
     alert(e.target.value);
   
    }

     handleSession(id,e){
      e.preventDefault();
      this.refs.sessionid.value = id;
      alert(this.refs.sessionid.value);
      this.forceUpdate();
   
    }
 

  render() {
    const token = auth.getToken()
    console.log(token)
    
    return (
      <div>
       <AuthorizedHeader name = {this.props.userdetails.firstname} />
    
       <div className="page-container">

         <SideBar/> 
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
                          <option value="new">New</option>
                          <option value="assigned">Assigned</option>
                          <option value="resolved">Resolved</option>
                          <option value="archived">Archived</option>
                      </select>
             		</td>
             		<td className="col-md-1">
             		
             		  <select  ref = "client" onChange={this.handleChange.bind(this)}   >
                          <option value="mobile">Mobile</option>
                          <option value="web">Web</option>
                         
                      </select>
             		</td>
             		<td className="col-md-1">
             		
             		  <select  ref = "agentList" onChange={this.handleChange.bind(this)}   >
                         {
                         	this.props.agents && this.props.agents.map((agent,i) =>
                         		<option value={agent._id}>{agent.firstname + ' ' + agent.lastname}</option>

                         		)
                         }
                          
                         
                      </select>
             		</td>
             		<td className="col-md-1">
             		  
             		  <select  ref = "grouplist" onChange={this.handleChange.bind(this)}   >
                          {
                         	this.props.groupdetails && this.props.groupdetails.map((group,i) =>
                         		<option value={group._id}>{group.deptname}</option>

                         		)
                         }
                         
                      </select>
             
             		</td>
             		<td className="col-md-1">
             		  <select  ref = "channellist" onChange={this.handleChange.bind(this)}   >
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
                <input type="hidden" ref = "sessionid" value = "0"/>
             		}
                <table className="table">
             			<tbody>
			             	<tr>
			             		<td  className="col-md-3">
			             			<div>
					                      {this.props.customerchat &&
					                        this.props.customerchat.map((customer, i) => (
					                        
					                          <ChatListItem customer={customer} key={i} onClickSession={this.handleSession.bind(this,i)}/>
					                                                      
					                        ))
					                      }
			                     	</div>
			                    </td>
			                    <td className="col-md-6">
                          {
                            this.refs.sessionid &&
			                    	<CustomerChatView  socket={socket} {...this.props} customerid = {this.props.customerid} sessiondetails = {this.props.customerchat[this.refs.sessionid.value]}/>
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
          customerid :(state.dashboard.customerid),
          chatlist :(state.dashboard.chatlist),
 		      channels :(state.dashboard.channels),	
           };
}

export default connect(mapStateToProps,{getsessions})(Chat);
