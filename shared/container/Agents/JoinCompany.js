import React, { Component,PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {signupuser} from '../../redux/actions/actions'
import {getInviteEmail} from '../../redux/actions/actions'
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/SideBar/SideBar.jsx';


export default class JoinCompany extends React.Component {


  constructor(props, context) {
    super(props, context);
    this.onSubmit = this.onSubmit.bind(this);
    
  
    
  }
  componentWillMount(){
    this.props.getInviteEmail(this.props.params.id);
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
                const tokenref = this.refs.token;
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
                    'website': cdnameRef.value,
                    'token' : tokenref.value
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
                <div  className="pageContainer">
                     <Header/>
                    <div className = "mainBody">
                      <div className ="row margin-bottom-40">
                          <SideBar/>
                          <div className="col-md-9 col-sm-9">
                            <h1>Join Company</h1>
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
                                              {
                                                this.props.inviteDetails && 
                                                <input type="email"  className="form-control input-medium"  value = {this.props.inviteDetails.email} ref = "email" required placeholder="Email Address"/>
                                              
                                              }
                                               {
                                                this.props.inviteDetails && 
                                                <input type="hidden"  className="form-control input-medium" ref = "token" value = {this.props.inviteDetails.token}/>
                                               }
                                            
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
                                                  return(
                                                    <div className = "alert alert-danger"><span>{err}</span></div>
                                                  )
                                                }
                                              )


                                            }

                                  </form>


                                  </div>
                                  </div>
                                  </div>


                                  </div>

                              <div id="topcontrol" title="Scroll Back to Top">
                              <img src="/img/up.png"/>
                              </div>

                    </div>
                    </div>


        <Footer/>
      </div>
  </div>
);

}
}


JoinCompany.propTypes = {
    signupwarnings: PropTypes.shape({
    validationErrs: PropTypes.array,
    token: PropTypes.string,
    statusCode: PropTypes.number
  })

};

function mapStateToProps(state) {
  console.log('mapStateToProps function called');
  console.log(state.signup.signupwarnings);
  return {
    signupwarnings: (state.signup.signupwarnings),
    inviteDetails :state.signup.inviteDetails,

  }
  ;
}

export default connect(mapStateToProps, { signupuser,getInviteEmail })(JoinCompany);


