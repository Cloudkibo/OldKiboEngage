import FbCustomerListItem from './FbCustomerListItem';
import ChatArea from './ChatArea';
import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {getfbCustomers,updatefbstatus,updateCustomerList,add_socket_fb_message,getfbChats,getresponses,selectFbCustomerChat}  from '../../redux/actions/actions'
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
        props.getfbCustomers(usertoken);
        props.getfbChats(usertoken);

        props.getresponses(usertoken);
        callonce=true;

      }

        super(props, context);
        //fb related
        this.getfbCustomer = this.getfbCustomer.bind(this);
        this.getfbMessage = this.getfbMessage.bind(this);


  }

getfbCustomer(data){
 // alert('New fb customer '+ data.first_name);
  if(this.props.fbcustomers){
    this.props.updateCustomerList(data,this.props.fbcustomers);
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
  if(props.fbcustomers && props.fbchats && callonce == true && this.refs.sessionid){
   // alert(props.fbcustomers.length);
   // alert(props.fbcustomers[0].first_name)

    this.refs.sessionid.value = props.fbcustomers[0].user_id;
    this.props.selectFbCustomerChat(props.fbcustomers[0].user_id,props.fbchats,props.fbcustomers[0].profile_pic);
    callonce=false;

  }

}
 handleSession(customer,e){

    //  alert(customer.user_id);
      e.preventDefault();
      const usertoken = auth.getToken();
      this.refs.sessionid.value = customer.user_id;
      this.refs.customername.value = customer.first_name+' '+customer.last_name;
      this.props.updatefbstatus(customer.user_id,this.props.fbchats);

      this.props.selectFbCustomerChat(customer.user_id,this.props.fbchats,customer.profile_pic);
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

                {this.props.fbcustomers && this.props.fbcustomers.length == 0?
                  <p>No Customer is online currently.</p>

                  :
                <table className="table">

             			<tbody>
                   	<tr>
			             		<td  className="col-md-2 myleftborder">
			             			<div>
					                      {this.props.fbcustomers && this.props.fbchats &&
					                        this.props.fbcustomers.map((customer, i) => (

                                    <FbCustomerListItem onClickSession={this.handleSession.bind(this,customer)} userchat = {this.props.fbchats.filter((ch) => ch.senderid== customer.user_id)}  customer={customer} key={i} />

                                  )
                                  )
					                      }


			                   </div>
			                 </td>
                       <td  className="col-md-6">
                      <div>
                          {this.props.fbcustomers &&
                            <div>
                                <label>Customer Name :</label>
                                <input defaultValue = {this.props.fbcustomers[0].first_name+ ' '+this.props.fbcustomers[0].last_name} ref="customername"/>
                                 <input type="text" ref = "sessionid" defaultValue = {this.props.fbcustomers[0].user_id} />

                           </div>
                         }
                           {this.props.fbchatSelected && this.props.fbcustomers && this.refs.sessionid && this.refs.customername &&
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
                    };
}

export default connect(mapStateToProps,{getfbCustomers,add_socket_fb_message,updateCustomerList,getfbChats,updatefbstatus,getresponses,selectFbCustomerChat})(FbChat);
