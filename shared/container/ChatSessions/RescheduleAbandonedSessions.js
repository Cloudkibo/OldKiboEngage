import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import SessionListItem from './SessionListItem';
import {submitemail,getcompanysettings,getcustomers,updatereschedule} from '../../redux/actions/actions'
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router'

class RescheduleAbandonedSessions extends Component {

 constructor(props, context) {
      //call action to get user teams
    if(props.userdetails.accountVerified == "No"){
    browserHistory.push('/notverified');
   }

    const usertoken = auth.getToken();
    //console.log('constructor is called');
    if(usertoken != null)
    {

        //console.log(usertoken);
        props.getcompanysettings(usertoken,props.userdetails.uniqueid);

      }
    super(props, context);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {emailtemp : '',url : ''}

  }
 componentWillReceiveProps(props) {
    if(props.companysettings){
      this.setState({emailtemp: props.companysettings.abandonedscheduleemail1,url:'http://kiboengage.cloudapp.net/livehelp/'+ props.userdetails.uniqueid+'/'+ document.title+'/'+props.params.id});
    }
}
 onChange(event) {
    this.setState({emailtemp: event.target.value});
  }
  handleSubmit(e){
    const usertoken = auth.getToken();

   var emailMsg = {'to':this.props.params.name,'emailAdd':this.props.params.email,'subject' : 'Rescheduling Chat Session','body':this.state.emailtemp,'from' : this.props.userdetails.firstname + ' ' + this.props.userdetails.lastname,'url' : this.state.url }
      this.props.updatereschedule({'is_rescheduled' : 'true','rescheduled_by' : this.props.userdetails._id,'companyid' : this.props.userdetails.uniqueid,'request_id':this.props.params.id,'usertoken' : usertoken},{emailMsg,usertoken})
   //   this.props.submitemail({emailMsg,usertoken});



  }
  render() {
    const token = auth.getToken()
    //console.log(token)
    return (
      <div className="vbox viewport">

       <div className="page-container hbox space-between">
         <SideBar isAdmin ={this.props.userdetails.isAdmin}/>
          <div className="page-content-wrapper">
            <div className="page-content">
              <h3 className ="page-title">Reschedule Abandoned Chat Sessions </h3>
            <ul className="uk-breadcrumb">
                  <li>
                    <i className="fa fa-home"/>
                    <Link to="/dashboard"> Dashboard </Link>
                    <i className="fa fa-angle-right"/>
                  </li>
                  <li>
                               <Link to="/newchatsessions">Abandoned Chat Sessions </Link>
                  </li>

            </ul>
            <div className="uk-card uk-card-body uk-card-default ">
              <div className="uk-card-title">
                
                  Reschedule Abandoned Chat Sessions
                
              </div>

           <div className="portlet-body">
           {
            this.props.companysettings &&

              <div>
              <h3>Edit Email Template </h3>
              <textarea className ="form-control" rows="5" ref = "emailtemp" onChange={this.onChange.bind(this)} defaultValue= {this.props.companysettings.abandonedscheduleemail1}>


            </textarea>



           <div className="portlet">
              <div className="portlet-title">
                <div className="caption"><i className="fa fa-gift"></i>Perview Email</div>

              </div>
            <div class="portlet-body">
              Hello {this.props.params.name},<br/><br/>{this.state.emailtemp}<br/><br/>
              Here is the link to join the chat: <br/>
              {this.state.url}
              <br/><br/>
              Regards
              <br/>{this.props.userdetails.firstname}
              <br/>{this.props.userdetails.companyName}</div>
          </div>
          <div className="form-actions">
              <button className="btn blue"  type ="submit" onClick={this.handleSubmit}> Submit </button>

         </div>

          </div>


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

RescheduleAbandonedSessions.propTypes = {

  errorMessage: PropTypes.string,
}
function mapStateToProps(state) {
  //console.log("mapStateToProps is called");
  return {
          channels:(state.dashboard.channels),
          userdetails:(state.dashboard.userdetails),
          teamdetails :(state.dashboard.teamdetails),
          errorMessage:(state.dashboard.errorMessage),
          responses :(state.dashboard.responses),
          agents:(state.dashboard.agents),
          deptagents:(state.dashboard.deptagents),
          resolvedsessions :(state.dashboard.resolvedsessions),
          customers:(state.dashboard.customers),
          resolvedsocketsessions : (state.dashboard.resolvedsocketsessions),
          companysettings:(state.dashboard.companysettings),
           };

}


export default connect(mapStateToProps,{getcompanysettings,submitemail,updatereschedule})(RescheduleAbandonedSessions);
