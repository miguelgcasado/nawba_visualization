import os
import csv

dhil = ["4", "5", "10"]
zaydan = ["2", "6", "8", "9", "11"]
maya = ["1", "3"]
mzmum = ["7"]
groups = [dhil, zaydan, maya, mzmum]
patterns_path = "/home/miguelgc96/SMC/Thesis/main_workspace/results/patterns_midi"
algorithms = ["sia", "tfidf", "centos"]


for nawba_query in range(1,12):
    for nawba_output in range(1,12):
        nawba_query = str(nawba_query)
        nawba_output = str(nawba_output)
        for a_query in algorithms:
            for a_output in algorithms:
                query_path = os.path.join(patterns_path, a_query, nawba_query)
                out_path = os.path.join(patterns_path, a_output, nawba_output)

                output_file = os.path.join(patterns_path, "similarity/similarity_coefficients", a_query + nawba_query + "-" + a_output + nawba_output)
                cli = "java -jar ../../../../../melodyshape/melodyshape-1.4.jar -q " + query_path + " -c " + out_path + " -a 2015-shapeh > " + output_file + ".txt"
                os.system(cli)
                with open(output_file + '.txt') as fp:
                    lines = []
                    with open(output_file + '.csv', mode='w') as csv_file:
                        fieldnames = ['query_pattern', 'output_pattern', 'similarity']
                        writer = csv.DictWriter(csv_file, fieldnames=fieldnames)

                        writer.writeheader()
                        similarities = []
                        for cnt, line in enumerate(fp):
                            line = line.replace('\n', '')
                            line = line.replace('.mid', '')
                            line = line.split('\t')
                            if float(line[2]) >= 0.2 and line[0] != line[1] and line[2] not in similarities:
                                writer.writerow(
                                    {'query_pattern': line[0], 'output_pattern': line[1], 'similarity': line[2]})
                            similarities.append(line[2])



