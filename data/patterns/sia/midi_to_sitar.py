from music21 import *
import os
from midi2audio import FluidSynth
import glob

files = [f for f in glob.glob("" + "**/*.mid", recursive=True)]

for file in files:
	s = converter.parse(file)

	for p in s.parts:
	    p.insert(0, instrument.Sitar())

	s.write('midi', file)