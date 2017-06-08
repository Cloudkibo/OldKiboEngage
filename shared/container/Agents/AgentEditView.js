import React, { Component, PropTypes } from 'react';
import auth from '../../services/auth';
import { getAgentRequest}  from '../../redux/actions/actions'
import { editAgent}  from '../../redux/actions/actions'
import { connect } from 'react-redux';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import { Link } from 'react-router';



class AgentEditView extends Component {
  constructor(props, context) {
       //call action to get user teams 
   
    super(props, context);
    
    this.editAgent = this.editAgent.bind(this);
  }

  componentWillMount(){
     const usertoken = auth.getToken();
     //console.log('constructor is called');
    if(usertoken != null)
     {
       
        //console.log(usertoken);
        //console.log(this.props.params.id);
        this.props.getAgentRequest(this.props.params.id,usertoken);
      }

  }

  editAgent(e) {
     e.preventDefault();
    const usertoken = auth.getToken();
    
    const idRef = this.refs.id;
   const roleRef = this.refs.role;
   if(idRef.value == this.props.userdetails._id){
    alert("You cannot change your own role.");

   }

   else if(idRef.value && roleRef.value) {
      this.props.editAgent(idRef.value,roleRef.value,usertoken);
     
    }
  }

    handleChange(e){
      const roleRef =  this.refs.role;
      roleRef.value =  e.target.value;
   
    }

    
  render() {
    var ag = []
     {
         this.props.agent &&
                        this.props.agent.map((agent, i) => (
                           ag.push(agent)                            
                        ))

      }  
      var role;
      if(ag.length >= 1){

      if(ag[0].isAgent == "Yes"){
        role = "agent";
      }
      else if(ag[0].isAdmin == "Yes"){
          role = "admin"
      }
      else
      {
        role = "supervisor"
      }
    }
    return (

      <div className="vbox viewport">
       <AuthorizedHeader name = {this.props.userdetails.firstname} user={this.props.userdetails}/>
       <div className="page-container hbox space-between">

         <SideBar isAdmin ={this.props.userdetails.isAdmin}/> 
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
                {this.props.errorMessage &&

                     <div className = "alert alert-danger"><span>{this.props.errorMessage}</span></div>
                      }
         
             {this.props.agent &&
            <div className="portlet box grey-cascade">
              <div className="portlet-title">
                <div className="caption">
                    <i className="fa fa-group"/>
                   Update Agent Role 
                </div> 
              </div>    
        
           <div className="portlet-body form">
            <form className="form-horizontal form-row-seperated">
              <div className="form-body">
                <div className="form-group">
                  <label className="control-label col-md-3"> Name </label>
                   <div className="col-md-9">
                         <input className="form-control" type='text' value={ag[0].firstname + ' '+ ag[0].lastname} ref = "name"/>
                         <input className="form-control" type='hidden'   value = {ag[0]._id} ref = "id"/>
            

                   </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-md-3"> Role </label>
                  <div className="col-md-9">
                    <input className="form-control input-medium" type='text' defaultValue = {role} disabled ref = "role"/>
                   </div>
                   </div> 
                 <div className="form-group">
                  <label className="control-label col-md-3"> Change Role </label>
                  <div className="col-md-9">   
                        <select  ref = "roles" onChange={this.handleChange.bind(this)}   >
                          <option value="Agent">Agent</option>
                          <option value="Admin">Admin</option>
                          <option value="Supervisor">Supervisor</option>
                        </select>

                      </div>
                </div>
            
              <div className="form-actions fluid">
              <div className="row">
                <div className="col-md-3">
                  <div className="col-md-offset-9 col-md-9">
                    <button className="btn green" onClick={this.editAgent}>
                      <i className="fa fa-pencil"/>
                       Submit
                    </button>

                    </div>
               </div> 
                <div className="col-md-9">
                  <div className="col-md-9">
                    <Link to="/agents" className="btn green">
                      <i className="fa fa-times"/>
                       Back
                    </Link>
                    
                    </div>
               </div>
               </div>                 
              </div>
              </div>  
              
          </form>

                  
          
          </div>
          </div>
        }

       </div>
       </div> 
      </div>
      </div> 
      )                   
     }
}

AgentEditView.propTypes = {
  editAgent : PropTypes.func.isRequired,
  
};
function mapStateToProps(state) {
  //console.log("mapStateToProps is called");
  //console.log(state.dashboard.agent);
  
   return {
    
    team: (state.dashboard.team),
    agents:(state.dashboard.agents),
    deptagents:(state.dashboard.deptagents),
    agent :(state.dashboard.agent),
    errorMessage:(state.dashboard.errorMessage),
    channels :(state.dashboard.channels),
    userdetails:(state.dashboard.userdetails),
  };
}
export default connect(mapStateToProps,{ getAgentRequest,editAgent})(AgentEditView);


