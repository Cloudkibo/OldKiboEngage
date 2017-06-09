import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import SessionListItem from './SessionListItem';
import {getcustomersubgroups,updatesubgrouplist,filterAssignedSession,getassignedsessions,getcustomers,getassignedsessionsfromsocket} from '../../redux/actions/actions'
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router'

class AssignedSessions extends Component {

 constructor(props, context) {
      //call action to get user groups
    if(props.userdetails.accountVerified == "No"){
    browserHistory.push('/notverified');
   }

   var appid = '5wdqvvi8jyvfhxrxmu73dxun9za8x5u6n59';
   var appsecret = 'jcmhec567tllydwhhy2z692l79j8bkxmaa98do1bjer16cdu5h79xvx';
   var companyid = props.userdetails.uniqueid;
   props.getcustomersubgroups(appid,appsecret,companyid);

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
    this.state = {
      subgroup: 'all'
    };
    this.getupdatedSessions = this.getupdatedSessions.bind(this);
    this.handleChange = this.handleChange.bind(this);


  }

  getupdatedSessions(data)
  {
    this.props.getassignedsessionsfromsocket(data,this.props.assignedsessions);
    this.forceUpdate();
  }

  handleChange(){
     //alert(e.target.value);
     this.setState({ subgroup: this.refs.teamlist.value });
     this.props.filterAssignedSession(this.refs.client.value, this.refs.teamlist.value, this.refs.channellist.value, this.refs.agentList.value, this.props.assignedsessions);
     if(this.state.subgroup.value !== 'all') {
       this.props.updatesubgrouplist(this.refs.teamlist.value);
     }
     this.forceUpdate();
  }

  componentDidMount(){
        console.log("Pre page");
        // todo discuss with zarmeen, why force update
        this.props.route.socket.on('returnCustomerSessionsList',this.getupdatedSessions);
        console.log("Pagination added from component did mount");

  }
  render() {
    const token = auth.getToken()
    console.log(token)
     return (
      <div className="vbox viewport">
       <AuthorizedHeader name = {this.props.userdetails.firstname} user={this.props.userdetails}/>
       <div className="page-container hbox space-between">
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
           <div className="table-responsive">
                    <table className="table" id="avicii">
                     <tbody>
                     <tr>
                       <th className="col-md-1">Medium</th>
                       <th className="col-md-1">Group</th>
                       <th className="col-md-1">Sub Group</th>
                       <th className="col-md-1">Agent</th>
                     </tr>
                     <tr>
                     <td className="col-md-1">

                       <select  ref = "client" onChange={this.handleChange.bind(this)}   >
                               <option value="all">All</option>
                               <option value="mobile">Mobile</option>
                               <option value="web">Web</option>

                           </select>
                     </td>
                       <td className="col-md-1">

                         <select  ref = "teamlist" onChange={this.handleChange.bind(this)}   >
                                  <option value="all">All</option>
                                 {

                                     this.props.groupdetails && this.props.groupdetails.map((group,i) =>
                                       <option value={group._id}>{group.deptname}</option>
                                     )
                                }



                             </select>

                       </td>
                       <td className="col-md-1">
                         <select  ref = "channellist" onChange={this.handleChange.bind(this)}   >
                                    <option value="all">All</option>
                                  {
                                    this.state.subgroup == 'all' ?
                                    this.props.subgroups && this.props.subgroups.map((subgroup,i) =>
                                         <option value={subgroup._id}>{this.props.groupdetails.filter((d) => d._id == subgroup.groupid)[0].deptname + ' : ' +subgroup.msg_channel_name}</option>
                                    ) :
                                    this.props.filterlist && this.props.filterlist.map((subgroup,i) =>
                                      <option value={subgroup._id}>{subgroup.msg_channel_name}</option>
                                    )

                                }

                             </select>

                       </td>
                       <td className="col-md-1">

                         <select  ref = "agentList" onChange={this.handleChange.bind(this)}   >
                               <option value="all">All</option>

                                {
                                 this.props.agents && this.props.agents.map((agent,i) =>
                                   <option value={agent._id}>{agent.firstname + ' ' + agent.lastname}</option>

                                   )
                                }


                             </select>
                       </td>
                     </tr>
                     </tbody>
                       </table>
              </div>

             { this.props.assignedsessionsfiltered && this.props.assignedsessionsfiltered.length > 0 ?
                   <div className="table-responsive">
                   <table id ="sample_3" className="table table-condensed table-striped table-bordered table-hover dataTable">
                   <thead>
                    <tr>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Visitor Name </th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Visitor Email</th>
                     <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Group</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >SubGroup</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Agent Name</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Platform</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Request Time</th>

                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Status</th>


                    </tr>
                    </thead>

                    <tbody>
                      {
                        this.props.assignedsocketsessions && this.props.customers && this.props.subgroups && this.props.groupdetails && this.props.agents &&
                        this.props.assignedsocketsessions.map((session, i) => (

                          <SessionListItem session={session} key={session.request_id} agent={this.props.agents.filter((c) => c._id == session.agent_ids[session.agent_ids.length-1].id)}  subgroups = {this.props.subgroups.filter((c) => c._id == session.messagechannel[session.messagechannel.length-1])} groups = {this.props.groupdetails.filter((c) => c._id == session.departmentid)}/>

                        ))
                      }


                      {
                        this.props.assignedsessionsfiltered && this.props.customers && this.props.subgroups && this.props.groupdetails && this.props.agents &&
                        this.props.assignedsessionsfiltered.map((session, i) => (

                          <SessionListItem session={session} key={session.request_id} agent={this.props.agents.filter((c) => c._id == session.agent_ids[session.agent_ids.length-1].id)} subgroups = {this.props.subgroups.filter((c) => c._id == session.messagechannel[session.messagechannel.length-1])} groups = {this.props.groupdetails.filter((c) => c._id == session.departmentid)}/>

                        ))
                      }
                     </tbody>
                    </table>
                    </div> :
                    <p>Currently, there is not any assigned chat sessions to show.</p>
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
          subgroups:(state.dashboard.subgroups),
          userdetails:(state.dashboard.userdetails),
          groupdetails :(state.dashboard.groupdetails),
          errorMessage:(state.dashboard.errorMessage),
          responses :(state.dashboard.responses),
          agents:(state.dashboard.agents),
          deptagents:(state.dashboard.deptagents),
          assignedsessions :(state.dashboard.assignedsessions),
          assignedsessionsfiltered :(state.dashboard.assignedsessionsfiltered),
          customers:(state.dashboard.customers),
          assignedsocketsessions : (state.dashboard.assignedsocketsessions),
          filterlist :(state.widget.filterlist)
           };

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({getcustomersubgroups:getcustomersubgroups,updatesubgrouplist:updatesubgrouplist,filterAssignedSession:filterAssignedSession,getassignedsessions:getassignedsessions,getassignedsessionsfromsocket:getassignedsessionsfromsocket,getcustomers:getcustomers}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(AssignedSessions);
