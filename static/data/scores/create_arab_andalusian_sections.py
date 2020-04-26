import os
import json
import csv

with open('arab_andalusian_scores_sections.csv') as csvfile:
	readCSV = csv.reader(csvfile, delimiter=',')

	score_annotations = {}
	for row in readCSV:
		if row[0] != 'mbid':
			if row[0] not in score_annotations:
				cont={}
				score_annotations[row[0]] = {}
			if row[1] not in score_annotations[row[0]]:
				score_annotations[row[0]][row[1]] = [row[2], row[3]]
			else:
				cont[row[1]] = 2
				score_annotations[row[0]][row[1] + '-' + str(cont[row[1]])]=[row[2], row[3]]
				cont [row[1]] += 1

with open('mbid_sections.json','w') as json_file:
	json.dump(score_annotations, json_file)
