import GroupListItem from './GroupListItem';
import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getGroupRequest}  from '../../redux/actions/actions'
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import GroupCreateView from '../../components/GroupCreateView.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';

class GroupDetailView extends Component {

  constructor(props, context) {
      //call action to get user groups 
    const usertoken = auth.getToken();
     console.log('constructor is called');
    if(usertoken != null)
     {
       
        console.log(usertoken);
        console.log(props.params.id);
        props.getGroupRequest(props.params.id,usertoken);
      }
      
        super(props, context);
  
  
    
  

  }

  
  render() {
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
             {this.props.group &&
            <div className="portlet box grey-cascade">
              <div className="portlet-title">
                <div className="caption">
                    <i className="fa fa-group"/>
                    {this.props.group.deptname} Groups
                </div> 
              </div>    
        
           <div className="portlet-body">
            <div className="single-post post-detail">
              <h3 className="post-title">{this.props.group.deptname}</h3>
              <p className="author-name">By {this.props.group.deptdescription}</p>
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


GroupDetailView.contextTypes = {
  router: React.PropTypes.object,
};

GroupDetailView.propTypes = {
  group: PropTypes.shape({
    deptname: PropTypes.string,
    deptdescription: PropTypes.string,
   
  }),
  dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    group: (state.group),
  };
}

export default connect(mapStateToProps,{ getGroupRequest})(GroupDetailView);
