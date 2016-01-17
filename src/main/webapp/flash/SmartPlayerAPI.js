// included here in case this import is before BrightcoveExperiences
console.log("Smart Player API loaded!");

if (brightcove == undefined) {
	/**
	 * @namespace
	 * @ignore
	 */
	var brightcove = {
		/**
		 * Type of player that is loaded.
		 * 
		 * @namespace
		 */
		playerType : {
			/**
			 * Flash player type
			 */
			FLASH : "flash",
			/**
			 * HTML player type
			 */
			HTML : "html",
			INSTALLER : "installer",
			NO_SUPPORT : "nosupport"
		}
	};
}

/**
 * @namespace Package for all public facing api classes.
 */
brightcove.api = {

	/**
	 * Package for all APIModule classes.
	 * 
	 * @namespace
	 * @ignore Do not include in JSDoc.
	 */
	modules : {

		/**
		 * Map of the available APIModules, constants to be defined by each
		 * APIModule class individually.
		 * 
		 * @namespace
		 */
		APIModules : {}

	},

	/**
	 * Package for all classes representing data objects in the player.
	 * 
	 * @ignore
	 */
	data : {},

	/**
	 * Package for all api event classes.
	 * 
	 * @ignore Do not include in JSDoc.
	 */
	events : {},

	/**
	 * Returns the experience based on the specified ID.
	 * 
	 * @param {string}
	 *            id The ID of the experience to retrieve.
	 * 
	 * @return {brightcove.api.BrightcoveExperience} The BrightcoveExperience
	 *         instance with the specified ID.
	 * 
	 * @example var experience = brightcove.api.getExperience(id);
	 */
	getExperience : function(id) {
		if (brightcove.internal._instances[id] == null) {
			if (window.console) {
				var message = "Experience '"
						+ id
						+ "' not found for Brightcove Smart Player API. Please ensure the name is correct and the API for the player is enabled.";
				message += " If the embedded player is Flash, the Smart Player API will not be available if APIModules_all.js or BrightcoveExperiences_all.js have been included";
				message += " on your page. In that case, the legacy JavaScript Player API must be used and the player should be retrieved using a call to brightcove.getExperience().";
				console.log(message);
			}
		}
		return brightcove.internal._instances[id];
	}

};

/**
 * Abstract base class for all API modules.
 * 
 * @class
 * @property {brightcove.api.BrightcoveExperience} experience The Brightcove
 *           experience this module was accessed from.
 */
brightcove.api.modules.APIModule = function() {
	this._handlers = [];
	this._name = "APIModule";
};

/**
 * Used for creation of unique handler names.
 */
brightcove.api.modules.APIModule._handlerCount = 0;

/**
 * Returns a unique handler name.
 * 
 * @return A unique string to be used as a handler.
 */
brightcove.api.modules.APIModule._getUniqueHandlerName = function() {
	return "bc_handler" + (brightcove.api.modules.APIModule._handlerCount++);
};

/**
 * Returns a handler name that will be used in an asynchronous getter call.
 * 
 * @param handler
 *            The user-defined method that will be invoked when the getter data
 *            is returned.
 * 
 * @return The name of the function to invoke when getter data is received.
 */
brightcove.api.modules.APIModule._getAsyncGetterHandler = function(handler) {
	var newHandler = brightcove.api.modules.APIModule._getUniqueHandlerName();
	brightcove.internal._handlers[newHandler] = function(result) {
		handler(result);
		delete brightcove.internal._handlers[newHandler];
	};
	return newHandler;
};

/**
 * Invokes all handlers for an event. Generally this is not called by the API
 * layer but is handled within the player code, but for some events, like
 * errors, that occur in the API layer this method can be used.
 * 
 * @param {string}
 *            event The name of the event to listen for.
 * @param {function}
 *            handler The handler to invoke when the event fires.
 */
brightcove.api.modules.APIModule.prototype._dispatchEvent = function(event) {
	event.target = this;
	var totalHandlers = this._handlers.length;
	var handlers = [];
	var handlerObject;
	for (var i = 0; i < totalHandlers; i++) {
		handlerObject = this._handlers[i];
		if (handlerObject.event == event.type) {
			handlers.push({
				handler : handlerObject.handler,
				priority : handlerObject.priority
			});
		}
	}
	handlers.sort(function(a, b) {
		return b.priority - a.priority;
	});
	totalHandlers = handlers.length;
	for (i = 0; i < totalHandlers; i++) {
		handlers[i].handler(event);
	}
};

/**
 * Adds an event handler for the specified event.
 * 
 * @param {string}
 *            event The name of the event to listen for.
 * @param {function}
 *            handler The handler to invoke when the event fires.
 * @param {number}
 *            priority The priority of the handler (lower number is higher
 *            priority). Default is 0. <em>optional</em>
 */
brightcove.api.modules.APIModule.prototype._addEventListener = function(event,
		handler, priority) {
	if (priority == undefined) {
		priority = 0;
	}
	var newHandler = brightcove.api.modules.APIModule._getUniqueHandlerName();
	this._handlers.push({
		handler : handler,
		bcHandler : newHandler,
		event : event,
		priority : priority
	});
	var module = this;
	brightcove.internal._handlers[newHandler] = function(event) {
		event.target = module;
		return handler(event);
	};
	if (this.experience.type == brightcove.playerType.FLASH) {
		if (this.experience._playerURL) {
			this._callMethod('addEventListener', [ 'event', event, newHandler,
					priority ]);
			return;
		}
		newHandler = "brightcove.internal._handlers." + newHandler;
	}
	this._callMethod("addEventListener", [ event, newHandler, priority ]);
};

/**
 * Removes the event handler for the specified event.
 * 
 * @param {string}
 *            event The name of the event to listen for.
 * @param {function}
 *            handler The handler to invoke when the event fires.
 */
brightcove.api.modules.APIModule.prototype._removeEventListener = function(
		event, handler) {
	var num = this._handlers.length;
	for (var i = 0; i < num; i++) {
		if (this._handlers[i].event == event
				&& this._handlers[i].handler == handler) {
			var bcHandler = this._handlers[i].bcHandler;
			this._handlers.splice(i, 1);
			delete brightcove.internal._handlers[bcHandler];
			break;
		}
	}
	if (bcHandler == undefined) {
		return;
	}
	if (this.experience.type == brightcove.playerType.FLASH) {
		if (this.experience._playerURL) {
			this._callMethod('removeEventListener',
					[ 'event', event, bcHandler ]);
			return;
		}
		bcHandler = "brightcove.internal._handlers." + bcHandler;
	}
	this._callMethod("removeEventListener", [ event, bcHandler ]);
};

/**
 * Adds an event handler for the specified event.
 * 
 * @param {string}
 *            event The name of the event to listen for.
 * @param {function}
 *            handler The handler to invoke when the event fires.
 * @param {number}
 *            priority The priority of the handler (lower number is higher
 *            priority). Default is 0. <em>optional</em>
 * 
 * @example
 * 
 * var APIModules = brightcove.api.modules.APIModules; var videoPlayer =
 * experience.getModule(APIModules.VIDEO_PLAYER); videoPlayer.addEventListener(
 * brightcove.api.events.MediaEvent.COMPLETE, myCompleteHandler);
 */
brightcove.api.modules.APIModule.prototype.addEventListener = function(event,
		handler, priority) {
	// make sure not to add the same handler twice
	this.removeEventListener(event, handler);
	this._addEventListener(event, handler, priority);
};

/**
 * Removes the event handler for the specified event.
 * 
 * @param {string}
 *            event The name of the event to listen for.
 * @param {function}
 *            handler The handler to invoke when the event fires.
 * 
 * @example var APIModules = brightcove.api.modules.APIModules; var videoPlayer =
 *          experience.getModule(APIModules.VIDEO_PLAYER);
 *          videoPlayer.removeEventListener(
 *          brightcove.api.events.MediaEvent.PROGRESS, myProgressHandler);
 */
brightcove.api.modules.APIModule.prototype.removeEventListener = function(
		event, handler) {
	this._removeEventListener(event, handler);
};

/**
 * Calls the embedded player with the specified data.
 * 
 * @param callback
 *            The callback to invoke in the player (used in Flash).
 * @param params
 *            The params (including the module and method) to pass to the
 *            player.
 * 
 * @return For synchronous players (Flash) the result of the method call,
 *         otherwise null.
 */
brightcove.api.modules.APIModule.prototype._callPlayer = function(callback,
		params) {
	if (this.experience.type == brightcove.playerType.HTML) {
		return this._callHTML(params);
	} else {
		return this._callFlash(callback, params);
	}
};

/**
 * Calls the specified method in the player.
 * 
 * @param method
 *            The name of the method to call in the player.
 * @param params
 *            The arguments to pass to the player method invocation.
 * 
 * @return For synchronous players (Flash) the result of the method call,
 *         otherwise null.
 */
brightcove.api.modules.APIModule.prototype._callMethod = function(method,
		params) {
	var args = [];
	for (var i = 0; i < params.length; i++) {
		args.push(params[i]);
	}
	return this._callPlayer(this.experience._callback, {
		module : this._name,
		method : method,
		params : args
	});
};

/**
 * Calls the embedded Flash player with the specified data.
 * 
 * Leaving this here as a stub, should get loaded from flash-shared.js
 * 
 * @param callback
 *            The callback to invoke in the player.
 * @param params
 *            The params (including the module and method) to pass to the
 *            player.
 * 
 * @return The result of the method call.
 */
brightcove.api.modules.APIModule.prototype._callFlash = function(callback,
		params) {
};

/**
 * Calls the embedded HTML player with the specified data.
 * 
 * @param params
 *            The params (including the module and method) to pass to the
 *            player.
 */
brightcove.api.modules.APIModule.prototype._callHTML = function(params) {
	if (!this.experience._callback.postMessage) {
		return null;
	}

	var json;

	// there is a bug where earlier versions of prototype screw up
	// JSON conversion of arrays: BC-29035
	if (window.Prototype != null && Prototype.Version != null) {
		var version = Prototype.Version.split(".");
		var majorVersion = parseInt(version[0], 10);
		var minorVersion = parseInt(version[1], 10);
		var oldPrototypeUsed = majorVersion == 1 && minorVersion < 7;
		if (oldPrototypeUsed && window.console
				&& !brightcove.internal._prototypeMessageSent) {
			brightcove.internal._prototypeMessageSent = true;
			var message = "An older version of prototype.js is being used on this page, preventing successful communication with ";
			message += "the Brightcove player. The Brightcove player supports the use of version 1.7 or higher ";
			message += "of the Prototype library.";
			console.log(message);
		}
	}

	if (window.JSON) {
		json = window.JSON.stringify(params);
	} else {
		json = brightcove.internal._stringify(params);
	}

	if (json) {
		this.experience._callback.postMessage(json, this.experience._playerURL);
	}

	return null;
};

