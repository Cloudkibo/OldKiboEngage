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
  selectFbCustomerChat
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

      //props.getmetaurl(url, usertoken);
      callonce = true;

    }

    super(props, context);
    //fb related
    this.getfbMessage = this.getfbMessage.bind(this);
    this.handleChange = this.handleChange.bind(this);


  }

  handleChange(e) {
    this.props.sortSessionsList(this.props.fbsessions, e.target.value);
  }

  getfbMessage(data) {
    //alert('new fbmessage')
   printlogs('log','new fb message is received');
   printlogs('log',data)
   printlogs('log',this.props.fbsessionSelected);
    if (this.props.fbsessionSelected && this.props.fbchats) {
      if (!this.props.fbsessionSelected.user_id) {
        data.seen = false;
      }
      else if (this.props.fbsessionSelected.user_id && data.senderid != this.props.fbsessionSelected.user_id.user_id) {

        data.seen = false;
      }
      else {
        data.seen = true;
      }
      this.props.add_socket_fb_message(data, this.props.fbchats, this.props.fbsessionSelected.user_id.user_id, this.props.fbsessions, this.props.sessionsortorder);

    }

    this.forceUpdate();
  }

  syncdata() {

  }


  componentDidMount() {

  }

  componentWillReceiveProps(props) {
    if (props.fbsessions && props.fbchats && props.fbsessions.length > 0) {
      // alert(props.fbcustomers.length);

      // call action to append last messages
      if (!props.fbsessions[0].lastmessage) {
        this.props.appendlastmessage(props.fbsessions, props.fbchats);
      }
      //this.refs.sessionid.value = props.fbsessions[0].user_id.user_id;
      //callonce=false;


    }

    /*if(props.fbsessions && props.fbsessions[0].lastmessage && !this.props.fbsessions[0].lastmessage){
     var choosen_session = props.fbsessions.filter((c) => c.status != "resolved")[0];
     if(choosen_session)
     {
     this.props.selectFbCustomerChat(choosen_session.user_id.user_id,props.fbchats,choosen_session.user_id.profile_pic,choosen_session);
     }
     }*/

  }

  handleSession(customer, e) {

    //  alert(customer.user_id);
    e.preventDefault();
    const usertoken = auth.getToken();
    //  this.refs.sessionid.value = customer.user_id.user_id;
    // this.refs.customername.value = customer.user_id.first_name+' '+customer.user_id.last_name;
    this.props.updatefbstatus(customer.user_id.user_id, this.props.fbchats);
    this.props.selectFbCustomerChat(customer.user_id.user_id, this.props.fbchats, customer.user_id.profile_pic, customer);
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
                          {this.props.fbsessions && this.props.fbchats && this.props.agents && this.props.teamdetails && this.props.fbsessionSelected.user_id &&
                          this.props.fbsessions.filter((c) => c.status != "resolved").map((customer, i) => (

                              <FbCustomerListItem onClickSession={this.handleSession.bind(this, customer)}
                                                  userchat={this.props.fbchats.filter((ch) => ch.senderid == customer.user_id.user_id)}
                                                  customer={customer} selectedCustomer={this.props.fbsessionSelected}
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

                      this.props.fbchatSelected && this.props.fbsessions && this.props.fbsessionSelected &&
                      <ChatArea messages={this.props.fbchatSelected}
                                socket={ null } {...this.props}
                                responses={this.props.responses}
                                username={this.props.fbsessionSelected.user_id.first_name + ' ' + this.props.fbsessionSelected.user_id.last_name}
                                userprofilepic={this.props.profile_pic}
                                senderid={this.props.fbsessionSelected.user_id.user_id}
                                userdetails={this.props.userdetails}/>


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
  getmetaurl
})(FbChat);
