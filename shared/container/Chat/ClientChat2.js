import ChatListItem from './ChatListItem';
import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {showAllChat}  from '../../redux/actions/actions'
import {savechat}  from '../../redux/actions/actions'

import ClientChatView2 from './ClientChatView2';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import { bindActionCreators } from 'redux';
import io from 'socket.io-client';


class ClientChat2 extends Component {

 constructor(props, context) {
     const { dispatch} =props;
     console.log('componentWillMount is called');
        props.showAllChat();
        super(props, context);



  }

   handleChange(e){
     alert(e.target.value);

    }



  render() {

    return (
      <div>

       <div className="page-container">
       <div className="widgetheader">
          <div style={{'paddingTop':'2em'}}>

              <h3 className ="page-title widgettitle">KiboEngage Chat Widget </h3>
              {this.props.companylogo && this.props.companylogo != '' &&
               <img ref="logo" src={this.props.companylogo.substr(0,this.props.companylogo.length)}  style={{'width':'50px','height':'50px'}} className="pull-left"/>
              }

            </div>
        </div>

          <div className="page-content-wrapper">
            <div className="page-content">
            <div className="portlet box grey-cascade">
              <div className="portlet-title">
                <div className="caption">
                    <i className="fa fa-group"/>
                  Client Chat
                </div>
              </div>

           <div className="portlet-body">


             	<div className="table-responsive">
             		<table className="table">
             			<tbody>
			             	<tr>
			             		    <td className="col-md-6">
			                    	<ClientChatView2 socket={this.props.route.socket}/>
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
  return {
          customerchat :(state.dashboard.customerchat),
          customerid :(state.dashboard.customerid),
          chatlist :(state.dashboard.chatlist),
          sessiondetails :(state.widget.sessiondetails),
          companylogo:(state.widget.companylogo),
 	      };
}

export default connect(mapStateToProps,{showAllChat})(ClientChat2);
