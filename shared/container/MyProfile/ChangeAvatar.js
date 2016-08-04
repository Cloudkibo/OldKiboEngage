import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {changepassword} from '../../redux/actions/actions'

import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import ProfileSideBar from '../../components/SideBar/ProfileSideBar';

import auth from '../../services/auth';
import { bindActionCreators } from 'redux';





class ChangeAvatar extends Component {

 constructor(props, context) {
      //call action to get user groups 
   
       super(props, context);
     
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {file: '',imagePreviewUrl: ''};
   

   
    
  }
 _handleSubmit(e) {
    e.preventDefault();
    // TODO: do something with -> this.state.file
    console.log('handle uploading-', this.state.file);
  }

  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(file)
  }

  onSubmit(event)
    {
      /* const usertoken = auth.getToken();
       event.preventDefault();
       if(this.refs.cpwd.value != '' && this.refs.cpwd.value.length >= 6 && this.refs.cpwd.value != '' && this.refs.cpwd.value.length && this.refs.npwd.value != '' && this.refs.npwd.value.length >=6)
       {
                    var user = {
                         'email' : this.props.userdetails.email,
                         'password' : this.refs.cpwd.value,
                         'newpassword' :this.refs.npwd.value                    
                  }
                  console.log(user);

                  this.props.changepassword(user,usertoken);
        
       }*/
               
        
    }


   
 

  render() {
    const token = auth.getToken()
    console.log(token)
    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} />);
    } else {
      $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
    }

    return (
      <div>
       <AuthorizedHeader name = {this.props.userdetails.firstname} />
    
       <div className="page-container">

         <SideBar isAdmin ={this.props.userdetails.isAdmin}/> 
          <div className="page-content-wrapper">
           
            <div className="page-content">
              <div className="row">
                <div className="col-md-12">
                    <h3 className ="page-title">My Profile </h3>
                     <ul className="page-breadcrumb breadcrumb">
                      <li>
                        <i className="fa fa-home"/>
                        <Link to="/dashboard"> Dashboard </Link>
                       
                      </li>                  
                      <li>
                        <Link to="/myprofile"> Profile </Link>
                      </li>               
      
                    </ul>
                </div>
              </div>      
          <div className="row profile-account">
                <ProfileSideBar iscurrent="changeavatar"/>
          <div className="col-md-9">
            <div className="portlet box">
            <div className="portlet body">
               <h1>Your Display Picture</h1>
              
                    <div className="previewComponent">
                        <form onSubmit={(e)=>this._handleSubmit(e)}>
                          <input className="fileInput" type="file" onChange={(e)=>this._handleImageChange(e)} />
                          <button className="submitButton" type="submit" onClick={(e)=>this._handleSubmit(e)}>Upload Image</button>
                        </form>
                        <div className="imgPreview">
                          {$imagePreview}
                        </div>
                     </div>
                    
            </div>
            </div>
          </div>
       </div>

       </div> 
      </div>
      </div> 
      </div>
  )
  }
}


function mapStateToProps(state) {
  
  return {
          groupdetails:(state.dashboard.groupdetails),
          userdetails:(state.dashboard.userdetails),
          errorMessageProfile:(state.dashboard.errorMessageProfile),
          agents:(state.dashboard.agents),
          deptagents:(state.dashboard.deptagents),
          channels :(state.dashboard.channels),
          mygroupdetails:(state.dashboard.mygroupdetails),
           };
}


function mapDispatchToProps(dispatch) {
  
  return bindActionCreators({ changepassword:changepassword}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(ChangeAvatar);
