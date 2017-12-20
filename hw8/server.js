var express=require('express');
var request = require('request');
var parseString = require('xml2js').parseString;
var app = express();
app.set('port',process.env.PORT||8081);


// Function to get the Price JSON
app.get('/price/:symbol',function(req,res)
        {

    var url= "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=full&symbol="+req.params.symbol+"&apikey=S2HX8THWDAM34YUP";
    request.get(url,function(err,response,body){
        if(err){} //TODO: handle err
        if(response.statusCode === 200 ) //etc
        {//TODO Do something with response
            var timestamp;
            console.log("Printing price for "+req.params.symbol)
            res.header("Access-Control-Allow-Origin","*");
            res.header("Access-Control-Allow-Headers","X-Requested-With");

            json_data_stock = JSON.parse(body);
            //    console.log(json_data_stock);
            console.log("JSON returned is : "+body);
            if (Object.keys(json_data_stock).length == 0)
                res.send();
            else
               { var time_series=json_data_stock["Time Series (Daily)"];
                timestamp =json_data_stock["Meta Data"]["3. Last Refreshed"];
                var dates=Object.keys(time_series);
                // console.log("Dates is : "+dates);
                // console.log("Dates of 0 is : "+dates[0]);
                //  console.log("Values of Dates of 0 is"+time_series[dates[0]]);


                var open= time_series[dates[0]]["1. open"];
                console.log("open"+open);
                var high= time_series[dates[0]]["2. high"];
                console.log("high"+high);
                var low= time_series[dates[0]]["3. low"];
                console.log("low"+low);
                var close=time_series[dates[0]]["4. close"];
                console.log("close"+close);
                var volume=time_series[dates[0]]["5. volume"];
                console.log("volume"+volume);
                var prev_close=time_series[dates[1]]["4. close"];
                console.log("prev_close"+prev_close);
                var outer_array_volume=[];
                var outer_array_price=[];

                var lastdate;
                var max_volume=0;
                var outer_array_historical=[];
                lastdate=dates[0];
                var date=[];
                for(var i=0;i<dates.length;i++)
                {

                    var inner_array_volume=[];
                    var inner_array_price=[];
                    var inner_array_price_historical=[];
                   if(i<132)
                   {
                    inner_array_volume.push(parseFloat(time_series[dates[i]]["5. volume"]));
                    inner_array_price.push(parseFloat(time_series[dates[i]]["4. close"]));
                     date.push(Date.parse(dates[i]));
                    if(parseFloat(time_series[dates[i]]["5. volume"])>max_volume)
                        max_volume=parseFloat(time_series[dates[i]]["5. volume"]);
                   
                    
                    outer_array_volume.push(inner_array_volume);
                    outer_array_price.push(inner_array_price);
                   }
                    inner_array_price_historical.push(Date.parse(dates[i]));
                    inner_array_price_historical.push(parseFloat(time_series[dates[i]]["4. close"]));
                    outer_array_historical.push(inner_array_price_historical);
                    //console.log("Outer array is :");
                    // console.log(outer_array);
                }
                outer_array_historical.reverse();
                // console.log(outer_array_volume);
                var objOfData={symbol:req.params.symbol,max:max_volume,priceArray:outer_array_price,volumeArray:outer_array_volume,dateArray:date,open:open,high:high,low:low,close:close,volume:volume,prev_close:prev_close,timestamp:timestamp,stockArray:outer_array_historical};
                res.send(objOfData);
                }
        }
    });
});
// Function to get the indicators
app.get('/indicators/:symbol/indicator/:indicator',function(req,res)
        {
    var url="https://www.alphavantage.co/query?function="+req.params.indicator+"&symbol="+req.params.symbol+"&outputsize=full&interval=daily&time_period=10&series_type=close&apikey=S2HX8THWDAM34YUP";
    var indicator_r = req.params.indicator.toUpperCase();
    request.get(url,function(err,response,body){
        if(err){} //TODO: handle err
        if(response.statusCode === 200 ) //etc
            //TODO Do something with response
        {
            res.header("Access-Control-Allow-Origin","*");
            res.header("Access-Control-Allow-Headers","X-Requested-With");
            console.log("Respons received is : "+body);
            
            json=JSON.parse(body);
            if (Object.keys(json).length == 0)
            {   console.log("Blank received");
                res.send("");
            }
            else
            {
            if(indicator_r.match("SMA|EMA|RSI|ADX|CCI"))
                res.send(parser1(indicator_r,req.params.symbol,json));
            else if(indicator_r.match("STOCH"))
                res.send(parser2(indicator_r,req.params.symbol,json));
            else if(indicator_r.match("MACD|BBANDS"))
                res.send(parser3(indicator_r,req.params.symbol,json));
            }
        }
    });
    console.log("Express is in indicators");
});

