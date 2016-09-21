import React, { Component, PropTypes } from 'react';
import auth from '../../services/auth';
import {createChannel}  from '../../redux/actions/actions'
import { connect } from 'react-redux';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import { Link } from 'react-router';



class MessageChannelCreate extends Component {
  constructor(props, context) {
       //call action to get user teams 
    const usertoken = auth.getToken();
    console.log('constructor is called');
    super(props, context);
    
    this.createmessageChannel = this.createmessageChannel.bind(this);
  }

 

  createmessageChannel(e) {
     e.preventDefault();
    const usertoken = auth.getToken();
    const nameRef = this.refs.name;
    const descRef = this.refs.desc;
    const teamid = this.refs.teamid;
    var companyid;
    var createdBy = this.props.userdetails._id;

    for(var j = 0;j<this.props.teamdetails.length;j++)
    {
      if(this.props.teamdetails[j]._id == teamid.value)
      {
         companyid = this.props.teamdetails[j].companyid;
          break;
      }
    }

    if (nameRef.value && descRef.value && teamid.value)
     {
      var channel = {'msg_channel_name' : nameRef.value,'msg_channel_description':descRef.value,'companyid' : companyid,'teamid' : teamid.value,'createdby' : createdBy}
      console.log(channel);
      this.props.createChannel(channel,usertoken);
     
    }
  }
  handleChange(e){
      const teamidRef =  this.refs.teamid;
      teamidRef.value =  e.target.value;
   
    }
    
    
  render() {
    return (
      <div>

       <div className="page-container">
         <SideBar/> 
          <div className="page-content-wrapper">
            <div className="page-content"> 
              <h3 className ="page-title">Message Channels Management </h3>
            <ul className="page-breadcrumb breadcrumb">
                  <li>
                    <i className="fa fa-home"/>
                    <Link to="/dashboard"> Dashboard </Link>
                    <i className="fa fa-angle-right"/> 
                  </li>                  
                  <li>
                               <Link to="/messagechannel"> Message Channels Management</Link>
                  </li>               
  
            </ul>
                {this.props.errorMessage &&

                     <div className = "alert alert-danger"><span>{this.props.errorMessage}</span></div>
                      }
         
            
            <div className="portlet box grey-cascade">
              <div className="portlet-title">
                <div className="caption">
                    <i className="fa fa-group"/>
                   Create Message Channel
                </div> 
              </div>    
        
           <div className="portlet-body form">
            <form className="form-horizontal form-row-seperated">
              <div className="form-body">
                <div className="form-group">
                  <label className="control-label col-md-3"> Channel Name </label>
                   <div className="col-md-9">
                         <input className="form-control input-medium" type='text'  ref = "name"/>
                

                   </div>
                </div>

                 <div className="form-group">
                  <label className="control-label col-md-3"> Description </label>
                   <div className="col-md-9">
                         <textarea className="form-control" type='text' rows='4' ref="desc"/>
                   </div>
                </div>
                 <div className="form-group">
                  <label className="control-label col-md-3"> Select Team </label>
                  <div className="col-md-9">   
                  {
                        <select  ref = "teamid" onChange={this.handleChange.bind(this)}   >
                          {
                           this.props.teamdetails &&
                        
                           this.props.teamdetails.map((team, i) => (
                          
                          <option value={team._id} key={team._id}> {team.deptname}</option>
                                                      
                        ))
                        }
                        </select>
                    }
                      </div>
                </div>
            
              <div className="form-actions fluid">
              <div className="row">
                <div className="col-md-3">
                  <div className="col-md-offset-9 col-md-9">
                    <button className="btn green" onClick={this.createmessageChannel}>
                      <i className="fa fa-pencil"/>
                       Submit
                    </button>

                    </div>
               </div> 
                <div className="col-md-9">
                  <div className="col-md-9">
                    <Link to="/messagechannels" className="btn green">
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
        

       </div>
       </div> 
      </div>
      </div> 
      )                   
     }
}


function mapStateToProps(state) {
  console.log("mapStateToProps is called");
  console.log(state.dashboard.agent);
  
   return {
    teamdetails:(state.dashboard.teamdetails),
    userdetails:(state.dashboard.userdetails),
    errorMessage:(state.dashboard.errorMessage),
    agents:(state.dashboard.agents),
    deptagents:(state.dashboard.deptagents),
    channels :(state.dashboard.channels),
};
}
export default connect(mapStateToProps,{createChannel})(MessageChannelCreate);


