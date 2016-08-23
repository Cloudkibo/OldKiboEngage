import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import {getchannelwisestats,getagentwisenotifications,gettopcustomers,getagentwisecalls,getresolvedsessions,getmobilewisestats,getcountrywisestats,getpagewisestats,getplatformwisestats,getdeptwisestats} from '../../redux/actions/actions'
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router'
import Groupwise from './Groupwise'
import Platform from './Platform'
import Pagewise from './Pagewise'
import Countrywise from './Countrywise'
import AvgCall from './AvgCall'

import Agentwise from './Agentwise'
import Customerwise from './Customerwise'
import Notificationwise from './Notificationwise'
import Channelwise from './Channelwise'




var ReactDOM = require('react-dom');
var Highcharts = require('highcharts');
var platform_bool ;//= false; 
var group_bool ;//= false;
var pages_bool;// = false;
var mobile_bool;
var country_bool;
var avg_call;

var agent_bool;
var agent_notif_bool;
var customer_bool;
var channel_bool;
var handleDate = function(d){
return d.toDateString();
}

var getIndexFromPropertyValue3 =  function (theList, id) {
        for (var i = 0; i < theList.length; i++) {
          if (theList[i]._id == id)
            return i;
        }
  }


var getAverageCallTime =  function(allCallsList){
        var count = 0;
        var sum = 0;
        var countForCall = 0;
        var sumForCall = 0;

        var data = allCallsList;
        for(var index in data){
          if((((new Date()).getTime() - (new Date(data[index].requesttime)).getTime())/(1000*60*60)%60).toFixed(2) < 8){
            if(data[index].picktime != undefined){
              count += 1;
              sum += (new Date(data[index].picktime)).getTime() - (new Date(data[index].requesttime)).getTime();

            }
            
            if(data[index].endtime != undefined && data[index].picktime != undefined){
              countForCall += 1;
              sumForCall += (new Date(data[index].endtime)).getTime() - (new Date(data[index].picktime)).getTime();

            }
          }
        }

        var averageCallHour = ((sumForCall/countForCall)/(1000*60*60)%60).toFixed(0);
        var averageCallMin = ((sumForCall/countForCall)/(1000*60)%60).toFixed(0);
        var averageCallSec = ((sumForCall/countForCall)/(1000)%60).toFixed(0);
        var averageWaitHour = ((sum/count)/(1000*60*60)%60).toFixed(0);
        var averageWaitMin = ((sum/count)/(1000*60)%60).toFixed(0);
        var averageWaitSec = ((sum/count)/(1000)%60).toFixed(0);
        var averageCallTime;
        //console.log(averageCallMin)
        if(averageCallMin == 'NaN')
          averageCallTime = 'No Calls (last 8 hrs)';
        else
          averageCallTime = averageCallHour +":"+ averageCallMin +":"+ averageCallSec +" (last 8 hrs)";

        return averageCallTime;
      }

var getAverageWaitTime =  function(allCallsList){
        var count = 0;
        var sum = 0;
        var countForCall = 0;
        var sumForCall = 0;

        var data = allCallsList;
        //console.log(allCallsList)
        for(var index in data){
          //console.log((((new Date()).getTime() - (new Date(data[index].requesttime)).getTime())/(1000*60*60)%60).toFixed(2))
          if((((new Date()).getTime() - (new Date(data[index].requesttime)).getTime())/(1000*60*60)%60).toFixed(2) < 8){

            //console.log(data[index].picktime)
            if(data[index].picktime != undefined){
              count += 1;
              sum += (new Date(data[index].picktime)).getTime() - (new Date(data[index].requesttime)).getTime();

            }
           //console.log(data[index].endtime)
            if(data[index].endtime != undefined){
              countForCall += 1;
              sumForCall += (new Date(data[index].endtime)).getTime() - (new Date(data[index].picktime)).getTime();

            }
          }
        }


        var averageCallHour = ((sumForCall/countForCall)/(1000*60*60)%60).toFixed(0);
        //console.log(averageCallHour)
        var averageCallMin = ((sumForCall/countForCall)/(1000*60)%60).toFixed(0);
        //console.log(averageCallMin)
        var averageCallSec = ((sumForCall/countForCall)/(1000)%60).toFixed(0);
        //console.log(averageCallSec)
        var averageWaitHour = ((sum/count)/(1000*60*60)%60).toFixed(0);
        //console.log(averageWaitHour)
        var averageWaitMin = ((sum/count)/(1000*60)%60).toFixed(0);
        //console.log(averageWaitMin)
        var averageWaitSec = ((sum/count)/(1000)%60).toFixed(0);
        var averageWaitTime;
        //console.log(averageWaitMin)
        if(averageWaitMin == 'NaN')
          averageWaitTime = 'No Visitors (last 8 hrs)';
        else
          averageWaitTime = averageWaitHour +":"+ averageWaitMin +":"+ averageWaitSec +" (last 8 hrs)";

        return averageWaitTime;
      }

