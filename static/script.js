/***************************************************************MAIN*************************************************************/

//read json with all data (hierarchy: family -> nawba -> mbid)
d3.json("../static/data/selector/family_nawba_mbid.json").then(function(familyNawbaMbid){
  //read json with mbid -> sections -> offsets
  d3.json("../static/data/scores/mbid_sections.json").then(function(mbidSections){
    d3.json("../static/data/selector/mbid_title_orchestra.json").then(function(mbidTitleOrchestra){
    var selectedNawbas = -1;
    var selectedAlgorithms = -1;
    var algorithmSelector= d3.selectAll(".algorithm_selector")
    algorithmSelector.on('change', function(d){
      removePatterns(); // every time we select a new algorithm the network graph is removed
      selectedAlgorithms = getCheckedBoxes("checkbalgorithm"); // get list with selected algorithms
      if (selectedNawbas !== -1){
        plotGraphPostProcess(selectedAlgorithms, selectedNawbas) // plot graph if it's not the first time we select and algorithm
      }
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
          selectedNawbas = getCheckedBoxes("checkbnawba"); // get selected nawbas
          var selectedRecording = addMbidsToDropDown(familyNawbaMbid, mbidTitleOrchestra, selectedAlgorithms, selectedFamily, selectedNawbas) // add mbid to dropdown menu
          var selectedSection = addSectionsToDropDown(mbidSections, mbidTitleOrchestra, selectedRecording) // add sections to dropdown
          // console.log(selectedMbid)

          // // Backend
          // console.log(selectedNawbas)
          var patternsToPlot = plotGraphPostProcess(selectedAlgorithms, selectedNawbas);
          console.log(patternsToPlot)
          //taking selected mbid and section to be plotted
          d3.select("#selectMbidButton").on("change", function(d){
            selectedRecording = this.options[this.selectedIndex].value;
            d3.select("#selectSectionButton").html(""); // delete children of section dropdown when changing mbid
            selectedSection = addSectionsToDropDown(mbidSections, mbidTitleOrchestra, selectedRecording)
          });
          d3.select("#selectSectionButton").on("change", function(d){
            selectedSection = this.options[this.selectedIndex].value;
          });
          d3.select("#plotscore").on("click", function(d){
            patternsToPlot.then(function(patterns){
            console.log(patterns)
            var selectedMbid = convertRecordingTitletoMbid(mbidTitleOrchestra, selectedRecording)
            plotScoreWithPatterns(patterns, selectedMbid, selectedSection);
            });
          });
          });//nawba chooser
        });
      });
     });
    });
  });