(function() {
	var noop = function() {
	};
	/**
	 * Invokes the specified method on the module and passes the result to the
	 * callback function when it returns. Additional arguments to the method may
	 * be specified after the callback function.
	 * 
	 * @param {string}
	 *            flashMethod - the name of the actionscript method to invoke
	 * @param {string}
	 *            method - the name of the javascript method to invoke
	 * @param {function}
	 *            callback - a function that will be passed the result of the
	 *            call
	 */
	brightcove.api.modules.APIModule.prototype._callAsync = function(
			flashMethod, jsMethod, callback) {
		var params, callbackId = brightcove.api.modules.APIModule
				._getAsyncGetterHandler(callback || noop), args = Array.prototype.slice
				.call(arguments, 3);
		if (this.experience.type == brightcove.playerType.HTML) {
			params = {
				object : this._name,
				method : jsMethod,
				callback : callbackId,
				arguments : args
			};
			return this._callHTML(params);
		} else {
			if (this.experience._playerURL) {
				args.unshift("getterAsync", callbackId);
			} else {
				args.unshift("brightcove.internal._handlers." + callbackId);
			}
			params = {
				module : this._name,
				method : flashMethod,
				params : args
			};
			return this._callFlash(this.experience._callback, params);
		}
	};
})();

/**
 * Calls a getter method in the embedded player. The handles both synchronous
 * and asynchronous calls.
 * 
 * @param name
 *            The name of the getter to invoke.
 * @param args
 *            The arguments to pass to the player getter method.
 * 
 * @return For synchronous players (Flash) the result of the method call,
 *         otherwise null.
 */
brightcove.api.modules.APIModule.prototype._callGetterMethod = function(name,
		args) {
	if (args.length && typeof args[0] == "function") {
		var handler = args.shift(), handlerName;
		if (this.experience.type == brightcove.playerType.FLASH) {
			if (this.experience._playerURL) {
				handlerName = brightcove.api.modules.APIModule
						._getAsyncGetterHandler(handler);
				args.unshift(handlerName);
				args.unshift("getter");
				this._callMethod(name, args);
			} else {
				var result = this._callMethod(name, args);
				// IE won't allow something simple like:
				// setTimeout(handler, 1, result);
				// so...
				setTimeout(function() {
					handler(result);
				}, 1);
			}
		} else {
			handlerName = brightcove.api.modules.APIModule
					._getAsyncGetterHandler(handler);
			args.unshift(handlerName);
			this._callMethod(name + "Async", args);
		}
	} else {
		throw "getter call must include callback function";
	}
};

/**
 * Class to manage API interaction with embedded Brightcove player. This
 * constructor should not be called directly by the developer, but is handled
 * within the Brightcove code. To obtain a reference call:
 * 
 * @example var experience = brightcove.api.getExperience(id);
 * @class
 * @property {string} type The type of player being viewed, "flash" or "html".
 */
/*
 * @param {function} callback The callback in the player to invoke for
 * communication (for Flash). <em>optional</em> @param {string} id The id of
 * the embedded player. <em>optional</em>
 */
brightcove.api.BrightcoveExperience = function() {
	var callback = arguments[0];
	var url = arguments[2];
	this.id = arguments[1];
	if (callback == null) {
		this.type = brightcove.playerType.HTML;
		this._playerURL = url;
		this._callback = brightcove.experiences[this.id].contentWindow;
	} else {
		this.type = brightcove.playerType.FLASH;
		this._callback = callback;
		if (url) {
			// this will signify that the flash player is inside an iFrame
			this._playerURL = url;
		}
	}
	this._modules = {};
};

/**
 * Returns the API module based on the name.
 * 
 * @param {string}
 *            moduleName The name of the module to return an instance of. A
 *            constant from APIModules should be used.
 * @return {brightcove.api.modules.APIModule} An APIModule child class, if it
 *         exists for the name.
 * 
 * @example var APIModules = brightcove.api.modules.APIModules; var videoPlayer =
 *          experience.getModule(APIModules.VIDEO_PLAYER); videoPlayer.play();
 * 
 * @see brightcove.api.modules.APIModules*
 */
brightcove.api.BrightcoveExperience.prototype.getModule = function(moduleName) {
	if (this._modules[moduleName] == null
			&& brightcove.internal._modules[moduleName]) {
		var module = new brightcove.internal._modules[moduleName](this);
		module._playerURL = this._playerURL;
		this._modules[moduleName] = module;
	}
	return this._modules[moduleName];
};

/**
 * Data object for cue points in the player;
 * 
 * @class
 * @property {string} name The name assigned to the cue point.
 * @property {string} time The time in seconds within the media where cue point
 *           is embedded.
 * @property {string} type The numeric type of cue point. See
 *           brightcove.api.modules.CuePointsModule.CuePointType.
 * @property {string} videoID The id of the media that the cue point is
 *           associated with.
 * @property {string} metadata Any string metadata stored with the cue point.
 */
brightcove.api.data.CuePoint = function(pCuePoint) {
	this.name = pCuePoint.name;
	this.videoID = pCuePoint.videoID;
	this.metadata = pCuePoint.metadata;
	this.type = pCuePoint.type;
	this.time = pCuePoint.time;
};
/**
 * Data object for media in the player;
 * 
 * @class
 * @property {object} customFields A map of custom field keys and values defined
 *           by the publisher.
 * @property {string} defaultURL Default URL to load the media. For HLS this
 *           will point to a .m3u8 index file. For H264 this will point to a
 *           .mp4 file.
 * @property {sting} displayName Name of media item in the player.
 * @property {Date} endDate The date media item is set to expire.
 * @property {number} id: Unique Brightcove ID for the media item.
 * @property {boolean} isStreaming Whether the media is streaming or progressive
 *           download. This should always be true for HTML player content.
 * @property {number} length The duration on the media item in milliseconds.
 * @property {string} linkText The text for a related link for the media item.
 * @property {string} linkURL The URL for a related link for the media item.
 * @property {string} longDescription Longer text description of the media item.
 * @property {number} playlistID ID of playlist within which the media was
 *           delivered.
 * @property {Date} publishedDate Date the media was published.
 * @property {number} publisherID The ID of the publisher to which the media
 *           item belongs.
 * @property {string} referenceID Publisher-defined ID for the media item.
 * @property {brightcove.api.data.Rendition} renditions Array of Rendition
 *           objects corresponding to the available renditions of the media.
 *           This will not include HLS renditions.
 * @property {string} shortDescription Short text description of the media item.
 * @property {Date} startDate The date the media item was set to go live.
 * @property {array} tags Publisher-defined lists of tags for the media item,
 *           returned as array of strings.
 * @property {string} thumbnailURL URL of the thumbnail image for the media
 *           item.
 * @property {string} videoStillURL URL of the video still image for the media
 *           item.
 */
brightcove.api.data.Media = function() {
	// This exists soley for documentation
};
/**
 * Data object for playlists.
 * 
 * @class
 * @property {string} thumbnailURL (optional) the URL of the thumbnail for the
 *           player
 * @property {number} page the page of results this playlist represents.
 *           Currently, this is always zero, the first page.
 * @property {string} displayName a user-friendly name for the playlist
 * @property {number} filteredCount the number of videos that were filtered out
 *           of this playlist due to scheduling, geo-restriction or other
 *           conditions that prevent them from being playable.
 * @property {number} id the unique identifier for the playlist
 * @property {string} longDescription a detailed description of the contents of
 *           the playlist
 * @property {number} recordsPerPage the maximum number of videos this playlist
 *           can hold. This should always be one hundred.
 * @property {string} referenceID a string identifier for the playlist that is
 *           unique to the owning account
 * @property {string} shortDescription a description of the contents of the
 *           playlist
 * @property {number} videoCount the number of videos actually in this playlist
 * @property {array} videos an array of Media objects that represent the videos
 *           in this playlist
 */
brightcove.api.data.Playlist = function() {
	// this exists solely for documentation purposes
};
/**
 * Data object for renditions in the player. This pertains to H264 renditions
 * only.
 * 
 * @class
 * @property {string} defaultURL URL of the rendition asset.
 * @property {number} encodingRate The rate at which the media was encoded, in
 *           average bits per second.
 * @property {number} frameHeight The height, in pixels, of the media.
 * @property {number} frameWidth The width, in pixels, of the media.
 * @property {number} size The size, in bytes of the asset.
 * @property {number} videoCodec Codec used to encode the media.
 * @property {boolean} audioOnly Whether the rendition is audio only.
 * @property {number} videoContainer Container used to deliver the media.
 *           0=FLV,1=MP4.
 */
brightcove.api.data.Rendition = function() {
	// This exists soley for documentation
};
/**
 * Constants for the types of advertising specific events.
 * 
 * @namespace
 * @property {string} type The type of the event being fired.
 */
brightcove.api.events.AdEvent = function(pType) {
	this.type = pType;
};

/**
 * Signifies the start of the advertisement.
 * 
 * @constant
 */
brightcove.api.events.AdEvent.START = "adStart";

/**
 * Signifies the completion of the advertisement.
 * 
 * @constant
 */
brightcove.api.events.AdEvent.COMPLETE = "adComplete";

/**
 * Constants for the types of caption specific events.
 * 
 * @namespace
 * @property {string} type The type of the event being fired.
 * @property {brightcove.api.modules.APIModule} target A reference to the
 *           APIModule that is broadcasting the event.
 * @property {string} service The type of protection service (Adobe Pass, AIS)
 * @property {string} requestorId The Adobe Pass requestor id associated with
 *           the content
 * @property {string} resourceId The Adobe Pass resource id associated with the
 *           content
 */
brightcove.api.events.AuthEvent = function(pType, pService, pRequestorId,
		pResourceId) {
	this.type = pType;
	this.service = pService;
	this.requestorId = pRequestorId;
	this.resourceId = pResourceId;
};

/**
 * Signifies that the currently loaded media requires authorization before
 * playback can begin
 * 
 * @constant
 */
brightcove.api.events.AuthEvent.AUTH_NEEDED = "authNeeded";

/**
 * Constants for the types of caption specific events.
 * 
 * @namespace
 * @property {string} type The type of the event being fired.
 * @property {brightcove.api.modules.APIModule} target A reference to the
 *           APIModule that is broadcasting the event.
 * @property {string} url The URL of the DFXP file.
 * @property {string} error Any error text available for a load failure.
 */
brightcove.api.events.CaptionsEvent = {

	/**
	 * Signifies the successful loading of a DFXP file.
	 * 
	 * @constant
	 */
	DFXP_LOAD_SUCCESS : "dfxpLoadSuccess",

	/**
	 * Signifies there was an issue loading a DFXP file.
	 * 
	 * @constant
	 */
	DFXP_LOAD_ERROR : "dfxpLoadError"

};

/**
 * Constants for the types of content specific events.
 * 
 * @namespace
 * @property {string} type The type of the event being fired.
 * @property {brightcove.api.modules.APIModule} target A reference to the
 *           APIModule that is broadcasting the event.
 * @property {brightcove.api.data.Media} media The media the event is being
 *           fired for.
 */
