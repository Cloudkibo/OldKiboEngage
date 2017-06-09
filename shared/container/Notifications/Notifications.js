import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import NotificationListItem from './NotificationListItem';
import {getnotifications} from '../../redux/actions/actions'
import {deletenotification} from '../../redux/actions/actions'
import {getcustomers} from '../../redux/actions/actions'
import ReactPaginate from 'react-paginate';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router'


class Notifications extends Component {

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
        props.getnotifications(usertoken);
        props.getcustomers(usertoken);
      }
    super(props, context);
    this.state = {
      notificationsData: [],
      totalLength: 0,
    };

    this.handlePageClick = this.handlePageClick.bind(this);
    this.displayData = this.displayData.bind(this);
  }

  displayData(n){
    let offset = n*6;
    //console.log("Offset: " + offset);
    let sessionData = [];
    let limit;
    if ((offset + 6) > this.props.notifications.length){
      limit = this.props.notifications.length;
    }
    else {
      limit = offset + 6;
    }
    for (var i=offset; i<limit; i++){
      sessionData[i] = this.props.notifications[i];
    }
    this.setState({notificationsData: sessionData});
  }

  handlePageClick(data){
    //console.log(data.selected);
    this.displayData(data.selected);
  }

  componentDidMount(){
    this.displayData(0);
    this.setState({totalLength: this.props.notifications.length});
  }

  render() {
    //console.log(this.props.userdetails.firstname)
    const token = auth.getToken()
    //console.log(token)
    //console.log(this.props.notifications);
    return (
      <div className="vbox viewport">
       <AuthorizedHeader name = {this.props.userdetails.firstname} user={this.props.userdetails}/>

       <div className="page-container hbox space-between">
         <SideBar isAdmin ={this.props.userdetails.isAdmin}/>
          <div className="page-content-wrapper">
            <div className="page-content">

            <div className="portlet box grey-cascade">
              <div className="portlet-title">
                <div className="caption">
                    <i className="fa fa-envelope"/>
                   Notifications
                </div>
              </div>

           <div className="portlet-body">
             <div className="table-toolbar">
                 <div className="btn-team">
                    <Link id="sample_editable_1_new" className="btn green" to='/addnotification'> Add Notification
                    <i className="fa fa-plus"/>
                    </Link>
                 </div>
              </div>
               {this.props.errorMessage &&

                     <div className = "alert alert-danger"><span>{this.props.errorMessage}</span></div>
                      }
                { this.props.notifications && this.props.notifications.length > 0 ?
                  <div className="table-responsive">
                   <table id ="sample_3" style={{ tableLayout: 'fixed', wordWrap: 'break-word'}} className="table table-striped table-bordered table-hover dataTable">
                   <thead>
                    <tr>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Title </th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Description</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Date </th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Agent</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Options</th>


                    </tr>
                    </thead>

                    <tbody>
                      {
                        this.props.agents && this.props.notifications &&
                        this.state.notificationsData.map((notification, i) => (

                          <NotificationListItem notification={notification}  agent = {this.props.agents.filter((agent) => agent._id == notification.agent_id)}  onDelete={() => this.props.deletenotification(notification,token)}/>

                        ))
                      }
                     </tbody>
                    </table>
                    <ReactPaginate previousLabel={"previous"}
                                   nextLabel={"next"}
                                   breakLabel={<a href="">...</a>}
                                   breakClassName={"break-me"}
                                   pageCount={Math.ceil(this.state.totalLength/6)}
                                   marginPagesDisplayed={1}
                                   pageRangeDisplayed={6}
                                   onPageChange={this.handlePageClick}
                                   containerClassName={"pagination"}
                                   subContainerClassName={"pages pagination"}
                                   activeClassName={"active"} />
                    </div> :
                    <p> Currently, there is no notification to show. </p>
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

Notifications.propTypes = {

  errorMessage: PropTypes.string,
}
function mapStateToProps(state) {
  //console.log("mapStateToProps is called");
  return {
          channels:(state.dashboard.channels),
          userdetails:(state.dashboard.userdetails),
          teamdetails :(state.dashboard.teamdetails),
          errorMessage:(state.dashboard.errorMessage),
          notifications:(state.dashboard.notifications),
          agents:(state.dashboard.agents),
          deptagents:(state.dashboard.deptagents),
          customers:(state.dashboard.customers),
           };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({getnotifications:getnotifications,deletenotification:deletenotification,getcustomers:getcustomers}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(Notifications);
