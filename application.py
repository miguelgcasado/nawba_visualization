from flask import Flask, flash, redirect, render_template, request, session, abort, send_from_directory, send_file, \
    jsonify
import glob
import os
import time

import make_graph
import create_score

# Declare application
app = Flask(__name__)

class DataStore():
    """
    Database contains selected algorithm, nawbas, mbid and section.
    """
    score_path = None
    selected_mbid = None
data = DataStore()

@app.route('/')
def index():
    # Everytime main page is loaded, output score files are removed
    files = [f for f in glob.glob("" + "static/data/scores/output_scores/*.musicxml", recursive=True)]
    if files:
        [os.remove(f) for f in files]
    return render_template("index.html")

# We are defining a route along with the relevant methods for the #route, in this case they are get and post.
@app.route("/plot_graph", methods = ["POST"])
def plot_graph():
    """
    Function that call to make_graph() when parameters from JS (algorithms and nawbas selected)
    """
    parameters = request.get_json()

    graph = make_graph.make_graph(parameters["selectedAlgorithms"], parameters["selectedNawbas"])

    return jsonify(graph)

@app.route("/plot_score", methods = ["POST", "GET"])
def plot_score():
    """
    Function that sets corresponding parameters (selected mbid and score path to be plotted) and plot the corresponding score
    """
    if request.method == 'POST':
        parameters = request.get_json()
        data.selected_mbid = parameters['selectedMbid']
        data.score_path = create_score.paint_patterns_in_score(parameters['patternsToPlot'],
                                                          parameters['selectedMbid'],
                                                          parameters['selectedSection'])
        return "OK"
    else:
        while not os.path.exists(data.score_path):
            time.sleep(1)
        if os.path.isfile(data.score_path):
            return render_template('score.html', scorePath={'scorePath': str('../' + data.score_path), 'selectedMbid': data.selected_mbid})


if __name__ == "__main__":
    app.run(debug=True)