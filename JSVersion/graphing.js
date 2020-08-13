var plotly = require('plotly')("shreyp941", "EVB3wx9ilEippMEXHPne")
var fs = require('fs');

var trace1 = {
  x: [1, 2, 3, 4],
  y: [10, 15, 13, 17],
  type: "bar"
};

var figure = { 'data': [trace1] };

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
