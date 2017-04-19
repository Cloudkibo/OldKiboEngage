import React, { Component, PropTypes } from 'react';
import auth from '../../services/auth';
import {createcustomer}  from '../../redux/actions/actions'
import {getcustomergroups}  from '../../redux/actions/actions'
import {getcustomersubgroups,getcompanylogo,getspecificsession,getspecificcustomer}  from '../../redux/actions/actions'
import {getcountryname} from '../../redux/actions/actions';
import {updatesubgrouplist}  from '../../redux/actions/actions'
import {createsession}  from '../../redux/actions/actions'
import {addRoom} from '../../redux/actions/actions'
import { connect } from 'react-redux';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import { Link } from 'react-router';
import { browserHistory } from 'react-router'

const Countries = [
  {name: 'Afghanistan', code: 'AF'},
  {name: 'Åland Islands', code: 'AX'},
  {name: 'Albania', code: 'AL'},
  {name: 'Algeria', code: 'DZ'},
  {name: 'American Samoa', code: 'AS'},
  {name: 'AndorrA', code: 'AD'},
  {name: 'Angola', code: 'AO'},
  {name: 'Anguilla', code: 'AI'},
  {name: 'Antarctica', code: 'AQ'},
  {name: 'Antigua and Barbuda', code: 'AG'},
  {name: 'Argentina', code: 'AR'},
  {name: 'Armenia', code: 'AM'},
  {name: 'Aruba', code: 'AW'},
  {name: 'Australia', code: 'AU'},
  {name: 'Austria', code: 'AT'},
  {name: 'Azerbaijan', code: 'AZ'},
  {name: 'Bahamas', code: 'BS'},
  {name: 'Bahrain', code: 'BH'},
  {name: 'Bangladesh', code: 'BD'},
  {name: 'Barbados', code: 'BB'},
  {name: 'Belarus', code: 'BY'},
  {name: 'Belgium', code: 'BE'},
  {name: 'Belize', code: 'BZ'},
  {name: 'Benin', code: 'BJ'},
  {name: 'Bermuda', code: 'BM'},
  {name: 'Bhutan', code: 'BT'},
  {name: 'Bolivia', code: 'BO'},
  {name: 'Bosnia and Herzegovina', code: 'BA'},
  {name: 'Botswana', code: 'BW'},
  {name: 'Bouvet Island', code: 'BV'},
  {name: 'Brazil', code: 'BR'},
  {name: 'British Indian Ocean Territory', code: 'IO'},
  {name: 'Brunei Darussalam', code: 'BN'},
  {name: 'Bulgaria', code: 'BG'},
  {name: 'Burkina Faso', code: 'BF'},
  {name: 'Burundi', code: 'BI'},
  {name: 'Cambodia', code: 'KH'},
  {name: 'Cameroon', code: 'CM'},
  {name: 'Canada', code: 'CA'},
  {name: 'Cape Verde', code: 'CV'},
  {name: 'Cayman Islands', code: 'KY'},
  {name: 'Central African Republic', code: 'CF'},
  {name: 'Chad', code: 'TD'},
  {name: 'Chile', code: 'CL'},
  {name: 'China', code: 'CN'},
  {name: 'Christmas Island', code: 'CX'},
  {name: 'Cocos (Keeling) Islands', code: 'CC'},
  {name: 'Colombia', code: 'CO'},
  {name: 'Comoros', code: 'KM'},
  {name: 'Congo', code: 'CG'},
  {name: 'Congo, The Democratic Republic of the', code: 'CD'},
  {name: 'Cook Islands', code: 'CK'},
  {name: 'Costa Rica', code: 'CR'},
  {name: 'Cote D\'Ivoire', code: 'CI'},
  {name: 'Croatia', code: 'HR'},
  {name: 'Cuba', code: 'CU'},
  {name: 'Cyprus', code: 'CY'},
  {name: 'Czech Republic', code: 'CZ'},
  {name: 'Denmark', code: 'DK'},
  {name: 'Djibouti', code: 'DJ'},
  {name: 'Dominica', code: 'DM'},
  {name: 'Dominican Republic', code: 'DO'},
  {name: 'Ecuador', code: 'EC'},
  {name: 'Egypt', code: 'EG'},
  {name: 'El Salvador', code: 'SV'},
  {name: 'Equatorial Guinea', code: 'GQ'},
  {name: 'Eritrea', code: 'ER'},
  {name: 'Estonia', code: 'EE'},
  {name: 'Ethiopia', code: 'ET'},
  {name: 'Falkland Islands (Malvinas)', code: 'FK'},
  {name: 'Faroe Islands', code: 'FO'},
  {name: 'Fiji', code: 'FJ'},
  {name: 'Finland', code: 'FI'},
  {name: 'France', code: 'FR'},
  {name: 'French Guiana', code: 'GF'},
  {name: 'French Polynesia', code: 'PF'},
  {name: 'French Southern Territories', code: 'TF'},
  {name: 'Gabon', code: 'GA'},
  {name: 'Gambia', code: 'GM'},
  {name: 'Georgia', code: 'GE'},
  {name: 'Germany', code: 'DE'},
  {name: 'Ghana', code: 'GH'},
  {name: 'Gibraltar', code: 'GI'},
  {name: 'Greece', code: 'GR'},
  {name: 'Greenland', code: 'GL'},
  {name: 'Grenada', code: 'GD'},
  {name: 'Guadeloupe', code: 'GP'},
  {name: 'Guam', code: 'GU'},
  {name: 'Guatemala', code: 'GT'},
  {name: 'Guernsey', code: 'GG'},
  {name: 'Guinea', code: 'GN'},
  {name: 'Guinea-Bissau', code: 'GW'},
  {name: 'Guyana', code: 'GY'},
  {name: 'Haiti', code: 'HT'},
  {name: 'Heard Island and Mcdonald Islands', code: 'HM'},
  {name: 'Holy See (Vatican City State)', code: 'VA'},
  {name: 'Honduras', code: 'HN'},
  {name: 'Hong Kong', code: 'HK'},
  {name: 'Hungary', code: 'HU'},
  {name: 'Iceland', code: 'IS'},
  {name: 'India', code: 'IN'},
  {name: 'Indonesia', code: 'ID'},
  {name: 'Iran, Islamic Republic Of', code: 'IR'},
  {name: 'Iraq', code: 'IQ'},
  {name: 'Ireland', code: 'IE'},
  {name: 'Isle of Man', code: 'IM'},
  {name: 'Israel', code: 'IL'},
  {name: 'Italy', code: 'IT'},
  {name: 'Jamaica', code: 'JM'},
  {name: 'Japan', code: 'JP'},
  {name: 'Jersey', code: 'JE'},
  {name: 'Jordan', code: 'JO'},
  {name: 'Kazakhstan', code: 'KZ'},
  {name: 'Kenya', code: 'KE'},
  {name: 'Kiribati', code: 'KI'},
  {name: 'Korea, Democratic People\'S Republic of', code: 'KP'},
  {name: 'Korea, Republic of', code: 'KR'},
  {name: 'Kuwait', code: 'KW'},
  {name: 'Kyrgyzstan', code: 'KG'},
  {name: 'Lao People\'S Democratic Republic', code: 'LA'},
  {name: 'Latvia', code: 'LV'},
  {name: 'Lebanon', code: 'LB'},
  {name: 'Lesotho', code: 'LS'},
  {name: 'Liberia', code: 'LR'},
  {name: 'Libyan Arab Jamahiriya', code: 'LY'},
  {name: 'Liechtenstein', code: 'LI'},
  {name: 'Lithuania', code: 'LT'},
  {name: 'Luxembourg', code: 'LU'},
  {name: 'Macao', code: 'MO'},
  {name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK'},
  {name: 'Madagascar', code: 'MG'},
  {name: 'Malawi', code: 'MW'},
  {name: 'Malaysia', code: 'MY'},
  {name: 'Maldives', code: 'MV'},
  {name: 'Mali', code: 'ML'},
  {name: 'Malta', code: 'MT'},
  {name: 'Marshall Islands', code: 'MH'},
  {name: 'Martinique', code: 'MQ'},
  {name: 'Mauritania', code: 'MR'},
  {name: 'Mauritius', code: 'MU'},
  {name: 'Mayotte', code: 'YT'},
  {name: 'Mexico', code: 'MX'},
  {name: 'Micronesia, Federated States of', code: 'FM'},
  {name: 'Moldova, Republic of', code: 'MD'},
  {name: 'Monaco', code: 'MC'},
  {name: 'Mongolia', code: 'MN'},
  {name: 'Montserrat', code: 'MS'},
  {name: 'Morocco', code: 'MA'},
  {name: 'Mozambique', code: 'MZ'},
  {name: 'Myanmar', code: 'MM'},
  {name: 'Namibia', code: 'NA'},
  {name: 'Nauru', code: 'NR'},
  {name: 'Nepal', code: 'NP'},
  {name: 'Netherlands', code: 'NL'},
  {name: 'Netherlands Antilles', code: 'AN'},
  {name: 'New Caledonia', code: 'NC'},
  {name: 'New Zealand', code: 'NZ'},
  {name: 'Nicaragua', code: 'NI'},
  {name: 'Niger', code: 'NE'},
  {name: 'Nigeria', code: 'NG'},
  {name: 'Niue', code: 'NU'},
  {name: 'Norfolk Island', code: 'NF'},
  {name: 'Northern Mariana Islands', code: 'MP'},
  {name: 'Norway', code: 'NO'},
  {name: 'Oman', code: 'OM'},
  {name: 'Pakistan', code: 'PK'},
  {name: 'Palau', code: 'PW'},
  {name: 'Palestinian Territory, Occupied', code: 'PS'},
  {name: 'Panama', code: 'PA'},
  {name: 'Papua New Guinea', code: 'PG'},
  {name: 'Paraguay', code: 'PY'},
  {name: 'Peru', code: 'PE'},
  {name: 'Philippines', code: 'PH'},
  {name: 'Pitcairn', code: 'PN'},
  {name: 'Poland', code: 'PL'},
  {name: 'Portugal', code: 'PT'},
  {name: 'Puerto Rico', code: 'PR'},
  {name: 'Qatar', code: 'QA'},
  {name: 'Reunion', code: 'RE'},
  {name: 'Romania', code: 'RO'},
  {name: 'Russian Federation', code: 'RU'},
  {name: 'RWANDA', code: 'RW'},
  {name: 'Saint Helena', code: 'SH'},
  {name: 'Saint Kitts and Nevis', code: 'KN'},
  {name: 'Saint Lucia', code: 'LC'},
  {name: 'Saint Pierre and Miquelon', code: 'PM'},
  {name: 'Saint Vincent and the Grenadines', code: 'VC'},
  {name: 'Samoa', code: 'WS'},
  {name: 'San Marino', code: 'SM'},
  {name: 'Sao Tome and Principe', code: 'ST'},
  {name: 'Saudi Arabia', code: 'SA'},
  {name: 'Senegal', code: 'SN'},
  {name: 'Serbia and Montenegro', code: 'CS'},
  {name: 'Seychelles', code: 'SC'},
  {name: 'Sierra Leone', code: 'SL'},
  {name: 'Singapore', code: 'SG'},
  {name: 'Slovakia', code: 'SK'},
  {name: 'Slovenia', code: 'SI'},
  {name: 'Solomon Islands', code: 'SB'},
  {name: 'Somalia', code: 'SO'},
  {name: 'South Africa', code: 'ZA'},
  {name: 'South Georgia and the South Sandwich Islands', code: 'GS'},
  {name: 'Spain', code: 'ES'},
  {name: 'Sri Lanka', code: 'LK'},
  {name: 'Sudan', code: 'SD'},
  {name: 'Suriname', code: 'SR'},
  {name: 'Svalbard and Jan Mayen', code: 'SJ'},
  {name: 'Swaziland', code: 'SZ'},
  {name: 'Sweden', code: 'SE'},
  {name: 'Switzerland', code: 'CH'},
  {name: 'Syrian Arab Republic', code: 'SY'},
  {name: 'Taiwan, Province of China', code: 'TW'},
  {name: 'Tajikistan', code: 'TJ'},
  {name: 'Tanzania, United Republic of', code: 'TZ'},
  {name: 'Thailand', code: 'TH'},
  {name: 'Timor-Leste', code: 'TL'},
  {name: 'Togo', code: 'TG'},
  {name: 'Tokelau', code: 'TK'},
  {name: 'Tonga', code: 'TO'},
  {name: 'Trinidad and Tobago', code: 'TT'},
  {name: 'Tunisia', code: 'TN'},
  {name: 'Turkey', code: 'TR'},
  {name: 'Turkmenistan', code: 'TM'},
  {name: 'Turks and Caicos Islands', code: 'TC'},
  {name: 'Tuvalu', code: 'TV'},
  {name: 'Uganda', code: 'UG'},
  {name: 'Ukraine', code: 'UA'},
  {name: 'United Arab Emirates', code: 'AE'},
  {name: 'United Kingdom', code: 'GB'},
  {name: 'United States', code: 'US'},
  {name: 'United States Minor Outlying Islands', code: 'UM'},
  {name: 'Uruguay', code: 'UY'},
  {name: 'Uzbekistan', code: 'UZ'},
  {name: 'Vanuatu', code: 'VU'},
  {name: 'Venezuela', code: 'VE'},
  {name: 'Viet Nam', code: 'VN'},
  {name: 'Virgin Islands, British', code: 'VG'},
  {name: 'Virgin Islands, U.S.', code: 'VI'},
  {name: 'Wallis and Futuna', code: 'WF'},
  {name: 'Western Sahara', code: 'EH'},
  {name: 'Yemen', code: 'YE'},
  {name: 'Zambia', code: 'ZM'},
  {name: 'Zimbabwe', code: 'ZW'}
];

/*import io from 'socket.io-client'
let socket = io('')*/

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}



