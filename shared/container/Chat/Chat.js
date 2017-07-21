import ChatListItem from './ChatListItem';
import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {
  removeDuplicates,
  updatesubgrouplist,
  getcustomersubgroups,
  getsessionsfromsocket,
  removeDuplicatesWebChat,
  updatechatstatus,
  previousChat,
  getteams,
  getTeamAgents,
  getspecificuserchats_mobile,
  updateChatList,
  getchatsfromsocket,
  getmobilesessions,
  updateAgentList,
  getuserchats,
  getresponses,
  getcustomers,
  setsocketid,
  filterChat,
  selectCustomerChat,
  updatechatsessionstatus,
  getDeptTeams,getunreadsessionscount, deleteUnreadCountStatusWhenAgentReadForSimple,
}  from '../../redux/actions/actions';

import {initiateChatComponent} from '../../socket';

import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import CustomerChatView from './CustomerChatView';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import {bindActionCreators} from 'redux';
import {browserHistory} from 'react-router'
import {printlogs} from '../../services/clientlogging';

import io from 'socket.io-client';

import {} from '../../socket';

var callMobileChatSessions;
var callOnce;
var callSocketChat;
class Chat extends Component {

  constructor(props, context) {

    var appid = '5wdqvvi8jyvfhxrxmu73dxun9za8x5u6n59';
    var appsecret = 'jcmhec567tllydwhhy2z692l79j8bkxmaa98do1bjer16cdu5h79xvx';
    var companyid = props.userdetails.uniqueid;
    props.getcustomersubgroups(appid, appsecret, companyid);
    //call action to get user teams
    callMobileChatSessions = false;
    callOnce = false;
    callSocketChat = false
    if (props.userdetails.accountVerified == "No") {
      browserHistory.push('/notverified');
    }
    const usertoken = auth.getToken();
    if (usertoken != null) {

      printlogs('log', usertoken);
      //for webclients no need to fetch sessions and customer list from server

      //but for mobile clients we will fetch list of sessions and customers from server
      props.getmobilesessions(usertoken);
      props.getuserchats(usertoken); //get mobile userchats

      props.getresponses(usertoken);

      // get groups list and agents
      props.getteams(usertoken);
      props.getTeamAgents(usertoken);
      props.getDeptTeams(usertoken);
      props.getunreadsessionscount(usertoken,props.userdetails._id);



    }

    super(props, context);
    this.state = {
      subgroup: 'all'
    };
    this.showSession = this.showSession.bind(this);
    this.get_list_of_agents_in_team=this.get_list_of_agents_in_team.bind(this);
    this.getchannelname = this.getchannelname.bind(this);

  }

  getchannelname(subgroup){
    var deptname = 'deleted'
    if(this.props.groupdetails.filter((d) => d._id == subgroup.groupid).length > 0){
      deptname = this.props.groupdetails.filter((d) => d._id == subgroup.groupid)[0].deptname;
    }
    return deptname+ ' : ' + subgroup.msg_channel_name;
  }
   showSession(customer){
    console.log('showSession called');
   // console.log(customer);
    var get_teams_assigned_to_group = this.props.deptteams.filter((c) => c.deptid._id == customer.departmentid);
   // console.log(get_teams_assigned_to_group.length);
    var is_agent_in_team = false;
    for(var i=0;i<get_teams_assigned_to_group.length;i++){
   //   console.log(get_teams_assigned_to_group[i]);
      for(var j=0;j<this.props.teamagents.length;j++){
        if(get_teams_assigned_to_group[i].teamid && get_teams_assigned_to_group[i].teamid._id == this.props.teamagents[j].groupid._id && this.props.teamagents[j].agentid._id == this.props.userdetails._id ){
          is_agent_in_team = true;
          break;

        }
      }
      if(is_agent_in_team == true){
        break;
      }

    }
   return is_agent_in_team;
  }

