import GroupListItem from './GroupListItem';
import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getGroupRequest}  from '../../redux/actions/actions'
import { editGroup}  from '../../redux/actions/actions'

import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import GroupCreateView from '../../components/GroupCreateView.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';

class GroupEditView extends Component {

  constructor(props, context) {
      //call action to get user groups 
    const usertoken = auth.getToken();
     console.log('constructor is called');
    if(usertoken != null)
     {
       
        console.log(usertoken);
        console.log(props.params.id);
        props.getGroupRequest(props.params.id,usertoken);
      }

      
        super(props, context);
        this.editGroupDetail = this.editGroupDetail.bind(this);
         this.onChange = this.onChange.bind(this);
  

  }
 onChange(event) {
    this.setState({typed: event.target.value});
  }
  editGroupDetail() {
        const usertoken = auth.getToken();
        const nameRef = this.refs.name;
        const descRef = this.refs.desc;
        const idRef = this.refs.id;
    if (nameRef.value && descRef.value) {
      this.props.editGroup({name :nameRef.value,desc:descRef.value,id:idRef.value,token:usertoken});
     
    }
  }

  render() {
   
     return (
      <div>
       <div className="page-container">
         <SideBar/> 
          <div className="page-content-wrapper">
            <div className="page-content"> 
              <h3 className ="page-title">Groups Management </h3>
            <ul className="page-breadcrumb breadcrumb">
                  <li>
                    <i className="fa fa-home"/>
                    <Link to="/dashboard"> Dashboard </Link>
                    <i className="fa fa-angle-right"/> 
                  </li>                  
                  <li>
                               <Link to="/groups"> Groups Management</Link>
                  </li>               
  
            </ul>
             {this.props.group &&
            <div className="portlet box grey-cascade">
              <div className="portlet-title">
                <div className="caption">
                    <i className="fa fa-group"/>
                    {this.props.group.deptname} Groups
                </div> 
              </div>    
        
           <div className="portlet-body form">
            <form className="form-horizontal form-row-seperated">
              <div className="form-body">
                <div className="form-group">
                  <label className="control-label col-md-3"> Group Name </label>
                   <div className="col-md-9">
                         <input className="form-control" type='text' value = {this.props.group.deptname} ref = "name"/>
                         <input className="form-control" type='hidden'  onChange={this.onChange}  value = {this.props.group._id} ref = "id"/>
            
                   </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-md-3"> Description </label>
                   <div className="col-md-9">
                         <textarea className="form-control"  onChange={this.onChange}  type='text' rows='4' ref = "desc" value = {this.props.group.deptdescription}/>
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
                    <button className="btn green" onClick={this.editGroupDetail}>
                      <i className="fa fa-check"/>
                       Submit
                    </button>
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
  console.log('mapStateToProps of GroupDetailView is called');
  console.log(state.dashboard.group);
  return {
    group: (state.dashboard.group),
    agents:(state.dashboard.agents),
    deptagents:(state.dashboard.deptagents),
  };
}

export default connect(mapStateToProps,{ getGroupRequest,editGroup})(GroupEditView);