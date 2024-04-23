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
function preprocessData(data) {
    // Your code here
}


// Setting up the histogram visualization using the processed data.
function createHistogram(processedData, numbins) {
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

}

// Execute the preprocessing and create the histogram
const processedData = preprocessData(data);
createHistogram(processedData, 10);
