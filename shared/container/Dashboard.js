import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {getuser} from '../redux/actions/actions'
import {getAgents} from '../redux/actions/actions'
import {getDeptAgents, getnews, getcustomers, getfbSessions} from '../redux/actions/actions'
import {getusergroups, getnewsessions, getassignedsessions} from '../redux/actions/actions'
import {getsubgroups, getteams, getTeamAgents, getfbpages, getinvitedagents, getfbCustomers, getnotifications, getsessions, getresolvedsessions, getresolvedsessionsfromsocket, getnewsessionsfromsocket, getassignedsessionsfromsocket, updateAgentList, setjoinedState, getcompanysettings} from '../redux/actions/actions'
import {getresponses} from '../redux/actions/actions';
import AuthorizedHeader from '../components/Header/AuthorizedHeader';
import SideBar from '../components/Header/SideBar';
import auth from '../services/auth';
import ReactTimeout from 'react-timeout'
import {browserHistory} from 'react-router'

//const socket = io('');
var dontCall = false;
var is_routed = false;
var fetchnews = false;

class Dashboard extends Component {
  constructor(props, context) {

    const usertoken = auth.getToken();

    if (usertoken != null) {

      console.log(usertoken);
      props.getcompanysettings(usertoken, props.userdetails.uniqueid);
    }
    super(props, context);
    this.updateOnlineAgents = this.updateOnlineAgents.bind(this);
    this.create_agentsession = this.create_agentsession.bind(this);
    this.callSocket = this.callSocket.bind(this);
    this.getupdatedSessions = this.getupdatedSessions.bind(this);
    this.getabandonedSessions = this.getabandonedSessions.bind(this);
    this.getresolvedSessions = this.getresolvedSessions.bind(this);
  }

  create_agentsession() {
    // alert('joined socket');
    dontCall = true;
    this.props.setjoinedState('joined');

  }

  getupdatedSessions(data)
  {
    const usertoken = auth.getToken();
    this.props.getassignedsessionsfromsocket(data,this.props.assignedsessions);

    this.forceUpdate();
  }

  getabandonedSessions(data) {
    const usertoken = auth.getToken();
    this.props.getnewsessionsfromsocket(data, this.props.newsessions);

    this.forceUpdate();
  }

  getresolvedSessions(data)
  {
    const usertoken = auth.getToken();
    this.props.getresolvedsessionsfromsocket(data,this.props.resolvedsessions);

    this.forceUpdate();
  }

  componentWillMount() {
    const usertoken = auth.getToken();
    if (usertoken != null) {

      this.props.getuser(usertoken);
      this.props.getAgents(usertoken);
      this.props.getDeptAgents(usertoken);
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
      this.props.route.socket.emit('create or join meeting for agent', {
        room: props.userdetails.uniqueid,
        agentEmail: props.userdetails.email,
        agentName: props.userdetails.firstname + ' ' + props.userdetails.lastname,
        agentId: props.userdetails._id
      });


      //  socket.on('join',room => this.props.show_notifications(room)); // use this function to show notifications
      //this.forceUpdate();
    }


  }

  updateOnlineAgents(data) {
    console.log('updating updateOnlineAgents');
    this.props.updateAgentList(data);
    //this.forceUpdate();
  }

  componentDidMount() {
    //dontCall = false;
    //this.props.route.socket.on('updateOnlineAgentList',this.updateOnlineAgents);
    this.props.route.socket.on('agentjoined', this.create_agentsession);
    this.props.route.socket.on('returnCustomerSessionsList',this.getupdatedSessions);
    this.props.route.socket.on('customer_left', this.getabandonedSessions);
    this.props.route.socket.on('returnCustomerSessionsList',this.getresolvedSessions);


  }