brightcove.api.events.ContentEvent = {

	/**
	 * Signifies that the supplied ID for an API call does not correspond to any
	 * previously loaded video (media).
	 * 
	 * @constant
	 * @see brightcove.api.modules.ContentModule.updateMedia
	 */
	MEDIA_NOT_FOUND : "mediaNotFound"

};

/**
 * Constants for the types of cuepoint specific events.
 * 
 * @namespace
 * @property {string} type The name of the event.
 * @property {brightcove.api.modules.APIModule} target A reference to the
 *           APIModule that is broadcasting the event.
 * @property {brightcove.api.data.CuePoint} cuePoint The cue point fired.
 */
brightcove.api.events.CuePointEvent = {

	/**
	 * Signifies a cue point has been reached during media playback.
	 * 
	 * @constant
	 */
	CUE : "cuePoint"

};

/**
 * Constants for the types of experience specific events.
 * 
 * @namespace
 * @property {brightcove.api.modules.APIModule} target A reference to the
 *           APIModule that is broadcasting the event.
 */
brightcove.api.events.ExperienceEvent = {

	/**
	 * Signifies content has been loaded (if specified) and template is ready
	 * for interaction.
	 */
	TEMPLATE_READY : "templateReady"

};

/**
 * Constants for the types of media specific events.
 * 
 * @namespace
 * @property {string} type The type of the event being fired.
 * @property {brightcove.api.modules.APIModule} target A reference to the
 *           APIModule that is broadcasting the event.
 * @property {brightcove.api.data.Media} media The media the event is being
 *           fired for.
 * @property {number} position The position of the current media in seconds.
 * @property {number} duration The duration of the current media in seconds.
 * @property {brightcove.api.data.Rendition} rendition The rendition that is
 *           being played.
 */
brightcove.api.events.MediaEvent = {

	/**
	 * Signifies media has begun playback initially.
	 * 
	 * @constant
	 */
	BEGIN : "mediaBegin",

	/**
	 * Signifies media has changed in the player.
	 * 
	 * @constant
	 */
	CHANGE : "mediaChange",

	/**
	 * Signifies media has completed playback.
	 * 
	 * @constant
	 */
	COMPLETE : "mediaComplete",

	/**
	 * Signifies there was an error loading media.
	 * 
	 * @constant
	 */
	ERROR : "mediaError",

	/**
	 * Signifies media has begun or resumed playback.
	 * 
	 * @constant
	 */
	PLAY : "mediaPlay",

	/**
	 * Signifies media is currently playing back.
	 * 
	 * @constant
	 */
	PROGRESS : "mediaProgress",

	/**
	 * Signifies media playback has stopped.
	 * 
	 * @constant
	 */
	STOP : "mediaStop",

	/**
	 * Signifies media has been seeked to a new position. Note that because a
	 * video must seek to a keyframe at times the position seeked to will not
	 * match exactly the value specified in the VideoPlayerModule's seek()
	 * method, and this can vary widely from device to device.
	 * 
	 * @constant
	 */
	SEEK_NOTIFY : "mediaSeekNotify"

};

/*
 * Internal methods to be used only by Brightcove.
 */
brightcove.internal = {

	/*
	 * Collection of BrightcoveExperience instances.
	 */
	_instances : {},

	/*
	 * A map of the class to instantiate for each module.
	 */
	_modules : {},

	/*
	 * A list of handlers to invoke based on messages from the player, used for
	 * event listeners and asynch getters.
	 */
	_handlers : {},

	/*
	 * Used with Flash calls as a delimiter between different parts of message
	 * data structure.
	 */
	_ID_DELIM : "|||",

	/*
	 * Turns object into JSON string. Supports scalar values and objects, but
	 * not functions.
	 * 
	 * @param pObject The object to turn into a string.
	 * 
	 * @return The object as a json string.
	 */
	_stringify : function(pObject) {
		var type = typeof pObject;

		// don't stringify functions
		if (type == "function" || pObject == undefined) {
			return null;

			// place strings within quotes, escaping inner quotes
		} else if (type == "string") {
			return "\"" + pObject.replace(/"/g, "\\\"") + "\"";

			// place arrays within brackets
		} else if (pObject instanceof Array) {
			var json = "[";
			for ( var i in pObject) {
				// just make functions empty strings
				if (typeof pObject[i] == "function") {
					json += (null + ",");
				} else {
					json += (brightcove.internal._stringify(pObject[i]) + ",");
				}
			}
			// remove trailing comma
			if (json.substr(-1) == ",") {
				json = json.substr(0, json.length - 1);
			}
			return json + "]";

			// place complex objects within braces
		} else if (type == "object") {
			var json = "{";
			var i;
			// an object can define its enumerable properties (see Event,
			// EventDispatcher)
			var props = pObject.enumerableProperties;
			if (props) {
				for (i in props) {
					json += ("\"" + props[i] + "\":"
							+ brightcove.internal._stringify(pObject[props[i]]) + ",");
				}
			} else {
				for (i in pObject) {
					// skip functions and the __proto__ object
					if (typeof pObject[i] != "function" && i != "__proto__") {
						json += ("\"" + i + "\":"
								+ brightcove.internal._stringify(pObject[i]) + ",");
					}
				}
			}
			// remove trailing comma
			if (json.substr(-1) == ",") {
				json = json.substr(0, json.length - 1);
			}
			return json + "}";

		} else {
			return pObject;
		}
	},

	/*
	 * Instantiates BrightcoveExperience instance based on the id and data sent
	 * from the embedded player.
	 * 
	 * @param pCallback The callback in the player to invoke for communication
	 * (for Flash). @param pID The id of the embedded player. @param pURL The
	 * url of the player iframe (for HTML).
	 */
	_setAPICallback : function(pID, pCallback, pURL) {
		brightcove.internal._instances[pID] = new brightcove.api.BrightcoveExperience(
				pCallback, pID, pURL);
	},

	/*
	 * Converts all known date properties on the passed in object to real JS
	 * Date instances from the millisecond string passsed from the player.
	 * 
	 * @param pObj The object with possible date properties.
	 * 
	 * @return The object with date properties modified.
	 */
	_convertDates : function(pObj) {
		if (!pObj) {
			return pObj;
		}
		if (pObj.media) {
			pObj.media = brightcove.internal._convertDates(pObj.media);
		} else {
			if (pObj.publishedDate) {
				pObj.publishedDate = new Date(parseInt(pObj.publishedDate, 10));
			}
			if (pObj.startDate) {
				pObj.startDate = new Date(parseInt(pObj.startDate, 10));
			}
			if (pObj.endDate) {
				pObj.endDate = new Date(parseInt(pObj.endDate, 10));
			}
		}
		return pObj;
	},

	/*
	 * Determine if the device is an iOS device.
	 * 
	 * @param pUserAgent (optional) allow passing a custom UA string
	 * 
	 * @return true if the device is iOS, false otherwise
	 */
	_isIOS : function(pUserAgent) {
		var types = [ "iPad", "iPhone", "iPod" ];
		var numTypes = types.length;
		var userAgent = pUserAgent || brightcove.userAgent;
		for (var i = 0; i < numTypes; i++) {
			if (userAgent.match(new RegExp(types[i], "i"))) {
				return true;
			}
		}
		return false;
	},

	/*
	 * Determine if the current browser is Chrome for Android.
	 * 
	 * @param pUserAgent (optional) allow passing a custom UA string
	 * 
	 * @return true if the browser is Chrome for Android, false otherwise
	 */
	_isChromeForAndroid : function(pUserAgent) {
		return /android.*chrome/i.test(pUserAgent || brightcove.userAgent);
	},

	/*
	 * XML specific methods, used for passing data to Flash.
	 */
	xml : {

		/**
		 * Converts object into XML string.
		 * 
		 * @param pObj
		 *            The object to transform.
		 * @param pNodeName
		 *            The name of the node to use for the object.
		 * 
		 * @return The object represented as an XML string.
		 */
		_convertToXML : function(pObj, pNodeName) {
			if (pObj instanceof Function)
				return "";
			var type = brightcove.internal.xml._getType(pObj);
			var xml = "<" + type.name + pNodeName + ">";
			if (type.name == "obj") {
				for ( var i in pObj) {
					xml += brightcove.internal.xml._convertToXML(pObj[i], i);
				}
			} else if (type.name == "arr") {
				for (var j = 0; j < pObj.length; j++) {
					xml += brightcove.internal.xml._convertToXML(pObj[j], j);
				}
			} else if (type.name == "str") {
				pObj = brightcove.internal.xml._replaceEntities(pObj);
				xml += pObj;
			} else {
				xml += pObj;
			}
			xml += "</" + type.name + pNodeName + ">";
			return xml;
		},

		/*
		 * Replaces XML-specific symbols with their escaped sequences.
		 * 
		 * @param pObj The XML string to do replacements on.
		 * 
		 * @return The escaped XML string.
		 */
		_replaceEntities : function(pObj) {
			pObj = pObj.replace(new RegExp("&", "g"), "&amp;");
			pObj = pObj.replace(new RegExp("<", "g"), "&lt;");
			pObj = pObj.replace(new RegExp(">", "g"), "&gt;");
			return pObj;
		},

		/*
		 * Returns the specified object's type.
		 * 
		 * @param pObj The object to return a type for.
		 * 
		 * @return The string type of the object.
		 */
		_getType : function(pObj) {
			switch (typeof (pObj)) {
			case "boolean":
				return {
					name : "boo",
					type : Boolean
				};
			case "string":
				return {
					name : "str",
					type : String
				};
			case "number":
				return {
					name : "num",
					type : Number
				};
			default:
				if (pObj instanceof Array) {
					return {
						name : "arr",
						type : Array
					};
				} else {
					return {
						name : "obj",
						type : Object
					};
				}
			}
		}

	}

};

/**
 * The constant name for the Advertising Module.
 */
brightcove.api.modules.APIModules.ADVERTISING = "advertising";

/**
 * API class for handling advertising events. To obtain a reference call:
 * 
 * @example
 * 
 * var APIModules = brightcove.api.modules.APIModules; var adModule =
 * experience.getModule(APIModules.ADVERTISING);
 * 
 * @class
 * @augments brightcove.api.modules.APIModule
 */

/*
 * @param {string} experience The experience within which the module is being
 * retrieved.
 */
brightcove.api.modules.AdModule = function(experience) {
	this.experience = experience;
	this._name = brightcove.api.modules.APIModules.ADVERTISING;
	this._handlerWrappers = [];
};
brightcove.api.modules.AdModule.prototype = new brightcove.api.modules.APIModule();

/**
 * Adds an event handler for the specified event.
 * 
 * @param {string}
 *            event The name of the event to listen for.
 * @param {function}
 *            handler The handler to invoke when the event fires.
 * @param {number}
 *            priority The priority of the handler (lower number is higher
 *            priority). Default is 0. <em>optional</em>
 * 
 * @example var APIModules = brightcove.api.modules.APIModules; var adModule =
 *          experience.getModule(APIModules.ADVERTISING);
 *          adModule.addEventListener( brightcove.api.events.AdEvent.COMPLETE,
 *          myCompleteHandler);
 */
