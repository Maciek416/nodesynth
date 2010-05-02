var sys = require('sys');
var kiwi = require('kiwi');
kiwi.require('express');
require('express/plugins')

configure(function(){
	use(MethodOverride);
	use(ContentLength);
	use(Logger);
	use(Static);
	set('root', __dirname);
})

var requestcounter = 0;

// Generate pattern data
var data = {
	pattern:[]
};

// var pianorollheight = 24;
// var patternwidth = 32;
// for(var i=0;i<pianorollheight;i++){
//  data.pattern[i] = [];
//  for(var j=0;j<patternwidth;j++){
//    //data.pattern[i][j] = (Math.random()>0.5)?true:false;
//    // initial pattern is always empty
//    data.pattern[i][j] = false;
//  }
// }

data.pattern = new Array(32);
for ( var i = 0; i < data.pattern.length; i++ ) {
  data.pattern[i] = new Array(24);
  for( var j = 0; j < data.pattern[i].length; j++ ) {
    data.pattern[i][j] = false;
  }
}


// UI
get('/', function(){
	requestcounter++;
	this.render('index.html.haml', {
		layout: false,
		locals: {
			data: data.pattern,
			requestcounter: requestcounter,
			title: 'NodeSynth'
		}
	})
});

// Fetch a key
get('/get/:k', function(){
	var result = JSON.stringify(data[this.param('k')]);
	sys.puts("Returning:",result);
	return result;
});

// Set the value of a key k
post('/set/:k', function(){
	var value = JSON.parse(this.body);
	var key = this.param('k');
	sys.puts("setting value ["+key+"] to ["+value+"]");
	data[key] = value;
	// TODO: return some kind of intelligent cache id
	return JSON.stringify({});
});

// Set value of k at x at y, where x and y are integers
post('/set/:k/:sub1/:sub2', function(){
	var value = JSON.parse(this.body);
	var key = this.param('k');
	var sub1 = parseInt(this.param('sub1'));
	var sub2 = parseInt(this.param('sub2'));
	sys.puts("setting value data["+key+"]["+sub1+"]["+sub2+"] to ["+value+"]");
	data[key][sub1][sub2] = value;
	// TODO: return some kind of intelligent cache id
	return JSON.stringify({});
});

run();

sys.puts("NodeSynth is running");