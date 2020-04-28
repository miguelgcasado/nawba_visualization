import json
import music21 as m21

nawba_colors = {"1": "#14AA06",
                "2": "#87CEEB",
                "3": "#065003",
                "4": "#F08080",
                "5": "#B22222",
                "6": "#00BFFF",
                "7": "#9A4D08",
                "8": "#0000FF",
                "9": "#4682B4",
                "10": "#FF0000",
                "11": "#7B68EE"}
with open('static/data/patterns/patterns.json') as json_file:
    all_patterns = json.load(json_file)

with open('static/data/scores/mbid_sections.json') as json_file:
    mbid_section = json.load(json_file)

def separate_string_pattern_in_notes(pattern):
    """
    Function that separate a string of notes in list of notes
    """
    output = []
    cont = 0
    for idx in range(len(pattern) - 1):
        if (pattern[idx + 1] == '#' or pattern[idx + 1] == '-'):
            output.append(pattern[idx] + pattern[idx + 1])
        elif pattern[idx] != '#' and pattern[idx] != '-':
            output.append(pattern[idx])
    if pattern[-1] != '#' and pattern[-1] != '-':
        output.append(pattern[-1])
    return output

def paint_patterns_in_score(patterns_to_plot, selected_mbid, selected_section):
    """
    Function that, given list of selected algorithms, nawbas, mbid and section, create score with corresponding
    painted patterns in that score.
    """
    s = m21.converter.parse('static/data/scores/scores_xml/' + selected_mbid + '.xml')
    p = s.parts[0]
    if "score" not in selected_section:
        segment = p.getElementsByOffset(float(mbid_section[selected_mbid][selected_section][0]),
                                  float(mbid_section[selected_mbid][selected_section][1]),
                                  mustBeginInSpan=False,
                                  includeElementsThatEndAtStart=False).stream()
    else:
        segment = p
    notes_and_rests = segment.flat.notesAndRests.stream()
    for pattern in patterns_to_plot:
        length = len(separate_string_pattern_in_notes(pattern[0]))
        for i in range(len(notes_and_rests[:-length+1])):
            buffer = []
            for j in range(length):
                buffer.append(notes_and_rests[i+j])
            phrase = ''
            for n in buffer:
                if n.isRest:
                    phrase += "R"
                else:
                    phrase += n.name
            if phrase == pattern[0]:
                if buffer[0].lyric is None:
                    buffer[0].lyric = pattern[1] + '.s'
                else:
                    buffer[0].lyric += '\n' + pattern[1]+ '.s'
                if buffer[-1].lyric is None:
                    buffer[-1].lyric = pattern[1]+ '.e'
                else:
                    buffer[-1].lyric += '\n' + pattern[1] + '.e'
                for bn in buffer:
                    bn.style.color = nawba_colors[pattern[2]]
    output_path = 'static/data/scores/output_scores/' + selected_mbid + '.musicxml'
    segment.write('musicxml', fp= output_path)
    return output_path