brightcove.api.modules.AdModule.prototype.addEventListener = function(event,
		handler, priority) {
	// make sure not to add the same handler twice
	this.removeEventListener(event, handler);
	this._addEventListener(event, handler, priority);
};

/**
 * Fetches the adPolicy information contained within the player. This
 * information contains details which can help set up advertising within the
 * player. The availble properties of the adPolicy are as follows: adServerURL
 * adTranslationSWF adRulesSWF additionalAdTargetingParams playAdOnLoad
 * prerollAds midrollAds postrollAds playerAdKeys onLoadAdKeys prerollAdKeys
 * midrollAdKeys postrollAdKeys adPlayCap videoBasedAdInterval
 * videoAdPlayInterval timeBasedAdInterval timeAdPlayInterval firstAdPlay
 * 
 * The adPolicy will be undefined if advertising is disabled for the player.
 * 
 * If a callback function is specified, it will be invoked with the adPolicy
 * information as a parameter.
 * 
 * @example
 * 
 * function adPolicyHandler(adPolicy) { //Use the prerollAds property of the
 * adPolicy to determine if we should play a preroll. if(adPolicy.prerollAds){
 * playPrerollAds(); } }
 * 
 * var APIModules = brightcove.api.modules.APIModules; var adModule =
 * experience.getModule(APIModules.ADVERTISING);
 * adModule.getAdPolicy(adPolicyHandler);
 * 
 * 
 * If you are building a JS plugin, you can call this method synchronously
 * without the callback parameter if the player template is already loaded.
 * 
 * var adPolicy = adModule.getAdPolicy(); if(adPolicy.prerollAds) {
 * playPrerollAds(); }
 * 
 */
brightcove.api.modules.AdModule.prototype.getAdPolicy = function(callback) {
	return this._callAsync("getAdPolicyWithCallback", "getAdPolicy", callback);
};

/**
 * Sets the adPolicy information contained within the player. This information
 * contains details which can help set up advertising within the player. The
 * available properties of the adPolicy are as follows: adServerURL playAdOnLoad
 * prerollAds midrollAds postrollAds playerAdKeys onLoadAdKeys prerollAdKeys
 * midrollAdKeys postrollAdKeys adPlayCap
 * 
 * Note that while playAdOnLoad and onLoadAdKeys are settable, onload ads are
 * not used in the HTML player so their values are irrelevant.
 * 
 * Advertising must be enabled in order to use the ad policy.
 * 
 * If a callback function is specified it will be invoked with no parameters.
 * 
 * @example var APIModules = brightcove.api.modules.APIModules; var adModule =
 *          experience.getModule(APIModules.ADVERTISING);
 * 
 * function setupAdPolicy() { // The safest way to set an ad policy is by using
 * the current ad policy as a template. var newAdPolicy =
 * adModule.getAdPolicy(); newAdPolicy.prerollAds = true;
 * newAdPolicy.adServerURL = "http://myAdLocation.com/"; newAdPolicy.adPlayCap =
 * 2;
 * 
 * adModule.setAdPolicy(newAdPolicy, onAdPolicySetupComplete); },
 * 
 * function onAdPolicySetupComplete() { console.log("The ad policy was set
 * up!"); }
 * 
 * Or you can call this method synchronously without the callback parameter if
 * the player template is already loaded.
 * 
 * @example var APIModules = brightcove.api.modules.APIModules; var adModule =
 *          experience.getModule(APIModules.ADVERTISING); function
 *          setupAdPolicy() { // The safest way to set an ad policy is by using
 *          the current ad policy as a template. var newAdPolicy =
 *          adModule.getAdPolicy(); newAdPolicy.prerollAds = true;
 *          newAdPolicy.adServerURL = "http://myAdLocation.com/";
 *          newAdPolicy.adPlayCap = 2;
 * 
 * adModule.setAdPolicy(newAdPolicy); console.log("The ad policy was set up!"); }
 * 
 */
brightcove.api.modules.AdModule.prototype.setAdPolicy = function(pAdPolicy,
		callback) {
	return this._callAsync("setAdPolicyWithCallback", "setAdPolicy", callback,
			pAdPolicy);
};

/**
 * Removes the event handler for the specified event.
 * 
 * @param {string}
 *            event The name of the event to listen for.
 * @param {function}
 *            handler The handler to invoke when the event fires.
 * 
 * @example var APIModules = brightcove.api.modules.APIModules; var adModule =
 *          experience.getModule(APIModules.ADVERTISING);
 *          adModule.removeEventListener(
 *          brightcove.api.events.AdEvent.COMPLETE, myProgressHandler);
 */
brightcove.api.modules.AdModule.prototype.removeEventListener = function(event,
		handler) {
	this._removeEventListener(event, handler);
};

brightcove.internal._modules[brightcove.api.modules.APIModules.ADVERTISING] = brightcove.api.modules.AdModule;
/**
 * The constant name for the Auth Module.
 */
brightcove.api.modules.APIModules.AUTH = "auth";

/**
 * API class for handling auth events. To obtain a reference call:
 * 
 * @example
 * 
 * var APIModules = brightcove.api.modules.APIModules; var authModule =
 * experience.getModule(APIModules.AUTH);
 * 
 * @class
 * @augments brightcove.api.modules.APIModule
 */

/*
 * @param {string} experience The experience within which the module is being
 * retrieved.
 */
brightcove.api.modules.AuthModule = function(experience) {
	this.experience = experience;
	this._name = brightcove.api.modules.APIModules.AUTH;
};
brightcove.api.modules.AuthModule.prototype = new brightcove.api.modules.APIModule();

/**
 * Adds an event handler for the specified event.
 * 
 * @param {string}
 *            pMessage The message to be displayed in the player overlay
 * @param {bool}
 *            pModal If true, the player controls are disabled while the message
 *            is displayed
 * 
 * @example var APIModules = brightcove.api.modules.APIModules; var authModule =
 *          experience.getModule(APIModules.AUTH);
 *          authModule.showMessage("Authorizing Content", true)
 */
brightcove.api.modules.AuthModule.prototype.showMessage = function(pMessage,
		pModal) {
	return this._callMethod("showMessage", [ pMessage, pModal ]);
};

/**
 * Removes the message that was set by showMessage
 * 
 * 
 * @example var APIModules = brightcove.api.modules.APIModules; var authModule =
 *          experience.getModule(APIModules.AUTH);
 *          authModule.showMessage("Authorizing Content", true); (perform
 *          processing) authModule.remoteMessage();
 */
brightcove.api.modules.AuthModule.prototype.removeMessage = function() {
	return this._callMethod("removeMessage", []);
};

/**
 * Sets the token to be used to authorize playback of protected content.
 * 
 * @param {string}
 *            pToken Token to be used to authorize protected content
 * @param {string}
 *            pService Content protection service ("adobepass" or "ais") in
 *            effect
 * 
 * @example var APIModules = brightcove.api.modules.APIModules; var authModule =
 *          experience.getModule(APIModules.AUTH);
 *          authModule.showMessage("Authorizing Content", true);
 *          authModule.playerWithToken("#########", "ais");
 */
brightcove.api.modules.AuthModule.prototype.playWithToken = function(pToken,
		pService) {
	return this._callMethod("playWithToken", [ pToken, pService ]);
};

brightcove.internal._modules[brightcove.api.modules.APIModules.AUTH] = brightcove.api.modules.AuthModule;
/**
 * The constant name for the CaptionsModule.
 */
brightcove.api.modules.APIModules.CAPTIONS = "captions";

/**
 * API class for handling captions. Captions are displayed in the player after
 * being loaded or changed here. All captions must currently be in Timed Text
 * Markup Language. These are found in a DFXP file, as described <a
 * href="http://www.w3.org/TR/ttaf1-dfxp/">here</a>. <br>
 * <br>
 * Currently the CaptionsModule supports a subset of the DFXP standard.
 * Supported attributes include xml:lang, begin, and end.
 * 
 * @example var APIModules = brightcove.api.modules.APIModules; var
 *          captionsModule = experience.getModule(APIModules.CAPTIONS);
 * @class
 * @augments brightcove.api.modules.APIModule
 */
/*
 * @param experience The experience within which the module is being retrieved.
 */
brightcove.api.modules.CaptionsModule = function(experience) {
	this.experience = experience;
	this._name = brightcove.api.modules.APIModules.CAPTIONS;
};
brightcove.api.modules.CaptionsModule.prototype = new brightcove.api.modules.APIModule();

/**
 * Asynchronously load the DFXP file and associate with a video ID. If a video
 * ID isn't given, the DFXP file is loaded for the current video. After the DFXP
 * file is loaded and parsed, the captions will be displayed whenever the given
 * video is played. Events are dispatched for load error or success. <br>
 * <br>
 * DFXP files must be hosted on the same domain as the containing page or must
 * be delivered with an appropriate Access-Control-Allow-Origin header. <br>
 * <br>
 * Currently the CaptionsModule supports a subset of the DFXP standard.
 * Supported attributes include xml:lang, begin, and end.
 * 
 * @param {string}
 *            data Either the URL for the DFXP file or a string representation
 *            of the DFXP file itself. In plugins the string representation is
 *            required.
 * @param {number}
 *            videoID (optional) The video ID to associate the captions with. If
 *            a video ID is not provided, the DFXP file is loaded for the
 *            current video.
 * 
 * @example var APIModules = brightcove.api.modules.APIModules; var
 *          CaptionsEvent = brightcove.api.CaptionsEvent; var captionsModule =
 *          experience.getModule(APIModules.CAPTIONS);
 *          captionsModule.addEventListener(CaptionsEvent.DFXP_LOAD_SUCCESS,
 *          loadHandler);
 *          captionsModule.addEventListener(CaptionsEvent.DFXP_LOAD_ERROR,
 *          errorHandler);
 *          captionsModule.loadDFXP("http://domain/captions.dfxp");
 */
brightcove.api.modules.CaptionsModule.prototype.loadDFXP = function(data,
		videoID) {
	var module = this, request, dispatchError;

	// for HTML, we load in the parent document, not within the iframe
	if (this.experience.type == brightcove.playerType.HTML) {
		dispatchError = function(error) {
			if (window.console) {
				console.log(error);
			}
			module._dispatchEvent({
				type : brightcove.api.events.CaptionsEvent.DFXP_LOAD_ERROR,
				url : data,
				error : error
			});
		};
		if (data.trim().indexOf('<') === 0) {
			// data is literal XML, call loadDFXP directly
			module._callMethod("loadDFXP", [ data, videoID ]);
			return undefined;
		}
		if (window.XMLHttpRequest) {
			// is there a danger of garbage collection here?
			request = new XMLHttpRequest();
			request.onreadystatechange = function() {
				if (request.readyState === 4) {
					try {
						if (request.status === 200) {
							module._callMethod("parseDFXP", [ data,
									request.responseText, videoID ]);
						} else {
							dispatchError("Error loading DFXP file. "
									+ request.statusText + " HTTP status: "
									+ request.status);
						}
					} catch (e) {
						dispatchError(e.description);
					}
				}
			};
			request.open("GET", data, true);
			request.send(null);
		} else {
			dispatchError("Browser not supported by Brightcove player for loading DFXP file.");
		}
	}

	// Flash can load within the player
	else {
		return this._callMethod("loadDFXP", [ data, videoID ]);
	}
};

