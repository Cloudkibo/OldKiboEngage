import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import SessionListItem from './SessionListItem';
import {getsessions,getcustomers,filterbysessionMedium,filterbysessionDept,filterbysessionChannel,filterbysessionAgent,filterbysessionstatus} from '../../redux/actions/actions'
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router'

class SessionSummary extends Component {

 constructor(props, context) {
      //call action to get user groups
    if(props.userdetails.accountVerified == "No"){
    browserHistory.push('/notverified');
   }
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
    this.state ={
      loading:true
    };


  }

  getupdatedSessions(data)
  {
    const usertoken = auth.getToken();
    this.props.getassignedsessionsfromsocket(data,this.props.assignedsessions);

    this.forceUpdate();
  }

  componentDidMount(){
    //const usertoken = auth.getToken();
    //this.props.getsessions();
   //    this.props.route.socket.on('returnCustomerSessionsList',this.getupdatedSessions);
     if(this.props.sessionsummaryfiltered){
        this.setState({loading:false});
      }
  }

  handleChange(e){
     //alert(e.target.value);
     this.props.filterbysessionstatus(e.target.value,this.props.sessionsummary);
     this.forceUpdate();


    }

    handleChangeMedium(e){
    //  alert(e.target.value);
      this.props.filterbysessionMedium(e.target.value,this.props.sessionsummary);
      this.forceUpdate();
    }

    handleChangeDepartment(e){
     //alert(e.target.value);
     this.props.filterbysessionDept(e.target.value,this.props.sessionsummary);
     this.forceUpdate();


    }
     handleChangeChannel(e){
     //alert(e.target.value);
     this.props.filterbysessionChannel(e.target.value,this.props.sessionsummary);
     this.forceUpdate();


    }

    handleChangeAgents(e){
    // alert(e.target.value);
     this.props.filterbysessionAgent(e.target.value,this.props.sessionsummary);
     this.forceUpdate();


    }
    componentWillReceiveProps(nextprops){
      if(nextprops.sessionsummaryfiltered){
        this.setState({loading:false});
      }
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
                                  <th className="col-md-1">Team</th>
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

                                    <select  ref = "client" onChange={this.handleChangeMedium.bind(this)}   >
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

                                    <select  ref = "teamlist" onChange={this.handleChangeDepartment.bind(this)}   >
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
                                            this.props.subgroups && this.props.subgroups.map((subgroup,i) =>
                                              <option value={subgroup._id}>{subgroup.msg_channel_name}</option>

                                              )
                                           }

                                        </select>

                                  </td>
                                </tr>
                                </tbody>
                                  </table>
                         </div>
              {
                this.state.loading == true?
                  <p> Loading Session Summary... </p>:
                  <br/>
              }
             { this.props.sessionsummaryfiltered &&
                   <table id ="sample_3" className="table table-striped table-bordered table-hover dataTable">
                   <thead>
                    <tr>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Visitor Name </th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Visitor Email</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Group</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >SubGroup</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Assigned Agent</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Medium</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Request Time</th>
                    
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Status</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Options</th>


                    </tr>
                    </thead>

                    <tbody>
                      {
                        this.props.sessionsummaryfiltered && this.props.customers && this.props.subgroups && this.props.groupdetails && this.props.agents &&
                        this.props.sessionsummaryfiltered.map((session, i) => (

                           <SessionListItem session={session} key={session.request_id} agent={this.props.agents.filter((c) => c._id == session.agent_ids[session.agent_ids.length-1].id)} customers={this.props.customers.filter((c) => c._id == session.customerid)} subgroups = {this.props.subgroups.filter((c) => c._id == session.messagechannel[session.messagechannel.length-1])} groups = {this.props.groupdetails.filter((c) => c._id == session.departmentid)} viewoption = "true"/>

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
  console.log(state.dashboard.sessionsummaryfiltered);
  return {
          subgroups:(state.dashboard.subgroups),
          userdetails:(state.dashboard.userdetails),
          groupdetails :(state.dashboard.groupdetails),
          errorMessage:(state.dashboard.errorMessage),
          responses :(state.dashboard.responses),
          agents:(state.dashboard.agents),
          deptagents:(state.dashboard.deptagents),
          sessions :(state.dashboard.sessions),
          customers:(state.dashboard.customers),
          customerchat : (state.dashboard.customerchat),
          sessionsummary : (state.dashboard.sessionsummary),
          sessionsummaryfiltered : (state.dashboard.sessionsummaryfiltered)

           };

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({getsessions:getsessions,getcustomers:getcustomers,filterbysessionMedium:filterbysessionMedium,filterbysessionDept:filterbysessionDept,filterbysessionChannel:filterbysessionChannel,filterbysessionAgent:filterbysessionAgent,filterbysessionstatus:filterbysessionstatus}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(SessionSummary);
