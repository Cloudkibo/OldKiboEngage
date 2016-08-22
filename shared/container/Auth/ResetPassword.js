import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import {resetpassword,verifyPasswordResettoken} from '../../redux/actions/actions'
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/SideBar/SideBar.jsx';
import { browserHistory } from 'react-router'

export default class ResetPassword extends Component {

  constructor(props, context) {
    super(props, context);
    this.onSubmit = this.onSubmit.bind(this);
    props.verifyPasswordResettoken(props.params.id);
  }
  onSubmit(event)
  {
    event.preventDefault();
    if(this.refs.password.value.length > 6){
    var dataToSend = {
        token : this.props.params.id,
        password : this.refs.password.value
      };
    this.props.resetpassword(dataToSend);
  }
  else{
  alert("Password must be greater than 6 characters");
  }
  }

  render() {
  {this.props.errorMessage && this.props.errorMessage == "fail" &&
         browserHistory.push('/resetpasswordfailure')
  }
  
    return (
      <div>
        <div  className="pageContainer">
          <Header/>
          <div className = "mainBody">
            <div className ="row margin-bottom-40">
              <SideBar isAdmin ="no"/>
              <div className="col-md-9 col-sm-9">
                <h1>Reset Password</h1>
                <div className="content-form-page">
                <div className ="row">
                <div className ="col-md-7 col-sm-7">
                  <form onSubmit={this.onSubmit} className ="css-form">
                    <div className="form-group">
                      <label htmlFor="domain">Password *</label>
                      <input type='password' ref='password' className="form-control input-medium" placeholder='Password' required = 'required'/>
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
export default connect(mapStateToProps, { resetpassword,verifyPasswordResettoken })(ResetPassword);
