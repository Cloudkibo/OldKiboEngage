import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getNotificationRequest,resendNotification}  from '../../redux/actions/actions'
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';

class NotificationView extends Component {

  constructor(props, context) {
      //call action to get user teams 
   
      
        super(props, context);
        this.addNotifications = this.addNotifications.bind(this);
  
  
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

  addNotifications(e) {  
    // we will send notification via email.
    //Also mobile client will receive notifications on socket.

    e.preventDefault();
    const usertoken = auth.getToken();
    var companyid = this.props.userdetails.uniqueid;

    var customers = this.props.customers;
    var notification = this.props.notification[0]
    this.props.resendNotification({notification,usertoken,customers});
     

    

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

      <div className="vbox viewport">
         <AuthorizedHeader name = {this.props.userdetails.firstname} user={this.props.userdetails}/>
    
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
                         <input className="form-control" type='text' disabled value = {ag[0].title}/>
                   </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-md-3"> Description </label>
                   <div className="col-md-9">
                         <textarea className="form-control" type='text' disabled rows='4' value = {ag[0].description}/>
                   </div>
                </div>

            <div className="form-actions fluid">
              <div className="row">
                <div className="col-md-3">
                  <div className="col-md-offset-9 col-md-9">
                    <button className="btn green" onClick={this.addNotifications}>
                      <i className="fa fa-pencil"/>
                       Resend
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
        }

       </div>
       </div> 
      </div>
      </div> 
  )
  }
}


NotificationView.contextTypes = {
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
    customers : (state.dashboard.customers),
    };
}

export default connect(mapStateToProps,{resendNotification, getNotificationRequest})(NotificationView);
