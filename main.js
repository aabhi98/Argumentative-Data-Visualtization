var apple_vs_android;

// This function is called once the HTML page is fully loaded by the browser
document.addEventListener('DOMContentLoaded', function () {
    // Hint: create or set your svg element inside this function
     
    // This will load your two CSV files and store them into two arrays.
    Promise.all([d3.csv('data/apple_vs_android.csv')])
         .then(function (values) {
  
             apple_vs_android = values[0].map((i) => {
                 return {
                     Device: i["Device"],
                     CPU: +i["CPU"],
                     GPU: +i["GPU"],
                     MEM: +i["MEM"],
                     UX: +i["UX"],
                     Total_score: +i["Total Score"],
                     Brand: i["Brand"],
                 };
             }).slice(0, 70);
 
             console.log(apple_vs_android);
             createGroupedBarChart();
             createBubbleChart();
         });
 });

 function createGroupedBarChart() {

    // Get the dimensions of the div
    var divWidth = document.getElementById("left").offsetWidth;
    var divHeight = document.getElementById("left").offsetHeight;

    // Define the width, height and margin of the chart
    var margin = { top: 20, right: 20, bottom: 80, left: 60 },
        width = divWidth - margin.left - margin.right,
        height = divHeight - margin.top - margin.bottom;

    // Create the SVG element and set its dimensions
    var svg = d3.select("#left")
        .append("h4")
        .text("Apple products are best")
        .append("svg")
        .attr("id", "left-chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    // Define the x and y scales and axes
    var x = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.1)
        .domain(apple_vs_android.map(function(d) { return d.Device; }));

    var y = d3.scaleLinear()
        .rangeRound([height, 0])
        .domain([0, d3.max(apple_vs_android, function(d) { return d.Total_score; })]);

    var xAxis = d3.axisBottom(x);

    var yAxis = d3.axisLeft(y);

    // Create a color scale for the two brands
    var color = d3.scaleOrdinal()
        .range(["#C5C5C5", "#00FF00"]);

    // Add the x and y axes to the chart
    svg.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")
    .attr("y", 0)
    .attr("x", -10)
    .attr("dy", ".35em")
    .attr("transform", "rotate(-270)")
    .style("text-anchor", "end")
    .style("fill", "white");
 
 svg.append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", height + 35)
    .attr("text-anchor", "middle")
    .style("fill", "white")
    .text("Device");

 svg.append("text")
    .attr("class", "chart-caption")
    .attr("x", width / 2)
    .attr("y", height + 58)
    .attr("text-anchor", "middle")
    .style("fill", "white")
    .style("font-size", "14px")
    .text("Caption: The Total score for an Apple product is highest compared to Android");

svg.append("text")
    .attr("class", "axis-label")
    .attr("x", -365)
    .attr("y", -50)
    .attr("dy", "1em")
    .attr("text-anchor", "middle")
    .style("fill", "white")
    .attr("transform", "rotate(-90)")
    .text("Score");
 
svg.append("g")
    .attr("class", "axis y-axis")
    .call(yAxis);
 

    // Add the details box to the chart
    var tooltip = d3.select("body").append("div")
    .style("visibility", "hidden")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("background-color", "white")
    .style("text-align", "center")
    .style("padding", "6px")
    .style("border-radius", "4px")
    .style("font-size", "12px")
    .style("border", "2px solid black")
    .style("color", "black");

// Add the bars to the chart
svg.selectAll(".bar")
    .data(apple_vs_android)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.Device); })
    .attr("y", function(d) { return y(d.Total_score); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d.Total_score); })
    .attr("fill", function(d) { return d3.rgb(color(d.Brand)).brighter(0.5); })
    .attr("opacity", 0.5)
    .on("mouseover", function(event,d) {
        // Highlight the bar
        d3.select(this)
          .attr("opacity", 1)
          .attr("stroke-width", "2px")
          .attr("stroke", "black");

        tooltip.html("Device:" + d.Device + "<br>" + "Total Score:" + d.Total_score);
        return tooltip.style("visibility", "visible");
      })
      .on("mousemove", function(event) {
          return tooltip.style("left", (event.pageX - 60) + "px")
              .style("top", (event.pageY + 10) + "px");
      })
      .on("mouseout", function() {
        // Make the bar normal
        d3.select(this)
          .attr("opacity", 0.5)
          .attr("stroke-width", "0px");

        return tooltip.style("visibility", "hidden");
      });

// Add a legend to the chart
var legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(" + (width - 100) + "," + 20 + ")");

var legendData = ["Apple", "Android"];

legend.selectAll(".legend-item")
    .data(legendData)
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr("transform", function(d, i) { return "translate(0," + (i * 20) + ")"; })
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", function(d) { return color(d); });

