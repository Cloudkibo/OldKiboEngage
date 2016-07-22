import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import {forgotpassword} from '../../redux/actions/actions'
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/SideBar/SideBar.jsx';

export default class ForgotPassword extends Component {

  constructor(props, context) {
    super(props, context);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onSubmit(event)
  {
    event.preventDefault();
    const usermail = this.refs.usermail
    const domain = this.refs.domain
   const creds = { email: usermail.value.trim(),website:domain.value.trim().toLowerCase()}
    this.props.forgotpassword(creds)
  }

  render() {
  
    return (
      <div>
        <div  className="pageContainer">
          <Header/>
          <div className = "mainBody">
            <div className ="row margin-bottom-40">
              <SideBar/>
              <div className="col-md-9 col-sm-9">
                <h1>Forgot Password</h1>
                <div className="content-form-page">
                <div className ="row">
                <div className ="col-md-7 col-sm-7">
                  <form onSubmit={this.onSubmit} className ="css-form">
                      <div className="form-group">
                      <label htmlFor="domain">Company Domain *</label>
                      <input type='text' ref='domain' className="form-control" placeholder='Domain name'/>
                      <span>e.g. www.company.com or www.company.org or www.company.net</span>
                      </div>
                      <div className="form-group">
                      <label htmlFor="email">Email *</label>
                      <input type='email' ref='usermail' className="form-control input-medium"  placeholder='Enter email address'/>
                      </div>
                      <button type = "submit"  className="btn btn-primary">
                      Reset Password
                      </button>

                      {this.props.errorMessage && this.props.errorMessage.status == "danger" &&
                         <div className = "alert alert-danger"><span>{this.props.errorMessage.message}</span></div>
                      }

                      {this.props.errorMessage && this.props.errorMessage.status == "success" &&
                         <div className = "alert alert-success"><span>{this.props.errorMessage.message}</span></div>
                      }
              </form>
              </div>
              </div>
              </div>
          </div>
          </div>
          </div>


          <Footer/>
        </div>
</div>



)
}


}
function mapStateToProps(state) {
  console.log('mapStateToProps function called');
   return {errorMessage: (state.auth.errorMessage)};
}
export default connect(mapStateToProps, { forgotpassword })(ForgotPassword);
