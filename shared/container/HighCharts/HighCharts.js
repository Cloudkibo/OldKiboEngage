import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import {getchannelwisestats,getcountrywisestats,getpagewisestats,getplatformwisestats,getdeptwisestats} from '../../redux/actions/actions'
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router'
import Groupwise from './Groupwise'
import Platform from './Platform'
import Pagewise from './Pagewise'
import Countrywise from './Countrywise'
var ReactDOM = require('react-dom');
var Highcharts = require('highcharts');
var platform_bool = false; 
var group_bool = false;
var pages_bool = false;
var country_bool  = false;
var handleDate = function(d){
return d.toDateString();
}

var getIndexFromPropertyValue3 =  function (theList, id) {
        for (var i = 0; i < theList.length; i++) {
          if (theList[i]._id == id)
            return i;
        }
  }

class HighCharts extends Component {

 constructor(props, context) {
      //call action to get user groups 
  if(props.userdetails.accountVerified == "No"){
    browserHistory.push('/notverified');
   }
    const usertoken = auth.getToken();
    console.log('constructor is called');
    if(usertoken != null)
    {
       
        console.log(usertoken);
        props.getplatformwisestats(usertoken);
        props.getdeptwisestats(usertoken);
        props.getpagewisestats(usertoken);
        props.getcountrywisestats(usertoken);
    }
    super(props, context);
     
    
    this.state = {categories:[],categoriesPages:[],categoriesCountry:[],categoriesGroup:[], chartSeries : [{"name": "Number of calls", "data": [], type: "column"}], chartSeriesGroup : [{"name": "Number of calls", "data": [], type: "column"}], chartSeriesPages : [{"name": "Number of calls", "data": [], type: "column"}], chartSeriesCountry : [{"name": "Number of calls", "data": [], type: "column"}],currentDate :new Date()};
    this._getgroupwisestats = this._getgroupwisestats.bind(this);
    this._getplatformwisestats = this._getplatformwisestats.bind(this);
    this._getpagewisestats = this._getpagewisestats.bind(this);
    this._getcountrywisestats = this._getcountrywisestats.bind(this);
  }

_getcountrywisestats(day){

}
_getgroupwisestats(day){
      this.state.chartSeriesGroup[0].data = [];
      this.state.categoriesGroup = [];
      var deptStatsData = this.props.deptwisestats;

          var tempArray =[];
        for(var i in deptStatsData.gotDeptCalls){
          var gotDate = new Date(deptStatsData.gotDeptCalls[i]._id.year,deptStatsData.gotDeptCalls[i]._id.month-1,deptStatsData.gotDeptCalls[i]._id.day, 0,0,0,0);
         
      
            if((new Date(new Date().setDate(new Date().getDate()-day))) <= (gotDate)){

              var tempDeptName = deptStatsData.deptNames[getIndexFromPropertyValue3(deptStatsData.deptNames, deptStatsData.gotDeptCalls[i]._id.departmentid)].deptname;
              var tempCount = deptStatsData.gotDeptCalls[i].count;
              var foundInArray = false;

              for (var i in tempArray) {
                if (tempDeptName === tempArray[i].deptName) {
                  tempArray[i].count += tempCount;
                  foundInArray = true;
                }
              }

              if (!foundInArray) {
                tempArray.push({
                  deptName: tempDeptName,
                  count: tempCount
                });
              }
            }
          }

          for(var i in tempArray){
             this.state.chartSeriesGroup[0].data.push(tempArray[i].count);
             this.state.categoriesGroup.push(tempArray[i].deptName);
        }

        
       
          this.refs.targetDateGroup.value = handleDate(new Date(new Date().setDate(new Date().getDate()-day)));


      
    
}

_getplatformwisestats(day){
      this.state.chartSeries[0].data = [];
      this.state.categories = [];
      var platformStatsData = this.props.platformwisestats;

        var tempArray = [];
        for(var i in platformStatsData){
          var gotDate = new Date(platformStatsData[i]._id.year,platformStatsData[i]._id.month-1,
           platformStatsData[i]._id.day, 0,0,0,0);
          if((new Date(new Date().setDate(new Date().getDate()-day))) <= (gotDate)){

            var tempCurrentPage =platformStatsData[i]._id.platform;
            var tempCount = platformStatsData[i].count;

            var foundInArray = false;
            for(var i in tempArray){
              if(tempCurrentPage === tempArray[i].currentpage){
                tempArray[i].count += tempCount;
                foundInArray = true;
              }
            }

            if(!foundInArray){
              tempArray.push({currentpage : tempCurrentPage,
                count: tempCount});
            }

          }
        }
        for(var i in tempArray){

          this.state.chartSeries[0].data.push(tempArray[i].count);
          //$scope.chartConfig.series[0].data.push(tempArray[i].count);
          this.state.categories.push(tempArray[i].currentpage);

        }
       // alert(this.state.chartSeries[0].data.length);
       this.refs.targetDate.value = handleDate(new Date(new Date().setDate(new Date().getDate()-day)));
      
  }



_getpagewisestats(day){
      this.state.chartSeriesPages[0].data = [];
      this.state.categoriesPages = [];
      var pageStatsData = this.props.pagewisestats;

        var tempArray = [];
        for(var i in pageStatsData){
          if(pageStatsData[i]._id.currentpage){
          var gotDate = new Date(pageStatsData[i]._id.year,pageStatsData[i]._id.month-1,
           pageStatsData[i]._id.day, 0,0,0,0);
          if((new Date(new Date().setDate(new Date().getDate()-day))) <= (gotDate)){

            var tempCurrentPage =pageStatsData[i]._id.currentpage;
            var tempCount = pageStatsData[i].count;

            var foundInArray = false;
            for(var i in tempArray){
              if(tempCurrentPage === tempArray[i].currentpage){
                tempArray[i].count += tempCount;
                foundInArray = true;
              }
            }

            if(!foundInArray){

              tempArray.push({currentpage : tempCurrentPage,
                count: tempCount});
            }

          }
        }
      }
        for(var i in tempArray){

          this.state.chartSeriesPages[0].data.push(tempArray[i].count);
          //$scope.chartConfig.series[0].data.push(tempArray[i].count);
          this.state.categoriesPages.push(tempArray[i].currentpage);

        }
       // alert(this.state.categoriesPages.length);
       this.refs.targetDatePages.value = handleDate(new Date(new Date().setDate(new Date().getDate()-day)));
      
  }


