# Script to compute network json to be plotted in Web application

import csv
import json
import networkx as nx
import matplotlib.pyplot as plt
import itertools as it

nawba_colors = {"1": "#FFFF66",
                "2": "#87CEEB",
                "3": "#CCCC00",
                "4": "#F08080",
                "5": "#B22222",
                "6": "#00BFFF",
                "7": "#494B4B",
                "8": "#0000FF",
                "9": "#4682B4",
                "10": "#FF0000",
                "11": "#7B68EE"}
algorithms_shape = {"sia": "circle", "tfidf": "square", "centos": "star"}
coef_path = "similarity_coefficients/"
algorithms = ["sia", "tfidf", "centos"]
algorithms_shapes_to_plot = {"sia": "o", "tfidf": "^", "centos": "*"}
with open('../patterns.json') as json_file:
    patterns = json.load(json_file)

#############################################################################################################################
selected_algorithms = ["centos","tfidf"]
selected_nawbas = ["1","2", "3"]

G = nx.Graph()
patterns_to_plot = []
for selected_algorithm in selected_algorithms:
    for selected_nawba in selected_nawbas:
        for pattern in patterns[selected_algorithm][selected_nawba]:
            patterns_to_plot.append(pattern)
            G.add_node(pattern, algorithm=selected_algorithm, nawba=selected_nawba)

similarity = []
for pair_algorithm in it.product(selected_algorithms, repeat=2):
    for pair_nawba in it.product(selected_nawbas, repeat=2):
        with open(coef_path + pair_algorithm[0] + pair_nawba[0] + '-' + pair_algorithm[1] + pair_nawba[1] + '.csv') as csv_file:
            one_similarity = [row for row in csv.reader(csv_file, delimiter=',') if row[0] != "query_pattern"]
            similarity += one_similarity

similarity_to_plot = [(x[0], x[1], {'weight': x[2]}) for x in similarity]

G.add_edges_from(similarity_to_plot)
#nx.write_gexf(G, "test.gexf")
#json.dump(nx.node_link_data(G), open('test.json','w'))
nodePos = nx.fruchterman_reingold_layout(G)

# draw shape and color for each node
for selected_algorithm in selected_algorithms:
    #print(selected_algorithm)
    for selected_nawba in selected_nawbas:
        #print(selected_nawba)
        nx.draw_networkx_nodes(G, nodePos, node_color=nawba_colors[selected_nawba],
                               node_shape=algorithms_shapes_to_plot[selected_algorithm],
                               nodelist=[node[0] for node in G.nodes(data=True) if node[1]['nawba'] == selected_nawba and node[1]['algorithm'] == selected_algorithm])
nx.draw_networkx_edges(G, nodePos)
nodes = [{'id': node[0], 'algorithm': node[1]['algorithm'], 'nawba': node[1]['nawba'], 'type': algorithms_shape[node[1]['algorithm']],
          'color': nawba_colors[node[1]['nawba']],'x': nodePos[node[0]][0],'y': nodePos[node[0]][1]}
         for node in G.nodes(data=True)]

links = []
cont = 1
for edge in G.edges(data=True):
    links.append({'id': cont, 'source': edge[0], 'target': edge[1], 'weight': edge[2]['weight']})
    cont += 1

with open('../../graph.json', 'w') as f:
    json.dump({'nodes': nodes, 'edges': links},
              f, indent=4,)
plt.show()

##################################################################################################################################
