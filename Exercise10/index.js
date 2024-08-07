console.log("Data", data);

// constants
const width = 1800;
const height = 800;
const margin = {
  left: 50,
  right: 50,
  top: 50,
  bottom: 50,
};

const visHeight = height - margin.top - margin.bottom;
const visWidth = width - margin.left - margin.right;

const chart = d3.select('#chart')
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


  console.log(chart.node());
//--------------------------------------------------------------------------------------
// add your code here 

// aggregate data for suppliers in same city
const aggregatedData = data.reduce((acc, { country, city, supplier, sales_EUR }) => {
  const key = `${city}-${supplier}`;
  if (!acc[key]) {
    acc[key] = { country, city, supplier, sales_EUR: 0 };
  }
  acc[key].sales_EUR += sales_EUR;
  return acc;
}, {});

const dataAgg = Object.values(aggregatedData);
console.log(dataAgg)

// Convert data into hierarchical format
const nestedData = d3.group(dataAgg, d => d.country, d => d.city, d => d.supplier);
const root = d3.hierarchy(nestedData)
  .sum(d => d.sales_EUR);


console.log(nestedData)
d3.treemap()
  .size([visWidth, visHeight])
  .padding((d, i, nodes) => {
    if (d.depth === 0) return 20;       // Top padding for countries
    if (d.depth === 1) return 5;       // Padding between cities
    return 0.2;                          // Padding between suppliers
  })(root);

// Define a color scale for the level 1 categories (countries)
const color = d3.scaleOrdinal(d3.schemeCategory10)
  .domain([...new Set(data.map(d => d.country))]);

// Add rectangles to the chart
const nodes = chart.selectAll('g')
  .data(root.leaves())
  .enter().append('g')
  .attr('transform', d => `translate(${d.x0},${d.y0})`);

nodes.append('rect')
  .attr('id', d => d.data.supplier)
  .attr('width', d => d.x1 - d.x0)
  .attr('height', d => d.y1 - d.y0)
  .attr('fill', d => color(d.data.country));

nodes.append('text')
  .attr('x', 3)
  .attr('y', 13)
  .text(d => d.data.supplier)
  .attr('fill', 'white')
  .attr('font-size', '12px');


// Add heading above rectangles belonging to the same level 1 group
const countryGroups = chart.selectAll('.country')
  .data(root.children)
  .enter().append('g')
  .attr('class', 'country');

countryGroups.append('text')
  .attr('x', d => d.x0)
  .attr('y', d => d.y0 - 10)
  .text(d => d.data[0])
  .attr('fill', d => color(d.data[0]))
  .attr('font-size', '14px')
  .attr('font-weight', 'bold');

// Add interactivity
const tooltip = d3.select('.own-tooltip');

nodes.on('mouseover', function (event, d) {
  console.log("Mouse Over Event:", event.pageX, event.pageY);

  tooltip.style('display', 'block')
    .html(`City: ${d.ancestors()[2].data[0]}<br>Country: ${d.ancestors()[1].data[0]}<br>Sales: €${d.data.sales_EUR}<br>Supplier: ${d.data.supplier}`)
    .style('left', `${event.pageX + 5}px`)
    .style('top', `${event.pageY + 5}px`);

  nodes.selectAll('rect')
    .attr('opacity', 0.1);

  d3.selectAll(`#${d.data.supplier}`)
    .attr('opacity', 1);
})

.on('mousemove', function (event) {
  tooltip.style('left', `${event.pageX + 5}px`)
    .style('top', `${event.pageY + 5}px`);
})

.on('mouseout', function () {
  tooltip.style('display', 'none');
  nodes.selectAll('rect')
    .attr('opacity', 1);
});