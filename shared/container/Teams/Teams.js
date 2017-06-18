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
import ReactPaginate from 'react-paginate';
var NotificationSystem = require('react-notification-system');

class Teams extends Component {

 constructor(props, context) {
      //call action to get user teams
    if(props.userdetails.accountVerified == "No"){
    browserHistory.push('/notverified');
   }
    const usertoken = auth.getToken();
    //console.log('constructor is called');
    if(usertoken != null)
    {

        //console.log(usertoken);
        props.getteams(usertoken);
        props.getTeamAgents(usertoken);

      }
    super(props, context);

     this.state = {
      data: props.teamdetails,
      filteredData: props.teamdetails,
      teamsData: [],
      totalLength: 0,
      selectedPage: 0,
    };
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.displayData = this.displayData.bind(this);
    this.deleteTeam = this.deleteTeam.bind(this);

  }

  /*componentWillReceiveProps(props){
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
 }*/

  filterData(event) {
    event.preventDefault();
    var filtered= [];
    console.log(this.state.data);
    for(var i=0; i<this.state.data.length; i++){
        if(this.state.data[i].groupname.toLowerCase().includes(event.target.value)){
          filtered.push(this.state.data[i]);
        }
    }

    this.setState({
      filteredData: filtered,
    },
    () => {
      this.displayData(0);
      this.setState({ totalLength: this.state.filteredData.length });
      console.log(this.state.filteredData);
    }

    );
  }

  displayData(n){
    let offset = n*6;
    console.log("Offset: " + offset);
    let sessionData = [];
    let limit;
    let index = 0;
    if ((offset + 6) > this.props.teamdetails.length){
      limit = this.props.teamdetails.length;
    }
    else {
      limit = offset + 6;
    }
    for (var i=offset; i<limit; i++){
      sessionData[index] = this.props.teamdetails[i];
      index++;
    }
    this.setState({
      teamsData: sessionData,
    });
    }

  handlePageClick(data){
    this.setState({selectedPage: data.selected});
    this.displayData(data.selected);
  }

  deleteTeam(team, id, token){
    this.props.deleteteam(team, id, token);
    let index;
    for(var i=0; i<this.state.teamsData.length; i++){
      if(this.state.teamsData[i]._id === id){
        index = i;
      }
    }
    this.state.teamsData.splice(index,1);
    this.forceUpdate();
  }

  componentDidMount(){
    this.displayData(0);
    this.setState({ totalLength: this.props.teamdetails.length });
  }

  componentDidUpdate(prevProps){
    if(prevProps.teamdetails.length == this.props.teamdetails.length -1){
      console.log('componentDidUpdate');
      this.displayData(this.state.selectedPage);
      this.setState({ totalLength: this.props.teamdetails.length });
    }
  }

  render() {
    console.log(this.props.teamdetails);
    console.log(this.state.teamsData);
    const token = auth.getToken()
    //console.log(token)
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
            <ul className="uk-breadcrumb">
                  <li>
                    <i className="fa fa-home"/>
                    <Link to="/dashboard"> Dashboard </Link>
                    <i className="fa fa-angle-right"/>
                  </li>
                  <li>
                               <Link to="/teams">Teams Management</Link>
                  </li>

            </ul>
            <div className="uk-card uk-card-default uk-card-body">
              <h3 className="uk-card-title">Teams</h3>


           <div >
             <div className="table-toolbar">
                 {this.props.userdetails.isAgent != "Yes" &&
                 <div className="btn-team">

                    <Link id="sample_editable_1_new" className="btn green" to='/createteam'> Create Team
                    <i className="fa fa-plus"/>
                    </Link>




                 </div>
               }
              </div>
              { this.props.teamdetails && filteredData && this.props.teamdetails.length > 0 ?
                <div>
                      <input
                              type="text"
                              className="form-control"
                              onChange={ this.filterData.bind(this) }
                              placeholder="Search" />

                  <div className="table-responsive">
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
                        this.props.teamagents && filteredData && this.state.teamsData.map((team, i) => (

                          <TeamListItem team={team} key={team._id}  teamagents = {this.props.teamagents} onDelete={() => this.deleteTeam(team,team._id,token)} userdetails ={this.props.userdetails} onJoin={() => this.props.jointeam(team,this.props.userdetails._id,token)} />

                        ))
                      }
                     </tbody>
                    </table>
                    </div>
                    <ReactPaginate previousLabel={"previous"}
                                   nextLabel={"next"}
                                   breakLabel={<a href="">...</a>}
                                   breakClassName={"break-me"}
                                   pageCount={Math.ceil(this.state.totalLength/6)}
                                   marginPagesDisplayed={1}
                                   pageRangeDisplayed={6}
                                   onPageChange={this.handlePageClick}
                                   containerClassName={"pagination"}
                                   subContainerClassName={"pages pagination"}
                                   activeClassName={"active"} />
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
  //console.log("mapStateToProps is called");
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
