import ChatListItem from './ChatListItem';
import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {showAllChat}  from '../../redux/actions/actions'

import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import CustomerChatView from './CustomerChatView';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import { bindActionCreators } from 'redux';

class Chat extends Component {

 constructor(props, context) {
      //call action to get user groups 
    const usertoken = auth.getToken();
     console.log('componentWillMount is called');
    if(usertoken != null)
    {
       
        console.log(usertoken);
        props.showAllChat();
      }
      
        super(props, context);
  
  
    
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
              <h3 className ="page-title">Customer Chat Management </h3>
            <ul className="page-breadcrumb breadcrumb">
                  <li>
                    <i className="fa fa-home"/>
                    <Link to="/dashboard"> Dashboard </Link>
                    <i className="fa fa-angle-right"/> 
                  </li>                  
                  <li>
                               <Link to="/chat">Customer Chat Management</Link>
                  </li>               
  
            </ul>
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
             		<td className="col-md-1">
             			<div>
		                      {this.props.customerchat &&
		                        this.props.customerchat.map((customer, i) => (
		                          
		                          <ChatListItem customer={customer} key={i}  />
		                                                      
		                        ))
		                      }
                     	</div>
                    </td>
                    <td className="col-md-2">
                    	<CustomerChatView customerid = {this.props.customerid}/>
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
 
           };
}

export default connect(mapStateToProps,{showAllChat})(Chat);
