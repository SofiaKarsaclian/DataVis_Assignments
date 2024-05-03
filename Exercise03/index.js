/**
 * IMPORTANT NOTICE:
 * 
 * The data is provided by the data.js file which you need to add in the index.html file. 
 * Make sure the data.js file is loaded before the index.js file, so that you can acces it here!
 * The data is provided in an array called: data
 * const data = [
        {
            "tas": 1.96318,
            "pr": 37.2661,
            "Year": 1991,
            "Month": 1,
            "Country": "DEU"
        }
        ....
 */

console.log("Raw Data:", data);


/* TASK: Retrieve (select) the visualization container node of the div element declared within the index.html by its identifier. */
var container = d3.select("#vis-container")

// Specify margins such that the visualization is clearly visible and no elements are invisible due to the svg border
var margins = {
    top: 20,
    right: 20,
    bottom: 50,
    left: 50
};

// Specify the width and height of the svg as well as the width height of the viewport of the visualization.
var width = 800;
var height = 400;
var visWidth = width - margins.left - margins.right;
var visHeight = height - margins.top - margins.bottom;

/* TASK: Append an svg element to the vis-container, set its width and height (in pixels), add it to the vis-container, and save the element to variable called 'svg' */
var svg= container.append("svg")
    .attr("width", width)
    .attr("height", height)

/* TASK: Add a group element to the svg to realize the margin by translating the group, and save the element to variable called 'viewport'. */
var viewport = svg.append("g")
    .attr("transform", "translate(" + margins.left + "," + margins.top + ")");


// Data Preparation: For each year we want the average rain and temperature
// TASK: Use d3.group() to group the data entries by year (see https://github.com/d3/d3-array#group)
var dataByYears = d3.group(data, d => d.Year);





// TASK: convert the Map dataByYears from d3.group() to an array to iterate over it. Read the documentation (https://github.com/d3/d3-array#group) to see how 
var dataByYearsArray =  Array.from(dataByYears);




// We intialize an empty array 'avgData' which will hold the average values and the respective years
var avgData = [];


// TASK: iterate through the data by years and use the d3.mean() function to calculate the mean values of temperature and rainfall for each year
// Similarly to Ex. 1: Push one object for each year onto the 'avgData' array
dataByYearsArray.forEach(([year, yearData]) => {
    var temp = d3.mean(yearData, d => d.tas);
    var rain = d3.mean(yearData, d => d.pr);

    avgData.push({
        Year: year,
        temp: temp,
        rain: rain
    });
});


console.log("Average Data per Year:", avgData);

// TASK: Initialize Scales using d3.linearScale function (see https://github.com/d3/d3-scale/blob/master/README.md#continuous-scales)
// You can make use of the d3.extent and d3.max function to calculate the domains. (see https://github.com/d3/d3-array/blob/master/README.md#statistics)

var xScale = d3.scaleLinear()
    .domain([d3.min(avgData, d => d.Year), d3.max(avgData, d => d.Year)])
    .range([0, visWidth])
    .nice();

var tempScale = d3.scaleLinear()
    .domain([0, d3.max(avgData, d => d.temp)])
    .range([visHeight, 0])
    .nice();

var rainScale = d3.scaleLinear()
    .domain([0, d3.max(avgData, d => d.rain)])
    .range([visHeight, 0])
    .nice();



// In order to organize our code, we add another group which will hold all elements (circles and paths) of the visualization
var visualization = viewport.append("g");
var circles = visualization.selectAll("circle")
    .data(avgData).enter();

console.log("Entered Data:", circles);

// TASK: Append one blue circle for each rain data point. Make use of the previously initialized scales and anonymous functions.
// Make them classed c-rain and set the cx and cy attributes accordingly.

circles.append("circle")
    .attr("class", "c-rain")
    .attr("cx", d => xScale(d.Year))
    .attr("cy", d => rainScale(d.rain))
    .attr("r", 3)
    .style("fill", "blue");



// TASK: Append one red circle for each temperature data point. Make use of the previously initialized scales and anonymous functions.
// Make them classed c-temp and set the cx and cy attributes accordingly.


circles.append("circle")
    .attr("class", "c-temp")
    .attr("cx", d => xScale(d.Year))
    .attr("cy", d => tempScale(d.temp))
    .attr("r", 3)
    .style("fill", "red");



// TASK: Initialize a line generator for each line (rain and temperature) and define the generators x and y value.
// Save the line-generator to a variable

