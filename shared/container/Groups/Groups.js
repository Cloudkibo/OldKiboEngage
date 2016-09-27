import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import GroupListItem from './GroupListItem';
import {getgroups} from '../../redux/actions/actions'
import {deletegroup,joingroup,getGroupAgents} from '../../redux/actions/actions'

import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router'
const PureRenderMixin = require('react-addons-pure-render-mixin');  
import Immutable from 'immutable';

class Groups extends Component {

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
        props.getgroups(usertoken);
        props.getGroupAgents(usertoken);
       
      }
    super(props, context);
  
     this.state = { 
      data: Immutable.List(),
      filteredData: Immutable.List(),
    };
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);


    
  }

  componentWillReceiveProps(props){
    if(props.groupdetails){
       this.setState({ 
      data: Immutable.fromJS(props.groupdetails).toList(),
      filteredData: Immutable.fromJS(props.groupdetails).toList() 
    });
    }
  }

  filterData(event) {
    event.preventDefault();
    const regex = new RegExp(event.target.value, 'i');
    const filtered = this.state.data.filter(function(datum) {
      return (datum.get('groupname').search(regex) > -1);
    });

    this.setState({
      filteredData: filtered,
    });
  }

  render() {
    const token = auth.getToken()
    console.log(token)
    const { filteredData } = this.state;
    return (
      <div>
       <AuthorizedHeader name = {this.props.userdetails.firstname} />
    
       <div className="page-container">
         <SideBar isAdmin ={this.props.userdetails.isAdmin}/> 
          <div className="page-content-wrapper">
            <div className="page-content"> 
              <h3 className ="page-title">Groups Management </h3>
            <ul className="page-breadcrumb breadcrumb">
                  <li>
                    <i className="fa fa-home"/>
                    <Link to="/dashboard"> Dashboard </Link>
                    <i className="fa fa-angle-right"/> 
                  </li>                  
                  <li>
                               <Link to="/groups">Groups Management</Link>
                  </li>               
  
            </ul>
            <div className="portlet box grey-cascade">
              <div className="portlet-title">
                <div className="caption">
                    <i className="fa fa-groups"/>
                   Groups
                </div> 
              </div>    
        
           <div className="portlet-body">
             <div className="table-toolbar">
                 <div className="btn-team">
                 
                    <Link id="sample_editable_1_new" className="btn green" to='/creategroup'> Create Group
                    <i className="fa fa-plus"/>
                    </Link>
                
                    
                    
                 
                 </div>
              </div>
                      <input
                              type="text"
                              className="form-control"
                              onChange={ this.filterData.bind(this) }
                              placeholder="Search" />
               {this.props.errorMessage &&

                     <div className = "alert alert-success"><span>{this.props.errorMessage}</span></div>
                      }
                { this.props.groupdetails &&
                   <table id ="sample_3" className="table table-striped table-bordered table-hover dataTable">
                   <thead>
                    <tr>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Name </th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Description</th>
                     <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Created By</th>
                   
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Created On</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Status </th>
                    
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' > Options</th>
                    
                    </tr>
                    </thead>

                    <tbody>                    
                       {
                        this.props.groupagents && filteredData && filteredData.map((group, i) => (

                          <GroupListItem group={group} key={group.get('_id')}  groupagents = {this.props.groupagents} onDelete={() => this.props.deletegroup(group,token)} userdetails ={this.props.userdetails} onJoin={() => this.props.joingroup(group,this.props.userdetails._id,token)} />
                                                      
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

Groups.propTypes = {

  errorMessage: PropTypes.string,
}
function mapStateToProps(state) {
  console.log("mapStateToProps is called");
  return {
          channels:(state.dashboard.channels),
          userdetails:(state.dashboard.userdetails),
          teamdetails :(state.dashboard.teamdetails),
          errorMessage:(state.dashboard.errorMessage),
          agents:(state.dashboard.agents),
          groupagents : (state.dashboard.groupagents),
          groupdetails :(state.dashboard.groupdetails),
          
          deptagents:(state.dashboard.deptagents),

           };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({getgroups:getgroups,deletegroup:deletegroup,getGroupAgents:getGroupAgents,joingroup:joingroup}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(Groups);



