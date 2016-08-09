import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import SessionListItem from './SessionListItem';
import {getnewsessions,getcustomers,getnewsessionsfromsocket} from '../../redux/actions/actions'
import { bindActionCreators } from 'redux';

class NewSessions extends Component {

 constructor(props, context) {
      //call action to get user groups 
    const usertoken = auth.getToken();
    console.log('constructor is called');
    if(usertoken != null)
    {
       
        console.log(usertoken);
      //  props.getsessions(usertoken);
        props.getnewsessions(usertoken);
        if(!props.customers)
        {
            props.getcustomers(usertoken);
        }
      }
    super(props, context);
    this.getupdatedSessions = this.getupdatedSessions.bind(this);
       

    
  }
 
  getupdatedSessions(data)
  {
    const usertoken = auth.getToken();
    this.props.getnewsessionsfromsocket(data,this.props.newsessions);

    this.forceUpdate();
  }

  componentDidMount(){
       this.props.route.socket.on('customer_joined',this.getupdatedSessions);
  }
  render() {
    const token = auth.getToken()
    console.log(token)
    return (
      <div>
       <AuthorizedHeader name = {this.props.userdetails.firstname} />
       <div className="page-container">
         <SideBar isAdmin ={this.props.userdetails.isAdmin}/> 
          <div className="page-content-wrapper">
            <div className="page-content"> 
              <h3 className ="page-title">New Chat Sessions </h3>
            <ul className="page-breadcrumb breadcrumb">
                  <li>
                    <i className="fa fa-home"/>
                    <Link to="/dashboard"> Dashboard </Link>
                    <i className="fa fa-angle-right"/> 
                  </li>                  
                  <li>
                               <Link to="/newchatsessions">New Chat Sessions </Link>
                  </li>               
  
            </ul>
            <div className="portlet box grey-cascade">
              <div className="portlet-title">
                <div className="caption">
                    <i className="fa fa-user"/>
                  New Chat Sessions
                </div> 
              </div>    
        
           <div className="portlet-body">
            
             { this.props.newsessions &&
                   <table id ="sample_3" className="table table-striped table-bordered table-hover dataTable">
                   <thead>
                    <tr>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Visitor Name </th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Visitor Email</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Group</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Message Channel</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Status</th>
                      
                   
                    </tr>
                    </thead>

                    <tbody>                    
                      {
                        this.props.newsocketsessions && this.props.customers && this.props.channels && this.props.groupdetails && 
                        this.props.newsocketsessions.map((session, i) => (
                          
                          <SessionListItem session={session} key={session.request_id}  customername = {session.username} email = {session.useremail}  channels = {this.props.channels.filter((c) => c._id == session.messagechannel)} groups = {this.props.groupdetails.filter((c) => c._id == session.departmentid)}/>
                                                      
                        ))
                      }


                      {
                        this.props.newsessions && this.props.customers && this.props.channels && this.props.groupdetails &&
                        this.props.newsessions.map((session, i) => (
                          
                          <SessionListItem session={session} key={session.request_id} customers={this.props.customers.filter((c) => c._id == session.customerid)} channels = {this.props.channels.filter((c) => c._id == session.messagechannel[session.messagechannel.length-1])} groups = {this.props.groupdetails.filter((c) => c._id == session.departmentid)}/>
                                                      
                        ))
                      }
                     </tbody> 
                    </table>
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

NewSessions.propTypes = {

  errorMessage: PropTypes.string,
}
function mapStateToProps(state) {
  console.log("mapStateToProps is called");
  return {
          channels:(state.dashboard.channels),
          userdetails:(state.dashboard.userdetails),
          groupdetails :(state.dashboard.groupdetails),
          errorMessage:(state.dashboard.errorMessage),
          responses :(state.dashboard.responses),
          agents:(state.dashboard.agents),
          deptagents:(state.dashboard.deptagents),
          newsessions :(state.dashboard.newsessions),
          customers:(state.dashboard.customers),
          newsocketsessions : (state.dashboard.newsocketsessions)
           };

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({getnewsessions:getnewsessions,getnewsessionsfromsocket:getnewsessionsfromsocket,getcustomers:getcustomers}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(NewSessions);



