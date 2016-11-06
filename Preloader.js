var Loader = (function(options){

	var 	filesLen 		= options.files.length,
				filesLoaded = 0,
				currentFile = 0 
	;

	function init()
	{
		if( !options.path || !checkOptions() || !checkFiles() ) return;

		load();
	}

	function checkOptions()
	{
		if(!options) return false;

		if(!options.callbacks)
		{
			options.callbacks = {
				onLoadComplete: function(){},
				onLoadStart: function(){},
				onLoadEnd: function(){},
				onLoadAbort: function(){},
				onLoadError: function(){},
				onSuccessAll: function(){}
			};
		}

		return true;
	}

	function checkFiles()
	{
		if(!options.files || !options.files.length)
		{
			console.error("No files loaded");
			return false;
		}

		return true;
	}

	function checkLoadingComplete()
	{
		if(filesLoaded !== filesLen) return false;

		if(options.debug) console.info("finish loading 3 files.", options.files);

		options.callbacks.onSuccessAll();

		return true;
	}

	function load()
	{

		options.files.forEach(function(obj, index){
			var image = new Image(),
					src 	= createURL(obj)
			;

			if(src)
			{
				setImageSrc(image, src);
				addImageEvents(image, src);
			}

		});
	}

	function setImageSrc(image, source)
	{
		image.src = source;
	}


	// Events
	// ====================================
	var ev = {
		loadStart: function(image, source)
		{
			if(options.debug) console.info("loading: " + source);
			options.callbacks.onLoadStart();
		},

		load: function(image, source)
		{

			if(options.debug) console.info("finish loading: " + source);

			options.callbacks.onLoadEnd();

			filesLoaded++; // increment file

			checkLoadingComplete();
		},

		loadEnd: function(image, source){},

		error: function(image, source)
		{
			if(options.debug) console.error("Error preloading the file: " + source);
			options.callbacks.onLoadError(image);
		},

		abort: function(image, source)
		{
			console.warn("Loading has been aborted for: " + source );
		}
	};

	function addImageEvents(image, source)
	{
		image.addEventListener("loadstart", function() { ev.loadStart(image, source); });
		image.addEventListener("load", function() { ev.load(image, source); });
		image.addEventListener("error", function() { ev.error(image, source); });
		image.addEventListener("abort", function() { ev.abort(image, source); });
		image.addEventListener("loadend", function() { ev.loadEnd(image, source); });
	}

	function createURL(obj)
	{
		var path = (obj.path || options.path);

		if(!path || !obj.file) return false;

		return path + "/" + obj.file;
	}

	return {
		init: init
	}

});



var loader = new Loader({

	files: [
		{
			path: "",
			file: "collapsed-sprite-trans.png"
		},
		{
			path: "",
			file: "expanded-copy-1@2x.png"
		},
		{
			path: "",
			file: "collapsed-sprite.jpg"
		}
	],

	path: "images",

	callbacks: {
		onLoadComplete: function(){},
		onLoadStart: function(){},
		onLoadEnd: function(){},
		onLoadAbort: function(){},
		onLoadError: function(){},
		onSuccessAll: function(){ console.log("end task"); }
	},

	debug: true

});

loader.init();
