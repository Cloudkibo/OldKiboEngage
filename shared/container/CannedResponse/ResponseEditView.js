import React, { Component, PropTypes } from 'react';
import auth from '../../services/auth';
import { getResponseRequest}  from '../../redux/actions/actions'
import { editResponse}  from '../../redux/actions/actions'
import { connect } from 'react-redux';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import { Link } from 'react-router';



class ResponseEditView extends Component {
  constructor(props, context) {
       //call action to get user groups 
    const usertoken = auth.getToken();
     console.log('constructor is called');
    if(usertoken != null)
     {
       
        console.log(usertoken);
        console.log(props.params.id);
        props.getResponseRequest(props.params.id,usertoken);
      }

    super(props, context);
    
    this.editResponse = this.editResponse.bind(this);
  }

 

  editResponse(e) {
     e.preventDefault();
    const usertoken = auth.getToken();
    const idRef = this.refs.id;
    const shortcode = this.refs.shortcode;
    const msg = this.refs.msg;
    const companyid = this.refs.companyid;
   
    if (shortcode.value &&  msg.value)
     {
      var response = {'_id' : idRef.value,'shortcode' : "/" + shortcode.value,'message':msg.value,'companyid' : companyid.value}
      console.log(response);
      this.props.editResponse(response,usertoken);
     
    }
  }

  render() {
       var ag = []
     {
         this.props.response &&
                        this.props.response.map((ch, i) => (
                           ag.push(ch)                            
                        ))

      }
    return (
      <div>

       <div className="page-container">
         <SideBar/> 
          <div className="page-content-wrapper">
            <div className="page-content"> 
              <h3 className ="page-title">Canned Response Management </h3>
            <ul className="page-breadcrumb breadcrumb">
                  <li>
                    <i className="fa fa-home"/>
                    <Link to="/dashboard"> Dashboard </Link>
                    <i className="fa fa-angle-right"/> 
                  </li>                  
                  <li>
                               <Link to="cannedresponses"> Canned Response Management</Link>
                  </li>               
  
            </ul>
                {this.props.errorMessage &&

                     <div className = "alert alert-danger"><span>{this.props.errorMessage}</span></div>
                      }
         
             {this.props.response &&
            <div className="portlet box grey-cascade">
              <div className="portlet-title">
                <div className="caption">
                    <i className="fa fa-group"/>
                   Edit Canned Response
                </div> 
              </div>    
        
           <div className="portlet-body form">
            <form className="form-horizontal form-row-seperated">
              <div className="form-body">
                <div className="form-group">
                  <label className="control-label col-md-3"> Name </label>
                   <div className="col-md-9">
                     <div className="input-group">
                      <span className="input-group-addon">
                            /
                      </span>
                      <input className="form-control" type='text'     defaultValue={ag[0].shortcode.substr(1,ag[0].shortcode.length-1)} ref = "shortcode"/>
                         <input className="form-control" type='hidden'   value = {ag[0]._id} ref = "id"/>
                         <input className="form-control" type='hidden'   value = {ag[0].companyid} ref = "companyid"/>
                    </div>

                   </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-md-3"> Response Text </label>
                  <div className="col-md-9">
                         <textarea className="form-control" type='text' rows='4' ref = "msg" defaultValue = {ag[0].message}/>
                   </div>
                   </div> 
              
              <div className="form-actions fluid">
              <div className="row">
                <div className="col-md-3">
                  <div className="col-md-offset-9 col-md-9">
                    <button className="btn green" onClick={this.editResponse}>
                      <i className="fa fa-pencil"/>
                       Submit
                    </button>

                    </div>
               </div> 
                <div className="col-md-9">
                  <div className="col-md-9">
                    <Link to="/cannedresponses" className="btn green">
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

ResponseEditView.propTypes = {
  editResponse : PropTypes.func.isRequired,
  
};
function mapStateToProps(state) {
  console.log("mapStateToProps is called");
  console.log(state.dashboard.response);
  
   return {
    
    group: (state.dashboard.group),
    channels:(state.dashboard.channels),
    deptagents:(state.dashboard.deptagents),
    channel :(state.dashboard.channel),
    response :(state.dashboard.response),
    groupdetails:(state.dashboard.groupdetails),
    errorMessage:(state.dashboard.errorMessage),
   agents:(state.dashboard.agents),
    deptagents:(state.dashboard.deptagents),
  };
}
export default connect(mapStateToProps,{ getResponseRequest,editResponse})(ResponseEditView);


