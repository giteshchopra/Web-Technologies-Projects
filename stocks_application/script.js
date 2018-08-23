
function populateTable(){
    var data="";
    $("#tableBody").empty();
    for(var i in window.localStorage){
	var img="http://cs-server.usc.edu:45678/hw/hw8/images/Up.png	";
        var color="green";
        val = JSON.parse(localStorage.getItem(i));
        data+="<tr><td><a href='#' class='symbolStorageButton' id='"+val[0]+"-Button'>"+val[0]+"</a></td><td>"+parseFloat(val[1]).toFixed(2)+"</td>";
        if(val[2].charAt(0)=='-'){
            var img ="http://cs-server.usc.edu:45678/hw/hw8/images/Down.png";
            var color ="red";
        }
       data+="<td style="+"color:"+color+">"+val[2]+"("+val[3]+"%)<img src="+img+" style='width:18px;height:18px'></td>"+"<td>"+parseFloat(val[4]).toLocaleString()+"</td><td><buttontype='button' class='btn btn-default btn-sm deleteButton' id='"+val[0]+"-button'><span class='glyphicon glyphicon-trash'></span></button></td></tr>";
    }
   $("#tableBody").append(data);
}

function createProgressBars(){
    var progressClass='<div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar"  aria-valuemin="0" aria-valuemax="100" style="width:45%"></div></div>';
	
    $("#tablesection").empty();
    $('#tablesection').append(progressClass);
    
    $("#priceChart").empty();
    $('#priceChart').append(progressClass);
    
    $("#SMA").empty();
    $('#SMA').append(progressClass);
    
    $("#EMA").empty();
    $('#EMA').append(progressClass);
    
    $("#STOCH").empty();
    $('#STOCH').append(progressClass);
    
    $("#RSI").empty();
    $('#RSI').append(progressClass);
    
    $("#ADX").empty();
    $('#ADX').append(progressClass);
    
    $("#CCI").empty();
    $('#CCI').append(progressClass);
    
    $("#BBANDS").empty();
    $('#BBANDS').append(progressClass);
 
    $("#MACD").empty();
    $('#MACD').append(progressClass);
  
    $("#historicalchart").empty();
    $('#historicalchart').append(progressClass);
    
    $("#newsfeeds").empty();
    $('#newsfeeds').append(progressClass);  
}

function validateInput(){
  if( $("#input-0").val().trim()==""){
  	$("#inputsubmit").prop('disabled',true);
        $("#input-0").css("border","solid 1px red ");
        $("#clearButton").prop('disabled',true);
        $("#minimumchecker").html("Please enter a stock ticker symbol");
  }
  else{
        $("#inputsubmit").prop('disabled',false);
        $("#clearButton").prop('disabled',false);
        $("#minimumchecker").html("");
        $("#input-0").css("border","");
  }
}

// Symbol Extractor for input
function extractSymbol(){
    symbol  = document.getElementById("input-0").value; 
    if(!$("#bottompanel").is(":visible")){
    	$("#bottompanel").toggle("slide",{direction:'left'},'slow');
        $("#uppannel").hide();
    }
   fetchData(symbol);
}

