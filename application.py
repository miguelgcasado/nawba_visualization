from flask import Flask, flash, redirect, render_template, request, session, abort, send_from_directory, send_file, \
    jsonify
import json
import make_graph
import create_score

# Declare application
app = Flask(__name__)

class DataStore():
    selectedAlgorithms = None
    selectedNawbas = None
    selectedMbid = None
data = DataStore()

@app.route('/')
def index():
    # with open('static/data/selector/family_nawba_mbid.json') as json_file:
    #     familyNawbaMbid = json.load(json_file)
    #     # familyNawbaMbid = json.dumps(familyNawbaMbid)
    #     # familyNawbaMbid= json.loads(familyNawbaMbid)
    #     print(familyNawbaMbid)
    #     return render_template("index.html", familyNawbaMbid=jsonify(familyNawbaMbid))
    return render_template("index.html")

# We are defining a route along with the relevant methods for the #route, in this case they are get and post.
@app.route("/define_graph_parameters", methods = ["POST"])
def define_graph_parameters():
    parameters = request.get_json()
    data.selectedAlgorithms = parameters["selectedAlgorithms"]
    data.selectedNawbas = parameters["selectedNawbas"]

    return "OK"

@app.route("/plot_graph", methods=["GET"])
def plot_graph():
    graph = make_graph.make_graph(data.selectedAlgorithms, data.selectedNawbas)

    return jsonify(graph)  # serialize and use JSON headers

@app.route("/define_score_parameters", methods = ["POST"])
def define_score_parameters():
    selected_mbid = request.get_json()
    #print("SELECTED MBID: ", selected_mbid["selectedMbid"])
    data.selectedMbid = selected_mbid["selectedMbid"]

    return "OK"

@app.route("/plot_score", methods=["GET"])
def plot_score():
    print(data.selectedMbid)
    score_path = create_score.paint_patterns_in_score(data.selectedAlgorithms,
                                                      data.selectedNawbas, data.selectedMbid)

    print("SCORE_PATH: ", score_path)
    return render_template('score.html', scorePath={'scorePath': str('../' + score_path)})

if __name__ == "__main__":
    app.run(debug=True)