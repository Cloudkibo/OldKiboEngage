import React, { Component, PropTypes } from 'react';
import auth from '../../services/auth';
import { connect } from 'react-redux';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import { Link } from 'react-router';
import {getfbpage,editPage}  from '../../redux/actions/actions';


class EditFbPage extends Component {
  constructor(props, context) {
        //call action to get user teams
    if(props.userdetails.accountVerified == "No"){
    browserHistory.push('/notverified');
   }
    const usertoken = auth.getToken();
    console.log('constructor is called');
    if(usertoken != null)
    {

        console.log(usertoken);
        props.getfbpage(usertoken,props.params.id);
      }
    super(props, context);
    this.editPage = this.editPage.bind(this);

  }



  editPage(e) {
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
       this.props.editPage({pageid,appid,pageToken,pageTitle,pageDescription,companyid},usertoken);
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
               <h3 className ="page-title">Facebook Pages Management </h3>
               <ul className="page-breadcrumb breadcrumb">
                   <li>
                     <i className="fa fa-home"/>
                     <Link to="/dashboard"> Dashboard </Link>
                     <i className="fa fa-angle-right"/>
                   </li>
                   <li>
                      <Link to="/fbpages">Facebook Pages Management</Link>
                   </li>
                </ul>
                {this.props.errorMessageProfile && this.props.errorMessageProfile.status == "danger" &&

                   <div className = "alert alert-danger"><span>{this.props.errorMessageProfile.msg}</span></div>
                    }

                {this.props.errorMessageProfile && this.props.errorMessageProfile.status == "success" &&

                   <div className = "alert alert-success"><span>{this.props.errorMessageProfile.msg}</span></div>
                    }    

                <div className="portlet box grey-cascade">
                  <div className="portlet-title">
                    <div className="caption">
                      <i className="fa fa-group"/>
                     Edit Facebook Messenger App Information
                    </div>
                  </div>

                  {
                    this.props.fbpage && 
                  <div className="portlet-body form">
                    <form className="form-horizontal form-row-seperated">
                      <div className="form-body">
                                  <div className="form-group">
                                    <label className="control-label col-md-3"> Page Id </label>
                                    <div className="col-md-9">
                                      <div className="input-group">
                                       

                                        <input className="form-control input-medium" type='text'  ref = "pageid" disabled defaultValue={this.props.fbpage.pageid} placeholder ="Your Page ID"/>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="form-group">
                                    <label className="control-label col-md-3"> Page Title</label>
                                    <div className="col-md-9">
                                       <div className="input-group">
                                        <input className="form-control input-medium" type='text'  ref = "pageTitle" defaultValue={this.props.fbpage.pageTitle}  placeholder ="Your Page Title"/>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="form-group">
                                    <label className="control-label col-md-3"> Page Description</label>
                                    <div className="col-md-9">
                                      <textarea className="form-control" type='text' rows='4' ref="pageDescription" defaultValue={this.props.fbpage.pageDescription} placeholder="Enter short description of page"/>
                                    </div>
                                  </div>

                                  <div className="form-group">
                                    <label className="control-label col-md-3">App ID</label>
                                    <div className="col-md-9">
                                       <div className="input-group">
                                        <input className="form-control input-medium" type='text'  ref = "appid" defaultValue={this.props.fbpage.appid} placeholder ="Your Facebook App ID"/>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="form-group">
                                    <label className="control-label col-md-3"> Page Token</label>
                                    <div className="col-md-9">
                                       <div className="input-group">
                                        <input className="form-control input-medium" type='text'  ref = "pageToken" defaultValue={this.props.fbpage.pageToken}  placeholder ="Your Page Token"/>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="form-actions fluid">
                                    <div className="row">
                                      <div className="col-md-3">
                                        <div className="col-md-offset-9 col-md-9">
                                          <button className="btn green"  onClick={this.editPage}>
                                            <i className="fa fa-pencil"/>
                                            Submit
                                          </button>

                                        </div>
                                      </div>
                                      <div className="col-md-9">
                                        <div className="col-md-9">
                                          <Link to="/fbpages" className="btn green">
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
                }
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
    fbpage:(state.dashboard.fbpage),
  };
}

export default connect(mapStateToProps, {getfbpage,editPage})(EditFbPage);
