import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import {getchannelwisestats,getplatformwisestats,getdeptwisestats} from '../../redux/actions/actions'
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router'

var ReactDOM = require('react-dom');
var Highcharts = require('highcharts');

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
    }
    super(props, context);
     
    // this.state = {pieData: [{name: "Firefox",y: 6},{name: "MSIE",y: 4},{name: "Safari",y: 4},{name: "Opera",y: 1},{name: "Chrome",y: 7}]}

    this.state = {categories:[],categoriesGroup:[], chartSeries : [{"name": "Number of calls", "data": [], type: "column"}], chartSeriesGroup : [{"name": "Number of calls", "data": [], type: "column"}],currentDate :new Date()};

    
    
  }

 componentWillReceiveProps(props) {
   

     if(props.platformwisestats){
      var platformStatsData = props.platformwisestats;
      var CallStats = this.refs.CallStats.value;

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
//        alert( this.state.chartSeries[0].data.length);
        this.refs.targetDate.value = handleDate(new Date(new Date().setDate(new Date().getDate()-365)));
      }

      console.log(this.state.chartSeries[0])

    }




    /**** group wise call stats ********/

     if(props.deptwisestats){
      var deptStatsData = props.deptwisestats;
      var CallStatsDept = this.refs.CallStatsDept.value;

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

  }

 componentDidMount(){




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
          var currentDate = new Date(new Date().getFullYear(), new Date().getMonth(),
            new Date().getDate(), 0,0,0,0);
          if((currentDate.getTime()) == (gotDate.getTime())){

            var tempCurrentPage = platformStatsData[i]._id.currentpage;
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
        currentDate1 = this.state.currentDate; // added by saba
        this.refs.targetDate.value = handleDate(this.state.currentDate);
      }

      if(this.refs.CallStats.value == 'Last 7 days'){
        //alert(this.refs.CallStats.value)
        
        var tempArray = [];
        for(var i in platformStatsData){
          var gotDate = new Date(platformStatsData[i]._id.year,platformStatsData[i]._id.month-1,
           platformStatsData[i]._id.day, 0,0,0,0);
          if((new Date(new Date().setDate(new Date().getDate()-7))) <= (gotDate)){

            var tempCurrentPage =platformStatsData[i]._id.currentpage;
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
       this.refs.targetDate.value = handleDate(new Date(new Date().setDate(new Date().getDate()-7)));
      }

      if(this.refs.CallStats.value == 'Last 30 days'){
      //  alert(this.refs.CallStats.value)
        
        var tempArray = [];
        for(i in platformStatsData){
          var gotDate = new Date(platformStatsData[i]._id.year, platformStatsData[i]._id.month-1,
            platformStatsData[i]._id.day, 0,0,0,0);
          if((new Date(new Date().setDate(new Date().getDate()-30))) <= (gotDate)){

            var tempCurrentPage =platformStatsData[i]._id.currentpage;
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
       this.refs.targetDate.value = handleDate(new Date(new Date().setDate(new Date().getDate()-30)));
      }

      if(this.refs.CallStats.value == 'This Year'){
        //alert(this.refs.CallStats.value)
        
        var tempArray =[];
        for(var i in platformStatsData){
          var gotDate = new Date(platformStatsData[i]._id.year,platformStatsData[i]._id.month-1,
            platformStatsData[i]._id.day, 0,0,0,0);
          if((new Date(new Date().setDate(new Date().getDate()-365))) <= (gotDate)){

            var tempCurrentPage = platformStatsData[i]._id.currentpage;
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
       this.refs.targetDate.value = handleDate(new Date(new Date().setDate(new Date().getDate()-365)));
      }
      this.forceUpdate()

 }




refreshData2(e){
      this.refs.CallStatsDept.value = e.target.dataset.attrib;
      this.state.chartSeriesGroup[0].data = [];
      this.state.categoriesGroup = [];
      var deptStatsData = this.props.deptwisestats;
      
    
      if(this.refs.CallStatsDept.value  == 'Today'){

        
      }

      if(this.refs.CallStatsDept.value == 'Last 7 days'){
          }

      if(this.refs.CallStatsDept.value == 'Last 30 days'){
       }

      if(this.refs.CallStatsDept.value == 'This Year'){
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
          channels:(state.dashboard.channels),
          userdetails:(state.dashboard.userdetails),
          groupdetails :(state.dashboard.groupdetails),
          errorMessage:(state.dashboard.errorMessage),
          agents:(state.dashboard.agents),
          deptagents:(state.dashboard.deptagents),
           };
}


export default connect(mapStateToProps,{getchannelwisestats,getplatformwisestats,getdeptwisestats})(HighCharts);



class Platform extends React.Component {
  constructor(props) {
      super(props);
        this.chart = undefined;
    }
  
  componentDidMount() {
  this.chart = $(ReactDOM.findDOMNode(this.refs.chart)).highcharts({
        chart: {
                type: 'areaspline'
            },
        plotOptions: {
          series: {
            stacking: ''
          }
       },
      series: this.props.series,
      title: {
        text: this.props.title
      },
      credits: {
        enabled: true
      },
      loading: false,
      xAxis: {
        categories: this.props.categories
      },
      size: {
        width: '900'
      }
        
        });
  }
  
  componentWillReceiveProps(props) {
    //alert('i am called');
    this.chart.highcharts().series[0].setData(props.series[0].data);
  }
  
  render() {
      return (
        <div ref='chart'>
        </div>
      )
  }
}



class Groupwise extends React.Component {
  constructor(props) {
      super(props);
        this.chart = undefined;
    }
  
  componentDidMount() {
    alert(this.props.categories.length)
  this.chart = $(ReactDOM.findDOMNode(this.refs.chart)).highcharts({
        chart: {
                type: 'areaspline'
            },
        plotOptions: {
          series: {
            stacking: ''
          }
       },
      series: this.props.series,
      title: {
        text: this.props.title
      },
      credits: {
        enabled: true
      },
      loading: false,
      xAxis: {
        categories: this.props.categories
      },
      size: {
        width: '900'
      }
        
        });
  }
  
  componentWillReceiveProps(props) {
    //alert('i am called');
    this.chart.highcharts().series[0].setData(props.series[0].data);
  }
  
  render() {
      return (
        <div ref='chart'>
        </div>
      )
  }
}