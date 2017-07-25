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
import ReactPaginate from 'react-paginate';
import { bindActionCreators } from 'redux';

class Customers extends Component {

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
        props.getcustomers(usertoken)
      }
    super(props, context);
    this.state = {
      data: props.customers,
      filteredData: props.customers,
      customersData: [],
      totalLength: 0,
      isChecked: false,
      isCheckedAll: false,
    };
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.displayData = this.displayData.bind(this);
    this.selectCheckedItem = this.selectCheckedItem.bind(this);
    this.toggleCheckAll = this.toggleCheckAll.bind(this);
  }


filterData(event) {
    event.preventDefault();
    var filtered= [];
    console.log(this.state.data);
    for(var i=0; i<this.state.data.length; i++){
        if(this.state.data[i].customerID.toLowerCase().includes(event.target.value)){
          filtered.push(this.state.data[i]);
        }
    }

    this.setState({
      filteredData: filtered,
    },
    () => {
      this.displayData(0);
      this.setState({ totalLength: this.state.filteredData.length });
      console.log(this.state.filteredData);
    }

    );
  }

  displayData(n){
    let offset = n*6;
    console.log("Offset: " + offset);
    let sessionData = [];
    let limit;
    if ((offset + 6) > this.state.filteredData.length){
      limit = this.state.filteredData.length;
    }
    else {
      limit = offset + 6;
    }
    for (var i=offset; i<limit; i++){
      sessionData[i] = this.state.filteredData[i];
    }
    this.setState({
      customersData: sessionData,
    });
    }

  handlePageClick(data){
    console.log(data.selected);
    this.displayData(data.selected);
  }

  selectCheckedItem(data) {
    console.log(data);
  }

  toggleCheckAll() {
    this.setState({
      isCheckedAll: !this.state.isCheckedAll,
      isChecked: !this.state.isChecked,
    });
  }

  componentDidMount(){
    this.displayData(0);
    this.setState({ totalLength: this.state.filteredData.length });
  }

 /*componentWillReceiveProps(props){
    if(props.customers){
       this.setState({
      data: Immutable.fromJS(props.customers).toList(),
      filteredData: Immutable.fromJS(props.customers).toList()
    });
    }
  }*/
  render() {
    //console.log(this.props.userdetails.firstname)
    const token = auth.getToken()
    //console.log(token)
    const { filteredData } = this.state;

    //console.log(this.props.notifications);
    return (
      <div className="vbox viewport">
       <AuthorizedHeader name = {this.props.userdetails.firstname} user={this.props.userdetails}/>

       <div className="page-container hbox space-between">
         <SideBar isAdmin ={this.props.userdetails.isAdmin}/>
          <div className="page-content-wrapper">
            <div className="page-content">

            <div className="uk-card uk-card-body uk-card-default">
              <div className="uk-card-title">

                   Customers
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
                    <th role="columnheader" rowSpan='1' colSpan='1' aria-sort='ascending' >
                      <input
                        type="checkbox"
                        checked={this.state.isCheckedAll}
                        onChange={this.toggleCheckAll}
                      />
                    </th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Name </th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Email Address</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Country</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Contact No.</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Options</th>


                    </tr>
                    </thead>

                    <tbody>
                      {
                        this.props.customers && filteredData && this.state.customersData.map((customer, i) => (

                          <CustomerListItem selectCheckedItem={this.selectCheckedItem} isChecked={this.state.isChecked} customer={customer} />

                        ))
                      }
                     </tbody>
                    </table>
                    </div>
                    <button className="uk-button uk-button-primary uk-button-small" style={{ marginTop: -25 }}>
                      {this.state.isCheckedAll ? 'Delete All' : 'Delete'}
                    </button>
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
  return bindActionCreators({getcustomers:getcustomers}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(Customers);
