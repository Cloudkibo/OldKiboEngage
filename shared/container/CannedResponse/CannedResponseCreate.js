import React, { Component, PropTypes } from 'react';
import auth from '../../services/auth';
import { connect } from 'react-redux';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import { Link } from 'react-router';
import {createResponse}  from '../../redux/actions/actions';


class CannedResponseCreate extends Component {
  constructor(props, context) {
    console.log('constructor is called');
    super(props, context);

     //this.createcannedResponse = this.createcannedResponse.bind(this);
      this.addResponse = this.addResponse.bind(this);
  }



  addResponse(e) {
     e.preventDefault();
    const usertoken = auth.getToken();
    const shortcode = "/" + this.refs.shortcode.value;
    const message = this.refs.msg.value;
    var companyid = this.props.userdetails.uniqueid;

    if (shortcode && message)
     {
       //this.props.addResponse("/" + shortcode.value,msg.value);
       this.props.createResponse({shortcode,message,companyid,usertoken});
       //shortcode.value = message.value = '';

    }
  }

  render() {
    //const cls = `form ${(this.props.showCR ? 'appear' : 'hide')}`;

       return (
      <div className="vbox viewport">
      <AuthorizedHeader name = {this.props.userdetails.firstname} user={this.props.userdetails}/>
        <div className="page-container hbox space-between">
          <SideBar isAdmin ={this.props.userdetails.isAdmin}/>
          <div className="page-content-wrapper">
             <div className="page-content">
               <h3 className ="page-title">Canned Response Management </h3>
               <ul className="page-breadcrumb breadcrumb">
                   <li>
                     <i className="fa fa-home"/>
                     <Link to="/dashboard"> Dashboard </Link>
                     <i className="fa fa-angle-right"/>
                   </li>
                   <li>
                      <Link to="/cannedresponses">Canned Response Management</Link>
                   </li>
                </ul>
                {this.props.errorMessage &&

                   <div className = "alert alert-danger"><span>{this.props.errorMessage}</span></div>
                    }

                <div className="portlet box grey-cascade">
                  <div className="portlet-title">
                    <div className="caption">
                      <i className="fa fa-group"/>
                      Create Canned Response
                    </div>
                  </div>

                  <div className="portlet-body form">
                    <form className="form-horizontal form-row-seperated">
                      <div className="form-body">
                        <div className="form-group">
                          <label className="control-label col-md-3"> Short Code </label>
                          <div className="col-md-9">
                            <div className="input-group">
                              <span className="input-group-addon">
                                /
                              </span>

                              <input className="form-control input-medium" type='text'  ref = "shortcode" placeholder ="Short Code e.g Hey!"/>
                            </div>
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="control-label col-md-3"> Response text</label>
                          <div className="col-md-9">
                            <textarea className="form-control" type='text' rows='4' ref="msg" placeholder="Hi,how can we help you?"/>
                          </div>
                        </div>
                        <div className="form-actions fluid">
                          <div className="row">
                            <div className="col-md-3">
                              <div className="col-md-offset-9 col-md-9">
                                <button className="btn green"  onClick={this.addResponse}>
                                  <i className="fa fa-pencil"/>
                                  Submit
                                </button>

                              </div>
                            </div>
                            <div className="col-md-9">
                              <div className="col-md-9">
                                <Link to="/cannedresponses" className="btn green">
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
  console.log("mapStateToProps is called.");

  return {
    channels:(state.dashboard.channels),
    userdetails:(state.dashboard.userdetails),
    teamdetails:(state.dashboard.teamdetails),
    errorMessage:(state.dashboard.errorMessage),
    reponses:(state.dashboard.responses),
    agents:(state.dashboard.agents),
    deptagents:(state.dashboard.deptagents),
  };
}

export default connect(mapStateToProps, {createResponse})(CannedResponseCreate);
