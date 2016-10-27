import TeamListItem from './TeamListItem';
import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {getuserteams} from '../../redux/actions/actions'
import {createteam} from '../../redux/actions/actions'
import {deleteteam,getcustomers} from '../../redux/actions/actions'

import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import TeamCreateView from './TeamCreateView';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router'

class Teams extends Component {

 constructor(props, context) {
      //call action to get user teams 
    if(props.userdetails.accountVerified == "No"){
    browserHistory.push('/notverified');
   }
   
    const usertoken = auth.getToken();
     console.log('componentWillMount is called');
    if(usertoken != null)
    {
       
        console.log(usertoken);
        props.getuserteams(usertoken);
        props.getcustomers(usertoken);
      }
      
        super(props, context);
  
    this.state = {
      showAddTeam: false,
    };

    this.handleClick = this.handleClick.bind(this);
    this.add = this.add.bind(this);
  
    
  }

   handleClick(e) {

      this.setState({
      showAddTeam: !this.state.showAddTeam,
      });
      e.preventDefault();
  }

  add(name,description) {
     const usertoken = auth.getToken();
     if(this.props.customers){
        this.props.createteam({ name,description,usertoken },this.props.customers.filter((c) => c.isMobileClient == "true"));
      }
      else{
        alert('Customers data not found!Please refresh this page');
      }
     this.setState({
      showAddTeam: false,
    });
 }
 

  render() {
    const token = auth.getToken()
    console.log(token)
    
    return (
      <div>
       <AuthorizedHeader name = {this.props.userdetails.firstname} user={this.props.userdetails}/>
    
       <div className="page-container">

         <SideBar isAdmin ={this.props.userdetails.isAdmin}/> 
          <div className="page-content-wrapper">
            <div className="page-content"> 
              <h3 className ="page-title">Team Management </h3>
                 <ul className="page-breadcrumb breadcrumb">
                  <li>
                    <i className="fa fa-home"/>
                    <Link to="/dashboard"> Dashboard </Link>
                    <i className="fa fa-angle-right"/> 
                  </li>                  
                  <li>
                               <Link to="/teams">Team Management </Link>
                  </li>               
  
            </ul>
            <div className="portlet box grey-cascade">
              <div className="portlet-title">
                <div className="caption">
                    <i className="fa fa-group"/>
                    Teams
                </div> 
              </div>    
          <div className="portlet-body">
             <div className="table-toolbar">
                 <div className="btn-team">
                 { this.props.userdetails.isAdmin == "Yes" ?
         
                    <button id="sample_editable_1_new" className="btn green" onClick={this.handleClick}> Create New Team
                   
                    <i className="fa fa-plus"/>
                    </button>
                 :<br/>
               }
                 </div>
              </div>
               {this.props.errorMessage &&

                     <div className = "alert alert-success"><span>{this.props.errorMessage}</span></div>
                      }
              <TeamCreateView addTeam={this.add}  showAddTeam= {this.state.showAddTeam}/>      
                { this.props.teamdetails && this.props.customers &&
                   <table id ="sample_3" className="table table-striped table-bordered table-hover dataTable">
                   <thead>
                    <tr>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Name </th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Description </th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Created By</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Created On</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' > Options</th>
                    </tr>
                    </thead>
                    <tbody>                    
                      {

                        this.props.teamdetails.map((team, i) => (
                          
                          <TeamListItem team={team} key={team._id}   onDelete={() => this.props.deleteteam(team,token,this.props.customers.filter((c) => c.isMobileClient == "true"))} userdetails ={this.props.userdetails}/>
                                                      
                        ))
                      }
                     </tbody> 
                    </table>
                }
        
                
            </div>
          </div>
       </div>
       </div> 
      </div>
      </div> 
  )
  }
}

Teams.propTypes = {

  errorMessage: PropTypes.string,
}
function mapStateToProps(state) {
  console.log("mapStateToProps is called");
  console.log(state.dashboard.userdetails);
  console.log(state.dashboard.teamdetails);
  console.log(state.dashboard.errorMessage);

  return {
          teamdetails:(state.dashboard.teamdetails),
          userdetails:(state.dashboard.userdetails),
          errorMessage:(state.dashboard.errorMessage),
          agents:(state.dashboard.agents),
          deptagents:(state.dashboard.deptagents),
          channels :(state.dashboard.channels),
          customers: (state.dashboard.customers),
           };
}


function mapDispatchToProps(dispatch) {
  
  return bindActionCreators({ deleteteam:deleteteam,getcustomers:getcustomers,getuserteams:getuserteams,createteam:createteam }, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(Teams);
