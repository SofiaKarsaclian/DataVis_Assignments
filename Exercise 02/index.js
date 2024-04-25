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
    // Your code here

    // group by county
    const countyData = d3.group(data, d => d.county);
    countyData.forEach((entries, county) => {
    // filter out the values that do not make sense 
        const validRates = entries.filter(entry => !isNaN(entry.rate) && entry.rate >= 0 && entry.rate <= 100).map(entry => entry.rate);
    // replace them with county's rate average
        const meanRate = d3.mean(validRates);

        entries.forEach(entry => {
            if (isNaN(entry.rate) || entry.rate < 0 || entry.rate > 100) {
                entry.rate = meanRate;
            }
        });
    });
    return data;
}


// Setting up the histogram visualization using the processed data.
function createHistogram(processedData, numbins) {
    // Task 1.2: Create equal-width bins for the histogram
    // This subtask groups the data into a specified number of bins based on the unemployment rate.
    // Hint: look at the binning function of d3.bin https://observablehq.com/@d3/d3-bin
    // Your code here
    const rates = processedData.map(entry => entry.rate);
    const [minRate, maxRate] = d3.extent(rates);

    console.log('Minimum Rate:', minRate);
    console.log('Maximum Rate:', maxRate);
    // 1.6 - 26.4


    const xScale = d3.scaleLinear()
        .domain([minRate, maxRate])
        .range([0, width]);

    const bins = d3.bin()
        .domain(xScale.domain())
        .thresholds(numbins)
        (rates);

    // Log the bins to verify
    console.log('Histogram Bins:', bins);



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

}

// Execute the preprocessing and create the histogram
const processedData = preprocessData(data);
console.log(processedData)

// We implement X number of bins because... 
createHistogram(processedData, 20);
