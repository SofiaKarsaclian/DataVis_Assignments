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
    console.log(extractRGBFromSVG(d3.select(circles[index])));

    //conversion from RGB values to CIELab
    //function rgbToCIELAB
    console.log(rgbToCIELAB(141, 211, 199));



    //+++++++++++
    //++Task 2a++
    //+++++++++++


    //+++++++++++
    //++Task 2b++
    //+++++++++++
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

