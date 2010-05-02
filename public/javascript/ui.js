$(function() {

	var SharedKeyValueStore = function(){
		return {
			attr: function(key, value, callback){
				// usage:
				//
				// set:
				// kvstore.attr("price",9.99,function(){...});
				//
				// set:
				// kvstore.attr("cells",5,10,182,function(){...});
				//
				// get:
				// kvstore.attr("price",function(value){...});
				//
				if(arguments.length==5) {
					$.ajax({
						type: 'POST',
						url: "/set/" + key + "/" + arguments[1] + "/" + arguments[2],
						data: JSON.stringify(arguments[3]),
						success: arguments[4],
						dataType: 'json'
					});
				} else if (arguments.length==3) {
					//
					// TODO: intelligent caching
					//
					$.ajax({
						type: 'POST',
						url: "/set/" + key,
						data: JSON.stringify(value),
						success: callback,
						dataType: 'json'
					});
				} else if(arguments.length==2) {
					// get
					$.ajax({
						type: 'GET',
						url: "/get/" + key,
						success: arguments[1],
						dataType: 'json'
					});
				} else {
					throw "Wrong number of arguments to attr() (must be 2 or 3 or 5)";
				}
			}
		};
	};

	var store = SharedKeyValueStore();

	//
	// Redraw the entire pattern
	//
	var updateCells = function(data){
		for(var i=0;i<data.length;i++){
			for(var j=0;j<data[i].length;j++){
				// TODO: don't refetch this selector constantly, cache it
				($("#datacell_" + i + "_" + j)
					.css({
						backgroundColor:(data[i][j]==1?'rgb(200,200,210)':'rgb(32,32,32)')
					})
					.removeClass("cell_on")
					.removeClass("cell_off")
					.addClass(data[i][j]==1?"cell_on":"cell_off")
				);
			}
		}
	};

	//
	// Fetch a pattern update periodically
	//
	setInterval(function(){
		store.attr("pattern",function(pattern){
			updateCells(pattern);
		});
	},1000);

	//
	// Update cells manually with a click on the pattern itself
	//
	$(".datacell").click(function(){
		var rowindex = $(this).attr("id").split("_")[1];
		var colindex = $(this).attr("id").split("_")[2];
		var value = $(this).hasClass("cell_on")?0:1;
		store.attr("pattern", rowindex, colindex, value, function(pattern){
			store.attr("pattern", function(pattern){
				updateCells(pattern);
			});
		});
	})
});
