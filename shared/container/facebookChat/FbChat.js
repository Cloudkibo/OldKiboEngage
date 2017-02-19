import FbCustomerListItem from './FbCustomerListItem';
import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {getfbCustomers,getfbChats,getresponses}  from '../../redux/actions/actions'

import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router'
import Avatar from 'react-avatar';
import io from 'socket.io-client';

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

      }

        super(props, context);
        //fb related
        this.getfbCustomer = this.getfbCustomer.bind(this);
        this.getfbMessage = this.getfbMessage.bind(this);

  }

getfbCustomer(data){
  alert('New fb customer '+ data.first_name);
}

getfbMessage(data){
    alert('New fb message '+ data.message.text);
}
syncdata(){

}


componentDidMount(){
       const usertoken = auth.getToken();
       
        //fb related
        this.props.route.socket.on('send:fbcustomer',this.getfbCustomer);
        this.props.route.socket.on('send:fbmessage',this.getfbMessage);

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
			             		<td  className="col-md-3">
			             			<div>
					                      {this.props.fbcustomers && this.props.fbchats &&
					                        this.props.fbcustomers.map((customer, i) => (

                                    <FbCustomerListItem userchat = {this.props.fbchats.filter((ch) => ch.senderid== customer.user_id)}  customer={customer} key={i} />
                                  
                                  )


					                        )



                                  
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

          fbcustomers:state.dashboard.fbcustomers,
          fbchats:state.dashboard.fbchats,
                    };
}

export default connect(mapStateToProps,{getfbCustomers,getfbChats,getresponses})(FbChat);
