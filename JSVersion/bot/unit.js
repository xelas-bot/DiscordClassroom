user = "Justin"
var name;
var plotly = require('plotly')("shreyp941", "EVB3wx9ilEippMEXHPne")
var fs = require('fs');


const csvFilePath = 'unit progress.csv'
const csv = require('csvtojson')
csv()
  .fromFile(csvFilePath)
  .then((jsonObj) => {
    console.log(jsonObj);

    bulk = jsonObj
    Studentnames = []
    units = []
    dataset = []
    tempObj = {}


    for (x in bulk) {
      Studentnames.push(bulk[x]["field1"])
    }
    console.log(Studentnames)

    for (x in bulk[0]) {
      units.push(x)
    }
    units = units.slice(1, units.length)
    console.log(units)





    for (x in bulk) {
      if (bulk[x]["field1"] == user) {
        name = bulk[x]['field1']
        for (y in bulk[x]) {
          dataset.push(bulk[x][y])
        }
      }
    }
    dataset = dataset.slice(1, dataset.length)
    dataset = dataset.map(Number)
    console.log(dataset)


    var trace1 = {
      x: units,
      y: dataset,
      type: "line"
    };
    var layout = {
      title: "Score Progress for " + name,
      xaxis: {
        title: "Unit Number",
        titlefont: {
          family: "Courier New, monospace",
          size: 10,
          color: "#7f7f7f"
        }
      },
      yaxis: {
        title: "Unit Test Score",
        titlefont: {
          family: "Courier New, monospace",
          size: 10,
          color: "#7f7f7f"
        }
      }
    };

    var figure = { 'data': [trace1], layout: layout };

    var imgOpts = {
      format: 'png',
      width: 1000,
      height: 500
    };

    plotly.getImage(figure, imgOpts, function (error, imageStream) {
      if (error) return console.log(error);

      var fileStream = fs.createWriteStream('temp_graph.png');
      imageStream.pipe(fileStream);
    });

























  })

// Async / await usage
const jsonArray = csv().fromFile(csvFilePath);