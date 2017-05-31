import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import ResolvedSessionListItem from './ResolvedSessionListItem';
import {filterResolvedSession,getresolvedsessions,getcustomersubgroups,getcustomers,getresolvedsessionsfromsocket,updatesubgrouplist} from '../../redux/actions/actions'
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router'

class ResolvedSessions extends Component {

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
        props.getresolvedsessions(usertoken);
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
    const usertoken = auth.getToken();
    this.props.getresolvedsessionsfromsocket(data,this.props.resolvedsessions);

    this.forceUpdate();
  }

  handleChange(){
     //alert(e.target.value);
     this.setState({ subgroup: this.refs.teamlist.value });
     this.props.filterResolvedSession(this.refs.teamlist.value, this.refs.channellist.value, this.refs.agentList.value, this.props.resolvedsessions);
     if(this.state.subgroup.value !== 'all') {
       this.props.updatesubgrouplist(this.refs.teamlist.value);
     }
     this.forceUpdate();
  }

  componentDidMount(){
       this.props.route.socket.on('returnCustomerSessionsList',this.getupdatedSessions);
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
              <h3 className ="page-title">Resolved Chat Sessions </h3>
            <ul className="page-breadcrumb breadcrumb">
                  <li>
                    <i className="fa fa-home"/>
                    <Link to="/dashboard"> Dashboard </Link>
                    <i className="fa fa-angle-right"/>
                  </li>
                  <li>
                               <Link to="/resolvedchatsessions">Resolved Chat Sessions </Link>
                  </li>

            </ul>
            <div className="portlet box grey-cascade">
              <div className="portlet-title">
                <div className="caption">
                    <i className="fa fa-user"/>
                  Resolved Chat Sessions
                </div>
              </div>

           <div className="portlet-body">
           <div className="table-responsive">
                    <table className="table">
                     <tbody>
                     <tr>
                       <th className="col-md-1">Group</th>
                       <th className="col-md-1">Sub Group</th>
                       <th className="col-md-1">Agents</th>
                     </tr>
                     <tr>
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

             { this.props.resolvedsessionsfiltered && this.props.resolvedsessionsfiltered.length > 0 ?
               <div className="table-responsive">
                   <table id ="sample_3" className="table table-striped table-bordered table-hover dataTable">
                   <thead>
                    <tr>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Visitor Name </th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Visitor Email</th>
                     <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Group</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >SubGroup</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Agent Name</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Status</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Request Time</th>

                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Options</th>


                    </tr>
                    </thead>

                    <tbody>
                      {
                        this.props.resolvedsocketsessions && this.props.customers && this.props.subgroups && this.props.groupdetails && this.props.agents &&
                        this.props.resolvedsocketsessions.map((session, i) => (

                          <ResolvedSessionListItem session={session} key={session.request_id} agent={this.props.agents.filter((c) => c._id == session.agent_ids[session.agent_ids.length-1])}   subgroups = {this.props.subgroups.filter((c) => c._id == session.messagechannel[session.messagechannel.length-1])} groups = {this.props.groupdetails.filter((c) => c._id == session.departmentid)}/>

                        ))
                      }


                      {
                        this.props.resolvedsessionsfiltered && this.props.customers && this.props.subgroups && this.props.groupdetails && this.props.agents &&
                        this.props.resolvedsessionsfiltered.map((session, i) => (

                          <ResolvedSessionListItem session={session} key={session.request_id} agent={this.props.agents.filter((c) => c._id == session.agent_ids[session.agent_ids.length-1].id)}  subgroups = {this.props.subgroups.filter((c) => c._id == session.messagechannel[session.messagechannel.length-1])} groups = {this.props.groupdetails.filter((c) => c._id == session.departmentid)}/>

                        ))
                      }
                     </tbody>
                    </table>
                    </div> :
                    <p>Currently, there is not any resolved chat sessions to show.</p>
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

ResolvedSessions.propTypes = {

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
          resolvedsessions :(state.dashboard.resolvedsessions),
          customers:(state.dashboard.customers),
          resolvedsocketsessions : (state.dashboard.resolvedsocketsessions),
          resolvedsessionsfiltered: (state.dashboard.resolvedsessionsfiltered),
          filterlist :(state.widget.filterlist)
           };

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({filterResolvedSession:filterResolvedSession,getcustomersubgroups:getcustomersubgroups,updatesubgrouplist:updatesubgrouplist,getresolvedsessions:getresolvedsessions,getresolvedsessionsfromsocket:getresolvedsessionsfromsocket,getcustomers:getcustomers}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(ResolvedSessions);
