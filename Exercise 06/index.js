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

function spearmanCorrelation(data, xDim, yDim) {
    // Function to compute ranks
    function rank(array) {
        const sorted = array.slice().sort((a, b) => a - b);
        const ranks = array.map(v => sorted.indexOf(v) + 1);
        return ranks;
    }

    // Extract x and y values
    const xValues = data.map(d => d[xDim]);
    const yValues = data.map(d => d[yDim]);

    // Compute ranks
    const xRanks = rank(xValues);
    const yRanks = rank(yValues);

    // Compute the differences between ranks
    const rankDiffs = xRanks.map((rank, i) => rank - yRanks[i]);

    // Compute the sum of squared differences
    const dSquaredSum = d3.sum(rankDiffs.map(diff => diff ** 2));

    // Compute the Spearman correlation coefficient
    const n = data.length;
    const spearmanCorr = 1 - (6 * dSquaredSum) / (n * (n * n - 1));

    return spearmanCorr;
}


// TASK 1a

const width = 1500;

const marginWhole = { top: 30, right: 10, bottom: 10, left: 30 },
    sizeWhole = width - marginWhole.left - marginWhole.right



// Create the svg area
const svg = d3.select("#svg1")
    .attr("width", sizeWhole + marginWhole.left + marginWhole.right)
    .attr("height", sizeWhole + marginWhole.top + marginWhole.bottom)
    .append("g")
    .attr("transform", `translate(${marginWhole.left},${marginWhole.top})`);

const allVar = [
    "engine_size",
    "horsepower",
    "peak_rpm",
    "city_mpg",
    "highway_mpg",
    "price"
]
const numVar = allVar.length

mar = 30
size = sizeWhole / numVar


// ----------------- //
// Scales

// Create a scale: gives the position of each pair each variable
const position = d3.scalePoint()
    .domain(allVar)
    .range([0, sizeWhole - size])


// ------------------------------- //
// Add charts

for (let i = 0; i < allVar.length; ++i) {
    for (let j = 0; j < allVar.length; ++j) {

        // Get current variable name
        let var1 = allVar[i]
        let var2 = allVar[j]

        // If var1 == var2 it's on the diagonal, add histograms
        if (var1 === var2) {
            // create X Scale
            xextent = d3.extent(data, function (d) { return +d[var1] })
            const x = d3.scaleLinear()
                .domain(xextent).nice()
                .range([0, size - 2 * mar]);

            // Add a 'g' at the right position
            const tmp = svg
                .append('g')
                .attr("transform", `translate(${position(var1) + mar},${position(var2) + mar})`);

            // Add x axis
            tmp.append("g")
                .attr("transform", `translate(0,${size - mar * 2})`)
                .call(d3.axisBottom(x).ticks(3));

            // set the parameters for the histogram
            const histogram = d3.histogram()
                .value(function (d) { return +d[var1]; })
                .domain(x.domain())
                .thresholds(x.ticks(15));

            // And apply this function to data to get the bins
            const bins = histogram(data);

            // Y axis: scale and draw:
            const y = d3.scaleLinear()
                .range([size - 2 * mar, 0])
                .domain([0, d3.max(bins, function (d) { return d.length; })]);

            // append the bar rectangles to the svg element
            tmp.append('g')
                .selectAll("rect")
                .data(bins)
                .join("rect")
                .attr("x", 1)
                .attr("transform", d => `translate(${x(d.x0)},${y(d.length)})`)
                .attr("width", function (d) { return x(d.x1) - x(d.x0); })
                .attr("height", function (d) { return (size - 2 * mar) - y(d.length); })
                .style("fill", "#b8b8b8")
                .attr("stroke", "white")
        } else if (i < j) {
            // create scatter plot
            // Add X Scale of each graph
            xextent = d3.extent(data, function (d) { return +d[var1] })
            const x = d3.scaleLinear()
                .domain(xextent).nice()
                .range([0, size - 2 * mar]);

            // Add Y Scale of each graph
            yextent = d3.extent(data, function (d) { return +d[var2] })
            const y = d3.scaleLinear()
                .domain(yextent).nice()
                .range([size - 2 * mar, 0]);

            // Add a 'g' at the right position
            const tmp = svg
                .append('g')
                .attr("transform", `translate(${position(var1) + mar},${position(var2) + mar})`);

            // Add X and Y axis in tmp
            tmp.append("g")
                .attr("transform", `translate(0,${size - mar * 2})`)
                .call(d3.axisBottom(x).ticks(3));
            tmp.append("g")
                .call(d3.axisLeft(y).ticks(3));

            // Add circle
            tmp
                .selectAll("myCircles")
                .data(data)
                .join("circle")
                .attr("cx", function (d) { return x(+d[var1]) })
                .attr("cy", function (d) { return y(+d[var2]) })
                .attr("r", 3)
                .attr("fill", "black")
        } else {
            // Above diagonal: Pearson correlation coefficient
            const corr = pearsonCorrelation(data, var1, var2);
            const tmp = svg
                .append('g')
                .attr("transform", `translate(${position(var1) + mar},${position(var2) + mar})`);
            tmp.append("text")
                .attr("class", "correlation")
                .attr("x", size / 2 - mar)
                .attr("y", size / 2 - mar)
                .text(corr.toFixed(2));
        }
    }
}


