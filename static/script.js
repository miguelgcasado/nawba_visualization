/***************************************************************MAIN*************************************************************/

//read json with all data (hierarchy: family -> nawba -> mbid)
d3.json("../static/data/selector/family_nawba_mbid.json").then(function(familyNawbaMbid){
  //read json with mbid -> sections -> offsets
  d3.json("../static/data/scores/mbid_sections.json").then(function(mbidSections){
    var algorithmSelector= d3.selectAll(".algorithm_selector")
    algorithmSelector.on('change', function(d){
      removePatterns(); // every time we select a new algorithm the network graph is removed
      var selectedAlgorithms = getCheckedBoxes("checkbalgorithm"); // get list with selected algorithms

      var familySelector = d3.selectAll(".family_selector");
      familySelector.on('change', function(d){
        var nawbaSelector = d3.selectAll('.nawba_chooser');
        nawbaSelector.selectAll("label").remove(); // refresh nawba list in nawba selector panel
        var selectedFamily = getCheckedBoxes("checkbfamily"); // get list with selected family

        appendNawbaCheckBoxes(nawbaSelector, selectedFamily) // add radio buttons to nawba selector panel
        var nawbaChooser = d3.selectAll(".nawba_chooser");
        nawbaChooser.on('change', function(d){
          d3.selectAll('option').remove() // every time we select different nawba we refresh the drop down menu
          removePatterns(); // every time we select different nawba we refresh network graph
          selectedAlgorithms = getCheckedBoxes("checkbalgorithm");
          selectedFamily = getCheckedBoxes("checkbfamily");
          var selectedNawbas = getCheckedBoxes("checkbnawba"); // get selected nawbas
          var selectedMbid = addMbidsToDropDown(familyNawbaMbid, selectedAlgorithms, selectedFamily, selectedNawbas) // add mbid to dropdown menu
          var selectedSection = addSectionsToDropDown(mbidSections, selectedMbid) // add sections to dropdown
          // console.log(selectedMbid)

          // // Backend
          // console.log(selectedNawbas)
          var jsonToSendBackEnd = {"selectedAlgorithms": selectedAlgorithms, "selectedNawbas": selectedNawbas};

          // send POST request to send the data of the selected algorithms and nawbas
          fetch('/define_graph_parameters', {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(jsonToSendBackEnd),
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
            fetch('/plot_graph')
            .then(function (response) {
                return response.json();
            }).then(function (nodesEdges) {
              var g = createGraphDict(nodesEdges); // generate dictionary with graph data (nodes and edges)
              console.log(g)
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
                     borderSize: 0.5,
                     defaultNodeBorderColor: 'black',
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
                 console.log(path)
                 new Audio(path).play();
               });
              s.refresh();
            });

            //taking selected mbid and section to be plotted
            d3.select("#selectMbidButton").on("change", function(d){
              selectedMbid = this.options[this.selectedIndex].value;
              d3.select("#selectSectionButton").html(""); // delete children of section dropdown when changing mbid
              selectedSection = addSectionsToDropDown(mbidSections, selectedMbid)
            });
            d3.select("#selectSectionButton").on("change", function(d){
              selectedSection = this.options[this.selectedIndex].value;
              console.log(selectedSection)
            });
            d3.select("#plotscore").on("click", function(d){
              plotScoreWithPatterns(selectedMbid, selectedSection);
            });
          });
        }); //nawba chooser
      });
    });
  });
