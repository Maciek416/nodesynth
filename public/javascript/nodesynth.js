$(function(){

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


  var NodeSynth = function(){
    // initialize
    var store = SharedKeyValueStore();

    var self = {
      refreshPattern: function(){
        store.attr("pattern", function(updatedpattern){
          // TODO: Make this cleaner and less global-abusive
          sequencer = updatedpattern;
        });
      },
      setNote: function(row, col, value){
        // set
        store.attr("pattern", row, col, value, function(){
          self.refreshPattern();
        });
      },
      initSynchronizer: function(){
        setInterval(function(){
          self.refreshPattern();
        },1000);
      }
    };

    return self;
  };

  window.synth = NodeSynth();
  window.synth.initSynchronizer();

});