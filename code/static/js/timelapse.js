function timetables(transcript){
    data = JSON.parse(transcript)

    var duration = data[data.length - 1].end

    var margin = {top: 10, right: 30, bottom: 30, left: 40},
        width = 1000 - margin.left - margin.right,
        height = 160 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg1 = d3.select("#d3_1")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
        .range([ 0, width ])
        .domain([ 0, duration ]);
    svg1.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    svg1.append("text")
            .attr("x", width - margin.right + 10)
            .attr("y", height + margin.top + 19)
            .text("Tiempo")
            .style("font-size", "13px");

    var tooltip = d3.select("#d3_1")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px");

    var mouseover = function(d,i) {
        var text = i.text
        var start = setTimeFormat(String(i.start))
        var end = setTimeFormat(String(i.end))
        tooltip.html(
            "Texto: " + text + "<br>" + "Inicio: " + start + "<br>" + "Fin: " + end
        )
        .style("opacity", 1);
    }

    var mousemove = function(d) {
        tooltip
          .style("left", (d3.pointer(this)[0]+90) + "px")
          .style("top", (d3.pointer(this)[1]) + "px")
    }
    var mouseleave = function(d) {
        tooltip
          .style("opacity", 0)
    }

    var boxHeight = 40
    svg1
        .selectAll("boxes")
        .data(data)
        .enter()
        .append("rect")
            .attr("x", (d, i) => {return x(data[i].start)})
            .attr("y", 50)
            .attr("height", boxHeight)
            .attr("width", (d,i) => {
                let time_lapse = data[i].end - data[i].start
                return x(time_lapse)
            })
            .attr('stroke', 'black')
            .attr('fill', '#69a3b2')
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);

}


function setTimeFormat(time) {
    time = parseInt(time)
    let minutes = Math.floor(time /60);
    let seconds = Math.floor(time - minutes *60);
    let timeString = `${minutes}:${seconds}`
    return timeString
}

function objectTables(objetos){
    data = JSON.parse(objetos)

    var sumstat = d3.group(data, d => d.objeto)

    var conf_data = []

    var endtime = []


    for (let i = 0; i < data.length; i++) {
        let temp1 = parseFloat(data[i].conf)
        conf_data.push(temp1)
        let temp2 = parseInt(data[i].cierre)
        endtime.push(temp2)
    }

    var res = Array.from(sumstat.keys());

    const max_confidence = Math.ceil(Math.max(...conf_data))

    var duration = Math.max(...endtime)

    var groupedData = res.map(function (d){
        return {
            name: d,
            values: data.filter(item => item.objeto === d)
        }
    });

    var margin = {top: 10, right: 30, bottom: 30, left: 40},
        width = 1000 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var colorScale = d3.scaleOrdinal()
        .domain(res) // use the objects array as the domain
        .range(d3.schemeCategory10); // or any other color scheme

    var svg2 = d3.select("#d3_2")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var x2 = d3.scaleLinear()
        .range([ 0, width ])
        .domain([ 0, duration ]);
    svg2.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x2));

    svg2.append("text")
            .attr("x", width - margin.right + 10)
            .attr("y", height + margin.top + 19)
            .text("Tiempo")
            .style("font-size", "13px");

    var y = d3.scaleLinear()
        .domain( [0 , max_confidence])
        .range([ height, 0 ]);
    svg2.append("g")
        .call(d3.axisLeft(y));

    svg2.append("text")
        .attr("x", -margin.left)
        .attr("y", height - 290)
        .text("Confiabilidad")
        .style("font-size", "13px")
        .style("text-anchor", "middle")
        .attr("transform", "rotate(-90)");

    var tooltip_2 = d3.select("#d3_2")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")

    var mouseover_2 = function(d,i) {
        var obj = d.objeto
        var inicio = setTimeFormat(String(d.inicio))
        var cierre = setTimeFormat(String(d.cierre))
        var conf = d.conf
        tooltip_2.html(
            "Objeto: " + obj + "<br>" + "Inicio: " + inicio + "<br>" + "Cierre: " + cierre + "<br>" + "Confiabilidad: " + conf)
        .style("opacity", 1)
    }

    var mousemove_2 = function(d,i) {
        tooltip_2
          .style("left", (d3.pointer(this)[0]+90) + "px")
          .style("top", (d3.pointer(this)[1]) + "px")
    }
    var mouseleave_2 = function(d,i) {
        tooltip_2
          .style("opacity", 0)
    }

    var lineGen = d3.line()
        .x(function(d){
            return x2(d.inicio);
        })
        .y(function(d){
            return y(d.conf);
        });

    groupedData.forEach(function(d, i){
        svg2.append("path")
            .attr('d', lineGen(d.values))
            .attr('stroke', colorScale(d.name))
            .attr('stroke-width', 1.5)
            .attr('fill', 'none')
    });

    groupedData.forEach(function(d, i){
        d.values.forEach(function(point) {
          svg2.append("circle")
            .attr("cx", x2(point.inicio))
            .attr("cy", y(point.conf))
            .attr("r", 5) // tamaño del círculo
            .attr("fill", colorScale(d.name))
            .attr("stroke", "none")
            .on("mouseover", function(d) { mouseover_2(point); })
            .on("mousemove", function(d) { mousemove_2(point); })
            .on("mouseleave", function(d) { mouseleave_2(point); })
        });
    });
    
    /*groupedData.selectAll("circle")
        .on("mouseover", mouseover_2)
        .on("mousemove", mousemove_2)
        .on("mouseleave", mouseleave_2);*/

/*
    svg2.selectAll("path")
        .data(sumstat)
        .join("path")
            .attr('fill', 'none')
            .attr('stroke-width', 1.5)
            .attr('stroke', d => colorScale(d[0]))
            .attr("d", d => {
                return d3.line()
                    .x(d => x2(d.inicio))
                    .y(d => y(d.conf))
                    (d[1])
            });
*/

    
/*
    svg2.append("g")
     .selectAll("dot")
     .data(groupedData)
     .enter()
     .append("circle")
        .attr("cx", (d,i) => {return x2(d.values[i].inicio)})
        .attr("cy", (d,i) => {return y(d.values[i].conf)})
        .attr("r", 5)
        .attr("fill", (d,i) => colorScale(d.name))
        .on("mouseover", mouseover_2)
        .on("mousemove", mousemove_2)
        .on("mouseleave", mouseleave_2);*/
}