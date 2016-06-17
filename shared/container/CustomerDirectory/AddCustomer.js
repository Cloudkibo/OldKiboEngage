import React, { Component, PropTypes } from 'react';
import auth from '../../services/auth';
import {createcustomer}  from '../../redux/actions/actions'
import { connect } from 'react-redux';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import { Link } from 'react-router';
import { browserHistory } from 'react-router'



class AddCustomer extends Component {
   constructor(props, context) {
  
    super(props, context);
    
    this.addCustomers = this.addCustomers.bind(this);
  }

 

  addCustomers() {
    const name = this.refs.name;
    const email = this.refs.email;
    const country = this.refs.country;
    const phone = this.refs.phone;
    var companyid = this.props.params.id;

    if (name.value && email.value && companyid)
     {
      var customer = {'name' : name.value,'email':email.value,'country' : country.value,'phone' : phone.value,'companyid' : companyid,isMobileClient : 'false'}
      console.log(customer);
      this.props.createcustomer(customer);
     
    }
  }
    
  render() {
   
    return (

      <div>

       <div className="page-container">
          <div className="page-content-wrapper">
            <div className="page-content"> 
              <h3 className ="page-title">customer </h3>
           
                {this.props.errorMessage &&

                     <div className = "alert alert-danger"><span>{this.props.errorMessage}</span></div>
                      }
         
            
            <div className="portlet box grey-cascade">
              <div className="portlet-title">
                <div className="caption">
                    <i className="fa fa-user"/>
                   Create Customer
                </div> 
              </div>    
        
           <div className="portlet-body form">
            <form className="form-horizontal form-row-seperated">
              <div className="form-body">
                <div className="form-group">
                  <label className="control-label col-md-3"> Name </label>
                   <div className="col-md-9">
                         <input className="form-control input-medium" type='text'  ref = "name" />
                   </div>
                </div>

                 <div className="form-group">
                  <label className="control-label col-md-3"> Email</label>
                   <div className="col-md-9">
                            <input className="form-control input-medium" type='email'  ref = "email" />
                </div>
                </div>

                  <div className="form-group">
                  <label className="control-label col-md-3"> Country </label>
                   <div className="col-md-9">
                            <input className="form-control input-medium" type='text'  ref = "country" />
                </div>
                </div>
                  <div className="form-group">
                  <label className="control-label col-md-3"> Phone</label>
                   <div className="col-md-9">
                            <input className="form-control input-medium" type='text'  ref = "phone" />
                </div>
                </div>

              <div className="form-actions fluid">
              <div className="row">
                <div className="col-md-3">
                  <div className="col-md-offset-9 col-md-9">
                    <button className="btn green" onClick={this.addCustomers}>
                      <i className="fa fa-pencil"/>
                       Submit
                    </button>

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
  
   return {
    errorMessage:(state.dashboard.errorMessage),
  
  };
}
export default connect(mapStateToProps,{createcustomer})(AddCustomer);


