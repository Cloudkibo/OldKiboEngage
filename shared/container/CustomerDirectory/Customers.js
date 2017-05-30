import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import CustomerListItem from './CustomerListItem';
import {getcustomers} from '../../redux/actions/actions'
import { browserHistory } from 'react-router'
const PureRenderMixin = require('react-addons-pure-render-mixin');
import Immutable from 'immutable';

import { bindActionCreators } from 'redux';

class Customers extends Component {

 constructor(props, context) {
      //call action to get user teams
    if(props.userdetails.accountVerified == "No"){
    browserHistory.push('/notverified');
   }
    const usertoken = auth.getToken();
    console.log('constructor is called');
    if(usertoken != null)
    {

        console.log(usertoken);
        props.getcustomers(usertoken)
      }
    super(props, context);
    this.state = {
      data: Immutable.List(),
      filteredData: Immutable.List(),
    };
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);




  }


filterData(event) {
    event.preventDefault();
    const regex = new RegExp(event.target.value, 'i');
    const filtered = this.state.data.filter(function(datum) {
      return (datum.get('customerID').search(regex) > -1);
    });

    this.setState({
      filteredData: filtered,
    });
  }
 componentWillReceiveProps(props){
    if(props.customers){
       this.setState({
      data: Immutable.fromJS(props.customers).toList(),
      filteredData: Immutable.fromJS(props.customers).toList()
    });
    }
  }
  render() {
    console.log(this.props.userdetails.firstname)
    const token = auth.getToken()
    console.log(token)
    const { filteredData } = this.state;

    console.log(this.props.notifications);
    return (
      <div className="vbox viewport">
       <AuthorizedHeader name = {this.props.userdetails.firstname} user={this.props.userdetails}/>

       <div className="page-container hbox space-between">
         <SideBar isAdmin ={this.props.userdetails.isAdmin}/>
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
                    <i className="fa fa-user"/>
                   Customers
                </div>
              </div>

           <div className="portlet-body">

               {this.props.errorMessage &&

                     <div className = "alert alert-danger"><span>{this.props.errorMessage}</span></div>
                      }
                { this.props.customers && filteredData && this.props.customers.length > 0 ?
                  <div>
                  <div className="table-toolbar">
                      <div className="btn-team">
                        <label> Search </label>
                        <input type="text" placeholder = "Search Customer By Name/Email" className="form-control"
                                   onChange={ this.filterData.bind(this)}  />
                      </div>
                   </div>
                   <div className="table-responsive">
                   <table id ="sample_3" className="table table-striped table-bordered table-hover dataTable">
                   <thead>
                    <tr>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Name </th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Email Address</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Country</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Contact No.</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Options</th>


                    </tr>
                    </thead>

                    <tbody>
                      {
                        this.props.customers && filteredData && filteredData.map((customer, i) => (

                          <CustomerListItem customer={customer} />

                        ))
                      }
                     </tbody>
                    </table>
                    </div>
                    </div> :
                    <p>Currently, there is no customer to show.</p>
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

Customers.propTypes = {

  errorMessage: PropTypes.string,
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
          customers:(state.dashboard.customers),
           };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({getcustomers:getcustomers}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(Customers);
