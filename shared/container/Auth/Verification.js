import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer.jsx';
import SideBarr from '../../components/SideBar/SideBar.jsx';
import {verifyEmail} from '../../redux/actions/actions'
class Verification extends Component {

 constructor(props, context) {
    super(props, context);
    
    
  }
  componentDidMount(){
    this.props.verifyEmail(this.props.params.id);
  }
  render() {
        return (
          <div  className="pageContainer">
                     <Header/>
                        <div className = "mainBody">
                            <div className ="row margin-bottom-40">
                              <SideBarr/>
                               <div className="col-md-9 col-sm-9"> 
                                    <h1>Account verified!</h1>
                                     <div className="content-form-page">
                                        <div className ="row">
                                          <div className ="col-md-7 col-sm-7">
                                            <p>Thank you for verifying your email address. You can now login to your account.</p>
                                              <br/>
                                              <br/>
                                              <br/>
                                              <Link to="/login" className='btn-password btn btn-send'>
                                               Go to Login Page
                                              </Link>
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
  console.log('mapStateToProps function called');
  
  return {
   
  }
  ;
}
export default connect(mapStateToProps,{verifyEmail })(Verification);


