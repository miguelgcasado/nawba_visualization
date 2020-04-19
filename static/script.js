/* MAIN TREE*/
var centered;
var treeHeight = 700;
var treeWidth = 840;

var familyNawbas = {"dhil" : ["4", "5", "10"], "zaydan": ["2", "6", "8", "9", "11"], "maya": ["1", "3"], "mzmum": ["7"]}
var idNawbaName = {"1": "raml al-m ̄aya",
                  "2": "al-isbah ̄an",
                  "3": "al-m ̄aya",
                  "4": "rasd al-d ̄ayl",
                  "5": "al-istihl ̄al",
                  "6": "al-rasd",
                  "7": "gar ̄ibat al-h.usayn",
                  "8": "al-h.iˆy ̄az al-kab ̄ir",
                  "9": "al-h.iˆy ̄az al-m ̄ašriq ̄i",
                  "10": "‘ir ̄aq al-‘aˆyam",
                  "11": "al-‘ušš ̄aq"};

  var mappingNawbaColor = {"1": "#FFFF66",
                "2": "#87CEEB",
                "3": "#CCCC00",
                "4": "#F08080",
                "5": "#B22222",
                "6": "#00BFFF",
                "7": "#494B4B",
                "8": "#0000FF",
                "9": "#4682B4",
                "10": "#FF0000",
                "11": "#7B68EE"};
/*******************************************************UTILS***************************************************************/
// Set svg zoomable
var svg = d3.select("svg")

svg.attr('height', treeHeight)
   .attr('width', treeWidth)
   .call(d3.zoom()
    .scaleExtent([1, 5])
    .on("zoom", function () {
       svg.attr("transform", d3.event.transform)
    }));

// Remove button
function removePatterns(){
  var allCircles = svg.selectAll("#littleCircle")
  allCircles.remove()
  var allSquares = svg.selectAll("rect")
  allSquares.remove()
  var allStars = svg.selectAll("#littleStars")
  allStars.remove()
};

function getCheckedBoxes(chkboxName) {
    var checkboxes = document.getElementsByName(chkboxName);
    var checkboxesChecked = [];
    for (var i=0; i<checkboxes.length; i++) {
       if (checkboxes[i].checked) {
          checkboxesChecked.push(checkboxes[i].defaultValue);
       }
    }
    return checkboxesChecked.length > 0 ? checkboxesChecked : " ";
  }


// function that add radio buttons to the nawba selector
function addRadioButtons(selectedCircleId){
  var nawbaSelector = d3.select('div.nawba_selector');
  nawbaSelector.selectAll("label")
    .remove()

  nawbaSelector.selectAll("label")
    .data(familyNawbas[selectedCircleId])
    .enter()
    .append("label")
    .style("color", function(d){return mappingNawbaColor[d]})
    .text(function(d) {return d + " (" + idNawbaName[d] + ")"})
    .append("input")
    .attr("type", "radio")
    .attr("class", "option")
    .attr("name", "options")
    .attr("value", function(d){return d})
    /*.append("rect")
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", function(d){ return mappingNawbaColor[d]})*/

};

/***************************************************************MAIN*************************************************************/

//read json with all data
d3.json("../data/selector/family_nawba_mbid.json").then(function(familyNawbaMbid){
  var algorithmSelector= d3.selectAll(".algorithm_selector")
  algorithmSelector.on('change', function(d){
      removePatterns()
      var selectedAlgorithm = getCheckedBoxes("checkbalgorithm"); // get selected algorithm

      var familySelector = d3.selectAll(".family_selector");
      familySelector.on('change', function(d){
        var nawbaSelector = d3.selectAll('.nawba_chooser');
        nawbaSelector.selectAll("label")
          .remove()
        var selectedFamily = getCheckedBoxes("checkbfamily"); // get selected family

        var nawbasToShow = [];
        for (i = 0; i < selectedFamily.length; i++){
          nawbasToShow.push(familyNawbas[selectedFamily[i]])
        }
        nawbasToShow = [].concat.apply([], nawbasToShow);
        //console.log(nawbasToShow)
        nawbaSelector.selectAll("label")
        .data(nawbasToShow)
        .enter()
        .append("label")
        .style("color", function(d){return mappingNawbaColor[d]})
        .text(function(d) {return d + " (" + idNawbaName[d] + ")"})
        .append("input")
        .attr("type", "checkbox")
        .attr("name", "checkbnawba")
        .attr("id", idNawbaName[d])
        .attr("value", function(d){return d})
        .attr("style", "float:right")

        var nawbaChooser = d3.selectAll(".nawba_chooser");
        nawbaChooser.on('change', function(d){
          d3.selectAll('option').remove()
          d3.select("#sigma-container").html("");
          var selectedNawbas = getCheckedBoxes("checkbnawba"); // get selected nawbas
          var mbidsToShow = [];
          for (i = 0; i < selectedFamily.length; i++){
            for (j = 0; j < selectedNawbas.length; j++){
              var mbidsInNawbas = familyNawbaMbid[selectedFamily[i]][selectedNawbas[j]];
              for (k = 0; k < mbidsInNawbas.length; k++){
                  mbidsToShow.push(mbidsInNawbas[k][0]);
              }
            }
          }
          mbidsToShow = [].concat.apply([], mbidsToShow);
          //console.log(mbidsToShow)
          d3.select("#selectButton")
            .selectAll('myOptions')
            .data(mbidsToShow)
            .enter()
            .append('option')
            .text(function (d) { return d; }) // text showed in the menu
            .attr("value", function (d) { return d; })

          d3.json("../data/graph.json").then(function(nodesEdges, actualGraph){
            var g = {nodes: [],edges: []}
            for (i = 0; i < nodesEdges['nodes'].length; i++) {
              var node = {
                id: nodesEdges['nodes'][i]['id'],
                algorithm: nodesEdges['nodes'][i]['algorithm'],
                nawba: nodesEdges['nodes'][i]['nawba'],
                type: nodesEdges['nodes'][i]['type'],
                color: nodesEdges['nodes'][i]['color'],
                x: nodesEdges['nodes'][i]['x'],
                y: nodesEdges['nodes'][i]['y'],
                size: 5,
              };
              g.nodes.push(node)
          };
          for (i = 0; i < nodesEdges['edges'].length; i++) {
            g.edges.push({
            id: nodesEdges['edges'][i]['id'],
            source: nodesEdges['edges'][i]['source'],
            target: nodesEdges['edges'][i]['target'],
            weight: nodesEdges['edges'][i]['weight'],
            size: 0.1,
            color: 'black'
            });
          };

          s = new sigma({
            graph: g,
            renderer: {
              // IMPORTANT:
              // This works only with the canvas renderer, so the
              // renderer type set as "canvas" is necessary here.
              container: document.getElementById('sigma-container'),
              type: sigma.renderers.canvas,
            },
            settings: {
                 borderSize: 0.5,
                 defaultNodeBorderColor: 'black',
                 zoomingRatio: 2,
                 zoomMax: 5
            }
          });
           // s.graph.edges().forEach(function(e) {
           //   e.size = 0.01
           //   console.log(e)
           // });
           s.bind('clickNode', function(e) {
             new Audio('../data/patterns/' + e.data.node.algorithm + '/' + e.data.node.nawba + '/' + e.data.node.id + '.wav').play();
           });
          //CustomShapes.init(s);
          //s.startForceAtlas2({worker: true, barnesHutOptimize: false});
          s.refresh();

        });
      }); //nawba chooser
    });
  });
});
