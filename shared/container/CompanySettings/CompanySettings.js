import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {getcompanysettings,updatesettings} from '../../redux/actions/actions'

import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';

import auth from '../../services/auth';
import { bindActionCreators } from 'redux';

class CompanySettings extends Component {

 constructor(props, context) {
      //call action to get user groups 
    const usertoken = auth.getToken();
    console.log('componentWillMount is called');
    if(usertoken != null)
    {
       
        console.log(usertoken);
        props.getcompanysettings(usertoken,props.userdetails.uniqueid);
      }
      
        super(props, context);
        this.onSubmit = this.onSubmit.bind(this);
  
   

   
    
  }

  onSubmit(event)
    {
       const usertoken = auth.getToken();
   
      event.preventDefault();
                const fnameRef = this.refs.fname;
                const lnameRef = this.refs.lname;
                const phoneRef = this.refs.phone;
                const country = this.refs.country;
                const city = this.refs.city;
                const stateRef = this.refs.state;
               
                if (fnameRef.value && lnameRef.value && phoneRef.value) {
                  var user = {
                    'firstname': fnameRef.value,
                    'lastname': lnameRef.value,
                    'phone': phoneRef.value,
                    'city':city.value,
                    'state':stateRef.value,
                    'country':country.value,
                    
                  }
                  console.log(user);

                  this.props.updatesettings(user,usertoken);
                }
    }


   
 

  render() {
    const token = auth.getToken()
    console.log(token)
    
    return (
      <div>
       <AuthorizedHeader name = {this.props.userdetails.firstname} />
    
       <div className="page-container">

         <SideBar isAdmin ={this.props.userdetails.isAdmin}/> 
          <div className="page-content-wrapper">
           
            <div className="page-content">
              <div className="row">
                <div className="col-md-12">
                    <h3 className ="page-title">Company Settings </h3>
                     <ul className="page-breadcrumb breadcrumb">
                      <li>
                        <i className="fa fa-home"/>
                        <Link to="/dashboard"> Dashboard </Link>
                       
                      </li>                  
                      <li>
                        <Link to="/companysettings"> Company Settings </Link>
                      </li>               
      
                    </ul>
                </div>
              </div>      
         
            <div className="portlet box green-meadow">
            <div className="portlet-title">
              <div className="caption">
                <i className="fa fa-cogs"/>
                   Company settings
              </div>
            </div>       
            <div className="portlet body">
            {this.props.companysettings &&
                <form onSubmit={this.onSubmit} className ="css-form">
                                              <div className="form-group">
                                                <label className="control-label col-md-3">Max number of Groups</label>
                                                
                                                <div className="col-md-9">
                                                <div className="input-group input-small">
                                                <input type="Number"  className="form-control " ref = "maxgrp" required  defaultValue={this.props.companysettings.maxnumberofdepartment}/>
                                                </div>
                                                </div>
                                              </div>
                                              
                                              <div className="form-group">
                                                <label className="control-label col-md-3">Company domain emails</label>
                                                <div className="col-md-9">
                                                <div className="input-group input-small">
                                                <select  className="form-control"  ref = "domainemails" defaultValue={this.props.companysettings.isdomainemail}>
                                                  <option value="Yes">Yes</option>
                                                  <option value="No">No</option>
                                                </select>
                                                
                                                </div>
                                                </div>
                                              </div>


                                              <div className="form-group">
                                                <label className="control-label col-md-3">Notify by email</label>
                                                <div className="col-md-9">
                                                <div className="input-group input-small">
                                                <select  className="form-control"  ref = "notifyemails" defaultValue={this.props.companysettings.allowemailnotification}>
                                                  <option value="Yes">Yes</option>
                                                  <option value="No">No</option>
                                                </select>
                                                
                                                </div>
                                                </div>
                                              </div>

                                              <div className="form-group">
                                                <label className="control-label col-md-3">Notification Email address</label>
                                                <div className="col-md-9">
                                                <div className="input-group input-small">
                                                <input type="email"  className="form-control " ref = "email" required  placeholder='example@abc.com' defaultValue={this.props.companysettings.notificationemailaddress}/>
                                                </div>
                                                </div>
                                              </div>

                                              <div className="form-group">
                                                <label className="control-label col-md-3">SMS Phone number</label>
                                                <div className="col-md-9">
                                                <div className="input-group input-small">
                                                <input type="text"  className="form-control " maxlength='20' ref = "smsno"   defaultValue={this.props.companysettings.smsphonenumber} placeholder='+90123456789'/>
                                                </div>
                                                </div>
                                              </div>

                                              <div className="form-group">
                                                <label className="control-label col-md-3">SMS Notification</label>
                                                <div className="col-md-9">
                                                <div className="input-group input-small">
                                                <select  className="form-control"  ref = "smsnotification" defaultValue={this.props.companysettings.allowsmsnotification}>
                                                  <option value="Yes">Yes</option>
                                                  <option value="No">No</option>
                                                </select>
                                                
                                                </div>
                                                </div>
                                              </div>


                                               <div className="form-group">
                                                <label className="control-label col-md-3">Show Summary</label>
                                                <div className="col-md-9">
                                                <div className="input-group input-small">
                                                <select  className="form-control"  ref = "showsummary" defaultValue={this.props.companysettings.showsummary}>
                                                  <option value="Yes">Yes</option>
                                                  <option value="No">No</option>
                                                </select>
                                                
                                                </div>
                                                </div>
                                              </div>

                                               <div className="form-group">
                                                <label className="control-label col-md-3">Allow Chat</label>
                                                <div className="col-md-9">
                                                <div className="input-group input-small">
                                                <select  className="form-control"  ref = "allowChat" defaultValue={this.props.companysettings.allowChat}>
                                                  <option value="Yes">Yes</option>
                                                  <option value="No">No</option>
                                                </select>
                                                
                                                </div>
                                                </div>
                                              </div>


                                               <div className="form-group">
                                                <label className="control-label col-md-3">Open widget as a separate</label>
                                                <div className="col-md-9">
                                                <div className="input-group input-small">
                                                <select  className="form-control"  ref = "widgetwindowtab" defaultValue={this.props.companysettings.widgetwindowtab}>
                                                  <option value="window">Window</option>
                                                  <option value="tab">Tab</option>
                                                </select>
                                                
                                                </div>
                                                </div>
                                              </div>



                                           
                                              <div className="form-actions">
                                                      <button type="submit" className="btn green btn-send">Save</button>
                                                      <Link to='/dashboard' className="btn default"> Cancel </Link> 
                                              </div>


                                             {this.props.errorMessageProfile && this.props.errorMessageProfile.status == "danger" &&
                                                 <div className = "alert alert-danger"><span>{this.props.errorMessageProfile.message}</span></div>
                                              }

                                              {this.props.errorMessageProfile && this.props.errorMessageProfile.status == "success" &&
                                                 <div className = "alert alert-success"><span>{this.props.errorMessageProfile.message}</span></div>
                                              }


                                  </form>
                                }
             
              
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
  
  return {
          groupdetails:(state.dashboard.groupdetails),
          userdetails:(state.dashboard.userdetails),
          errorMessageProfile:(state.dashboard.errorMessageProfile),
          agents:(state.dashboard.agents),
          deptagents:(state.dashboard.deptagents),
          channels :(state.dashboard.channels),
          mygroupdetails:(state.dashboard.mygroupdetails),
          companysettings:(state.dashboard.companysettings),
           };
}


function mapDispatchToProps(dispatch) {
  
  return bindActionCreators({getcompanysettings:getcompanysettings,updatesettings:updatesettings}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(CompanySettings);
