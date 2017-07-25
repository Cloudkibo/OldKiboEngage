import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {getuser} from '../redux/actions/actions'
import {getAgents} from '../redux/actions/actions'
import {getDeptAgents, getnews, getcustomers, getfbSessions} from '../redux/actions/actions'
import {getusergroups, getnewsessions, getassignedsessions} from '../redux/actions/actions'
import {
  getsubgroups,
  getteams,
  getTeamAgents,
  getfbpages,
  getinvitedagents,
  getfbCustomers,
  getnotifications,
  getsessions,
  getresolvedsessions,
  getresolvedsessionsfromsocket,
  getnewsessionsfromsocket,
  getassignedsessionsfromsocket,
  updateAgentList,
  setjoinedState,
  getcompanysettings,
  getfbTeams,
  getDeptTeams
} from '../redux/actions/actions'
import {getresponses} from '../redux/actions/actions';
import AuthorizedHeader from '../components/Header/AuthorizedHeader';
import SideBar from '../components/Header/SideBar';
import auth from '../services/auth';
import ReactTimeout from 'react-timeout';
import {browserHistory} from 'react-router';
import {joinMeetingForAgent} from '../socket';
import {printlogs} from '../services/clientlogging';

import DashboardSessionListItem from './Dashboard/DashboardSessionListItem';
import FacebookSessionListItem from './Dashboard/FacebookSessionListItem';
//const socket = io('');
var is_routed = false;
var fetchnews = false;

class Dashboard extends Component {
  constructor(props, context) {

    const usertoken = auth.getToken();

    if (usertoken != null) {

      printlogs('info', usertoken);
      props.getcompanysettings(usertoken, props.userdetails.uniqueid);
    }
    super(props, context);
    this.updateOnlineAgents = this.updateOnlineAgents.bind(this);
    this.callSocket = this.callSocket.bind(this);
  }


  componentWillMount() {
    const usertoken = auth.getToken();
    if (usertoken != null) {

      this.props.getuser(usertoken);
    

    }
  }

  componentWillReceiveProps(props) {
    if (props.userdetails && props.userdetails.accountVerified == "No" && is_routed == false) {
      is_routed = true;
      browserHistory.push('/notverified');
    }

    if (props.userdetails.uniqueid && props.userjoinedroom == 'notjoined') {
      this.props.setjoinedState('joining');

      //  alert('calling room join')
      joinMeetingForAgent();
      //  socket.on('join',room => this.props.show_notifications(room)); // use this function to show notifications
      // this.forceUpdate();
    }

    if(props.userdetails && !this.props.userdetails.email){
      const usertoken = auth.getToken();
  
      this.props.getAgents(usertoken);
      this.props.getDeptTeams(usertoken);
      this.props.getusergroups(usertoken);
      this.props.getsubgroups(usertoken);
      this.props.getresponses(usertoken);
      this.props.getnewsessions(usertoken);
      this.props.getassignedsessions(usertoken);
      this.props.getcustomers(usertoken);
      this.props.getfbSessions(usertoken);
      this.props.getresolvedsessions(usertoken);
      this.props.getsessions(usertoken);
      this.props.getnotifications(usertoken);
      this.props.getfbCustomers(usertoken);
      this.props.getinvitedagents(usertoken);
      this.props.getfbpages(usertoken);
      this.props.getteams(usertoken);
      this.props.getTeamAgents(usertoken);
      this.props.getfbTeams(usertoken);
    }
  }

  updateOnlineAgents(data) {
    // //console.log('updating updateOnlineAgents');
    this.props.updateAgentList(data);
    //this.forceUpdate();
  }

  componentDidMount() {
  }

  callSocket() {
    if (this.props.userdetails.uniqueid && this.props.userjoinedroom == 'notjoined') {
      this.props.setjoinedState('joining');

      // alert('calling meeting')
      joinMeetingForAgent();


      //  socket.on('join',room => this.props.show_notifications(room)); // use this function to show notifications
      this.forceUpdate();


      // this.props.setTimeout(() => { alert('I do not leak!' + this.props.userdetails.uniqueid); }, 1000);
    }
  }

  componentWillUpdate() {
    //on component mount,join room

    // this.props.route.socket.on('updateOnlineAgentList',this.updateOnlineAgents);
    //setTimeout(this.callSocket, 3000);
    /*if(this.props.userjoinedroom == 'notjoined'){
     this.callSocket();
     }*/

  }


