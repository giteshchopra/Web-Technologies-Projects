    <!DOCTYPE html>
    <html>
        <script src="https://code.highcharts.com/highcharts.src.js"></script>
        <?php date_default_timezone_set("UTC");?>
        <form style="border:2px; border-style:solid;border-color:#dddddd ;margin:auto;width:30%;background-color:rgb(245,245,245)" method="post" onSubmit="return submitted()">
            <h1 align="center" style="margin-top:0px;margin-bottom:0px"><i>Stock Search</i></h1>
            <hr style="margin-left:10px;border-color:#dddddd;margin-right:10px">
            <div style="margin-left:5px">
                <p style="margin-bottom:1px">
                Enter Stock Ticker Symbol:* 
                <input style="text-align: inline;" type=text id="input" name="input" value="<?php 
                if(isset($_POST['input']))
                    echo $_POST['input'];?>"> 
                </p>
            </div>
            <input style="margin-top:0px; float:left;margin-left:195px;" type="submit" value="search" name="submit">
            <input style="float:left;margin-left:10px" type="button" value="clear" id="button" onclick="clearPage()">
            <br>
            <div style="clear:both;font-style: italic;"> *-Mandatory fields</div>
            <br> <br>
            <script>
                
                function submitted()
                {
                    if(document.getElementById("input").value=="")
                    {  
                        alert("No symbol entered. Please Enter a symbol");
                        return false;
                    }
                }
                
                function clearPage(){
                    if(document.getElementById("input"))
                        if(document.getElementById("input").value!="")
                            document.getElementById("input").value="";
                    
                    if(document.getElementById("clickheretext"))
                        if(document.getElementById("clickheretext").innerHTML!="")
                            document.getElementById("clickheretext").innerHTML="";
                    
                    if(document.getElementById("wrapperImage"))
                        if(document.getElementById("wrapperImage").innerHTML!="")
                            document.getElementById("wrapperImage").innerHTML="";
                
                    if(document.getElementById("chart"))
                        if(document.getElementById("chart").innerHTML!="")
                            document.getElementById("chart").innerHTML="";
                    if(document.getElementById("table"))
                        if(document.getElementById("table").innerHTML!="")
                            document.getElementById("table").innerHTML="";

                    if(document.getElementById("input"))
                        if(document.getElementById("input").innerHTML!="")
                            document.getElementById("input").value=""; 

                    if(document.getElementById("stocktable"))
                        if(document.getElementById("stocktable").innerHTML!="")
                            document.getElementById("stocktable").innerHTML="";

                    if(document.getElementById("error_table"))
                        if(document.getElementById("error_table").innerHTML!="")
                            document.getElementById("error_table").innerHTML="";
                }
                
                function changeImage()
                {
                    if (document.getElementById("toggler").src == "http://cs-server.usc.edu:45678/hw/hw6/images/Gray_Arrow_Down.png") 
                    {
                        document.getElementById("toggler").src = "http://cs-server.usc.edu:45678/hw/hw6/images/Gray_Arrow_Up.png";
                        document.getElementById("table").style='display:"";margin:0 auto;width:80%;margin-top:5px;';
                        document.getElementById("clickheretext").innerHTML="Click here to hide stock news"
                    }
                    else 
                    {
                        document.getElementById("toggler").src = "http://cs-server.usc.edu:45678/hw/hw6/images/Gray_Arrow_Down.png";
                        document.getElementById("table").style='display:none';
                        document.getElementById("clickheretext").innerHTML="Click here to show  stock news"

                    }
                }
                
                function feed_generator(jsonObj)
                {

                    items=jsonObj.channel.item;
                    var str='<table border="solid">';
                    var substring="seekingalpha.com/article";
                    var counter=0;
                    for(i=0;i<items.length;i++)
                    {
                        if(counter==5)
                            break;
                        item=items[i];   
                        if(item["link"].indexOf(substring) !== -1)
                        {
                            str+="<tr><td><a href="+item["link"]+' style="text-decoration:none;" target="_blank">'+item["title"]+"</a>&nbsp;"+"&nbsp;&nbsp;Publicated Time : "+item["pubDate"].substr(0,25)+"</td></tr>";
                            console.log(item["link"]);
                            counter++;
                        }
                    }
                    str+="</table>";
                    document.getElementById("table").innerHTML=str;
                }   
                function createChart1(symbol,company)
                {
                    var response;
                    var jsonObj=null;
                    var url="https://www.alphavantage.co/query?function="+symbol+"&symbol="+company+"&outputsize=full&interval=daily&time_period=10&series_type=close&apikey=S2HX8THWDAM34YUP" ;
                    var xhttp = new XMLHttpRequest();
                    xhttp.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {
                            response=this.responseText;
                            jsonObj = JSON.parse(response);
                            parser1(jsonObj,symbol,company);
                        }
                    };
                    xhttp.open("GET", url, true);
                    try{  
                        xhttp.send();
                    }
                    catch(e)
                    {
                        alert("File Not FOUND");
                        return;
                    }

                    function parser1(json,symbol,company)
                    {
                        objects = json[ "Technical Analysis: "+symbol];
                        indicator= json["Meta Data"]["2: Indicator"];
                        dates = Object.keys(objects);
                        outer_array=[];
                        date=[];
                        for(var i=0;i<132;i++)
                        {
                            var inner_array=[];
                            innerObjects =objects[dates[i]];
                            innerKeys = Object.keys(innerObjects);
                            console.log("printing inner objetsandinnerkeys"+innerObjects[innerKeys]);
                            inner_array.push(parseFloat(innerObjects[innerKeys]));
                            outer_array.push(inner_array);
                            date.push(Date.parse(dates[i]));
                            console.log(objects[dates[i]]);
                        }

                        Highcharts.chart('chart', {
                            chart: {
                                zoomType: 'x',
                                borderWidth: 2,
                                borderColor:'#dddddd'
                            },
                            title: {
                                text: indicator
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
                                    text: symbol
                                },


                            }],
                            tooltip:{xDateFormat:'%m/%d',},

                            legend: {
                                layout: 'vertical',
                                align: 'right',
                                verticalAlign: 'middle'
                            },

                            categories:date,
                            plotOptions: {
                                spline: {

                                    marker:{
                                        enabled:true,
                                        radius:2
                                    },
                                    lineWidth: 1,


                                }
                            },

                            series: [{
                                type:'spline',
                                name: company,
                                data: outer_array
                            }]
                        });
                    }

                }

                function createChart2(symbol,company)
                {
                    var response;
                    var jsonObj=null;
                    var url="https://www.alphavantage.co/query?function="+symbol+"&symbol="+company+"&outputsize=full&interval=daily&time_period=10&series_type=close&apikey=S2HX8THWDAM34YUP" ;
                    if(symbol.toUpperCase=="BBANDS")
                        url+="&slowkmatype=1& slowdmatype=1";
                    var xhttp = new XMLHttpRequest();
                    xhttp.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {
                            response=this.responseText;
                            jsonObj = JSON.parse(response);
                            parser2(jsonObj,symbol,company);
                        }
                    };
                    xhttp.open("GET", url, true);

                    try{  xhttp.send();}
                    catch(e)
                    {
                        alert("File Not FOUND");
                        return;}
                    function parser2(json,symbol,company)
                    {
                        objects = json[ "Technical Analysis: "+symbol];
                        indicator= json["Meta Data"]["2: Indicator"];
                        dates = Object.keys(objects);
                        outer_array1=[];
                        outer_array2=[];
                        var key1;
                        var key2;

                        date=[];
                        for(var i=0;i<132;i++)
                        {
                            var  InnerArrayOfKey1=[];
                            var InnerArrayOfKey2=[];
                            innerObjects =objects[dates[i]];
                            innerKeys = Object.keys(innerObjects);
                            key1=innerKeys[0];
                            key2=innerKeys[1];
                            InnerArrayOfKey1.push(parseFloat(innerObjects[innerKeys[0]]));
                            InnerArrayOfKey2.push(parseFloat(innerObjects[innerKeys[1]]));
                            outer_array1.push(InnerArrayOfKey1);
                            outer_array2.push(InnerArrayOfKey2);
                            date.push(Date.parse(dates[i]));
                        }

                        Highcharts.chart('chart', {
                            chart: {
                                zoomType: 'x',
                                borderWidth: 2,
                                borderColor:'#dddddd'
                            },
                            title: {
                                text: indicator
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
                                    text: symbol
                                },

                            }],
                            tooltip:{xDateFormat:'%m/%d',},

                            legend: {
                                layout: 'vertical',
                                align: 'right',
                                verticalAlign: 'middle'
                            },

                            categories:date,
                            plotOptions: {
                                spline: {

                                    marker:{
                                        enabled:true,
                                        radius:2
                                    },
                                    lineWidth: 1,

                                }
                            },

                            series: [{
                                type:'spline',
                                name:company+" "+key1,
                                data: outer_array1
                            },{
                                type:'spline',
                                name:company+" "+key2,
                                data: outer_array2
                            }
                             ]
                        });
                    }



                }

                function createChart3(symbol,company)
                {
                    console.log(symbol,company);
                    var response;
                    var jsonObj=null;
                    var url="https://www.alphavantage.co/query?function="+symbol+"&symbol="+company+"&outputsize=full&interval=daily&time_period=10&nbdevup=3&nbdevdn=3&time_period=5&series_type=close&apikey=S2HX8THWDAM34YUP" ;
                    var xhttp = new XMLHttpRequest();
                    xhttp.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {
                            response=this.responseText;
                            jsonObj = JSON.parse(response);
                            parser3(jsonObj,symbol,company);
                        }
                    };
                    xhttp.open("GET", url, true);

                    try{  xhttp.send();}
                    catch(e)
                    {
                        alert("File Not FOUND");
                        return;
                    }
                    
                    function parser3(json,symbol,company)
                    {
                        objects = json[ "Technical Analysis: "+symbol];
                        indicator= json["Meta Data"]["2: Indicator"];
                        dates = Object.keys(objects);
                        outer_array1=[];
                        outer_array2=[];
                        outer_array3=[];
                        var key1;
                        var key2;
                        var key3;

                        date=[];
                        for(var i=0;i<132;i++)
                        {
                            var  InnerArrayOfKey1=[];
                            var InnerArrayOfKey2=[];
                            var InnerArrayOfKey3=[];

                            innerObjects =objects[dates[i]];
                            innerKeys = Object.keys(innerObjects);

                            key1=innerKeys[0];
                            key2=innerKeys[1];
                            key3=innerKeys[2];

                            InnerArrayOfKey1.push(parseFloat(innerObjects[innerKeys[0]]));
                            InnerArrayOfKey2.push(parseFloat(innerObjects[innerKeys[1]]));
                            InnerArrayOfKey3.push(parseFloat(innerObjects[innerKeys[2]]));
                            outer_array1.push(InnerArrayOfKey1);
                            outer_array2.push(InnerArrayOfKey2);
                            outer_array3.push(InnerArrayOfKey3);
                            date.push(Date.parse(dates[i]));
                        }


                        Highcharts.chart('chart', {
                            chart: {
                                zoomType: 'x',
                                borderWidth: 2,
                                borderColor:'#dddddd'
                            },
                            title: {
                                text: indicator
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
                                    text: symbol
                                },


                            }],
                            tooltip:{xDateFormat:'%m/%d',},

                            legend: {
                                layout: 'vertical',
                                align: 'right',
                                verticalAlign: 'middle'
                            },

                            categories:date,
                            plotOptions: {
                                spline: {
                                    marker:{
                                        enabled:true,
                                        radius:2
                                    },

                                    lineWidth: 1,

                                }
                            },

                            series: [{
                                type:'spline',
                                name:company+" "+key1,
                                data: outer_array1
                            },{
                                type:'spline',
                                name:company+" "+key2,
                                data: outer_array2
                            },{
                                type:'spline',
                                name:company+" "+key3,
                                data: outer_array3
                            }
                                    ]
                        });
                    }



                }


                var json_data_stock;
                function create_chart_stock(json_data_stock)
                {

                    //  json_data_stock=JSON.parse(jsob_obj);

                    time_series=json_data_stock["Time Series (Daily)"];
                    company= json_data_stock["Meta Data"]["2. Symbol"];
                    dates=Object.keys(time_series);
                    var outer_array=[];
                    var outer_array_price=[];
                    var lastdate;
                    var max_volume=0;
                    lastdate=dates[0];
                    var date=[];
                    for(var i=0;i<132;i++)
                    {

                        var inner_array=[];
                        var inner_array_price=[];

                        inner_array.push(parseFloat(time_series[dates[i]]["5. volume"]));
                        inner_array_price.push(parseFloat(time_series[dates[i]]["4. close"]));
                        date.push(Date.parse(dates[i]));
                        if(parseFloat(time_series[dates[i]]["5. volume"])>max_volume)
                            max_volume=parseFloat(time_series[dates[i]]["5. volume"]);
                        outer_array.push(inner_array);
                        outer_array_price.push(inner_array_price);


                    }
                    Highcharts.chart('chart', {
                        chart: {
                            zoomType: 'x',
                            borderWidth: 2,
                            borderColor:'#dddddd'
                        },
                        title: {
                            text: 'Stock Price ('+'<?php date_default_timezone_set("UTC");echo date("m/d/Y")?>' +')'
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
                                    max:4.2*max_volume,
                                    title: {
                                        text: 'Volume'
                                    },


                                }],
                        tooltip:{xDateFormat:'%m/%d',},

                        legend: {
                            layout: 'vertical',
                            align: 'right',
                            verticalAlign: 'middle'
                        },

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
                            name:company,
                            data: outer_array_price,
                            color:'rgb(228,150,146)'
                        },{
                            type: 'column',
                            name: company+" "+"Volume",
                            data: outer_array,
                            color:'rgb(255,255,255)',
                            yAxis:1
                        }]
                    });

                }


            </script>
        </form>

        <?php
        //if($_SERVER["REQUEST_METHOD"]=="POST")
        if(isset($_POST['submit']))
        {
            if(empty($_POST['input']))
            {
                echo"<script type='text/javascript'>alert('Please enter a symbol');</script>";
            }
            else
            {
                $company=$_POST['input'];
                $URL="https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=full&symbol=".$_POST['input']."&apikey=S2HX8THWDAM34YUP";
                //  echo $URL;
                $arrContextOptions=array(
                "ssl"=>array(
                "verify_peer"=>false,
                "verify_peer_name"=>false,
                ),
                );  
                $response =file_get_contents($URL, false, stream_context_create($arrContextOptions));

                $json=json_decode($response,true);
                if(!$json["Error Message"])
                {
                    $time_series= $json["Time Series (Daily)"];
                    //Get Time Series as the Key , value is an array
                    // Since this is a further array need to iterate
                    // Every value is further a key
                    $open="";
                    $high="";
                    $low="";
                    $close="";
                    $volume="";
                    $time_stamp="";
                    $prev_open="";
                    $prev_high="";
                    $prev_low="";
                    $prev_close="";
                    $prev_volume="";
                    $i=0;
                    foreach($time_series as $key=>$value)
                    {
                        global $i;
                        if($i==0)
                        {
                            global $open;
                            global $high;
                            global $low;
                            global $close;
                            global $volume;
                            global $time_stamp;
                            $open= $value["1. open"];
                            $high= $value["2. high"];
                            $low= $value["3. low"];
                            $close=$value["4. close"];
                            $volume=$value["5. volume"];
                            $time_stamp = $key;
                        }
                        if($i==1)
                        {
                            global $prev_open;
                            global $prev_high;
                            global $prev_low;
                            global $prev_close;
                            global $prev_volume;
                            $prev_open= $value["1. open"];
                            $prev_high= $value["2. high"];
                            $prev_low= $value["3. low"];
                            $prev_close=$value["4. close"];
                            $prev_volume=$value["5. volume"];

                            break;
                        }
                        $i++;
                    }

        ?>
        <style>
            table, td, th {    
                border: 1px solid #ddd;
                text-align: left;
            }

            table {
                border-collapse: collapse;
                width: 100%;
            }

            th, td {
                padding: 1px;
            }
            
            .bgTd {
                background-color: rgb(243, 243, 243);
            }
            .bgTdr{
                background-color:rgb(251,251,251);
                text-align:center;
            }
          
        </style>
        <table id="stocktable" style="margin:auto;width:80%;margin-top:5px;height:40%"><tr><td class = "bgTd"><b>Stock Ticker Symbol</b></td><td class="bgTdr"><?php echo $company ?></td></tr>
            <tr><td class = "bgTd"><b>Close</b></td><td class="bgTdr"><?php echo $close; ?></td></tr>
            <tr><td class = "bgTd"><b>Open</b></td><td class="bgTdr"><?php echo $open; ?></td></tr>
            <tr><td class = "bgTd"><b>Previous Close</b></td><td class="bgTdr"><?php echo $prev_close; ?></td></tr>
            <tr><td class = "bgTd"><b>Change</b></td><td class="bgTdr"><?php $change=($close-$prev_close); echo $change;
            $image="";
            if($change>0){
                global $image;
                $image="http://cs-server.usc.edu:45678/hw/hw6/images/Green_Arrow_Up.png";
                    }
            else{ 
                global $image;
                $image="http://cs-server.usc.edu:45678/hw/hw6/images/Red_Arrow_Down.png ";
             }
                ?><img src="<?php echo $image ?>" style="height: 15px; width: 18px;"></td></tr>
            <tr>
                <td class = "bgTd"><b>Change Percent</b></td><td class="bgTdr"><?php echo round((((float)$close -(float)$prev_close)/(float)$prev_close)*100,2); ?>%<img src="<?php echo $image ?>" style="height: 15px; width: 18px;"> </td></tr>
            <tr>
                <td class = "bgTd"><b>Day's Range</b></td><td class="bgTdr"><?php echo $low."-".$high; ?></td></tr>
            <tr>
                <td class = "bgTd"><b>Volume</b></td><td class="bgTdr"><?php echo number_format($volume); ?></td></tr>
            <tr>
                <td class = "bgTd"><b>Timestamp</b></td><td class="bgTdr"><?php echo $time_stamp; ?></td></tr>
            <tr>
                <td class = "bgTd"><b>Indicators</b></td><td style="text-align:center;"> 
                    <a style="color:blue;cursor:pointer;" onclick = 'create_chart_stock(<?php echo $response ?>)'>Price</a>
                    &nbsp;
                    <a style="color:blue;cursor:pointer" onclick="createChart1('SMA','<?php echo $company;  ?>')">SMA</a>
                    &nbsp;  
                    <a style="color:blue; cursor:pointer" onclick="createChart1('EMA','<?php echo $company;  ?>')">EMA</a>
                    &nbsp;
                    <a style="color:blue; cursor:pointer" onclick="createChart2('STOCH','<?php echo $company;  ?>')">STOCH</a> 
                    &nbsp;
                    <a style="color:blue; cursor:pointer" onclick="createChart1('RSI','<?php echo $company;  ?>')">RSI</a>
                    &nbsp;
                    <a style="color:blue; cursor:pointer" onclick="createChart1('ADX','<?php echo $company;  ?>')">ADX</a>
                    &nbsp;
                    <a style="color:blue; cursor:pointer"  onclick="createChart1('CCI','<?php echo $company;  ?>')">CCI</a>
                    &nbsp;
                    <a style="color:blue; cursor:pointer"  onclick="createChart3('BBANDS','<?php echo $company;  ?>')">BBANDS</a>
                    &nbsp;
                    <a style="color:blue; cursor:pointer"  onclick="createChart3('MACD','<?php echo $company;  ?>')">MACD</a>
                </td>
            </tr>   
        </table>
        <br>
        <div id="chart" style="margin:0 auto;width:80%"></div>
        <div id="clickheretext" style="text-align: center;color:#ddd">Click here to show stock news</div>
        <div id="wrapperImage" style="text-align:center;">
            <img   style="height: 35px; width: 58px;"id="toggler" src="http://cs-server.usc.edu:45678/hw/hw6/images/Gray_Arrow_Down.png " onclick="changeImage()">
        </div>

        <?php  echo "<script>create_chart_stock($response)</script>"; ?>
        <div id ="table" style="display:none;">
            <?php  $link_to_news="https://seekingalpha.com/api/sa/combined/".$company.".xml"; 
                     $arrContextOptions=array(
                "ssl"=>array(
                "verify_peer"=>false,
                "verify_peer_name"=>false,
                ),
                );
                $xmlreturned=  @file_get_contents( $link_to_news, false, stream_context_create($arrContextOptions));
                if(!$xmlreturned){  
                 ?> <b>NO RECORDS FOUND</b><?php 
                }
                else{
                    $xml=simplexml_load_string($xmlreturned) or die("Error: Cannot create object");
                    $feed_json=json_encode($xml);} 
                    echo "<script>feed_generator($feed_json)</script>";
                }
                else
                {
                    echo "<table style='border-collapse: collapse; margin:auto;width:80%;margin-top:5px;height:40%' id='error_table' border='1'><tr><td style='background-color: rgb(243, 243, 243);'>Error</td><td style='background-color: rgb(251, 251, 251);'>Error: No record has been found, Please enter a valid symbol</td></tr></table>";

                }

            ?></div><?php
            }
        } 

        ?>
        <noscript/>
    </html>
