import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {changepassword} from '../../redux/actions/actions'

import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import ProfileSideBar from '../../components/SideBar/ProfileSideBar';

import auth from '../../services/auth';
import { bindActionCreators } from 'redux';

class ChangePassword extends Component {

 constructor(props, context) {
      //call action to get user teams 
   
       super(props, context);
        this.onChangeCurrentPassword = this.onChangeCurrentPassword.bind(this);
        this.onChangeNewPassword = this.onChangeNewPassword.bind(this);
        this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this);
        
         this.state = {
          cpwdErr: '',
          npwdErr:'',
          doesMatch: '',
        };
     
        this.onSubmit = this.onSubmit.bind(this);
  
   

   
    
  }

onChangeCurrentPassword(event) {
  if(event.target.value == ""){
    this.setState({
      cpwdErr : 'Length0'
    });
  }

  else if(event.target.value.length < 6){
    this.setState({
      cpwdErr : 'Length6'
    });
  }
  else{
    this.setState({
      cpwdErr : 'LengthOk'
    });
  }
  }

  onChangeNewPassword(event) {
  if(event.target.value.length == 0){
    this.setState({
      npwdErr : 'Length0'
    });
  }

  else if(event.target.value.length < 6){
    this.setState({
      npwdErr : 'Length6'
    });
  }
  else{
    this.setState({
      npwdErr : 'LengthOk'
    });
  }

    if(event.target.value != this.refs.confirm_npwd.value){
      this.setState({doesMatch: 'Passwords do not match'});
    }else{
      this.setState({doesMatch: ''});
    }
  }

  onChangeConfirmPassword(event) {
    if(event.target.value != this.refs.npwd.value){
      this.setState({doesMatch: 'Passwords do not match'});
    }else{
      this.setState({doesMatch: ''});
    }
  }
  onSubmit(event)
    {
       const usertoken = auth.getToken();
       event.preventDefault();
       if(this.refs.npwd.value != this.refs.confirm_npwd.value){
         alert("Passwords Do Not Match");
         return;
       }
       if(this.refs.cpwd.value != '' && this.refs.cpwd.value.length >= 6 && this.refs.cpwd.value != '' && this.refs.cpwd.value.length && this.refs.npwd.value != '' && this.refs.npwd.value.length >=6)
       {
                    var user = {
                         'email' : this.props.userdetails.email,
                         'password' : this.refs.cpwd.value,
                         'newpassword' :this.refs.npwd.value                    
                  }
                  console.log(user);

                  this.props.changepassword(user,usertoken);
        
       }
               
        
    }


   
 

  render() {
    const token = auth.getToken()
    console.log(token)
    
    return (
      <div className="vbox viewport">
       <AuthorizedHeader name = {this.props.userdetails.firstname} user={this.props.userdetails}/>
    
       <div className="page-container hbox space-between">

         <SideBar isAdmin ={this.props.userdetails.isAdmin}/> 
          <div className="page-content-wrapper">
           
            <div className="page-content">
              <div className="row">
                <div className="col-md-12">
                    <h3 className ="page-title">My Profile </h3>
                     <ul className="page-breadcrumb breadcrumb">
                      <li>
                        <i className="fa fa-home"/>
                        <Link to="/dashboard"> Dashboard </Link>
                       
                      </li>                  
                      <li>
                        <Link to="/myprofile"> Profile </Link>
                      </li>               
      
                    </ul>
                </div>
              </div>      
          <div className="row profile-account">
                <ProfileSideBar iscurrent="changepassword"/>
          <div className="col-md-9">
            <div className="portlet box">
            <div className="portlet body">
                <form onSubmit={this.onSubmit} className ="css-form">
                                              <div className="form-group">
                                                <label htmlFor="cpwd">Current Password</label>
                                                <input type="password" style={{maxWidth: 350,}}  className="form-control " ref = "cpwd" required placeholder="Enter current password" onChange={this.onChangeCurrentPassword}/>
                                              {
                                                this.state.cpwdErr == ""?
                                                <span>Enter password</span>:<span></span>

                                              }

                                               {
                                                this.state.cpwdErr == "Length6"?
                                                <span>Length of password should be greater than 6 characters.</span>:<span></span>

                                              }
                                              </div>

                                              <div className="form-group">
                                                <label>New Password</label>
                                                <input type="password" style={{maxWidth: 350,}}  className="form-control "  ref = "npwd" required placeholder="Enter new password" onChange={this.onChangeNewPassword}/>
                                              </div>


                                              {
                                                this.state.npwdErr == ""?
                                                <span>Enter password</span>:<span></span>

                                              }

                                               {
                                                this.state.npwdErr == "Length6"?
                                                <span>Length of password should be greater than 6 characters.</span>:<span></span>

                                              }
                                              <div className="form-group">
                                              <br/>
                                                <label>Confirm Password</label>
                                                <input type="password" style={{maxWidth: 350,}}  className="form-control "  ref = "confirm_npwd" required placeholder="Enter confirm password" onChange={this.onChangeConfirmPassword}/>
                                                 <span>{this.state.doesMatch}</span>
                                              </div>

                                               <br/>
                                               <br/>
                                              <div className="form-actions">
                                                      <button type="submit" disabled={(this.state.doesMatch == '') ? false:true} className="btn green btn-send">Change Password</button>
                                                      <Link to='/dashboard' className="btn default"> Cancel </Link> 
                                              </div>
                                                
                                               

                                              

                                             {this.props.errorMessageProfile && this.props.errorMessageProfile.status == "danger" &&
                                                 <div className = "alert alert-danger"><span>{this.props.errorMessageProfile.message}</span></div>
                                              }

                                              {this.props.errorMessageProfile && this.props.errorMessageProfile.status == "success" &&
                                                 <div className = "alert alert-success"><span>{this.props.errorMessageProfile.message}</span></div>
                                              }

                                  </form>
             
              
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
          subgroups :(state.dashboard.subgroups),
          myteamdetails:(state.dashboard.myteamdetails),
           };
}


function mapDispatchToProps(dispatch) {
  
  return bindActionCreators({ changepassword:changepassword}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(ChangePassword);
