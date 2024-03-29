import React, { Component,PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {signupuser} from '../../redux/actions/actions'
import {getInviteEmail} from '../../redux/actions/actions'
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/SideBar/SideBar.jsx';
import Phone,{
  formatPhoneNumber,
  parsePhoneNumber,
  isValidPhoneNumber
} from 'react-phone-number-input';
import Progress from 'react-progressbar';
var taiPasswordStrength = require("tai-password-strength")
var strengthTester = new taiPasswordStrength.PasswordStrength();


class JoinCompany extends React.Component {


  constructor(props, context) {
    super(props, context);
    this.onSubmit = this.onSubmit.bind(this);
    this.handlePwdChange = this.handlePwdChange.bind(this);
    this.state = {'phone':'', strength: '', pwdBar: 0, pwd_color: 'red'};



  }
   handlePwdChange(event) {
    var result = strengthTester.check(event.target.value);
    //console.log("Password changed", result.strengthCode);
    var text = "";
    var bar = 0;
    var color = 'red';
    switch (result.strengthCode) {
    case "VERY_WEAK":
        text = "WEAK";
        bar = 25;
        color= 'red';
        break; 
    case "WEAK":
        text = "REASONABLE";
        bar = 50;
        color = 'orange';
        break; 
    case "REASONABLE":
        text = "GOOD";
        bar = 75;
        color = 'yellow';
    case "STRONG":
        text = "STRONG";
        bar = 100;
        color = 'green';
        break; 
    case "VERY_STRONG":
        text = "STRONG";
        bar = 100;
        color = 'green';
        color
        break; 
    default: 
        text = "";
        bar = 0;
        color = 'red';
}
    this.setState({strength: text});
    this.setState({pwdBar: bar});
    this.setState({pwd_color: color});
  }

  componentDidMount(){
    this.props.getInviteEmail(this.props.params.id);
  }
    onSubmit(event)
    {
                event.preventDefault();
                if(isValidPhoneNumber(this.state.phone) == true){

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
                    if (pwdRef.value.length <= 6) {
                      alert('Length of password should be greater than 6');
                      pwdRef.value = c_pwdRef.value = ''
                    }
                    if (fnameRef.value && lnameRef.value && pwdRef.value && c_pwdRef.value && pwdRef.value != '' && c_pwdRef.value  != '' && emailRef.value  && cname.value && cdnameRef.value) {
                      var user = {
                        'firstname': fnameRef.value,
                        'lastname': lnameRef.value,
                        'email': emailRef.value,
                        'phone': this.state.phone,
                        'password': pwdRef.value,
                        'companyName': cname.value,
                        'website': cdnameRef.value,
                        'token' : tokenref.value
                      }
                      //console.log(user);

                       this.props.signupuser(user)
                     // fnameRef.value = lnameRef.value = pwdRef.value = c_pwdRef.value = emailRef.value = phoneRef.value = cname.value = cdnameRef.value = '';
                    }
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
                          <SideBar isAdmin ="no"/>
                          <div className="col-md-9 col-sm-9">
                            <h1>Join Company</h1>
                            <div className="content-form-page">
                                <div className ="row">
                                  <div className ="col-md-7 col-sm-7">
                                      <span> * required to fill these field </span><br/>
                                      {this.props.inviteDetails &&
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
                                                
                                                <input type="email"  className="form-control input-medium"  value = {this.props.inviteDetails.email} ref = "email" required placeholder="Email Address"/>

                                                <input type="hidden"  className="form-control input-medium" ref = "token" value = {this.props.inviteDetails.token}/>
                                            
                                              </div>
                                              <div className="form-group">
                                                <label>Password *</label>
                                                <input type="password" className="form-control input-medium" ref="pwd" onChange={this.handlePwdChange} placeholder="Password" required placeholder="Password"/>
                                                <div> Strength: {this.state.strength}</div>
                                                <div> <Progress completed={this.state.pwdBar} color={this.state.pwd_color} /> </div>
                                              </div>
                                              <div className="form-group">
                                              <label>Confirm Password *</label>
                                              <input type="password" className="form-control input-medium" ref="c_pwd" placeholder="Confirm Password" required/>
                                              </div>

                                              <div className="form-group">
                                              <label>Phone *</label>
                                              <Phone  placeholder="Enter phone number"
                                                       value={ this.state.phone }
                                                       onChange={ phone => this.setState({ phone }) } />

                                              {
                                                (this.state.phone != '') ?
                                                      ( String(isValidPhoneNumber(this.state.phone)) == 'false'?
                                              <p style={{'color':'red'}}> Not a valid number</p>
                                                      :<p></p> ) : <p></p>
                                              
                                              }
                                              </div>
                                              <div className="form-group">
                                              <label>Company Name *</label>
                                              <input type="text" className="form-control input-medium" ref="cname" required placeholder="Company Name" value = {this.props.inviteDetails.companyName}/>
                                              </div>
                                              <div className="form-group">
                                              <label>Company Domain Name *</label>
                                              <input type="text" className="form-control" ref="cdname" required placeholder="Domain Name" value = {this.props.inviteDetails.website}/>
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
                                                {
                                                this.props.signupwarnings && this.props.signupwarnings.statusCode == 200 &&
                                                  this.props.signupwarnings.validationErrs.map(function (err, i) {
                                                      return(
                                                        <div className = "alert alert-success"><span>{err} .Please goto <Link to = '/login'>Login Page </Link></span></div>
                                                      )
                                                    }
                                                  )

                                            }

                                  </form>
                                    }

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
  //console.log('mapStateToProps function called');
  //console.log(state.signup.signupwarnings);
  return {
    signupwarnings: (state.signup.signupwarnings),
    inviteDetails :state.signup.inviteDetails,

  }
  ;
}

export default connect(mapStateToProps, { signupuser,getInviteEmail })(JoinCompany);
