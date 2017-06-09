import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import FBCustomerListItem from './FBCustomerListItem';
import {getfbCustomers} from '../../redux/actions/actions'
import { browserHistory } from 'react-router'
const PureRenderMixin = require('react-addons-pure-render-mixin');
import ReactPaginate from 'react-paginate';
import { bindActionCreators } from 'redux';

class FacebookCustomers extends Component {
  constructor(props, context) {
    //call action to get user teams
    if(props.userdetails.accountVerified == "No"){
    browserHistory.push('/notverified');
  }
  const usertoken = auth.getToken();
  if(usertoken != null){
    props.getfbCustomers(usertoken)
  }
  super(props, context);
  this.state = {
    data: props.fbcustomers,
    filteredData: props.fbcustomers,
    totalLength: 0,
  };
  this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  this.filterData = this.filterData.bind(this);
  this.handlePageClick = this.handlePageClick.bind(this);
  this.displayData = this.displayData.bind(this);
}

filterData(event) {
  event.preventDefault();
  var filtered = [];
  for(var i=0; i<this.state.data.length; i++){
    var name = this.state.data[i].first_name + " " + this.state.data[i].last_name;
    if(name.toLowerCase().includes(event.target.value)){
      filtered.push(this.state.data[i]);
    }
  }

  this.setState({
    filteredData: filtered,
  });
}

componentDidMount(){
  this.displayData(0);
  this.setState({totalLength: this.props.fbcustomers.length});
}

displayData(n){
  let offset = n*6;
  //console.log("Offset: " + offset);
  let sessionData = [];
  let limit;
  if ((offset + 6) > this.props.fbcustomers.length){
    limit = this.props.fbcustomers.length;
  }
  else {
    limit = offset + 6;
  }
  for (var i=offset; i<limit; i++){
    sessionData[i] = this.props.fbcustomers[i];
  }
  this.setState({filteredData: sessionData});
}

handlePageClick(data){
  //console.log(data.selected);
  this.displayData(data.selected);
}

render() {
  const token = auth.getToken()
  const { filteredData } = this.state;
  //console.log(filteredData);
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
                  <i className="fa fa-users"/>
                  Facebook Customers
                </div>
              </div>
              <div className="portlet-body">

               {this.props.errorMessage &&
                 <div className = "alert alert-danger"><span>{this.props.errorMessage}</span></div>
               }

               { this.props.fbcustomers && filteredData && this.props.fbcustomers.length > 0 ?
                 <div>
                 <div className="table-toolbar">
                   <div className="btn-team">
                     <label> Search </label>
                     <input type="text" placeholder = "Search Customer" className="form-control" onChange = {this.filterData} />
                   </div>
                 </div>
                 <table id ="sample_3" className="table table-striped table-bordered table-hover dataTable">
                 <thead>
                  <tr>
                    <th role="columnheader" rowSpan='1' colSpan='1' aria-sort='ascending' >Name </th>
                    <th role="columnheader" rowSpan='1' colSpan='1' aria-sort='ascending' >Email Address</th>
                  </tr>
                 </thead>
                <tbody>
                  {
                    this.props.fbcustomers && filteredData && filteredData.map((customer, i) => (
                      <FBCustomerListItem customer={customer} />
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
              <p>Currently, there is no Facebook Customer to show.</p>
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

FacebookCustomers.propTypes = {
  errorMessage: PropTypes.string,
}

function mapStateToProps(state) {

  return {
          channels:(state.dashboard.channels),
          userdetails:(state.dashboard.userdetails),
          teamdetails :(state.dashboard.teamdetails),
          errorMessage:(state.dashboard.errorMessage),
          notifications:(state.dashboard.notifications),
          agents:(state.dashboard.agents),
          deptagents:(state.dashboard.deptagents),
          fbcustomers:(state.dashboard.fbcustomers),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({getfbCustomers:getfbCustomers}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(FacebookCustomers);
