import GroupListItem from './GroupListItem';
import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {getusergroups} from '../../redux/actions/actions'
import {creategroup} from '../../redux/actions/actions'
import {deletegroup,getcustomers,getDeptAgents} from '../../redux/actions/actions';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import GroupCreateView from './GroupCreateView';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router'
import ReactPaginate from 'react-paginate';
var NotificationSystem = require('react-notification-system');


class Groups extends Component {

 constructor(props, context) {
      //call action to get user groups
    if(props.userdetails.accountVerified == "No"){
    browserHistory.push('/notverified');
   }

    const usertoken = auth.getToken();
    //console.log('componentWillMount is called');
    if(usertoken != null)
    {

        //console.log(usertoken);
        props.getusergroups(usertoken);
        props.getcustomers(usertoken);
      }

        super(props, context);

    this.state = {
      showAddGroup: false,
      groupsData: [],
      totalLength: 0,
      selectedPage: 0,
    };

    this.handleClick = this.handleClick.bind(this);
    this.add = this.add.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.displayData = this.displayData.bind(this);
    this.deleteGroup = this.deleteGroup.bind(this);
  }

componentDidMount(){
     const usertoken = auth.getToken();
     //console.log('componentWillMount is called');
    if(usertoken != null)
    {

        //console.log(usertoken);
        this.props.getusergroups(usertoken);
        this.props.getDeptAgents(usertoken);

        this.props.getcustomers(usertoken);
      }
      this.displayData(0);
      this.setState({totalLength: this.props.groupdetails.length});
}

   handleClick(e) {

      this.setState({
      showAddGroup: !this.state.showAddGroup,
      });
      e.preventDefault();
  }

  displayData(n){
    let offset = n*6;
    //console.log("Offset: " + offset);
    let sessionData = [];
    let limit;
    let index = 0;
    if ((offset + 6) > this.props.groupdetails.length){
      limit = this.props.groupdetails.length;
    }
    else {
      limit = offset + 6;
    }
    for (var i=offset; i<limit; i++){
      sessionData[index] = this.props.groupdetails[i];
      index++;
    }
    this.setState({groupsData: sessionData});
  }

  handlePageClick(data){
    this.setState({selectedPage: data.selected});
    this.displayData(data.selected);
  }

  add(name,description,deptagents) {
   // alert('called');
     const usertoken = auth.getToken();
     if(this.props.customers){
        this.props.creategroup({ name,description,usertoken,deptagents },this.props.customers.filter((c) => c.isMobileClient == "true"));
      }
      else{
        alert('Customers data not found!Please refresh this page');
      }
     this.setState({
      showAddGroup: false,
    });

    this.forceUpdate();
 }

 deleteGroup(group, token, customers){
   this.props.deletegroup(group, token, customers);
   let index;
   console.log(this.state.groupsData);
   console.log(group);
   for(var i=0; i<this.state.groupsData.length; i++){
     if(this.state.groupsData[i]._id === group._id){
       index = i;
     }
   }
   this.state.groupsData.splice(index,1);
   console.log(this.state.groupsData);
   this.forceUpdate();
 }

 componentWillReceiveProps(props){
  if(props.errorMessage && props.errorMessage != ''){
     this.refs.notificationSystem.addNotification({
      message: props.errorMessage,
      level: 'success'
    });

  }
 }

 componentDidUpdate(prevProps){
   if(prevProps.groupdetails != this.props.groupdetails){
    // console.log('componentDidUpdate');
     this.displayData(this.state.selectedPage);
     this.setState({totalLength: this.props.groupdetails.length});
   }
 }

  render() {
    const token = auth.getToken()
    //console.log(token)

    return (
      <div className="vbox viewport">
      <NotificationSystem ref="notificationSystem" />
       <AuthorizedHeader name = {this.props.userdetails.firstname} user={this.props.userdetails}/>

       <div className="page-container hbox space-between">

         <SideBar isAdmin ={this.props.userdetails.isAdmin}/>
          <div className="page-content-wrapper">
            <div className="page-content">

            <div className="uk-card uk-card-body uk-card-default">
              <div className="uk-card-title">
                    Groups

              </div>
          <div className="portlet-body">
             <div className="table-toolbar">
                 <div className="btn-group">
                 { (this.props.userdetails.isAdmin == "Yes") ?

                    <button id="sample_editable_1_new" className="btn green" onClick={this.handleClick}> Create New Group

                    <i className="fa fa-plus"/>
                    </button>
                 :<br/>
               }
                 </div>
              </div>

              <GroupCreateView addGroup={this.add}  showAddGroup= {this.state.showAddGroup}/>
                { this.props.groupdetails && this.props.customers && this.props.groupdetails.length > 0 ?
                  <div className="table-responsive">
                   <table id ="sample_3" className="uk-table uk-table-striped table-bordered uk-table-hover dataTable">
                   <thead>
                    <tr>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Name </th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Description </th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Created By</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Created On</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' > Options</th>
                    </tr>
                    </thead>
                    <tbody>
                      {

                        this.state.groupsData.map((group, i) => (

                          <GroupListItem group={group} key={group._id}   onDelete={() => this.deleteGroup(group,token,this.props.customers.filter((c) => c.isMobileClient == "true"))} userdetails ={this.props.userdetails}/>

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
                    <p>Currently, there is no group to show.</p>

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

Groups.propTypes = {

  errorMessage: PropTypes.string,
}
function mapStateToProps(state) {
  //console.log("mapStateToProps is called");
  //console.log(state.dashboard.userdetails);
  //console.log(state.dashboard.groupdetails);
  //console.log(state.dashboard.errorMessage);

  return {
          groupdetails:(state.dashboard.groupdetails),
          userdetails:(state.dashboard.userdetails),
          errorMessage:(state.dashboard.errorMessage),
          agents:(state.dashboard.agents),
          deptagents:(state.dashboard.deptagents),
          channels :(state.dashboard.channels),
          customers: (state.dashboard.customers),
          newagents: (state.dashboard.newagents),
           };
}


function mapDispatchToProps(dispatch) {

  return bindActionCreators({ deletegroup:deletegroup,getcustomers:getcustomers,getDeptAgents:getDeptAgents,getusergroups:getusergroups,creategroup:creategroup }, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(Groups);
