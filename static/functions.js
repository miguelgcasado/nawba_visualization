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
   console.log(typeof(selectedFamily))
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
    console.log(mbidsInNawbas)
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
  console.log(listOfSections)
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

function plotScoreWithPatterns(selectedMbid, selectedSection){
  /*Function that open new tab with corresponding score (with painted patterns)*/

  // send POST request to send the data of the selected mbid and section
  fetch('/define_score_parameters', {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({"selectedMbid": selectedMbid, "selectedSection": selectedSection}),
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
      }).catch(function (error) {
        console.log("Fetch error: " + error);
      });

  // send the request for the data to plot the network graph
  fetch('/plot_score')
  .then(function (response) {
      return 0;
  })
  window.open('/plot_score'); // open score in a new tab
};
