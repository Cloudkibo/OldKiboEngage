import React, { Component, PropTypes } from 'react';
import auth from '../../services/auth';
import {createNotification}  from '../../redux/actions/actions'
import { connect } from 'react-redux';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import { Link } from 'react-router';
import { browserHistory } from 'react-router'



class AddNotification extends Component {
  constructor(props, context) {
       //call action to get user groups 
    const usertoken = auth.getToken();
    console.log('constructor is called');
    super(props, context);
    
    this.addNotifications = this.addNotifications.bind(this);
  }

 

  addNotifications() {
    const usertoken = auth.getToken();
    const title = this.refs.title;
    const desc = this.refs.desc;
    var companyid = this.props.userdetails.uniqueid;

    if (title.value && desc.value && companyid)
     {
      var notification = {'title' : title.value,'description':desc.value,'companyid' : companyid,'agent_id' : this.props.userdetails._id}
      console.log(notification);
      this.props.createNotification(notification,usertoken);
     
    }
  }
    
  render() {
    {this.props.addednotification &&

       browserHistory.push('/notifications');
     }
    return (

      <div>

       <div className="page-container">
         <SideBar/> 
          <div className="page-content-wrapper">
            <div className="page-content"> 
              <h3 className ="page-title">Notifications Management </h3>
            <ul className="page-breadcrumb breadcrumb">
                  <li>
                    <i className="fa fa-home"/>
                    <Link to="/dashboard"> Dashboard </Link>
                    <i className="fa fa-angle-right"/> 
                  </li>                  
                  <li>
                               <Link to="/notifications">Notifications Management</Link>
                  </li>               
  
            </ul>
                {this.props.errorMessage &&

                     <div className = "alert alert-danger"><span>{this.props.errorMessage}</span></div>
                      }
         
            
            <div className="portlet box grey-cascade">
              <div className="portlet-title">
                <div className="caption">
                    <i className="fa fa-envelope"/>
                   Add Notifications
                </div> 
              </div>    
        
           <div className="portlet-body form">
            <form className="form-horizontal form-row-seperated">
              <div className="form-body">
                <div className="form-group">
                  <label className="control-label col-md-3"> Title </label>
                   <div className="col-md-9">
                         <input className="form-control input-medium" type='text'  ref = "title" placeholder ="Enter title"/>
                   </div>
                </div>

                 <div className="form-group">
                  <label className="control-label col-md-3"> Description</label>
                   <div className="col-md-9">
                         <textarea className="form-control" type='text' rows='4' ref="desc" placeholder="Enter notification text"/>
                   </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-md-3"> Upload Image</label>
                   <div className="col-md-9">
                            <input className="form-control input-medium" type='file'  ref = "img"/>
                   </div>
                </div>
              <div className="form-actions fluid">
              <div className="row">
                <div className="col-md-3">
                  <div className="col-md-offset-9 col-md-9">
                    <button className="btn green" onClick={this.addNotifications}>
                      <i className="fa fa-pencil"/>
                       Submit
                    </button>

                    </div>
               </div> 
                <div className="col-md-9">
                  <div className="col-md-9">
                    <Link to="/notifications" className="btn green">
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
  console.log("mapStateToProps is called");
  
   return {
   channels:(state.dashboard.channels),
    userdetails:(state.dashboard.userdetails),
    groupdetails :(state.dashboard.groupdetails),
    errorMessage:(state.dashboard.errorMessage),
    notifications:(state.dashboard.notifications),
    agents:(state.dashboard.agents),
    deptagents:(state.dashboard.deptagents),
    addednotification :(state.dashboard.addednotification),

  };
}
export default connect(mapStateToProps,{createNotification})(AddNotification);


