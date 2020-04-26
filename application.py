from flask import Flask, flash, redirect, render_template, request, session, abort, send_from_directory, send_file, \
    jsonify
import glob
import os

import make_graph
import create_score

# Declare application
app = Flask(__name__)

class DataStore():
    """
    Database contains selected algorithm, nawbas, mbid and section.
    """
    selectedAlgorithms = None
    selectedNawbas = None
    selectedMbid = None
    selectedSection = None
data = DataStore()

@app.route('/')
def index():
    # Everytime main page is loaded, output score files are removed
    files = [f for f in glob.glob("" + "static/data/scores/output_scores/*.musicxml", recursive=True)]
    if files:
        [os.remove(f) for f in files]
    return render_template("index.html")

# We are defining a route along with the relevant methods for the #route, in this case they are get and post.
@app.route("/define_graph_parameters", methods = ["POST"])
def define_graph_parameters():
    """
    Function that sets corresponding parameters in the database to plot network graph.
    """
    parameters = request.get_json()
    data.selectedAlgorithms = parameters["selectedAlgorithms"]
    data.selectedNawbas = parameters["selectedNawbas"]

    return "OK"

@app.route("/plot_graph", methods=["GET"])
def plot_graph():
    """
    Function that call make_graph() and send the data to JS.
    """
    graph = make_graph.make_graph(data.selectedAlgorithms, data.selectedNawbas)

    return jsonify(graph)  # serialize and use JSON headers

@app.route("/define_score_parameters", methods = ["POST"])
def define_score_parameters():
    """
    Function that sets corresponding parameters in the database to plot score.
    """
    selected_mbid_section = request.get_json()

    data.selectedMbid = selected_mbid_section["selectedMbid"]
    data.selectedSection = selected_mbid_section["selectedSection"]

    return "OK"

@app.route("/plot_score", methods=["GET"])
def plot_score():
    """
    Function that call paint_patterns_in_score() and send the data to JS.
    """
    score_path = create_score.paint_patterns_in_score(data.selectedAlgorithms,
                                                      data.selectedNawbas,
                                                      data.selectedMbid,
                                                      data.selectedSection)

    return render_template('score.html', scorePath={'scorePath': str('../' + score_path), 'selectedMbid': data.selectedMbid})

if __name__ == "__main__":
    app.run(debug=True)