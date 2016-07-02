import React, { Component, PropTypes } from 'react';
import auth from '../../services/auth';
import {createcustomer}  from '../../redux/actions/actions'
import {getcustomergroups}  from '../../redux/actions/actions'
import {getcustomerchannels}  from '../../redux/actions/actions'
import {updatechannellist}  from '../../redux/actions/actions'
import {createsession}  from '../../redux/actions/actions'
import {addRoom} from '../../redux/actions/actions'
import { connect } from 'react-redux';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import { Link } from 'react-router';
import { browserHistory } from 'react-router'
import io from 'socket.io-client';




class AddCustomer extends Component {
   constructor(props, context) {
    props.getcustomergroups();
    props.getcustomerchannels();
    super(props, context);
   
    this.addCustomers = this.addCustomers.bind(this);
    this.create_session = this.create_session.bind(this);
  }
create_session(data){
    console.log('i am called')
      const name = this.refs.name;
      const email = this.refs.email;
      const country = this.refs.country;
      const phone = this.refs.phone;
      var companyid = this.props.params.id;
     
      var session = { 
                        'email' : email.value,
                        'departmentid': this.refs.grouplist.value,
                        'channelid' : this.refs.channellist.value,
                        'requesttime' : Date.now(),

                        'phone' :  phone.value,
                        'browser' : 'Chrome',
                        'ipAddress':'192.168.1.2',
                        'country' : country.value,
                        'companyid' : companyid,
                        'session_id' : data.request_id,
                        'platform': 'web',
                        'customerName' : name.value,
                        'isMobile' : "false",
                        'status' : 'new',
                        'socketid' : data.socketid,

                         }
        this.props.createsession(session);
        this.props.addRoom(data);
      
  }  
  
 
   componentDidMount() {
   this.props.route.socket.on('joined',this.create_session)
      }
  addCustomers(e) {
    e.preventDefault();
    const name = this.refs.name;
    const email = this.refs.email;
    const country = this.refs.country;
    const phone = this.refs.phone;
    var companyid = this.props.params.id;
    const btn = this.refs.btn

    //Code used for creating dummy customers
     if (name.value === "" || name.value == null) {

        return alert('Name is required.');
      }
      else if (email.value === "" || email.value == null) {

        return alert('Email is required.');
      }
      else
        {
            var requesttime = Date.now();

            btn.disabled=true;

            var today = new Date();
            var uid = Math.random().toString(36).substring(7);
            var unique_id = 'h' + uid + '' + today.getFullYear() + '' + (today.getMonth()+1) + '' + today.getDate() + '' + today.getHours() + '' + today.getMinutes() + '' + today.getSeconds();
            var socketsession =  {
                    username : name.value,
                    useremail :email.value,
                    currentPage : 'www.kibosupport.com',
                    departmentid : this.refs.grouplist.value,
                    group:this.refs.grouplist.options[this.refs.grouplist.selectedIndex].text,
                    channelid : this.refs.channellist.value,
                    channelname: this.refs.channellist.options[this.refs.channellist.selectedIndex].text,
                    fullurl :  'www.kibosupport.com',
                    phone :  phone.value,
                    browser : 'Chrome',
                    ipAddress:'192.168.1.2',
                    country : country.value,
                    initiator : 'visitor',
                    room: companyid,
                    request_id : unique_id,
                    webrtc_browser :'true',
                    msg : 'User joined session'
             };
             this.props.route.socket.emit('join meeting',socketsession);
         
         //  this.props.route.socket.on('customer_joined',data => create_session(data));
  

                   
        }


    //code for actual customers joining live help
  }
  

  handleChange(e){
    alert(this.refs.grouplist.options[this.refs.grouplist.selectedIndex].text);
     this.props.updatechannellist(e.target.value);
      this.forceUpdate();

    }  
    handleChannelChange(e){
     alert(e.target.value);
   
    }  
  render() {
   
   {this.props.roomdetails &&
    browserHistory.push('/clientchat')}
    return (

      <div>

       <div className="page-container">
          <div className="page-content-wrapper">
            <div className="page-content"> 
              <h3 className ="page-title">KiboEngage Chat Widget </h3>
           
                {this.props.errorMessage &&

                     <div className = "alert alert-danger"><span>{this.props.errorMessage}</span></div>
                      }
         
            
            <div className="portlet box grey-cascade">
              <div className="portlet-title">
                <div className="caption">
                    <i className="fa fa-user"/>
                  Welcome to Live Help
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
                <div className="form-group">

                   <label className="control-label col-md-3"> Choose Group</label>
                   <div className="col-md-9">
                  <select  ref = "grouplist" onChange={this.handleChange.bind(this)}   >
                          {
                          this.props.groupdetails && this.props.groupdetails.map((group,i) =>
                            <option value={group._id} >{group.deptname}</option>

                            )
                         }
                         
                      </select>
                  </div>
                 </div>     
                   
                <div className="form-group">
                   <label className="control-label col-md-3"> Choose Channel</label>
                   <div className="col-md-9">
                   <select  ref = "channellist" onChange={this.handleChannelChange.bind(this)}   >
                          {
                          this.props.filterlist && this.props.filterlist.map((channel,i) =>
                            <option value={channel._id}>{channel.msg_channel_name}</option>

                            )
                         }
                         
                   </select>
                  </div>
                 </div>     
              <div className="form-actions fluid">
              <div className="row">
                <div className="col-md-3">
                  <div className="col-md-offset-9 col-md-9">
                    <button className="btn green" ref = "btn" onClick={this.addCustomers}>
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
    
    groupdetails :(state.widget.groupdetails),
    channels :(state.widget.channels),
    filterlist :(state.widget.filterlist),
    sessiondetails : (state.widget.sessiondetails),
    roomdetails :(state.widget.roomdetails),
  };
}
export default connect(mapStateToProps,{getcustomergroups,getcustomerchannels,updatechannellist,createsession,addRoom})(AddCustomer);