 componentWillReceiveProps(props) {
    
     if(props.platformwisestats && platform_bool == false){
      var platformStatsData = props.platformwisestats;
      platform_bool = true;
      var CallStats = this.refs.CallStats.value;
      this.state.categories =[];
     // alert(this.state.categories.length);
      if(CallStats == 'This Year'){

        var tempArray =[];
        for(var i in platformStatsData){
          var gotDate = new Date(platformStatsData[i]._id.year,platformStatsData[i]._id.month-1,platformStatsData[i]._id.day, 0,0,0,0);
          
          if((new Date(new Date().setDate(new Date().getDate()-365))) <= (gotDate)){

            var tempCurrentPage = platformStatsData[i]._id.platform;
            var tempCount = platformStatsData[i].count;

            var foundInArray = false;
            for(var i in tempArray){
              if(tempCurrentPage === tempArray[i].currentpage){
                tempArray[i].count += tempCount;
                foundInArray = true;
              }
            }

            if(!foundInArray){
              tempArray.push({currentpage : tempCurrentPage,
                count: tempCount});
            }

          }
        }

        for(var i in tempArray){

          this.state.chartSeries[0].data.push(tempArray[i].count);
          this.state.categories.push(tempArray[i].currentpage);

        }
    }

        //alert( this.state.categories.length);
        this.refs.targetDate.value = handleDate(new Date(new Date().setDate(new Date().getDate()-365)));
      }


    /*** country wise call stats ****/

      if(props.countrywisestats && country_bool == false){
      var countryStatsData = props.countrywisestats;
      country_bool = true;
      var CallStatsCountry = this.refs.CallStatsCountry.value;
      this.state.categoriesCountry =[];
     // alert(this.state.categories.length);
      if(CallStatsCountry == 'This Year'){

        var tempArray =[];
        for(var i in countryStatsData){
          var gotDate = new Date(countryStatsData[i]._id.year,platformStatsData[i]._id.month-1,countryStatsData[i]._id.day, 0,0,0,0);
          
          if((new Date(new Date().setDate(new Date().getDate()-365))) <= (gotDate)){

            var tempCurrentPage = countryStatsData[i]._id.country;
            var tempCount = countryStatsData[i].count;

            var foundInArray = false;
            for(var i in tempArray){
              if(tempCurrentPage === tempArray[i].currentpage){
                tempArray[i].count += tempCount;
                foundInArray = true;
              }
            }

            if(!foundInArray){
              tempArray.push({currentpage : tempCurrentPage,
                count: tempCount});
            }

          }
        }

        for(var i in tempArray){

          this.state.chartSeriesCountry[0].data.push(tempArray[i].count);
          this.state.categoriesCountry.push(tempArray[i].currentpage);

        }
    }

        //alert( this.state.categories.length);
        this.refs.targetDateCountry.value = handleDate(new Date(new Date().setDate(new Date().getDate()-365)));
      }

    /**** group wise call stats ********/

     if(props.deptwisestats && group_bool == false){
      var deptStatsData = props.deptwisestats;
      group_bool  = true;
      var CallStatsDept = this.refs.CallStatsDept.value;
       this.state.categoriesGroup =[];
      
      if(CallStatsDept == 'This Year'){

        var tempArray =[];
        for(var i in deptStatsData.gotDeptCalls){
          var gotDate = new Date(deptStatsData.gotDeptCalls[i]._id.year,deptStatsData.gotDeptCalls[i]._id.month-1,deptStatsData.gotDeptCalls[i]._id.day, 0,0,0,0);
          
          if((new Date(new Date().setDate(new Date().getDate()-365))) <= (gotDate)){

            var tempDeptName = deptStatsData.deptNames[getIndexFromPropertyValue3(deptStatsData.deptNames, deptStatsData.gotDeptCalls[i]._id.departmentid)].deptname;
            var tempCount = deptStatsData.gotDeptCalls[i].count;
            var foundInArray = false;

            for (var i in tempArray) {
              if (tempDeptName === tempArray[i].deptName) {
                tempArray[i].count += tempCount;
                foundInArray = true;
              }
            }

            if (!foundInArray) {
              tempArray.push({
                deptName: tempDeptName,
                count: tempCount
              });
            }            //chart1.data.push([$scope.deptCallsGraphData.deptNames[Utility.getIndexFromPropertyValue3($scope.deptCallsGraphData.deptNames, $scope.deptCallsGraphData.gotDeptCalls[i]._id.departmentid)].deptname +' : '+ $scope.deptCallsGraphData.gotDeptCalls[i].count, $scope.deptCallsGraphData.gotDeptCalls[i].count]);
          }
        }
        for(var i in tempArray){
          this.state.chartSeriesGroup[0].data.push(tempArray[i].count);
          this.state.categoriesGroup.push(tempArray[i].deptName);
        }

        this.refs.targetDateGroup.value = handleDate(new Date(new Date().setDate(new Date().getDate()-365)));
      }

   
    }



    //page wise stats

     if(props.pagewisestats && pages_bool == false){
      var pageStatsData = props.pagewisestats;
      pages_bool = true;
      var CallStatsPages = this.refs.CallStatsPages.value;
      this.state.categoriesPages = []
      if(CallStatsPages == 'This Year'){

        var tempArray =[];
        for(var i in pageStatsData){
          if(pageStatsData[i]._id.currentpage){
          var gotDate = new Date( pageStatsData[i]._id.year, pageStatsData[i]._id.month-1, pageStatsData[i]._id.day, 0,0,0,0);
          
          if((new Date(new Date().setDate(new Date().getDate()-365))) <= (gotDate)){

            var tempCurrentPage =  pageStatsData[i]._id.currentpage;
            var tempCount = pageStatsData[i].count;

            var foundInArray = false;
            for(var i in tempArray){
              if(tempCurrentPage === tempArray[i].currentpage){
                tempArray[i].count += tempCount;
                foundInArray = true;
              }
            }

            if(!foundInArray){
              tempArray.push({currentpage : tempCurrentPage,
                count: tempCount});
            }

          }
        }
        }

        for(var i in tempArray){

          this.state.chartSeriesPages[0].data.push(tempArray[i].count);
          this.state.categoriesPages.push(tempArray[i].currentpage);

        }
    }

//        alert( this.state.chartSeries[0].data.length);
        this.refs.targetDatePages.value = handleDate(new Date(new Date().setDate(new Date().getDate()-365)));
      }


  }