/**
 * Sets the language to use for captions. If a language hasn't been specified
 * through this API, "en" is used. This language needs to have corresponding
 * lang elements within the loaded DFXP files for any captions to be displayed.
 * This language should be a ISO 639-1 Code as specified <a
 * href="http://www.loc.gov/standards/iso639-2/php/code_list.php">here</a>.
 * <br>
 * <br>
 * Pass a null value to turn off captions.
 * 
 * @param {string}
 *            language The current language for captions.
 * 
 * @example var APIModules = brightcove.api.modules.APIModules; var
 *          captionsModule = experience.getModule(APIModules.CAPTIONS);
 *          captionsModule.setLanguage("en");
 */
brightcove.api.modules.CaptionsModule.prototype.setLanguage = function(language) {
	return this._callMethod("setLanguage", [ language ]);
};

/**
 * Invokes the callback function, passing in the languages used in the captions
 * for a video.<br>
 * If no video ID is given, then the current video is selected.<br>
 * If no captions are found, then an empty Array is returned.
 * 
 * @param {number}
 *            videoID The video ID for the languages. If a video ID isn't given,
 *            the current video is checked.
 * @param {function}
 *            callback The callback function to invoke with the getter result.
 *            callback is optional if you are using the API to build a plugin.
 * 
 * @example function languagesResultHandler(result) {
 *          populateListWithLanguages(result); }
 * 
 * var APIModules = brightcove.api.modules.APIModules; var captionsModule =
 * experience.getModule(APIModules.CAPTIONS);
 * captionsModule.getLanguages(videoID, languagesResultHandler);
 * 
 * or if called within a JS Plugin var languages =
 * captionsModule.getLanguages(videoID);
 * 
 */
brightcove.api.modules.CaptionsModule.prototype.getLanguages = function(
		videoID, callback) {
	return this._callGetterMethod("getLanguages", [ callback, videoID ]);
};

/**
 * Enables setting a default override data for captions. Specified as tts values
 * in a prop:value semi-colon delimited string.
 * 
 * show-background - true | false background-color - <color> || black color -
 * <color> || white
 * 
 * i.e. 'show-background:true;background-color:green;color:yellow;'
 * 
 * Ommit the value for an item to unset it: 'background-color:;'
 * 
 * @param pValues
 *            The values for the default override settings
 */
brightcove.api.modules.CaptionsModule.prototype.setStyleOptions = function(
		pValue) {
	return this._callMethod("setStyleOptions", [ pValue ]);
};

/**
 * Returns the default override style options for captions
 * 
 * @param callback
 *            The callback to call with the data
 */
brightcove.api.modules.CaptionsModule.prototype.getStyleOptions = function(
		callback) {
	return this._callGetterMethod("getStyleOptions", [ callback ]);
};

/**
 * This is used to override the display of captions
 * 
 * @param pValue
 *            A boolean to describe whether captions should be enabled or
 *            disabled
 */
brightcove.api.modules.CaptionsModule.prototype.setCaptionsEnabled = function(
		pValue) {
	return this._callMethod("setCaptionsEnabled", [ pValue ]);
};

/**
 * This is used to get the current value of the captions toggle
 * 
 * @param callback
 *            The callback to call with the returned data
 */
brightcove.api.modules.CaptionsModule.prototype.getCaptionsEnabled = function(
		callback) {
	return this._callGetterMethod("getCaptionsEnabled", [ callback ]);
};

/**
 * This is used to display the options UI, or send the message that the UI is
 * invoked
 * 
 */
brightcove.api.modules.CaptionsModule.prototype.showOptions = function(load) {
	return this._callMethod("showOptions", [ load ]);
};
brightcove.internal._modules[brightcove.api.modules.APIModules.CAPTIONS] = brightcove.api.modules.CaptionsModule;

(function() {
	/**
	 * The constant name for the ContentModule.
	 */
	brightcove.api.modules.APIModules.CONTENT = "content";

	/**
	 * API class for handling content retrieval. To obtain a reference call:
	 * 
	 * @example var APIModules = brightcove.api.modules.APIModules; var
	 *          contentModule = experience.getModule(APIModules.CONTENT);
	 * @class
	 * @augments brightcove.api.modules.APIModule
	 */
	/*
	 * @param experience The experience within which the module is being
	 * retrieved.
	 */
	brightcove.api.modules.ContentModule = function(experience) {
		this.experience = experience;
		this._name = brightcove.api.modules.APIModules.CONTENT;
	};
	brightcove.api.modules.ContentModule.prototype = new brightcove.api.modules.APIModule();

	/**
	 * Invokes the callback function, passing in the media DTO that was
	 * requested based on the ID. If the media DTO is not currently loaded in
	 * the player a call to the backend is made to retrieve it before the
	 * callback is invoked.
	 * 
	 * @param {number}
	 *            id The ID for the media to retrieve.
	 * @param {function}
	 *            callback The callback function to invoke with the getter
	 *            result.
	 * 
	 * @example function contentResultHandler(result) {
	 *          updateDisplay(result.displayName); }
	 * 
	 * var APIModules = brightcove.api.modules.APIModules; var contentModule =
	 * experience.getModule(APIModules.CONTENT);
	 * contentModule.getMediaByID(12345, contentResultHandler);
	 * 
	 * If you are building a JS plugin, you can call this method synchronously
	 * without the callback parameter if the media is already loaded on the
	 * player.
	 * 
	 * Otherwise you still need the callback parameter. var media =
	 * contentModule.getMediaByID(12345);
	 */
	brightcove.api.modules.ContentModule.prototype.getMediaByID = function(id,
			callback) {
		return this._callAsync("getMediaByIDWithCallback", "getMediaByID",
				callback, id);
	};

	/**
	 * Invokes the callback function, passing in the media DTO that was
	 * requested based on the reference ID. If the media DTO is not currently
	 * loaded in the player a call to the backend is made to retrieve it before
	 * the callback is invoked.
	 * 
	 * @param {string}
	 *            referenceID The reference ID for the media to retrieve.
	 * @param {function}
	 *            callback The callback function to invoke with the getter
	 *            result.
	 * 
	 * @example function contentResultHandler(result) {
	 *          updateDisplay(result.displayName); }
	 * 
	 * var APIModules = brightcove.api.modules.APIModules; var contentModule =
	 * experience.getModule(APIModules.CONTENT);
	 * contentModule.getMediaByReferenceID("breakingNews123",
	 * contentResultHandler);
	 * 
	 * If you are building a JS plugin, you can call this method synchronously
	 * without the callback parameter if the media is already loaded on the
	 * player. Otherwise you still need the callback parameter.
	 * 
	 * var media = contentModule.getMediaByReferenceID("breakingNews123");
	 */
	brightcove.api.modules.ContentModule.prototype.getMediaByReferenceID = function(
			id, callback) {
		return this._callAsync("getMediaByReferenceIDWithCallback",
				"getMediaByReferenceID", callback, id);
	};

	/**
	 * Invokes the callback with the playlist corresponding to the specified id.
	 * 
	 * @param {number}
	 *            id the id of the playlist to retrieve
	 * @param {function}
	 *            callback (optional) a function that will be passed the
	 *            playlist object as its first argument
	 * @return the playlist data object
	 */
	brightcove.api.modules.ContentModule.prototype.getPlaylistByID = function(
			id, callback) {
		return this._callAsync("getPlaylistByIDWithCallback",
				"getPlaylistByID", callback, id);
	};

	/**
	 * Returns the playlist corresponding to the specified id.
	 * 
	 * @param {string}
	 *            refId the reference id of the playlist to retrieve
	 * @param {function}
	 *            callback a function that will be passed the playlist object as
	 *            its first argument
	 * @return the playlist data object
	 */
	brightcove.api.modules.ContentModule.prototype.getPlaylistByReferenceID = function(
			refId, callback) {
		return this._callAsync("getPlaylistByReferenceIDWithCallback",
				"getPlaylistByReferenceID", callback, refId);
	};

	/**
	 * Applies the given override values to the corresponding videos managed by
	 * the player. The supplied updates must contain an <code>id</code>
	 * property to identify the video to be updated.The properties that can be
	 * set through this mechanism are:
	 * 
	 * <ul>
	 * <li>defaultURL</li>
	 * <li>videoStillURL</li>
	 * <li>adKeys</li>
	 * <li>displayName</li>
	 * <li>length</li>
	 * <li>longDescription</li>
	 * <li>shortDescription</li>
	 * <li>thumbnailURL</li>
	 * <li>renditions *</li>
	 * </ul>
	 *  * Note that updating the renditions object does not have any effect on
	 * HTML rendition selection at the moment - the video's defaultURL value
	 * will always be used.
	 * 
	 * Any additional attributes will be ignored. If the <code>renditions</code>
	 * property is supplied, any existing value will be overwritten. Renditions
	 * is expected to be an array of objects with the following properties:
	 * 
	 * <ul>
	 * <li>defaultURL</li>
	 * <li>encodingRate</li>
	 * <li>frameHeight</li>
	 * <li>frameWidth</li>
	 * <li>size</li>
	 * </ul>
	 * 
	 * This method will throw an error if the id does not correspond to a video
	 * already loaded by the player.
	 * 
	 * If you are building a JS plugin, you can call this method synchronously
	 * without the callback parameter. Otherwise you need the callback
	 * parameter.
	 * 
	 * @param {object}
	 *            updates the collection of properties to be applied to the
	 *            media.
	 * @param {function}
	 *            callback the function to invoke with the updated media object
	 * @returns a copy of the updated MediaDTO.
	 */
	brightcove.api.modules.ContentModule.prototype.updateMedia = function(
			update, callback) {
		return this._callAsync("updateMediaWithCallback", "updateMedia",
				callback, update);
	};

	brightcove.internal._modules[brightcove.api.modules.APIModules.CONTENT] = brightcove.api.modules.ContentModule;
})();

/**
 * The constant name for the CuePointModule.
 */
brightcove.api.modules.APIModules.CUE_POINTS = "cuePoints";

/**
 * API class for handling adding and managing cue points. To obtain a reference
 * call:
 * 
 * @example var APIModules = brightcove.api.modules.APIModules; var
 *          cuePointsModule = experience.getModule(APIModules.CUE_POINTS);
 * @class
 * @augments brightcove.api.modules.APIModule
 */
/*
 * @param experience The experience within which the module is being retrieved.
 */
