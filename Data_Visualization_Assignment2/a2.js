﻿var daay = [];
// --- DO NOT CHANGE THIS CODE ---
d3.csv("https://cdn.rawgit.com/dakoop/3342a08ffaa77fef31c4cca759e6846d/raw/77f18f410caa1be8cf76831fe2b34b0ef88ca683/citibike-jan2018.csv", createVis);
// --- END ---

function createVis(errors, data) {
    // --- DO NOT CHANGE THIS CODE ---
    data = d3.nest()
        .key(x => x.day)
        .rollup(function (v) {
            return d3.nest().key(x => x.decade).rollup(vv => parseInt(vv[0].count)).object(v);
        })
        .entries(data)
        .map(function (d) {

            let dd = d.value;
            dd["day"] = d.key;
            daay.push(d.key);               // pushing all the days in daay
            var k = d.key;

            return dd;
        });



    // Call your own functions from here, or embed code here

    var svg = d3.select("svg");             // Selecting an SVG which has a height of 500 and width of 960
    svg.attr("transform", "translate(50,20)")
    var margin = { top: 20, right: 20, bottom: 50, left: 50 },      //creating an object named margin and decalring the top right bottom left space to be left for creating main G block
        width = +svg.attr("width") - margin.left - margin.right,   // Setting width by subtracting left and right margin 
        height = +svg.attr("height") - margin.top - margin.bottom,  // Setting height by subrtacting top and bottom of margin object
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");     //appending g tag to SVG and adding trasnform property.




    var x = d3.scaleBand()                      // Constructs a band scale
        .rangeRound([0, width])                 // Creates a scale from 0 to width



    var y = d3.scaleLinear()                //ScaleLinear for y axis values. Linear is used whenever it invloves numbers
        .rangeRound([height, 0]);           //Starts from above so height to 0

    var z = d3.scaleLinear(d3.interpolateBlues)             // defining colour range of blues from light blue to dark blue
        .domain([0, 800])
        .range(["#e6f9ff", "#0077b3"]);

    //.range(["#ffffff", "#e6ffff", "#e6f3ff", "#cce6ff", "#b3daff", "#66b5ff", "#0084ff","#3366ff","#000099"," #00004d"]); // Another way to add 10 colours manually 



    // X-Axis specification

    var days = daay;
    x.domain(days.map(function (d) {            // Mapping x-axis value from data to x-axis            
        return d;
    }));


    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));


    g.append("text")
        .attr("x", width / 2)
        .attr("y", height + 45)
        .text("Days")
        .attr("font-weight", "bold");




    var key = [-1, 10, 20, 30, 40, 50, 60, 70, 80, 130];
    var stack = d3.stack().keys(key);
    var stackdata = stack(data);
    y.domain([0, 800]);

    // yaxis speifications
    g.append("g")

        .call(d3.axisLeft(y).ticks(null, "s"))
        .append("text")
        .attr("fill", "#000")
        .attr("font-weight", "bold")


    g.append("text")
        .attr("x", -(height / 2))
        .attr("y", -35)
        .attr("transform", "scale(1,1)  rotate(-90) ")
        .text("Number of Bikes")
        .attr("font-weight", "bold");




    // Stacking the bar chart

    g.append("g")
        .attr("transform", "translate(5,0)")
        .selectAll("g")
        .data(stackdata)
        .enter().append("g")
        .attr("fill", function (d) {
            return z(d.key * 15);
        })           // A multipling factor to add more weight to the color     
        .selectAll("rect")                  //Creating bars
        .data(function (d) {
            return d;
        })
        .enter().append("rect")             // Appending bars w.r.t days 
        .attr('x', function (d) {
            return x(d.data.day);
        })
        .attr('y', function (d) {
            return y(d[1]);
        })
        .attr("height", function (d) {
            return y(d[0]) - y(d[1]);                 // Stacking data one on each other 
        })
        .attr("width", 20)
        .text(function (d) {
            return d;
        });



    // Creating legends

    var legend = g.append("g")
        .attr("font-weight", "bold")         //Setting attributes like font weight size and anchoring      
        .attr("text-anchor", "end")
        .attr("font-size", 12)
        .selectAll("g")
        .data(stackdata)
        .data(key.slice())
        .enter().append("g")
        .attr("transform", function (d, k) {            // Applying transform
            return "translate(18," + k * 22 + ")";
        });


    // Creating rectangles of legends and assiging them colours to them        
    legend.append("rect")
        .data(stackdata)
        .attr("x", width - 20)
        .attr("width", 20)
        .attr("height", 18)
        .attr("fill", function (d) {
            return z(d.key * 15)                              // Adding weights to colour

        });


    // Appending text to legends
    legend.append("text")
        .attr("x", width - 28)                      // Setting x attribute
        .attr("y", 14)                              // Setting y attribute
        .text(function (d) {
            return d;
        });

}




