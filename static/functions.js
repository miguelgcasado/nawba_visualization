/* Scripts containing all functiones used on script.js*/

function removePatterns(){
  /* Function that removes patterns displayed in network graph*/

  d3.select("#sigma-container").html("");
};

function getCheckedBoxes(chkboxName) {
  /* Function that, given checbox name, return the list of selected checkbox*/

  var checkboxes = document.getElementsByName(chkboxName);
  var checkboxesChecked = [];

  for (var i=0; i<checkboxes.length; i++) {
     if (checkboxes[i].checked) {
        checkboxesChecked.push(checkboxes[i].defaultValue);
     }
  }

  return checkboxesChecked.length > 0 ? checkboxesChecked : " ";
};

function appendNawbaCheckBoxes(nawbaSelector, selectedFamily){
  /* Function that, given a list of the selected families, add radio buttons
   of the corresponding nawbas in the nawba selector panel*/
  if (typeof selectedFamily == "string"){}
  else{
    var nawbasToShow = []; // get list of nawbas inside the selected families
    for (i = 0; i < selectedFamily.length; i++){
      nawbasToShow.push(familyNawbas[selectedFamily[i]])
    }
    nawbasToShow = [].concat.apply([], nawbasToShow);

    nawbaSelector.selectAll("label") // add nawba radio buttons from nawbasToShow list
    .data(nawbasToShow)
    .enter()
    .append("label")
    .style("color", function(d){return mappingNawbaColor[d]})
    .text(function(d) {return d + " (" + idNawbaName[d] + ")"})
    .append("input")
    .attr("type", "checkbox")
    .attr("name", "checkbnawba")
    .attr("id", function(d){return idNawbaName[d]})
    .attr("value", function(d){return d})
    .attr("style", "float:left")
  }
};

function addMbidsToDropDown(familyNawbaMbid, selectedAlgorithms, selectedFamily, selectedNawbas){
  /*Function that, given parameters, add corresponding mbids to the dropdown menu*/
  var mbidsInNawbas = [];
  if (selectedAlgorithms != [] && selectedNawbas != []){
    for (i = 0; i < selectedFamily.length; i++){
      for (j = 0; j < selectedNawbas.length; j++){
        mbidsInNawbas.push(familyNawbaMbid[selectedFamily[i]][selectedNawbas[j]]);
      }
    }
    mbidsInNawbas = [].concat.apply([], mbidsInNawbas)
    // console.log(mbidsInNawbas)
    var mbidsToShow = [];
    for (i = 0; i < mbidsInNawbas.length; i++){
      if (mbidsInNawbas[i] != null){
        if (mbidsInNawbas[i][0] != null){
          mbidsToShow.push(mbidsInNawbas[i][0]);
        }
      }
    }

    d3.select("#selectMbidButton")
      .selectAll('myOptions')
      .data(mbidsToShow)
      .enter()
      .append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; })
    }
    return mbidsToShow[0]
};

function addSectionsToDropDown(mbidSections, selectedMbid){
  /*Function that, given parameters, add corresponding sections to the dropdown menu*/
  var listOfSections = ["All score"]
  listOfSections = listOfSections.concat(Object.keys(mbidSections[selectedMbid]));
  // console.log(listOfSections)
  d3.select("#selectSectionButton")
    .selectAll('myOptions')
    .data(listOfSections)
    .enter()
    .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; })

  return listOfSections[0]
};

function createGraphDict(nodesEdges){
  /*Function that transform obtained dict from python to right format to be represented by sigma JS*/
  var g = {nodes: [],edges: []} // save the received data into a dictionary
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
      label: "P" + (i+1).toString(),
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
  return g;
};

function plotNetwork(nodesEdges){
  var g = createGraphDict(nodesEdges); // generate dictionary with graph data (nodes and edges)
  // console.log(g)
  s = new sigma({ // create sigmajs graph from dictionary
    graph: g,
    renderer: {
      // IMPORTANT:
      // This works only with the canvas renderer, so the
      // renderer type set as "canvas" is necessary here.
      container: document.getElementById('sigma-container'),
      type: sigma.renderers.canvas,
    },
    settings: {
         defaultLabelSize: 30,
         drawLabels: false,
         singleHover: true,
         //labelThreshold: 12,
         // defaultLabelColor: "#FFF",
         // borderSize: 0.5,
         // defaultNodeBorderColor: 'black',
         zoomingRatio: 2,
         zoomMax: 5
    }
  });
   s.bind('clickNode', function(e) { // play wav file when clicking on each node
     var pattern = e.data.node.id;
     if (e.data.node.id.includes('#')){ // might be errors qhen '#' in filename
       var pattern = e.data.node.id.replace('#','x');
     }
     var path = '../static/data/patterns/' + e.data.node.algorithm + '/' + e.data.node.nawba + '/' + pattern + '.wav'
     // console.log(path)
     new Audio(path).play();
   });
    s.refresh();
    var patternsToPlot = []
    for (i = 0; i < g.nodes.length ; i++){
      patternsToPlot.push([g.nodes[i].id, g.nodes[i].label, g.nodes[i].nawba])
    }
    console.log(patternsToPlot)
    return patternsToPlot
};

function plotGraphPostProcess(selectedAlgorithms, selectedNawbas){
  var jsonToSendBackEnd = {"selectedAlgorithms": selectedAlgorithms, "selectedNawbas": selectedNawbas};

  // send POST request to send the data of the selected algorithms and nawbas
  var patternsToPlot = fetch('/plot_graph', {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(jsonToSendBackEnd),
    cache: "no-cache",
    headers: new Headers({
      "content-type": "application/json",
      'Accept': 'application/json'
    })
  }).then(function (response) {
        return response.json();
      }).then(function(nodesEdges){
        var patternsToPlot = plotNetwork(nodesEdges);
        console.log(patternsToPlot)
        return patternsToPlot;
      }).catch(function (error) {
        console.log("Fetch error: " + error);
      });

  return patternsToPlot;
};

function plotScoreWithPatterns(patternsToPlot, selectedMbid, selectedSection){
  /*Function that open new tab with corresponding score (with painted patterns)*/

  // send POST request to send the data of the selected mbid and section
  fetch('/plot_score', {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({"patternsToPlot": patternsToPlot, "selectedMbid": selectedMbid, "selectedSection": selectedSection}),
    cache: "no-cache",
    headers: new Headers({
      "content-type": "application/json",
      'Accept': 'application/json'
    })
  }).then(function (response) {
        if (response.status !== 200) {
          console.log(`Looks like there was a problem. Status code: ${response.status}`);
          return;
        }
        else{
          window.open('/plot_score'); // open score in a new tab
        }
      }).catch(function (error) {
        console.log("Fetch error: " + error);
      });

};