  get_list_of_agents_in_team(customer){
    var get_teams_assigned_to_group = this.props.deptteams.filter((c) => c.deptid._id == customer.departmentid);
    var agents_in_teams = [];
    console.log('length of teams');
    console.log(get_teams_assigned_to_group.length);

    if(customer.platform == "mobile"){
            for(var i=0;i<get_teams_assigned_to_group.length;i++){
              for(var j=0;j<this.props.teamagents.length;j++){
                if(get_teams_assigned_to_group[i].teamid._id == this.props.teamagents[j].groupid._id){
                  console.log('agent matched');

                  agents_in_teams.push(this.props.teamagents[j].agentid);

                }
              }

            }
    }

    //if the platform is web we will filter the items in online Agents list
    else{
            for(var i=0;i<get_teams_assigned_to_group.length;i++){
              for(var j=0;j<this.props.teamagents.length;j++){
                if(get_teams_assigned_to_group[i].teamid._id == this.props.teamagents[j].groupid._id){
                  console.log('agent matched');
                  // check if the agent is online
                  for(var z =0;z<this.props.onlineAgents.length;z++){
                    if(this.props.onlineAgents[z].agentId == this.props.teamagents[j].agentid._id){
                      agents_in_teams.push(this.props.teamagents[j].agentid);
                      break;
                    }
                  }


                }
              }

            }
    }
   // removing duplicates
  var newArray = [];
  var lookupObject = {};

  for (var i in agents_in_teams) {
    lookupObject[agents_in_teams[i]['_id']] = agents_in_teams[i];
  }

  for (i in lookupObject) {
    newArray.push(lookupObject[i]);
  }
   return newArray;
  }

//this code was for fetching previous chat messages when the agent is assigned a chat message

  componentWillReceiveProps(props) {
    // this will ensure that mobile sessions are completely fetched from server before merging it with socket sesisons
    const usertoken = auth.getToken();
    if (props.customerchat && callMobileChatSessions == false && props.serverresponse && props.serverresponse == 'received') {
      this.props.route.socket.emit('getCustomerSessionsListFirst', props.customerchat, props.userdetails.uniqueid);

      callMobileChatSessions = true
      this.forceUpdate();
    }
    if (props.userchats && callSocketChat == false) {
      this.props.route.socket.emit('getuserchats', this.props.userdetails.uniqueid);
      callSocketChat = true
    }

  }

  componentDidMount() {
    //get online agents list
    callMobileChatSessions = false
    callSocketChat = false;

    initiateChatComponent();

    // todo discuss with zarmeen as following are very complex and may not follow redux rules

    //this.props.route.socket.on('send:message', this.getSocketmessage); // half UI and half actions
  //  this.props.route.socket.on('informAgent', this.getSessionInfo); // can be separated
  }


  handleChange() {
    //alert(e.target.value);
    this.setState({subgroup: this.refs.grouplist.value});
    this.props.filterChat(this.refs.status.value, this.refs.agentList.value, this.refs.grouplist.value, this.refs.subgrouplist.value, this.props.customerchatold);
    if (this.state.subgroup.value !== 'all') {
      this.props.updatesubgrouplist(this.refs.grouplist.value);
    }
    this.forceUpdate();

    //this.props.filterbystatus(e.target.value,this.props.customerchatold);
    //this.forceUpdate();


  }

  handleSession(id, platform, e) {
    printlogs('log', id);
   // alert(id);
    e.preventDefault();
    const usertoken = auth.getToken();

    this.refs.sessionid.value = id;
    // alert(this.refs.sessionid.value);

    //retrieve chat history for mobile clients Only
    if (platform == "mobile") {

      this.props.getspecificuserchats_mobile(this.refs.sessionid.value, this.props.userdetails.uniqueid, usertoken)
      //this.forceUpdate()
    }

    // when the user clicks on session,reset unread message Count to zero and also remove Red Background Color from Chatlist item
    // this.props.updateUnreadCount(id,this.props.new_message_arrived_rid)

    this.props.selectCustomerChat(id, this.props.customerchat, this.props.new_message_arrived_rid);
    this.props.deleteUnreadCountStatusWhenAgentReadForSimple(usertoken, this.props.userdetails._id, id);
    //  this.forceUpdate();

  }


