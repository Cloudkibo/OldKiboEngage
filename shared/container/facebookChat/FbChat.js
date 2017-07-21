import FbCustomerListItem from './FbCustomerListItem';
import ChatArea from './ChatArea';
import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {
  getfbCustomers,
  getmetaurl,
  sortSessionsList,
  appendlastmessage,
  getteams,
  updatefbsessionlist,
  getTeamAgents,
  getfbSessions,
  updatefbstatus,
  updateCustomerList,
  add_socket_fb_message,
  getfbChats,
  getresponses,
  getfbTeams,
  selectFbCustomerChat,
  getunreadsessionscount,
  deleteUnreadCountStatusWhenAgentReadForFb
}  from '../../redux/actions/actions'

import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import {browserHistory} from 'react-router'

import {printlogs} from '../../services/clientlogging';

var callonce = false;

class FbChat extends Component {
  constructor(props, context) {

    if (props.userdetails.accountVerified === "No") {
      browserHistory.push('/notverified');
    }
    const usertoken = auth.getToken();
    if (usertoken != null) {

     printlogs('log',usertoken);
      props.getfbSessions(usertoken);

      // props.getfbCustomers(usertoken);
      props.getfbChats(usertoken);

      props.getresponses(usertoken);

      // get groups list and agents
      props.getteams(usertoken);
      props.getTeamAgents(usertoken);
      props.getfbTeams(usertoken);
      props.getunreadsessionscount(usertoken,props.userdetails._id);

      //props.getmetaurl(url, usertoken);
      callonce = true;

    }

    super(props, context);
    //fb related
    //this.getfbMessage = this.getfbMessage.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.showSession = this.showSession.bind(this);
    this.get_list_of_agents_in_team=this.get_list_of_agents_in_team.bind(this);

  }
  showSession(customer){
    var get_teams_assigned_to_page = this.props.fbteams.filter((c) => c.pageid._id == customer.pageid._id);
    var is_agent_in_team = false;
    for(var i=0;i<get_teams_assigned_to_page.length;i++){
      for(var j=0;j<this.props.teamagents.length;j++){
        if(get_teams_assigned_to_page[i].teamid._id == this.props.teamagents[j].groupid._id && this.props.teamagents[j].agentid._id == this.props.userdetails._id ){
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
    var get_teams_assigned_to_page = this.props.fbteams.filter((c) => c.pageid._id == customer.pageid._id);
    var agents_in_teams = [];
    console.log('length of teams');
    console.log(get_teams_assigned_to_page.length);

    for(var i=0;i<get_teams_assigned_to_page.length;i++){
      for(var j=0;j<this.props.teamagents.length;j++){
        if(get_teams_assigned_to_page[i].teamid._id == this.props.teamagents[j].groupid._id){
          console.log('agent matched');

          agents_in_teams.push(this.props.teamagents[j].agentid);

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

  handleChange(e) {
    this.props.sortSessionsList(this.props.fbsessions, e.target.value);
  }



  syncdata() {

  }


  componentDidMount() {
    if(!this.refs.chatwindow && this.refs.no_session){
      this.refs.no_session.value = "No sessions to display";
    }
  }

  componentWillReceiveProps(props) {
    if (props.fbsessions && props.fbchats && props.fbsessions.length > 0 && props.fbteams && props.teamagents && props.userdetails) {
      // call action to append last messages
      if (!props.fbsessions[0].lastmessage) {
        this.props.appendlastmessage(props.fbsessions, props.fbchats,props.fbteams,props.teamagents,props.userdetails);
      }


    }

  }

  handleSession(customer, e) {

    //  alert(customer.user_id);
    e.preventDefault();
    const usertoken = auth.getToken();
    //  this.refs.sessionid.value = customer.user_id.user_id;
    // this.refs.customername.value = customer.user_id.first_name+' '+customer.user_id.last_name;
    this.props.updatefbstatus(customer.user_id.user_id, this.props.fbchats);
    this.props.selectFbCustomerChat(customer.user_id.user_id, this.props.fbchats, customer.user_id.profile_pic, customer);
    this.props.deleteUnreadCountStatusWhenAgentReadForFb(usertoken, this.props.userdetails._id, customer.pageid.pageid+'$'+customer.user_id.user_id)
    //const node = ReactDOM.findDOMNode(this.refs.customername);
    //node.scrollIntoView({behavior: "smooth"});
    this.forceUpdate();

  }



  render() {
    const token = auth.getToken()

    return (
      <div className="vbox viewport">
        <AuthorizedHeader name={this.props.userdetails.firstname} user={this.props.userdetails}/>

        <div className="page-container hbox space-between">

          <SideBar isAdmin={this.props.userdetails.isAdmin}/>
          <div className="page-content-wrapper">
            <div className="vbox viewport" style={{'overflow': 'hidden'}}>
              <header style={{'border': '0px'}}>
                <h3>Facebook Chat Sessions </h3>
              </header>

              {this.props.fbsessions && this.props.fbsessions.filter((c) => c.status != "resolved").length > 0 ?
                <section className="main hbox space-between">
                  <nav className="navclassSessionList">
                    <div className="anotherflx">
                      <div className="headerchatarea" style={{'flex-basis': 50}}>
                        <div style={{marginTop: '5px'}} className="input-group">
                          <div style={{display: 'inline-block', marginRight: '10px'}}>
                            <label style={{float: 'left'}}>Sort By Date:</label>
                          </div>
                          <div style={{display: 'inline-block'}}>
                            <select ref="sortsetting" className="form-control" aria-describedby="basic-addon3"
                                    onChange={this.handleChange.bind(this)}>
                              <option value="0">Newest on Top</option>
                              <option value="1">Oldest on Top</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <article>
                        <div>
                          {this.props.fbsessions && this.props.fbchats && this.props.agents && this.props.teamdetails && this.props.fbsessionSelected.user_id && this.props.unreadcount &&
                          this.props.fbsessions.filter((c) => c.status != "resolved").map((customer, i) => (
                              this.showSession(customer) == true &&
                              <FbCustomerListItem onClickSession={this.handleSession.bind(this, customer)}
                                                  userchat={this.props.fbchats.filter((ch) => ch.senderid == customer.user_id.user_id)}
                                                  customer={customer} selectedCustomer={this.props.fbsessionSelected}
                                                  unreadcount={this.props.unreadcount.filter((c) => c._id.request_id == customer.pageid.pageid + '$' + customer.user_id.user_id)}
                                                  key={i} agents={this.props.agents} team={this.props.teamdetails}/>

                            )
                          )


                          }


                        </div>
                      </article>
                    </div>
                  </nav>
                  <article className="articleclass ">

                    {

                      this.props.fbchatSelected && this.props.fbsessions && this.props.fbsessionSelected &&  this.showSession(this.props.fbsessionSelected) == true ?
                      <ChatArea messages={this.props.fbchatSelected}
                                socket={ null } {...this.props}
                                responses={this.props.responses}
                                username={this.props.fbsessionSelected.user_id.first_name + ' ' + this.props.fbsessionSelected.user_id.last_name}
                                userprofilepic={this.props.profile_pic}
                                senderid={this.props.fbsessionSelected.user_id.user_id}
                                userdetails={this.props.userdetails}
                                ref = "chatwindow"
                                list_of_agents={this.get_list_of_agents_in_team(this.props.fbsessionSelected)}
                                />
                     :
                     <p ref="no_session"> No sessions to display</p>

                    }


                  </article>
                </section>
                :
                <p> There are no active facebook chat sessions</p>
              }
            </div>


            {/*
             </div>
             </div>
             </div>
             */}
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
    customerchatold: (state.dashboard.customerchatold),
    chatlist: (state.dashboard.chatlist),
    channels: (state.dashboard.channels),
    customers: (state.dashboard.customers),
    customerchat_selected: (state.dashboard.customerchat_selected),
    new_message_arrived_rid: (state.dashboard.new_message_arrived_rid),
    userchats: (state.dashboard.userchats),
    responses: (state.dashboard.responses),
    onlineAgents: (state.dashboard.onlineAgents),
    yoursocketid: (state.dashboard.yoursocketid),
    mobileuserchat: (state.dashboard.mobileuserchat),
    serverresponse: (state.dashboard.serverresponse),
    groupagents: (state.dashboard.groupagents),
    groupdetails: (state.dashboard.groupdetails),
    profile_pic: (state.dashboard.profile_pic),
    fbcustomers: state.dashboard.fbcustomers,
    fbchats: state.dashboard.fbchats,
    fbchatSelected: state.dashboard.fbchatSelected,
    fbsessionSelected: state.dashboard.fbsessionSelected,
    fbsessions: state.dashboard.fbsessions,
    teamagents: (state.dashboard.teamagents),
    componentVisible: state.dashboard.componentVisible,
    sessionsortorder: state.dashboard.sessionsortorder,
    fbteams:(state.dashboard.fbteams),
    unreadcount:(state.dashboard.unreadcount),

  };
}

export default connect(mapStateToProps, {
  getfbCustomers,
  sortSessionsList,
  appendlastmessage,
  updatefbsessionlist,
  getTeamAgents,
  getteams,
  getfbSessions,
  add_socket_fb_message,
  updateCustomerList,
  getfbChats,
  updatefbstatus,
  getresponses,
  selectFbCustomerChat,
  getmetaurl,
  getfbTeams,
  getunreadsessionscount,
  deleteUnreadCountStatusWhenAgentReadForFb,
},null,{
  pure: false
})(FbChat);
