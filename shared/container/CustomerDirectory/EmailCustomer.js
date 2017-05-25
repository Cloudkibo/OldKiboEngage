import React, { Component, PropTypes } from 'react';
import auth from '../../services/auth';
import { getCustomerRequest}  from '../../redux/actions/actions'
import {emailCustomer}  from '../../redux/actions/actions'
import { connect } from 'react-redux';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import { Link } from 'react-router';
import { browserHistory } from 'react-router'
import { bindActionCreators } from 'redux';



class EmailCustomer extends Component {
  constructor(props, context) {
       //call action to get user teams 
    const usertoken = auth.getToken();
    console.log('constructor is called');
   
    if(usertoken != null)
     {
       
        
        console.log(props.params.id);
        props.getCustomerRequest(props.params.id);
      }
       super(props, context);
    this.emailcustomer = this.emailcustomer.bind(this);
  }

 

  emailcustomer(e) {  
    e.preventDefault();
    const usertoken = auth.getToken();
    const name= this.refs.name;
    const emailAdd= this.refs.emailAdd;
    
    const subject= this.refs.subject;
    const body = this.refs.body;
    var companyid = this.props.userdetails.uniqueid;

    if (subject.value && body.value && companyid)
     {
      var emailMsg = {'to':name.value,'emailAdd':emailAdd.value,'subject' : subject.value,'body':body.value,'from' : this.props.userdetails.firstname + ' ' + this.props.userdetails.lastname }
      this.props.emailCustomer({emailMsg,usertoken});
     
    }

  }
    
  render() {
   
      var ag = []
     {
         this.props.customer &&
                        this.props.customer.map((ch, i) => (
                           ag.push(ch)                            
                        ))

      }
    
    return (

      <div className="vbox viewport">

       <div className="page-container hbox space-between">
         <SideBar/> 
          <div className="page-content-wrapper">
            <div className="page-content"> 
              <h3 className ="page-title">Customer Directory Management </h3>
            <ul className="page-breadcrumb breadcrumb">
                  <li>
                    <i className="fa fa-home"/>
                    <Link to="/dashboard"> Dashboard </Link>
                    <i className="fa fa-angle-right"/> 
                  </li>                  
                  <li>
                               <Link to="/customers">Customer Directory Management</Link>
                  </li>               
  
            </ul>
               
         
            
            <div className="portlet box grey-cascade">
              <div className="portlet-title">
                <div className="caption">
                    <i className="fa fa-envelope"/>
                   Send Email
                </div> 
              </div>    
        
           <div className="portlet-body form">
          
            <form className="form-horizontal form-row-seperated">
             {
            this.props.customer &&
              <div className="form-body">
                <div className="form-group">
                  <label className="control-label col-md-3"> To </label>
                   <div className="col-md-9">
                         <input className="form-control input-medium" type='text'  ref = "name" disabled value={ag[0].name} />
                   </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-md-3"> Email Address </label>
                   <div className="col-md-9">
                         <input className="form-control input-medium" type='text'  ref = "emailAdd" disabled value={ag[0].email} />
                   </div>
                </div>
                 <div className="form-group">
                  <label className="control-label col-md-3"> Subject </label>
                   <div className="col-md-9">
                         <input className="form-control input-medium" type='text'  ref = "subject"  />
                   </div>
                </div>

                 <div className="form-group">
                  <label className="control-label col-md-3"> Body</label>
                   <div className="col-md-9">
                         <textarea className="form-control" type='text' rows='4' ref="body" placeholder="Write Email here..."/>
                   </div>
                </div>

              
              <div className="form-actions fluid">
              <div className="row">
                <div className="col-md-3">
                  <div className="col-md-offset-9 col-md-9">
                    <button className="btn green" onClick={this.emailcustomer}>
                      <i className="fa fa-pencil"/>
                       Submit
                    </button>

                    </div>
               </div> 
                <div className="col-md-9">
                  <div className="col-md-9">
                    <Link to="/customers" className="btn green">
                      <i className="fa fa-times"/>
                       Back
                    </Link>
                    
                    </div>
               </div>
               </div>                 
              </div>
              </div>  
              }
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
  
   return {
    channels:(state.dashboard.channels),
    userdetails:(state.dashboard.userdetails),
    teamdetails :(state.dashboard.teamdetails),
    errorMessage:(state.dashboard.errorMessage),
    notifications:(state.dashboard.notifications),
    agents:(state.dashboard.agents),
    deptagents:(state.dashboard.deptagents),
    addednotification :(state.dashboard.addednotification),
    customers:(state.dashboard.customers),
    customer:(state.dashboard.customer),

  };
}

function mapDispatchToProps(dispatch) {
  
  return bindActionCreators({emailCustomer:emailCustomer,getCustomerRequest:getCustomerRequest}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(EmailCustomer);


