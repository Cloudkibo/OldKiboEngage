import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {getcompanysettings,updatesettings} from '../../redux/actions/actions'

import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import { browserHistory } from 'react-router'

import auth from '../../services/auth';
import { bindActionCreators } from 'redux';
import { FileUpload } from 'redux-file-upload'
var style1 = {
  'marginLeft': '-1.75px',
  'width': '782px',
  'height': '94px',
}
class CompanySettings extends Component {

 constructor(props, context) {
      //call action to get user teams
    if(props.userdetails.accountVerified == "No"){
    browserHistory.push('/notverified');
   }

    const usertoken = auth.getToken();
    //console.log('componentWillMount is called');
    if(usertoken != null)
    {

        //console.log(usertoken);
        props.getcompanysettings(usertoken,props.userdetails.uniqueid);
      }

        super(props, context);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {

          src : '',
          userfile:null,

        };
        this._onChange = this._onChange.bind(this);
      //  this.onFileSubmit = this.onFileSubmit.bind(this);




  }

  _onChange(e) {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    this.setState({ userfile:e.target.files[0]
                       });

    const reader = new FileReader();
    reader.onload = () => {
      this.setState({ src: reader.result,
                       });
    };
    reader.readAsDataURL(files[0]);
  }

  onSubmit(event)
    {
     const usertoken = auth.getToken();

      var fileData = new FormData();

      if(this.props.userdetails.isAdmin === "Yes"){
       //console.log(this.state.userfile)
       if(this.state.src == '' )
       {
       var companyprofile = {
                    'abandonedscheduleemail1':this.refs.abandonedscheduleemail1.value,
                    'abandonedscheduleemail2':this.refs.abandonedscheduleemail2.value,
                    'abandonedscheduleemail3':this.refs.abandonedscheduleemail3.value,
                    'completedscheduleemail1': this.refs.completedscheduleemail1.value,
                    'completedscheduleemail2': this.refs.completedscheduleemail2.value,
                    'completedscheduleemail3':this.refs.completedscheduleemail3.value,
                    'invitedscheduleemail1':this.refs.invitedscheduleemail1.value,
                    'invitedscheduleemail2':this.refs.invitedscheduleemail2.value,
                    'invitedscheduleemail3':this.refs.invitedscheduleemail3.value,
                    'maxnumberofdepartment':this.refs.maxnumberofdepartment.value,
                    'maxnumberofchannels':this.refs.maxnumberofchannels.value,
                    'notificationemailaddress':this.refs.notificationemailaddress.value,
                    'widgetwindowtab':this.refs.widgetwindowtab.options[this.refs.widgetwindowtab.selectedIndex].value,
                    'showsummary':this.refs.showsummary.options[this.refs.showsummary.selectedIndex].value,
                    'smsphonenumber':this.refs.smsphonenumber.value,
                    'allowemailnotification':this.refs.allowemailnotification.options[this.refs.allowemailnotification.selectedIndex].value,
                    'allowsmsnotification':this.refs.allowsmsnotification.options[this.refs.allowemailnotification.selectedIndex].value,
                    'isdomainemail':this.refs.isdomainemail.options[this.refs.isdomainemail.selectedIndex].value,
                    'allowChat':this.refs.allowChat.options[this.refs.allowChat.selectedIndex].value,
                    'enableFacebook':this.refs.allowFacebook.options[this.refs.allowFacebook.selectedIndex].value,
                    'widgetlogoURL': this.props.companysettings.widgetlogoURL
                  }
                  //console.log(companyprofile);
                  this.props.updatesettings(this.state.userfile,companyprofile,usertoken,true);

              }

          else{
             {
       var companyprofile = {
                    'abandonedscheduleemail1':this.refs.abandonedscheduleemail1.value,
                    'abandonedscheduleemail2':this.refs.abandonedscheduleemail2.value,
                    'abandonedscheduleemail3':this.refs.abandonedscheduleemail3.value,
                    'completedscheduleemail1': this.refs.completedscheduleemail1.value,
                    'completedscheduleemail2': this.refs.completedscheduleemail2.value,
                    'completedscheduleemail3':this.refs.completedscheduleemail3.value,
                    'invitedscheduleemail1':this.refs.invitedscheduleemail1.value,
                    'invitedscheduleemail2':this.refs.invitedscheduleemail2.value,
                    'invitedscheduleemail3':this.refs.invitedscheduleemail3.value,
                    'maxnumberofdepartment':this.refs.maxnumberofdepartment.value,
                    'maxnumberofchannels':this.refs.maxnumberofchannels.value,
                    'notificationemailaddress':this.refs.notificationemailaddress.value,
                    'widgetwindowtab':this.refs.widgetwindowtab.options[this.refs.widgetwindowtab.selectedIndex].value,
                    'showsummary':this.refs.showsummary.options[this.refs.showsummary.selectedIndex].value,
                    'smsphonenumber':this.refs.smsphonenumber.value,
                    'allowemailnotification':this.refs.allowemailnotification.options[this.refs.allowemailnotification.selectedIndex].value,
                    'allowsmsnotification':this.refs.allowsmsnotification.options[this.refs.allowemailnotification.selectedIndex].value,
                    'isdomainemail':this.refs.isdomainemail.options[this.refs.isdomainemail.selectedIndex].value,
                    'allowChat':this.refs.allowChat.options[this.refs.allowChat.selectedIndex].value,
                    'enableFacebook':this.refs.allowFacebook.options[this.refs.allowFacebook.selectedIndex].value,

                  }
                  //console.log(companyprofile);
                  this.props.updatesettings(this.state.userfile,companyprofile,usertoken,false);

              }
            }
          }
      else {
                alert("You can not update company settings. Only admin has the access to do it.")
              }

               event.preventDefault();

    }





