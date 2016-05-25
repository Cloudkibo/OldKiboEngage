import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AuthorizedHeader from '../components/Header/AuthorizedHeader';
import Footer from '../components/Footer/Footer.jsx';
import SideBar from '../components/Header/SideBar';
import auth from '../services/auth';
class NotFound extends Component {

 constructor(props, context) {
    super(props, context);
    
    
  }
  render() {
    return (
      <div>
        <AuthorizedHeader name = {this.props.userdetails.firstname} />
       <div className="page-container">
          <SideBar/> 
          <div className="page-content-wrapper">
            <div className="page-content"> 
                <h1>404 : Page Not Found</h1>
                  
            </div>
          </div>
       </div>
       </div> 
  )
  }
}




export default NotFound;