var call_customer_details;
class AddCustomer extends Component {
   constructor(props, context) {
    var usertoken = auth.getToken();
    var appid = '5wdqvvi8jyvfhxrxmu73dxun9za8x5u6n59'
    var appsecret = 'jcmhec567tllydwhhy2z692l79j8bkxmaa98do1bjer16cdu5h79xvx'
    props.getcustomergroups(appid,appsecret,props.params.id);
    props.getcustomersubgroups(appid,appsecret,props.params.id);
    props.getcompanylogo(appid,appsecret,props.params.id);
    super(props, context);
    call_customer_details = false;
   // var pathname = getParameterByName('pathname');
    //var fullurl = getParameterByName('fullurl');
   // var companyid = getParameterByName('id');
    var companyid = props.params.id;
    var pathname = props.params.pathname;
    console.log(pathname)
   // console.log(fullurl)
    console.log(companyid)
    if(props.params.requestid){
      //alert(props.params.requestid);
      props.getspecificsession(props.params.requestid);
    }
    //console.log(props.params.pathname);
   // console.log(props.params.id);
    this.addCustomers = this.addCustomers.bind(this);
    this.create_session = this.create_session.bind(this);
    this.noagent = this.noagent.bind(this);
  }
  noagent(data){
    alert('We are offline now.We will contact you soon');


    //creating abandoned session
      const name = this.refs.name;
      const email = this.refs.email;
      const country = this.refs.country;
      const phone = this.refs.phone;
     // var companyid = getParameterByName('id');
     // var pathname = getParameterByName('pathname');
     /* var fullurl = getParameterByName('fullurl'); */

    var companyid = this.props.params.id;
    var pathname = this.props.params.pathname;
  //    var pathname = "";
      var fullurl = "";


     var session = {
                        'email' : email.value,
                        'customerID' : email.value,
                        'departmentid': this.refs.grouplist.value,
                        'messagechannel' : this.refs.channellist.value,
                        'requesttime' : Date.now(),
                        'fullurl' :  fullurl,
                        'currentPage' : pathname,
                        'phone' :  phone.value,
                        'browser' : 'Chrome',
                        'ipAddress':'192.168.1.2',
                        'agent_ids':'',
                        'country' : country.value,
                        'companyid' : companyid,
                        'session_id' : data.request_id,
                        'platform': 'web',
                        'customerName' : name.value,
                        'isMobile' : "false",
                        'status' : 'new',
                        'socketid' : data.socketid,

                         }


    this.props.createsession(session); //added to create abandoned session
    browserHistory.push('/');
  }
create_session(data){
      const name = this.refs.name;
      const email = this.refs.email;
      const country = this.refs.country;
      const phone = this.refs.phone;
     // var companyid = getParameterByName('id');
     // var pathname = getParameterByName('pathname');
     /* var fullurl = getParameterByName('fullurl'); */

    var companyid = this.props.params.id;
    var pathname = this.props.params.pathname;
  //    var pathname = "";
      var fullurl = "";


      var session = {
                      'email' : email.value,
                      'departmentid': this.refs.grouplist.value,
                      'messagechannel' : this.refs.channellist.value,
                      'requesttime' : Date.now(),
                      'fullurl' :  fullurl,
                      'customerID' : email.value, //new field added
                      'currentPage' : pathname,
                      'phone' :  phone.value,
                      'browser' : 'Chrome',
                      'ipAddress':'192.168.1.2',
                      'agent_ids':'',
                      'country' : country.value,
                      'companyid' : companyid,
                      'session_id' : data.request_id,
                      'platform': 'web',
                      'customerName' : name.value,
                      'isMobile' : "false",
                      'status' : 'new',
                      'socketid' : data.socketid,

                         }



        this.props.createsession(session);
        this.props.addRoom(data);


  }


