import FbCustomerListItem from './FbCustomerListItem';
import ChatArea from './ChatArea';
import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {getfbCustomers,getfbSessions,updatefbstatus,updateCustomerList,add_socket_fb_message,getfbChats,getresponses,selectFbCustomerChat}  from '../../redux/actions/actions'
import Conversation from 'chat-template/dist/Conversation';

import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router'
import Avatar from 'react-avatar';
import io from 'socket.io-client';
import Autosuggest from 'react-autosuggest';


var callonce=false;

class FbChat extends Component {
 constructor(props, context) {

    if(props.userdetails.accountVerified == "No"){
    browserHistory.push('/notverified');
   }
    const usertoken = auth.getToken();
    if(usertoken != null)
    {

        console.log(usertoken);
        props.getfbSessions(usertoken);
       // props.getfbCustomers(usertoken);
        props.getfbChats(usertoken);

        props.getresponses(usertoken);
        callonce=true;

      }

        super(props, context);
        //fb related
        this.getfbCustomer = this.getfbCustomer.bind(this);
        this.getfbMessage = this.getfbMessage.bind(this);
        this.assignSessionToAgent = this.assignSessionToAgent.bind(this);
        this.assignSessionToTeam = this.assignSessionToTeam.bind(this);
        this.moveToSubgroup = this.moveToSubgroup.bind(this);
        this.resolveSession = this.resolveSession.bind(this);
        this.handleChange = this.handleChange.bind(this);

        

  }
handleChange(e){

}
assignSessionToTeam(e){

}
assignSessionToAgent(e){

}
moveToSubgroup(e){

}
resolveSession(e){

}
getfbCustomer(data){
 // alert('New fb customer '+ data.first_name);
  if(this.props.fbsessions){
    this.props.updateCustomerList(data,this.props.fbsessions);
    this.forceUpdate();

  }

}

getfbMessage(data){
    if(this.props.fbchatSelected && this.props.fbchats && this.refs.sessionid)
    {
      if(data.senderid != this.props.fbchatSelected[0].senderid)
      {

          data.seen = false;
       }
    else{
      data.seen=true;
    }
      this.props.add_socket_fb_message(data,this.props.fbchats,this.refs.sessionid.value);
      
    }
   
    this.forceUpdate();
}
syncdata(){

}


componentDidMount(){
       const usertoken = auth.getToken();

        //fb related
        this.props.route.socket.on('send:fbcustomer',this.getfbCustomer);
        this.props.route.socket.on('send:fbmessage',this.getfbMessage);

}

componentWillReceiveProps(props){
  if(props.fbsessions && props.fbchats && callonce == true && this.refs.sessionid){
   // alert(props.fbcustomers.length);
 
    this.refs.sessionid.value = props.fbsessions[0].user_id.user_id;
    this.props.selectFbCustomerChat(props.fbsessions[0].user_id.user_id,props.fbchats,props.fbsessions[0].user_id.profile_pic);
    callonce=false;

  }

}
 handleSession(customer,e){

    //  alert(customer.user_id);
      e.preventDefault();
      const usertoken = auth.getToken();
      this.refs.sessionid.value = customer.user_id.user_id;
      this.refs.customername.value = customer.user_id.first_name+' '+customer.user_id.last_name;
      this.props.updatefbstatus(customer.user_id.user_id,this.props.fbchats);

      this.props.selectFbCustomerChat(customer.user_id.user_id,this.props.fbchats,customer.user_id.profile_pic);
      //const node = ReactDOM.findDOMNode(this.refs.customername);
      //node.scrollIntoView({behavior: "smooth"});
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
                   Facebook Chat Page
                </div>
              </div>

           <div className="portlet-body">

             	<div className="table-responsive">

                {this.props.fbsessions && this.props.fbsessions.length == 0?
                  <p>There is no customer session from Facebook</p>

                  :
                <table className="table">

             			<tbody>
                   	<tr>
			             		<td  className="col-md-2 myleftborder">
			             			<div>
					                      {this.props.fbsessions && this.props.fbchats &&
					                        this.props.fbsessions.map((customer, i) => (

                                    <FbCustomerListItem onClickSession={this.handleSession.bind(this,customer)} userchat = {this.props.fbchats.filter((ch) => ch.senderid== customer.user_id.user_id)}  customer={customer} key={i} />

                                  )
                                  )
					                      }


			                   </div>
			                 </td>
                       <td  className="col-md-6">
                      <div>

                       <div className="table-responsive">
                   <table className="table table-colored">
                   <tbody>
                   <tr>
                       <td className="col-md-4">
                       <label className="control-label text-right">Assigned To Agent</label>
                       </td>
                      
                       <td className="col-md-4">
                       <label className="control-label text-right">Assigned To Team</label>
                       </td>
                   </tr>
                   <tr>
                   <td className="col-md-4">


                        <div className="input-group">
                        <select  ref = "agentList" className="form-control" onChange={this.handleChange.bind(this)} aria-describedby="basic-addon3"   >
                              {

                                this.props.agents && this.props.agents.map((agent,i) =>
                                  agent._id == this.props.userdetails._id?
                                  <option value={agent.email} data-attrib = {agent._id} data-type = "agent" data-name={this.props.userdetails.firstname} data-email={this.props.userdetails.email}>Myself</option>:
                                  <option value={agent.email} data-attrib = {agent._id} data-type = "agent" data-name={agent.firstname} data-email={agent.email}>{agent.firstname +' '+ agent.lastname}</option>

                                  )

                              }

                            </select>


                       </div>
                    </td>

                    <td className="col-md-4">
                      <button className="btn btn-primary" onClick = {this.assignSessionToAgent}> Assigned To Agent</button>
                    </td>



                    <td className="col-md-4">
                       <div className="input-group">
                         <select  ref = "teamlist" className="form-control" onChange={this.handleChange.bind(this)}   >
                                          {
                                          this.props.teamdetails && this.props.teamdetails.map((team,i) =>
                                            <option value={team._id} data-attrib = {team._id}>{team.groupname}</option>

                                            )
                                         }

                         </select>
                         </div>
                      </td>
                   {/*
                    <td className="col-md-1">
                      <button className="btn btn-primary" onClick = {this.picksession}> Pick Session </button>
                    </td>*/}
                  <td className="col-md-4">
                          <button className="btn btn-primary" onClick = {this.assignSessionToTeam}> Assigned To Team</button>
                  </td>

                   
                    </tr>


                     
                          <tr>
                           
                            <td className="col-md-6">
                              <label>Current Status - {this.props.fbsessions[0].status}</label>
                             
                            </td>

                             <td className="col-md-1">
                              <button className="btn btn-primary" onClick = {this.resolveSession}> Resolved </button>
                             </td>

                           </tr>
                    </tbody>
                  </table>

          </div>
                          {this.props.fbsessions &&
                            <div>
                                <label>Customer Name :</label>
                                <input defaultValue = {this.props.fbsessions[0].user_id.first_name+ ' '+this.props.fbsessions[0].user_id.last_name} ref="customername"/>
                                 <input type="text" ref = "sessionid" defaultValue = {this.props.fbsessions[0].user_id.user_id} />

                           </div>
                         }
                           {this.props.fbchatSelected && this.props.fbsessions && this.refs.sessionid && this.refs.customername &&
                            <ChatArea messages={this.props.fbchatSelected} responses={this.props.responses} username={this.refs.customername.value} userprofilepic={this.props.profile_pic} senderid={this.refs.sessionid.value} userdetails={this.props.userdetails}/>
                          }
                      </div>
                       </td>
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
          profile_pic:(state.dashboard.profile_pic),
          fbcustomers:state.dashboard.fbcustomers,
          fbchats:state.dashboard.fbchats,
          fbchatSelected:state.dashboard.fbchatSelected,
          fbsessions: state.dashboard.fbsessions,
                    };
}

export default connect(mapStateToProps,{getfbCustomers,getfbSessions,add_socket_fb_message,updateCustomerList,getfbChats,updatefbstatus,getresponses,selectFbCustomerChat})(FbChat);
