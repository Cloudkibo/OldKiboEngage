import GroupListItem from './GroupListItem';
import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getGroupRequest,getDeptAgents}  from '../../redux/actions/actions'
import { editGroup,getcustomers}  from '../../redux/actions/actions'

import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import GroupCreateView from './GroupCreateView';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';

class GroupEditView extends Component {

  constructor(props, context) {
      //call action to get user groups
    const usertoken = auth.getToken();
     //console.log('constructor is called');
    if(usertoken != null)
     {

        //console.log(usertoken);
        //console.log(props.params.id);
      //  props.getcustomers(usertoken);
      //  props.getDeptAgents(usertoken);
        props.getGroupRequest(props.params.id,usertoken);
      }


        super(props, context);
        this.editGroupDetail = this.editGroupDetail.bind(this);


  }
  componentWillReceiveProps(nextprops){
    if((this.props.group && nextprops.group && nextprops.group._id != this.props.group._id)){
      this.refs.name.value = nextprops.group.deptname;
      this.refs.desc.value = nextprops.group.deptdescription;
    }
  }


  editGroupDetail(e) {
     e.preventDefault();
        const usertoken = auth.getToken();
        const nameRef = this.refs.name;
        const descRef = this.refs.desc;
        const idRef = this.refs.id;

    if (nameRef.value && descRef.value && this.props.customers ) {
      //alert(nameRef.value);
      var mobilecustomers = this.props.customers.filter((c) => c.isMobileClient == "true")
      this.props.editGroup({name :nameRef.value,desc:descRef.value,id:this.props.group._id,token:usertoken,teamagents: this.props.newteams},mobilecustomers);

    }
  }

  appendTeam(id,e){
   // alert(id);
    var flag = 0;
    for(var j = 0;j<this.props.newteams.length;j++)
    {
      if(this.props.newteams[j]._id == id)
      {
          flag = 1;
          break;
      }
    }
    if(flag == 0)
    {
        this.props.newteams.push({"_id" :id});
    }
    else{
      alert('Team Already added in the group');
    }
     e.preventDefault();
     this.forceUpdate();
  }

   removeTeam(id,e){
    //alert(id);

    for(var j = 0;j<this.props.newteams.length;j++)
    {
      if(this.props.newteams[j]._id == id)
      {
          this.props.newteams.splice(j,1);
          break;
      }
    }

  //  alert(this.props.newagents.length);
    e.preventDefault();
    this.forceUpdate();
  }

  render() {

     return (

      <div className="vbox viewport">
         <AuthorizedHeader name = {this.props.userdetails.firstname} user={this.props.userdetails}/>
         <div className="page-container hbox space-between">

         <SideBar isAdmin ={this.props.userdetails.isAdmin}/>
          <div className="page-content-wrapper">
            <div className="page-content">
              <h3 className ="page-title">Group Management  </h3>
            <ul className="uk-breadcrumb">
                  <li>
                    <i className="fa fa-home"/>
                    <Link to="/dashboard"> Dashboard </Link>
                  </li>
                  <li>
                               <Link to="/groups">Group Management </Link>
                  </li>

            </ul>
               

             {this.props.group &&
            <div className="uk-card uk-card-default uk-card-body  uk-width-1-2@m">
              <div className="uk-card-title">
                    {this.props.group.deptname} Group
              </div>

           <div className="portlet-body form">
            <form className="form-horizontal form-row-seperated">
              <div className="form-body">
                <div className="form-group">
                  <label className="control-label col-md-3"> Group Name </label>
                   <div className="col-md-9">
                         <input className="form-control" type='text'  defaultValue={this.props.group.deptname} ref = "name"/>
                         <input className="form-control" type='hidden'   defaultValue = {this.props.group._id} ref = "id"/>

                   </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-md-3"> Description </label>
                   <div className="col-md-9">
                         <textarea className="form-control" type='text' rows='4' ref = "desc" defaultValue = {this.props.group.deptdescription}/>
                   </div>
                </div>

                 <div className="form-group">
                  <label className="control-label col-md-3"> Fellow Teams </label>
                   <div className="col-md-9">
                   <div className="select2-container select2-container-multi">
   
                    {
                     this.props.newteams &&
                           this.props.newteams.map((team, i)=> (
                           this.props.teamdetails.filter((ag) => ag._id == team._id).map((ag,j) =>
                           (
                           <li key ={i}>{ag.groupname}<i style={{ cursor: 'pointer'}} onClick = {this.removeTeam.bind(this,ag._id)} className="fa fa-times-circle" /></li>
                           ))


                    ))

                    }

                   </div>
                   </div>
                </div>


               <div className="form-group">
               <label className="control-label col-md-3"> All Teams </label>
                <div className="col-md-9">
                <div className="select2-container select2-container-multi">
                <ul className="select2-choices">
                {
                 this.props.teamdetails &&
                      this.props.teamdetails.map((team, i) =>
                     (
                       <li  key ={i} className="select2-search-choice">
                         <div><i style={{ cursor: 'pointer'}} onClick = {this.appendTeam.bind(this,team._id)} className="fa fa-plus-circle" />{team.groupname} </div></li>
                     ))
               }


                </ul>
                </div>
                </div>
             </div>
             <br/>

              <div className="form-actions fluid" style={{background: 'white'}}>
              <div className="row">
                <div className="col-md-6">
                  <div className="col-md-offset-6 col-md-6">
                    <button className="btn green" onClick={this.editGroupDetail} type="submit">
                      <i className="fa fa-pencil"/>
                       Submit
                    </button>

                    </div>
               </div>
                <div className="col-md-6">
                  <div>
                    <Link to="/groups" className="btn green">
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
        }

       </div>
       </div>
      </div>
      </div>
  )
  }
}


GroupEditView.contextTypes = {
  router: React.PropTypes.object,
};



function mapStateToProps(state) {
  return {

    group: (state.dashboard.group),
    agents:(state.dashboard.agents),
    deptagents:(state.dashboard.deptagents),
    errorMessage:(state.dashboard.errorMessage),
    newagents:state.dashboard.newagents,
    channels :(state.dashboard.channels),
    customers : (state.dashboard.customers),
    userdetails:(state.dashboard.userdetails),
    teamdetails:(state.dashboard.teamdetails),
    newteams:(state.dashboard.newteams),
  };
}

export default connect(mapStateToProps,{getcustomers, getGroupRequest,getDeptAgents,editGroup})(GroupEditView);
