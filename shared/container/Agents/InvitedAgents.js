import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import InviteAgentListItem from './InviteAgentListItem';
import {getinvitedagents} from '../../redux/actions/actions'
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router'

class InvitedAgents extends Component {

 constructor(props, context) {
      //call action to get user groups 
    if(props.userdetails.accountVerified == "No"){
    browserHistory.push('/notverified');
   }
   
    const usertoken = auth.getToken();
    console.log('constructor is called');
    if(usertoken != null)
    {
       
        console.log(usertoken);
      //  props.getsessions(usertoken);
        props.getinvitedagents(usertoken);
       
      }
    super(props, context);
   
    
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
              <h3 className ="page-title">Invited Support Agents </h3>
            <ul className="page-breadcrumb breadcrumb">
                  <li>
                    <i className="fa fa-home"/>
                    <Link to="/dashboard"> Dashboard </Link>
                    <i className="fa fa-angle-right"/> 
                  </li>                  
                  <li>
                               <Link to="/agents">Agents</Link>
                  </li>               
  
            </ul>
            <div className="portlet box grey-cascade">
              <div className="portlet-title">
                <div className="caption">
                    <i className="fa fa-user"/>
                  Invited Agents
                </div> 
              </div>    
        
           <div className="portlet-body">
            
             { this.props.invitedagents &&
                   <table id ="sample_3" className="table table-striped table-bordered table-hover dataTable">
                   <thead>
                    <tr>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Email</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Invitation URL</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Date</th>
                    
                    </tr>
                    </thead>

                    <tbody>                    
                      {
                        this.props.invitedagents && 
                           this.props.invitedagents.map((invitee, i) => (
                          
                          <InviteAgentListItem invitee={invitee} key={invitee._id} />
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

InvitedAgents.propTypes = {

  errorMessage: PropTypes.string,
}
function mapStateToProps(state) {
  console.log("mapStateToProps is called");
  return {
          subgroups:(state.dashboard.subgroups),
          userdetails:(state.dashboard.userdetails),
          groupdetails :(state.dashboard.groupdetails),
          errorMessage:(state.dashboard.errorMessage),
          responses :(state.dashboard.responses),
          agents:(state.dashboard.agents),
          deptagents:(state.dashboard.deptagents),
          resolvedsessions :(state.dashboard.resolvedsessions),
          customers:(state.dashboard.customers),
          invitedagents:(state.dashboard.invitedagents),
           };

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({getinvitedagents:getinvitedagents}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(InvitedAgents);



