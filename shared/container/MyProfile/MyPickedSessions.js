import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import MyPickedSessionListItem from './MyPickedSessionListItem';
import {getmypickedsessions,getcustomers} from '../../redux/actions/actions'
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router'

class MyPickedSessions extends Component {

 constructor(props, context) {
      //call action to get user teams 
    if(props.userdetails.accountVerified == "No"){
    browserHistory.push('/notverified');
   }
    const usertoken = auth.getToken();
    //console.log('constructor is called');
    if(usertoken != null)
    {
       
        //console.log(usertoken);
      //  props.getsessions(usertoken);
        props.getmypickedsessions(usertoken,props.userdetails._id);
        props.getcustomers(usertoken);
      }
    super(props, context);
   

    
  }
 

  render() {
    //console.log(this.props.userdetails.firstname)
    const token = auth.getToken()
    //console.log(token)
     return (
      <div className="vbox viewport">
       <AuthorizedHeader name = {this.props.userdetails.firstname} user={this.props.userdetails}/>
       <div className="page-container hbox space-between">
         <SideBar isAdmin ={this.props.userdetails.isAdmin}/> 
          <div className="page-content-wrapper">
            <div className="page-content"> 
              <h3 className ="page-title">My Picked Chat Sessions </h3>
            <ul className="page-breadcrumb breadcrumb">
                  <li>
                    <i className="fa fa-home"/>
                    <Link to="/dashboard"> Dashboard </Link>
                    <i className="fa fa-angle-right"/> 
                  </li>                  
                  <li>
                               <Link to="/mypickedchatsessions">My Picked Chat Sessions </Link>
                  </li>               
  
            </ul>
            <div className="portlet box grey-cascade">
              <div className="portlet-title">
                <div className="caption">
                    <i className="fa fa-user"/>
                  My Picked Chat Sessions
                </div> 
              </div>    
        
           <div className="portlet-body">
            
             { this.props.mypickedsessions &&
                   <table id ="sample_3" className="table table-striped table-bordered table-hover dataTable">
                   <thead>
                    <tr>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Visitor Name </th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Visitor Email</th>
                     <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Team</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Message Channel</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Status</th>
                      
                   
                    </tr>
                    </thead>

                    <tbody>                    
                      {
                        this.props.mypickedsessions && this.props.customers && this.props.subgroups && this.props.groupdetails &&
                        this.props.mypickedsessions.map((session, i) => (
                          
                          <MyPickedSessionListItem session={session} key={session.request_id} userdetails={this.props.userdetails} customers={this.props.customers.filter((c) => c._id == session.customerid)} subgroups = {this.props.subgroups.filter((c) => c._id == session.messagechannel[session.messagechannel.length-1])} groups = {this.props.groupdetails.filter((c) => c._id == session.departmentid)}/>
                                                      
                        ))
                      }
                     </tbody> 
                    </table>
                }
        
                
            </div>
          </div>
       </div>
       </div> 
      </div>
      </div> 
  )
  }
}

MyPickedSessions.propTypes = {

  errorMessage: PropTypes.string,
}
function mapStateToProps(state) {
  //console.log("mapStateToProps is called");
  return {
          subgroups:(state.dashboard.subgroups),
          userdetails:(state.dashboard.userdetails),
          groupdetails :(state.dashboard.groupdetails),
          errorMessage:(state.dashboard.errorMessage),
          responses :(state.dashboard.responses),
          agents:(state.dashboard.agents),
          deptagents:(state.dashboard.deptagents),
          mypickedsessions :(state.dashboard.mypickedsessions),
          customers:(state.dashboard.customers)
           };

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({getmypickedsessions:getmypickedsessions,getcustomers:getcustomers}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(MyPickedSessions);



