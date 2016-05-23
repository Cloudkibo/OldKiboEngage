import GroupListItem from './GroupListItem';
import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {getusergroups} from '../../redux/actions/actions'
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
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
    
    
  }
  render() {
    const { groupdetails } = this.props

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
                <h1>Groups</h1>
                { this.props.groupdetails &&
                   <table className="listView">
                   <tr>
                    <th>Name </th>
                    <th>Description </th>
                    <th>Created By</th>
                    <th>Created On</th>
                    <th>Options </th>
                    </tr>                    
                      {

                        this.props.groupdetails.map((group, i) => (
                          <GroupListItem group={group} key={group._id}/>
                         
                      
                        ))
                      }
                    </table>
                }
                
            </div>
          </div>
       </div>
       </div> 
  )
  }
}



function mapStateToProps(state) {
  console.log("mapStateToProps is called");
  console.log(state.dashboard.userdetails);
  console.log(state.dashboard.groupdetails);

  return {
          groupsdetails:(state.dashboard.groupsdetails),
          userdetails:(state.dashboard.userdetails)
           };
}

export default connect(mapStateToProps,{getusergroups })(Groups);