  render() {
    const token = auth.getToken()
    printlogs('log', token)

    return (
      <div className="vbox viewport">
        <AuthorizedHeader name={this.props.userdetails.firstname} user={this.props.userdetails}/>
        <div className="page-container hbox space-between">
          <SideBar isAdmin={this.props.userdetails.isAdmin}/>
          <div className="page-content-wrapper">
            <div className="vbox viewport" style={{'overflow': 'hidden'}}>
              { this.props.customerchatold && this.props.customerchatold.length > 0 ?
                <section className="main hbox space-between">

                  <nav className="navclassSessionList">
                    <div className="anotherflx ">
                   <div  className="uk-inline">
                      <button className="uk-button uk-button-primary" type="button">Filter</button>
                      <div ref={node => node && node.setAttribute('uk-dropdown', '')} >
                         <ul className="uk-nav uk-dropdown-nav">
                                <li className="uk-nav-header">Status</li>
                                <li>
                                   <select className="uk-select" ref="status" onChange={this.handleChange.bind(this)}>
                                      <option value="all">All</option>
                                      <option value="new">New</option>
                                      <option value="assigned">Assigned</option>
                                      <option value="resolved">Resolved</option>
                                    </select>
                                </li>
                                <li className="uk-nav-header">Agents</li>
                                <li>
                                   <select className="uk-select" ref="agentList" onChange={this.handleChange.bind(this)}>
                                        <option value="all">All</option>
                                        {
                                          this.props.agents && this.props.agents.map((agent, i) =>
                                            <option value={agent._id}>{agent.firstname + ' ' + agent.lastname}</option>
                                          )
                                        }
                                      </select>
                                </li>

                                <li className="uk-nav-header">Groups</li>
                                <li>
                                       <select className="uk-select" ref="grouplist" onChange={this.handleChange.bind(this)}>
                                        <option value="all">All</option>
                                        {
                                          this.props.groupdetails && this.props.groupdetails.map((group, i) =>
                                            <option value={group._id}>{group.deptname}</option>
                                          )
                                        }
                                      </select>
                                </li>
                                <li className="uk-nav-header">Sub Groups</li>
                                <li>
                                    <select className="uk-select" ref="subgrouplist" onChange={this.handleChange.bind(this)}>
                                      <option value="all">All</option>
                                      {
                                        this.state.subgroup == 'all' ?
                                          this.props.subgroups && this.props.subgroups.map((subgroup, i) =>
                                            <option
                                              value={subgroup._id}>{this.getchannelname(subgroup)}</option>
                                          ) :
                                          this.props.filterlist && this.props.filterlist.map((subgroup, i) =>
                                            <option value={subgroup._id}>{subgroup.msg_channel_name}</option>
                                          )
                                      }
                                    </select>
                                </li>
                            </ul>
                      </div>
                  </div>
                      <div className="headerchatarea" style={{'flexBasis': 50}}>
                        <input type="hidden" ref="sessionid"/>
                      </div>
                      <article  style={{marginTop: -45}}>

                        <div>
                          {
                            this.props.yoursocketid &&
                            <input type="hidden" ref="agentsocketfield" name="agentsocketfield"
                                   value={this.props.yoursocketid}/>
                          }
                          {this.props.userchats && this.props.deptteams && this.props.agents && this.props.groupdetails && this.props.teamdetails && this.props.customerchatfiltered && this.props.customerchatfiltered.length > 0 && this.props.subgroups && this.props.unreadcount&&
                          this.props.customerchatfiltered.map((customer, i) => (
                            this.showSession(customer) == true && this.props.subgroups.filter((c) => c._id == customer.messagechannel[customer.messagechannel.length - 1]).length>0 &&
                            (this.props.new_message_arrived_rid && this.props.userchats?

                                <ChatListItem
                                  userchat={this.props.userchats.filter((ch) => ch.request_id == customer.request_id)}
                                  selectedsession={this.props.customerchat_selected}
                                  new_message_arrived_rid={this.props.new_message_arrived_rid} customer={customer}
                                  unreadcount={this.props.unreadcount.filter((c) => c._id.request_id == customer.request_id)}
                                  key={i}
                                  onClickSession={this.handleSession.bind(this, customer.request_id, customer.platform)}
                                  group={this.props.groupdetails.filter((grp) => grp._id == customer.departmentid)}
                                  subgroup={this.props.subgroups.filter((c) => c._id == customer.messagechannel[customer.messagechannel.length - 1])}
                                  agents={this.props.agents} team={this.props.teamdetails}/>
                                :
                                <ChatListItem
                                  userchat={this.props.userchats.filter((ch) => ch.request_id == customer.request_id)}
                                  selectedsession={this.props.customerchat_selected} customer={customer} key={i}
                                  onClickSession={this.handleSession.bind(this, customer.request_id, customer.platform)}
                                  group={this.props.groupdetails.filter((grp) => grp._id == customer.departmentid)}
                                  subgroup={this.props.subgroups.filter((c) => c._id == customer.messagechannel[customer.messagechannel.length - 1])}
                                  agents={this.props.agents} team={this.props.teamdetails}
                                  unreadcount={this.props.unreadcount.filter((c) => c._id.request_id == customer.request_id)}
                                  />
                            )


                          ))
                          }
                        </div>
                      </article>
                    </div>
                  </nav>
                  <article className="articleclassChat" style={{overflowY: 'hidden'}}>
                    {this.refs.sessionid ?
                      <div>
                        {
                          this.props.customerchat_selected && this.props.customerchat_selected.platform == 'mobile' ?
                            (this.refs.sessionid && this.refs.sessionid.value && this.props.customerchat && this.props.customerchat.length > 0 && this.props.customerchat_selected  && this.props.onlineAgents && this.props.responses && this.props.mobileuserchat &&
                              <CustomerChatView newChatClicked="true" socket={ this.props.route.socket} {...this.props}
                                                sessiondetails={this.props.customerchat_selected}
                                                onlineAg={this.props.onlineAgents}
                                                mobileuserchat={this.props.mobileuserchat}
                                                deptagents={this.props.deptagents}
                                                list_of_agents_in_teams = {this.get_list_of_agents_in_team(this.props.customerchat_selected)}/>
                            ) :
                            (
                              this.refs.sessionid && this.refs.sessionid.value && this.props.customerchat && this.props.customerchat.length > 0 && this.props.customerchat_selected  && this.props.onlineAgents && this.props.responses && this.props.customerchat_selected.platform == 'web' &&
                              <CustomerChatView socket={ this.props.route.socket} {...this.props}
                                                sessiondetails={this.props.customerchat_selected}
                                                onlineAg={this.props.onlineAgents}
                                                mobileuserchat={this.props.mobileuserchat}
                                                deptagents={this.props.deptagents}
                                                list_of_agents_in_teams = {this.get_list_of_agents_in_team(this.props.customerchat_selected)}/>
                            )

                        }

                      </div> :
                      <p>Click on session to view Chat messages</p>
                    }

                  </article>
                </section>
                :
                <p> No Customer is online currently.</p>
              }

            </div>

          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {

  return {
    teamdetails: (state.dashboard.teamdetails),
    userdetails: (state.dashboard.userdetails),
    errorMessage: (state.dashboard.errorMessage),
    agents: (state.dashboard.agents),
    deptagents: (state.dashboard.deptagents),
    customerchat: (state.dashboard.customerchat),
    customerchatfiltered: (state.dashboard.customerchatfiltered),
    customerchatold: (state.dashboard.customerchatold),
    chatlist: (state.dashboard.chatlist),
    subgroups: (state.dashboard.subgroups),
    customers: (state.dashboard.customers),
    customerchat_selected: (state.dashboard.customerchat_selected),
    new_message_arrived_rid: (state.dashboard.new_message_arrived_rid),
    userchats: (state.dashboard.userchats),
    responses: (state.dashboard.responses),
    onlineAgents: (state.dashboard.onlineAgents),
    yoursocketid: (state.dashboard.yoursocketid),
    mobileuserchat: (state.dashboard.mobileuserchat),
    serverresponse: (state.dashboard.serverresponse),
    teamagents: (state.dashboard.teamagents),
    groupdetails: (state.dashboard.groupdetails),
    filterlist: (state.widget.filterlist),
    deptteams:(state.dashboard.deptteams),
    unreadcount:(state.dashboard.unreadcount),
  };
}

export default connect(mapStateToProps, {
  removeDuplicates,
  updatesubgrouplist,
  getcustomersubgroups,
  removeDuplicatesWebChat,
  updatechatstatus,
  getmobilesessions,
  getDeptTeams,
  getteams,
  getTeamAgents,
  previousChat,
  getspecificuserchats_mobile,
  updateChatList,
  getchatsfromsocket,
  getsessionsfromsocket,
  getresponses,
  setsocketid,
  updateAgentList,
  getuserchats,
  getcustomers,
  selectCustomerChat,
  filterChat,
  getunreadsessionscount,
  updatechatsessionstatus,
  deleteUnreadCountStatusWhenAgentReadForSimple,
})(Chat);
