import React, { Component, PropTypes } from 'react';
import auth from '../../services/auth';
import {createTeam}  from '../../redux/actions/actions'
import { connect } from 'react-redux';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import { Link } from 'react-router';



class CreateTeam extends Component {
  constructor(props, context) {
       //call action to get user teams
    const usertoken = auth.getToken();
    super(props, context);

    this.createTeam= this.createTeam.bind(this);
  }



  createTeam(e) {
     e.preventDefault();
    const usertoken = auth.getToken();
    const nameRef = this.refs.name;
    const descRef = this.refs.desc;
    const status = this.refs.statuslist.options[this.refs.statuslist.selectedIndex].text;
    var companyid = this.props.userdetails.uniqueid;
    var createdBy = this.props.userdetails._id;


    if (nameRef.value && descRef.value)
     {
      var team = {'groupname' : nameRef.value,'groupdescription':descRef.value,'companyid' : companyid,'status' : status,'createdby' : createdBy}
      this.props.createTeam(team,usertoken);

    }
  }

  render() {
    return (
      <div>

       <div className="page-container">
         <SideBar/>
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
                               <Link to="/teams"> Teams Management</Link>
                  </li>

            </ul>
                {this.props.errorMessage && this.props.errorMessage.status == 'danger' &&

                     <div className = "alert alert-danger"><span>{this.props.errorMessage.message}</span></div>
                }

                {this.props.errorMessage && this.props.errorMessage.status == 'success' &&

                     <div className = "alert alert-success"><span>Team created successfully</span></div>
                }


            <div className="portlet box grey-cascade">
              <div className="portlet-title">
                <div className="caption">
                    <i className="fa fa-group"/>
                   Create Team
                </div>
              </div>

           <div className="portlet-body form">
            <form className="form-horizontal form-row-seperated">
              <div className="form-body">
                <div className="form-group">
                  <label className="control-label col-md-3"> Team Name </label>
                   <div className="col-md-9">
                         <input className="form-control input-medium" type='text'  ref = "name"/>


                   </div>
                </div>

                 <div className="form-group">
                  <label className="control-label col-md-3"> Description </label>
                   <div className="col-md-9">
                         <textarea className="form-control" type='text' rows='4' ref="desc"/>
                   </div>
                </div>
                 <div className="form-group">
                  <label className="control-label col-md-3"> Status </label>
                  <div className="col-md-9">
                        <select  ref = "statuslist" >
                          <option value="public"> public  </option>
                          <option value="private"> private </option>
                        </select>
                        <br/>
                        <br/>
                        <b> Note : Making a team 'public' will allow anyone to join this team</b>
                  </div>
                </div>

              <div className="form-actions fluid">
              <div className="row">
                <div className="col-md-3">
                  <div className="col-md-offset-9 col-md-9">
                    <button className="btn green" onClick={this.createTeam}>
                      <i className="fa fa-pencil"/>
                       Submit
                    </button>

                    </div>
               </div>
                <div className="col-md-9">
                  <div className="col-md-9">
                    <Link to="/teams" className="btn green">
                      <i className="fa fa-times"/>
                       Back
                    </Link>

                    </div>
               </div>
               </div>
              </div>
              </div>

          </form>



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
};
}
export default connect(mapStateToProps,{createTeam})(CreateTeam);