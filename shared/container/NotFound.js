import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer.jsx';
import SideBar from '../components/Header/SideBar';
import SideBarr from '../components/SideBar/SideBar.jsx';
import AuthorizedHeader from '../components/Header/AuthorizedHeader';

import auth from '../services/auth';
class NotFound extends Component {

 constructor(props, context) {
    super(props, context);
    
    
  }
  render() {
    const token = auth.getToken()
    if(token)
    {
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
 else{
        return (
          <div  className="pageContainer">
                     <Header/>
                        <div className = "mainBody">
                            <div className ="row margin-bottom-40">
                              <SideBarr/>
                               <div className="col-md-9 col-sm-9"> 
                                    <h1>404 : Page Not Found</h1>
                                      
                                </div>
                              
                            </div>
                        </div>
                        </div> 
        )
 }
  

}
}



function mapStateToProps(state) {
  
  return {
  userdetails:(state.dashboard.userdetails),
  agents:(state.dashboard.agents),
  deptagents:(state.dashboard.deptagents),
  groupdetails:(state.dashboard.groupdetails),
   }
}

export default connect(mapStateToProps)(NotFound);