brightcove.api.modules.CuePointsModule = function(experience) {
	this.experience = experience;
	this._name = brightcove.api.modules.APIModules.CUE_POINTS;
	this._handlerWrappers = [];
};
brightcove.api.modules.CuePointsModule.prototype = new brightcove.api.modules.APIModule();

/**
 * Adds an event handler for the specified event.
 * 
 * @param {string}
 *            event The name of the event to listen for.
 * @param {function}
 *            handler The handler to invoke when the event fires.
 * @param {number}
 *            priority The priority of the handler (lower number is higher
 *            priority). Default is 0. <em>optional</em>
 * 
 * @example
 * 
 * var APIModules = brightcove.api.modules.APIModules; var videoPlayer =
 * experience.getModule(APIModules.VIDEO_PLAYER); videoPlayer.addEventListener(
 * brightcove.api.events.MediaEvent.COMPLETE, myCompleteHandler);
 */
brightcove.api.modules.CuePointsModule.prototype.addEventListener = function(
		event, handler, priority) {
	// make sure not to add the same handler twice
	this.removeEventListener(event, handler);
	var wrapper;
	if (event == brightcove.api.events.CuePointEvent.CUE) {
		wrapper = function(pEvent) {
			pEvent.cuePoint = new brightcove.api.data.CuePoint(pEvent.cuePoint);
			handler(pEvent);
		};
		this._handlerWrappers.push({
			event : event,
			handler : handler,
			wrapper : wrapper
		});
	}
	this._addEventListener(event, wrapper || handler, priority);
};

/**
 * Removes the event handler for the specified event.
 * 
 * @param {string}
 *            event The name of the event to listen for.
 * @param {function}
 *            handler The handler to invoke when the event fires.
 * 
 * @example var APIModules = brightcove.api.modules.APIModules; var videoPlayer =
 *          experience.getModule(APIModules.VIDEO_PLAYER);
 *          videoPlayer.removeEventListener(
 *          brightcove.api.events.MediaEvent.PROGRESS, myProgressHandler);
 */
brightcove.api.modules.CuePointsModule.prototype.removeEventListener = function(
		event, handler) {
	if (event == brightcove.api.events.CuePointEvent.CUE) {
		var wrapper;
		var num = this._handlerWrappers.length;
		for (var i = 0; i < num; i++) {
			if (this._handlerWrappers[i].event == event
					&& this._handlerWrappers[i].handler == handler) {
				wrapper = this._handlerWrappers[i].wrapper;
				this._handlerWrappers.splice(i, 1);
				break;
			}
		}
	}
	this._removeEventListener(event, wrapper || handler);
};

/**
 * Adds a set of cue points to a specified video. These cuepoints will cause
 * cuePoint events to fire at the times specified, which the user can subscribe
 * to. This method adds cue points just in the current client session. It does
 * not persist cue points to the backend for the video.
 * 
 * @param {number}
 *            id VideoDTO id for the video to have cuepoints added to.
 * @param {array}
 *            cuePoints An array of objects defining points in time. Each index
 *            of the array can either be a number, specifying the time in
 *            seconds for the cue, or each index can contain a complex object
 *            with time (in seconds), type and description properties.
 * 
 * @example var videoID = 123456; // id of video currently in player var
 *          cuePoints = [5, 10, 30]; // alternatively: // var CuePointType =
 *          brightcove.api.modules.CuePointsModule.CuePointType; // var
 *          cuePoints = [ // {time:5, type:CuePointType.CODE}, // {time:10,
 *          type:CuePointType.CODE} // ];
 * 
 * var APIModules = brightcove.api.modules.APIModules; var cuePointsModule =
 * experience.getModule(APIModules.CUE_POINTS);
 * cuePointsModule.addCuePoints(videoID, cuePoints);
 */
brightcove.api.modules.CuePointsModule.prototype.addCuePoints = function(id,
		cuePoints) {
	return this._callMethod("addCuePoints", [ id, cuePoints ]);
};

/**
 * Invokes the callback with the cue points for a specified video, if any. The
 * cue points are not guaranteed to be in any specific order.
 * 
 * @param {number}
 *            id VideoDTO id for the video to retrieve code cue points for.
 * @param {function}
 *            callback The callback function to invoke with the array of cue
 *            points for the specified video.
 * 
 * @example var cuePoints; // will hold array of cue points function
 *          cuePointsHandler(result) { cuePoints = result; }
 * 
 * var videoID = 123456; // id of video currently in player
 * 
 * var APIModules = brightcove.api.modules.APIModules; var cuePointsModule =
 * experience.getModule(APIModules.CUE_POINTS);
 * cuePointsModule.getCuePoints(videoID, cuePointsHandler);
 * 
 * If you are building a JS plugin, you can call this method synchronously
 * without the callback parameter.
 * 
 * var cuePoints = cuePointsModule.getCuePoints("123");
 * 
 */
brightcove.api.modules.CuePointsModule.prototype.getCuePoints = function(id,
		callback) {
	var wrapper = function(cuePoints) {
		for ( var i in cuePoints) {
			cuePoints[i] = new brightcove.api.data.CuePoint(cuePoints[i]);
		}
		callback(cuePoints);
	};
	return this._callGetterMethod("getCuePoints", [ wrapper, id ]);
};

/**
 * Clears all code cue points for a specified video.
 * 
 * @param {number}
 *            id VideoDTO id for the video to remove code cue points from.
 * 
 * @example var videoID = 123456; // id of video currently in player
 * 
 * var APIModules = brightcove.api.modules.APIModules; var cuePointsModule =
 * experience.getModule(APIModules.CUE_POINTS);
 * cuePointsModule.clearCodeCuePoints(videoID);
 */
brightcove.api.modules.CuePointsModule.prototype.clearCodeCuePoints = function(
		id) {
	return this._callMethod("clearCodeCuePoints", [ id ]);
};

/**
 * Removes code cue points at the specified time for the specified video.
 * 
 * @param {number}
 *            id VideoDTO id for the video to remove code cue points from.
 * @param {number}
 *            time The time of the cue point to remove, in seconds.
 * 
 * @example var videoID = 123456; // id of video currently in player var time =
 *          5; // time in seconds to remove cue points from
 * 
 * var APIModules = brightcove.api.modules.APIModules; var cuePointsModule =
 * experience.getModule(APIModules.CUE_POINTS);
 * cuePointsModule.removeCodeCuePointsAtTime(videoID, time);
 */
brightcove.api.modules.CuePointsModule.prototype.removeCodeCuePointsAtTime = function(
		id, time) {
	return this._callMethod("removeCodeCuePointsAtTime", [ id, time ]);
};

/**
 * Clears all ad cue points for a specified video.
 * 
 * @param {number}
 *            id VideoDTO id for the video to remove ad cue points from.
 * 
 * @example var videoID = 123456; // id of video currently in player
 * 
 * var APIModules = brightcove.api.modules.APIModules; var cuePointsModule =
 * experience.getModule(APIModules.CUE_POINTS);
 * cuePointsModule.clearAdCuePoints(videoID);
 */
brightcove.api.modules.CuePointsModule.prototype.clearAdCuePoints = function(id) {
	return this._callMethod("clearAdCuePoints", [ id ]);
};

/**
 * Removes ad cue points at the specified time for the specified video.
 * 
 * @param {number}
 *            id VideoDTO id for the video to remove ad cue points from.
 * @param {number}
 *            time The time of the cue point to remove, in seconds.
 * 
 * @example var videoID = 123456; // id of video currently in player var time =
 *          5; // time in seconds to remove cue points from
 * 
 * var APIModules = brightcove.api.modules.APIModules; var cuePointsModule =
 * experience.getModule(APIModules.CUE_POINTS);
 * cuePointsModule.removeAdCuePointsAtTime(videoID, time);
 */
brightcove.api.modules.CuePointsModule.prototype.removeAdCuePointsAtTime = function(
		id, time) {
	return this._callMethod("removeAdCuePointsAtTime", [ id, time ]);
};

brightcove.internal._modules[brightcove.api.modules.APIModules.CUE_POINTS] = brightcove.api.modules.CuePointsModule;

/**
 * The type of cuepoint. 0=ad, 1=code, 2=chapter, 3=embedded (embedded cuePoints
 * are available in flash only)
 * 
 * @namespace
 */
brightcove.api.modules.CuePointsModule.CuePointType = {
	/**
	 * A cue for an ad.
	 */
	AD : 0,
	/**
	 * A generic cue that can be used to perform any developer-defined actions.
	 */
	CODE : 1,
	/**
	 * A cue to designate a chapter point within a video.
	 */
	CHAPTER : 2
};
/**
 * The constant name for the ExperienceModule.
 */
brightcove.api.modules.APIModules.EXPERIENCE = "experience";

/**
 * API class for handling high level experience interaction. To obtain a
 * reference call:
 * 
 * @example var APIModules = brightcove.api.modules.APIModules; var
 *          experienceModule = experience.getModule(APIModules.EXPERIENCE);
 * @class
 * @augments brightcove.api.modules.APIModule
 */
/*
 * @param {string} experience The experience within which the module is being
 * retrieved.
 */
brightcove.api.modules.ExperienceModule = function(experience) {
	this.experience = experience;
	this._name = brightcove.api.modules.APIModules.EXPERIENCE;
};
brightcove.api.modules.ExperienceModule.prototype = new brightcove.api.modules.APIModule();

/**
 * Invokes the callback method with the unique numeric ID of the experience.
 * 
 * @param {function}
 *            callback The callback function to invoke with the getter result.
 * 
 * @example var experienceID; function experienceIDHandler(result) {
 *          experienceID = result; } var APIModules =
 *          brightcove.api.modules.APIModules; var experienceModule =
 *          experience.getModule(APIModules.EXPERIENCE);
 *          experienceModule.getExperienceID(experienceIDHandler);
 * 
 * If you are building a JS plugin, you can call this method synchronously
 * without the callback parameter.
 * 
 * var experienceID = experienceModule.getExperienceID();
 */
brightcove.api.modules.ExperienceModule.prototype.getExperienceID = function(
		callback) {
	var experience = this;
	var handler = function(id) {
		experience._id = id;
		callback(id);
	};
	if (callback == null) {
		return this._id;
	}
	return this._callGetterMethod("getExperienceID", [ handler ]);
};

/**
 * Returns whether the templateReady event has been fired.
 * 
 * @param {function}
 *            callback The callback function to invoke with the getter result.
 * 
 * @example var APIModules = brightcove.api.modules.APIModules; var
 *          experienceModule = experience.getModule(APIModules.EXPERIENCE);
 *          function readyHandler(result) { if (result === true) {
 *          onTemplateReady(null); } else { experienceModule.addEventListener(
 *          brightcove.api.events.ExperienceEvent.TEMPLATE_READY,
 *          onTemplateReady); } } experienceModule.getReady(readyHandler);
 * 
 * If you are building a JS plugin, you can call this method synchronously
 * without the callback parameter.
 * 
 * var isReady = experienceModule.getReady();
 */
