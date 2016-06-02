import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import AgentListItem from './AgentListItem';
import InviteAgent from './InviteAgent';
import {inviteagent} from '../../redux/actions/actions'

import {deleteagent} from '../../redux/actions/actions'
import { bindActionCreators } from 'redux';

class Agents extends Component {

 constructor(props, context) {
      //call action to get user groups 
    const usertoken = auth.getToken();
    console.log('constructor is called');
    super(props, context);
    this.state = {
      showInviteAgent :  false,
    };

    this.handleClick = this.handleClick.bind(this);
    this.cancelInvite = this.cancelInvite.bind(this);
    this.add = this.add.bind(this);

    
  }


  add(email) {
     const usertoken = auth.getToken();
    this.props.inviteagent( email,usertoken);
     this.setState({
      showInviteAgent: false,
    });
 }
   handleClick(e) {

      this.setState({
      showInviteAgent: !this.state.showInviteAgent,
      });
      e.preventDefault();
  }
  cancelInvite(e){

      this.setState({
      showInviteAgent: false,
      });
      e.preventDefault();
  }
  

  render() {
    console.log(this.props.userdetails.firstname)
    const token = auth.getToken()
    console.log(token)
    console.log(this.props.agents);
    return (
      <div>
       <AuthorizedHeader name = {this.props.userdetails.firstname} />
    
       <div className="page-container">
         <SideBar/> 
          <div className="page-content-wrapper">
            <div className="page-content"> 
              <h3 className ="page-title">Agents Management </h3>
            <ul className="page-breadcrumb breadcrumb">
                  <li>
                    <i className="fa fa-home"/>
                    <Link to="/dashboard"> Dashboard </Link>
                    <i className="fa fa-angle-right"/> 
                  </li>                  
                  <li>
                               <Link to="/agents"> Agents Management</Link>
                  </li>               
  
            </ul>
            <div className="portlet box grey-cascade">
              <div className="portlet-title">
                <div className="caption">
                    <i className="fa fa-user"/>
                   Agents
                </div> 
              </div>    
        
           <div className="portlet-body">
             <div className="table-toolbar">
                 <div className="btn-group">
                    <button id="sample_editable_1_new" className="btn green" onClick={this.handleClick}> Invite Agent
                    <i className="fa fa-plus"/>
                    </button>
                 </div>
              </div>
               {this.props.errorMessage &&

                     <div className = "alert alert-danger"><span>{this.props.errorMessage}</span></div>
                      }
               <InviteAgent inviteAgent={this.add}  cancelInvite = {this.cancelInvite} showInviteAgent= {this.state.showInviteAgent} companyid = {this.props.userdetails.uniqueid} website = {this.props.userdetails.website}/>      
                   
                { this.props.agents &&
                   <table id ="sample_3" className="table table-striped table-bordered table-hover dataTable">
                   <thead>
                    <tr>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Name </th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Email </th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Joined</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Role</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' > Options</th>
                    </tr>
                    </thead>

                    <tbody>                    
                      {
                        this.props.agents.map((agent, i) => (
                          
                          <AgentListItem agent={agent} key={agent._id}  onDelete={() => this.props.deleteagent(agent,token)}/>
                                                      
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

Agents.propTypes = {

  errorMessage: PropTypes.string,
}
function mapStateToProps(state) {
  console.log("mapStateToProps is called");
  console.log(state.dashboard.userdetails);
  console.log(state.dashboard.agents);
  console.log(state.dashboard.errorMessage);

  return {
          agents:(state.dashboard.agents),
          userdetails:(state.dashboard.userdetails),
          errorMessage:(state.dashboard.errorMessage),
          agent :(state.dashboard.agent),
          deptagents:(state.dashboard.deptagents),
    

           };
}

function mapDispatchToProps(dispatch) {
  // Whenever selectBook is called, the result shoudl be passed
  // to all of our reducers
  return bindActionCreators({ deleteagent:deleteagent,inviteagent:inviteagent}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(Agents);