  callSocket() {
    if (this.props.userdetails.uniqueid && this.props.userjoinedroom == 'notjoined') {
      this.props.setjoinedState('joining');

      // alert('calling meeting')
      this.props.route.socket.emit('create or join meeting for agent', {
        room: this.props.userdetails.uniqueid,
        agentEmail: this.props.userdetails.email,
        agentName: this.props.userdetails.firstname + ' ' + this.props.userdetails.lastname,
        agentId: this.props.userdetails._id
      });


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
    //console.log(this.props.userdetails)
    const token = auth.getToken();
    const username = this.props.userdetails.firstname;
    console.log(username)
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
                            this.props.customers ?
                              <span data-counter="counterup"
                                    data-value="{this.props.customers.length}">{this.props.customers.length}</span> :
                              <span data-counter="counterup" data-value="0">0</span>
                          }
                          <small className="font-green-sharp"></small>
                        </h3>
                        <small>Customers</small>
                      </div>
                      <div className="icon">
                        <i className="icon-pie-chart"></i>
                      </div>
                    </div>
                    <div className="progress-info">
                      {/* <div className="progress">
                       <span style={styles.w1} className="progress-bar progress-bar-success green-sharp">
                       <span className="sr-only">76% progress</span>
                       </span>
                       </div>
                       <div className="status">
                       <div className="status-title"> progress </div>
                       <div className="status-number"> 76% </div>
                       </div>*/}
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
                    <div className="progress-info">
                      {/*<div className="progress">
                       <span style={styles.w2} className="progress-bar progress-bar-success red-haze">
                       <span className="sr-only">85% change</span>
                       </span>
                       </div>
                       <div className="status">
                       <div className="status-title"> change </div>
                       <div className="status-number"> 85% </div>
                       </div>*/}
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
                    <div className="progress-info">
                      {/*<div className="progress">
                       <span style={styles.w3} className="progress-bar progress-bar-success blue-sharp">
                       <span className="sr-only">45% grow</span>
                       </span>
                       </div>
                       <div className="status">
                       <div className="status-title"> grow </div>
                       <div className="status-number"> 45% </div>
                       </div>*/}
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
                    <div className="progress-info">
                      {/*<div className="progress">
                       <span style={styles.w4} className="progress-bar progress-bar-success purple-soft">
                       <span className="sr-only">56% change</span>
                       </span>
                       </div>
                       <div className="status">
                       <div className="status-title"> change </div>
                       <div className="status-number"> 57% </div>
                       </div>*/}
                    </div>
                  </div>
                </div>
              </div>

              {/* <div class="row">
               <div class="col-lg-6 col-xs-12 col-sm-12">
               <div class="portlet light ">
               <div class="portlet-title tabbable-line">
               <div class="caption">
               <i class="icon-globe font-dark hide"></i>
               <span class="caption-subject font-dark bold uppercase">Feeds</span>
               </div>
               <ul class="nav nav-tabs">
               <li class="active">
               <a href="#tab_1_1" class="active" data-toggle="tab"> System </a>
               </li>
               <li>
               <a href="#tab_1_2" data-toggle="tab"> Activities </a>
               </li>
               </ul>
               </div>
               <div class="portlet-body">
               <div class="tab-content">
               <div class="tab-pane active" id="tab_1_1">
               <div class="slimScrollDiv"
               style={{position: relative, overflow: hidden, width: auto, height: 339,}}>
               <div class="scroller" style={{height: 339, overflow: hidden, width: auto,}}
               data-always-visible="1" data-rail-visible="0" data-initialized="1">
               <ul class="feeds">
               <li>
               <div class="col1">
               <div class="cont">
               <div class="cont-col1">
               <div class="label label-sm label-success">
               <i class="fa fa-bell-o"></i>
               </div>
               </div>
               <div class="cont-col2">
               <div class="desc"> You have 4 pending tasks.
               <span class="label label-sm label-info"> Take action
               <i class="fa fa-share"></i>
               </span>
               </div>
               </div>
               </div>
               </div>
               <div class="col2">
               <div class="date"> Just now</div>
               </div>
               </li>
               <li>
               <a href="javascript:;">
               <div class="col1">
               <div class="cont">
               <div class="cont-col1">
               <div class="label label-sm label-success">
               <i class="fa fa-bell-o"></i>
               </div>
               </div>
               <div class="cont-col2">
               <div class="desc"> New version v1.4 just lunched!</div>
               </div>
               </div>
               </div>
               <div class="col2">
               <div class="date"> 20 mins</div>
               </div>
               </a>
               </li>
               <li>
               <div class="col1">
               <div class="cont">
               <div class="cont-col1">
               <div class="label label-sm label-danger">
               <i class="fa fa-bolt"></i>
               </div>
               </div>
               <div class="cont-col2">
               <div class="desc"> Database server #12 overloaded. Please fix the issue.</div>
               </div>
               </div>
               </div>
               <div class="col2">
               <div class="date"> 24 mins</div>
               </div>
               </li>
               <li>
               <div class="col1">
               <div class="cont">
               <div class="cont-col1">
               <div class="label label-sm label-info">
               <i class="fa fa-bullhorn"></i>
               </div>
               </div>
               <div class="cont-col2">
               <div class="desc"> New order received. Please take care of it.</div>
               </div>
               </div>
               </div>
               <div class="col2">
               <div class="date"> 30 mins</div>
               </div>
               </li>
               <li>
               <div class="col1">
               <div class="cont">
               <div class="cont-col1">
               <div class="label label-sm label-success">
               <i class="fa fa-bullhorn"></i>
               </div>
               </div>
               <div class="cont-col2">
               <div class="desc"> New order received. Please take care of it.</div>
               </div>
               </div>
               </div>
               <div class="col2">
               <div class="date"> 40 mins</div>
               </div>
               </li>
               <li>
               <div class="col1">
               <div class="cont">
               <div class="cont-col1">
               <div class="label label-sm label-warning">
               <i class="fa fa-plus"></i>
               </div>
               </div>
               <div class="cont-col2">
               <div class="desc"> New user registered.</div>
               </div>
               </div>
               </div>
               <div class="col2">
               <div class="date"> 1.5 hours</div>
               </div>
               </li>
               <li>
               <div class="col1">
               <div class="cont">
               <div class="cont-col1">
               <div class="label label-sm label-success">
               <i class="fa fa-bell-o"></i>
               </div>
               </div>
               <div class="cont-col2">
               <div class="desc"> Web server hardware needs to be upgraded.
               <span class="label label-sm label-default "> Overdue </span>
               </div>
               </div>
               </div>
               </div>
               <div class="col2">
               <div class="date"> 2 hours</div>
               </div>
               </li>
               <li>
               <div class="col1">
               <div class="cont">
               <div class="cont-col1">
               <div class="label label-sm label-default">
               <i class="fa fa-bullhorn"></i>
               </div>
               </div>
               <div class="cont-col2">
               <div class="desc"> New order received. Please take care of it.</div>
               </div>
               </div>
               </div>
               <div class="col2">
               <div class="date"> 3 hours</div>
               </div>
               </li>
               <li>
               <div class="col1">
               <div class="cont">
               <div class="cont-col1">
               <div class="label label-sm label-warning">
               <i class="fa fa-bullhorn"></i>
               </div>
               </div>
               <div class="cont-col2">
               <div class="desc"> New order received. Please take care of it.</div>
               </div>
               </div>
               </div>
               <div class="col2">
               <div class="date"> 5 hours</div>
               </div>
               </li>
               <li>
               <div class="col1">
               <div class="cont">
               <div class="cont-col1">
               <div class="label label-sm label-info">
               <i class="fa fa-bullhorn"></i>
               </div>
               </div>
               <div class="cont-col2">
               <div class="desc"> New order received. Please take care of it.</div>
               </div>
               </div>
               </div>
               <div class="col2">
               <div class="date"> 18 hours</div>
               </div>
               </li>
               <li>
               <div class="col1">
               <div class="cont">
               <div class="cont-col1">
               <div class="label label-sm label-default">
               <i class="fa fa-bullhorn"></i>
               </div>
               </div>
               <div class="cont-col2">
               <div class="desc"> New order received. Please take care of it.</div>
               </div>
               </div>
               </div>
               <div class="col2">
               <div class="date"> 21 hours</div>
               </div>
               </li>
               <li>
               <div class="col1">
               <div class="cont">
               <div class="cont-col1">
               <div class="label label-sm label-info">
               <i class="fa fa-bullhorn"></i>
               </div>
               </div>
               <div class="cont-col2">
               <div class="desc"> New order received. Please take care of it.</div>
               </div>
               </div>
               </div>
               <div class="col2">
               <div class="date"> 22 hours</div>
               </div>
               </li>
               <li>
               <div class="col1">
               <div class="cont">
               <div class="cont-col1">
               <div class="label label-sm label-default">
               <i class="fa fa-bullhorn"></i>
               </div>
               </div>
               <div class="cont-col2">
               <div class="desc"> New order received. Please take care of it.</div>
               </div>
               </div>
               </div>
               <div class="col2">
               <div class="date"> 21 hours</div>
               </div>
               </li>
               <li>
               <div class="col1">
               <div class="cont">
               <div class="cont-col1">
               <div class="label label-sm label-info">
               <i class="fa fa-bullhorn"></i>
               </div>
               </div>
               <div class="cont-col2">
               <div class="desc"> New order received. Please take care of it.</div>
               </div>
               </div>
               </div>
               <div class="col2">
               <div class="date"> 22 hours</div>
               </div>
               </li>
               <li>
               <div class="col1">
               <div class="cont">
               <div class="cont-col1">
               <div class="label label-sm label-default">
               <i class="fa fa-bullhorn"></i>
               </div>
               </div>
               <div class="cont-col2">
               <div class="desc"> New order received. Please take care of it.</div>
               </div>
               </div>
               </div>
               <div class="col2">
               <div class="date"> 21 hours</div>
               </div>
               </li>
               <li>
               <div class="col1">
               <div class="cont">
               <div class="cont-col1">
               <div class="label label-sm label-info">
               <i class="fa fa-bullhorn"></i>
               </div>
               </div>
               <div class="cont-col2">
               <div class="desc"> New order received. Please take care of it.</div>
               </div>
               </div>
               </div>
               <div class="col2">
               <div class="date"> 22 hours</div>
               </div>
               </li>
               <li>
               <div class="col1">
               <div class="cont">
               <div class="cont-col1">
               <div class="label label-sm label-default">
               <i class="fa fa-bullhorn"></i>
               </div>
               </div>
               <div class="cont-col2">
               <div class="desc"> New order received. Please take care of it.</div>
               </div>
               </div>
               </div>
               <div class="col2">
               <div class="date"> 21 hours</div>
               </div>
               </li>
               <li>
               <div class="col1">
               <div class="cont">
               <div class="cont-col1">
               <div class="label label-sm label-info">
               <i class="fa fa-bullhorn"></i>
               </div>
               </div>
               <div class="cont-col2">
               <div class="desc"> New order received. Please take care of it.</div>
               </div>
               </div>
               </div>
               <div class="col2">
               <div class="date"> 22 hours</div>
               </div>
               </li>
               </ul>
               </div>
               <div class="slimScrollBar"
               style="background: rgb(187, 187, 187); width: 7px; position: absolute; top: 0px; opacity: 0.4; display: block; border-radius: 7px; z-index: 99; right: 1px; height: 173.859px;"></div>
               <div class="slimScrollRail"
               style="width: 7px; height: 100%; position: absolute; top: 0px; display: none; border-radius: 7px; background: rgb(234, 234, 234); opacity: 0.2; z-index: 90; right: 1px;"></div>
               </div>
               </div>
               <div class="tab-pane" id="tab_1_2">
               <div class="slimScrollDiv"
               style="position: relative; overflow: hidden; width: auto; height: 290px;">
               <div class="scroller" style="height: 290px; overflow: hidden; width: auto;"
               data-always-visible="1" data-rail-visible1="1" data-initialized="1">
               <ul class="feeds">
               <li>
               <a href="javascript:;">
               <div class="col1">
               <div class="cont">
               <div class="cont-col1">
               <div class="label label-sm label-success">
               <i class="fa fa-bell-o"></i>
               </div>
               </div>
               <div class="cont-col2">
               <div class="desc"> New user registered</div>
               </div>
               </div>
               </div>
               <div class="col2">
               <div class="date"> Just now</div>
               </div>
               </a>
               </li>
               <li>
               <a href="javascript:;">
               <div class="col1">
               <div class="cont">
               <div class="cont-col1">
               <div class="label label-sm label-success">
               <i class="fa fa-bell-o"></i>
               </div>
               </div>
               <div class="cont-col2">
               <div class="desc"> New order received</div>
               </div>
               </div>
               </div>
               <div class="col2">
               <div class="date"> 10 mins</div>
               </div>
               </a>
               </li>
               <li>
               <div class="col1">
               <div class="cont">
               <div class="cont-col1">
               <div class="label label-sm label-danger">
               <i class="fa fa-bolt"></i>
               </div>
               </div>
               <div class="cont-col2">
               <div class="desc"> Order #24DOP4 has been rejected.
               <span class="label label-sm label-danger "> Take action
               <i class="fa fa-share"></i>
               </span>
               </div>
               </div>
               </div>
               </div>
               <div class="col2">
               <div class="date"> 24 mins</div>
               </div>
               </li>
               <li>
               <a href="javascript:;">
               <div class="col1">
               <div class="cont">
               <div class="cont-col1">
               <div class="label label-sm label-success">
               <i class="fa fa-bell-o"></i>
               </div>
               </div>
               <div class="cont-col2">
               <div class="desc"> New user registered</div>
               </div>
               </div>
               </div>
               <div class="col2">
               <div class="date"> Just now</div>
               </div>
               </a>
               </li>
               <li>
               <a href="javascript:;">
               <div class="col1">
               <div class="cont">
               <div class="cont-col1">
               <div class="label label-sm label-success">
               <i class="fa fa-bell-o"></i>
               </div>
               </div>
               <div class="cont-col2">
               <div class="desc"> New user registered</div>
               </div>
               </div>
               </div>
               <div class="col2">
               <div class="date"> Just now</div>
               </div>
               </a>
               </li>
               <li>
               <a href="javascript:;">
               <div class="col1">
               <div class="cont">
               <div class="cont-col1">
               <div class="label label-sm label-success">
               <i class="fa fa-bell-o"></i>
               </div>
               </div>
               <div class="cont-col2">
               <div class="desc"> New user registered</div>
               </div>
               </div>
               </div>
               <div class="col2">
               <div class="date"> Just now</div>
               </div>
               </a>
               </li>
               <li>
               <a href="javascript:;">
               <div class="col1">
               <div class="cont">
               <div class="cont-col1">
               <div class="label label-sm label-success">
               <i class="fa fa-bell-o"></i>
               </div>
               </div>
               <div class="cont-col2">
               <div class="desc"> New user registered</div>
               </div>
               </div>
               </div>
               <div class="col2">
               <div class="date"> Just now</div>
               </div>
               </a>
               </li>
               <li>
               <a href="javascript:;">
               <div class="col1">
               <div class="cont">
               <div class="cont-col1">
               <div class="label label-sm label-success">
               <i class="fa fa-bell-o"></i>
               </div>
               </div>
               <div class="cont-col2">
               <div class="desc"> New user registered</div>
               </div>
               </div>
               </div>
               <div class="col2">
               <div class="date"> Just now</div>
               </div>
               </a>
               </li>
               <li>
               <a href="javascript:;">
               <div class="col1">
               <div class="cont">
               <div class="cont-col1">
               <div class="label label-sm label-success">
               <i class="fa fa-bell-o"></i>
               </div>
               </div>
               <div class="cont-col2">
               <div class="desc"> New user registered</div>
               </div>
               </div>
               </div>
               <div class="col2">
               <div class="date"> Just now</div>
               </div>
               </a>
               </li>
               <li>
               <a href="javascript:;">
               <div class="col1">
               <div class="cont">
               <div class="cont-col1">
               <div class="label label-sm label-success">
               <i class="fa fa-bell-o"></i>
               </div>
               </div>
               <div class="cont-col2">
               <div class="desc"> New user registered</div>
               </div>
               </div>
               </div>
               <div class="col2">
               <div class="date"> Just now</div>
               </div>
               </a>
               </li>
               </ul>
               </div>
               <div class="slimScrollBar"
               style="background: rgb(187, 187, 187); width: 7px; position: absolute; top: 0px; opacity: 0.4; display: block; border-radius: 7px; z-index: 99; right: 1px;"></div>
               <div class="slimScrollRail"
               style="width: 7px; height: 100%; position: absolute; top: 0px; display: none; border-radius: 7px; background: rgb(234, 234, 234); opacity: 0.2; z-index: 90; right: 1px;"></div>
               </div>
               </div>
               </div>
               </div>
               </div>
               </div>
               </div>*/}


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
  console.log(state);
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
    notifications:(state.dashboard.notifications),
    fbcustomers: (state.dashboard.fbcustomers),
    invitedagents: (state.dashboard.invitedagents),
    fbpages: (state.dashboard.fbpages),
    teamagents: (state.dashboard.teamagents),
    teamdetails: (state.dashboard.teamdetails),
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
})(ReactTimeout(Dashboard));
