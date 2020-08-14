
const csvFilePath='Test.csv'

var plotly = require('plotly')("shreyp941", "EVB3wx9ilEippMEXHPne")
var fs = require('fs');
//const { values } = require('d3-collection');
dataset= [0,0,0,0,0,0,0,0]
var arr;
csv()
.fromFile(csvFilePath)
.then((jsonObj)=>{
    var keys = [];
    var table = jsonObj.slice(1,jsonObj.length)
    var testObj = jsonObj[0]
    
    values = []
    
    var x
    for (x in testObj){
        
        keys.push(testObj[x])
    }
    keys = keys.slice(0,keys.length-1)
    
    for (x in testObj){
        values.push(x)
    }
    values = values.slice(0,values.length-1)
    //console.log(table)
    var y
    var qnum = 0
    
    
    for (x in table){
        var qnum = 0
        //console.log(table[x])
        
        for (y in table[x]){
            delete table[x].Names
            //console.log(table[x][qnum+1])
            if (table[x][qnum+1] != keys[qnum]){
                dataset[qnum] += 1;
            }
            qnum +=1
        }
    }
    
    console.log(dataset)
    var newValues = values.map(Number)
    console.log(newValues)
   
    
    var trace1 = {
      x: newValues,
      y: dataset,
      name: "Questions Missed",
      type: "bar"
    };
    
    var layout = {
        title: "Questions Missed on Recent Exam",
        xaxis: {
          title: "Question Number",
          titlefont: {
            family: "Courier New, monospace",
            size: 10,
            color: "#7f7f7f"
          }
        },
        yaxis: {
          title: "Amount of Students who Missed the Question",
          titlefont: {
            family: "Courier New, monospace",
            size: 10,
            color: "#7f7f7f"
          }
        }
      };
    
    var figure = { 'data': [trace1], layout:layout };
    
    var imgOpts = {
        format: 'png',
        width: 1000,
        height: 500
    };
    
    plotly.getImage(figure, imgOpts, function (error, imageStream) {
        if (error) return console.log (error);
    
        var fileStream = fs.createWriteStream('temp_graph.png');
        imageStream.pipe(fileStream);
    });
    
    
})
 
