# n3-2-d3

Conversion of N3 to the json data file. Suitable for visualization using d3js.org.

## Install

	npm install

## Conversion of NERD Ontology

* http://nerd.eurecom.fr/ontology/

Example of usage:

	node n3-2-d3.js --n3 http://nerd.eurecom.fr/ontology/nerd-v0.5.n3 --prefix http://nerd.eurecom.fr/ontology > nerd.json

## Conversion of schema.org

* http://schema.rdfs.org/all.nt

Example of usage:

	node n3-2-d3.js --n3 http://schema.rdfs.org/all.nt --prefix http://schema.org > schema.json


## Visualization

Start web server 

	node server.js

Open 
	
	/index.html?file=nerd.json
	or
	/index.html?file=schema.json