app.get('/refresh/:symbol',function(req,res)
        {

    var url= "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=compact&symbol="+req.params.symbol+"&apikey=S2HX8THWDAM34YUP";
    request.get(url,function(err,response,body){
        if(err){} //TODO: handle err
        if(response.statusCode === 200 ) //etc
        {//TODO Do something with response

            console.log("Printing price for "+req.params.symbol)
            res.header("Access-Control-Allow-Origin","*");
            res.header("Access-Control-Allow-Headers","X-Requested-With");
            json_data_stock = JSON.parse(body);
            console.log(json_data_stock);
                var time_series=json_data_stock["Time Series (Daily)"];
                // Need to Handle errors here
                 var dates=Object.keys(time_series);
                var time_series=json_data_stock["Time Series (Daily)"];
                var close=time_series[dates[0]]["4. close"];
                var volume=time_series[dates[0]]["5. volume"];
                var close=time_series[dates[0]]["4. close"];
                var volume=time_series[dates[0]]["5. volume"];
                var prev_close=time_series[dates[1]]["4. close"];
                var objOfData ={symbol:req.params.symbol,price:close,prev_price:prev_close,volume:volume};
                res.send(objOfData);
               
            
        }
    });
});

// Hadling Charts with 1 parameter
function parser1(indicator_r,symbol,json)
{
    console.log("inside parser1");
    objects = json[ "Technical Analysis: "+indicator_r];

    console.log("Objects is "+objects);
    console.log("indicators_r is :"+indicator_r);
   // indicator= json["Meta Data"]["2: Indicator"];
   // console.log("indicators  is "+indicator);
    //console.log(json);
    dates = Object.keys(objects);
    outer_array=[];
    date=[];
    var keys=[];
    outermost_array=[];
    outermost_array.push(symbol);
    outermost_array.push(indicator_r);
    outermost_array.push(json["Meta Data"]["2: Indicator"]);
    for(var i=0;i<132;i++)
    {
        var inner_array=[];
        innerObjects =objects[dates[i]];
        innerKeys = Object.keys(innerObjects);
        console.log("printing inner objetsandinnerkeys"+innerObjects[innerKeys]);
        inner_array.push(parseFloat(innerObjects[innerKeys]));
        outer_array.push(inner_array);
        console.log("Dates of i is : "+dates[i]);
        date.push(Date.parse(dates[i]));
        console.log(objects[dates[i]]);
    }
    keys.push(innerKeys);
    outermost_array.push(date);
    outermost_array.push(outer_array);
    outermost_array.push(innerKeys);
    
    console.log("Outer_array is"+outermost_array); 
    // Indicator, dates, data
    return outermost_array;
}

//Handling Charts with 2 Parameters
function parser2(indicator_r,symbol,json)
{
    console.log("inside parser2");
    objects = json[ "Technical Analysis: "+indicator_r];
    console.log("Objects is "+objects);
    console.log("indicators_r is :"+indicator_r);
    //indicator= json["Meta Data"]["2: Indicator"];
    //console.log("indicators  is "+indicator);
    //console.log(json);
    dates = Object.keys(objects);
    outer_array1=[];
    outer_array2=[];
    var key1;
    var key2;
    var keys=[];
    date=[];
    outermost_array=[];
    outermost_array.push(symbol);
    outermost_array.push(indicator_r);
    outermost_array.push(json["Meta Data"]["2: Indicator"]);
    for(var i=0;i<132;i++)
    {
        var  InnerArrayOfKey1=[];
        var  InnerArrayOfKey2=[];
        innerObjects =objects[dates[i]];
        innerKeys = Object.keys(innerObjects);
        console.log("printing inner objetsandinnerkeys"+innerObjects[innerKeys[1]]);
        key1=innerKeys[0];
        key2=innerKeys[1];
        InnerArrayOfKey1.push(parseFloat(innerObjects[innerKeys[0]]));
        InnerArrayOfKey2.push(parseFloat(innerObjects[innerKeys[1]]));
        outer_array1.push(InnerArrayOfKey1);
        outer_array2.push(InnerArrayOfKey2);
        date.push(Date.parse(dates[i]));
        console.log(objects[dates[i]]);
    }
    keys.push(key1);
    keys.push(key2);
    outermost_array.push(date);
    outermost_array.push(outer_array1);
    outermost_array.push(outer_array2);
    outermost_array.push(keys);
    console.log("Outer_array is"+outermost_array); 
    // Indicator, dates, data
    return outermost_array;
}

