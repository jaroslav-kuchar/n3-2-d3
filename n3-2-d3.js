// command line parameters
var argv = require('optimist')
    .usage('Converts N3 to json data file.\nUsage: $0')
    .demand(['n3','prefix'])
    .describe('n3', 'URL of N3 source file')
    .describe('prefix', 'prefix to limit')
    .argv;

// modules
var request = require('request');
var n3 = require('n3');

// variables
var n3source = argv.n3;
var prefix = argv.prefix;
var parser = new n3.Parser();

// tree structure
var tree = {};
var set = {};
set.size = 0;

// read url content
request(n3source, function(error, response, body) {
    if (!error && response.statusCode == 200 && body) {
        // n3 parser
        parser.parse(body, function(error, triple) {
            if (triple) {
                if(triple.subject.indexOf(prefix)!=-1 && (triple.object.indexOf(prefix)!=-1 || triple.predicate == 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type')) {

                    // get name from subject of triple of concept from uri (http://example.com#Name)
                    var name = (((triple.subject.split('#'))[1])?((triple.subject.split('#'))[1]):triple.subject.substr(triple.subject.lastIndexOf('/')+1));
                    // if not exists in set
                    if (!set[name]) {
                        // create new object and set default values
                        set[name] = {};
                        set[name].name = name;
                        // default parent
                        set[name].parent = 'Thing';
                        set.size++;
                    }
                    if (triple.predicate == 'http://www.w3.org/2000/01/rdf-schema#subClassOf') {
                        // get parent name from object of triple
                        var par = (((triple.object.split('#'))[1])?((triple.object.split('#'))[1]):triple.object.substr(triple.object.lastIndexOf('/')+1));
                        // set parent if exists
                        set[name].parent = par;
                    }
                    if (triple.predicate == 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type') {
                        // get type
                        var par2 = (((triple.object.split('#'))[1])?((triple.object.split('#'))[1]):triple.object.substr(triple.object.lastIndexOf('/')+1));
                        // set parent if exists
                        set[name].type = par2;
                    }
                }
            } else {
                // all triples processed
                for(var i in set){
                    if((set[i].type && set[i].type!='Class') || i=='Thing' || i=='schema-tmp'){
                        delete set[i];
                        set.size--;
                    } else {
                        delete set[i].type;
                    }
                }
                //console.log(set);
                buildTree(set);
                console.log(JSON.stringify(tree));
            }
        });
    } else {
        console.log('error reading source file content from url: ' + n3source);
    }
});

// build tree from set

function buildTree(set) {
    // root
    tree.name = 'Thing';
    tree.children = [];
    // while anything in set except size property
    while (set.size > 0) {
        // get keys from set
        var keys = Object.keys(set);
        // iterate all, skip first = size property
        for (var i = 0; i < keys.length; i++) {
            // get object from set
            var top = set[Object.keys(set)[i]];
            //console.log(top);
            // if exists
            if (top && top.parent) {
                // find object parent in tree
                var p = traverse(tree, top.parent);
                // if exists
                if (p) {
                    // if leaf, add children
                    if (!p.children) {
                        p.children = [];
                    }
                    // delete parent link
                    delete top.parent;
                    // add object as child of parent
                    p.children.push(top);
                    // decrease set
                    set.size--;
                    delete set[top.name];
                }
            } else {
                if(top && top.name=='Thing'){
                    // decrease set
                    set.size--;
                    delete set[top.name];
                }
            }
        }
    }
}

// traverse tree and find node
function traverse(o, name) {
    // if found -> return
    if (o.name == name) {
        return o;
    } else {
        // traverse all children
        var ret = null;
        for (var i in o.children) {
            var r = traverse(o.children[i], name);
            if (r) {
                ret = r;
            }
        }
        return ret;
    }
}