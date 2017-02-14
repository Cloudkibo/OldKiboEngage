import React, { Component, PropTypes } from 'react';
import auth from '../../services/auth';
import { connect } from 'react-redux';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import { Link } from 'react-router';
import {createPage}  from '../../redux/actions/actions';


class CreateFbPage extends Component {
  constructor(props, context) {
    console.log('constructor is called');
    super(props, context);

     //this.createcannedResponse = this.createcannedResponse.bind(this);
      this.addPage = this.addPage.bind(this);
  }



  addPage(e) {
     e.preventDefault();
    const usertoken = auth.getToken();
    const pageTitle = this.refs.pageTitle.value;
    const pageDescription = this.refs.pageDescription.value;
    const pageToken = this.refs.pageToken.value;
    const appid = this.refs.appid.value;
    var companyid = this.props.userdetails.uniqueid;
    const pageid = this.refs.pageid.value;
    if (pageToken && pageid)
     {
       //this.props.addResponse("/" + shortcode.value,msg.value);
       this.props.createPage({pageid,appid,pageToken,pageTitle,pageDescription,companyid},usertoken);
       //shortcode.value = message.value = '';

    }
  }

  render() {
    //const cls = `form ${(this.props.showCR ? 'appear' : 'hide')}`;

    return (
      <div>
        <div className="page-container">
          <SideBar isAdmin ={this.props.userdetails.isAdmin}/>
          <div className="page-content-wrapper">
             <div className="page-content">
               <h3 className ="page-title">Facebook Pages Management </h3>
               <ul className="page-breadcrumb breadcrumb">
                   <li>
                     <i className="fa fa-home"/>
                     <Link to="/dashboard"> Dashboard </Link>
                     <i className="fa fa-angle-right"/>
                   </li>
                   <li>
                      <Link to="/cannedresponses">Facebook Pages Management</Link>
                   </li>
                </ul>
                {this.props.errorMessageProfile && this.props.errorMessageProfile.data.status == "danger" &&

                   <div className = "alert alert-danger"><span>{this.props.errorMessageProfile.data.msg}</span></div>
                    }

                {this.props.errorMessageProfile && this.props.errorMessageProfile.data.status == "success" &&

                   <div className = "alert alert-success"><span>{this.props.errorMessageProfile.data.msg}</span></div>
                    }    

                <div className="portlet box grey-cascade">
                  <div className="portlet-title">
                    <div className="caption">
                      <i className="fa fa-group"/>
                     Add Facebook Messenger App Information
                    </div>
                  </div>

                  <div className="portlet-body form">
                    <form className="form-horizontal form-row-seperated">
                      <div className="form-body">
                        <div className="form-group">
                          <label className="control-label col-md-3"> Page Id </label>
                          <div className="col-md-9">
                            <div className="input-group">
                             

                              <input className="form-control input-medium" type='text'  ref = "pageid" placeholder ="Your Page ID"/>
                            </div>
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="control-label col-md-3"> Page Title</label>
                          <div className="col-md-9">
                             <div className="input-group">
                              <input className="form-control input-medium" type='text'  ref = "pageTitle" placeholder ="Your Page Title"/>
                            </div>
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="control-label col-md-3"> Page Description</label>
                          <div className="col-md-9">
                            <textarea className="form-control" type='text' rows='4' ref="pageDescription" placeholder="Enter short description of page"/>
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="control-label col-md-3">App ID</label>
                          <div className="col-md-9">
                             <div className="input-group">
                              <input className="form-control input-medium" type='text'  ref = "appid" placeholder ="Your Facebook App ID"/>
                            </div>
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="control-label col-md-3"> Page Token</label>
                          <div className="col-md-9">
                             <div className="input-group">
                              <input className="form-control input-medium" type='text'  ref = "pageToken" placeholder ="Your Page Token"/>
                            </div>
                          </div>
                        </div>
                        <div className="form-actions fluid">
                          <div className="row">
                            <div className="col-md-3">
                              <div className="col-md-offset-9 col-md-9">
                                <button className="btn green"  onClick={this.addPage}>
                                  <i className="fa fa-pencil"/>
                                  Submit
                                </button>

                              </div>
                            </div>
                            <div className="col-md-9">
                              <div className="col-md-9">
                                <Link to="/dashboard" className="btn green">
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
    errorMessageProfile:(state.dashboard.errorMessageProfile),
    reponses:(state.dashboard.responses),
    agents:(state.dashboard.agents),
    deptagents:(state.dashboard.deptagents),
  };
}

export default connect(mapStateToProps, {createPage})(CreateFbPage);