// Function fetch All Data again
function fetchData(symbol){
    $("#uppannel").hide();
    $("#bottompanel").show();
    $("#bookmark").attr("class","glyphicon glyphicon-star-empty");
    $("#bookmark").css({'color':'black'});
    $("#starButton").prop('disabled',true);
    $("#facebookButton").prop('disabled',true);
    createProgressBars();
    var indicators =["SMA","EMA","STOCH","RSI","ADX","CCI","BBANDS","MACD"];
    var price_url='http://stockanalyzernodejs-env.us-east-2.elasticbeanstalk.com/price/'+symbol;
    var indicator_url='http://stockanalyzernodejs-env.us-east-2.elasticbeanstalk.com/indicators/'+symbol+"/indicator/";
    var news_url="http://stockanalyzernodejs-env.us-east-2.elasticbeanstalk.com/news/"+symbol;
	
    $.ajax({
        url: price_url,
        type:'GET',
        success:function(response,status,xhr){
            if(response.length==0){
            	tablecontent='<div class="alert alert-danger">Error! Failed to get <a href="#" class="alert-link">Current Stock Data</a>.</div>';
                priceChartContent='<div class="alert alert-danger">Error! Failed to get <a href="#" class="alert-link">Price Data</a>.</div>';
                historicalchartContent='<div class="alert alert-danger">Error! Failed to get <a href="#" class="alert-link">Historical Chart Data</a>.</div>';
                $("#priceChart").empty();
                $('#priceChart').append(priceChartContent);
                console.log("Else Error");
                $("#historicalchart").empty();
                $("#historicalchart").append(historicalchartContent);
                $("#tablesection").empty();
                $("#tablesection").append(tablecontent);
              }
             else{
             	$("#hideUpper").prop("disabled",false);
                create_chart_stock(response);
             }
        }, // Price Success
        error: function(xhr,status,error){
            tablecontent='<div class="alert alert-danger">Error! Failed to get <a href="#" class="alert-link">Current Stock Data</a>.</div>';
            priceChartContent='<div class="alert alert-danger">Error! Failed to get <a href="#" class="alert-link">Price Data</a>.</div>';
            historicalchartContent='<div class="alert alert-danger">Error! Failed to get <a href="#" class="alert-link">Historical Chart Data</a>.</div>';
            $("#historicalchart").empty();
            $("#historicalchart").append(historicalchartContent);
            $("#priceChart").empty();
            $('#priceChart').append(priceChartContent);
            console.log(" error : Error");
            $("#tablesection").empty();
            $("#tablesection").append(tablecontent);
         } // Price Fail
    });
    for(var i=0;i<indicators.length;i++)
    {
        var indicator_url_new = indicator_url+indicators[i];
        indicator=indicators[i];
        $.ajax({
            url: indicator_url_new,
            type:'GET',
            success:function(response,status,xhr){ 
            	if(response.length==0) {
	            url=this.url.split("/");
	            indicator=url[url.length-1];
	            tablecontent='<div class="alert alert-danger">Error! Failed to get <a href="#" class="alert-link">Current '+indicator+' Data</a>.</div>';
	            $("#"+indicator).empty();
	            $("#"+indicator).append(tablecontent);
                }
                else
                    createChartIndicators(response);
            },
            error: function(xhr,status,error){ 
            	url=this.url.split("/");
            	indicator=url[url.length-1];
            	tablecontent='<div class="alert alert-danger">Error! Failed to get <a href="#" class="alert-link">Current '+indicator+' Data</a>.</div>';
            	$("#"+indicator).empty();
            	$("#"+indicator).append(tablecontent);
           }
        }); 
    } 
    $.ajax({
        url: news_url,
        type:'GET',
        success:function(response,status,xhr){           
            if(response.length==0){
                newsfeed='<div class="alert alert-danger">Error! Failed to get <a href="#" class="alert-link">News Data</a>.</div>';
            	$("#newsfeeds").empty();
            	$('#newsfeeds').append(newsfeed);
             }
            else
            	createNews(response);
        },
        error: function(xhr,status,error){
            newsfeed='<div class="alert alert-danger">Error! Failed to get <a href="#" class="alert-link">News Data</a>.</div>';
            $("#newsfeeds").empty();
            $('#newsfeeds').append(newsfeed);
       }
    });
} 

// Function to Create News
function createNews(newsArray){
    var newsString;
    $("#newsfeeds").empty();
    var newsString="";
    for(i=0;i<newsArray.length;i++){
        var date = moment.tz(newsArray[i]["pubDate"],"America/New_York");
	date = date.tz("America/New_York").format("ddd, DD MMM YYYY HH:mm:ss z");
        newsString+='<div class="panel panel-default"><div class="panel-heading"><a href="#" onclick="window.open'+"('"+newsArray[i]["link"]+"')"+';return false;"><b>'+newsArray[i]["title"]+'</b></a>'+"<br><br><b>Author: </b><b>"+newsArray[i]["author_name"]+"</b><b><br><br> Date: " +date+'</b></div></div>';
    }
    $("#newsfeeds").append(newsString);
}