  render() {
    const token = auth.getToken()
    //console.log(token)

    return (
      <div className="vbox viewport">
       <AuthorizedHeader name = {this.props.userdetails.firstname} user={this.props.userdetails}/>

       <div className="page-container hbox space-between">

         <SideBar isAdmin ={this.props.userdetails.isAdmin}/>
          <div className="page-content-wrapper">

            <div className="page-content">
              <div className="row">
                <div className="col-md-12">
                    <h3 className ="page-title">Company Settings </h3>
                     <ul className="uk-breadcrumb">
                      <li>
                        <i className="fa fa-home"/>
                        <Link to="/dashboard"> Dashboard </Link>

                      </li>
                      <li>
                        <Link to="/companyprofile"> Company Settings </Link>
                      </li>

                    </ul>


            <div className="portlet box green-meadow">
            <div className="portlet-title">
              <div className="caption">
                <i className="fa fa-cogs"/>
                   Company settings
              </div>
            </div>
            <div className="portlet-body form">

            {this.props.companysettings &&
                <form  className ="form-horizontal form-bordered css-form">
                  <div className="form-body">
                                              <div className="form-group">
                                                <label className="control-label col-md-3">Max number of Groups</label>

                                                <div className="col-md-9">
                                                  <div id="spinner1">
                                                    <div className="input-group input-small">
                                                      <input type="Number"  className="form-control " min="1" max="20" ref = "maxnumberofdepartment" required  defaultValue={this.props.companysettings.maxnumberofdepartment}/>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>



                                              <div className="form-group">
                                                <label className="control-label col-md-3">Max number of Subgroups per Group</label>

                                                <div className="col-md-9">
                                                  <div id="spinner1">
                                                    <div className="input-group input-small">
                                                      <input type="Number"  className="form-control " min="1"  ref = "maxnumberofchannels" required  defaultValue={this.props.companysettings.maxnumberofchannels}/>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>

                                              <div className="form-group">
                                                <label className="control-label col-md-3">Company domain emails</label>
                                                <div id="spinner1">
                                                <div className="col-md-9">
                                                <div className="input-group input-small">
                                                <select  className="form-control"  ref = "isdomainemail" defaultValue={this.props.companysettings.isdomainemail}>
                                                  <option value="Yes">Yes</option>
                                                  <option value="No">No</option>
                                                </select>
                                                </div>
                                                  </div>
                                                </div>
                                              </div>


                                              <div className="form-group">
                                                <label className="control-label col-md-3">Notify by email</label>
                                                <div id="spinner1">
                                                <div className="col-md-9">
                                                <div className="input-group input-small">
                                                <select  className="form-control"  ref = "allowemailnotification" defaultValue={this.props.companysettings.allowemailnotification}>
                                                  <option value="Yes">Yes</option>
                                                  <option value="No">No</option>
                                                </select>
                                                </div>
                                                  </div>
                                                </div>
                                              </div>

                                              <div className="form-group">
                                                <label className="control-label col-md-3">Notification Email address</label>
                                                <div id="spinner1">
                                                <div className="col-md-9">
                                                <div className="input-group input-small">
                                                <input type="email"  className="form-control " ref = "notificationemailaddress" required  placeholder='example@abc.com' defaultValue={this.props.companysettings.notificationemailaddress}/>
                                                </div>
                                                  </div>
                                                </div>
                                              </div>

                                              <div className="form-group">
                                                <label className="control-label col-md-3">SMS Phone number</label>
                                                <div id="spinner1">
                                                <div className="col-md-9">
                                                <div className="input-group input-small">
                                                <input type="text"  className="form-control " maxlength='20' ref = "smsphonenumber"   defaultValue={this.props.companysettings.smsphonenumber} placeholder='+90123456789'/>
                                               </div>
                                                  </div>
                                                </div>
                                              </div>

                                              <div className="form-group">
                                                <label className="control-label col-md-3">SMS Notification</label>
                                                <div id="spinner1">
                                                <div className="col-md-9">
                                                <div className="input-group input-small">
                                                <select  className="form-control"  ref = "allowsmsnotification" defaultValue={this.props.companysettings.allowsmsnotification}>
                                                  <option value="Yes">Yes</option>
                                                  <option value="No">No</option>
                                                </select>
                                                </div>
                                                  </div>
                                                </div>
                                              </div>

                                               <div className="form-group">
                                                <label className="control-label col-md-3">Enable Facebook Messenger</label>
                                                <div id="spinner1">
                                                <div className="col-md-9">
                                                <div className="input-group input-small">
                                                <select  className="form-control"  ref = "allowFacebook" defaultValue={this.props.companysettings.enableFacebook?this.props.companysettings.enableFacebook:"Yes"}>
                                                  <option value="Yes">Yes</option>
                                                  <option value="No">No</option>
                                                </select>
                                                </div>
                                                  </div>
                                                </div>
                                              </div>


                                               <div className="form-group">
                                                <label className="control-label col-md-3">Show Summary</label>
                                                <div id="spinner1">
                                                <div className="col-md-9">
                                                <div className="input-group input-small">
                                                <select  className="form-control"  ref = "showsummary" defaultValue={this.props.companysettings.showsummary}>
                                                  <option value="Yes">Yes</option>
                                                  <option value="No">No</option>
                                                </select>
                                                </div>
                                                  </div>
                                                </div>
                                              </div>

                                               <div className="form-group">
                                                <label className="control-label col-md-3">Allow Chat</label>
                                                <div id="spinner1">
                                                <div className="col-md-9">
                                                <div className="input-group input-small">
                                                <select  className="form-control"  ref = "allowChat" defaultValue={this.props.companysettings.allowChat}>
                                                  <option value="Yes">Yes</option>
                                                  <option value="No">No</option>
                                                </select>
                                                </div>
                                                  </div>
                                                </div>
                                              </div>


                                               <div className="form-group">
                                                <label className="control-label col-md-3">Open widget as a separate</label>
                                                <div id="spinner1">
                                                <div className="col-md-9">
                                                <div className="input-group input-small">
                                                <select  className="form-control"  ref = "widgetwindowtab" defaultValue={this.props.companysettings.widgetwindowtab}>
                                                  <option value="window">Window</option>
                                                  <option value="tab">Tab</option>
                                                </select>
                                               </div>
                                                  </div>
                                                </div>
                                              </div>

                                               <div className="form-group">
                                                <label className="control-label col-md-3">Email Template 1 (Reschedule Resolved Session)</label>
                                                <div className="col-md-9">
                                                  <textarea id="maxlength_textarea" ref = "completedscheduleemail1" defaultValue={this.props.companysettings.completedscheduleemail1} maxlength="5000" rows="2" placeholder="Type here" style={style1} className="form-control"></textarea><span className="help-block"></span>
                                                </div>
                                              </div>

                                               <div className="form-group">
                                                <label className="control-label col-md-3">Email Template 1 (Reschedule Abandoned Session)</label>
                                                <div className="col-md-9">
                                                  <textarea id="maxlength_textarea" ref= "abandonedscheduleemail1" defaultValue={this.props.companysettings.abandonedscheduleemail1} maxlength="5000" rows="2" placeholder="Type here" style={style1} className="form-control"></textarea>
                                                </div>
                                              </div>

                                              <div className="form-group">
                                                <label className="control-label col-md-3">Logo for Client Widget</label>
                                                 {
                                                this.props.companysettings.widgetlogoURL?

                                                <div className="col-md-9">
                                                
                                                  <img ref="widgetlogo"  src={this.props.companysettings.widgetlogoURL } style={{'width':'200px','height':'200px'}} />
                                                </div>:<div className="hide"></div>
                                              }
                                                <div>
                                                       <input type="file" onChange={this._onChange} className="pull-left"/>


                                                </div>
                                              </div>

                                              <div className="hide">

                                              <div className="form-group">
                                                <label className="control-label col-md-3">Email Template 2 (Reschedule Abandoned Call)</label>
                                                <div className="col-md-9">
                                                  <textarea id="maxlength_textarea" maxlength="5000"  ref = "abandonedscheduleemail2" defaultValue={this.props.companysettings.abandonedscheduleemail2} rows="2" placeholder="Type here" style={style1} className="form-control"></textarea><span className="help-block"></span>
                                                </div>
                                              </div>
                                              <div className="form-group">
                                                <label className="control-label col-md-3">Email Template 3 (Reschedule Abandoned Call)</label>
                                                <div className="col-md-9">
                                                  <textarea id="maxlength_textarea" ref="abandonedscheduleemail3" defaultValue={this.props.companysettings.abandonedscheduleemail3} maxlength="5000" rows="2" placeholder="Type here" style={style1} className="form-control"></textarea><span className="help-block"></span>
                                                </div>
                                              </div>

                                              <div className="form-group">
                                                <label className="control-label col-md-3">Email Template 2 (Reschedule Resolved Call)</label>
                                                <div className="col-md-9">
                                                  <textarea id="maxlength_textarea" ref ="completedscheduleemail2"  defaultValue={this.props.companysettings.completedscheduleemail2} maxlength="5000" rows="2" placeholder="Type here" style={style1} className="form-control"></textarea><span className="help-block"></span>
                                                </div>
                                              </div>
                                              <div className="form-group">
                                                <label className="control-label col-md-3">Email Template 3 (Reschedule Resolved Call)</label>
                                                <div className="col-md-9">
                                                  <textarea id="maxlength_textarea" ref="completedscheduleemail3" defaultValue={this.props.companysettings.completedscheduleemail3} maxlength="5000" rows="2" placeholder="Type here" style={style1} className="form-control"></textarea><span className="help-block"></span>
                                                </div>
                                              </div>
                                              <div className="form-group">
                                                <label className="control-label col-md-3">Email Template 1 (Invite to call)</label>
                                                <div className="col-md-9">
                                                  <textarea id="maxlength_textarea" ref="invitedscheduleemail1" defaultValue={this.props.companysettings.invitedscheduleemail1} maxlength="5000" rows="2" placeholder="Type here" style={style1} className="form-control"></textarea><span className="help-block"></span>
                                                </div>
                                              </div>
                                              <div className="form-group">
                                                <label className="control-label col-md-3">Email Template 2 (Invite to call)</label>
                                                <div className="col-md-9">
                                                  <textarea id="maxlength_textarea" ref="invitedscheduleemail2" defaultValue={this.props.companysettings.invitedscheduleemail2} maxlength="5000" rows="2" placeholder="Type here" style={style1} className="form-control"></textarea><span className="help-block"></span>
                                                </div>
                                              </div>
                                              <div className="form-group">
                                                <label className="control-label col-md-3">Email Template 3 (Invite to call)</label>
                                                <div className="col-md-9">
                                                  <textarea id="maxlength_textarea" ref="invitedscheduleemail3"  defaultValue={this.props.companysettings.invitedscheduleemail3} maxlength="5000" rows="2" placeholder="Type here" style={style1} className="form-control"></textarea><span className="help-block"></span>
                                                </div>
                                              </div>


                                              </div>

                                               {this.props.errorMessageProfile && this.props.errorMessageProfile.status == "danger" &&
                                                 <div className = "alert alert-danger"><span>{this.props.errorMessageProfile.message}</span></div>
                                              }

                                              {this.props.errorMessageProfile && this.props.errorMessageProfile.status == "success" &&
                                                 <div className = "alert alert-success"><span>{this.props.errorMessageProfile.message}</span></div>
                                              }

                                              <div className="form-actions" style={{background: 'white'}}>
                                                      <button type="submit" className="btn green btn-send" onClick={this.onSubmit}>Save</button>
                                                      <Link to='/dashboard' className="btn default"> Back </Link>
                                              </div>



                                              <br/>
                                             </div>
                                  </form>
                                }
                     </div>
              </div>
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
          teamdetails:(state.dashboard.teamdetails),
          userdetails:(state.dashboard.userdetails),
          errorMessageProfile:(state.dashboard.errorMessageProfile),
          agents:(state.dashboard.agents),
          deptagents:(state.dashboard.deptagents),
          channels :(state.dashboard.channels),
          myteamdetails:(state.dashboard.myteamdetails),
          companysettings:(state.dashboard.companysettings),
           };
}


function mapDispatchToProps(dispatch) {

  return bindActionCreators({getcompanysettings:getcompanysettings,updatesettings:updatesettings}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(CompanySettings);
