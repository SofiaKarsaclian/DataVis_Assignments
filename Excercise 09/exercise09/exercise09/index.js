//Initialize some global variables.
//You may change the variables to fit your needs.
const width  = 1200; 
const height = 100; 
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
    const colorScale = "colors";

//Initialize the components
function init()
{

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
    //Depending on the checkbox value, the data should be aggregated, or not.
    //Initialize the graph with ungrouped data
    updateGraph(data)
}


 //This function handles the creation of the graph, depending on the passed 'graphData'
 function updateGraph(graphData) {
//++++++++++++++++++
//--TASK 1--(2 points)
//++++++++++++++++++
    //Draw a line for each link (1/2 point)
        //The color of the link should be blue when the value is greater than 0, red when below 0 (0.5/2 points)
        //If the value is below 0, add a dash-array to the stroke (0.5/2 points)

 
//++++++++++++++++++
//--TASK 1--(3 points)
//++++++++++++++++++
    //Create a group element for each node
    //Add a circle 
        //If aggregated, the radius of the circle should scale according to the count (1/3 point)
        //Color the circle according to the categorical colorScale (1/3 points)
    //Add a text label (1/3 points)
     
 

//++++++++++++++++++
//--TASK 1--(3 points)
//++++++++++++++++++
    //Create a force-directed layout ( https://github.com/d3/d3-force ) using the nodes and links (3/3 points)
}


//+++++++++++++++++++++++++++++++++
//+++DO NOT MODIFY THIS Function+++
//+++++++++++++++++++++++++++++++++
// This function returns the aggregated data according to an attribute value.
// !!You can use this function to aggregate the data according to the attribute 'house'!!
function aggregateData(unaggregated, attribute) {
    var newData = {}
    //grouping of nodes
    newData.nodes = Array.from(d3.group(unaggregated.nodes, d => d[attribute])).map((d,i) => {
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
        newData.nodes.slice(i+1).forEach((n2,i2) => {
        newData.links.push({
            source: i,
            target: i+1+i2,
            value: unaggregated.links.filter(d => (
            (d.source[attribute] == n.name && d.target[attribute] == n2.name) || 
            (d.source[attribute] == n2.name && d.target[attribute] == n.name))).map(d => d.value).reduce((curr, acc) => curr+acc, 0)
        })
        })
    })
    
    return newData;
}