//angular for autocomplete
(function() {
    'use strict';
    angular
        .module('MyApp')
        .controller('DemoCtrl', DemoCtrl);

    function DemoCtrl($http,$scope) {
        this.querySearch = function (query) {
            return $http.get('http://stockanalyzernodejs-env.us-east-2.elasticbeanstalk.com/autocomplete/' + escape(query))
		    .then(function(result) {
                return result.data;
            });
        }
        $scope.slider2 = function () {
            $("#uppannel").toggle("slide",{direction:'left'},'slow');
            $("#bottompanel").hide(); 
        }
        $scope.slider1 = function () {
           $("#bottompanel").toggle("slide",{direction:'right'},'slow');
           $("#uppannel").hide();
        }
    }
})();

// Stock Price Chart and Table 

function create_chart_stock(json_data_stock){
    $("#priceChart").empty();
    symbol=json_data_stock["symbol"];
    price=json_data_stock["close"];
    volume=json_data_stock["volume"];
    max_volume = json_data_stock["max"];
    outer_array_price=json_data_stock["priceArray"];
    outer_array_volume=json_data_stock["volumeArray"];
    date = json_data_stock["dateArray"];
    tablecontent="";
    difference =(parseFloat(json_data_stock["close"])-parseFloat(json_data_stock["prev_close"]));
    change = parseFloat(difference).toFixed(2);
    changepercent =parseFloat((change/parseFloat(json_data_stock["prev_close"]))*100).toFixed(2);
    tablecontent += "<table class='table table-striped'>"+"<tbody><c1><td><b>Stock Ticker Symbol</b></td><td id='stocksymbol'>"+json_data_stock["symbol"]+"</td></tr> <tr><td><b>Last Price</b></td>"+"<td id='lastprice'>"+parseFloat(json_data_stock["close"]).toFixed(2)+"</td></tr><tr><td><b>"+"Change (Change Percent)</b></td>";
    color="Green";
    image ="<img src='http://cs-server.usc.edu:45678/hw/hw8/images/Up.png'style='height: 15px; width: 18px;'>";
    if(difference<0){ 
        color ="red";
        image="<img src='http://cs-server.usc.edu:45678/hw/hw8/images/Down.png'style='height: 15px; width: 18px;'>"; 
    }
    tablecontent+="<td style='color:"+color+";' id='changpercent'>"+change+" ("+changepercent+"%)";
    tablecontent+=image ;
    var momdate = moment.tz(json_data_stock["timestamp"],"America/New_York");
    if(momdate.tz("America/New_York").format("HH")=="00"){
        momdate.set({hour:"16"});
    }
    momdate = momdate.tz("America/New_York").format("YYYY-MM-DD HH:mm:ss z");
    tablecontent+= "</td></tr><tr><td><b>Timestamp</b></td>"+'<td id="timestamp">'+momdate+"</td>"+"</tr><tr><td><b>Open</b></td><td id='open'>"+parseFloat(json_data_stock["open"])+"</td></tr>";
    tablecontent+="<tr><td><b>Previous close</b></td>"+'<td id="lastclose">'+parseFloat(json_data_stock["prev_close"]).toFixed(2)+"</td></tr>";
    tablecontent+="<tr><td><b>Day's Range</b></td>"+'<td id="range">'+parseFloat(json_data_stock["low"]).toFixed(2)+"-"+parseFloat(json_data_stock["high"]).toFixed(2)+'</td></tr>';
    tablecontent+='<tr><td><b>Volume</b></td>'+'<td id="volume">'+parseFloat(json_data_stock["volume"]).toLocaleString()+'</td></tr></tbody></table>';
    if (localStorage.getItem(symbol) !== null) {
        $("#bookmark").attr("class","glyphicon glyphicon-star");
        $("#bookmark").css({'color':'rgb(204,170,57)'});
    }
    $("#tablesection").empty();
    $("#tablesection").append(tablecontent);
    Highcharts.chart('priceChart', {
        chart: {
            zoomType: 'x',
            borderWidth: 2,
            borderColor:'#dddddd'
        },
        title: {
            text: symbol+'Stock Price and Volume'
        },
        subtitle: {
            useHTML:true,
            text: '<a href="https://www.alphavantage.co/" style="text-decoration:none;" target="_blank">Source: Alpha Vantage</a>'
        },
        xAxis: {
            type: 'datetime',
            tickInterval:5,
            categories:date,
            reversed:true,

            labels:{
                format:"{value:%m/%d}"
            }
        },
        yAxis: [{ // left y axis
            title: {
                text: 'Stock Price' 
            },
        },
        { // right y axis
            gridLineWidth: 0,
            opposite:    true,
            max:max_volume,
            title:{
            	text: 'Volume'
             },
         }],
        tooltip:{xDateFormat:'%m/%d',},
        categories:date,
        plotOptions: {
            area: {
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null,
                marker: {
                    radius: 0,
                }
            }
        },
        series: [{
            type:'area',
            name: symbol,
            data: outer_array_price,
            color:'#0000FF',
            fillOpacity:"0.3"
        },{
            type: 'column',
            name: symbol+" "+"Volume",
            data: outer_array_volume,
            color:'#f2202c',
            yAxis:1
        }]
    });

   $("#starButton").prop('disabled',false); //$("#facebookButton").prop('disabled',false);
   createStockChart(json_data_stock["stockArray"],json_data_stock["symbol"]);  
}  
// Indicator Charts 
function createChartIndicators(masterArray,symbol)
{
    div = "#"+masterArray[1];
    $(div).empty();
    var dataArray=[];  
    counter=0;
    for(var i=4;i<masterArray.length-1;i++)
    {
        obj={type:'spline',name:masterArray[masterArray.length-1][counter],data:masterArray[i]};
        dataArray.push(obj);
        counter++;
    }
    Highcharts.chart(masterArray[1], {
        chart: {
            zoomType: 'x',
            borderWidth: 2,
            borderColor:'#dddddd'
        },
        title: {
            text: masterArray[2]
        },
        subtitle: {
            useHTML:true,
            text: '<a href="https://www.alphavantage.co/" style="text-decoration:none;" target="_blank">Source: Alpha Vantage</a>'
        },
        xAxis: {
            type: 'datetime',
            tickInterval:5,
            categories:masterArray[3],
            reversed:true,

            labels:{
                format:"{value:%m/%d}"
            }
        },
        yAxis: [{ // left y axis
            title: {
                text: masterArray[1]
            },
        }],
        tooltip:{xDateFormat:'%m/%d',},

        legend: {
            layout: 'horizontal',

        },
        categories:masterArray[3],
        plotOptions: {
            spline: {

                marker:{
                    enabled:true,
                    radius:2
                },
                lineWidth: 1,
            }
        },
        series: dataArray
    });
}

