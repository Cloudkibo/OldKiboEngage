import React, { Component,PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {signupuser} from '../../redux/actions/actions'


export default class Signup extends React.Component {


  constructor(props, context) {
    super(props, context);
    this.onSubmit = this.onSubmit.bind(this);
  }
    onSubmit(event)
    {
      event.preventDefault();
                const fnameRef = this.refs.fname;
                const lnameRef = this.refs.lname;
                const emailRef = this.refs.email;
                const phoneRef = this.refs.phone;
                const pwdRef = this.refs.pwd;
                const c_pwdRef = this.refs.c_pwd;
                const cname = this.refs.cname;
                const cdnameRef = this.refs.cdname;
                if (pwdRef.value != c_pwdRef.value) {
                  alert('Password donot match!.Retype password');
                  pwdRef.value = c_pwdRef.value = ''
                }
                if (fnameRef.value && lnameRef.value && pwdRef.value && c_pwdRef.value && emailRef.value && phoneRef.value && cname.value && cdnameRef.value) {
                  var user = {
                    'firstname': fnameRef.value,
                    'lastname': lnameRef.value,
                    'email': emailRef.value,
                    'phone': phoneRef.value,
                    'password': pwdRef.value,
                    'companyName': cname.value,
                    'website': cdnameRef.value
                  }
                  console.log(user);

                  this.props.signupuser(user)
                  fnameRef.value = lnameRef.value = pwdRef.value = c_pwdRef.value = emailRef.value = phoneRef.value = cname.value = cdnameRef.value = '';
                }
    }




  render() {
    return (
        <div className="login jumbotron center-block">
            <h1>Signup</h1>
           <form onSubmit={this.onSubmit}>
                      <div className="form-group">
                        <label htmlFor="username">First Name</label>
                        <input type="text"  className="form-control" ref = "fname"/>
                      </div>
                      <div className="form-group">
                      <label>Last Name</label>
                      <input type="text"  className="form-control"  ref = "lname"/>
                      </div>
                      <div className="form-group">
                      <label>Email</label>
                      <input type="email"  className="form-control"  ref = "email" />
                      </div>
                      <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control" ref="pwd" placeholder="Password" />
                      </div>
                      <div className="form-group">
                      <label>Confirm Password</label>
                      <input type="password" className="form-control" ref="c_pwd" placeholder="Retype Password" />
                      </div>
                      <div className="form-group">
                      <label>Phone</label>
                      <input type="text" className="form-control" ref="phone" />
                      </div>
                      <div className="form-group">
                      <label>Company Name</label>
                      <input type="text" className="form-control" ref="cname" />
                      </div>
                      <div className="form-group">
                      <label>Company Domain Name</label>
                      <input type="text" className="form-control" ref="cdname" />
                      </div>


                      <button type="submit" className="btn btn-default">Submit</button>
        </form>
    </div>
);

}
}
Signup.propTypes = {

};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, { signupuser })(Signup);
