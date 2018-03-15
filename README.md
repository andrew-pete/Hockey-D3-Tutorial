# Hockey Data Visualization with D3.js
#### Lesson 1/3
## Introduction
If you're the type of person who has wandered to a stranger's github page, it is likely you have occasionally stumbled upon beautiful data vizualizations all throughout the internet. It's possible you yourself have some experience making plots in R, Python, or Matlab. All of those languages have packages that make it extremely easy to visualize large amounts of data. These packages really are truly amazing, and often suffice for a _majority_ of projects. However, as you gained experience, perhaps you've realized how difficult it is to truly customize these visualizations. Perhaps you've even spent hours laboring to get integrate these plots with a website or app, only to settle for a low-quality screenshot of it. Maybe, in the back of your mind, you've wondered how the engineers at [The New York Times](https://www.nytimes.com/interactive/2017/12/21/us/2017-year-in-graphics.html) and [FiveThirtyEight](https://fivethirtyeight.com/features/the-ridiculousness-of-conference-tournament-locations-in-6-maps/) consistently make gorgeous visualizations that appear beyond the scope of ggplot or matplotlib. 

Far be it from me to come here and to tell you to divorce your dearest visualization library. I will tell that there exists another, however, that can satisfy your unquenched desires for beautiful, customized visualizations. Like a siren, one library has long been singing your name, waiting for you to turn towards its shores. Unlike the sirens, it will not lead you towards inevitable death, but expand your life into new horizons.

### Purpose

#### Is D3.js right for me?
Now, it is important to not get ahead of ourselves. D3 is not for the faint of heart. If your project is primarily research-oriented, and you are simply using visualizations as a supplement (testing or the like), perhaps D3 is not best for that project. It comes with no built-in plots. You are far better off going to your room and crying whilst listening to Sufjan Stevens than trying to build a 3D scatter plotto analyze your spectral clustering algorithm with D3 .

However, if you want a single _robust_ framework that can be used to build completely customizable geographic visualizations, scatter plots, networks, etc... AND be easily integrated with any website or app, D3 may be the way to go.

In my experience, D3 allows you to build an elegant and cohesive narrative through data visualization.

#### Is this Tutorial for me?
The following are recommended (but not required) to truly get the most from this tutorial:

- Some programming experience (Python, Java, JavaScript, or the like). Understanding variables, functions, and primitive types (including Arrays and Objects) is about what we're looking for.
- A *very baseline* understanding of HTML.
- Minimal understanding of hockey "advanced stats" terminology. For a great primer, see Charlie O'Connor's [article](https://t.co/nUgxqcrj9B) for *The Athletic*.

As I stated, all of the above are *recommended*, but *not required*. I fully believe any keen hockey fan can make it through the tutorial. However, to gain an understanding of what's actually going on, all of the above are helpful! There are other projects out that will be more helpful for complete beginners. Perhaps it'd be more beneficial to seek out these before embarking on this mission, but do be sure to return!


## Getting Started
Let's start by cloning this github repository, which has the base HTML code, data, and directory structure already prepared.

To do this, first create a new folder for the project on your computer. Then, depending on your preference, you can clone this repository via command-line tools or by just downloading it. Both are described below.

#### Without Terminal
If you want to avoid using the command line, just press the green "Clone or Download" button at the top of this page, download the ZIP, and paste the repository into your new folder.
#### With Terminal
1. Open Terminal
2. Navigate into your new directory
3. Execute the following:

```terminal
$ git clone https://github.com/andrew-pete/Hockey-D3-Tutorial.git
```
Open up the project in your favorite text editor. Don't have one? Try [Atom](https://atom.io/)!

Notice the directory structure. The file that's rendered is `index.html`, which sits in the root directory. Also within our root directory there exists `data/` and `js/`. While one does not need to separate, it is a healthy practice to decouple JavaScript files, CSS, HTML, and your data. Notice that our game file `data/game.csv` is a comma-separated-values file. If you wish, open it up in Excel for a formatted view.

Finally, we need to deploy a local server. There are many ways to do this. This is necessary in order to load in external resources, like d3 and our data file. To do this, execute the following command:

```
$ python -m SimpleHttpServer 8000
```
In your web browser, navigate to the page [localhost:8000](http://localhost:8000).

##### Having trouble setting up your local server?
You likely don't have Python installed. Visit [this page](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/set_up_a_local_testing_server) to troubleshoot.

### One last bit before we get started
Before moving on to coding, open the index.html file in your text editor. Notice how the file comes with several things already included. 

```html
<head>
	<link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,700" rel="stylesheet">
    <title>Hockey Viz with D3.js Tutorial - Part 1</title>
    <style media="screen">
      svg {
        font-family: 'Open Sans', sans-serif;
        background: #eee;
      }
      text {
        font-weight: 300;
        fill: #333;
      }
    </style>
</head>
```
In the header, there is a link to a google font (Open Sans), along with a little CSS for styling. The default font for HTML is Times New Roman. Please, I beg you, never use a serif font for visualizing data. Most serif fonts do not format numbers uniformly and are often eye sores in general. I've chosen Open Sans out of preference, but feel free to swap it out with [any other one](https://fonts.google.com) you choose.

Finally, at the bottom of the file, I've included the javascript file we will primarily be coding in along with the d3.js library.

```html
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/d3/4.13.0/d3.min.js"></script>
<script type="text/javascript" src="./js/main.js"></script>
```

As I said previously, it is possible to include all of your JS code in the index.html file. However, it is generally good practice to separate the two.

## Wooh, let's code!
### Hold your horses! What's the end goal?
For this tutorial, we'll be making a scatter plot showing each player's Corsi-for and Corsi-against over the full game. Below are the variable mappings we want to utilize:

- Corsi For (X Axis)
- Corsi Against (Y Axis)
- Team (Bubble Color)
- Time on Ice (Bubble Size?)
- Player Name (As sort of text annotation)

As someone who has *definitely not done* this exact visualization before, this is a good idea of what our end result will be:

![Scatter Final](./assets/final_scatter.png)

Keep these in mind as we begin to code.

**Okay, now we can seriously begin.**

### Pre-data Setup
Open up `js/main.js`. This is a completely empty file for now, but will soon include all of the logic needed to make a beautiful scatter plot.

First, let's defined some variables that we'll use universally. We don't want to have everything be global, so we will keep it limited.

```javascript
// GLOBAL VARIABLES
var width = 800;
var height = 800;
var padding = {
  top: 140,
  bottom: 40,
  left: 60,
  right: 60
};
```

These numbers aren't gospel, they are mostly set to allocate enough space for titles, axes, and whitespace. When selecting values, we realize we don't want the data to be over-concentrated. 

Later, we will add another variable to this section for team colors.

Next, we use d3 to create an svg element and append it to our `.container` div that already exists within index.html.

```javascript
// Create an svg element and add it to our container element
var svg = d3.select(".container").append("svg")
  .attr("width", width)
  .attr("height", height);
```

Notice that we are using the width and height variables we set above to set the svg's width and height attributes appropriately.

#### Scales - Part 1
A primary part of data visualization is scaling your data coordinates into screen coordinates. In mathematical terms, we need to create a mapping from our *data coordinate space* to the *screen space*. To set up scales in d3, we need to know the **range** (the interval of numbers to *map to*) and the **domain** (the interval of numbers to *map from*). The latter requires data, the former can be determined by the height, width, and padding variables we set earlier.

We initialize our scales as follows:

```javascript
var xScale = d3.scaleLinear().range([padding.left, width-padding.right]);

// In SVG coordinates (0,0) is the top left
var yScale = d3.scaleLinear().range([padding.top, height-padding.bottom]); 
```
`scaleLinear()` is a d3 function that initializes a linear scale. As stated above, we give it a range within our svg to map to. Since we want to have some space for axis labels on the left, and perhaps keys on the right, we set our xScale to be in the interval [\<left padding\>, \<svg width\> - \<right padding\>]. In our example, the range is [60, 740].

We also need a scale to determine the size of our bubbles. Now, contrary to Python, D3 uses a *radius* attribute for determining circle size. Recall from elementary math that area is proportional to the radius squared. In other words, a two times increase in radius will result in a four-times increase in area. **This is crucial to understand**, since we do not want to over-exaggerate the importance of our radius variable. For us, this is time-on-ice. To account for this, we use a *square root* scale.

```javascript
// Area = PI*r^2
var rScale = d3.scaleSqrt().range([5, 10]);
```
For now, we set the radius interval to be between 5 and 10.

We will return to our scales later, once we load in the data to set their domains properly.

### Loading in the Data

D3 comes with it a number of functions that take in various data storage formats (CSV, TSV, JSON), and gives it to the user in an extremely usable data array.

It helps to understand how this API works, so we can understand what the heck we are doing. We diverge a bit from Python and R here into the land of functional programming.

```javascript
d3.csv(<file location>, <preprocess function>, <callback function>, ...)
```

`file location` will be a string that represents the location of the data file we are loading. This is either relative to the root folder or an absolute location. For us, the value will be `'./data/game.csv'`.

The second argument is a preprocessing function. Since our dataset is a CSV, all numbers will be loaded in as strings. In order to do any mathematical operations, we need to cast them to numbers. That's the purpose of this argument. This expects to receive a function that is then executed *line by line*. 

This is a bit tricky. 

Imagine that our CSV is really just a list of players, and each player has certain attributes like "Corsi For", "Time on Ice", etc... So we want our function to take in a *player object* with those qualities. The function below is what we will use; it may take some time to conceptualize how it all works.

Below our defined variables, put:

```javascript
function preProcess (player) {
  // We create an array of the attributes we want to cast to numbers
  // We loop through each attribute, casting the value to an int
  ["CF", "CA", "CF%", "CF%_Rel"].forEach(function(key) {
    player[key] = parseInt(player[key]);
  });
  return player;
}
```

Note: the `forEach` method is similar to python's `for element in arr:`. It's different in that it takes in a function to perform on each element. Javascript allows us to pass in *anonymous functions* (a function that has no name). If that makes no sense to you, fret not. You'll get used to it. Carry on.

Now, let's actually call this d3.csv method. For future reference, most of our logic will be placed in here. However, we will often define helper functions outside of the inner scope. Below will show the bounds of the call, but expect to place logic within the brackets unless told otherwise.

```javascript
d3.csv("./data/data.csv", preProcess, function (data) {
	// OUR LOGIC WILL GO IN HERE UNLESS STATED OTHERWISE
});
```

In the end, our function will call the third function with all of the preprocessed data bundled into an array that we've conveniently named `data`.

Now that we have our data loaded in, let's finish off initializing our scales with appropriate domains.

**An Aside:** If, at any point, you want to see the state of a variable, simple add `console.log(<variable>);` to your code, refresh the page, and open the developer console (command + shift + i for mac).

#### Scales - Part 2
Okay, we now have everything we need to finish off those pesky scales. To do this, we will use a couple built-in d3 methods: `d3.max`, `d3.min`, and `d3.extent`.

Each of these has the same basic format, so we'll dive into an example with `d3.max`, knowing that it'll be identical for the others.

The API for `d3.max` is as follows:
```
var maxValue = d3.max(<data>, <func>)
```
Where `<func>` is a function that will determine what exactly we want to find the max of. In other words, this function will be executed for each element in the array, and whatever is returned by the function is what it will find the max of. If it helps to conceptualize it differently, imagine that the function creates a whole separate array with entries equal to the function executed on that element. With this new mapped array, it finds a maximum value and returns it.

Let's start with finding the min and max corsi-for values. In that case, we would find them like this:

```javascript
// we want the maximum value of the corsi-for attribute
var maxCF = d3.max(data, function (player) {
	return player["CF"];
});
// We do the same with our min, except calling with d3.min(...)
var minCF = d3.min(data, function (player) {
	return player["CF"];
});
```

We assign similar variables for our max and min corsi-against.

```javascript
var minCA = d3.min(data, function (player) {
	return player["CA"];
});
  
var maxCA = d3.max(data, function (player) {
	return player["CA"];
});
```

Now, let's take a step back and think about our (future) scatter plot. Even though the max  values for our CF and CA are not always equal, we would like our graph to be symmetric. In other words, our x and y axes should start and end at the same value. For this reason, we want both of our x and y scales to be mapped to the same domain.

The minimum value of the interval should be `min(minCF, minCA)` and the max value should be `max(maxCF, maxCA)`. In JavaScript, we put:

```javascript
// Since we want graph to be symmetric
var minVal = Math.min(minCF, minCA);
var maxVal = Math.max(maxCF, maxCA);
```

Let's add a bit of artificial "padding" to the scales above, so that circles don't overlap the axes. This is solely personal preference.

```javascript
// Since we want graph to be symmetric
var minVal = Math.min(minCF, minCA) - 1;
var maxVal = Math.max(maxCF, maxCA) + 1;
```

Now, our rScale is a bit more tricky. Looking at the data, we see that the times are given in the string form *mm:ss* (e.g. `'14:34'`). Unluckily for us, JavaScript cannot magically parse this and understand it as "14 minutes, 34 seconds". It also doesn't know how to compare to time strings like that. What it *does know* is how to compare two numbers (as we utilized earlier). We need to create a function to convert a TOI string to some number, either minutes or seconds. 

Let's define a function *outside of* our `d3.csv` scope (i.e. brackets):

```javascript
// toi in form <string> mm:ss
function timeInSeconds(toi) {
	// we utilize built-in javascript string methods to parse.
	var parsed = toi.split(":");
	// parsed is an array of strings with elements [minutes, seconds]
	var minutesInt = parseInt(parsed[0]);
	var secondsInt = parseInt(parsed[1]);
	return minutesInt*60 + secondsInt;
}
```
We utilize some JS-magic here to accomplish our task. First, we split our string into segments separated by a colon. For example, `"12:34".split(":")` returns `["12", "34"]`. We then cast each to a number and do some simple arithmetic to return the equivalent number of seconds.

Now we can finish off our `rScale`. Recall that third function I mentioned earlier? Don't scroll up, I'll remind you. It's `d3.extent`. This method is great, because it returns the min and max in one swoop. In a simple example `d3.extent([2,1,3])` will return `[1,3]`. Again, recall that d3 doesn't automatically know what we want to find the max and min of, so we tell it by passing in a function. 

We are now back into the scope of our d3.csv callback function.

```javascript
var minMaxRadius = d3.extent(data, function (player) {
	// want to find the min and max of this number value
	return timeInSeconds(player["TOI"]);
});
```
Easy! Let's toss those numbers into our scales and move on. 

```javascript 
xScale.domain([minVal, maxVal]);
yScale.domain([minVal, maxVal]);
// remember, minMaxRadius is already in form [min, max]
rScale.domain(minMaxRadius);
```

Sweet! You've finished initializing the scales. While nothing is physically on the page yet, we are more than halfway there.

### Rendering the Circles
When actually rendering our plot, we can do it two ways. The first loops through the data array and appends a circle with some (x,y) coordinate each time. The second way is a bit more elegant but utilizes a good amount of functional programming knowledge in its API that you may or may not be comfortable with at this time. Pick whichever suits you, but don't do both without commenting out the  other! Otherwise, you'll end up with duplicate circles.

#### Version 1 (Looping through the data)

Let's create a helper function outside of the callback that we will utilize within the callback. Call this function `renderCircles`. As stated above, the way in which we will create the team bubbles is by looping through the data array and instantiating an svg circle element for each row with the appropriate coordinates. This can be done using a simple `for` loop or the function `data.forEach`. We will utilize the latter for this tutorial, but as with everything it is up to your personal preference and has no performance advantages.

Recall that all of our scales are *set* to map from data (Corsi-for, Corsi-against) coordinates to svg coordinates. When we are setting circle attributes, we will utilize these scales.

Since we are forward thinking people, we quickly realize that we want to predefine some team colorss. Our data conveniently has a team name attribute, so we want to use that to determine the circle color. Let's go back to the top, to where we define our global variables, and add one more.

```javascript
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
```
Our colors variable stores a Javascript object. Those familiar with python dictionaries should be familiar with the format. At the top level, we have two keys, which are the team abbreviations dictated in the data file.

Each of these teams has a matching nested object that contains HEX color strings for both the stroke and fill of the circle. In English, the stroke is the border color and the fill is the background color of the circle. It's often good design practice to have the stroke and fill to be similar hues but different opacities. Feel free to use the [W3 Color Picker](https://www.w3schools.com/colors/colors_picker.asp) to check the colors we've stored above for each team.

Now, we have all we need to append the circles.

```javascript
function renderCircles(data) {
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
```

Okay, there's a lot going on here, so let's go line-by-line dissecting exactly what and why we perform each step above.

`svg.append("circle")` does exactly what it sounds like it does when read out in plain English. We are appending a circle element to our svg. However, the circle doesn't know how big it should be, where it needs to go, or what color it should be. We need to specify each attribute, which is exactly what we will do. Notice that we do not end the line with a semi-color (`;`). This is intentional, as we do not want to close out the evaluation too early.

`.attr("id", player.Player.split(" ").join("_"))` sets the unique id of the circle to be an under-bar separated string of the player's name. This can be utilized for future reference or interactivity. In general, it is good practice to add unique ids to your svg elements. Since our name attribute is stored under the "Player" column, we select that column. Id's cannot have spaces in them, so we must change the name to be instead separated by something else. I've chosen the `_` character. Notice that we split the string on space, separating the first and last names, then rejoin that array into a string but this time using `_` as a connector between the elements.

```javascript
.attr("cx", xScale(player["CF"]))
.attr("cy", yScale(player["CA"]))
```

Circles coordinates are set by the center, rather than by an edge like those pesky rectangles, so the attributes we target for the x,y position of the circle are `cx` and `cy`. Therefore, it makes sense that the next lines specify the circles position in such a manner, remembering to utilize our x and y scales appropriately.

Next, we set the radius of the circle using the TOI attribute. Recall that our scale is set to "seconds", so we need to again use our function `timeInSeconds` that we defined earlier like so: `.attr("r", rScale(timeInSeconds(player["TOI"])))`.

We utilize the `colors` variable we set earlier to determine the stroke and fill for our circle. Recall that the `Team` column stores either "PHI" or "OTT", so we can retrieve the appropriate color if we know that value. 

```javascript
.attr("fill", colors[player.Team].fill)
.attr("stroke", colors[player.Team].stroke)
.attr("opacity", 0.6)
.attr("stroke-width", 1);
```

Our last two lines are just cosmetic changes. When dealing with potentially overlapping data, one should always set opacity to something below 1. This is common practice for most visualizations you see on data journalism sites, so I like to stick to it.

Now that the helper function is complete, we need to call it from within our callback, after we've initialized our scales. 

Add the following call:

```javascript
renderCircles(data);
```

Keep scrolling for an example of what your plot should look like after completing this function.
#### Version 2 (d3 data-binding) 
This method leans more heavily on the D3 API. It likely will be a bit confusing, since it combines functional and object-oriented aspects. In essence, we are binding the data to a d3 selection, then we "enter" the selection, telling it how to relate the bound data to attributes of the selection. Don't worry about understanding that right now. Let's look at the code and revist those statements.

Again, we create a function called `renderCircles`. If you already did the previous method and want to give this one a try, just create a new function with a slightly altered name, like `renderCirclesAlt`.

Even if you skipped the last section, I encourage you to look at the line-by-line breakdown of the logistics. I will not repeat them to save space. 

```javascript
// 'Functional' data-join-enter-exit approach
function renderCircles(data) {
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
```
I've tried to comment the data in such a way to make it easily understandable, but I will again try to dissect this approach.

In the beginning, we select the "not-yet-existent" circles in our svg. With this selection, we bind our data using the `data(...)` method on the selection we've made.

`circles.exit().remove()` is added in case this function is called twice. It will remove all previously appended circles.

Next, we kindly let our selection know that we want to define some rules of engagement. Namely, we want to tell it how to make sense of the data we've bound to it. We do this by calling `circles.enter()`. Now that we've given it sufficient warning, we ask it to now perform the following actions for each row in the array.

1. Append a circle
2. Set its opacity and stroke-width, similar to before (cosmetic)
3. Give it a unique id (player name)
4. Update its position, using the x and y scales set earlier
5. Give it a radius, using the rScale we've set
6. Finally, update it's border and fill colors appropriately

Notice how we do this by defining a function for each attribute. The function input is expected to be equivalent to a row in the dataset. As said above, imagine this as a "Player" with certain attributes. Whatever is returned by the anonymous function is to what the respective attribute is set.

It likely will take some time for you to chew on and grapple with the syntax. Once you feel comfortable with this method, I promise you'll likely prefer it over the iterative method. Until then, feel free to choose whichever peaks your fancy.

#### Code and Data-Viz Check-up
At this point, you may be a tad overwhelmed. Below is approximately what your code should look like at this point in the tutorial:

```javascript
var width = 800;
var height = 800;
var padding = {
  top: 140,
  bottom: 40,
  left: 60,
  right: 60
};

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

var xScale = d3.scaleLinear().range([padding.left, width-padding.right]);
var yScale = d3.scaleLinear().range([padding.top, height-padding.bottom]);

// Area = PI*r^2
var rScale = d3.scaleSqrt().range([5, 10]);

function preProcess (player) {
  ["CF", "CA", "CF%", "CF%_Rel"].forEach(function(key) {
    player[key] = parseInt(player[key]);
  })
  return player;
}

d3.csv("./data/data.csv", preProcess, function (data) {
  // max corsi-for in dataset
  var maxCF = d3.max(data, function (player) {
    return player["CF"];
  });
  // min corsi-for
  var minCF = d3.min(data, function (player) {
    return player["CF"];
  });
  
  var minCA = d3.min(data, function (player) {
    return player["CA"];
  });
  
  var maxCA = d3.max(data, function (player) {
    return player["CA"];
  });
  
  // Since we want graph to be symmetric
  var minVal = Math.min(minCF, minCA) - 1;
  var maxVal = Math.max(maxCF, maxCA) + 1;
  
  var minMaxRadius = d3.extent(data, function (player) {
    return timeInSeconds(player["TOI"]);
  });
  
  xScale.domain([minVal, maxVal]);
  yScale.domain([minVal, maxVal]);
  rScale.domain(minMaxRadius);
  
  renderCircles(data);
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

function renderCircles(data) {
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
```
And if you tried the second version of rendering circles, you'll have an additional functions that looks like:

```javascript
// 'Functional' data-join-enter-exit approach
function renderCirclesAlt(data) {
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
    .attr("stroke", (d) => colors[d.Team].stroke) // Using ES6 functions for readability purposes. Also it's good to know :)
    .attr("fill", (d) => colors[d.Team].fill);  
}
```

If all went well, your page should now have a plot that looks like this:
![midpoint-plot](./assets/circles_plot.png)
We've left a good amount of space for axes and a title, so let's get to those finishing touches. You're so close!
### Rendering Axes
While the plot above looks nice, it closer resembles a piece of abstract art than a data visualization. Axes and labels give context to the numbers. 

Luckily for us, D3 can construct an axis with tick marks using the scales we created earlier.

Again, we'll create a helper function below our `renderCircles` one. Let's call it `renderAxes`. This function will render the x and y axes, along with providing a text label for each axis.

In essence, we will need to create an axis using D3 methods and a scale. This axis defaults to the very top of the svg (for the x-axis) or the very left (for the y-axis), so we will need to move it according to the padding we pre-defined in our global variables. Similarly, we append a text element with a similar translation. We use basic arithmetic to determine its position and utilize `text-align: middle` to center it horizontally.

You'll see that we use a "group" (`g`) that allows to apply a universal translation to all elements within the group. Since an axis is literally a collection of lines (axis, ticks) and text (numbers), the group element allows us to move all of that atomically.

Below is the code to get that job done:

```javascript
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
```

We'll have to actually call this function from within our callback, below our `renderCircles()` call. Just add a `renderAxes()` call, and they should appear on the screen next reload.

```javascript
var axisY = d3.axisLeft(yScale);
var axisX = d3.axisTop(xScale);
```
Here, we create our two axes via two built-in methods. These have not yet been appended to the svg, but live in the virtual space. In d3v4, we define which side of the axis we want our numbers via `axisTop, axisBottom, axisLeft, axisRight`. Since our axes will be on the top and left, it is natural to have the numbers appear above the axis and to the left of the axis, respectively. Feel free to substitute the converse to see the difference!

```javascript
svg.append("g")
	.attr("transform", "translate(" + padding.left + ",0)")
	.call(axisY);
```
Here, we actual create a group parent element, appending the y-axis via the `.call(axisY)`. Recall that this axis we default to hugging the left side of the svg. Since we have shifted all of our points by a factor of `padding.left`, we translate our y-axis to the right by `padding.left`.

```javascript
svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", padding.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "-2em")
    .style("text-anchor", "middle")
    .text("Corsi Against (Unadjusted)");    
```
Adding a y-axis label requires some quick maths. We rotate the text so that it is parallel to the axis, and set the "x" and "y" attributes on this flipped coordinate plan. `dy` is an attribute that is equivalent to "delta y", or "change in y." You could add this math to the "y" attribute, but I find it easier to read this way. Again, `"text-anchor":"middle"` simple centers the text horizontally, since the coordinate plane is rotated.

Similar logic is applied for the x-axis. You'll notice the main difference is that the translation used `padding.top` and the text has no rotation (yay!).

### Rendering A Title
Now that you have experience with appending text for axis labels, the title is an absolute breeze. You can abstract this into another function with the name of your choice, or just put it at the bottom of your `d3.csv` callback. I chose the latter. If you prefer the former, just remember to actually call the function you define! Our code is fairly simple, and again I just use some arithmetic to determine a good `y` coordinate for the title. It's often a game of guess-and-check, so don't fret about not getting it right away!

```javascript
// render title
svg.append("text")
	.attr("class", "title")
	.attr("font-size", "2em")
	.attr("x", width/2)
	.attr("y", 0)
	.attr("dy", "2em")
	.attr("text-anchor", "middle")
	.text("OTT vs PHI - 2/24/2018");
```

### Rendering Names

So far, our visualization looks pretty dang good. However, the specificity of information is limited. We see that some Flyers' players did really well, others did quite awful. There's no way for a viewer to tell apart players on the same team, so we'll add text labels.

In this section, we will again practice the `data-enter` method described in version 2 of `renderCircles`. Feel free to use a `for` or `forEach` loop to accomplish similar means.

On an abstract level, we will append text in an almost identical manner to how we created the circles. The `(x,y)` coordinates will be determined the same, although we'll add a little buffer so the text does not overlap the circle. Recall from above that the `dy` attribute is perfectly suited for this. However, if we always want our text to be uniformly distanced from the edge of the circle, we will need to use our circle radius to determine the `dy` value.

A naïve solution go as follows:

```javascript
function renderText(data) {
  var nameLabels = svg.selectAll("text.player")
    .data(data)
  
  nameLabels.enter().append("text")
    .attr("class", "player")
    .attr("x", (d) => xScale(d["CF"])) // using es6 function format
    .attr("y", (d) => yScale(d["CA"]))
    .style("opacity", 0.75)
    .style("text-anchor", "middle")
    .style("alignment-baseline", "hanging")
    .style("font-size", "0.75em")
    .text(d => d["Player"])
    .attr("dy", (d) => rScale(timeInSeconds(d["TOI"])) + 1)
  });
}
```

When you reload with this code, your observant mind should notice a problem right away: look at all that text overlap! We have a few cases where circles are directly on top of each other, or are so close that the names still collide significantly.

**How do we address this?**

Well, on a universal level, this problem is quite difficult. It involves checking for collisions using bounded boxes, etc. etc... That's messy. For an introduction, let's just address this on a case-by-case basis. Note that our solution for this game **will not** work for every game.

Since we have the data readily available, we can identify who the offending players are. For each pair of overlapping points, we just need to keep track of one of them. If we move *both*, we'll just have overlap at a different point. 

The solution we'll implement goes as follows:

- Identify colliding pairs
- Select one player, record his name in some data structure
- When appending our text elements, check if the player is in this pre-determined set.
- In the case where he is, we'll flip his name to the other side of the circle.

Below is a "hashmap" of player names that overlap with another. One could use an array to store names. Conceptually this makes sense, but the look-up time in an array is proportional to the length of the array, while the look-up time in a hashmap is constant. If you'd prefer to use an array, it'll likely have no performance difference since the set is small.

Add this to the top of the function body:

```javascript
var flippedPlayers = {
	"Dale Weise":1,
	"Oskar Lindblom":1,
	"Mark Borowiecki":1,
	"Andrew MacDonald":1,
	"Mark Stone": 1
};
```

Since JavaScript does not have a set primitive, we use an object with player names as keys and 1 as the value. To check if a player is in the set, we just would ask `if (flippedPlayers[playerName]) {...}`. If the name is not in the set, it will not fulfill the predicate.

Using this logic, let's flip some `dy` values. Edit your next bit of code to look like the following:

```javascript
nameLabels.enter().append("text")
    .attr("class", "player")
    .attr("x", (d) => xScale(d["CF"]))
    .attr("y", (d) => yScale(d["CA"]))
    .style("opacity", 0.75)
    .style("text-anchor", "middle")
    .style("alignment-baseline", (d) => (flippedPlayers[d.Player]) ? "baseline" : "hanging")
    .style("font-size", "0.75em")
    .text(d => d["Player"])
    .attr("dy", function(d){
      var scalar = 1;
      if (flippedPlayers[d.Player]) {
        scalar = -1;
      }
      return scalar * (rScale(timeInSeconds(d["TOI"])) + 1)
	 });
```

We altered two things. First, we changed the "alignment-baseline" (vertical alignment) so that it responds to whether a player is on the top or bottom.

The more notable change occurs in the function for determining `dy`. In essence, if the player is in the set of players to be flipped, we set the change in y to be the negated value of what it normally would be.

With these changes, we no have a pretty good looking plot.

![Current plot, no context lines](./assets/plot_no_context.png)

Oscar Lindblom and Mark Stone still overlap, but it's usable. Proper rookie treatment, I suppose.

## Optional 'Advanced' Additions
At this point, you have a scatter plot that looks nice and is usable! If you feel like you have learned enough to conquer the world on your own, go for it! *However*, there are a few things that we can add to make this plot **even better**! Part of this tutorial is to train yourself to spot small errors (name overlap) or areas of improvement. Below is are a few basic additions that can turn our *good* graph into a *great* graph:

- *Size Key*: what time-on-ice relates to what circle size?
- *Team Key*: specify which team is which color. This isn't obvious for many viewers!
- *Context Lines*: add Corsi-for % lines so the viewer can more easily judge how their favorite (or least favorite) players did.
- *Highlighting outliers*: constructing a narrative and drawing the viewer's eye to a set of players.

### Rendering Context (CF%) Lines 