//Handling Charts with 3 Parameters
function parser3(indicator_r,symbol,json)
{
    console.log("inside parser3");

    objects = json[ "Technical Analysis: "+indicator_r];
    //console.log("Objects is "+objects);
    console.log("indicators_r is :"+indicator_r);
    //indicator= json["Meta Data"]["2: Indicator"];
    //console.log("indicators  is "+indicator);
    //console.log(json);
    dates = Object.keys(objects);
    outer_array1=[];
    outer_array2=[];
    outer_array3=[];
    var key1;
    var key2;
    var key3;
    var keys=[];
    date=[];
    outermost_array=[];
    outermost_array.push(symbol); // 0
    outermost_array.push(indicator_r); // 1
    outermost_array.push(json["Meta Data"]["2: Indicator"]);
    for(var i=0;i<132;i++)
    {
        var  InnerArrayOfKey1=[];
        var  InnerArrayOfKey2=[];
        var  InnerArrayOfKey3=[];
        innerObjects =objects[dates[i]];
        innerKeys = Object.keys(innerObjects);
        console.log("printing inner keys"+innerKeys);
        key1=innerKeys[0];
        console.log("key1 is : "+key1);
        key2=innerKeys[1];
        console.log("key2 is : "+key2);
        key3=innerKeys[2];
        console.log("key3 is : "+key3);
        InnerArrayOfKey1.push(parseFloat(innerObjects[innerKeys[0]]));
        InnerArrayOfKey2.push(parseFloat(innerObjects[innerKeys[1]]));
        InnerArrayOfKey3.push(parseFloat(innerObjects[innerKeys[2]]));
        outer_array1.push(InnerArrayOfKey1);
        outer_array2.push(InnerArrayOfKey2);
        outer_array3.push(InnerArrayOfKey3);
        date.push(Date.parse(dates[i]));
        console.log(objects[dates[i]]);
    }
    keys.push(key1);
    keys.push(key2);
    keys.push(key3);
    outermost_array.push(date);
    outermost_array.push(outer_array1);
    outermost_array.push(outer_array2);
    outermost_array.push(outer_array3);
    outermost_array.push(keys);
    console.log("Outer_array is"+outermost_array); 
    // Indicator, dates, data
    return outermost_array;
}

// Function to get the news
app.get('/news/:symbol',function(req,res)
        {
    var json="";
    var url="https://seekingalpha.com/api/sa/combined/"+req.params.symbol+".xml";
    request.get(url,function(err,response,body){
        if(err){
            response.send();
        } //TODO: handle err
        if(response.statusCode === 200 )
        {   //etc
            //TODO Do something with response
            res.header("Access-Control-Allow-Origin","*");
            res.header("Access-Control-Allow-Headers","X-Requested-With");
            parseString(body, function (err, result) {

                jsonObj =result;

            });
            console.log(jsonObj);
            items=jsonObj["rss"]["channel"][0]["item"];
            console.log("items is : "+items);
            var substring="seekingalpha.com/article";
            
            var newsList=[];
            var counter=0;
            for(i=0;i<items.length;i++)
            {
                newsObject={};
                if(counter==5)
                    break;
                item=items[i];   
                if(item["link"][0].indexOf(substring) !== -1)
                {
                    console.log(item["title"]+item["link"]+"&nbsp;&nbsp;&nbsp;&nbsp;Publicated Time: "+item["pubDate"]+" details");
                    newsObject['author_name']=item["sa:author_name"][0];
                    newsObject['title']=item["title"][0];
                    newsObject['link']=item["link"][0];
                    newsObject['pubDate']=item["pubDate"][0].substr(0,25);
                    newsList.push(newsObject);
                    counter++;
                }
            }

            res.send(newsList);
        }
    });
    console.log("Express is in news");
    });

//Autocomplete
app.get('/autocomplete/:symbol',function(req,res)
        {
    var url="http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input="+req.params.symbol;
    console.log("URL IS : "+url);
    request.get(url,function(err,response,body){
        if(err){} //TODO: handle err
        if(response.statusCode === 200 )
        {  
            res.header("Access-Control-Allow-Origin","*");
            res.header("Access-Control-Allow-Headers","X-Requested-With");
            json=JSON.parse(body);
            console.log(body);

            res.send(json);
        }
    });
});

//Port
app.listen(app.get('port'),function()
           {
    console.log("APP STARTED");
});