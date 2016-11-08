import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getGroupRequest,getGroupAgents}  from '../../redux/actions/actions'
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';

class GroupDetailView extends Component {

  constructor(props, context) {
      //call action to get user teams 
    const usertoken = auth.getToken();
     console.log('constructor is called');
    if(usertoken != null)
     {
       
        console.log(usertoken);
        console.log(props.params.id);
        props.getGroupAgents(usertoken);
        props.getGroupRequest(props.params.id,usertoken);
       
    
      }
      
        super(props, context);
  
  
    
  

  }

  
  render() {
    //alert(this.props.team)
   
     return (
      <div>
       <div className="page-container">
         <SideBar isAdmin ={this.props.userdetails.isAdmin}/> 
          <div className="page-content-wrapper">
            <div className="page-content"> 
              <h3 className ="page-title">Group Management </h3>
            <ul className="page-breadcrumb breadcrumb">
                  <li>
                    <i className="fa fa-home"/>
                    <Link to="/dashboard"> Dashboard </Link>
                    <i className="fa fa-angle-right"/> 
                  </li>                  
                  <li>
                               <Link to="/groups"> Group Management </Link>
                  </li>               
  
            </ul>
             {this.props.group &&
            <div className="portlet box grey-cascade">
              <div className="portlet-title">
                <div className="caption">
                    <i className="fa fa-group"/>
                    {this.props.group.groupname} - Group
                </div> 
              </div>    
        
           <div className="portlet-body form">
            <form className="form-horizontal form-row-seperated">
              <div className="form-body">
                <div className="form-group">
                  <label className="control-label col-md-3"> Group Name </label>
                   <div className="col-md-9">
                         <input className="form-control" type='text' disabled value = {this.props.group.groupname}/>
                   </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-md-3"> Description </label>
                   <div className="col-md-9">
                         <textarea className="form-control" type='text' disabled rows='4' value = {this.props.group.groupdescription}/>
                   </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-md-3"> Created By </label>
                   <div className="col-md-9">
                         <input className="form-control" type='text' disabled  value = {this.props.group.createdby.firstname + ' '+this.props.group.createdby.lastname}/>
                   </div>
                </div>
                 <div className="form-group">
                  <label className="control-label col-md-3"> Status </label>
                   <div className="col-md-9">
                         <input className="form-control" type='text' disabled value = {this.props.group.status}/>
                   </div>
                </div>

                 <div className="form-group">
                  <label className="control-label col-md-3"> Fellow Agents </label>
                   <div className="col-md-9">
                   <ul>
                   {
                    this.props.groupagents && this.props.agents && this.props.group &&
                         this.props.groupagents.filter((agent) => agent.groupid._id == this.props.group._id).map((agent, i)=> (
                          this.props.agents.filter((ag) => ag._id == agent.agentid._id).map((ag,j) =>
                          (
                          <li>{ag.firstname + ' ' + ag.lastname}</li>
                          ))

                          
                   ))                                                    
                        

                    
                   }
                   </ul>
                   </div>
                </div>

              <div className="form-actions fluid">
                <div className="col-md-3">
                  <div className="col-md-offset-9 col-md-9">
                    <Link to="/groups" className="btn green">
                      <i className="fa fa-times"/>
                       Back
                    </Link>
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


GroupDetailView.contextTypes = {
  router: React.PropTypes.object,
};



function mapStateToProps(state) {
  return {
    group: (state.dashboard.group),
    agents:(state.dashboard.agents),
    deptagents:(state.dashboard.deptagents),
    groupagents:(state.dashboard.groupagents),
    teamdetails:(state.dashboard.teamdetails),
    userdetails:(state.dashboard.userdetails),
     channels :(state.dashboard.channels),
  };
}

export default connect(mapStateToProps,{ getGroupRequest,getGroupAgents})(GroupDetailView);