var getAverageWaitMin = function(allCallsList,days){
        var count = 0;
        var sum = 0;
        var countForCall = 0;
        var sumForCall = 0;

        //console.log(allCallsList);
        var data = allCallsList;
        //console.log(data)
        for(var index in data){
          if((((new Date()).getTime() - (new Date(data[index].requesttime)).getTime())/(1000*60*60)%60).toFixed(2) < days*24){
           
            if(data[index].picktime != undefined){
              count += 1;
              sum += (new Date(data[index].picktime)).getTime() - (new Date(data[index].requesttime)).getTime();

            }
           
            if(data[index].endtime != undefined){
              countForCall += 1;
              sumForCall += (new Date(data[index].endtime)).getTime() - (new Date(data[index].picktime)).getTime();

            }
          //console.log('Wait ' + count +' '+ sum + ' '+ sumForCall +' '+ countForCall)
          }
        }

        var averageCallHour = ((sumForCall/countForCall)/(1000*60*60)%60).toFixed(0);
        var averageCallMin = ((sumForCall/countForCall)/(1000*60)%60).toFixed(0);
        var averageCallSec = ((sumForCall/countForCall)/(1000)%60).toFixed(0);
        var averageWaitHour = ((sum/count)/(1000*60*60)%60).toFixed(0);
        var averageWaitMin = ((sum/count)/(1000*60)%60).toFixed(0);
        var averageWaitSec = ((sum/count)/(1000)%60).toFixed(0);
        if(sum === 0 && count === 0) return 0;
        return ((sum/count)/(1000*60)%60).toFixed(2);
      }

var getAverageCallMin =  function(allCallsList,days){
        var count = 0;
        var sum = 0;
        var countForCall = 0;
        var sumForCall = 0;

        var data = allCallsList;
   
        for(var index in data){
          //console.log((((new Date()).getTime() - (new Date(data[index].requesttime)).getTime())/(1000*60*60)%60).toFixed(2))

          if((((new Date()).getTime() - (new Date(data[index].requesttime)).getTime())/(1000*60*60)%60).toFixed(2) <= days*24){
            if(data[index].picktime != undefined){
              count += 1;
              sum += (new Date(data[index].picktime)).getTime() - (new Date(data[index].requesttime)).getTime();

            }
            
            if(data[index].endtime != undefined && data[index].picktime != undefined){
              countForCall += 1;
              sumForCall += (new Date(data[index].endtime)).getTime() - (new Date(data[index].picktime)).getTime();

            }
          }
        }

        var averageCallHour = ((sumForCall/countForCall)/(1000*60*60)%60).toFixed(0);
        var averageCallMin = ((sumForCall/countForCall)/(1000*60)%60).toFixed(0);
        var averageCallSec = ((sumForCall/countForCall)/(1000)%60).toFixed(0);
        var averageWaitHour = ((sum/count)/(1000*60*60)%60).toFixed(0);
        var averageWaitMin = ((sum/count)/(1000*60)%60).toFixed(0);
        var averageWaitSec = ((sum/count)/(1000)%60).toFixed(0);

        if(sum === 0 && count === 0) return 0;
        return (((sumForCall/countForCall)/(1000*60)%60).toFixed(2));

      }


class HighCharts extends Component {