brightcove.api.modules.ExperienceModule.prototype.getReady = function(callback) {
	return this._callGetterMethod("getReady", [ callback ]);
};

/**
 * Sets the pixel dimensions for the experience.
 * 
 * @param {number}
 *            width The pixel width to set the experience to.
 * @param {number}
 *            height The pixel height to set the experience to.
 */
brightcove.api.modules.ExperienceModule.prototype.setSize = function(width,
		height) {
	return this._callAsync("setSizeWithCallback", "setSize", undefined, width,
			height);
}

brightcove.internal._modules[brightcove.api.modules.APIModules.EXPERIENCE] = brightcove.api.modules.ExperienceModule;
/**
 * The constant name for the VideoPlayerModule.
 */
brightcove.api.modules.APIModules.VIDEO_PLAYER = "videoPlayer";

/**
 * API class for handling video player interaction. To obtain a reference call:
 * 
 * @example var APIModules = brightcove.api.modules.APIModules; var videoPlayer =
 *          experience.getModule(APIModules.VIDEO_PLAYER);
 * @class
 * @augments brightcove.api.modules.APIModule
 */
/*
 * @param {string} experience The experience within which the module is being
 * retrieved.
 */
brightcove.api.modules.VideoPlayerModule = function(experience) {
	this.experience = experience;
	this._name = brightcove.api.modules.APIModules.VIDEO_PLAYER;
	var module = this;
	this.addEventListener(brightcove.api.events.MediaEvent.BEGIN, function(
			event) {
		module._canPlayWithoutUserInteraction = true;
	}, 0);
	var mobileDevice = brightcove.isSupportedHTMLDevice();
	this._canPlayWithoutUserInteraction = !mobileDevice
			|| (mobileDevice && !brightcove.internal._isIOS() && !brightcove.internal
					._isChromeForAndroid());
	this._handlerWrappers = [];
};
brightcove.api.modules.VideoPlayerModule.prototype = new brightcove.api.modules.APIModule();

/**
 * Adds an event handler for the specified event.
 * 
 * @param {string}
 *            event The name of the event to listen for.
 * @param {function}
 *            handler The handler to invoke when the event fires.
 * @param {number}
 *            priority The priority of the handler (lower number is higher
 *            priority). Default is 0. <em>optional</em>
 * 
 * @example
 * 
 * var APIModules = brightcove.api.modules.APIModules; var videoPlayer =
 * experience.getModule(APIModules.VIDEO_PLAYER); videoPlayer.addEventListener(
 * brightcove.api.events.MediaEvent.COMPLETE, myCompleteHandler);
 */
brightcove.api.modules.VideoPlayerModule.prototype.addEventListener = function(
		event, handler, priority) {
	// make sure not to add the same handler twice
	this.removeEventListener(event, handler);
	var wrapper;
	if (event == brightcove.api.events.CuePointEvent.CUE) {
		wrapper = function(pEvent) {
			pEvent.cuePoint = new brightcove.api.data.CuePoint(pEvent.cuePoint);
			handler(pEvent);
		};
		this._handlerWrappers.push({
			event : event,
			handler : handler,
			wrapper : wrapper
		});
	}
	this._addEventListener(event, wrapper || handler, priority);
};

/**
 * Removes the event handler for the specified event.
 * 
 * @param {string}
 *            event The name of the event to listen for.
 * @param {function}
 *            handler The handler to invoke when the event fires.
 * 
 * @example var APIModules = brightcove.api.modules.APIModules; var videoPlayer =
 *          experience.getModule(APIModules.VIDEO_PLAYER);
 *          videoPlayer.removeEventListener(
 *          brightcove.api.events.MediaEvent.PROGRESS, myProgressHandler);
 */
brightcove.api.modules.VideoPlayerModule.prototype.removeEventListener = function(
		event, handler) {
	if (event == brightcove.api.events.CuePointEvent.CUE) {
		var wrapper;
		var num = this._handlerWrappers.length;
		for (var i = 0; i < num; i++) {
			if (this._handlerWrappers[i].event == event
					&& this._handlerWrappers[i].handler == handler) {
				wrapper = this._handlerWrappers[i].wrapper;
				this._handlerWrappers.splice(i, 1);
				break;
			}
		}
	}
	this._removeEventListener(event, wrapper || handler);
};

/**
 * Invokes the callback function with the video DTO for the video currently in
 * the video window.
 * 
 * @param {function}
 *            callback The callback function to invoke with the current video
 *            object.
 * 
 * @example var video; function videoHandler(result) { video = result; }
 * 
 * var APIModules = brightcove.api.modules.APIModules; var videoPlayer =
 * experience.getModule(APIModules.VIDEO_PLAYER);
 * videoPlayer.getCurrentVideo(videoHandler);
 *  // If you are building a JS plugin, you can call this method synchronously //
 * without the callback parameter.
 * 
 * var currentVideo = videoPlayer.getCurrentVideo();
 */
brightcove.api.modules.VideoPlayerModule.prototype.getCurrentVideo = function(
		callback) {
	return this._callGetterMethod("getCurrentVideo", [ callback ]);
};

/**
 * Invokes the callback function with the rendition DTO for the rendition of the
 * video currently in the video window. If the video playing back has not been
 * enabled for renditions then null will be returned (a non-multibitrate video
 * has 0 renditions associated with it).
 * 
 * @param {function}
 *            callback The callback function to invoke with the current
 *            rendition object.
 * 
 * @example var rendition; function renditionHandler(result) { rendition =
 *          result; }
 * 
 * var APIModules = brightcove.api.modules.APIModules; var videoPlayer =
 * experience.getModule(APIModules.VIDEO_PLAYER);
 * videoPlayer.getCurrentRendition(renditionHandler);
 *  // If you are building a JS plugin, you can call this method synchronously //
 * without the callback parameter.
 * 
 * var currentRendition = videoPlayer.getCurrentRendition();
 */
brightcove.api.modules.VideoPlayerModule.prototype.getCurrentRendition = function(
		callback) {
	return this._callGetterMethod("getCurrentRendition", [ callback ]);
};

/**
 * Plays a video in the video window based on its ID. If the video is not
 * already loaded into the player, it will be fetched from the server. If the
 * player is loaded on a device that requires user interaction to start playback
 * and no such interaction has occurred then video will be cued only.
 * 
 * @param {number}
 *            id The ID of the video to be played.
 * 
 * @example var APIModules = brightcove.api.modules.APIModules; var videoPlayer =
 *          experience.getModule(APIModules.VIDEO_PLAYER);
 *          videoPlayer.loadVideoByID(12345);
 */
brightcove.api.modules.VideoPlayerModule.prototype.loadVideoByID = function(id) {
	return this._callMethod("loadVideoByID", [ id ]);
};

/**
 * Plays a video in the video window based on its reference ID. If the video is
 * not already loaded into the player, it will be fetched from the server. If
 * the player is loaded on a device that requires user interaction to start
 * playback and no such interaction has occurred then video will be cued only.
 * 
 * @param {string}
 *            referenceID The reference ID of the video to be played.
 * 
 * @example var APIModules = brightcove.api.modules.APIModules; var videoPlayer =
 *          experience.getModule(APIModules.VIDEO_PLAYER);
 *          videoPlayer.loadVideoByReferenceID("myVideo");
 */
brightcove.api.modules.VideoPlayerModule.prototype.loadVideoByReferenceID = function(
		referenceID) {
	return this._callMethod("loadVideoByReferenceID", [ referenceID ]);
};

/**
 * Starts playback of the current video in the video window. If the player is
 * loaded on a device that requires user interaction to start playback and no
 * such interaction has occurred then no action will be taken.
 * 
 * 
 * iOS and Chrome for Android require that a user touch event occur within the
 * same iframe as the video tag before they will respect a play() call. As such
 * we have implemented the VideoPlayerModule.play()for the in-page API to ignore
 * calls until the user has clicked on the player.
 * 
 * For the plugin API (which runs inside the same iframe) we allow play() calls
 * to be made at any time in order to allow for custom play controls. However,
 * if you call play() before any user interaction the side effects will be an
 * endless loading spinner and the removal of the video still.
 * 
 * 
 * @example &lt;button id="playButton" type="button"
 *          onClick="videoPlayer.play()"&gt; Play &lt;/button&gt;
 */
brightcove.api.modules.VideoPlayerModule.prototype.play = function() {
	if (this.canPlayWithoutInteraction()) {
		return this._callMethod("play", []);
	}
};

/**
 * Pauses or resumes playback of the current video in the video window.
 * 
 * @param {boolean}
 *            pause Passing a true value will pauses the video playback. Passing
 *            false will resume playback.
 * 
 * @example &lt;button id="pauseButton" type="button"
 *          onClick="videoPlayer.pause()"&gt; Pause &lt;/button&gt;
 */
brightcove.api.modules.VideoPlayerModule.prototype.pause = function(pause) {
	return this._callMethod("pause", [ pause ]);
};

/**
 * Seeks to a specified time position in the video. Note that because a video
 * must seek to a keyframe at times the position seeked to will not match
 * exactly the value sent to this method, and this can vary widely from device
 * to device.
 * 
 * @param {number}
 *            time The time in seconds to seek to.
 * 
 * @example &lt;button id="seekButton" type="button"
 *          onClick="videoPlayer.seek(2)"&gt; Seek &lt;/button&gt;
 */
brightcove.api.modules.VideoPlayerModule.prototype.seek = function(time) {
	return this._callMethod("seek", [ time ]);
};

/**
 * Invokes the callback function with the time position of the currently playing
 * video. If a linear ad is currently playing, this will return the position for
 * the ad.
 * 
 * @param {boolean}
 *            format If true, returns a formatted time string (12:34), else
 *            returns number of seconds.
 * @param {function}
 *            callback The callback function to invoke with the video position.
 * 
 * @example function positionHandler(result) { videoPositionLabel.text = result; }
 * 
 * var APIModules = brightcove.api.modules.APIModules; var videoPlayer =
 * experience.getModule(APIModules.VIDEO_PLAYER);
 * videoPlayer.getVideoPosition(true, positionHandler);
 *  // If you are building a JS plugin, you can call this method synchronously //
 * without the callback parameter.
 * 
 * var position = videoPlayer.getVideoPosition();
 */
brightcove.api.modules.VideoPlayerModule.prototype.getVideoPosition = function(
		format, callback) {
	if (typeof format == "function") {
		callback = format;
		format = false;
	}
	return this._callGetterMethod("getVideoPosition", [ callback, format ]);
};

/**
 * Invokes the callback function with the time duration of the currently playing
 * video. If a linear ad is currently playing, this will return the duration for
 * the ad.
 * 
 * @param {boolean}
 *            formatResult If true, returns a formatted time string (12:34),
 *            else returns number of seconds.
 * @param {function}
 *            callback The callback function to invoke with the video duration.
 * 
 * @example function durationHandler(result) { videoDurationLabel.text = result; }
 * 
 * var APIModules = brightcove.api.modules.APIModules; var videoPlayer =
 * experience.getModule(APIModules.VIDEO_PLAYER);
 * videoPlayer.getVideoDuration(true, durationHandler);
 *  // If you are building a JS plugin, you can call this method synchronously //
 * without the callback parameter.
 * 
 * var duration = videoPlayer.getVideoDuration();
 */
