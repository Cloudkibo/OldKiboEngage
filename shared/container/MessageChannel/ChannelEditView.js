import React, { Component, PropTypes } from 'react';
import auth from '../../services/auth';
import { getChannelRequest}  from '../../redux/actions/actions'
import { editChannel}  from '../../redux/actions/actions'
import { connect } from 'react-redux';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import { Link } from 'react-router';



class ChannelEditView extends Component {
  constructor(props, context) {
       //call action to get user groups 
    const usertoken = auth.getToken();
     console.log('constructor is called');
    if(usertoken != null)
     {
       
        console.log(usertoken);
        console.log(props.params.id);
        props.getChannelRequest(props.params.id,usertoken);
      }

    super(props, context);
    
    this.editChannel = this.editChannel.bind(this);
  }

 

  editChannel() {
    const usertoken = auth.getToken();
    const idRef = this.refs.id;
    const name = this.refs.name;
    const desc = this.refs.desc;
    const status = this.refs.status;
    const groupid = this.refs.groupid;
    const companyid = this.refs.companyid;
    const createdby = this.refs.createdby;

    if (name.value && desc.value && groupid.value)
     {
      var channel = {'_id' : idRef.value,'msg_channel_name' : name.value,'msg_channel_description':desc.value,'companyid' : companyid.value,'groupid' : groupid.value,'createdby' : createdby.value,'activeStatus':status.value}
      console.log(channel);
      this.props.editChannel(channel,usertoken);
     
    }
  }

    handleChange(e){
      const status =  this.refs.status;
      status.value =  e.target.value;
   
    }

    
  render() {
       var ag = []
     {
         this.props.channel &&
                        this.props.channel.map((ch, i) => (
                           ag.push(ch)                            
                        ))

      }
    return (
      <div>

       <div className="page-container">
         <SideBar/> 
          <div className="page-content-wrapper">
            <div className="page-content"> 
              <h3 className ="page-title">MessageChannels Management </h3>
            <ul className="page-breadcrumb breadcrumb">
                  <li>
                    <i className="fa fa-home"/>
                    <Link to="/dashboard"> Dashboard </Link>
                    <i className="fa fa-angle-right"/> 
                  </li>                  
                  <li>
                               <Link to="/messagechannels"> MessageChannels Management</Link>
                  </li>               
  
            </ul>
                {this.props.errorMessage &&

                     <div className = "alert alert-danger"><span>{this.props.errorMessage}</span></div>
                      }
         
             {this.props.channel &&
            <div className="portlet box grey-cascade">
              <div className="portlet-title">
                <div className="caption">
                    <i className="fa fa-group"/>
                   Edit Message Channel Details
                </div> 
              </div>    
        
           <div className="portlet-body form">
            <form className="form-horizontal form-row-seperated">
              <div className="form-body">
                <div className="form-group">
                  <label className="control-label col-md-3"> Name </label>
                   <div className="col-md-9">
                         <input className="form-control" type='text'     defaultValue={ag[0].msg_channel_name} ref = "name"/>
                         <input className="form-control" type='hidden'   value = {ag[0]._id} ref = "id"/>
                         <input className="form-control" type='hidden'   value = {ag[0].companyid} ref = "companyid"/>
                         <input className="form-control" type='hidden'   value = {ag[0].groupid} ref = "groupid"/>
                         <input className="form-control" type='hidden'   value = {ag[0].createdby} ref = "createdby"/>
            

                   </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-md-3"> Description </label>
                  <div className="col-md-9">
                         <textarea className="form-control" type='text' rows='4' ref = "desc" defaultValue = {ag[0].msg_channel_description}/>
                   </div>
                   </div> 
                 <div className="form-group">
                  <label className="control-label col-md-3"> Active </label>
                  <div className="col-md-9">   
                        <select  ref = "status" defaultValue ={ag[0].activeStatus} onChange={this.handleChange.bind(this)}   >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>

                      </div>
                </div>
            
              <div className="form-actions fluid">
              <div className="row">
                <div className="col-md-3">
                  <div className="col-md-offset-9 col-md-9">
                    <button className="btn green" onClick={this.editChannel}>
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
        }

       </div>
       </div> 
      </div>
      </div> 
      )                   
     }
}

ChannelEditView.propTypes = {
  editChannel : PropTypes.func.isRequired,
  
};
function mapStateToProps(state) {
  console.log("mapStateToProps is called");
  console.log(state.dashboard.channel);
  
   return {
    
    group: (state.dashboard.group),
    channels:(state.dashboard.channels),
    deptagents:(state.dashboard.deptagents),
    channel :(state.dashboard.channel),
    groupdetails:(state.dashboard.groupdetails),
    errorMessage:(state.dashboard.errorMessage),
  };
}
export default connect(mapStateToProps,{ getChannelRequest,editChannel})(ChannelEditView);