  render() {
    ////console.log(this.props.userdetails)
    const token = auth.getToken();
    const username = this.props.userdetails.firstname;
    ////console.log(username)
    return (
      <div className="vbox viewport">
        {
          this.props.userdetails &&

          <AuthorizedHeader className="headerclass" name={this.props.userdetails.firstname}
                            isAdmin={this.props.userdetails.isAdmin} user={this.props.userdetails}
                            roomid={this.props.userdetails.uniqueid}/>
        }

        <div className="page-container hbox space-between">
          <SideBar isAdmin={this.props.userdetails.isAdmin}/>
          <div className="page-content-wrapper">
            <div className="page-content">
              <h1>Dashboard</h1>
              {/*<p>Hi  {this.props.userdetails.firstname} ! Welcome to Dashboard</p>*/}

              <div className="row">
                <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                  <div className="dashboard-stat2 ">
                    <div className="display">
                      <div className="number">
                        <h3 className="font-green-sharp">
                          {
                            this.props.resolvedsessions ?
                              <span data-counter="counterup"
                                    data-value="{this.props.resolvedsessions.length}">{this.props.resolvedsessions.length}</span> :
                              <span data-counter="counterup" data-value="0">0</span>
                          }
                          <small className="font-green-sharp"></small>
                        </h3>
                        <small>Resolved</small>
                      </div>
                      <div className="icon">
                        <i className="icon-pie-chart"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                  <div className="dashboard-stat2 ">
                    <div className="display">
                      <div className="number">
                        <h3 className="font-red-haze">
                          {
                            this.props.assignedsessions ?
                              <span data-counter="counterup"
                                    data-value="{this.props.assignedsessions.length}">{this.props.assignedsessions.length}</span> :
                              <span data-counter="counterup" data-value="0">0</span>
                          }
                        </h3>
                        <small>Assigned</small>
                      </div>
                      <div class="icon">
                        <i class="icon-like"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                  <div className="dashboard-stat2 ">
                    <div className="display">
                      <div className="number">
                        <h3 className="font-blue-sharp">
                          {
                            this.props.newsessions ?
                              <span data-counter="counterup"
                                    data-value="{this.props.newsessions.length}">{this.props.newsessions.length}</span> :
                              <span data-counter="counterup" data-value="0">0</span>
                          }
                        </h3>
                        <small>Abandoned</small>
                      </div>
                      <div class="icon">
                        <i class="icon-basket"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                  <div className="dashboard-stat2 ">
                    <div className="display">
                      <div className="number">
                        <h3 className="font-purple-soft">
                          {
                            this.props.fbsessions ?
                              <span data-counter="counterup"
                                    data-value="{this.props.fbsessions.length}">{this.props.fbsessions.length}</span> :
                              <span data-counter="counterup" data-value="0">0</span>
                          }
                        </h3>
                        <small>Facebook Customers</small>
                      </div>
                      <div className="icon">
                        <i className="icon-user"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-6 col-xs-12 col-sm-12">
                  <DashboardSessionListItem sessions={this.props.newsessions} title="New Sessions" />
                </div>
                <div className="col-lg-6 col-xs-12 col-sm-12">
                  <DashboardSessionListItem sessions={this.props.assignedsessions} title="Assigned Sessions" />
                </div>
              </div>

              <div className="row">
                <div className="col-lg-6 col-xs-12 col-sm-12">
                  <FacebookSessionListItem sessions={this.props.fbsessions} title="Facebook Sessions" />
                </div>
                <div className="col-lg-6 col-xs-12 col-sm-12">
                  <DashboardSessionListItem sessions={this.props.resolvedsessions} title="Resolved Sessions" />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>


    )
  }
}

const styles = {
  w1: {
    width: '76%',
  },
  w2: {
    width: '85%',
  },
  w3: {
    width: '45%',
  },
  w4: {
    width: '57%',
  }
};


function mapStateToProps(state) {
  ////console.log(state);
  return {
    userdetails: (state.dashboard.userdetails),
    agents: (state.dashboard.agents),
    deptagents: (state.dashboard.deptagents),
    groupdetails: (state.dashboard.groupdetails),
    subgroups: (state.dashboard.subgroups),
    onlineAgents: (state.dashboard.onlineAgents),
    news: (state.dashboard.news),
    userjoinedroom: (state.dashboard.userjoinedroom),
    companysettings: (state.dashboard.companysettings),
    newsessions: (state.dashboard.newsessions),
    assignedsessions: (state.dashboard.assignedsessions),
    customers: (state.dashboard.customers),
    fbsessions: (state.dashboard.fbsessions),
    resolvedsessions: (state.dashboard.resolvedsessions),
    notifications: (state.dashboard.notifications),
    fbcustomers: (state.dashboard.fbcustomers),
    invitedagents: (state.dashboard.invitedagents),
    fbpages: (state.dashboard.fbpages),
    teamagents: (state.dashboard.teamagents),
    teamdetails: (state.dashboard.teamdetails),
    fbteams:(state.dashboard.fbteams),
    deptteams:(state.dashboard.deptteams),
    
  }
}

export default connect(mapStateToProps, {
  getuser,
  getnews,
  updateAgentList,
  getAgents,
  getfbSessions,
  getcustomers,
  setjoinedState,
  getresponses,
  getsubgroups,
  getDeptAgents,
  getusergroups,
  getcompanysettings,
  getnewsessions,
  getassignedsessions,
  getresolvedsessions,
  getsessions,
  getnotifications,
  getfbCustomers,
  getinvitedagents,
  getfbpages,
  getteams,
  getTeamAgents,
  getassignedsessionsfromsocket,
  getresolvedsessionsfromsocket,
  getfbTeams,
  getDeptTeams,
})(ReactTimeout(Dashboard));
