var system = require('system'); // for argv[1]
var fs = require('fs'); // for write file
var page = require('webpage').create(); 
var url = system.args[1]; // sample url: https://www.onefootball.com/en/match/real-madrid-vs-atletico-madrid-statistics-5-479485?period=FullTim
//console.log("url:" + url);

/* 
 * modified src from network monitor(sniffer) doc below
 * http://phantomjs.org/network-monitoring.html 
 */
page.onResourceRequested = function (requestData, networkRequest) {
    //console.log('Request ' + JSON.stringify(requestData.url, undefined, 4));
    var match = requestData.url.match(/.*feedmonster.onefootball.com.*/g); // search for the match statistics json file
    if (match != null) {
        //console.log('Request (#' + requestData.id + '): ' + JSON.stringify(requestData, undefined, 4));
        console.log(match); // show the json url
        var matchStats = require('webpage').create(); // new a webpage for open the json url
        matchStats.open(match, function (status) {
            if (status !== 'success') {
                console.log('Unable to load the address!');
                phantom.exit();
            }
            var jsonSrc = matchStats.plainText;  // get the plaintext of that json file, otherwise it contains the <html> tags
            var resultObject = JSON.parse(jsonSrc); // parse the json contect to object
            //console.log(JSON.stringify(resultObject, undefined, 4));
            var path = 'output.json'; // set file name that will be saved as
            fs.write(path, JSON.stringify(resultObject, undefined, 4), 'w'); // save the json file
            phantom.exit();
        });
    }    
}
//page.onResourceReceived = function (requestData) {
    //console.log('Receive ' + JSON.stringify(requestData.url, undefined, 4));
//};

page.open(url, function (status) {
    if (status !== 'success') {
        console.log('Unable to load the address!');
        phantom.exit();
    } else {
        window.setTimeout(function (){            
            //console.log(page.content);
            phantom.exit();             
        }, 10000); // 10 seconds maximum timeout
    }
});
