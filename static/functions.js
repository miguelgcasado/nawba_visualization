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

function appendNawbaRadioButtons(nawbaSelector, selectedFamily){
  /* Function that, given a list of the selected families, add radio buttons
   of the corresponding nawbas in the nawba selector panel*/

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
  .attr("style", "float:right")
};

function addMbidsToDropDown(familyNawbaMbid, selectedAlgorithms, selectedFamily, selectedNawbas){
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

    d3.select("#selectButton")
      .selectAll('myOptions')
      .data(mbidsToShow)
      .enter()
      .append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; })
    }
};

function createGraphDict(nodesEdges){
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
