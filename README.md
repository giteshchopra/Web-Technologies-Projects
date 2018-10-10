# Web-Technologies-Projects

This repository has my 2 major projects that I made during my CSCI 571 class.

Both are stock market applications that show stock market prices and trends of company stocks.
One is done using PHP and the other is done using JQuery and NodeJs.


The stock symbol application first has a webpage that allows users to search for stock informaRon using the Alpha Vantage API and display the results on the same page below the form.

A user will first open a page as  where he/she can enter the stock Rcker symbol, and select from a list of matching stock symbols using “autocomplete.” A quote on a matched stock symbol can be performed.
![GitHub Logo](/images/search_bar.png)

Once the user has entered some characters in the edit box and selected a matching result from the autocomplete list, he would click on Get Quote, at which point validation checks that the entered data is valid.
Once the validation is successful, the JQuer function ajax() is executed to start an asynchronous transaction with a Node.js script running on my ORACLE cloud, and passing the search form data as parameters of the transaction
![GitHub Logo](/images/autocomplete.png)


A form allows a user to enter a keyword (stock ticker symbol) to retrieve information (quote and indicators information from Alpha Vantage, and news from Alpha News feed). Based on the user input the text box displays a list of all the matching company’s ticker symbols . The autocomplete JSON data is retrieved from the Markit on Demand API. Example:
http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input=Apple

I'm validating the search-box, if it is empty.
![GitHub Logo](/images/autocomplete_blank.png)

I have created a favorites list as follows : 

Table Field | Description
------------ | -------------
Symbol  | Displays the Symbol of the Company. If symbol is clicked the table should switch to stock details section in sliding mechanism
Stock Price | Displays the current stock price of the data
Change (Change Percent) | Displays the change and the change percent of the current stock.E.g. 1.52 (1.50%)
Volume | The Volume of last day session
Trash Can | delete the corresponding row from the table as well as from local storage.

![GitHub Logo](/images/localdatstore.png)

Stock Details section has the following 3 tabs
* Current Stock
* Historical Charts
* News Feeds


![GitHub Logo](/images/price.png)

Table Fields | Description
------------ | -------------
Stock Ticker Symbol  | Symbol of the company
Last Price | Displays the current stock price of the data
Change (Change Percent) | The change and the change percent of the current stock. 
TimeStamp | The time corresponding to the last price. During trading hours, it should be the current date and time.
Open | The Open Price of last day session.

![GitHub Logo](/images/statistics table.png)


An image of the current daily stock/indicator chart of the stock of the company retrieved via Alpha Vantage API 

![GitHub Logo](/images/Price table view.png)


Historical charts with zoom levels: 1 week, 1 month, 3 months, 6 months, 1 year, YTD and All
![GitHub Logo](/images/highstocks.png)

Used Seeking Alpha News Feed API to fetch news of that company.
![GitHub Logo](/images/news.png)

If for any reason (non-exisRng stock Rcker symbols, API failure, etc.) an error occurs, an appropriate error message is displayed
![GitHub Logo](/images/errors.png)

Whenever data is being fetched, a dynamic progress bar is  displayed.
![GitHub Logo](/images/Loading Bars.png)



