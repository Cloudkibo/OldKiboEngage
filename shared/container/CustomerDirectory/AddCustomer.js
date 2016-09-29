import React, { Component, PropTypes } from 'react';
import auth from '../../services/auth';
import {createcustomer}  from '../../redux/actions/actions'
import {getcustomerteams}  from '../../redux/actions/actions'
import {getcustomerchannels,getspecificsession,getspecificcustomer}  from '../../redux/actions/actions'
import {updatechannellist}  from '../../redux/actions/actions'
import {createsession}  from '../../redux/actions/actions'
import {addRoom} from '../../redux/actions/actions'
import { connect } from 'react-redux';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import { Link } from 'react-router';
import { browserHistory } from 'react-router'



/*import io from 'socket.io-client'
let socket = io('')*/

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}



var call_customer_details;
class AddCustomer extends Component {
   constructor(props, context) {
    props.getcustomerteams();
    props.getcustomerchannels();
    super(props, context);
    call_customer_details = false;
   // var pathname = getParameterByName('pathname'); 
    //var fullurl = getParameterByName('fullurl'); 
   // var companyid = getParameterByName('id'); 
    var companyid = props.params.id;
    var pathname = props.params.pathname;
    console.log(pathname)
   // console.log(fullurl)
    console.log(companyid)
    if(props.params.requestid){
      //alert(props.params.requestid);
      props.getspecificsession(props.params.requestid);
    }
    //console.log(props.params.pathname);
   // console.log(props.params.id);
    this.addCustomers = this.addCustomers.bind(this);
    this.create_session = this.create_session.bind(this);
    this.noagent = this.noagent.bind(this);
  }
  noagent(data){
    alert('We are offline now.We will contact you soon');


    //creating abandoned session
      const name = this.refs.name;
      const email = this.refs.email;
      const country = this.refs.country;
      const phone = this.refs.phone;
     // var companyid = getParameterByName('id'); 
     // var pathname = getParameterByName('pathname'); 
     /* var fullurl = getParameterByName('fullurl'); */

    var companyid = this.props.params.id;
    var pathname = this.props.params.pathname;
  //    var pathname = "";
      var fullurl = "";

     
     var session = { 
                        'email' : email.value,
                        'customerID' : email.value,
                        'departmentid': this.refs.teamlist.value,
                        'messagechannel' : this.refs.channellist.value,
                        'requesttime' : Date.now(),
                        'fullurl' :  fullurl,
                        'currentPage' : pathname,
                        'phone' :  phone.value,
                        'browser' : 'Chrome',
                        'ipAddress':'192.168.1.2',
                        'agent_ids':'',
                        'country' : country.value,
                        'companyid' : companyid,
                        'session_id' : data.request_id,
                        'platform': 'web',
                        'customerName' : name.value,
                        'isMobile' : "false",
                        'status' : 'new',
                        'socketid' : data.socketid,

                         }

       
    this.props.createsession(session); //added to create abandoned session
    browserHistory.push('/');
  }
create_session(data){
      const name = this.refs.name;
      const email = this.refs.email;
      const country = this.refs.country;
      const phone = this.refs.phone;
     // var companyid = getParameterByName('id'); 
     // var pathname = getParameterByName('pathname'); 
     /* var fullurl = getParameterByName('fullurl'); */

    var companyid = this.props.params.id;
    var pathname = this.props.params.pathname;
  //    var pathname = "";
      var fullurl = "";

     
      var session = { 
                      'email' : email.value,
                      'departmentid': this.refs.teamlist.value,
                      'messagechannel' : this.refs.channellist.value,
                      'requesttime' : Date.now(),
                      'fullurl' :  fullurl,
                      'customerID' : email.value, //new field added
                      'currentPage' : pathname,
                      'phone' :  phone.value,
                      'browser' : 'Chrome',
                      'ipAddress':'192.168.1.2',
                      'agent_ids':'',
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
  
 
   componentWillReceiveProps(props) {

    // bind the channel list of first team on load
    if(props.teamdetails  && props.channels.length > 0 && !props.params.requestid && call_customer_details == false ){
      //alert(props.channels.length);
      this.props.updatechannellist(props.teamdetails[0]._id);
       call_customer_details = true;
      this.forceUpdate();
    }
    else if(props.specificsession && props.channels && props.teamdetails  && call_customer_details == false){
     /* var dept_name = '';
      for(var i = 0;i< props.teamdetails.length;i++){
        if(props.teamdetails[i]._id == props.specificsession.departmentid)
        {
            dept_name = props.teamdetails[i].deptname;
        }
      }*/
      this.refs.teamlist.value = props.specificsession.departmentid;
      this.props.updatechannellist(props.specificsession.departmentid);
      this.props.getspecificcustomer(props.specificsession.customerid);
      
      call_customer_details = true;
     // this.refs.channellist.value = props.specificsession.messagechannel[props.specificsession.messagechannel.length -1];
      
     // this.forceUpdate();
    }
    if(props.specificcustomer){
      this.refs.teamlist.value = props.specificsession.departmentid;
      this.refs.channellist.value = props.specificsession.messagechannel[props.specificsession.messagechannel.length -1];
      //alert(this.refs.channellist.value)
      this.refs.name.value = props.specificcustomer.name;
      this.refs.email.value = props.specificcustomer.email;
      this.refs.country.value = props.specificcustomer.country;
      this.refs.phone.value = props.specificcustomer.phone;
      this.forceUpdate()
    }

    }
   componentDidMount() {
  // socket.on('joined',this.create_session)
    this.props.route.socket.on('empty',this.noagent);
   
   this.props.route.socket.on('joined',this.create_session)
   
   if(this.props.specificsession){
     //  this.props.getspecificcustomer(this.props.specificsession.customerid);
      
    }

      }
     
  addCustomers(e) {
    e.preventDefault();
   // var companyid = getParameterByName('id');

   // var pathname = getParameterByName('pathname'); 
    /*var fullurl = getParameterByName('fullurl');
       */
//    var companyid = this.props.params.id;
   // var pathname = "";
    var companyid = this.props.params.id;
    var pathname = this.props.params.pathname;
    var fullurl = "";

    const name = this.refs.name;
    const email = this.refs.email;
    const country = this.refs.country;
    const phone = this.refs.phone;
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
            var chArray = []
            chArray.push(this.refs.channellist.value);
            var agIds = []
            var customerid = {'customerID' : email.value,'name' : name.value,'email' : email.value,'country' : country.value,'phone' : phone.value,'companyid' : companyid,'isMobileClient':"false"}
            var socketsession =  {
                    customerid : customerid,
                    departmentid : this.refs.teamlist.value,
                    platform : "web",
                    agent_ids : agIds,
                    team:this.refs.teamlist.options[this.refs.teamlist.selectedIndex].text,
                    messagechannel : chArray,
                    channelname: this.refs.channellist.options[this.refs.channellist.selectedIndex].text,
                    fullurl :  fullurl,
                    currentPage : pathname,
                    phone :  phone.value,
                    requesttime:Date.now(),
                    status : "new",
                    browser : 'Chrome',
                    ipAddress:'192.168.1.2',
                    is_rescheduled:"false",
                    initiator : 'visitor',
                    companyid : companyid,
                    room: companyid,
                    request_id : unique_id,
                    webrtc_browser :'true',
                    msg : 'User joined session',
             };
        //    socket.emit('join meeting',socketsession);
           this.props.route.socket.emit('join meeting',socketsession);
         
         //  this.props.route.socket.on('customer_joined',data => create_session(data));
  

                   
        }


    //code for actual customers joining live help
  }
  

  handleChange(e){
    //alert(this.refs.teamlist.options[this.refs.teamlist.selectedIndex].text);
     this.props.updatechannellist(e.target.value);
      this.forceUpdate();

    }  
    handleChannelChange(e){
     //alert(e.target.value);
   
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

                   <label className="control-label col-md-3"> Choose Team</label>
                   <div className="col-md-9">
                  <select  ref = "teamlist" onChange={this.handleChange.bind(this)}   >
                          {
                          this.props.teamdetails && this.props.teamdetails.map((team,i) =>
                            <option value={team._id} >{team.deptname}</option>

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
    
    teamdetails :(state.widget.teamdetails),
    channels :(state.widget.channels),
    filterlist :(state.widget.filterlist),
    sessiondetails : (state.widget.sessiondetails),
    specificsession : (state.widget.specificsession),
    roomdetails :(state.widget.roomdetails),
    specificcustomer : (state.widget.specificcustomer),
  };
}
export default connect(mapStateToProps,{getcustomerteams,getspecificcustomer,getspecificsession,getcustomerchannels,updatechannellist,createsession,addRoom})(AddCustomer);


