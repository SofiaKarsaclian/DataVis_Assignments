//++++++++++++++++++++++++++++++++++++++++
//+This function initializes the Exercise+
//++++++++++++++++++++++++++++++++++++++++
function init() 
{
    console.log("JavaScript loaded!")
    const data = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
    //Change the index position to select different colors.
    const circles4 = selectColorsByIndices(data, [0,1,2,3]);
    
    //This is the Set3 colormap from colorbrewer2.org
    var myColor = d3.scaleOrdinal().domain(data)
        .range(d3.schemeSet3);
    let svg = d3.select("#Task1");
    
    //Visualize the different colors with circles of sufficient size.
    svg.selectAll("circle").data(data).enter().append("circle")
            .attr("cx", function(d,i){return 10 + i*20})
            .attr("cy", 15).attr("r", 10)
            .attr("fill", function(d){return myColor(d) })
    
    //Visualize the 4 selected colors with circles of sufficient size.
    svg.selectAll(".colors4Circle").data(circles4).enter().append("circle")
    .attr("cx", function(d,i){return 10 + i*20})
    .attr("cy", 40).attr("r", 10)
    .attr("fill", function(d){return myColor(d) })

    //+++++++++++
    //++Task 1c++
    //+++++++++++

    //You might use functions already implemented in conversion.js
    //Examples:
    //get the RGB values of a circle
    //function extractRGBFromSVG
    let index = 0;
    const circles = svg.selectAll("circle").nodes();
        
    // Store color data for each circle
    const colors = [];

    // Extract RGB, and convert to CIELab
    circles.forEach((circle, index) => {
        // Extract RGB values
        const rgb = extractRGBFromSVG(d3.select(circle));
        console.log(`Circle ${index} RGB:`, rgb);

        //conversion from RGB values to CIELab
        if (rgb) {
            // Convert the RGB values to CIELab
            const lab = rgbToCIELAB(rgb.r, rgb.g, rgb.b);
            console.log(`Circle ${index} CIELab:`, lab);

            // Store the values 
            colors.push({ index, rgb, lab });
        } else {
            console.log(`Circle ${index} has no valid RGB values.`);
        }
    });

    console.log("Stored color data:", colors);

    console.log(extractRGBFromSVG(d3.select(circles[index])));


    //function rgbToCIELAB
    console.log(rgbToCIELAB(141, 211, 199));

    // Function to calculate the Euclidean distance between two CIELab colors
    function calculateColorDifference(lab1, lab2) {
        return Math.sqrt(
            Math.pow(lab1.L - lab2.L, 2) +
            Math.pow(lab1.a - lab2.a, 2) +
            Math.pow(lab1.b - lab2.b, 2)
        );
    }

    // Calculate the change in CIELab values
    const referenceLab = colors[0].lab; // Using the first circle as the reference

    const colorDifferences = colors.map(color => ({
        index: color.index,
        difference: calculateColorDifference(referenceLab, color.lab)
    }));

    // Sort circles based on the magnitude of their differences
    colorDifferences.sort((a, b) => a.difference - b.difference);

    // Select the first four circles with the smallest differences
    const selectedIndices = colorDifferences.slice(0, 4).map(colorDiff => colorDiff.index);

    const selectedColors = selectColorsByIndices(colors, selectedIndices);
    console.log("Selected circles with the most similar differences in CIELab values:", selectedColors);

    //+++++++++++
    //++Task 2a++
    //+++++++++++

    var SpeedColor = d3.scaleLinear().domain([0,100])
        .interpolate(d3.interpolateLab) //cielab
        .range(["#F3F2C9", "red"])

    var targetSpeed= 50;
    
    function currentLimit(speed) {
        var currentLimitCircle= d3.select("#currentLimit");
        currentLimitCircle.attr("fill", SpeedColor(speed));
    }

    currentLimit(targetSpeed);



    //+++++++++++
    //++Task 2b++
    //+++++++++++


    const RandomNumbers= [83, 25, 63, 4, 48];

    RandomNumbers.forEach((number, index) => {
        var color = SpeedColor(number);
    
        d3.select("#Task2b")
            .append("g")
            .attr("transform", `translate(${index * 160 + 10}, 10)`) // put lights next to each other, with space
            .attr("id", `traffic_light_${index}`)
            .html(`
                <rect x="0" y="0" width="150" height="200" fill="none" stroke-width="4" stroke="DimGray"/>
                <line x1="0" y1="40" x2="150" y2="40" stroke="DimGray" stroke-width="4"/>
                <circle class="minValue" cx="20" cy="20" r="15" fill="#F3F2C9"/>
                <text class="trafficText" x="40" y="30">0</text>
                <circle class="maxValue" cx="130" cy="20" r="15" fill="red"/>
                <text class="trafficText" x="70" y="30">100</text>
                <circle class="currentLimit" cx="75" cy="120" r="70" fill="${color}"/>
                <text class="trafficText" x="60" y="130" fill="white">${number}</text>
            `);
    });

    
}



//++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++No need to touch this function++++++++++
//+A function to select a subset of a given array+
//++++++++++++++++++++++++++++++++++++++++++++++++
function selectColorsByIndices(array, indices) 
{
    const selectedColors = indices.map(index => array[index]);
    return selectedColors;
}

