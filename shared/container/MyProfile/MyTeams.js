import MyTeamListItem from '../Teams/MyTeamListItem';
import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {getmyuserteams} from '../../redux/actions/actions'

import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import ProfileSideBar from '../../components/SideBar/ProfileSideBar';

import auth from '../../services/auth';
import { bindActionCreators } from 'redux';

class MyTeams extends Component {

 constructor(props, context) {
      //call action to get user teams
    if(props.userdetails.accountVerified == "No"){
    browserHistory.push('/notverified');
   }
    const usertoken = auth.getToken();
    console.log('componentWillMount is called');
    if(usertoken != null)
    {

        console.log(usertoken);
        props.getmyuserteams(usertoken);
      }

        super(props, context);





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
              <div className="row">
                <div className="col-md-12">
                    <h3 className ="page-title">My Profile </h3>
                     <ul className="page-breadcrumb breadcrumb">
                      <li>
                        <i className="fa fa-home"/>
                        <Link to="/dashboard"> Dashboard </Link>

                      </li>
                      <li>
                        <Link to="/myprofile"> Profile </Link>
                      </li>

                    </ul>
                </div>
              </div>
          <div className="row profile-account">
                <ProfileSideBar iscurrent="myteams"/>
          <div className="col-md-9">
            <div className="portlet box">
            <div className="portlet body">


                { this.props.myteamdetails &&
                   <table id ="sample_3" className="table table-striped table-bordered table-hover dataTable">
                   <thead>
                    <tr>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Name </th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Description </th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Created On</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' > Options</th>
                    </tr>
                    </thead>
                    <tbody>
                      {
                        this.props.myteamdetails.map((team, i) => (

                          <MyTeamListItem team={team.deptid?team.deptid:team} key={team._id} />

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
      </div>
      </div>
  )
  }
}


function mapStateToProps(state) {

  return {
          teamdetails:(state.dashboard.teamdetails),
          userdetails:(state.dashboard.userdetails),
          errorMessage:(state.dashboard.errorMessage),
          agents:(state.dashboard.agents),
          deptagents:(state.dashboard.deptagents),
          channels :(state.dashboard.channels),
          myteamdetails:(state.dashboard.myteamdetails),
           };
}


function mapDispatchToProps(dispatch) {

  return bindActionCreators({ getmyuserteams:getmyuserteams}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(MyTeams);