 refreshData1(e){
      this.refs.CallStats.value = e.target.dataset.attrib;
      this.state.chartSeries[0].data = [];
      this.state.categories = [];
      var platformStatsData = this.props.platformwisestats;
      
    
      if(this.refs.CallStats.value  == 'Today'){

        //alert(this.refs.CallStats.value)
        var tempArray= [];
        var currentDate1 = new Date(); // added by saba
        for(var i in platformStatsData){
          var gotDate = new Date(platformStatsData[i]._id.year, platformStatsData[i]._id.month-1,
          platformStatsData[i]._id.day, 0,0,0,0);
          var currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0,0,0,0);
          if((currentDate.getTime()) == (gotDate.getTime())){

            var tempCurrentPage = platformStatsData[i]._id.platform;
            var tempCount = platformStatsData[i].count;

            var foundInArray = false;
            for(var i in tempArray){
              if(tempCurrentPage === tempArray[i].currentpage){
                tempArray[i].count += tempCount;
                foundInArray = true;
              }
            }

            if(!foundInArray){
              tempArray.push({currentpage : tempCurrentPage,
                count: tempCount});
            }

          }
        }

        for(var i in tempArray){

          this.state.chartSeries[0].data.push(tempArray[i].count);
          //$scope.chartConfig.series[0].data.push(tempArray[i].count);
          this.state.categories.push(tempArray[i].currentpage);

        }
        currentDate1 = this.state.currentDate; 
        this.refs.targetDate.value = handleDate(this.state.currentDate);
      }

