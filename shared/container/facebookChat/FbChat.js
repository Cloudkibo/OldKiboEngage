import FbCustomerListItem from './FbCustomerListItem';
import ChatArea from './ChatArea';
import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {getfbCustomers,getteams,updatefbsessionlist,getTeamAgents,getfbSessions,updatefbstatus,updateCustomerList,add_socket_fb_message,getfbChats,getresponses,selectFbCustomerChat}  from '../../redux/actions/actions'
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

         // get groups list and agents
        props.getteams(usertoken);
        props.getTeamAgents(usertoken);
        callonce=true;

      }

        super(props, context);
        //fb related
        this.getfbCustomer = this.getfbCustomer.bind(this);
        this.getfbMessage = this.getfbMessage.bind(this);
        this.updateFbsessionlist = this.updateFbsessionlist.bind(this);



  }

getfbCustomer(data){
 // alert('New fb customer '+ data.first_name);
  if(this.props.fbsessions){
    this.props.updateCustomerList(data,this.props.fbsessions);
    this.forceUpdate();

  }

}

updateFbsessionlist(data){
  this.props.updatefbsessionlist(data,this.props.fbsessions,this.props.fbsessionSelected);
  this.forceUpdate();
}
getfbMessage(data){
    if(this.props.fbchatSelected && this.props.fbchats)
    {
      if(data.senderid != this.props.fbchatSelected[0].senderid)
      {

          data.seen = false;
       }
    else{
      data.seen=true;
    }
      this.props.add_socket_fb_message(data,this.props.fbchats,this.props.fbsessionSelected.user_id.user_id);

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
        this.props.route.socket.on('updateFBsessions',this.updateFbsessionlist);

}

componentWillReceiveProps(props){
  if(props.fbsessions && props.fbchats && callonce == true){
   // alert(props.fbcustomers.length);

    //this.refs.sessionid.value = props.fbsessions[0].user_id.user_id;
    this.props.selectFbCustomerChat(props.fbsessions[0].user_id.user_id,props.fbchats,props.fbsessions[0].user_id.profile_pic,props.fbsessions[0]);
    callonce=false;

  }

}
 handleSession(customer,e){

    //  alert(customer.user_id);
      e.preventDefault();
      const usertoken = auth.getToken();
    //  this.refs.sessionid.value = customer.user_id.user_id;
      this.refs.customername.value = customer.user_id.first_name+' '+customer.user_id.last_name;
      this.props.updatefbstatus(customer.user_id.user_id,this.props.fbchats);
      this.props.selectFbCustomerChat(customer.user_id.user_id,this.props.fbchats,customer.user_id.profile_pic,customer);
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
        					                      {this.props.fbsessions && this.props.fbchats && this.props.agents && this.props.teamdetails &&
        					                        this.props.fbsessions.map((customer, i) => (

                                            <FbCustomerListItem onClickSession={this.handleSession.bind(this,customer)} userchat = {this.props.fbchats.filter((ch) => ch.senderid== customer.user_id.user_id)}  customer={customer} selectedCustomer={this.props.fbsessionSelected} key={i} agents = {this.props.agents} team = {this.props.teamdetails}/>

                                          )
                                          )
        					                      }


        			                   </div>
        			                 </td>
                               <td  className="col-md-6">
                              <div>


                          {this.props.fbsessions && this.props.fbsessionSelected &&
                            <div>
                                <label>Customer Name :</label>
                                <input defaultValue = {this.props.fbsessionSelected.user_id.first_name+ ' '+this.props.fbsessionSelected.user_id.last_name} ref="customername"/>

                           </div>
                         }
                           {this.props.fbchatSelected && this.props.fbsessions  && this.props.fbsessionSelected &&
                            <ChatArea messages={this.props.fbchatSelected} socket={ this.props.route.socket} {...this.props} responses={this.props.responses} username={this.props.fbsessionSelected.user_id.first_name+ ' '+this.props.fbsessionSelected.user_id.last_name} userprofilepic={this.props.profile_pic} senderid={this.props.fbsessionSelected.user_id.user_id} userdetails={this.props.userdetails}/>

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
          fbsessionSelected: state.dashboard.fbsessionSelected,
          fbsessions: state.dashboard.fbsessions,
          teamagents : (state.dashboard.teamagents),

                    };
}

export default connect(mapStateToProps,{getfbCustomers,updatefbsessionlist,getTeamAgents, getteams, getfbSessions,add_socket_fb_message,updateCustomerList,getfbChats,updatefbstatus,getresponses,selectFbCustomerChat})(FbChat);
