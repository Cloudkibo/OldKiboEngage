import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import SessionListItem from './SessionListItem';
import {getsessions,getcustomers} from '../../redux/actions/actions'
import { bindActionCreators } from 'redux';

class SessionSummary extends Component {

 constructor(props, context) {
      //call action to get user groups 
    const usertoken = auth.getToken();
    console.log('constructor is called');
    if(usertoken != null)
    {
       
        console.log(usertoken);
      //  props.getsessions(usertoken);
        props.getsessions(usertoken);
        if(!props.customers)
        {
            props.getcustomers(usertoken);
        }
      }
    super(props, context);
    this.getupdatedSessions = this.getupdatedSessions.bind(this);
       

    
  }
 
  getupdatedSessions(data)
  {
    const usertoken = auth.getToken();
    this.props.getassignedsessionsfromsocket(data,this.props.assignedsessions);

    this.forceUpdate();
  }

  componentDidMount(){
   //    this.props.route.socket.on('returnCustomerSessionsList',this.getupdatedSessions);
  }

  handleChange(e){
     alert(e.target.value);
    // this.props.filterbystatus(e.target.value,this.props.customerchatold);
    // this.forceUpdate();
   
   
    }


    handleChangeDepartment(e){
     alert(e.target.value);
     //this.props.filterbyDept(e.target.value,this.props.customerchatold);
     //this.forceUpdate();
   
   
    }
     handleChangeChannel(e){
     alert(e.target.value);
     //this.props.filterbyChannel(e.target.value,this.props.customerchatold);
     //this.forceUpdate();
   
   
    }

    handleChangeAgents(e){
     alert(e.target.value);
     //this.props.filterbyAgent(e.target.value,this.props.customerchatold);
     //this.forceUpdate();
   
   
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
              <h3 className ="page-title">Summary of Chat Sessions </h3>
            <ul className="page-breadcrumb breadcrumb">
                  <li>
                    <i className="fa fa-home"/>
                    <Link to="/dashboard"> Dashboard </Link>
                    <i className="fa fa-angle-right"/> 
                  </li>                  
                  <li>
                               <Link to="/summarychatsessions">Summary of Chat Sessions </Link>
                  </li>               
  
            </ul>
            <div className="portlet box grey-cascade">
              <div className="portlet-title">
                <div className="caption">
                    <i className="fa fa-user"/>
                   Summary of Chat Sessions
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
                                            <option value="all">All</option>
                                            <option value="new">New</option>
                                            <option value="assigned">Assigned</option>
                                            <option value="resolved">Resolved</option>
                                            <option value="archived">Archived</option>
                                        </select>
                                  </td>
                                  <td className="col-md-1">
                                  
                                    <select  ref = "client" onChange={this.handleChange.bind(this)}   >
                                            <option value="all">All</option>
                                            <option value="mobile">Mobile</option>
                                            <option value="web">Web</option>
                                            
                                        </select>
                                  </td>
                                  <td className="col-md-1">
                                  
                                    <select  ref = "agentList" onChange={this.handleChangeAgents.bind(this)}   >
                                          <option value="all">All</option>
                                
                                           {
                                            this.props.agents && this.props.agents.map((agent,i) =>
                                              <option value={agent._id}>{agent.firstname + ' ' + agent.lastname}</option>

                                              )
                                           }
                                            
                                           
                                        </select>
                                  </td>
                                  <td className="col-md-1">
                                    
                                    <select  ref = "grouplist" onChange={this.handleChangeDepartment.bind(this)}   >
                                             <option value="all">All</option>
                                            {
                                            this.props.groupdetails && this.props.groupdetails.map((group,i) =>
                                              <option value={group._id}>{group.deptname}</option>

                                              )
                                           }
                                           

                                           
                                        </select>
                               
                                  </td>
                                  <td className="col-md-1">
                                    <select  ref = "channellist" onChange={this.handleChangeChannel.bind(this)}   >
                                               <option value="all">All</option>
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

             { this.props.sessionsummary &&
                   <table id ="sample_3" className="table table-striped table-bordered table-hover dataTable">
                   <thead>
                    <tr>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Visitor Name </th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Visitor Email</th>
                     <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Group</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Message Channel</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Agent Name</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Status</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Options</th>
                        
                   
                    </tr>
                    </thead>

                    <tbody>                    
                      {
                        this.props.sessionsummary && this.props.customers && this.props.channels && this.props.groupdetails && this.props.agents &&
                        this.props.sessionsummary.map((session, i) => (
                          
                           <SessionListItem session={session} key={session.request_id} agent={this.props.agents.filter((c) => c._id == session.agent_ids[session.agent_ids.length-1])} customers={this.props.customers.filter((c) => c._id == session.customerid)} channels = {this.props.channels.filter((c) => c._id == session.messagechannel[session.messagechannel.length-1])} groups = {this.props.groupdetails.filter((c) => c._id == session.departmentid)} viewoption = "true"/>
                                                     
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

SessionSummary.propTypes = {

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
          sessions :(state.dashboard.sessions),
          customers:(state.dashboard.customers),
          customerchat : (state.dashboard.customerchat),
          sessionsummary : (state.dashboard.sessionsummary)          
           };

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({getsessions:getsessions,getcustomers:getcustomers}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(SessionSummary);