      if(this.refs.CallStats.value == 'Last 7 days'){
        //alert(this.refs.CallStats.value)
       this. _getplatformwisestats(7);

      }

      if(this.refs.CallStats.value == 'Last 30 days'){
      //  alert(this.refs.CallStats.value)
        this._getplatformwisestats(30);        
        }

      if(this.refs.CallStats.value == 'This Year'){
        this._getplatformwisestats(365);
        }
      this.forceUpdate()

 }




refreshData2(e){
      this.refs.CallStatsDept.value = e.target.dataset.attrib;
      this.state.chartSeriesGroup[0].data = [];
      this.state.categoriesGroup = [];
      var deptStatsData = this.props.deptwisestats;
      
    
      if(this.refs.CallStatsDept.value  == 'Today'){

        var tempArray =[];
        for(var i in deptStatsData.gotDeptCalls){
          var gotDate = new Date(deptStatsData.gotDeptCalls[i]._id.year,deptStatsData.gotDeptCalls[i]._id.month-1,deptStatsData.gotDeptCalls[i]._id.day, 0,0,0,0);
          var currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0,0,0,0);
          var currentDate1 = new Date(); 
        
            if((currentDate.getTime()) == (gotDate.getTime())){

              var tempDeptName = deptStatsData.deptNames[getIndexFromPropertyValue3(deptStatsData.deptNames, deptStatsData.gotDeptCalls[i]._id.departmentid)].deptname;
              var tempCount = deptStatsData.gotDeptCalls[i].count;
              var foundInArray = false;

              for (var i in tempArray) {
                if (tempDeptName === tempArray[i].deptName) {
                  tempArray[i].count += tempCount;
                  foundInArray = true;
                }
              }

              if (!foundInArray) {
                tempArray.push({
                  deptName: tempDeptName,
                  count: tempCount
                });
              }
            }
          }

          for(var i in tempArray){
             this.state.chartSeriesGroup[0].data.push(tempArray[i].count);
             this.state.categoriesGroup.push(tempArray[i].deptName);
        }

        currentDate1 = this.state.currentDate; 
        this.refs.targetDateGroup.value = handleDate(this.state.currentDate);
      }

      if(this.refs.CallStatsDept.value == 'Last 7 days'){

          this._getgroupwisestats(7)

        
      }

      if(this.refs.CallStatsDept.value == 'Last 30 days'){

        this._getgroupwisestats(30)         
       }

      if(this.refs.CallStatsDept.value == 'This Year'){
        this._getgroupwisestats(365)       
    }
      this.forceUpdate()

 }