 constructor(props, context) {
      //call action to get user groups 
  if(props.userdetails.accountVerified == "No"){
    browserHistory.push('/notverified');
   }
    const usertoken = auth.getToken();
    console.log('constructor is called');
    
    super(props, context);
    if(usertoken != null)
    {
       
        console.log(usertoken);
        props.getplatformwisestats(usertoken);
        props.getdeptwisestats(usertoken);
        props.getpagewisestats(usertoken);
        props.getcountrywisestats(usertoken);
        props.getmobilewisestats(usertoken);


        props.gettopcustomers(usertoken);
        props.getagentwisecalls(usertoken);
        props.getagentwisenotifications(usertoken);
        //get resolved sessions
        props.getresolvedsessions(usertoken);
        props.getchannelwisestats(this.props.groupdetails[0]._id,usertoken);
    } 
    
    this.state = {categories:[],categoriesChannels :[],categoriesCustomer :[],categoriesNotif:[],categoriesAgent :[],categoriesAvg:[],categoriesPages:[],categoriesMobile:[],categoriesGroup:[], chartSeries : [{"name": "Number of calls", "data": [], type: "column"}],chartSeriesChannels : [{"name": "Number of calls", "data": [], type: "column"}],chartSeriesNotif : [{"name": "Number of Notifications", "data": [], type: "column"}],chartSeriesCustomer: [{"name": "Number of Sessions", "data": [], type: "column"}], chartSeriesAvg : [{"name": "Average Time", "data": [], type: "column"}],chartSeriesAgent : [{"name": "Agent wise stats", "data": [], type: "column"}], chartSeriesGroup : [{"name": "Number of calls", "data": [], type: "column"}], chartSeriesPages : [{"name": "Number of calls", "data": [], type: "column"}], chartSeriesMobile : [{"name": "Number of calls", "data": [], type: "column"}],currentDate :new Date()};
    this._getgroupwisestats = this._getgroupwisestats.bind(this);
    this._getplatformwisestats = this._getplatformwisestats.bind(this);
    this._getpagewisestats = this._getpagewisestats.bind(this);
    this._getcountrywisestats = this._getcountrywisestats.bind(this);

    this._getagentwisestats = this._getagentwisestats.bind(this);
    this._getagentwisenotif = this._getagentwisenotif.bind(this);
    this._getcustomerwisestats = this._getcustomerwisestats.bind(this);
    this._getchannelwisestats = this._getchannelwisestats.bind(this);
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


_getchannelwisestats(day,stats,channellist){
      this.state.chartSeriesChannels[0].data = [];
      this.state.categoriesChannels = [];
      var channelStatsData = stats;

        var tempArray =[];
        for(var i in channelStatsData){
          var gotDate = new Date(channelStatsData[i]._id.year,channelStatsData[i]._id.month-1,channelStatsData[i]._id.day, 0,0,0,0);
         
      
            if((new Date(new Date().setDate(new Date().getDate()-day))) <= (gotDate)){

              var tempChName = channellist[getIndexFromPropertyValue3(channellist, channelStatsData[i]._id.messagechannel)].msg_channel_name;
              var tempCount = channelStatsData[i].count;
              var foundInArray = false;

              for (var i in tempArray) {
                if (tempChName === tempArray[i].chName) {
                  tempArray[i].count += tempCount;
                  foundInArray = true;
                }
              }

              if (!foundInArray) {
                tempArray.push({
                  chName: tempChName,
                  count: tempCount
                });
              }
            }
          }

          for(var i in tempArray){
             this.state.chartSeriesChannels[0].data.push(tempArray[i].count);
             this.state.categoriesChannels.push(tempArray[i].chName);
        }

        
       
          this.refs.targetDateChannel.value = handleDate(new Date(new Date().setDate(new Date().getDate()-day)));
         // alert(this.state.categoriesChannels)
     
          this.forceUpdate();

      
    
}





_getagentwisestats(day,agentstats,agentlist){
      this.state.chartSeriesAgent[0].data = [];
      this.state.categoriesAgent = [];
      var agentStatsData = agentstats;
            
      var agentList = agentlist;
        var tempArray =[];
        for(var i in agentStatsData){
          var gotDate = new Date(agentStatsData[i]._id.year,agentStatsData[i]._id.month-1,agentStatsData[i]._id.day, 0,0,0,0);
         
      
            if((new Date(new Date().setDate(new Date().getDate()-day))) <= (gotDate)){

              var tempAgentName = agentList[getIndexFromPropertyValue3(agentList, agentStatsData[i]._id.agent_ids)].firstname;
              var tempCount = agentStatsData[i].count;
              var foundInArray = false;

              for (var i in tempArray) {
                if (tempAgentName === tempArray[i].agName) {
                  tempArray[i].count += tempCount;
                  foundInArray = true;
                }
              }

              if (!foundInArray) {
                tempArray.push({
                  agName: tempAgentName,
                  count: tempCount
                });
              }
            }
          }

          for(var i in tempArray){
             this.state.chartSeriesAgent[0].data.push(tempArray[i].count);
             this.state.categoriesAgent.push(tempArray[i].agName);
        }

        
       
          this.refs.targetDateAgent.value = handleDate(new Date(new Date().setDate(new Date().getDate()-day)));
          
      
    
}



_getcustomerwisestats(day,custstats){
      this.state.chartSeriesCustomer[0].data = [];
      this.state.categoriesCustomer = [];
      var custStatsData = custstats;
      var customerList = custstats.customersData;      
        var tempArray =[];
        for(var i in custStatsData.topCustomersCount){
          var gotDate = new Date(custStatsData.topCustomersCount[i]._id.year,custStatsData.topCustomersCount[i]._id.month-1,custStatsData.topCustomersCount[i]._id.day, 0,0,0,0);
      
            if((new Date(new Date().setDate(new Date().getDate()-day))) <= (gotDate)){

              var tempCustName = customerList[getIndexFromPropertyValue3(customerList, custStatsData.topCustomersCount[i]._id.customerid)].name;
              var tempCount = custStatsData.topCustomersCount[i].count;
              var foundInArray = false;

              for (var i in tempArray) {
                if (tempCustName === tempArray[i].agName) {
                  tempArray[i].count += tempCount;
                  foundInArray = true;
                }
              }

              if (!foundInArray) {
                tempArray.push({
                  agName: tempCustName,
                  count: tempCount
                });
              }
            }
          }

          for(var i in tempArray){
             this.state.chartSeriesCustomer[0].data.push(tempArray[i].count);
             this.state.categoriesCustomer.push(tempArray[i].agName);
        }

        
       
          this.refs.targetDateCustomer.value = handleDate(new Date(new Date().setDate(new Date().getDate()-day)));
          
      
    
}


_getagentwisenotif(agentstats,agentlist){
      this.state.chartSeriesNotif[0].data = [];
      this.state.categoriesNotif = [];
      var agentStatsData = agentstats;
            
      var agentList = agentlist;
      var tempArray =[];
        for(var i in agentStatsData.notficationsCount){
         
              var tempAgentName = agentList[getIndexFromPropertyValue3(agentList, agentStatsData.notficationsCount[i]._id.agent_id)].firstname;
              var tempCount = agentStatsData.notficationsCount[i].count;
              var foundInArray = false;

              for (var i in tempArray) {
                if (tempAgentName === tempArray[i].agName) {
                  tempArray[i].count += tempCount;
                  foundInArray = true;
                }
              }

              if (!foundInArray) {
                tempArray.push({
                  agName: tempAgentName,
                  count: tempCount
                });
              }
            
          }

          for(var i in tempArray){
             this.state.chartSeriesNotif[0].data.push(tempArray[i].count);
             this.state.categoriesNotif.push(tempArray[i].agName);
        }

     
      
    
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

componentDidMount(){
pages_bool = false;
country_bool = false;
group_bool = false;
platform_bool = false;
mobile_bool = false;
avg_call = false;

agent_bool = false;
agent_notif_bool = false;
channel_bool = false;
customer_bool = false;
}

 componentWillReceiveProps(props) {
    

    if(props.resolvedsessions && avg_call == false){
      var CallStats = this.refs.CallStatsAvg.value;
      avg_call = true;
      if(CallStats == 'This Year'){
        var x = getAverageWaitMin(props.resolvedsessions,365);
        var x2 = getAverageCallMin(props.resolvedsessions,365);
        this.state.chartSeriesAvg[0].data.push(Math.round(x * 10) / 10);
        this.state.chartSeriesAvg[0].data.push(Math.round(x2 * 10) / 10);

       //this.state.chartSeriesAvg[0].data.push(20);
       // this.state.chartSeriesAvg[0].data.push(30);
        this.state.categoriesAvg.push('Average Wait Time');
        this.state.categoriesAvg.push('Average Call Time');
        this.refs.targetDateAvg.value = handleDate(new Date(new Date().setDate(new Date().getDate()-365)));
    
      }
    }
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

//mobile client stats
      if(props.mobilewisestats && mobile_bool == false){
        var mobileStatsData = props.mobilewisestats;
        mobile_bool = true;
       this.state.categoriesMobile =[];
       var tempArray =[];
       for(var i in mobileStatsData){
          
            var tempCurrentPage = mobileStatsData[i]._id.isMobileClient;
            var tempCount = mobileStatsData[i].count;

            var foundInArray = false;
            for(var i in tempArray){
              if(tempCurrentPage === tempArray[i].currentpage){
                tempArray[i].count += tempCount;
                foundInArray = true;
              }
            }

            if(!foundInArray && tempCurrentPage == "false"){
              tempArray.push({currentpage : "Web Clients",
                count: tempCount});
            }

            else if(!foundInArray && tempCurrentPage == "true"){
              tempArray.push({currentpage : "Mobile Clients",
                count: tempCount});
            }
          }
        

        for(var i in tempArray){

          this.state.chartSeriesMobile[0].data.push(tempArray[i].count);
          this.state.categoriesMobile.push(tempArray[i].currentpage);

        }
    //}

        //alert( this.state.categories.length);
     //   this.refs.targetDate.value = handleDate(new Date(new Date().setDate(new Date().getDate()-365)));
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




      // get agentwise stats

    if(props.agentwisestats && agent_bool == false){
      var agentStatsData = props.agentwisestats;
       agent_bool  = true;
      var CallStatsAgent = this.refs.CallStatsAgent.value;
       this.state.categoriesAgent =[];
      
      if(CallStatsAgent == 'This Year'){
        this._getagentwisestats(365,props.agentwisestats,props.agents);
   
    }

  }

  if(props.customerwisestats && customer_bool == false){
      var custStatsData = props.customerwisestats;
      customer_bool  = true;
      var CallStatsCust = this.refs.CallStatsCust.value;
       this.state.categoriesCustomer =[];
      
      if(CallStatsCust == 'This Year'){
        this._getcustomerwisestats(365,props.customerwisestats);
   
    }

  }


  if(props.agentwisenotifications && agent_notif_bool == false){
    agent_notif_bool = true;
    this._getagentwisenotif(props.agentwisenotifications,props.agents);
    }


   if(props.channelwisestats){
   // channel_bool = true;
    //alert('i am called');
    this._getchannelwisestats(365,props.channelwisestats,props.channels);
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


refreshData5(e){
      this.refs.CallStatsAgent.value = e.target.dataset.attrib;
      this.state.chartSeriesAgent[0].data = [];
      this.state.categoriesAgent= [];
      var agentStatsData = this.props.agentwisestats;
      var agentList = this.props.agents;
    
      if(this.refs.CallStatsAgent.value  == 'Today'){
        alert('Today');
        var tempArray =[];
        for(var i in agentStatsData){
          var gotDate = new Date(agentStatsData[i]._id.year,agentStatsData[i]._id.month-1,agentStatsData[i]._id.day, 0,0,0,0);
          var currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0,0,0,0);
          var currentDate1 = new Date(); 
        
            if((currentDate.getTime()) == (gotDate.getTime())){

              var tempAgentName = agentList[getIndexFromPropertyValue3(agentList,agentStatsData[i]._id.agent_ids)].firstname;
              var tempCount = agentStatsData[i].count;
              var foundInArray = false;

              for (var i in tempArray) {
                if (tempAgentName === tempArray[i].agName) {
                  tempArray[i].count += tempCount;
                  foundInArray = true;
                }
              }

              if (!foundInArray) {
                tempArray.push({
                  agName: tempAgentName,
                  count: tempCount
                });
              }
            }
          }

          for(var i in tempArray){
             this.state.chartSeriesAgent[0].data.push(tempArray[i].count);
             this.state.categoriesAgent.push(tempArray[i].agName);
        }

        currentDate1 = this.state.currentDate; 
        this.refs.targetDateAgent.value = handleDate(this.state.currentDate);
      }

      if(this.refs.CallStatsAgent.value == 'Last 7 days'){
          //alert(this.props.agentwisestats.length);
          this._getagentwisestats(7,this.props.agentwisestats,this.props.agents)

        
      }

      if(this.refs.CallStatsAgent.value == 'Last 30 days'){

            this._getagentwisestats(30,this.props.agentwisestats,this.props.agents)
      
       }

      if(this.refs.CallStatsAgent.value == 'This Year'){
           this._getagentwisestats(365,this.props.agentwisestats,this.props.agents)

    }
      this.forceUpdate()

 }


refreshData6(e){
      this.refs.CallStatsCust.value = e.target.dataset.attrib;
      this.state.chartSeriesCustomer[0].data = [];
      this.state.categoriesCustomer= [];
      var custStatsData = this.props.customerwisestats;
      var agentList = this.props.customerwisestats.customersData;
    
      if(this.refs.CallStatsCust.value  == 'Today'){
        var tempArray =[];
         for(var i in custStatsData.topCustomersCount){
          var gotDate = new Date(custStatsData.topCustomersCount[i]._id.year,custStatsData.topCustomersCount[i]._id.month-1,custStatsData.topCustomersCount[i]._id.day, 0,0,0,0);
          var currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0,0,0,0);
          var currentDate1 = new Date(); 
        
            if((currentDate.getTime()) == (gotDate.getTime())){

              var tempCustName = agentList[getIndexFromPropertyValue3(agentList,custStatsData.topCustomersCount[i]._id.customerid)].name;
              var tempCount = custStatsData.topCustomersCount[i].count;
              var foundInArray = false;

              for (var i in tempArray) {
                if (tempCustName === tempArray[i].agName) {
                  tempArray[i].count += tempCount;
                  foundInArray = true;
                }
              }

              if (!foundInArray) {
                tempArray.push({
                  agName: tempCustName,
                  count: tempCount
                });
              }
            }
          }

          for(var i in tempArray){
             this.state.chartSeriesCustomer[0].data.push(tempArray[i].count);
             this.state.categoriesCustomer.push(tempArray[i].agName);
        }

        currentDate1 = this.state.currentDate; 
        this.refs.targetDateCustomer.value = handleDate(this.state.currentDate);
      }

      if(this.refs.CallStatsCust.value == 'Last 7 days'){
          this._getcustomerwisestats(7,this.props.customerwisestats)

        
      }

      if(this.refs.CallStatsCust.value == 'Last 30 days'){

            this._getcustomerwisestats(30,this.props.customerwisestats)

      
       }

      if(this.refs.CallStatsCust.value == 'This Year'){
            this._getcustomerwisestats(365,this.props.customerwisestats)


    }
      this.forceUpdate()

 }




refreshData7(e){
      this.refs.CallStatsChannel.value = e.target.dataset.attrib;
      this.state.chartSeriesChannels[0].data = [];
      this.state.categoriesChannels= [];
      var  channelStatsData = this.props.channelwisestats;
      var chList = this.props.channels;
    
      if(this.refs.CallStatsChannel.value  == 'Today'){
        var tempArray =[];
         for(var i in channelStatsData){
          var gotDate = new Date(channelStatsData[i]._id.year,channelStatsData[i]._id.month-1,channelStatsData[i]._id.day, 0,0,0,0);
         
          var currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0,0,0,0);
          var currentDate1 = new Date(); 
        
            if((currentDate.getTime()) == (gotDate.getTime())){

              var tempChName = channellist[getIndexFromPropertyValue3(channellist, channelStatsData[i]._id.messagechannel)].msg_channel_name;
              var tempCount = channelStatsData[i].count;
              var foundInArray = false;

              for (var i in tempArray) {
                if (tempChName === tempArray[i].agName) {
                  tempArray[i].count += tempCount;
                  foundInArray = true;
                }
              }

              if (!foundInArray) {
                tempArray.push({
                  agName: tempChName,
                  count: tempCount
                });
              }
            }
          }

          for(var i in tempArray){
             this.state.chartSeriesChannels[0].data.push(tempArray[i].count);
             this.state.categoriesChannels.push(tempArray[i].agName);
        }

        currentDate1 = this.state.currentDate; 
        this.refs.targetDateChannel.value = handleDate(this.state.currentDate);
      }

      if(this.refs.CallStatsChannel.value == 'Last 7 days'){
          this._getchannelwisestats(7,this.props.channelwisestats,this.props.channels)

        
      }

      if(this.refs.CallStatsChannel.value == 'Last 30 days'){

         this._getchannelwisestats(30,this.props.channelwisestats,this.props.channels)

      
       }

      if(this.refs.CallStatsChannel.value == 'This Year'){
           this._getchannelwisestats(365,this.props.channelwisestats,this.props.channels)


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



refreshData4(e){
      this.refs.CallStatsAvg.value = e.target.dataset.attrib;
      this.state.chartSeriesAvg[0].data = [];
      var currentDate1;
      if(this.refs.CallStatsAvg.value  == 'Today'){
        var x = getAverageWaitMin(this.props.resolvedsessions,1);
        var x2 = getAverageCallMin(this.props.resolvedsessions,1);
        this.state.chartSeriesAvg[0].data.push(Math.round(x * 10) / 10);
        this.state.chartSeriesAvg[0].data.push(Math.round(x2 * 10) / 10);

       //this.state.chartSeriesAvg[0].data.push(20);
       // this.state.chartSeriesAvg[0].data.push(30);
        currentDate1 = this.state.currentDate; 
        this.refs.targetDateAvg.value = handleDate(this.state.currentDate);
     
    
      }

      if(this.refs.CallStatsAvg.value == 'Last 7 days'){
       
        var x = getAverageWaitMin(this.props.resolvedsessions,7);
        var x2 = getAverageCallMin(this.props.resolvedsessions,7);
        this.state.chartSeriesAvg[0].data.push(Math.round(x * 10) / 10);
        this.state.chartSeriesAvg[0].data.push(Math.round(x2 * 10) / 10);

       //this.state.chartSeriesAvg[0].data.push(20);
       // this.state.chartSeriesAvg[0].data.push(30);
        currentDate1 = this.state.currentDate; 
        this.refs.targetDateAvg.value = handleDate(new Date(new Date().setDate(new Date().getDate()-7)));
   
      }

      if(this.refs.CallStatsAvg.value == 'Last 30 days'){
          var x = getAverageWaitMin(this.props.resolvedsessions,30);
        var x2 = getAverageCallMin(this.props.resolvedsessions,30);
        this.state.chartSeriesAvg[0].data.push(Math.round(x * 10) / 10);
        this.state.chartSeriesAvg[0].data.push(Math.round(x2 * 10) / 10);

       //this.state.chartSeriesAvg[0].data.push(20);
       // this.state.chartSeriesAvg[0].data.push(30);
        currentDate1 = this.state.currentDate; 
        this.refs.targetDateAvg.value = handleDate(new Date(new Date().setDate(new Date().getDate()-30)));
   
        }

      if(this.refs.CallStatsAvg.value == 'This Year'){
          var x = getAverageWaitMin(this.props.resolvedsessions,365);
        var x2 = getAverageCallMin(this.props.resolvedsessions,365);
        this.state.chartSeriesAvg[0].data.push(Math.round(x * 10) / 10);
        this.state.chartSeriesAvg[0].data.push(Math.round(x2 * 10) / 10);

       //this.state.chartSeriesAvg[0].data.push(20);
       // this.state.chartSeriesAvg[0].data.push(30);
        currentDate1 = this.state.currentDate; 
        this.refs.targetDateAvg.value = handleDate(new Date(new Date().setDate(new Date().getDate()-365)));
   
        }
      this.forceUpdate()

 }


 handleChangeDepartment(e){
     alert(e.target.value);
     const token = auth.getToken();
   // this.state.categoriesChannels = [];
    //this.state.chartSeriesChannels = [];
     this.props.getchannelwisestats(e.target.value,token);
    
    // this.forceUpdate();
   
   
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

          <br/>
          <br/>

           {
              this.state.categoriesChannels.length>0 ?
                <Channelwise series = {this.state.chartSeriesChannels} categories = {this.state.categoriesChannels}  title = "Channel wise Session Stats"/>
            :
            <p>No data found</p>
            }
        


           <div class="clearfix">
            From <input ref="targetDateChannel" type="text"/>
                       <br/>
           To  <input ref="currentDate" value = {handleDate(this.state.currentDate)}/>
           </div>
          

          <div class="btn-group">
            <label btn-radio="'Today'" uncheckable=""  data-attrib = "Today" onClick={this.refreshData7.bind(this)} className="btn btn-success">Today</label>
            <label btn-radio="'Last 7 days'" uncheckable=""  data-attrib = "Last 7 days"  onClick={this.refreshData7.bind(this)} className="btn btn-success">Last 7 days</label>
            <label btn-radio="'Last 30 days'" uncheckable="" data-attrib="Last 30 days"  onClick={this.refreshData7.bind(this)} className="btn btn-success">Last 30 days</label>
            <label btn-radio="'This Year'" uncheckable=""  data-attrib="This Year" onClick={this.refreshData7.bind(this)} className="btn btn-success">This Year</label>
          </div>
          

            </div>
            {
              this.props.platformwisestats && this.state.categories.length > 0 &&
                <Platform series = {this.state.chartSeries} categories = {this.state.categories} title="Platform wise Sessions Stats"/>
            }
        
           <input defaultValue="This Year" ref="CallStats" type="hidden"/>
           <input defaultValue="This Year" ref="CallStatsDept" type="hidden"/>
           <input defaultValue="This Year" ref="CallStatsPages" type="hidden"/>
           <input defaultValue="This Year" ref="CallStatsCountry" type="hidden"/>
           <input defaultValue="This Year" ref="CallStatsAvg" type="hidden"/>

            <input defaultValue="This Year" ref="CallStatsAgent" type="hidden"/>
            <input defaultValue="This Year" ref="CallStatsNotif" type="hidden"/>
            <input defaultValue="This Year" ref="CallStatsCust" type="hidden"/>
            <input defaultValue="This Year" ref="CallStatsChannel" type="hidden"/>
                     

           
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


           <br/>
          <br/>

          <center><h3>Country wise Stats</h3></center>
          <table className="table table-striped table-bordered table-hover dataTable">
            <thead>
              <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending'>Country</th>
              <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending'>Number of Sessions</th>
            </thead>
           <tbody>
            {
                          this.props.countrywisestats && this.props.countrywisestats.map((country,i) =>
                            <tr>
                              <td>{country._id.country}</td>
                              <td>{country.count}</td>
                            </tr>
                            )
             }
            
            </tbody>
          </table>   
    

         <br/>
          <br/>

           {
              this.props.mobilewisestats && this.state.categoriesMobile.length > 0 &&
                <Countrywise series = {this.state.chartSeriesMobile} categories = {this.state.categoriesMobile} title="Mobile Clients vs. Web Clients"/>
            }
        


          <br/>
          <br/>

           {
              this.props.resolvedsessions && this.state.categoriesAvg.length>0 &&
                <AvgCall series = {this.state.chartSeriesAvg} categories = {this.state.categoriesAvg} />
            }
        


           <div class="clearfix">
            From <input ref="targetDateAvg" type="text"/>
                       <br/>
           To  <input ref="currentDate" value = {handleDate(this.state.currentDate)}/>
           </div>
          

          <div class="btn-group">
            <label btn-radio="'Today'" uncheckable=""  data-attrib = "Today" onClick={this.refreshData4.bind(this)} className="btn btn-success">Today</label>
            <label btn-radio="'Last 7 days'" uncheckable=""  data-attrib = "Last 7 days"  onClick={this.refreshData4.bind(this)} className="btn btn-success">Last 7 days</label>
            <label btn-radio="'Last 30 days'" uncheckable="" data-attrib="Last 30 days"  onClick={this.refreshData4.bind(this)} className="btn btn-success">Last 30 days</label>
            <label btn-radio="'This Year'" uncheckable=""  data-attrib="This Year" onClick={this.refreshData4.bind(this)} className="btn btn-success">This Year</label>
          </div>
          
          

          
          <br/>
          <br/>

           {
              this.state.categoriesAgent.length>0 && 
                <Agentwise series = {this.state.chartSeriesAgent} categories = {this.state.categoriesAgent}  title = "Agent wise Session Stats"/>
            }
        


           <div class="clearfix">
            From <input ref="targetDateAgent" type="text"/>
                       <br/>
           To  <input ref="currentDate" value = {handleDate(this.state.currentDate)}/>
           </div>
          

          <div class="btn-group">
            <label btn-radio="'Today'" uncheckable=""  data-attrib = "Today" onClick={this.refreshData5.bind(this)} className="btn btn-success">Today</label>
            <label btn-radio="'Last 7 days'" uncheckable=""  data-attrib = "Last 7 days"  onClick={this.refreshData5.bind(this)} className="btn btn-success">Last 7 days</label>
            <label btn-radio="'Last 30 days'" uncheckable="" data-attrib="Last 30 days"  onClick={this.refreshData5.bind(this)} className="btn btn-success">Last 30 days</label>
            <label btn-radio="'This Year'" uncheckable=""  data-attrib="This Year" onClick={this.refreshData5.bind(this)} className="btn btn-success">This Year</label>
          </div>
          
          
          <br/>
          <br/>

           {
              this.state.categoriesNotif.length>0 && 
                <Notificationwise series = {this.state.chartSeriesNotif} categories = {this.state.categoriesNotif}  title = "Agent wise Notifications Stats"/>
            }
        

          <br/>
          <br/>

           {
              this.state.categoriesCustomer.length>0 ?
                <Customerwise series = {this.state.chartSeriesCustomer} categories = {this.state.categoriesCustomer}  title = "Customer wise Session Stats"/>
            :
            <p>No data found</p>
            }
        


           <div class="clearfix">
            From <input ref="targetDateCustomer" type="text"/>
                       <br/>
           To  <input ref="currentDate" value = {handleDate(this.state.currentDate)}/>
           </div>
          

          <div class="btn-group">
            <label btn-radio="'Today'" uncheckable=""  data-attrib = "Today" onClick={this.refreshData6.bind(this)} className="btn btn-success">Today</label>
            <label btn-radio="'Last 7 days'" uncheckable=""  data-attrib = "Last 7 days"  onClick={this.refreshData6.bind(this)} className="btn btn-success">Last 7 days</label>
            <label btn-radio="'Last 30 days'" uncheckable="" data-attrib="Last 30 days"  onClick={this.refreshData6.bind(this)} className="btn btn-success">Last 30 days</label>
            <label btn-radio="'This Year'" uncheckable=""  data-attrib="This Year" onClick={this.refreshData6.bind(this)} className="btn btn-success">This Year</label>
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
          mobilewisestats : state.dashboard.mobilewisestats,
          countrywisestats : state.dashboard.countrywisestats,
          channels:(state.dashboard.channels),
          userdetails:(state.dashboard.userdetails),
          groupdetails :(state.dashboard.groupdetails),
          errorMessage:(state.dashboard.errorMessage),
          agents:(state.dashboard.agents),
          deptagents:(state.dashboard.deptagents),
          resolvedsessions :(state.dashboard.resolvedsessions),

          customerwisestats : state.dashboard.customerwisestats,
          agentwisestats : state.dashboard.agentwisestats,  
          agentwisenotifications : state.dashboard.agentwisenotifications,
            

           };
}


export default connect(mapStateToProps,{getpagewisestats,getagentwisecalls,gettopcustomers,getagentwisenotifications,getresolvedsessions,getmobilewisestats,getcountrywisestats,getchannelwisestats,getplatformwisestats,getdeptwisestats})(HighCharts);



