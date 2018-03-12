var width = 800;
var height = 800;
var padding = {
  top: 140,
  bottom: 40,
  left: 60,
  right: 60
};

// For later use
var colors = {
  PHI: {
    fill: "#f79e4f",
    stroke: "#ed7f1e"
  },
  OTT: {
    fill: "#564f4f",
    stroke: "#3d3d3d"
  }
};
// Create an svg element and add it to our container element
var svg = d3.select(".container").append("svg")
  .attr("width", width)
  .attr("height", height);

// We are initializing a scale that will map data coordinates to our screen coordinates
var xScale = d3.scaleLinear().range([padding.left, width-padding.right]);
// In SVG coordinates (0,0) is the top left. We would like to flip the y scale so *low* numbers map to lower on the screen
var yScale = d3.scaleLinear().range([padding.top, height-padding.bottom]);
// Let's make a radius scale, and have the size of our circles be proportional to a player's TOI
// NOTE: since we want TOI to be proportional to area, that must mean it is a square root relationship with radius
// Area = PI*r^2
var rScale = d3.scaleSqrt().range([5, 10]);

function preProcess (player) {
  // console.log(player);
  ["CF", "CA", "CF%", "CF%_Rel"].forEach(function(key) {
    player[key] = parseInt(player[key]);
  })
  return player;
}
// Now, we load in the data asynchronously, and once it is loaded, the function below is called with the data store in our parameter.
d3.csv("./data/data.csv", preProcess, function (data) {
  // d3.max takes in a function that determines which attribute it will be taking a max of.
  // In our case, we want it to find the max Corsi-For
  var maxCF = d3.max(data, function (player) {
    return player["CF"];
  });
  // We do the same with our min, except calling with d3.min(...)
  var minCF = d3.min(data, function (player) {
    return player["CF"];
  });
  
  var minCA = d3.min(data, function (player) {
    return player["CA"];
  });
  
  var maxCA = d3.max(data, function (player) {
    return player["CA"];
  });
  // Another, more elegant way to find the min and max in just one call is using d3.extent, which returns an array: [min_value, max_value]

  // The rScale is a bit more difficult, since the format is "mm:ss", we need to do some extra work.
  // We create a function that, given a toi string, returns the equivalent number of seconds
  var minMaxRadius = d3.extent(data, function (player) {
    return timeInSeconds(player["TOI"]);
  });
  
  // Since we want graph to be symmetric
  var minVal = Math.min(minCF, minCA) - 1;
  var maxVal = Math.max(maxCF, maxCA) + 1;
  // Now, let's update our scales to take in the appropraite domains...
  xScale.domain([minVal, maxVal]);
  yScale.domain([minVal, maxVal]);
  rScale.domain(minMaxRadius);
  
  renderLines(minVal, maxVal);
  // Let's append some circles! We can do this in two ways: iterative or functional. We will abstract them into separate functions
  renderCircles2(data);
  renderText(data);
  renderAxes();
  
  svg.append("text")
    .attr("class", "title")
    .attr("font-size", "2em")
    .attr("x", width/2)
    .attr("y", 0)
    .attr("dy", "2em")
    .attr("text-anchor", "middle")
    .text("OTT vs PHI - 2/24/2018");

});

// toi in form <string> mm:ss
function timeInSeconds(toi) {
  // we utilize built-in javascript string methods to parse.
  var parsed = toi.split(":");
  // parsed is an array of strings with elements [minutes, seconds]
  var minutesInt = parseInt(parsed[0]);
  var secondsInt = parseInt(parsed[1]);
  return minutesInt*60 + secondsInt;
}

// It is generally not good practice to use global variables (svg, scales), and rather to pass them in as needed. For this practice, we don't mind.
function renderCircles1(data) {
  // We go through every line in the data (equivalent to a player at a time) and append a circle to the svg
  data.forEach( function (player) {
    svg.append("circle")
      .attr("id", player.Player.split(" ").join("_")) // This will get create an _ sepearted name. No spaces in class names!
      .attr("cx", xScale(player["CF"])) // x coordinated will be the scaled corsi-for
      .attr("cy", yScale(player["CA"]))
      .attr("r", rScale(timeInSeconds(player["TOI"])))
      .attr("fill", colors[player.Team].fill)
      .attr("stroke", colors[player.Team].stroke)
      .attr("opacity", 0.6)
      .attr("stroke-width", 1);
  });
}

