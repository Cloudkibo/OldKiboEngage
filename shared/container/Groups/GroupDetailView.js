import GroupListItem from './GroupListItem';
import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getGroupRequest,getDeptAgents}  from '../../redux/actions/actions'
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';

class GroupDetailView extends Component {

  constructor(props, context) {
      //call action to get user groups 
    const usertoken = auth.getToken();
     //console.log('constructor is called');
    if(usertoken != null)
     {
       
        //console.log(usertoken);
        //console.log(props.params.id);
         props.getDeptAgents(usertoken);
        props.getGroupRequest(props.params.id,usertoken);
       
    
      }
      
        super(props, context);
  
  
    
  

  }

  
  render() {
    //alert(this.props.group)
   
     return (

      <div className="vbox viewport">
         <AuthorizedHeader name = {this.props.userdetails.firstname} user={this.props.userdetails}/>
    
       <div className="page-container hbox space-between">

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
                    Group - {this.props.group.deptname} 
                </div> 
              </div>    
        
           <div className="portlet-body form">
            <form className="form-horizontal form-row-seperated">
              <div className="form-body">
                <div className="form-group">
                  <label className="control-label col-md-3"> Group Name </label>
                   <div className="col-md-9">
                         <input className="form-control" type='text' disabled value = {this.props.group.deptname}/>
                   </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-md-3"> Description </label>
                   <div className="col-md-9">
                         <textarea className="form-control" type='text' disabled rows='4' value = {this.props.group.deptdescription}/>
                   </div>
                </div>

                 <div className="form-group">
                  <label className="control-label col-md-3"> Fellow Agents </label>
                   <div className="col-md-9">
                   <ul>
                   {
                    this.props.deptagents &&
                         this.props.deptagents.filter((agent) => agent.deptid == this.props.group._id).map((agent, i)=> (
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
                    <Link to="/groups" className="btn green">
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


GroupDetailView.contextTypes = {
  router: React.PropTypes.object,
};



function mapStateToProps(state) {
  return {
    group: (state.dashboard.group),
    agents:(state.dashboard.agents),
    deptagents:(state.dashboard.deptagents),
    groupdetails:(state.dashboard.groupdetails),
    userdetails:(state.dashboard.userdetails),
     channels :(state.dashboard.channels),
  };
}

export default connect(mapStateToProps,{ getGroupRequest,getDeptAgents})(GroupDetailView);
