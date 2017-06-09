import React, { Component, PropTypes } from 'react';
import auth from '../../services/auth';
import {createSubgroup,getcustomers}  from '../../redux/actions/actions'
import { connect } from 'react-redux';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import { Link } from 'react-router';



class SubgroupCreate extends Component {
  constructor(props, context) {
       //call action to get user teams
    const usertoken = auth.getToken();
    //console.log('constructor is called');
    if(!props.customers){
          props.getcustomers(usertoken);
      }
    super(props, context);

    this.createSubgroup = this.createSubgroup.bind(this);
  }



  createSubgroup(e) {
     e.preventDefault();
    const usertoken = auth.getToken();
    const nameRef = this.refs.name;
    const descRef = this.refs.desc;
    const groupid = this.refs.groupid;

    if(this.props.subgroups.filter((c) => c.groupid == groupid.value).length < this.props.companysettings.maxnumberofchannels) {

    var companyid;
    var createdBy = this.props.userdetails._id;

    if (nameRef.value && descRef.value && groupid.value && this.props.customers)
     {
      var subgroup = {'msg_channel_name' : nameRef.value,'msg_channel_description':descRef.value,'companyid' : this.props.userdetails.uniqueid,'groupid' : groupid.value,'createdby' : createdBy}
      this.props.createSubgroup(subgroup,usertoken,this.props.customers.filter((c) => c.isMobileClient == "true"));

    }
  }
  else {
    alert(`Maximum number of subgroups per group has set to ${this.props.companysettings.maxnumberofchannels}. You cannot create more. If you want to create more subgroups, please go to compnay settings and update the limit.`);
  }
  }
  handleChange(e){
      const groupidRef =  this.refs.groupid;
      groupidRef.value =  e.target.value;

    }


  render() {
    return (
      <div className="vbox viewport">
       <AuthorizedHeader name = {this.props.userdetails.firstname} user={this.props.userdetails}/>

       <div className="page-container hbox space-between">
         <SideBar isAdmin ={this.props.userdetails.isAdmin}/>
          <div className="page-content-wrapper">
            <div className="page-content">
              <h3 className ="page-title">SubGroups Management </h3>
            <ul className="uk-breadcrumb">
                  <li>
                    <i className="fa fa-home"/>
                    <Link to="/dashboard"> Dashboard </Link>
                    <i className="fa fa-angle-right"/>
                  </li>
                  <li>
                               <Link to="/subgroups"> SubGroups Management</Link>
                  </li>

            </ul>
                {this.props.errorMessage &&

                     <div className = "alert alert-danger"><span>{this.props.errorMessage}</span></div>
                      }


            <div className="uk-card uk-card-body uk-card-default uk-width-1-2@m">
              <div className="uk-card-title">
                
                   Create Subgroup
                
              </div>

           <div className="portlet-body form">
            <form className="form-horizontal form-row-seperated">
              <div className="form-body">
                <div className="form-group">
                  <label className="control-label col-md-3"> Sub Group Name </label>
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
                  <label className="control-label col-md-3"> Select Group </label>
                  <div className="col-md-9">
                  {
                        <select className="uk-select"  ref = "groupid" onChange={this.handleChange.bind(this)}   >
                          {
                           this.props.groupdetails &&

                           this.props.groupdetails.map((group, i) => (

                          <option value={group._id} key={group._id}> {group.deptname}</option>

                        ))
                        }
                        </select>
                    }
                      </div>
                </div>

              <div className="form-actions fluid" style={{background: 'white'}}>
              <div className="row">
                <div className="col-md-6">
                  <div className="col-md-offset-6 col-md-6">
                    <button className="btn green" onClick={this.createSubgroup}>
                      <i className="fa fa-pencil"/>
                       Submit
                    </button>

                    </div>
               </div>
                <div className="col-md-6">
                  <div className="col-md-6">
                    <Link to="/subgroups" className="btn green">
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
  //console.log("mapStateToProps is called");
  //console.log(state.dashboard.agent);

   return {
    groupdetails:(state.dashboard.groupdetails),
    userdetails:(state.dashboard.userdetails),
    errorMessage:(state.dashboard.errorMessage),
    agents:(state.dashboard.agents),
    deptagents:(state.dashboard.deptagents),
    subgroups :(state.dashboard.subgroups),
    customers:(state.dashboard.customers),
    companysettings: (state.dashboard.companysettings),
};
}
export default connect(mapStateToProps,{createSubgroup,getcustomers})(SubgroupCreate);
