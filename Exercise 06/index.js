// TASK 1a

console.log("Data", data);

// constants
const width = 600;
const height = 600;
const margin = { left: 50, right: 50, top: 50, bottom: 50 };
const padding = 25;

const columns = Object.keys(data[0]);
const size = (width - (columns.length + 1) * padding) / columns.length + padding;

// Create scales
const xScales = {};
const yScales = {};

columns.forEach(column => {
    const values = data.map(d => d[column]);
    xScales[column] = d3.scaleLinear()
        .domain(d3.extent(values))
        .range([padding / 2, size - padding / 2]);
    yScales[column] = d3.scaleLinear()
        .domain(d3.extent(values))
        .range([size - padding / 2, padding / 2]);
});

// Create SVG
const svg = d3.select("body").append("svg")
    .attr("width", size * columns.length + padding)
    .attr("height", size * columns.length + padding);

const cell = svg.selectAll(".cell")
    .data(d3.cross(columns, columns))
    .join("g")
    .attr("class", "cell")
    .attr("transform", d => `translate(${columns.indexOf(d[0]) * size},${columns.indexOf(d[1]) * size})`);

// Scatter plot matrix
cell.each(function([xDim, yDim]) {
  const cellGroup = d3.select(this);

  if (xDim === yDim) {
      // Diagonal: create histogram
      const histogram = d3.histogram()
          .domain(xScales[xDim].domain())
          .thresholds(xScales[xDim].ticks(10))
          (data.map(d => d[xDim]));

      const y = d3.scaleLinear()
          .domain([0, d3.max(histogram, d => d.length)])
          .range([size - padding / 2, padding / 2]);

      cellGroup.selectAll(".histogram-bar")
          .data(histogram)
          .join("rect")
          .attr("class", "histogram-bar")
          .attr("x", d => xScales[xDim](d.x0))
          .attr("width", d => xScales[xDim](d.x1) - xScales[xDim](d.x0) - 1)
          .attr("y", d => y(d.length))
          .attr("height", d => size - padding / 2 - y(d.length));
  } else if (columns.indexOf(xDim) < columns.indexOf(yDim)) {
      // Below diagonal: create scatter plot
      cellGroup.append("g")
          .selectAll("circle")
          .data(data)
          .join("circle")
          .attr("cx", d => xScales[xDim](d[xDim]))
          .attr("cy", d => yScales[yDim](d[yDim]))
          .attr("r", 2);
  } else {
      // Above diagonal: Pearson correlation coefficient
      const corr = pearsonCorrelation(data, xDim, yDim);
      cellGroup.append("text")
          .attr("class", "correlation")
          .attr("x", size / 2)
          .attr("y", size / 2)
          .text(corr.toFixed(2));
  }

  cellGroup.append("rect")
  .attr("class", "cell-box")
  .attr("x", padding / 2 - 1) // made them a bit bigger so that the points are not on the line
  .attr("y", padding / 2 - 1) 
  .attr("width", size - padding + 2) 
  .attr("height", size - padding + 2) 
  .style("fill", "none")
  .style("stroke", "#000");

});

function pearsonCorrelation(data, xDim, yDim) {
    const xMean = d3.mean(data, d => d[xDim]);
    const yMean = d3.mean(data, d => d[yDim]);
    const numerator = d3.sum(data, d => (d[xDim] - xMean) * (d[yDim] - yMean));
    const denominator = Math.sqrt(
        d3.sum(data, d => (d[xDim] - xMean) ** 2) * 
        d3.sum(data, d => (d[yDim] - yMean) ** 2)
    );
    return numerator / denominator;
}

// Add axis labels
svg.selectAll(".cell")
    .each(function([xDim, yDim]) {
        if (yDim === columns[0]) {
            d3.select(this).append("text")
                .attr("class", "axis-label")
                .attr("x", size / 2)
                .attr("y", padding / 2 - 10)
                .attr("dy", ".71em")
                .text(xDim);
        }
        if (xDim === columns[0]) {
            d3.select(this).append("text")
                .attr("class", "axis-label")
                .attr("transform", "rotate(-90)")
                .attr("x", -size / 2)
                .attr("y", padding / 2 - 10)
                .attr("dy", ".71em")
                .text(yDim);
        }
    });


// TASK 1b

// import data
d3.csv("import-85.csv").then(function(data2) {
  data2.forEach(d => {
      d["engine_size"] = +d[17]; // engine_size
      d["horsepower"] = d[22] === '?' ? null : +d[22]; // horsepower
      d["peak_rpm"] = d[23] === '?' ? null : +d[23]; // peak_rpm
      d["city_mpg"] = +d[24]; // city_mpg
      d["highway_mpg"] = +d[25]; // highway_mpg
      d["price"] = d[26] === '?' ? null : +d[26]; // price
  });

  // Filter out obs with nulls
  const filteredData = data2.filter(d => 
      d["engine_size"] !== null && d["horsepower"] !== null && d["peak_rpm"] !== null &&
      d["city_mpg"] !== null && d["highway_mpg"] !== null && d["price"] !== null
  );

  console.log(filteredData);
});
