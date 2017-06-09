import React, {Component, PropTypes} from 'react';
import auth from '../../services/auth';
import {createNotification}  from '../../redux/actions/actions'
import {connect} from 'react-redux';
import SideBar from '../../components/Header/SideBar';
import {Link} from 'react-router';
import {bindActionCreators} from 'redux';
import {sendNotification} from '../../socket';


class AddNotification extends Component {
  constructor(props, context) {
    //call action to get user teams
    const usertoken = auth.getToken();
    //console.log('constructor is called');
    super(props, context);

    this.addNotifications = this.addNotifications.bind(this);
  }


  addNotifications(e) {
    // we will send notification via email.
    //Also mobile client will receive notifications on socket.

    e.preventDefault();
    const usertoken = auth.getToken();
    const title = this.refs.title;
    const desc = this.refs.desc;
    var companyid = this.props.userdetails.uniqueid;

    if (title.value && desc.value && companyid) {
      var today = new Date();
      var uid = Math.random().toString(36).substring(7);
      var unique_id = 'h' + uid + '' + today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate() + '' + today.getHours() + '' + today.getMinutes() + '' + today.getSeconds();

      var notification = {
        'uniqueid': unique_id,
        'title': title.value,
        'description': desc.value,
        'companyid': companyid,
        'agent_id': this.props.userdetails._id,
        'hasImage': 'false'
      };

      var customers = this.props.customers;

      //console.log(notification);
      //sending notification on socket

      var message = {
        sender: this.props.userdetails.firstname,
        title: title.value,
        msg: desc.value,
        time: moment.utc().format('lll'),
        uniqueid: unique_id,
      };

      sendNotification(message);


      this.props.createNotification({notification, usertoken, customers});
    }
  }

  render() {

    return (

      <div className="vbox viewport">

        <div className="page-container hbox space-between">
          <SideBar isAdmin={this.props.userdetails.isAdmin}/>
          <div className="page-content-wrapper">
            <div className="page-content">
              <h3 className="page-title">Notifications Management </h3>
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

              <div className="alert alert-danger"><span>{this.props.errorMessage}</span></div>
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
                          <input className="form-control input-medium" type='text' ref="title"
                                 placeholder="Enter title"/>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="control-label col-md-3"> Description</label>
                        <div className="col-md-9">
                          <textarea className="form-control" type='text' rows='4' ref="desc"
                                    placeholder="Enter notification text"/>
                        </div>
                      </div>
                      {/*
                       <div className="form-group">
                       <label className="control-label col-md-3"> Upload Image</label>
                       <div className="col-md-9">
                       <input className="form-control input-medium" type='file'  ref = "img"/>
                       </div>
                       </div>
                       */}
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
    channels: (state.dashboard.channels),
    userdetails: (state.dashboard.userdetails),
    teamdetails: (state.dashboard.teamdetails),
    errorMessage: (state.dashboard.errorMessage),
    notifications: (state.dashboard.notifications),
    agents: (state.dashboard.agents),
    deptagents: (state.dashboard.deptagents),
    addednotification: (state.dashboard.addednotification),
    customers: (state.dashboard.customers),
  };
}

function mapDispatchToProps(dispatch) {

  return bindActionCreators({createNotification: createNotification}, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(AddNotification);