// 'Functional' data-join-enter-exit approach
function renderCircles2(data) {
  // bind the data 
  var circles = svg.selectAll("circle")
    .data(data);
  
  circles.exit().remove(); // in the case where this function is called twice, remove previous circles 
  
  circles.enter().append("circle") // appends a circle for every row in data
    .attr("opacity", 0.6) // attributes not associated with data
    .attr("stroke-width", 1)
    .attr("id", function(d) {return d.Player.split(" ").join("_")})
    .attr("cx", function(d) {return xScale(d["CF"])})
    .attr("cy", function(d) {return yScale(d["CA"])})
    .attr("r", function(d) {return rScale(timeInSeconds(d["TOI"]))})
    .attr("stroke", (d) => colors[d.Team].stroke)
    .attr("fill", (d) => colors[d.Team].fill);  
}

function renderText(data) {
  var nameLabels = svg.selectAll("text.player")
    .data(data)
  
  // we will use es6 function syntax to keep it short!
  // nameLabels.enter().append("text")
  //   .attr("class", "player")
  //   .attr("opacity", 0.75)
  //   .attr("text-anchor", "middle")
  //   .attr("alignment-baseline", "hanging")
  //   .attr("font-size", "0.75em")
  //   .attr("x", (d) => xScale(d["CF"]))
  //   .attr("y", (d) => yScale(d["CA"]))
  //   .text(d => d["Player"])
  //   .attr("dy", function(d){
  //     // There's overlap. While we can automate this, it is not trivial, so we will manually change
  //     // To fix, let's find all players that we want to separate. For each pair, we will put the text above rather than below.
  //     return rScale(timeInSeconds(d["TOI"])) + 1);
  //   } 
  
  // will use a javascript "hashset" for constant look-up time
  
  var flippedPlayers = {
    "Dale Weise":1,
    "Oskar Lindblom":1,
    "Mark Borowiecki":1,
    "Andrew MacDonald":1,
    "Mark Stone": 1
  };
  
  nameLabels.enter().append("text")
    .attr("class", "player")
    .attr("opacity", 0.75)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", (d) => (flippedPlayers[d.Player]) ? "baseline" : "hanging")
    .attr("font-size", "0.75em")
    .attr("x", (d) => xScale(d["CF"]))
    .attr("y", (d) => yScale(d["CA"]))
    .text(d => d["Player"])
    .attr("dy", function(d){
      var scalar = 1;
      if (flippedPlayers[d.Player]) {
        scalar = -1;
      }
      return scalar * (rScale(timeInSeconds(d["TOI"])) + 1)
    });

}

function renderAxes() {
  var axisY = d3.axisLeft(yScale);
  var axisX = d3.axisTop(xScale);
  
  svg.append("g")
    .attr("transform", "translate(" + padding.left + ",0)")
    .call(axisY);
  
  svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", padding.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "-2em")
        .style("text-anchor", "middle")
        .text("Corsi Against (Unadjusted)");    
  
  svg.append("g")
    .attr("transform", "translate(0," + padding.top + ")")
    .call(axisX);
    
  svg.append("text")
        .attr("y", padding.top)
        .attr("x", width/2)
        .attr("dy", "-2em")
        .style("text-anchor", "middle")
        .text("Corsi For (Unadjusted)");    
}

function renderLines(min, max) {
  // Used math for this. 
  // Let p be CF%/100. Can solve and get CF = p*CA/(1-p), or CA = CF*(1-p)/p
  var midWayLine = {x1: min, y1: min, x2: max, y2: max, text: "50%"};
  var sixtyPercent = {x1: 3*min/2, y1: min, x2: max, y2: max*2/3, text: "60%"};
  var fourtyPercent = {x1: min, y1: 3/2*min, x2: max*2/3, y2: max, text: "40%"};
  var seventyPercent = {x1: 7/3*min, y1: min, x2: max, y2: max*3/7, text: "70%"};
  var thirtyPercent = {x1: min, y1: 7/3*min, x2: 3/7*max, y2: max, text: "30%"};


  var lines = [midWayLine, sixtyPercent, fourtyPercent, seventyPercent, thirtyPercent];
  
  var lineGroup = svg.append("g")
    .attr("class", "line-group");
  
  lines.forEach(function (coords) {
    lineGroup.append("line")
      .attr("stroke", "#777")
      .attr("stroke-width", "1")
      .attr("opacity", 0.3)
      .attr("x1", xScale(coords.x1))
      .attr("y1", yScale(coords.y1))
      .attr("x2", xScale(coords.x2))
      .attr("y2", xScale(coords.y2));
      
    lineGroup.append("text")
      .text(coords.text)
      .attr("x", xScale(coords.x2))
      .attr("y", yScale(coords.y2))
      .attr("alignment-baseline", "top")
      .attr("text-anchor", "middle")
      .attr("font-size", "12")
      .attr("opacity", 0.75);
  });
}