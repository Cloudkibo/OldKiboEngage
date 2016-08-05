import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import SessionListItem from './SessionListItem';
import {getassignedsessions,getcustomers} from '../../redux/actions/actions'
import { bindActionCreators } from 'redux';

class AssignedSessions extends Component {

 constructor(props, context) {
      //call action to get user groups 
    const usertoken = auth.getToken();
    console.log('constructor is called');
    if(usertoken != null)
    {
       
        console.log(usertoken);
      //  props.getsessions(usertoken);
        props.getassignedsessions(usertoken);
        if(!props.customers)
        {
            props.getcustomers(usertoken);
        }
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
         <SideBar isAdmin ={this.props.userdetails.isAdmin}/> 
          <div className="page-content-wrapper">
            <div className="page-content"> 
              <h3 className ="page-title">Assigned Chat Sessions </h3>
            <ul className="page-breadcrumb breadcrumb">
                  <li>
                    <i className="fa fa-home"/>
                    <Link to="/dashboard"> Dashboard </Link>
                    <i className="fa fa-angle-right"/> 
                  </li>                  
                  <li>
                               <Link to="/assignedchatsessions">Assigned Chat Sessions </Link>
                  </li>               
  
            </ul>
            <div className="portlet box grey-cascade">
              <div className="portlet-title">
                <div className="caption">
                    <i className="fa fa-user"/>
                  Assigned Chat Sessions
                </div> 
              </div>    
        
           <div className="portlet-body">
            
             { this.props.assignedsessions &&
                   <table id ="sample_3" className="table table-striped table-bordered table-hover dataTable">
                   <thead>
                    <tr>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Visitor Name </th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Visitor Email</th>
                     <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Group</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Message Channel</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Agent Name</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Status</th>
                      
                   
                    </tr>
                    </thead>

                    <tbody>                    
                      {
                        this.props.assignedsessions && this.props.customers && this.props.channels && this.props.groupdetails && this.props.agents &&
                        this.props.assignedsessions.map((session, i) => (
                          
                          <SessionListItem session={session} key={session.request_id} agent={this.props.agents.filter((c) => c._id == session.agent_ids[session.agent_ids.length-1])} customers={this.props.customers.filter((c) => c._id == session.customerid)} channels = {this.props.channels.filter((c) => c._id == session.messagechannel[session.messagechannel.length-1])} groups = {this.props.groupdetails.filter((c) => c._id == session.departmentid)}/>
                                                      
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

AssignedSessions.propTypes = {

  errorMessage: PropTypes.string,
}
function mapStateToProps(state) {
  console.log("mapStateToProps is called");
  return {
          channels:(state.dashboard.channels),
          userdetails:(state.dashboard.userdetails),
          groupdetails :(state.dashboard.groupdetails),
          errorMessage:(state.dashboard.errorMessage),
          responses :(state.dashboard.responses),
          agents:(state.dashboard.agents),
          deptagents:(state.dashboard.deptagents),
          assignedsessions :(state.dashboard.assignedsessions),
          customers:(state.dashboard.customers)
           };

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({getassignedsessions:getassignedsessions,getcustomers:getcustomers}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(AssignedSessions);