//HighStock Chart
function createStockChart(dataArray,symbol)
{
    var chart = Highcharts.stockChart('historicalchart', {
        chart: {
            height: 400
        },

        title: {
            text: symbol+ " Stock Value"
        },
        subtitle: {
            useHTML:true,
            text: '<a href="https://www.alphavantage.co/" style="text-decoration:none;" target="_blank">Source: Alpha Vantage</a>' 
        },
        rangeSelector: {
            buttons: [{
                type: 'week',
                count: 1,
                text: '1w'
            },
                      {
                          type: 'month',
                          count: 1,
                          text: '1m'
                      },{
                          type: 'month',
                          count: 3,
                          text: '3m'
                      }, {
                          type: 'month',
                          count: 6,
                          text: '6m'
                      },
                      {
                          type: 'ytd',
                          count: 1,
                          text: 'YTD'
                      },
                      {
                          type: 'year',
                          count: 1,
                          text: '1y'
                      },
                      {
                          type: 'all',
                          count: 1,
                          text: 'All'
                      }],
           
        },
        yAxis: {
            title: {
                text: 'Stock Value'
            }
        },
        tooltip:{ 
		split:false    
        },
        series: [{
            name: 'Stock Price',
            data: dataArray,
            type: 'area',
            threshold: null,
            tooltip: {
                valueDecimals: 2,
                 xDateFormat: '%A-%B-%Y'
            }
        }],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    chart: {
                        height: 300
                    },
                    subtitle: {
                        text: null
                    },
                    navigator: {
                        enabled: false
                    }
                }
            }]
        }
    });

    $('#small').click(function () {
        chart.setSize(400);
    });

    $('#large').click(function () {
        chart.setSize(800);
    });

    $('#auto').click(function () {
        chart.setSize(null);
    });
}

