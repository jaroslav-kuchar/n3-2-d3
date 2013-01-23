# n3-2-d3

Conversion of N3 to the json data file. Suitable for visualization using d3js.org.

## Install

	npm install

## Conversion of NERD Ontology

* http://nerd.eurecom.fr/ontology/

Example of usage:

	node n3-2-d3_nerd.js --n3 http://nerd.eurecom.fr/ontology/nerd-v0.5.n3 --prefix http://nerd.eurecom.fr/ontology > nerd.json


## Visualization

Start web server 

	node server.js

Open index.html