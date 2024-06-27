//Initialize some global variables.
//You may change the variables to fit your needs.
const width = 1200;
const height = 1200;
const margin = {
    left: 50,
    right: 50,
    top: 50,
    bottom: 50,
};
//++++++++++++++++++
//--TASK 1--(1 point)
//++++++++++++++++++
//Define a categorical color scale to color the different nodes according to their house.
const colorScale = d3.scaleOrdinal()
            .domain(['Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin', 'No House'])
            .range(['#740001', '#ecb939', '#222f5b', '#2a623d', 'gray']); 

//Initialize the components
function init() {

    /**
    * IMPORTANT NOTICE:
    * The data is provided and stored as the graphs nodes and links.
    * Check out the console to see the data structure:
    */
    const links = data.links;
    const nodes = data.nodes;
    console.log("Data Structure", data);

    d3.select('svg#chart').attr('width', width).attr('height', height);
    d3.select('g#vis-g').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
    let svg = d3.select('g#vis-g')

    const visHeight = height - margin.top - margin.bottom;
    const visWidth = width - margin.left - margin.right;

    //++++++++++++++++++
    //--TASK 1-- (1 point)
    //++++++++++++++++++
    //Attach an event handler on the checkbox, and call the updateGraph function.
    d3.select('#house_checkbox').on('change', function () {
        const isChecked = d3.select(this).property('checked');
        const graphData = isChecked ? aggregateData(data, 'house') : data;
        updateGraph(graphData);
    })
    //Depending on the checkbox value, the data should be aggregated, or not.
    //Initialize the graph with ungrouped data
    updateGraph(data)
}


//This function handles the creation of the graph, depending on the passed 'graphData'
function updateGraph(graphData) {
    // Clear previous graph by removing all child elements of the visualization group
    d3.select('g#vis-g').selectAll('*').remove();

    const svg = d3.select('g#vis-g');

    //++++++++++++++++++
    //--TASK 1--(2 points)
    //++++++++++++++++++
    //Draw a line for each link (1/2 point)
    const link = svg.selectAll('line')
        .data(graphData.links)
        .enter().append('line')
        //The color of the link should be blue when the value is greater than 0, red when below 0 (0.5/2 points)
        .attr('stroke', d => d.value > 0 ? 'blue' : 'red')
        //If the value is below 0, add a dash-array to the stroke (0.5/2 points)
        .attr('stroke-dasharray', d => d.value < 0 ? '4 2' : 'none')
        // make them less opaque to improve readability
        .attr('stroke-opacity', 0.5);



    //++++++++++++++++++
    //--TASK 1--(3 points)
    //++++++++++++++++++ 
    // Create a group element for each node
    const node = svg.selectAll('g')
        .data(graphData.nodes)
        .enter().append('g')
        .attr('class', 'node');

    // Add a circle
    node.append('circle')
        //If aggregated, the radius of the circle should scale according to the count (1/3 point)
        .attr('r', d => d.count ? Math.sqrt(d.count) * 5 : 5)
        ///Color the circle according to the categorical colorScale (1/3 points)
        .attr('fill', d => colorScale(d.house))
        .attr('fill-opacity', 0.8);

    //Add a text label (1/3 points)
    node.append('text')
        .text(d => d.name)
        .attr('x', 10)
        .attr('y', 3);


    //++++++++++++++++++
    //--TASK 1--(3 points)
    //++++++++++++++++++
    //Create a force-directed layout ( https://github.com/d3/d3-force ) using the nodes and links (3/3 points)
    const simulation = d3.forceSimulation(graphData.nodes)
        .force('link', d3.forceLink(graphData.links).id(d => d.id).distance(200))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter((width - margin.left - margin.right) / 2, (height - margin.top - margin.bottom) / 2))
        .on('tick', () => {
            // Update the positions of the links
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            // Update the positions of the nodes
            node
                .attr('transform', d => `translate(${d.x},${d.y})`);
        });
}


//+++++++++++++++++++++++++++++++++
//+++DO NOT MODIFY THIS Function+++
//+++++++++++++++++++++++++++++++++
// This function returns the aggregated data according to an attribute value.
// !!You can use this function to aggregate the data according to the attribute 'house'!!
function aggregateData(unaggregated, attribute) {
    var newData = {}
    //grouping of nodes
    newData.nodes = Array.from(d3.group(unaggregated.nodes, d => d[attribute])).map((d, i) => {
        return {
            name: d[0],
            [attribute]: d[0],
            id: i,
            count: d[1].length
        }
    })

    newData.links = []
    //for each node combination, create a link
    newData.nodes.forEach((n, i) => {
        newData.nodes.slice(i + 1).forEach((n2, i2) => {
            newData.links.push({
                source: i,
                target: i + 1 + i2,
                value: unaggregated.links.filter(d => (
                    (d.source[attribute] == n.name && d.target[attribute] == n2.name) ||
                    (d.source[attribute] == n2.name && d.target[attribute] == n.name))).map(d => d.value).reduce((curr, acc) => curr + acc, 0)
            })
        })
    })

    return newData;
}