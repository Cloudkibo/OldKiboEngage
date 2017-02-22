import TeamListItem from './TeamListItem';
import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getTeamRequest,getDeptAgents}  from '../../redux/actions/actions'
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';

class TeamDetailView extends Component {

  constructor(props, context) {
      //call action to get user teams 
    const usertoken = auth.getToken();
     console.log('constructor is called');
    if(usertoken != null)
     {
       
        console.log(usertoken);
        console.log(props.params.id);
         props.getDeptAgents(usertoken);
        props.getTeamRequest(props.params.id,usertoken);
       
    
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
              <h3 className ="page-title">Team Management </h3>
            <ul className="page-breadcrumb breadcrumb">
                  <li>
                    <i className="fa fa-home"/>
                    <Link to="/dashboard"> Dashboard </Link>
                    <i className="fa fa-angle-right"/> 
                  </li>                  
                  <li>
                               <Link to="/teams"> Team Management </Link>
                  </li>               
  
            </ul>
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
                         <input className="form-control" type='text' disabled value = {this.props.team.deptname}/>
                   </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-md-3"> Description </label>
                   <div className="col-md-9">
                         <textarea className="form-control" type='text' disabled rows='4' value = {this.props.team.deptdescription}/>
                   </div>
                </div>

                 <div className="form-group">
                  <label className="control-label col-md-3"> Fellow Agents </label>
                   <div className="col-md-9">
                   <ul>
                   {
                    this.props.deptagents &&
                         this.props.deptagents.filter((agent) => agent.deptid == this.props.team._id).map((agent, i)=> (
                          this.props.agents.filter((ag) => ag._id == agent.agentid).map((ag,j) =>
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
                  {this.props.params.fromprofile?
                    <Link to="/myprofile" className="btn green">
                      <i className="fa fa-times"/>
                       Back
                    </Link>:
                    <Link to="/teams" className="btn green">
                      <i className="fa fa-times"/>
                       Back
                    </Link>
                  }
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


TeamDetailView.contextTypes = {
  router: React.PropTypes.object,
};



function mapStateToProps(state) {
  console.log('mapStateToProps of TeamDetailView is called');
  console.log(state.dashboard.team);
  return {
    team: (state.dashboard.team),
    agents:(state.dashboard.agents),
    deptagents:(state.dashboard.deptagents),
    teamdetails:(state.dashboard.teamdetails),
    userdetails:(state.dashboard.userdetails),
     channels :(state.dashboard.channels),
  };
}

export default connect(mapStateToProps,{ getTeamRequest,getDeptAgents})(TeamDetailView);
