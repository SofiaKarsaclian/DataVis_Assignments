document.addEventListener('DOMContentLoaded', function () {
    const parseDate = d3.timeParse("%Y-%m-%d");
    data.forEach(d => {
        d.date = parseDate(d.date);
        d.close = +d.close;
    });

    const margin = { top: 20, right: 150, bottom: 50, left: 50 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([d3.min(data, d => d.close), d3.max(data, d => d.close)])
        .range([height, 0]);

    const color = d3.scaleOrdinal(d3.schemeCategory10)
        .domain([...new Set(data.map(d => d.Name))]);

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    // X-axis label
    svg.append("text")
        .attr("transform", `translate(${width / 2},${height + margin.bottom - 10})`)
        .style("text-anchor", "middle")
        .text("Date");

    // Y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Closing Value");

    // Group data by date and sort by close value descending within each date
    const nestedData = d3.groups(data, d => d.date).map(([date, values]) => {
        values.sort((a, b) => b.close - a.close);
        return [date, values];
    });

    // Calculate the next biggest close value for areas
    const updatedData = nestedData.flatMap(([date, values]) => {
        return values.map((d, i) => ({
            ...d,
            y0: i < values.length - 1 ? values[i + 1].close : y.domain()[0]
        }));
    });

    const area = d3.area()
        .x(d => x(d.date))
        .y0(d => y(d.y0)) // the next biggest value
        .y1(d => y(d.close));

    // Draw areas for each category
    const categories = [...new Set(data.map(d => d.Name))];
    categories.forEach(category => {
        const categoryData = updatedData.filter(d => d.Name === category);

        svg.append("path")
            .datum(categoryData)
            .attr("fill", color(category))
            .attr("d", area);
    });

    // I don't understand where do the white gaps come from

    // Legend
    const legend = svg.selectAll(".legend")
        .data(categories)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(0,${i * 20})`);

    legend.append("rect")
        .attr("x", width + 10)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", d => color(d));

    legend.append("text")
        .attr("x", width + 34)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(d => d);
});
