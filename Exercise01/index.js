//TASK 4a
//let the console tell that the script is loaded
console.log('The JavaScript file has been loaded.');

// TASK 4b
// Select the five circles in the svg container.

//ensure everything is loaded
document.addEventListener("DOMContentLoaded", function() {
    // Select the circles in the SVG container
    var circles = document.querySelectorAll("circle");

// Retrieve the x- and y-values and calculate the mean position.

    // initialize count
    var totalX = 0;
    var totalY = 0;

    // loop through circles and add x and y values to the total
    circles.forEach(circle => {
        var cx = parseFloat(circle.getAttribute('cx'));
        var cy = parseFloat(circle.getAttribute('cy'));
        totalX += cx;
        totalY += cy;
      });
    
      // Calculate mean x and y positions
      var meanX = totalX / circles.length;
      var meanY = totalY / circles.length;


// Add a square to the svg container at the mean coordinates.
    var square = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    // x and y are defined for the top left corner, minus 2 (half the width) to center it
    square.setAttribute('x', meanX -2); 
    square.setAttribute('y', meanY - 2); 
    square.setAttribute('width', '4');
    square.setAttribute('height', '4');
    square.setAttribute('fill', 'black'); // Change the fill color if needed


// Print the mean values to the console.
    console.log('Mean X:', meanX);
    console.log('Mean Y:', meanY);

    document.querySelector('svg').appendChild(square);
  });