refreshData3(e){
      this.refs.CallStatsPages.value = e.target.dataset.attrib;
      this.state.chartSeriesPages[0].data = [];
      this.state.categoriesPages = [];

      var pageStatsData = this.props.pagewisestats;
      
    
      if(this.refs.CallStatsPages.value  == 'Today'){

        //alert(this.refs.CallStats.value)
        var tempArray= [];
        var currentDate1 = new Date(); // added by saba
        for(var i in pageStatsData){
          if(pageStatsData[i]._id.currentpage){
          var gotDate = new Date(pageStatsData[i]._id.year, pageStatsData[i]._id.month-1,
          pageStatsData[i]._id.day, 0,0,0,0);
          var currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0,0,0,0);
          if((currentDate.getTime()) == (gotDate.getTime())){

            var tempCurrentPage = pageStatsData[i]._id.currentpage;
            var tempCount = pageStatsData[i].count;

            var foundInArray = false;
            for(var i in tempArray){
              if(tempCurrentPage === tempArray[i].currentpage){
                tempArray[i].count += tempCount;
                foundInArray = true;
              }
            }

            if(!foundInArray){
              tempArray.push({currentpage : tempCurrentPage,
                count: tempCount});
            }

          }
        }
      }

        for(var i in tempArray){

          this.state.chartSeriesPages[0].data.push(tempArray[i].count);
          //$scope.chartConfig.series[0].data.push(tempArray[i].count);
          this.state.categoriesPages.push(tempArray[i].currentpage);

        }
        currentDate1 = this.state.currentDate; 
        this.refs.targetDatePages.value = handleDate(this.state.currentDate);
      }

      if(this.refs.CallStatsPages.value == 'Last 7 days'){
        //alert(this.refs.CallStats.value)
       this. _getpagewisestats(7);

      }

      if(this.refs.CallStatsPages.value == 'Last 30 days'){
      //  alert(this.refs.CallStats.value)
        this._getpagewisestats(30);        
        }

      if(this.refs.CallStatsPages.value == 'This Year'){
        this._getpagewisestats(365);
        }
      this.forceUpdate()

 }

 handleChangeDepartment(e){
     alert(e.target.value);
     const token = auth.getToken();
    
   //  this.props.getchannelwisestats(e.target.value,token);
    
     this.forceUpdate();
   
   
    }

  render() {

    console.log(this.props.userdetails.firstname)
    const token = auth.getToken()
    console.log(token)
   // console.log(this.props.channels);
    return (
      <div>
       <AuthorizedHeader name = {this.props.userdetails.firstname} />
       <div className="page-container">
         <SideBar isAdmin ={this.props.userdetails.isAdmin}/> 
          <div className="page-content-wrapper">
            <div className="page-content"> 
              <h3 className ="page-title">Reports </h3>
            <ul className="page-breadcrumb breadcrumb">
                  <li>
                    <i className="fa fa-home"/>
                    <Link to="/dashboard"> Dashboard </Link>
                    <i className="fa fa-angle-right"/> 
                  </li>                  
                  <li>
                               <Link to="/reports">Reports</Link>
                  </li>               
  
            </ul>

            <div>
              <label> Choose Department </label>
               <select  ref = "grouplist" onChange={this.handleChangeDepartment.bind(this)}   >
                          
                          {
                          this.props.groupdetails && this.props.groupdetails.map((group,i) =>
                            <option value={group._id}>{group.deptname}</option>

                            )
                         }
                         

                         
                      </select>
            </div>
            {
              this.props.platformwisestats && this.state.categories.length > 0 &&
                <Platform series = {this.state.chartSeries} categories = {this.state.categories} title="Platform wise Sessions Stats"/>
            }
        
           <input defaultValue="This Year" ref="CallStats" type="hidden"/>
           <input defaultValue="This Year" ref="CallStatsDept" type="hidden"/>
           <input defaultValue="This Year" ref="CallStatsPages" type="hidden"/>
           <input defaultValue="This Year" ref="CallStatsCountry" type="hidden"/>
           
           <div class="clearfix">
            From <input ref="targetDate" type="text"/>
                       <br/>
           To  <input ref="currentDate" value = {handleDate(this.state.currentDate)}/>
           </div>
           <div class="btn-group">
            <label btn-radio="'Today'" uncheckable=""  data-attrib = "Today" onClick={this.refreshData1.bind(this)} className="btn btn-success">Today</label>
            <label btn-radio="'Last 7 days'" uncheckable=""  data-attrib = "Last 7 days"  onClick={this.refreshData1.bind(this)} className="btn btn-success">Last 7 days</label>
            <label btn-radio="'Last 30 days'" uncheckable="" data-attrib="Last 30 days"  onClick={this.refreshData1.bind(this)} className="btn btn-success">Last 30 days</label>
            <label btn-radio="'This Year'" uncheckable=""  data-attrib="This Year" onClick={this.refreshData1.bind(this)} className="btn btn-success">This Year</label>
          </div>


          <br/>
          <br/>

           {
              this.props.deptwisestats && this.state.categoriesGroup.length > 0 &&
                <Groupwise series = {this.state.chartSeriesGroup} categories = {this.state.categoriesGroup} title="Group wise Sessions Stats"/>
            }
        


           <div class="clearfix">
            From <input ref="targetDateGroup" type="text"/>
                       <br/>
           To  <input ref="currentDate" value = {handleDate(this.state.currentDate)}/>
           </div>
          

          <div class="btn-group">
            <label btn-radio="'Today'" uncheckable=""  data-attrib = "Today" onClick={this.refreshData2.bind(this)} className="btn btn-success">Today</label>
            <label btn-radio="'Last 7 days'" uncheckable=""  data-attrib = "Last 7 days"  onClick={this.refreshData2.bind(this)} className="btn btn-success">Last 7 days</label>
            <label btn-radio="'Last 30 days'" uncheckable="" data-attrib="Last 30 days"  onClick={this.refreshData2.bind(this)} className="btn btn-success">Last 30 days</label>
            <label btn-radio="'This Year'" uncheckable=""  data-attrib="This Year" onClick={this.refreshData2.bind(this)} className="btn btn-success">This Year</label>
          </div>



          <br/>
          <br/>

           {
              this.props.countrywisestats && this.state.categoriesCountry.length > 0 &&
                <Countrywise series = {this.state.chartSeriesCountry} categories = {this.state.categoriesCountry} title="Country wise Sessions Stats"/>
            }
        


           <div class="clearfix">
            From <input ref="targetDateCountry" type="text"/>
                       <br/>
           To  <input ref="currentDate" value = {handleDate(this.state.currentDate)}/>
           </div>
          

          <div class="btn-group">
            <label btn-radio="'Today'" uncheckable=""  data-attrib = "Today" onClick={this.refreshData3.bind(this)} className="btn btn-success">Today</label>
            <label btn-radio="'Last 7 days'" uncheckable=""  data-attrib = "Last 7 days"  onClick={this.refreshData3.bind(this)} className="btn btn-success">Last 7 days</label>
            <label btn-radio="'Last 30 days'" uncheckable="" data-attrib="Last 30 days"  onClick={this.refreshData3.bind(this)} className="btn btn-success">Last 30 days</label>
            <label btn-radio="'This Year'" uncheckable=""  data-attrib="This Year" onClick={this.refreshData3.bind(this)} className="btn btn-success">This Year</label>
          </div>


          <br/>
          <br/>

           {
              this.props.pagewisestats && this.state.categoriesPages.length > 0 &&
                <Pagewise series = {this.state.chartSeriesPages} categories = {this.state.categoriesPages} title="Page wise Sessions Stats"/>
            }
        


           <div class="clearfix">
            From <input ref="targetDatePages" type="text"/>
                       <br/>
           To  <input ref="currentDate" value = {handleDate(this.state.currentDate)}/>
           </div>
          

          <div class="btn-group">
            <label btn-radio="'Today'" uncheckable=""  data-attrib = "Today" onClick={this.refreshData3.bind(this)} className="btn btn-success">Today</label>
            <label btn-radio="'Last 7 days'" uncheckable=""  data-attrib = "Last 7 days"  onClick={this.refreshData3.bind(this)} className="btn btn-success">Last 7 days</label>
            <label btn-radio="'Last 30 days'" uncheckable="" data-attrib="Last 30 days"  onClick={this.refreshData3.bind(this)} className="btn btn-success">Last 30 days</label>
            <label btn-radio="'This Year'" uncheckable=""  data-attrib="This Year" onClick={this.refreshData3.bind(this)} className="btn btn-success">This Year</label>
          </div>

       </div>
       </div> 
      </div>
      </div> 
  )
  }
}

HighCharts.propTypes = {

  errorMessage: PropTypes.string,
}
function mapStateToProps(state) {
  console.log("mapStateToProps is called");
  return {
          channelwisestats : state.dashboard.channelwisestats,
          deptwisestats : state.dashboard.deptwisestats,
          platformwisestats : state.dashboard.platformwisestats,
          pagewisestats : state.dashboard.pagewisestats,
          countrywisestats : state.dashboard.countrywisestats,
          channels:(state.dashboard.channels),
          userdetails:(state.dashboard.userdetails),
          groupdetails :(state.dashboard.groupdetails),
          errorMessage:(state.dashboard.errorMessage),
          agents:(state.dashboard.agents),
          deptagents:(state.dashboard.deptagents),

           };
}


export default connect(mapStateToProps,{getpagewisestats,getcountrywisestats,getchannelwisestats,getplatformwisestats,getdeptwisestats})(HighCharts);



