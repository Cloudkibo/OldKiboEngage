import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { emailCustomer,getSessionDetailsRequest,getspecificuserchats}  from '../../redux/actions/actions'
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import Email from './Email'
var handleDate = function(d){
  if(d && d!= ''){
    var c = new Date(d);
    return c.toDateString() + ' ' +c.getHours() + ':' + c.getMinutes();
  }

  else{
    return '-'
  }

}

var getchannelname = function(channels,id){
 var cname = ''
 for(var c=0;c<=channels.length - 1;c++){
  if(channels[c]._id == id){
    cname = channels[c].msg_channel_name;
    break;
  }
 }
 return cname;
}

var getagentname = function(agents,id){
 var cname = ''
 for(var c=0;c<=agents.length - 1;c++){
  if(agents[c]._id == id){
    cname = agents[c].firstname + ' ' + agents[c].lastname;
    break;
  }
 }
 return cname;
}



class SessionDetailView extends Component {

  constructor(props, context) {
      //call action to get user groups 
    const usertoken = auth.getToken();
     console.log('constructor is called');
    if(usertoken != null)
     {
       
        console.log(usertoken);
        console.log(props.params.id);
        props.getSessionDetailsRequest(props.params.id);
        props.getspecificuserchats(props.params.id,props.userdetails.uniqueid,usertoken)
      }
      
        super(props, context);
        //this.handleDate = this.handleDate.bind(this);
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
var sessionsummarydetail = []
     {
         this.props.sessionsummarydetail &&
                        this.props.sessionsummarydetail.map((ch, i) => (
                           sessionsummarydetail.push(ch)                            
                        ))

      }
var ag = []
 {
         this.props.customers && sessionsummarydetail[0].customerid &&
                        this.props.customers.filter((c) => c._id == sessionsummarydetail[0].customerid).map((grp, i) => (
                           ag.push(grp)                            
                        ))

      }     
var grpp = []
 {
         this.props.groupdetails &&
                        this.props.groupdetails.filter((c) => c._id == sessionsummarydetail[0].departmentid).map((grp, i) => (
                           grpp.push(grp)                            
                        ))

      }     



   

     return (
      <div>
       <div className="page-container">
         <SideBar isAdmin ={this.props.userdetails.isAdmin}/> 
          <div className="page-content-wrapper">
            <div className="page-content"> 
              <h3 className ="page-title">View Chat Session Details </h3>
            <ul className="page-breadcrumb breadcrumb">
                  <li>
                    <i className="fa fa-home"/>
                    <Link to="/dashboard"> Dashboard </Link>
                    <i className="fa fa-angle-right"/> 
                  </li>                  
                  <li>
                               <Link to="/summarychatsessions">Summary of Chat Sessions </Link>
                  </li>               
  
            </ul>
             {
              this.props.sessionsummarydetail &&
            <div className="portlet box ">
          
           <div className="portlet-body">
               <div className="pull-left  form">
                <form className="form-horizontal form-row-seperated">
                  <div className="form-body">
                    <div className="form-group">
                      <label className="control-label col-md-3"> Customer Name </label>
                       <div className="col-md-9">
                             <input className="form-control" type='text' value = {ag[0].name}/>
                       </div>
                    </div>

                    <div className="form-group">
                      <label className="control-label col-md-3"> Email </label>
                       <div className="col-md-9">
                             <input className="form-control" type='text' value = {ag[0].email}/>
                       </div>
                    </div>

                     <div className="form-group">
                      <label className="control-label col-md-3"> Status </label>
                       <div className="col-md-9">
                            <input className="form-control" type='text' value = {sessionsummarydetail[0].status}/>
                 
                       </div>
                    </div>

                     <div className="form-group">
                      <label className="control-label col-md-3"> Group </label>
                       <div className="col-md-9">
                            <input className="form-control" type='text' value = {grpp[0].deptname}/>
                 
                       </div>
                    </div>

                     <div className="form-group">
                      <label className="control-label col-md-3"> Request Time </label>
                       <div className="col-md-9">
                            <input className="form-control" type='text' value = {handleDate(sessionsummarydetail[0].requesttime)}/>
                 
                       </div>
                    </div>

                    <div className="form-group">
                      <label className="control-label col-md-3"> Pick Time </label>
                       <div className="col-md-9">
                            <input className="form-control" type='text' value = {handleDate(sessionsummarydetail[0].picktime)}/>
                 
                       </div>
                    </div>

                    <div className="form-group">
                      <label className="control-label col-md-3"> Resolve Time </label>
                       <div className="col-md-9">
                            <input className="form-control" type='text' value = {handleDate(sessionsummarydetail[0].endtime)}/>
                 
                       </div>
                    </div>

                    <div className="form-group">
                      <label className="control-label col-md-3"> Message Channels Assignments </label>
                       <div className="col-md-9">
                       <ul>
                          {
                            sessionsummarydetail[0] && sessionsummarydetail[0].messagechannel &&
                           sessionsummarydetail[0].messagechannel.map((ch, i) => (
                               <li>{getchannelname(this.props.channels,ch)}</li>                            
                            )) 
                          }
                          </ul>
                       </div>
                    </div>


                     <div className="form-group">
                      <label className="control-label col-md-3"> Agent Assignments </label>
                       <div className="col-md-9">
                       <ul>
                          {
                            sessionsummarydetail[0] && sessionsummarydetail[0].agent_ids &&
                           sessionsummarydetail[0].agent_ids.map((ch, i) => (
                               <li>{getagentname(this.props.agents,ch)}</li>                            
                            )) 
                          }
                          </ul>
                       </div>
                    </div>
                  
                  </div>  
                  
              </form>
              </div>
            <div>
                <h3>Chat History</h3>
                      <ul className="chat" style={{wordWrap: 'break-word', margin: '0', overflowY: 'scroll',height: '450px', padding: '0', paddingBottom: '1em', flexGrow: '1', order: '1'}}>
                          {this.props.userchathistory &&
                              this.props.userchathistory.map((chat, i) =>
                                    <li className="left clearfix userChatBox">
                                        <span className="chat-img pull-left userChat">
                                        {chat.from.substr(0,1)}
                                        </span>
                                        <div className="chat-body clearfix">
                                          <div>
                                              <strong className="primary-font">{chat.from}</strong> 
                                              <small className="pull-right text-muted">
                                                  <span className="glyphicon glyphicon-time"></span>{handleDate(chat.datetime)}
                                              </small>
                                          </div>
                                         <p className="chatmsg">
                                              {chat.msg}
                                         </p>
                                       </div>
                                </li>
                          )
                      }
                      </ul>
            </div>


            <div style={{clear:'both'}}>

                <div className="portlet box grey-cascade">
                <div className="portlet-title">
                <div className="caption">
                    <i className="fa fa-email"/>
                   Send Email
                </div> 
                </div>
                <div className="portlet-body">
                <form className="form-horizontal form-row-seperated">
              <div className="form-body">
                <div className="form-group">
                  <label className="control-label col-md-3"> To </label>
                   <div className="col-md-9">
                         <input className="form-control input-medium" type='text'  ref = "name" />
                   </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-md-3"> Email Address </label>
                   <div className="col-md-9">
                         <input className="form-control input-medium" type='text'  ref = "emailAdd"  />
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
                    <Link to="/summarychatsessions" className="btn green">
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
        }


         
       </div>
       
       </div> 
      </div>

      </div> 
  )
  }
}


SessionDetailView.contextTypes = {
  router: React.PropTypes.object,
};



function mapStateToProps(state) {
  return {
          channels:(state.dashboard.channels),
          userdetails:(state.dashboard.userdetails),
          groupdetails :(state.dashboard.groupdetails),
          errorMessage:(state.dashboard.errorMessage),
          responses :(state.dashboard.responses),
          agents:(state.dashboard.agents),
          deptagents:(state.dashboard.deptagents),
          sessions :(state.dashboard.sessions),
          customers:(state.dashboard.customers),
          customerchat : (state.dashboard.customerchat),
          sessionsummary : (state.dashboard.sessionsummary),
          sessionsummarydetail :(state.dashboard.sessionsummarydetail),
          userchathistory :(state.dashboard.userchathistory),      
  };
}

export default connect(mapStateToProps,{emailCustomer, getSessionDetailsRequest,getspecificuserchats})(SessionDetailView);