var lineGeneratorTemperature = d3.line()
    .x(d => xScale(d.Year))
    .y(d => tempScale(d.temp));

var lineGeneratorRainfall = d3.line()
    .x(d => xScale(d.Year))
    .y(d => rainScale(d.rain));

// TASK: Append two path elements to the 'visualization' group. Set its 'd' attribute respectively using the linegenerators from above
// Do not forget to set the correct class attributes in order to have the stylesheet applied (.line-temp, .line-rain, .line)

visualization.append("path")
    .datum(avgData)
    .attr("class", "line-temp")
    .attr("d", lineGeneratorTemperature)
    .style("fill", "none")
    .style("stroke", "red")
    .style("stroke-width", 2);

visualization.append("path")
    .datum(avgData)
    .attr("class", "line-rain")
    .attr("d", lineGeneratorRainfall)
    .style("fill", "none")
    .style("stroke", "blue")
    .style("stroke-width", 2);





// At this point we have similar state as in Exercise 1

// Lets add some axis (check https://github.com/d3/d3-axis for an example)
var axisG = viewport.append("g");

// Add X Axis for years
axisG.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + visHeight + ")")
    .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

// TASK: append a group for the axis of the temperature on the left side (d3.axisLeft)
// Make it classed "y-temp" and translate it to the left side of the visualization (0, 0)

axisG.append("g")
    .attr("class", "y-temp")
    //.attr("transform", "translate(0," + visWidth + ")")
    .attr("transform", "translate(0, 0)")
    .call(d3.axisLeft(tempScale)); 



// TASK: append a group for the axis of the rain on the right side (d3.axisRight).
// Make it classed "y-rain" and translate it to the right side of the visualization (visWidth, 0)

axisG.append("g")
    .attr("class", "y-rain")
    .attr("transform", "translate(" + visWidth + ", 0)")
    .call(d3.axisRight(rainScale)); 



// TASK: append three text elements to the axisG group and label the axes respectively
axisG.append("text")
    .attr("class", "x label")
    .attr("x", visWidth/2)
    .attr("y", visHeight+30)
    .text("Year");

axisG.append("text")
    .attr("class", "temp label")
    .attr("x", -margins.left+25)
    .attr("y", -8)
    .text("Temp");

axisG.append("text")
    .attr("class", "rain label")
    .attr("x", visWidth-5)
    .attr("y", -8)
    .text("Rain");



// This function gets called when the user presses the "Update Axis" button on the webpage. 
function updateAxis(){
    // TASK: Update the scales to Logarithmic scales (d3.scaleLog) if they are linear scales (d3.scaleLinear) and vice versa
    if (tempScale === d3.scaleLinear()) {
        // from linear to log
        tempScale = d3.scaleLog()
            .domain([1, d3.max(avgData, d => d.temp)]) 
            .range([visHeight, 0])
            .nice();    
    } else {
        // from log t linear
        tempScale = d3.scaleLinear()
            .domain([0, d3.max(avgData, d => d.temp)])
            .range([visHeight, 0])
            .nice();
    }

    // Check if the current scale for rainfall is linear
    if (rainScale === d3.scaleLinear()) {
        rainScale = d3.scaleLog()
            .domain([1, d3.max(avgData, d => d.rain)]) 
            .range([visHeight, 0])
            .nice();
    } else {
        rainScale = d3.scaleLinear()
            .domain([0, d3.max(avgData, d => d.rain)]) 
            .range([visHeight, 0])
            .nice();
    }


    // The following code updates the axis and the circles according to the new scales
    visualization.selectAll('.c-temp').transition().duration(1000)
        .attr('cy', d => tempScale(d.temp))
    
    visualization.selectAll('.c-rain').transition().duration(1000)
        .attr('cy', d => rainScale(d.rain))

    visualization.select('.line-temp').transition().duration(1000)
        .attr('d', lineGeneratorTemperature(avgData.map(d => [xScale(d.year), tempScale(d.temp)])))

    visualization.select('.line-rain').transition().duration(1000)
        .attr('d', lineGeneratorRainfall(avgData.map(d => [xScale(d.year), rainScale(d.rain)])))

    axisG.select('.y-temp').transition().duration(1000)
        .call(d3.axisLeft(tempScale))

    axisG.select('.y-rain').transition().duration(1000)
        .attr("transform", "translate(" + visWidth + ",0)")
        .call(d3.axisRight(rainScale))
}