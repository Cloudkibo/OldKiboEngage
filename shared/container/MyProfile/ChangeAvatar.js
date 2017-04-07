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
import { bindActionCreators } from 'redux';




const src = '';
class ChangeAvatar extends Component {

 constructor(props, context) {
      //call action to get user teams 
   
       super(props, context);
     
        this.onSubmit = this.onSubmit.bind(this);
       // this.state = {file: '',imagePreviewUrl: ''};
         this.state = {
              src : '',
              cropResult: null,
              image:null,
              };
        this._cropImage = this._cropImage.bind(this);
        this._onChange = this._onChange.bind(this);
        
  }

   
    
  
  _cropImage() {
   this.refs.submitbtn.disabled = false;
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

  onSubmit(event)
    {
        const usertoken = auth.getToken();
        console.log(this.state.image);
        if(this.state.image == null){
          alert('Please upload picture');
        }
        else if(this.state.cropResult == null && this.state.image != null ){
          alert('Please crop picture first');
        }
        else{

        this.props.uploadpicture(this.state.cropResult,this.state.image.name,usertoken,this.props.userdetails.picture); 
        } 
        event.preventDefault();     
        
    }


  render() {
    const token = auth.getToken()
    console.log(token)
    

    return (
      <div>
       <AuthorizedHeader name = {this.props.userdetails.firstname} user={this.props.userdetails}/>
    
       <div className="page-container">

         <SideBar isAdmin ={this.props.userdetails.isAdmin}/> 
          <div className="page-content-wrapper">
           
            <div className="page-content">
              <div className="row">
                <div className="col-md-12">
                    <h3 className ="page-title">Change Avatar</h3>
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
                  {this.props.userdetails.picture &&
                    <div>
                    <h1> Your Profile Picture</h1>
                    <img  style={{ height: '200', width: '200' }} src = {'./profileImages/'+ this.props.userdetails.picture}/>
                    </div>
                  }
                  <div className="row">
                    <label> Upload new image </label>
                    <input type="file" onChange={this._onChange} accept='image/*' />
                    <br />
                    <div style={{height: '400', width: '400'}}>
                    <Cropper
                      style={{ height: '400', width: '400' }}
                      aspectRatio={2/2}
                      preview=".img-preview"
                      guides={false}
                      src={this.state.src}
                      ref="cropper"
                      crop={this._crop}
                    />

                    <br/>
                      <button onClick={ this._cropImage } className="btn green" >
                          Crop Image
                        </button>

                   </div>
                   <br/>
                   <br/>
                   <br/>
                   <br/>
                    <div className="row" >
                      <h4> Preview Picture</h4>
                      <img style={{ width: '200',height:'200',border:'1px solid rgba(0, 0, 0, 0.26)',display:'block' }} src={this.state.cropResult} ref="profilepic"/>
                    </div>
                  
                    
                  </div>
                  </div>
                  <br/>
                  <div className="row">
                  <button onClick={ this.onSubmit } ref="submitbtn" className="btn green" >
                          Submit
                  </button>
                  <br/>
                   {this.props.errorMessageProfile && this.props.errorMessageProfile.status == "danger" &&
                                                 <div className = "alert alert-danger"><span>{this.props.errorMessageProfile.message}</span></div>
                                              }

                                              {this.props.errorMessageProfile && this.props.errorMessageProfile.status == "success" &&
                                                 <div className = "alert alert-success"><span>{this.props.errorMessageProfile.message}</span></div>
                                              }

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
          teamdetails:(state.dashboard.teamdetails),
          userdetails:(state.dashboard.userdetails),
          errorMessageProfile:(state.dashboard.errorMessageProfile),
          agents:(state.dashboard.agents),
          deptagents:(state.dashboard.deptagents),
          subgroups :(state.dashboard.subgroups),
          myteamdetails:(state.dashboard.myteamdetails),
           };
}


function mapDispatchToProps(dispatch) {
  
  return bindActionCreators({ changepassword:changepassword,uploadpicture:uploadpicture}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(ChangeAvatar);
