import GroupListItem from './GroupListItem';
import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {getusergroups} from '../../redux/actions/actions'
import {creategroup} from '../../redux/actions/actions'
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import GroupCreateView from '../../components/GroupCreateView.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
class Groups extends Component {

 constructor(props, context) {
      //call action to get user groups 
    const usertoken = auth.getToken();
     console.log('componentWillMount is called');
    if(usertoken != null)
    {
       
        console.log(usertoken);
        props.getusergroups(usertoken)
      }
      
        super(props, context);
  
    this.state = {
      showAddGroup: false,
    };

    this.handleClick = this.handleClick.bind(this);
    this.add = this.add.bind(this);
  
    
  }

   handleClick(e) {

      this.setState({
      showAddGroup: !this.state.showAddGroup,
    });
  e.preventDefault();
  }

  add(name,description) {
     const usertoken = auth.getToken();
    this.props.creategroup({ name,description,usertoken });
     this.setState({
      showAddGroup: false,
    });
 }
  render() {
//    const { groupdetails } = this.props
     const { errorMessage } = this.props

    //alert(this.props.groupdetails)
    console.log(this.props.userdetails.firstname)
    const token = auth.getToken()
    console.log(token)
    console.log(this.props.groupdetails)
    
    return (
      <div>
       <div className="page-container">
         <SideBar/> 
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
                               <Link to="/groups"> Groups Management</Link>
                  </li>               
  
            </ul>
            <div className="portlet box grey-cascade">
              <div className="portlet-title">
                <div className="caption">
                    <i className="fa fa-group"/>
                    Groups
                </div> 
              </div>    
        
           <div className="portlet-body">
             <div className="table-toolbar">
                 <div className="btn-group">
                    <button id="sample_editable_1_new" className="btn green" onClick={this.handleClick}> Create New Group
                    <i className="fa fa-plus"/>
                    </button>
                 </div>
              </div>
               {this.props.errorMessage &&

                  alert(this.props.errorMessage) 
                      }
              <GroupCreateView addGroup={this.add}  showAddGroup= {this.state.showAddGroup}/>      
                { this.props.groupdetails &&
                   <table id ="sample_3" className="table table-striped table-bordered table-hover dataTable">
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
                        this.props.groupdetails.map((group, i) => (
                          <GroupListItem group={group} key={group._id}/>
                         
                      
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

  errorMessage: PropTypes.string
}
function mapStateToProps(state) {
  console.log("mapStateToProps is called");
  console.log(state.dashboard.userdetails);
  console.log(state.dashboard.groupdetails);

  return {
          groupdetails:(state.dashboard.groupdetails),
          userdetails:(state.dashboard.userdetails)
           };
}

export default connect(mapStateToProps,{getusergroups,creategroup})(Groups);