// Facebook Code
$(document).ready(function(){
    (function() {
        var e = document.createElement('script'); e.async = true;
        e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
        document.getElementById('fb-root').appendChild(e);
    }());
    window.fbAsyncInit = function() {
        FB.init({appId: 1973975136204288, status: true, cookie: true, xfbml: true});
    };
    $('#facebookButton').click(function(e){
        var obj = {},chart;
        var activeTab= $('.nav-tabs .active')
        chart = $($(activeTab.html()).attr("href")).highcharts();
        obj.svg = chart.getSVG();
        obj.type = 'image/png';
        obj.width = 450; 
        obj.async = true;
        $.ajax({
            type: 'post',
            url: chart.options.exporting.url,        
            data: obj, 
            success: function (data) {            
                var exportUrl = this.url+data;
                FB.ui({
                        method: 'share',
                        href:exportUrl,
                    },
                    (response) =>{
                        if(response &&  !response.error_message)
                            {
                                alert("Posted success");
                            }
                        else{
                            alert("not posted");
                        }
                    }
                );
            },
             error: function(xhr,status,error)
            {
             console.log("Error");
             }
            
        
        });
    });

    $("#bottompanel").hide();
    
    $(document).on("click", "#inputsubmit", function() {
         extractSymbol();
        
     });
    
    //Function to fetch data corresponding to the symbol again.
    $(document).on("click",".symbolStorageButton" , function() {
    symbolValue= this.id.split("-")[0];
    fetchData(symbolValue);
    });

     $(document).on("click", "#clearButton", function() {
     	if(!$("#uppannel").is(":visible")){
     	    $("#uppannel").toggle("slide",{direction:'right'},'slow');
            $("#bottompanel").hide();
     }
     	$("#input-0").val("");
     	$("#hideUpper").prop("disabled",true);
     	$("#inputsubmit").prop("disabled",true);
     });
     $("#input-0").focusout(function(){
    	validateInput();
     });  
     $("#input-0").keyup(function(){
     	validateInput();
});   
    // Function for Refreshing
    function refreshFavorites()
    {
        console.log("Inside Refresh Favorites..refreshing");
        var requests=[];
        for (var i = 0; i < localStorage.length; i++){
            var val = JSON.parse(localStorage.getItem(localStorage.key(i)));
            var symbol=val[0];
            var symbol_url='http://stockanalyzernodejs-env.us-east-2.elasticbeanstalk.com/refresh/'+symbol;
            var req= $.ajax({
                url: symbol_url,
                success:function(response,status,xhr)
                {
                    symbol=response["symbol"];
                    val=[];
                    val[0]=symbol;
                    var price=response["price"];
                    val[1]=price;
                    prev_price=response["prev_price"];
                    difference = parseFloat(price)-parseFloat(prev_price);
                    val[2]=difference.toFixed(2);
                    val[3]=((difference)/parseFloat(prev_price)*100).toFixed(2);
                    val[4]=response["volume"];
                    localStorage.setItem(symbol,JSON.stringify(val));
                }
            });
            requests.push(req);
        }
        $.when.apply($, requests).then(function() {
            populateTable();
        });
    }
    $("#refresh").click(function(){ 
        refreshFavorites();
    });
	
    var interval; 
    $("#toggler").change(function() {
        if ($(this).is(":checked")){
            interval = setInterval(refreshFavorites,5000);
        }
        else{   
            clearInterval(interval);
        }
    });
    
    $("#SortingOrder").prop('disabled',true);

    $('select').on('change', function() {
    	var selectedValue = $('#Sorter').find(":selected").text();
    	    if(selectedValue!='Default'){
                $("#SortingOrder").prop('disabled',false);
         	var selectedType = $('#SortingOrder').find(":selected").text();
        	sortTable(selectedValue,selectedType);
        }
    else
        $("#SortingOrder").prop('disabled',true);
    });
    
function sortTable(selectedValue,selectedType) {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("favoritesTable");
    var index;
    switch (selectedValue){
        case "Symbol":
            index=0;
            break;
        case "Price":
            index=1;
            break;
        case "Change":
            index=2;
            break;
        case "Change Percent":
            index=5;
            break;
        case "Volume":
            index=3;
            break;
    }
  switching = true;

  while (switching) {
    switching = false;
    rows = table.getElementsByTagName("tr");
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
     if(index==5){
         x = rows[i].getElementsByTagName("td")[2];
         y = rows[i + 1].getElementsByTagName("td")[2];
     }
     else{
         x = rows[i].getElementsByTagName("td")[index];
         y = rows[i + 1].getElementsByTagName("td")[index];     
        }
	    
      var val1,val2;
      if(index==0){
          val1=x.innerHTML;
          val2=y.innerHTML;
       }
      else if(index==5){
          val1 = parseFloat(x.innerHTML.split("(")[1].split("%")[0]);
          val2 = parseFloat(y.innerHTML.split("(")[1].split("%")[0]);
        }
      else if(index==3){  
          val1=parseFloat(x.innerHTML.replace(/,/g,''));
          val2=parseFloat(y.innerHTML.replace(/,/g,''));
        }
      else{
          val1=parseFloat(x.innerHTML);
          val2=parseFloat(y.innerHTML);  
        }
    if(selectedType=="Ascending")
    {
      if (val1 > val2) {
        //if so, mark as a switch and break the loop:
        shouldSwitch= true;
        break;
      }
    }
       else
       {
            if (val2 > val1) {
                shouldSwitch= true;
                break;
        }  
       }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}



    //Bookmark Button   

    $(document).on("click", "#starButton", function() {
        listOfFavorites=[];
        if($("#bookmark").hasClass("glyphicon glyphicon-star-empty"))
        {
            $("#bookmark").attr("class","glyphicon glyphicon-star");
            $("#bookmark").css({'color':'rgb(204,170,57)'});
            listOfFavorites.push(symbol);
            listOfFavorites.push(price);
            console.log("Putting to listOfFavorites:"+price);
            listOfFavorites.push(change);
            console.log("Putting to listOfFavorites:"+change);
            listOfFavorites.push(changepercent);
            listOfFavorites.push(volume);
            if (typeof(Storage) !== "undefined") {
                data= JSON.stringify(listOfFavorites);
                localStorage.setItem(symbol,data);
            } 
            else {

            }
        }
        else
        {  
	     $("#bookmark").attr("class","glyphicon glyphicon-star-empty");
             $("#bookmark").css({'color':'black'});
             if (typeof(Storage) !== "undefined") {
                 localStorage.removeItem(symbol);
             }
           }
        populateTable();  
    });


    // Delete Button code
$("#hideUpper").prop("disabled",true);

$(document).on("click",".deleteButton" , function() {
    symbolValue= this.id.split("-")[0];
    localStorage.removeItem(symbolValue);
    if(symbolValue==symbol)
        $("#bookmark").css({'color':'black'});
    $(this).parent().parent().remove();
    for(var i in window.localStorage){
        console.log(localStorage.getItem(i));
    }
  });

 $('ul.nav-tabs li').click( function (e) {
     setTimeout( function(){
     if($('.tab-pane.fade.active.in.commonIndicators .highcharts-container').length>0){
         $("#facebookButton").prop('disabled',false);
     }       
     else{
          $("#facebookButton").prop('disabled',true);
     }},700);
}) 

populateTable();

});



