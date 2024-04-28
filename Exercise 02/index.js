/**
 * IMPORTANT NOTICE:
 * 
 * The data is provided by the data.js file.
 * Make sure the data.js file is loaded before the index.js file, so that you can access it here!
 * The data is provided in an array called: data
 * const data = [
    { id: 1001, state: "Alabama", county: "Autauga County", rate: 5.1 },
        ....
 ];**/

// Constants
const width = 700;
const height = 500;
const margin = { left: 50, right: 20, bottom: 50 };

// Task 1.1: Data Preprocessing
// This task ensures that all data values are within a logical range.

// When observing the data we observe rates of -1 and rates larger than 100, which do not make sense.

// To deal with these values we substitute them with the county's mean. Although not the most accurate, we do not have other variables on which 
// we could run a regression on, and still allows us to keep the observations, which, although not crucial for a histogram, may be relevant for other visualizations. 

function preprocessData(data) {
    // Group data by state
    const stateData = d3.group(data, d => d.state);

    // Iterate through each state in the grouped data
    stateData.forEach((entries, state) => {
        // Filter out invalid rates and calculate mean rate for the state
        const validRates = entries.filter(entry => !isNaN(entry.rate) && entry.rate >= 0 && entry.rate <= 100)
                                  .map(entry => entry.rate);
        const meanRate = d3.mean(validRates);

        // Iterate through each entry in the state
        entries.forEach(entry => {
            // Check if the rate is invalid
            if (isNaN(entry.rate) || entry.rate < 0 || entry.rate > 100) {
                // Replace invalid rate with state mean rate
                entry.rate = meanRate;

                // Log the revised observation
                console.log(`Revised observation: ID = ${entry.id}, State = ${entry.state}, County = ${entry.county}, Rate = ${entry.rate}`);
            }
        });
    });

    // Return the modified data
    return data;
}


// Setting up the histogram visualization using the processed data.

    // Task 1.2: Create equal-width bins for the histogram
    // This subtask groups the data into a specified number of bins based on the unemployment rate.
    // Hint: look at the binning function of d3.bin https://observablehq.com/@d3/d3-bin
    // Your code here

    // Task 2.1: Create Histogram with Equal Width Binning
    // Create a linear x- and y-scale
    // The x-scale maps unemployment rates to pixel values for the width of the histogram.
    // Your code here
    // The y-scale maps the count of entries in each bin to pixel values for the height of the bars.
    // Your code here

    // Bind the bins data to rectangles in the SVG
    // This subtask manages the rectangles that represent the bars of the histogram.
    // Your code here

    // Enter and update phase for rectangles
    // Rectangles are added or updated based on the data. This subtask also defines the bar dimensions.
    // Your code here

    // Add axes to the histogram
    // This subtask adds horizontal and vertical axes to the chart, with appropriate labels and scaling.
    // Your code here



    function createHistogram(processedData, numbins) {
        // Get rates and compute the range
        const rates = processedData.map(entry => entry.rate);
        const [minRate, maxRate] = d3.extent(rates);
        console.log('Minimum Rate:', minRate);
        console.log('Maximum Rate:', maxRate);
    
        // Set up x-scale
        const xScale = d3.scaleLinear()
            .domain([minRate, maxRate])
            .range([0, width]);
    
        // Create bins
        const bins = d3.bin()
            .domain(xScale.domain())
            .thresholds(numbins)
            (rates);
    
        // Log the bins to verify and display the counts of each bin
        console.log('Histogram Bins:');
        bins.forEach((bin, index) => {
            console.log(`Bin ${index}: Range [${bin.x0}, ${bin.x1}), Count = ${bin.length}`);
        });
    
        // Calculate the average rate in the first bin
        if (bins.length > 0) {
            const firstBin = bins[0];
            const averageRateInFirstBin = d3.mean(firstBin);
            
            // Display the average rate in the first bin in the console
            console.log(`Average rate in the first bin: ${averageRateInFirstBin}`);
        }
    
        // Create a linear y-scale based on the count in each bin
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(bins, d => d.length)])
            .range([height, 0]);
    
        // Create an SVG container for the histogram
        const svg = d3.select("body")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, 0)`);
    
        // Bind bins data to rectangles and create bars
        const barWidth = width / numbins;
        svg.selectAll("rect")
            .data(bins)
            .enter()
            .append("rect")
            .attr("x", d => xScale(d.x0))
            .attr("y", d => yScale(d.length))
            .attr("width", barWidth)
            .attr("height", d => height - yScale(d.length))
            .attr("fill", "steelblue");
    
        // Add x-axis to the histogram
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(xScale));
    
        // Add y-axis to the histogram
        svg.append("g")
            .call(d3.axisLeft(yScale));
    
        // Add labels (optional)
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 10)
            .style("text-anchor", "middle")
            .text("Unemployment Rate");
    
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left)
            .attr("x", -height / 2)
            .style("text-anchor", "middle")
            .text("Count");
    }
    
    


// Execute the preprocessing and create the histogram
const processedData = preprocessData(data);
console.log(processedData)

// We implement 25 number of bins because... 
// Choosing 25 bins strikes a balance in displaying the data's distribution pattern while preserving important information about the data.
createHistogram(processedData, 25);

// Task 2.1
// Including observations with a rate of -1 in the first bin causes a negative average rate, leading the first bin of the histogram to display below the y-axis.