   componentWillReceiveProps(props) {

    // bind the channel list of first group on load
    if(props.groupdetails  && props.groupdetails.length > 0 && props.subgroups.length > 0 && !props.params.requestid && call_customer_details == false ){
      //alert(props.groupdetails[0]._id);
      this.props.updatesubgrouplist(props.groupdetails[0]._id);
       call_customer_details = true;
      this.forceUpdate();
    }
    else if(props.specificsession && props.channels && props.groupdetails  && call_customer_details == false){
     /* var dept_name = '';
      for(var i = 0;i< props.groupdetails.length;i++){
        if(props.groupdetails[i]._id == props.specificsession.departmentid)
        {
            dept_name = props.groupdetails[i].deptname;
        }
      }*/
      this.refs.grouplist.value = props.specificsession.departmentid;
      this.props.updatesubgrouplist(props.specificsession.departmentid);
      this.props.getspecificcustomer(props.specificsession.customerid);

      call_customer_details = true;
     // this.refs.channellist.value = props.specificsession.messagechannel[props.specificsession.messagechannel.length -1];

     // this.forceUpdate();
    }
    if(props.specificcustomer){
      this.refs.grouplist.value = props.specificsession.departmentid;
      this.refs.channellist.value = props.specificsession.messagechannel[props.specificsession.messagechannel.length -1];
      //alert(this.refs.channellist.value)
      this.refs.name.value = props.specificcustomer.name;
      this.refs.email.value = props.specificcustomer.email;
      this.refs.country.value = props.specificcustomer.country;
      this.refs.phone.value = props.specificcustomer.phone;
      this.forceUpdate()
    }

    if(this.props.companylogo && this.props.companylogo!= ''){
     // alert(props.companylogo);
      this.refs.logo.src = this.props.companylogo.substr(1,this.props.companylogo.length);
     // this.forceUpdate();
    }

    }
   componentDidMount() {
  // socket.on('joined',this.create_session)
    var usertoken = auth.getToken();
    this.props.getcountryname(usertoken);
    this.props.route.socket.on('empty',this.noagent);

   this.props.route.socket.on('joined',this.create_session)

   if(this.props.specificsession){
     //  this.props.getspecificcustomer(this.props.specificsession.customerid);

    }

      }

