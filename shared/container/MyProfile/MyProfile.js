import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {getuser,updateprofile} from '../../redux/actions/actions'

import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import ProfileSideBar from '../../components/SideBar/ProfileSideBar';

import auth from '../../services/auth';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router'

class MyProfile extends Component {

 constructor(props, context) {
      //call action to get user groups 
    if(props.userdetails.accountVerified == "No"){
    browserHistory.push('/notverified');
   }
    const usertoken = auth.getToken();
    console.log('componentWillMount is called');
    if(usertoken != null)
    {
       
        console.log(usertoken);
        props.getuser(usertoken);
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

                  this.props.updateprofile(user,usertoken);
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
                <ProfileSideBar iscurrent="myprofile"/>
          <div className="col-md-9">
            <div className="portlet box">
            <div className="portlet body">
                <form onSubmit={this.onSubmit} className ="css-form">
                                              <div className="form-group">
                                                <label htmlFor="username">First Name</label>
                                                <input type="text"  className="form-control " ref = "fname" required placeholder="First Name" defaultValue={this.props.userdetails.firstname}/>
                                              </div>
                                              <div className="form-group">
                                                <label>Last Name</label>
                                                <input type="text"  className="form-control "  ref = "lname" required placeholder="Last Name" defaultValue={this.props.userdetails.lastname}/>
                                              </div>
                                              <div className="form-group">
                                                <label>Email</label>
                                                <input type="email"  className="form-control "  ref = "email" required placeholder="Email Address" value={this.props.userdetails.email} disabled/>
                                              </div>
                                             
                                             <div className="form-group">
                                                <label>Role</label>
                                                <input type="email"  className="form-control"  ref = "role" required  value={this.props.userdetails.role} disabled/>
                                              </div>
                                             
                                              <div className="form-group">
                                              <label>Phone</label>
                                              <input type="number" className="form-control" ref="phone" required placeholder="Phone" defaultValue={this.props.userdetails.phone}/>
                                              </div>
                                              <div className="form-group">
                                              <label>City</label>
                                              <input type="text" className="form-control " ref="city"  placeholder="City" defaultValue={this.props.userdetails.city}/>
                                              </div>
                                              <div className="form-group">
                                              <label>State</label>
                                              <input type="text" className="form-control" ref="state"  placeholder="State" defaultValue={this.props.userdetails.state}/>
                                              </div>
                                              <div className="form-group">
                                              <label>Country</label>
                                              <input type="text" className="form-control " ref="country"  placeholder="Country" defaultValue={this.props.userdetails.country}/>
                                              </div>
                                              <div className="form-group">
                                              <label>Domain Name</label>
                                              <input type="text" className="form-control" ref="cdname" value={this.props.userdetails.website} disabled/>
                                              </div>

                                              <div className="form-group">
                                              <label>Company Name</label>
                                              <input type="text" className="form-control" ref="cname" value={this.props.userdetails.companyName} disabled/>
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
          groupdetails:(state.dashboard.groupdetails),
          userdetails:(state.dashboard.userdetails),
          errorMessageProfile:(state.dashboard.errorMessageProfile),
          agents:(state.dashboard.agents),
          deptagents:(state.dashboard.deptagents),
          channels :(state.dashboard.channels),
          mygroupdetails:(state.dashboard.mygroupdetails),
           };
}


function mapDispatchToProps(dispatch) {
  
  return bindActionCreators({ getuser:getuser,updateprofile:updateprofile}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(MyProfile);
