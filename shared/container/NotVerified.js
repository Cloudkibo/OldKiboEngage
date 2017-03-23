import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer.jsx';
import SideBar from '../components/Header/SideBar';
import SideBarr from '../components/SideBar/SideBar.jsx';
import AuthorizedHeader from '../components/Header/AuthorizedHeader';
import { verifyaccount}  from '../redux/actions/actions'

import auth from '../services/auth';
class NotVerified extends Component {

 constructor(props, context) {

    super(props, context);
    this.verifyaccount = this.verifyaccount.bind(this);
    
    
  }

  verifyaccount(){
     const usertoken = auth.getToken();
   
    this.props.verifyaccount(usertoken);
  }
  render() {
    const token = auth.getToken()
          return (
             <div>
                 <AuthorizedHeader name = {this.props.userdetails.firstname} user={this.props.userdetails}/>
                 <div className="page-container">
                    <SideBar isAdmin ={this.props.userdetails.isAdmin}/> 
                    <div className="page-content-wrapper">
                      <div className="page-content"> 
                          <h1>Please verify your email address</h1>
                          <p>If you have not received verification email from us, then you can get one now.
                          </p>
                            
                          <button className="btn btn-default" onClick={this.verifyaccount}> Send verification email </button>

                                             {this.props.errorMessageProfile && this.props.errorMessageProfile.status == "danger" &&
                                                 <div className = "alert alert-danger"><span>{this.props.errorMessageProfile.message}</span></div>
                                              }

                                              {this.props.errorMessageProfile && this.props.errorMessageProfile.status == "success" &&
                                                 <div className = "alert alert-success"><span>{this.props.errorMessageProfile.message}</span></div>
                                              }
                          
                      </div>
                    </div>
                 </div>
       </div> 
        )


}

}

function mapStateToProps(state) {
  
  return {
  userdetails:(state.dashboard.userdetails),
  agents:(state.dashboard.agents),
  deptagents:(state.dashboard.deptagents),
  teamdetails:(state.dashboard.teamdetails),

  errorMessageProfile:(state.dashboard.errorMessageProfile),
          
   }
}

export default connect(mapStateToProps,{verifyaccount})(NotVerified);

