/**
 * IMPORTANT NOTICE:
 * 
 * The data is provided by the data.js file.
 * Make sure the data.js file is loaded before the index.js file, so that you can acces it here!
 * The data is provided in an array called: data
 * const data = [
  {
    "species": "Adelie",
    "island": "Torgersen",
    "culmen_length_mm": 39.1,
    "culmen_depth_mm": 18.7,
    "flipper_length_mm": 181,
    "body_mass_g": 3750,
    "sex": "MALE"
  } ....
 */

console.log("Initial Data", data);

// constants
const width = 600;
const height = 600;
const margin = {
  left: 50,
  right: 50,
  top: 50,
  bottom: 50,
};

d3.select('svg#chart').attr('width', width).attr('height', height);
d3.select('g#vis-g').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

const visHeight = height - margin.top - margin.bottom;
const visWidth = width - margin.left - margin.right;

//TASK: get all dimensions in the dataset
let allDimensions = Object.keys(data[0]);

console.log("Dimensions of the dataset: ", allDimensions);

//TASK: Data cleaning
// filter out any datapoints where a value is undefined
// 334 datapoints should remain
let cleanData = data.filter(entry => {
  return allDimensions.every(dim => entry[dim] !== undefined);
});

console.log("cleaned Data:", cleanData);

//TASK: seperate numeric and categorical dimensions
let numerics = [];
let categoricals = [];
allDimensions.forEach(dim => {
  const firstobject = cleanData[0][dim];
  if (typeof firstobject === 'number') {
      numerics.push(dim);
  } else {
      categoricals.push(dim);
  }
});
console.log("numerical dimensions", numerics);
console.log("categorical dimensions", categoricals);


//append a circle for each datapoint
// for cx, cy, fill and r we set dummy values for now 
let selection = d3.select('g#scatter-points').selectAll('circle').data(cleanData)
  .enter().append('circle')
  .attr('cx', 0)
  .attr('cy', 0)
  .attr('r', 3)
  .attr('fill', 'black');
//add labels for x and y axis
let yLabel = d3.select('g#vis-g').append('text').attr('class', 'axis-label').text(' ');
let xLabel = d3.select('g#vis-g').append('text').attr('class', 'axis-label')
  .attr('transform', 'translate(' + visWidth + ', ' + visHeight + ')')
  .text(' ');


//TASK: add options to the select tags:
// for all <select>'s we have to add <options> for each data dimension
// the select for the x-axis, y-axis and size should only have numeric dimensions as options
// the select for the color should only have categorical dimensions as options
// add an event listener to the <select> tag
//    call the appropriate change function (xAxisChange(newDim), yAxisChange(newDim), colorChange(newDim) or sizeChange(newDim))


function populateSelects() {
  // numeric selector 
  const numericSelects = ['#x-axis-select', '#y-axis-select', '#size-select'];
  numericSelects.forEach(selectId => {
      const selectElement = d3.select(selectId);
      numerics.forEach(numeric => {
          selectElement.append('option').text(numeric).attr('value', numeric);
      });
  });

  // categorical selector 
  const colorSelect = d3.select('#color-select');
  categoricals.forEach(categorical => {
      colorSelect.append('option').text(categorical).attr('value', categorical);
  });
}

populateSelects();


// Event listener
function xAxisChange(newDim) {
  console.log('X-axis changed to:', newDim);
}

function yAxisChange(newDim) {
  console.log('Y-axis changed to:', newDim);
}

function colorChange(newDim) {
  console.log('Color changed to:', newDim);
}

function sizeChange(newDim) {
  console.log('Size changed to:', newDim);
}

// Add event listeners to the select elements
d3.select('#x-axis-select').on('change', function() {
  const newDim = d3.select(this).property('value');
  xAxisChange(newDim);
});

d3.select('#y-axis-select').on('change', function() {
  const newDim = d3.select(this).property('value');
  yAxisChange(newDim);
});

d3.select('#color-select').on('change', function() {
  const newDim = d3.select(this).property('value');
  colorChange(newDim);
});

d3.select('#size-select').on('change', function() {
  const newDim = d3.select(this).property('value');
  sizeChange(newDim);
});






// TASK: x axis update:
// Change the x Axis according to the passed dimension
// update the cx value of all circles  
// update the x Axis label 
xAxisChange = (newDim) => {

    const xScale = d3.scaleLinear()
        .domain(d3.extent(cleanData, d => d[newDim]))
        .range([0, visWidth]);

    const xAxis = d3.axisBottom(xScale);

    d3.select('#x-axis')
        .attr('transform', `translate(0, ${visHeight})`)
        .call(xAxis);

    // update the cx value of all circles  
    d3.selectAll('circle')
        .transition()
        .duration(500)
        .attr('cx', d => xScale(d[newDim]));

    // x-axis label
    xLabel.text(newDim)
        .attr('transform', `translate(${visWidth}, ${visHeight})`)
        .attr('text-anchor', 'end');
};





// TASK: y axis update:
// Change the y Axis according to the passed dimension
// update the cy value of all circles  
// update the y Axis label 
yAxisChange = (newDim) => {

  const yScale = d3.scaleLinear()
      .domain(d3.extent(cleanData, d => d[newDim]))
      .range([visHeight, 0]);

  const yAxis = d3.axisLeft(yScale);
  d3.select('#y-axis').call(yAxis);

  // update the cy value of all circles
  d3.selectAll('circle').transition().duration(500)
      .attr('cy', d => yScale(d[newDim]));

  // y-axis label
  yLabel.text(newDim)
      .attr('transform', 'rotate(-90)')
      .attr('x', -visHeight / 2)
      .attr('y', -margin.left + 15)
      .attr('text-anchor', 'middle');
};





// TASK: color update:
// Change the color (fill) according to the passed dimension
// update the fill value of all circles  
//
// add a <span> for each categorical value to the legend div 
// (see #color-select-legend in the html file)
// the value text should be colored according to the color scale 

colorChange = (newDim) => {

  const categories = [...new Set(cleanData.map(d => d[newDim]))];
  const colorScale = d3.scaleOrdinal()
      .domain(categories)
      .range(d3.schemeCategory10);

  // update the fill value of all circles
  d3.selectAll('circle').transition().duration(500)
      .attr('fill', d => colorScale(d[newDim]));

  // color legend
  const legendDiv = d3.select('#color-select-legend');
  legendDiv.selectAll('span').remove(); 
  categories.forEach(category => {
      legendDiv.append('span')
          .text(category)
          .style('color', colorScale(category))
          .style('margin-right', '10px');
  });
};



// TASK: size update:
// Change the size according to the passed dimension
// update the r value of all circles  
sizeChange = (newDim) => {

  const sizeScale = d3.scaleLinear()
      .domain(d3.extent(cleanData, d => d[newDim]))
      .range([2, 10]); 

  // update the r value of all circles
  d3.selectAll('circle').transition().duration(500)
      .attr('r', d => sizeScale(d[newDim]));
};


//initialize the scales
xAxisChange('culmen_length_mm');
yAxisChange('culmen_length_mm');
colorChange('species');
sizeChange('culmen_length_mm');