// ------------------------------- //
// Add labels
// ------------------------------- //

// horizontal label axis
svg
    .append("g")
    .attr("transform", `translate(${size / 2}, 0)`)
    .call(d3.axisTop(position))
    .selectAll("path,line").remove();

const axisY = svg
    .append("g")
    .attr("transform", `translate(-20, ${size / 2 - mar})`)
    .call(d3.axisLeft(position));

axisY
    .selectAll("path,line")
    .remove();
axisY
    .selectAll("text")
    .attr("transform", `rotate(-90)`)




console.log("Data", data);


// TASK 1b

// import data
d3.csv("./imports-85.csv").then(function (data2) {
    data2.forEach(d => {
        d["engine_size"] = parseInt(d["engine_size"]); // engine_size
        d["horsepower"] = parseInt(d["horsepower"]); // horsepower
        d["peak_rpm"] = parseInt(d["peak_rpm"]); // peak_rpm
        d["city_mpg"] = parseInt(d["city_mpg"]); // city_mpg
        d["highway_mpg"] = parseInt(d["highway_mpg"]); // highway_mpg
        d["price"] = parseInt(d["price"]); // price
        d["compression_ratio"] = parseInt(d["compression_ratio"]); // compression_ratio
        d["curb_weight"] = parseInt(d["curb_weight"]); // curb_weight

    });

    // Filter out obs with nulls
    const filteredData = data2.filter(d =>
        d["engine_size"] !== null && d["horsepower"] !== null && d["peak_rpm"] !== null &&
        d["city_mpg"] !== null && d["highway_mpg"] !== null && d["price"] !== null &&
        d["compression_ratio"] !== null && d["curb_weight"] !== null
    );
    // Create the svg area
    const svg = d3.select("#svg2")
        .attr("width", sizeWhole + marginWhole.left + marginWhole.right)
        .attr("height", sizeWhole + marginWhole.top + marginWhole.bottom)
        .append("g")
        .attr("transform", `translate(${marginWhole.left},${marginWhole.top})`);



    const allVar = [
        "engine_size",
        "horsepower",
        "peak_rpm",
        "city_mpg",
        "highway_mpg",
        "price",
        "compression_ratio",
        "curb_weight",
        // "height",
        // "length",
        // "wheel_base"
    ]
    const numVar = allVar.length


    mar = 30
    size = sizeWhole / numVar


    // ----------------- //
    // Scales
    // ----------------- //

    // Create a scale: gives the position of each pair each variable
    const position = d3.scalePoint()
        .domain(allVar)
        .range([0, sizeWhole - size])


    // ------------------------------- //
    // Add charts and histograms
    // ------------------------------- //
    for (let i = 0; i < allVar.length; ++i) {
        for (let j = 0; j < allVar.length; ++j) {

            // Get current variable name
            let var1 = allVar[i]
            let var2 = allVar[j]

            // If var1 == var2 it's on the diagonal, add histograms
            if (var1 === var2) {
                // create X Scale
                xextent = d3.extent(filteredData, function (d) { return +d[var1] })
                const x = d3.scaleLinear()
                    .domain(xextent).nice()
                    .range([0, size - 2 * mar]);

                // Add a 'g' at the right position
                const tmp = svg
                    .append('g')
                    .attr("transform", `translate(${position(var1) + mar},${position(var2) + mar})`)
                    .attr("id", `${var1}_${var2}`);  // add id for each histogram

                // Add x axis
                tmp.append("g")
                    .attr("transform", `translate(0,${size - mar * 2})`)
                    .call(d3.axisBottom(x).ticks(3));

                // set the parameters for the histogram
                const histogram = d3.histogram()
                    .value(function (d) { return +d[var1]; })
                    .domain(x.domain())
                    .thresholds(x.ticks(15));

                // And apply this function to data to get the bins
                const bins = histogram(filteredData);

                // Y axis: scale and draw:
                const y = d3.scaleLinear()
                    .range([size - 2 * mar, 0])
                    .domain([0, d3.max(bins, function (d) { return d.length; })]);

                // append the bar rectangles to the svg element
                tmp.append('g')
                    .selectAll("rect")
                    .data(bins)
                    .join("rect")
                    .attr("x", 1)
                    .attr("transform", d => `translate(${x(d.x0)},${y(d.length)})`)
                    .attr("width", function (d) { return x(d.x1) - x(d.x0); })
                    .attr("height", function (d) { return (size - 2 * mar) - y(d.length); })
                    .style("fill", "#b8b8b8")
                    .attr("stroke", "white")
            } else if (i < j) {
                // Below diagonal: create scatter plot
                // Add X Scale of each graph
                xextent = d3.extent(filteredData, function (d) { return +d[var1] })
                const x = d3.scaleLinear()
                    .domain(xextent).nice()
                    .range([0, size - 2 * mar]);

                // Add Y Scale of each graph
                yextent = d3.extent(filteredData, function (d) { return +d[var2] })
                const y = d3.scaleLinear()
                    .domain(yextent).nice()
                    .range([size - 2 * mar, 0]);

                // Add a 'g' at the right position
                const tmp = svg
                    .append('g')
                    .attr("transform", `translate(${position(var1) + mar},${position(var2) + mar})`)
                    .attr("id", `${var1}_${var2}`)  // add id for each scatter plot
                    .on("mouseover", e => {
                        d3.select(`#${var2}_${var1}`)
                            .select("text")
                            .attr("style", "fill: #FFDF00");
                        d3.select(`#${var1}_${var1}`)
                            .selectAll("rect")
                            .attr("style", "fill: #FFDF00");
                        d3.select(`#${var2}_${var2}`)
                            .selectAll("rect")
                            .attr("style", "fill: #FFDF00");
                    })
                    .on("mouseout", e => {
                        d3.select(`#${var2}_${var1}`)
                            .select("text")
                            .attr("style", "fill: black");
                        d3.select(`#${var1}_${var1}`)
                            .selectAll("rect")
                            .attr("style", "fill: #b8b8b8");
                        d3.select(`#${var2}_${var2}`)
                            .selectAll("rect")
                            .attr("style", "fill: #b8b8b8");
                    });

                tmp.append("rect")
                    .attr("x", -mar)
                    .attr("width", size - mar)
                    .attr("height", size - mar)
                    .attr("fill", "transparent");

                // Add X and Y axis in tmp
                tmp.append("g")
                    .attr("transform", `translate(0,${size - mar * 2})`)
                    .call(d3.axisBottom(x).ticks(3));
                tmp.append("g")
                    .call(d3.axisLeft(y).ticks(3));

                // Add circle
                tmp
                    .selectAll("myCircles")
                    .data(filteredData)
                    .join("circle")
                    .attr("cx", function (d) { return x(+d[var1]) })
                    .attr("cy", function (d) { return y(+d[var2]) })
                    .attr("r", 3)
                    .attr("fill", "black")
            } else {
                // Above diagonal: Pearson correlation coefficient
                const corr = pearsonCorrelation(filteredData, var1, var2);
                const tmp = svg
                    .append('g')
                    .attr("transform", `translate(${position(var1) + mar},${position(var2) + mar})`)
                    .attr("id", `${var1}_${var2}`);  // add id for each value;
                tmp.append("text")
                    .attr("class", "correlation")
                    .attr("x", size / 2 - mar)
                    .attr("y", size / 2 - mar)
                    .text(corr.toFixed(2));
            }
        }
    }

    // ------------------------------- //
    // Add labels
    // ------------------------------- //

    // horizontal label axis
    svg
        .append("g")
        .attr("class", "labels")
        .attr("transform", `translate(${size / 2}, 0)`)      // This controls the vertical position of the Axis
        .call(d3.axisTop(position))
        .selectAll("path,line").remove();

    const axisY = svg
        .append("g")
        .attr("class", "labels")
        .attr("transform", `translate(-20, ${size / 2 - mar})`)       // This controls the vertical position of the Axis
        .call(d3.axisLeft(position));

    axisY
        .selectAll("path,line")
        .remove();
    axisY
        .selectAll("text")
        .attr("transform", `rotate(-90)`)


    // ------------------------------- //
    // Make it sortable
    // ------------------------------- //
    const defaultRank = allVar.map((v, i) => i);
    const alphabetaRank = defaultRank.sort((a, b) => -allVar[a].localeCompare(allVar[b]));
    const reversedRank = alphabetaRank.slice().reverse();
    console.log(alphabetaRank, reversedRank)
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            if (this.checked) {
                checkboxes.forEach(cb => {
                    if (cb !== this) cb.checked = false;
                });

                d3.selectAll(".labels").remove();

                if (this.value === "default") {
                    for (let i = 0; i < allVar.length; ++i) {
                        for (let j = 0; j < allVar.length; ++j) {
                            const var1 = allVar[i];
                            const var2 = allVar[j];
                            d3.select(`#${var1}_${var2}`)
                                .attr("transform", `translate(${position(var1) + mar},${position(var2) + mar})`);
                        }
                    }
                    // update label axis
                    svg
                        .append("g")
                        .attr("class", "labels")
                        .attr("transform", `translate(${size / 2}, 0)`)      // This controls the vertical position of the Axis
                        .call(d3.axisTop(position))
                        .selectAll("path,line").remove();

                    const axisY = svg
                        .append("g")
                        .attr("class", "labels")
                        .attr("transform", `translate(-20, ${size / 2 - mar})`)       // This controls the vertical position of the Axis
                        .call(d3.axisLeft(position));

                    axisY
                        .selectAll("path,line")
                        .remove();
                    axisY
                        .selectAll("text")
                        .attr("transform", `rotate(-90)`)
                } else if (this.value === "alphabeta") {
                    const newPosition = d3.scalePoint()
                        .domain(allVar.map((v, i) => allVar[alphabetaRank[i]]))
                        .range([0, sizeWhole - size]);
                    for (let i = 0; i < allVar.length; ++i) {
                        for (let j = 0; j < allVar.length; ++j) {
                            const var1 = allVar[alphabetaRank[i]];
                            const var2 = allVar[alphabetaRank[j]];
                            if ((i <= j && alphabetaRank[i] <= alphabetaRank[j]) || (i >= j && alphabetaRank[i] >= alphabetaRank[j])) {
                                d3.select(`#${var1}_${var2}`)
                                    .attr("transform", `translate(${newPosition(var1) + mar},${newPosition(var2) + mar})`);
                            } else {
                                d3.select(`#${var2}_${var1}`)
                                    .attr("transform", `translate(${newPosition(var1) + mar},${newPosition(var2) + mar})`);
                            }
                        }
                    }
                    // update label axis
                    svg
                        .append("g")
                        .attr("class", "labels")
                        .attr("transform", `translate(${size / 2}, 0)`)      // This controls the vertical position of the Axis
                        .call(d3.axisTop(newPosition))
                        .selectAll("path,line").remove();

                    const axisY = svg
                        .append("g")
                        .attr("class", "labels")
                        .attr("transform", `translate(-20, ${size / 2 - mar})`)       // This controls the vertical position of the Axis
                        .call(d3.axisLeft(newPosition));

                    axisY
                        .selectAll("path,line")
                        .remove();
                    axisY
                        .selectAll("text")
                        .attr("transform", `rotate(-90)`)
                } else if (this.value === "reversed") {
                    const newPosition = d3.scalePoint()
                        .domain(allVar.map((v, i) => allVar[reversedRank[i]]))
                        .range([0, sizeWhole - size]);
                    for (let i = 0; i < allVar.length; ++i) {
                        for (let j = 0; j < allVar.length; ++j) {
                            const var1 = allVar[reversedRank[i]];
                            const var2 = allVar[reversedRank[j]];
                            if ((i <= j && reversedRank[i] <= reversedRank[j]) || (i >= j && reversedRank[i] >= reversedRank[j])) {
                                d3.select(`#${var1}_${var2}`)
                                    .attr("transform", `translate(${newPosition(var1) + mar},${newPosition(var2) + mar})`);
                            } else {
                                d3.select(`#${var2}_${var1}`)
                                    .attr("transform", `translate(${newPosition(var1) + mar},${newPosition(var2) + mar})`);
                            }
                        }
                    }
                    // update label axis
                    svg
                        .append("g")
                        .attr("class", "labels")
                        .attr("transform", `translate(${size / 2}, 0)`)      // This controls the vertical position of the Axis
                        .call(d3.axisTop(newPosition))
                        .selectAll("path,line").remove();

                    const axisY = svg
                        .append("g")
                        .attr("class", "labels")
                        .attr("transform", `translate(-20, ${size / 2 - mar})`)       // This controls the vertical position of the Axis
                        .call(d3.axisLeft(newPosition));

                    axisY
                        .selectAll("path,line")
                        .remove();
                    axisY
                        .selectAll("text")
                        .attr("transform", `rotate(-90)`)
                }
            }
        });
    });





    // here to control the values when switch triggered
    document.getElementById('correlationSwitch').addEventListener('change', function () {
        if (this.checked) {
            console.log('Switched to Spearman Correlation');
            for (let i = 0; i < allVar.length; ++i) {
                for (let j = 0; j < allVar.length; ++j) {
                    if (i > j) {
                        var1 = allVar[i];
                        var2 = allVar[j];
                        const corr = spearmanCorrelation(filteredData, var1, var2);
                        d3.select(`#${var1}_${var2}`)
                            .select("text")
                            .text(corr.toFixed(2));
                    }
                }
            }
        } else {
            console.log('Switched to Pearson Correlation');
            for (let i = 0; i < allVar.length; ++i) {
                for (let j = 0; j < allVar.length; ++j) {
                    if (i > j) {
                        var1 = allVar[i];
                        var2 = allVar[j];
                        const corr = pearsonCorrelation(filteredData, var1, var2);
                        d3.select(`#${var1}_${var2}`)
                            .select("text")
                            .text(corr.toFixed(2));
                    }
                }
            }
        }
    });

});


