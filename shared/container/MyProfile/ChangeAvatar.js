import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {changepassword,uploadpicture} from '../../redux/actions/actions'

import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import ProfileSideBar from '../../components/SideBar/ProfileSideBar';
import Cropper from 'react-cropper';
import auth from '../../services/auth';
import request from 'superagent';
import { bindActionCreators } from 'redux';



const src = '';
class ChangeAvatar extends Component {

 constructor(props, context) {
      //call action to get user groups 
   
       super(props, context);
     
        this.onSubmit = this.onSubmit.bind(this);
       // this.state = {file: '',imagePreviewUrl: ''};
         this.state = {
              src : './profileImages/time.PNG',
              cropResult: null,
              image:null,
              };
        this._cropImage = this._cropImage.bind(this);
        this._onChange = this._onChange.bind(this);
        
  }

   
    
  
  _cropImage() {
    if (typeof this.refs.cropper.getCroppedCanvas() === 'undefined') {
      return;
    }
    this.setState({
      cropResult: this.refs.cropper.getCroppedCanvas().toDataURL(),
    });
  }

  _onChange(e) {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    this.setState({ image:e.target.files[0]
                       });

    const reader = new FileReader();
    reader.onload = () => {
      this.setState({ src: reader.result,
                       });
    };
    reader.readAsDataURL(files[0]);
  }

  


 _handleSubmit(e) {
    e.preventDefault();
    // TODO: do something with -> this.state.file
    console.log('handle uploading-', this.state.file);
  }

  
  onSubmit(event)
    {
       alert('i am onClick');
   
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

          console.log(this.state.image);
          /* request.put("http://localhost:8000/upload")    
            .attach("image-file", this.state.image, this.state.image.name)
            .end(function(res){
                console.log(res);
            });*/

          this.props.uploadpicture(this.state.cropResult);  
        event.preventDefault();     
        
    }


   
 

  render() {
    const token = auth.getToken()
    console.log(token)
    

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
                             
                  <div>
                    <input type="file" onChange={this._onChange} />
                    <br />
                    <div style={{float:'left'}}>
                    <Cropper
                      style={{ height: 400, width: '400' }}
                      aspectRatio={2/2}
                      preview=".img-preview"
                      guides={false}
                      src={this.state.src}
                      ref="cropper"
                      crop={this._crop}
                    />
                   </div>
                   
                    <div className="box" style={{ width: '200',height:'200',float:'right'}}>
                     
                        <button onClick={ this._cropImage } >
                          Crop Image
                        </button>
                     
                      <img style={{ width: '200',height:'200',border:'1px solid rgba(0, 0, 0, 0.26)' }} src={this.state.cropResult} ref="profilepic"/>
                    </div>
                  
                    <button onClick={ this.onSubmit } >
                          Submit
                        </button>
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
  
  return bindActionCreators({ changepassword:changepassword,uploadpicture:uploadpicture}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(ChangeAvatar);