  addCustomers(e) {
    e.preventDefault();
   // var companyid = getParameterByName('id');

   // var pathname = getParameterByName('pathname');
    /*var fullurl = getParameterByName('fullurl');
       */
//    var companyid = this.props.params.id;
   // var pathname = "";
    var companyid = this.props.params.id;
    var pathname = this.props.params.pathname;
    var fullurl = "";

    const name = this.refs.name;
    const email = this.refs.email;
    const country = this.refs.country;
    const phone = this.refs.phone;
    const btn = this.refs.btn

    //Code used for creating dummy customers
     if (name.value === "" || name.value == null) {

        return alert('Name is required.');
      }
      else if (email.value === "" || email.value == null) {

        return alert('Email is required.');
      }
      else
        {
            var requesttime = Date.now();

            btn.disabled=true;

            var today = new Date();
            var uid = Math.random().toString(36).substring(7);
            var unique_id = 'h' + uid + '' + today.getFullYear() + '' + (today.getMonth()+1) + '' + today.getDate() + '' + today.getHours() + '' + today.getMinutes() + '' + today.getSeconds();
            var chArray = []
            chArray.push(this.refs.channellist.value);
            var agIds = []
            var customerid = {'customerID' : email.value,'name' : name.value,'email' : email.value,'country' : country.value,'phone' : phone.value,'companyid' : companyid,'isMobileClient':"false"}
            var socketsession =  {
                    customerid : customerid,
                    departmentid : this.refs.grouplist.value,
                    platform : "web",
                    agent_ids : agIds,
                    group:this.refs.grouplist.options[this.refs.grouplist.selectedIndex].text,
                    messagechannel : chArray,
                    channelname: this.refs.channellist.options[this.refs.channellist.selectedIndex].text,
                    fullurl :  fullurl,
                    currentPage : pathname,
                    phone :  phone.value,
                    requesttime:Date.now(),
                    status : "new",
                    browser : 'Chrome',
                    ipAddress:'192.168.1.2',
                    is_rescheduled:"false",
                    initiator : 'visitor',
                    companyid : companyid,
                    room: companyid,
                    request_id : unique_id,
                    webrtc_browser :'true',
                    msg : 'User joined session',
             };
        //    socket.emit('join meeting',socketsession);
           this.props.route.socket.emit('join meeting',socketsession);

         //  this.props.route.socket.on('customer_joined',data => create_session(data));



        }


    //code for actual customers joining live help
  }


