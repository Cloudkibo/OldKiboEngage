import React, { Component,PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {signupuser} from '../../redux/actions/actions'
import {Footer} from '../../components/Footer/Footer'


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
                 // fnameRef.value = lnameRef.value = pwdRef.value = c_pwdRef.value = emailRef.value = phoneRef.value = cname.value = cdnameRef.value = '';
                }
    }




  render() {
    const { signupwarnings } = this.props

    return (
    <div>
        <div className="col-md-9 col-sm-9">
            <h3>Register your admin account</h3>
            <div className="content-form-page">
                <div className ="row">
                  <div className ="col-md-7 col-sm-7">
                      <span> * required to fill these field </span><br/>
                      <form onSubmit={this.onSubmit} className ="css-form">
                              <div className="form-group">
                                <label htmlFor="username">First Name *</label>
                                <input type="text"  className="form-control input-medium" ref = "fname" required placeholder="First Name"/>
                              </div>
                              <div className="form-group">
                                <label>Last Name *</label>
                                <input type="text"  className="form-control input-medium"  ref = "lname" required placeholder="Last Name"/>
                              </div>
                              <div className="form-group">
                                <label>Email *</label>
                                <input type="email"  className="form-control input-medium"  ref = "email" required placeholder="Email Address"/>
                              </div>
                              <div className="form-group">
                                <label>Password *</label>
                                <input type="password" className="form-control input-medium" ref="pwd" placeholder="Password" required placeholder="Password"/>
                              </div>
                              <div className="form-group">
                              <label>Confirm Password *</label>
                              <input type="password" className="form-control input-medium" ref="c_pwd" placeholder="Confirm Password" required/>
                              </div>
                              <div className="form-group">
                              <label>Phone *</label>
                              <input type="number" className="form-control input-medium" ref="phone" required placeholder="Phone"/>
                              </div>
                              <div className="form-group">
                              <label>Company Name *</label>
                              <input type="text" className="form-control input-medium" ref="cname" required placeholder="Company Name"/>
                              </div>
                              <div className="form-group">
                              <label>Company Domain Name *</label>
                              <input type="text" className="form-control" ref="cdname" required placeholder="Domain Name"/>
                              <small>e.g. www.company.com or www.company.org or www.company.net</small>
                              </div>
                              <button type="submit" className="btn btn-primary btn-send">Submit</button>
                              {

                                      this.props.signupwarnings && this.props.signupwarnings.statusCode == 422 &&
                                      this.props.signupwarnings.validationErrs.map(function (err, i) {
                                          return
                                          <div   className = "alert alert-danger" key = {i} > < span > {err} < /span> </div>
                                        }
                                      )


                              }



                  </form>
                  </div>
                  </div>
                  </div>
                  </div>

    </div>

);

}
}
Signup.propTypes = {
  signupwarnings: PropTypes.shape({
    validationErrs: PropTypes.array,
    token: PropTypes.string,
    statusCode: PropTypes.number
  })

};

function mapStateToProps(state) {
  console.log(state.signupwarnings)
  return {signupwarnings: (state.signupwarnings)};
}

export default connect(mapStateToProps, { signupuser })(Signup);
