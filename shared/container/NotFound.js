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
              <div className="vbox viewport">
                 <AuthorizedHeader className= "headerclass" name = {this.props.userdetails.firstname} user={this.props.userdetails}/>
                 <div className="page-container hbox space-between">
                    <SideBar isAdmin ={this.props.userdetails.isAdmin}/> 
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
  teamdetails:(state.dashboard.teamdetails),
   }
}

export default connect(mapStateToProps)(NotFound);

