# Hockey Data Visualization with D3.js
#### Lesson 1/3
## Introduction
If you're the type of person who has wandered to a stranger's github page, it is likely you have occasionally stumbled upon beautiful data vizualizations all throughout the internet. It's possible you yourself have some experience making plots in R, Python, or Matlab. All of those languages have packages that make it extremely easy to visualize large amounts of data. These packages really are truly amazing, and often suffice for a _majority_ of projects. However, as you gained experience, perhaps you've realized how difficult it is to truly customize these visualizations. Perhaps you've even spent hours laboring to get integrate these plots with a website or app, only to settle for a low-quality screenshot of it. Maybe, in the back of your mind, you've wondered how the engineers at [The New York Times](https://www.nytimes.com/interactive/2017/12/21/us/2017-year-in-graphics.html) and [FiveThirtyEight](https://fivethirtyeight.com/features/the-ridiculousness-of-conference-tournament-locations-in-6-maps/) consistently make gorgeous visualizations that appear beyond the scope of ggplot or matplotlib. 

Far be it from me to come here and to tell you to divorce your dearest visualization library. I will tell that there exists another, however, that can satisfy your unquenched desires for beautiful, customized visualizations. Like a siren, one library has long been singing your name, waiting for you to turn towards its shores. Unlike the sirens, it will not lead you towards inevitable death, but expand your life into new horizons.

### Purpose
####Is D3.js right for me?
Now, it is important to not get ahead of ourselves. D3 is not for the faint of heart. If your project is primarily research-oriented, and you are simply using visualizations as a supplement (testing or the like), perhaps D3 is not best for that project. It comes with no built-in plots. You are far better off going to your room and crying whilst listening to Sufjan Stevens than trying to build a 3D scatter plotto analyze your spectral clustering algorithm with D3 .

However, if you want a single _robust_ framework that can be used to build completely customizable geographic visualizations, scatter plots, networks, etc... AND be easily integrated with any website or app, D3 may be the way to go.

D3 allows you to build a cohesive narrative through data visualization.

#### Is this Tutorial for me?
The following are recommended (but not required) to truly get the most from this tutorial:

- Some programming experience (Python, Java, JavaScript, or the like). Understanding variables, functions, and primitive types (including Arrays) is about what we're looking for.
- A *very baseline* understanding of HTML.
- Minimal understanding of Hockey "advanced stats" terminology. For a great primer, see Charlie O'Connor's [article](https://t.co/nUgxqcrj9B) for *The Athletic*.

As I stated, all of the above are recommended but not required. I fully believe any keen hockey fan can make it through the tutorial. However, to gain an understanding of what's actually going on, all of the above are helpful! There are other projects out that will be more helpful for complete beginners.


## Getting Started
Let's start by cloning this github repository, which has the base HTML code, data, and directory structure already prepared.

To do this, either