brightcove.api.modules.VideoPlayerModule.prototype.getVideoDuration = function(
		formatResult, callback) {
	if (typeof formatResult == "function") {
		callback = formatResult;
		formatResult = false;
	}
	return this._callGetterMethod("getVideoDuration",
			[ callback, formatResult ]);
};

/**
 * Invokes the callback function with a boolean as to whether the video
 * currently displayed in the video window is playing. If a linear ad is
 * currently playing, this returns the state of the ad.
 * 
 * @param {function}
 *            callback The callback function to invoke with the player state.
 * 
 * @example function isPlayingHandler(result) { customPlayButton.enabled =
 *          !result; customPauseButton.enabled = result; }
 * 
 * var APIModules = brightcove.api.modules.APIModules; var videoPlayer =
 * experience.getModule(APIModules.VIDEO_PLAYER);
 * videoPlayer.getIsPlaying(isPlayingHandler);
 *  // If you are building a JS plugin, you can call this method synchronously //
 * without the callback parameter.
 * 
 * var isPlaying = videoPlayer.getIsPlaying();
 */
brightcove.api.modules.VideoPlayerModule.prototype.getIsPlaying = function(
		callback) {
	return this._callGetterMethod("getIsPlaying", [ callback ]);
};

/**
 * Returns a boolean that notes if the user needs to interact with the video
 * before you can programmatically start playback either via play() or
 * loadVideoBy*().
 * 
 * @return {boolean} If playback can currently be initiated programmatically.
 * 
 * @example var APIModules = brightcove.api.modules.APIModules; var videoPlayer =
 *          experience.getModule(APIModules.VIDEO_PLAYER); if
 *          (videoPlayer.canPlayWithoutInteraction()) { videoPlayer.play(); }
 */
brightcove.api.modules.VideoPlayerModule.prototype.canPlayWithoutInteraction = function() {
	return this._canPlayWithoutUserInteraction;
};

/**
 * Cues a video in the video window based on its ID. If the video is not already
 * loaded into the player, it will be fetched from the server.
 * 
 * @param {number}
 *            id The ID of the video to be cued.
 * @example var APIModules = brightcove.api.modules.APIModules; var videoPlayer =
 *          experience.getModule(APIModules.VIDEO_PLAYER);
 *          videoPlayer.cueVideoByID(12345);
 */
brightcove.api.modules.VideoPlayerModule.prototype.cueVideoByID = function(id) {
	return this._callMethod("cueVideoByID", [ id ]);
};

/**
 * Cues a video in the video window based on its reference ID. If the video is
 * not already loaded into the player, it will be fetched from the server.
 * 
 * @param {string}
 *            referenceID The reference ID of the video to be cued.
 * @example var APIModules = brightcove.api.modules.APIModules; var videoPlayer =
 *          experience.getModule(APIModules.VIDEO_PLAYER);
 *          videoPlayer.cueVideoByReferenceID("breakingNews123");
 */
brightcove.api.modules.VideoPlayerModule.prototype.cueVideoByReferenceID = function(
		id) {
	return this._callMethod("cueVideoByReferenceID", [ id ]);
};

/**
 * Gets the current state of privacy mode (which is either set through the embed
 * code or via an API).
 * 
 * @param {function}
 *            callback The callback function to invoke with the current state of
 *            privacy mode.
 * 
 * @example var privacyMode; function privacyModeHandler(result) { privacyMode =
 *          result; }
 * 
 * var APIModules = brightcove.api.modules.APIModules; var videoPlayer =
 * experience.getModule(APIModules.VIDEO_PLAYER);
 * videoPlayer.getPrivacyMode(privacyModeHandler);
 *  // If you are building a JS plugin, you can call this method synchronously //
 * without the callback parameter. var isPrivacyMode =
 * videoPlayer.getPrivacyMode();
 */
brightcove.api.modules.VideoPlayerModule.prototype.getPrivacyMode = function(
		callback) {
	return this._callGetterMethod("getPrivacyMode", [ callback ]);
};

/**
 * Sets the current state of privacy mode (which is either set through the embed
 * code or via an API).
 * 
 * @param {string}
 *            mode Value to set privacy mode to.
 * 
 * @example var APIModules = brightcove.api.modules.APIModules; var videoPlayer =
 *          experience.getModule(APIModules.VIDEO_PLAYER);
 *          videoPlayer.setPrivacyMode(true);
 */
brightcove.api.modules.VideoPlayerModule.prototype.setPrivacyMode = function(
		mode) {
	return this._callMethod("setPrivacyMode", [ mode ]);
};

/**
 * Returns a transparent HTML element that is positioned directly over top of
 * the video element. Any HTML elements that are added as children of the
 * overlay surface will be displayed on top of the video. This space can be used
 * to create interactive elements for the viewer during playback. These elements
 * are only visible during in-page playback; overlays will not show up when
 * running in full-screen mode on a mobile device, for instance.
 * <p>
 * <strong>Note:</strong> Native browser controls may capture click events on
 * overlays. Interactive overlays should not be used with Chromeless players for
 * this reason. For maximum device compatibility, use a player with chrome or a
 * plain VideoDisplay with custom javascript controls.
 * <p>
 * <strong>This method is only available to javascript plugins delivered within
 * the iframe.</strong>
 * 
 * @name brightcove.api.modules.VideoPlayerModule.prototype.overlay
 * @function
 */

/**
 * Returns an object that represents the ranges of time that are available to be
 * seeked to within the current video. It consists of three properties:
 * 
 * <dl>
 * <dt>length:
 * <dt>
 * <dd>the number of ranges available</dd>
 * <dt>start(index):</dt>
 * <dd>a function that returns the start time for the range with the given
 * index, in seconds</dd>
 * <dt>end(index):</dt>
 * <dd>a function that returns the end time for the range with the given, in
 * seconds</dd>
 * </dl>
 * 
 * These properties have the same semantics as the <a
 * href="http://www.whatwg.org/specs/web-apps/current-work/#timeranges"> HTML
 * TimeRanges object</a>.
 * <p>
 * <strong>This method is only available to javascript plugins delivered within
 * the iframe.</strong>
 * 
 * @name brightcove.api.modules.VideoPlayerModule.prototype.seekable
 * @function
 * @returns an object that can be queried for the seekable time ranges currently
 *          available.
 */

/**
 * Set the callbacks to be invoked when the video is loading. This method takes
 * an object with the following optional properties:
 * <dl>
 * <dt>show:</dt>
 * <dd> the function to call when loading a video is taking longer than
 * expected. By default, the player will show a standard loading animation when
 * this occurs.If you do not want this behavior, you can return the value
 * <code>false</code> from your handler to disable it. </dd>
 * <dt>hide:</dt>
 * <dd> the function to call when loading the video has finished and playback is
 * about to begin. </dd>
 * </dl>
 * 
 * <strong>This method is only available to javascript plugins delivered within
 * the iframe.</strong>
 * 
 * <p>
 * You could provide a custom message to replace the animation like this:
 * 
 * @example videoPlayerModule.overlay().innerHTML = '&lt;p
 *          id="loading"&gt;Loading...&lt;/p&gt;';
 *          videoPlayerModule.loadingCallbacks({ show: function() {
 *          document.querySelector('#loading').style.cssText = 'display: block';
 *          return false; } });
 * @name brightcove.api.modules.VideoPlayerModule.prototype.loadingCallbacks
 * @function
 */

/**
 * Set the callbacks to be invoked when video is paused and the play overlay is
 * displayed. This method takes an object with the following optional
 * properties:
 * <dl>
 * <dt>show:</dt>
 * <dd> the function to call when the player is paused. By default, the player
 * will show a standard semi-transparent play button when this occurs. If you do
 * not want this behavior, you can return the value <code>false</code> from
 * your handler to disable it. </dd>
 * <dt>hide:</dt>
 * <dd> the function to call when playback has resumed and the play overlay is
 * about to be hidden. </dd>
 * </dl>
 * 
 * <p>
 * If your plugin loads after the player is first ready, the default play
 * overlay will still display initially. If you'd like to delay player load
 * until your plugin is ready and ensure that the default overlay never
 * displays, consider making your plugin blocking. For more information on
 * blocking plugins, see "Ready for Playback (Blocking plugins)" at
 * http://support.brightcove.com/en/docs/creating-ad-plug-html-players.
 * 
 * <strong>This method is only available to javascript plugins delivered within
 * the iframe.</strong>
 * 
 * <p>
 * You could provide a custom button to replace the standard one like this:
 * 
 * @example videoPlayerModule.overlay().innerHTML = '&lt;p id="resume"&gt;Resume
 *          Video&lt;/p&gt;'; videoPlayerModule.playOverlayCallbacks({ show:
 *          function() { document.querySelector('#resume').style.cssText =
 *          'display: block'; return false; } });
 * @name brightcove.api.modules.VideoPlayerModule.prototype.playOverlayCallbacks
 * @function
 */

brightcove.internal._modules[brightcove.api.modules.APIModules.VIDEO_PLAYER] = brightcove.api.modules.VideoPlayerModule;

// this is here just to make sure that the API is initialized
// for a player correctly if it happened to have been loaded
// after the player itself was loaded on the page
if (brightcove._queuedAPICalls && brightcove._queuedAPICalls.length) {
	while (brightcove._queuedAPICalls.length) {
		brightcove.handleAPICallForHTML(brightcove._queuedAPICalls.shift());
	}
}
var brightcove = brightcove || {};
(function() {

	/**
	 * Calls the embedded Flash player with the specified data.
	 * 
	 * @param callback
	 *            The callback to invoke in the player.
	 * @param params
	 *            The params (including the module and method) to pass to the
	 *            player.
	 * 
	 * @return The result of the method call.
	 */
	var _callFlash = function(callback, params) {
		var callbackArray = callback.split(brightcove.internal._ID_DELIM);
		if (callbackArray.length < 2) {
			return undefined;
		}
		if (callbackArray[0].length < 1) {
			return undefined;
		}
		var flashId = callbackArray[0];
		var callbackName = callbackArray[1];
		var experience = document.getElementById(flashId);
		if (experience.tagName == "IFRAME") {
			return experience.contentWindow.postMessage(JSON.stringify({
				api : 1,
				callback : callback,
				params : params
			}), experience.src);
		} else {
			if (experience[callbackName] != null) {
				return experience[callbackName](brightcove.internal.xml
						._convertToXML(params, "js2flash"));
			}
		}
	};

	if (brightcove && brightcove.api && brightcove.api.modules
			&& brightcove.api.modules.APIModule) {
		brightcove.api.modules.APIModule.prototype._callFlash = _callFlash;
	} else {
		brightcove._callFlash = _callFlash;
	}

})();