legend.selectAll(".legend-item")
    .append("text")
    .attr("x", 15)
    .attr("y", 10)
    .text(function(d) { return d; })
    .style("font-size", "12px")
    .style("fill", "white");


}

function createBubbleChart() {
    // Get the dimensions of the right div
    var divWidth = document.getElementById("right").offsetWidth;
    var divHeight = document.getElementById("right").offsetHeight;

    // Define the width, height, and margin of the chart
    var margin = { top: 20, right: 20, bottom: 80, left: 60 },
        width = divWidth - margin.left - margin.right,
        height = divHeight - margin.top - margin.bottom;

    // Create the SVG element and set its dimensions
    var svg = d3.select("#right")
        .append("h4")
        .text("Android's UX is better")
        .append("svg")
        .attr("id", "right-chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create a color scale for the two brands
    var color = d3.scaleOrdinal()
        .range(["#C5C5C5", "#00FF00"]);

    // Define the x and y scales and axes
    var x = d3.scaleLinear()
        .domain([d3.min(apple_vs_android, function(d) { return d.CPU; }), d3.max(apple_vs_android, function(d) { return d.CPU; })])
        .range([0, width]);

    var y = d3.scaleLinear()
        .domain([d3.min(apple_vs_android, function(d) { return d.UX; }), d3.max(apple_vs_android, function(d) { return d.UX; })])
        .range([height, 0]);

    var xAxis = d3.axisBottom(x);

    var yAxis = d3.axisLeft(y);

// Add the x and y axes to the chart
svg.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg.append("text")
    .attr("class", "axis-label")
    .attr("transform", "translate(" + (width / 2) + "," + (height + margin.bottom - 40) + ")")
    .style("text-anchor", "middle")
    .text("CPU Score")
    .attr("fill", "white");

svg.append("text")
    .attr("class", "chart-caption")
    .attr("x", width / 2)
    .attr("y", height + 58)
    .attr("text-anchor", "middle")
    .style("fill", "white")
    .style("font-size", "14px")
    .text("Caption: The user experience of the Android is much better than Apple");

svg.append("g")
    .attr("class", "axis y-axis")
    .call(yAxis);

svg.append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - (height / 2))
    .attr("y", 0 - margin.left)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("UX Score")
    .attr("fill", "white");


    // Add the details box to the chart
    var tooltip = d3.select("body").append("div")
    .style("visibility", "hidden")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("background-color", "white")
    .style("text-align", "center")
    .style("padding", "6px")
    .style("border-radius", "4px")
    .style("font-size", "12px")
    .style("border", "2px solid black")
    .style("color", "black")
    .style("width", "150px");

// Define the size scale for the bubbles
var size = d3.scaleLinear()
    .domain([d3.min(apple_vs_android, function(d) { return d.MEM; }), d3.max(apple_vs_android, function(d) { return d.MEM; })])
    .range([5, 20]);

// Add the bubbles to the chart
svg.selectAll("circle")
    .data(apple_vs_android)
    .enter()
    .append("circle")
    .attr("cx", function(d) { return x(d.CPU); })
    .attr("cy", function(d) { return y(d.UX); })
    .attr("r", function(d) { return size(d.MEM); })
    .style("fill", function(d) { return color(d.Brand); })
    .style("opacity", 0.5)
    .on("mouseover", function(event,d) {
        // Add a border and increase opacity when the mouse hovers over a circle
        d3.select(this)
            .style("opacity", 1)
            .attr("stroke", "black")
            .attr("stroke-width", "2px");
    
        // Show the tooltip
        tooltip.html(d.Device + "<br>" + "CPU: " + d.CPU + "<br>" + "UX: " + d.UX + "<br>" + "Memory: " + d.MEM)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 10) + "px");
    
        return tooltip.style("visibility", "visible");
    })
    .on("mousemove", function(event) {
        // Move the tooltip with the mouse
        return tooltip.style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 10) + "px");
    })
    .on("mouseout", function(d) {
        // Remove the border and return opacity to normal when the mouse leaves the circle
        d3.select(this)
            .style("opacity", 0.5)
            .attr("stroke-width", "0px");
    
        // Hide the tooltip
        return tooltip.style("visibility", "hidden");
    });    
                        
// Add a legend to the chart
var legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(" + (width - 100) + "," + 20 + ")");

var legendData = ["Apple", "Android"];

legend.selectAll(".legend-item")
    .data(legendData)
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr("transform", function(d, i) { return "translate(0," + (i * 20) + ")"; })
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", function(d) { return color(d); });

legend.selectAll(".legend-item")
    .append("text")
    .attr("x", 15)
    .attr("y", 10)
    .text(function(d) { return d; })
    .style("font-size", "12px")
    .style("fill", "white");

            
}