  handleChange(e){
    //alert(this.refs.grouplist.options[this.refs.grouplist.selectedIndex].text);
     this.props.updatesubgrouplist(e.target.value);
      this.forceUpdate();

    }
    handleChannelChange(e){
     //alert(e.target.value);

    }
  render() {
    console.log(Countries);
   {this.props.roomdetails &&
    browserHistory.push('/clientchat')}
    return (

      <div>

       <div className="page-container">
       <div className="widgetheader">
          <div style={{'paddingTop':'2em'}}>

              <h3 className ="page-title widgettitle">KiboEngage Chat Widget </h3>
              {this.props.companylogo && this.props.companylogo != '' &&
               <img ref="logo" src="" style={{'width':'50px','height':'50px'}} className="pull-left"/>
              }

            </div>
        </div>
          <div className="page-content-wrapper clear-fix">
            <div className="page-content">

                {this.props.errorMessage &&

                     <div className = "alert alert-danger"><span>{this.props.errorMessage}</span></div>
                      }


            <div className="portlet box grey-cascade">
              <div className="portlet-title">
                <div className="caption">
                    <i className="fa fa-user"/>
                  Welcome to Live Help
                </div>
              </div>

           <div className="portlet-body form">
            <form className="form-horizontal form-row-seperated">
              <div className="form-body">
                <div className="form-group">
                  <label className="control-label col-md-3"> Name </label>
                   <div className="col-md-9">
                         <input className="form-control input-medium" type='text'  ref = "name" />
                   </div>
                </div>

                 <div className="form-group">
                  <label className="control-label col-md-3"> Email</label>
                   <div className="col-md-9">
                            <input className="form-control input-medium" type='email'  ref = "email" />
                </div>
                </div>

                  <div className="form-group">
                  <label className="control-label col-md-3"> Country </label>
                  <div className="col-md-9">
                        <select  ref = "country" defaultValue ={this.props.countryname} >
                          {
                            Countries.map((c,i) =>
                              <option value={c.name} >{c.name}</option>
                              )
                          }
                        </select>

                      </div>
                </div>
                  <div className="form-group">
                  <label className="control-label col-md-3"> Phone</label>
                   <div className="col-md-9">
                            <input className="form-control input-medium" type='text'  ref = "phone" />
                </div>
                </div>
                <div className="form-group">

                   <label className="control-label col-md-3"> Choose Group</label>
                   <div className="col-md-9">
                  <select  ref = "grouplist" onChange={this.handleChange.bind(this)}   >
                          {
                          this.props.groupdetails && this.props.groupdetails.map((group,i) =>
                            <option value={group._id} >{group.deptname}</option>

                            )
                         }

                      </select>
                  </div>
                 </div>

                <div className="form-group">
                   <label className="control-label col-md-3"> Choose SubGroup</label>
                   <div className="col-md-9">
                   <select  ref = "channellist" onChange={this.handleChannelChange.bind(this)}   >
                          {
                          this.props.filterlist && this.props.filterlist.map((subgroup,i) =>
                            <option value={subgroup._id}>{subgroup.msg_channel_name}</option>

                            )
                         }

                   </select>
                  </div>
                 </div>

              <div className="form-actions fluid">
              <div className="row">
                <div className="col-md-3">
                  <div className="col-md-offset-9 col-md-9">
                    <button className="btn green" ref = "btn" onClick={this.addCustomers}>
                      <i className="fa fa-pencil"/>
                       Submit
                    </button>

                    </div>
               </div>

               </div>
              </div>
              </div>

          </form>



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
  console.log("mapStateToProps is called");

   return {

    groupdetails :(state.widget.groupdetails),
    subgroups :(state.widget.subgroups),
    filterlist :(state.widget.filterlist),
    sessiondetails : (state.widget.sessiondetails),
    specificsession : (state.widget.specificsession),
    roomdetails :(state.widget.roomdetails),
    specificcustomer : (state.widget.specificcustomer),
    countryname : (state.dashboard.countryname),
    companylogo:(state.widget.companylogo),
  };
}
export default connect(mapStateToProps,{getcustomergroups,getcompanylogo,getspecificcustomer,getspecificsession,getcustomersubgroups,updatesubgrouplist,createsession,addRoom,getcountryname})(AddCustomer);
