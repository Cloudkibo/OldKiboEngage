import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import TeamListItem from './TeamListItem';
import {getteams} from '../../redux/actions/actions'
import {deleteteam,jointeam,getTeamAgents} from '../../redux/actions/actions'

import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router'
const PureRenderMixin = require('react-addons-pure-render-mixin');
import Immutable from 'immutable';
var NotificationSystem = require('react-notification-system');

class Teams extends Component {

 constructor(props, context) {
      //call action to get user teams
    if(props.userdetails.accountVerified == "No"){
    browserHistory.push('/notverified');
   }
    const usertoken = auth.getToken();
    console.log('constructor is called');
    if(usertoken != null)
    {

        console.log(usertoken);
        props.getteams(usertoken);
        props.getTeamAgents(usertoken);

      }
    super(props, context);

     this.state = {
      data: Immutable.List(),
      filteredData: Immutable.List(),
    };
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);



  }

  componentWillReceiveProps(props){
    if(props.teamdetails){
       this.setState({
      data: Immutable.fromJS(props.teamdetails).toList(),
      filteredData: Immutable.fromJS(props.teamdetails).toList()
    });
    }

  if(props.errorMessage && props.errorMessage != ''){
     this.refs.notificationSystem.addNotification({
      message: props.errorMessage,
      level: 'success'
    });

   }
  }

  filterData(event) {
    event.preventDefault();
    const regex = new RegExp(event.target.value, 'i');
    const filtered = this.state.data.filter(function(datum) {
      return (datum.get('groupname').search(regex) > -1);
    });

    this.setState({
      filteredData: filtered,
    });
  }

  render() {
    const token = auth.getToken()
    console.log(token)
    const { filteredData } = this.state;
   /* if(this.props.errorMessage){
      this.props.getteams(token);
      this.props.getTeamAgents(token);
    }*/
    return (
      <div className="vbox viewport">
       <NotificationSystem ref="notificationSystem" />

       <AuthorizedHeader name = {this.props.userdetails.firstname} user={this.props.userdetails}/>

       <div className="page-container hbox space-between">
         <SideBar isAdmin ={this.props.userdetails.isAdmin}/>
          <div className="page-content-wrapper">
            <div className="page-content">
              <h3 className ="page-title">Teams Management </h3>
            <ul className="page-breadcrumb breadcrumb">
                  <li>
                    <i className="fa fa-home"/>
                    <Link to="/dashboard"> Dashboard </Link>
                    <i className="fa fa-angle-right"/>
                  </li>
                  <li>
                               <Link to="/teams">Teams Management</Link>
                  </li>

            </ul>
            <div className="portlet box grey-cascade">
              <div className="portlet-title">
                <div className="caption">
                    <i className="fa fa-teams"/>
                   Teams
                </div>
              </div>

           <div className="portlet-body">
             <div className="table-toolbar">
                 {this.props.userdetails.isAgent != "Yes" &&
                 <div className="btn-team">

                    <Link id="sample_editable_1_new" className="btn green" to='/createteam'> Create Team
                    <i className="fa fa-plus"/>
                    </Link>




                 </div>
               }
              </div>
              { this.props.teamdetails && filteredData ?
                <div>
                      <input
                              type="text"
                              className="form-control"
                              onChange={ this.filterData.bind(this) }
                              placeholder="Search" />


                   <table id ="sample_3" className="table table-striped table-bordered table-hover dataTable">
                   <thead>
                    <tr>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Name </th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Description</th>
                     <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Created By</th>

                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Created On</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Status </th>

                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' > Options</th>

                    </tr>
                    </thead>

                    <tbody>
                       {
                        this.props.teamagents && filteredData && filteredData.map((team, i) => (

                          <TeamListItem team={team} key={team.get('_id')}  teamagents = {this.props.teamagents} onDelete={() => this.props.deleteteam(team,team.get('_id'),token)} userdetails ={this.props.userdetails} onJoin={() => this.props.jointeam(team,this.props.userdetails._id,token)} />

                        ))
                      }
                     </tbody>
                    </table>
                    </div> :
                    <p> Currently, there is no team to show. </p>
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

Teams.propTypes = {

  errorMessage: PropTypes.string,
}
function mapStateToProps(state) {
  console.log("mapStateToProps is called");
  return {
          channels:(state.dashboard.channels),
          userdetails:(state.dashboard.userdetails),
          groupdetails :(state.dashboard.groupdetails),
          errorMessage:(state.dashboard.errorMessage),
          agents:(state.dashboard.agents),
          teamagents : (state.dashboard.teamagents),
          teamdetails :(state.dashboard.teamdetails),

          deptagents:(state.dashboard.deptagents),

           };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({getteams:getteams,deleteteam:deleteteam,getTeamAgents:getTeamAgents,jointeam:jointeam}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(Teams);
