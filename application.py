from flask import Flask, flash, redirect, render_template, request, session, abort, send_from_directory, send_file, \
    jsonify
import json
import make_graph

# Declare application
app = Flask(__name__)

class DataStore():
    selectedAlgorithms = None
    selectedNawbas = None

data = DataStore()
@app.route('/')
def index():
    # with open('static/data/selector/family_nawba_mbid.json') as json_file:
    #     familyNawbaMbid = json.load(json_file)
    #     print(familyNawbaMbid)
    #     return render_template("index.html", familyNawbaMbid=familyNawbaMbid)
    return render_template("index.html")

# We are defining a route along with the relevant methods for the #route, in this case they are get and post.
@app.route("/define_graph_parameters", methods = ["POST"])
def define_parameters():
    parameters = request.get_json()
    print("PARAMETERS: ", parameters)
    data.selectedAlgorithms = parameters["selectedAlgorithms"]
    data.selectedNawbas = parameters["selectedNawbas"]

    return "OK"

@app.route("/plot_graph", methods=["GET"])
def plot_graph():
    graph = make_graph.make_graph(data.selectedAlgorithms, data.selectedNawbas)

    return jsonify(graph)  # serialize and use JSON headers


if __name__ == "__main__":
    app.run(debug=True)