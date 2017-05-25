import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getNotificationRequest}  from '../../redux/actions/actions'
import { editNotification}  from '../../redux/actions/actions'

import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';

class EditNotification extends Component {

  constructor(props, context) {
      //call action to get user teams 
   
      
        super(props, context);
         this.editNotification = this.editNotification.bind(this);
  
    
  

  }

  componentWillMount(){
    const usertoken = auth.getToken();
    if(usertoken != null)
     {
       
        console.log(usertoken);
        console.log(this.props.params.id);
        this.props.getNotificationRequest(this.props.params.id,usertoken);
      }
  }

   editNotification(e) {
     e.preventDefault();
    const usertoken = auth.getToken();
    const idRef = this.refs.id;
    const title = this.refs.title;
    const desc = this.refs.desc;
    var companyid = this.props.userdetails.uniqueid;

    if (title.value && desc.value)
     {
        var notification = {'title' : title.value,'description':desc.value,'companyid' : companyid,'agent_id' : this.props.userdetails._id}
        console.log(notification);
        this.props.editNotification(notification,usertoken);
     
    }
  }

  render() {
     var ag = []
     {
         this.props.notification &&
                        this.props.notification.map((ch, i) => (
                           ag.push(ch)                            
                        ))

      }
   
     return (

      <div>
      <div className="page-container hbox space-between">
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
              {this.props.notification &&
           <div className="portlet box grey-cascade">
              <div className="portlet-title">
                <div className="caption">
                    <i className="fa fa-envelope"/>
                   Notifications
                </div> 
              </div>   
        
           <div className="portlet-body form">
            <form className="form-horizontal form-row-seperated">
              <div className="form-body">
                <div className="form-group">
                  <label className="control-label col-md-3"> Title </label>
                   <div className="col-md-9">
                         <input className="form-control" type='hidden'   value = {ag[0]._id} ref = "id"/>
                        
                         <input className="form-control" type='text' ref="title" defaultValue = {ag[0].title}/>
                   </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-md-3"> Description </label>
                   <div className="col-md-9">
                         <textarea className="form-control" type='text'  rows='4' defaultValue = {ag[0].description} ref="desc"/>
                   </div>
                </div>


              <div className="form-actions fluid">
                <div className="col-md-3">
                  <div className="col-md-offset-9 col-md-9">
                    <Link to="/notifications" className="btn green">
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


EditNotification.contextTypes = {
  router: React.PropTypes.object,
};



function mapStateToProps(state) {
  return {
    notification: (state.dashboard.notification),
    agents:(state.dashboard.agents),
    deptagents:(state.dashboard.deptagents),
    teamdetails:(state.dashboard.teamdetails),
    userdetails:(state.dashboard.userdetails),
    channels :(state.dashboard.channels),
    notifications:(state.dashboard.notifications),
    };
}

export default connect(mapStateToProps,{ getNotificationRequest,editNotification})(EditNotification);
