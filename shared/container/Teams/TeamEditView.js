import TeamListItem from './TeamListItem';
import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getTeamRequest,getDeptAgents}  from '../../redux/actions/actions'
import { editTeam,getcustomers}  from '../../redux/actions/actions'

import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import TeamCreateView from './TeamCreateView';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';

class TeamEditView extends Component {

  constructor(props, context) {
      //call action to get user teams
    const usertoken = auth.getToken();
     console.log('constructor is called');
    if(usertoken != null)
     {

        console.log(usertoken);
        console.log(props.params.id);
        props.getcustomers(usertoken);
        props.getDeptAgents(usertoken);
        props.getTeamRequest(props.params.id,usertoken);
      }


        super(props, context);
        this.editTeamDetail = this.editTeamDetail.bind(this);


  }



  editTeamDetail(e) {
     e.preventDefault();
        const usertoken = auth.getToken();
        const nameRef = this.refs.name;
        const descRef = this.refs.desc;
        const idRef = this.refs.id;

    if (nameRef.value && descRef.value && this.props.customers ) {
      //alert(nameRef.value);
      var mobilecustomers = this.props.customers.filter((c) => c.isMobileClient == "true")
      this.props.editTeam({name :nameRef.value,desc:descRef.value,id:idRef.value,token:usertoken,deptagents: this.props.newagents},mobilecustomers);

    }
  }

  appendAgent(id,e){
   // alert(id);
    var flag = 0;
    for(var j = 0;j<this.props.newagents.length;j++)
    {
      if(this.props.newagents[j]._id == id)
      {
          flag = 1;
          break;
      }
    }
    if(flag == 0)
    {
        this.props.newagents.push({"_id" :id});
    }
    else{
      alert('Agent Already added in the team');
    }
     e.preventDefault();
     this.forceUpdate();
  }

   removeAgent(id,e){
    //alert(id);

    for(var j = 0;j<this.props.newagents.length;j++)
    {
      if(this.props.newagents[j]._id == id)
      {
          this.props.newagents.splice(j,1);
          break;
      }
    }

  //  alert(this.props.newagents.length);
    e.preventDefault();
    this.forceUpdate();
  }

  render() {

     return (
      <div>
       <div className="page-container">
         <SideBar/>
          <div className="page-content-wrapper">
            <div className="page-content">
              <h3 className ="page-title">Team Management  </h3>
            <ul className="page-breadcrumb breadcrumb">
                  <li>
                    <i className="fa fa-home"/>
                    <Link to="/dashboard"> Dashboard </Link>
                    <i className="fa fa-angle-right"/>
                  </li>
                  <li>
                               <Link to="/teams">Team Management </Link>
                  </li>

            </ul>
                {this.props.errorMessage &&

                     <div className = "alert alert-danger"><span>{this.props.errorMessage}</span></div>
                      }

             {this.props.team &&
            <div className="portlet box grey-cascade">
              <div className="portlet-title">
                <div className="caption">
                    <i className="fa fa-group"/>
                    {this.props.team.deptname} Team
                </div>
              </div>

           <div className="portlet-body form">
            <form className="form-horizontal form-row-seperated">
              <div className="form-body">
                <div className="form-group">
                  <label className="control-label col-md-3"> Team Name </label>
                   <div className="col-md-9">
                         <input className="form-control" type='text'  defaultValue={this.props.team.deptname} ref = "name"/>
                         <input className="form-control" type='hidden'   defaultValue = {this.props.team._id} ref = "id"/>

                   </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-md-3"> Description </label>
                   <div className="col-md-9">
                         <textarea className="form-control" type='text' rows='4' ref = "desc" defaultValue = {this.props.team.deptdescription}/>
                   </div>
                </div>

                 <div className="form-group">
                  <label className="control-label col-md-3"> Fellow Agents </label>
                   <div className="col-md-9">
                   <div className="select2-container select2-container-multi">
                   <ul className="select2-choices">

                   {
                    this.props.newagents &&
                          this.props.newagents.map((agent, i)=> (
                          this.props.agents.filter((ag) => ag._id == agent._id).map((ag,j) =>
                          (
                          <li key ={i}  onClick = {this.removeAgent.bind(this,ag._id)}>{ag.firstname + ' ' + ag.lastname}</li>
                          ))


                   ))


                   }
                   </ul>
                   </div>
                   </div>
                </div>


                <div className="form-group">
                  <label className="control-label col-md-3"> All Agents </label>
                   <div className="col-md-9">
                   <div className="select2-container select2-container-multi">
                   <ul className="select2-choices">
                   {
                    this.props.agents &&
                         this.props.agents.map((agent, i) =>
                        (
                          <li  key ={i} className="select2-search-choice">
                            <div  onClick = {this.appendAgent.bind(this,agent._id)}>{agent.firstname + ' ' + agent.lastname} </div></li>
                        ))
                  }


                   </ul>
                   </div>
                   </div>
                </div>

              <div className="form-actions fluid">
              <div className="row">
                <div className="col-md-3">
                  <div className="col-md-offset-9 col-md-9">
                    <button className="btn green" onClick={this.editTeamDetail} type="submit">
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
        }

       </div>
       </div>
      </div>
      </div>
  )
  }
}


TeamEditView.contextTypes = {
  router: React.PropTypes.object,
};



function mapStateToProps(state) {
  console.log('mapStateToProps of TeamEditView is called');
  console.log(state.dashboard.team);
  console.log(state.dashboard.newagents);
  return {

    team: (state.dashboard.team),
    agents:(state.dashboard.agents),
    deptagents:(state.dashboard.deptagents),
    errorMessage:(state.dashboard.errorMessage),
    newagents:state.dashboard.newagents,
    channels :(state.dashboard.channels),
    customers : (state.dashboard.customers),
  };
}

export default connect(mapStateToProps,{getcustomers, getTeamRequest,getDeptAgents,editTeam})(TeamEditView);
