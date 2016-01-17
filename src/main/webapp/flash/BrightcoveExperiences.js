if (brightcove == undefined) {
	var brightcove = {};
	brightcove.getExperience = function() {
		alert("Please import APIModules_all.js in order to use the API.");
	};
}
if (brightcove.experiences == undefined) {
	brightcove.servicesURL = 'http://c.brightcove.com/services';
	brightcove.cdnURL = 'http://admin.brightcove.com';
	brightcove.secureCDNURL = 'https://sadmin.brightcove.com';
	brightcove.secureServicesURL = 'https://secure.brightcove.com/services';
	brightcove.pubHost = 'c.$pubcode$.$zoneprefix$$zone$';
	brightcove.pubSecureHost = 'secure.$pubcode$.$zoneprefix$$zone$';
	brightcove.pubSubdomain = 'ariessaucetown.local';
	brightcove.experiences = {};
	brightcove.experienceObjects = {};
	brightcove.timeouts = {};
	brightcove.flashTimeoutInterval = 10000;
	brightcove.htmlTimeoutInterval = 10000;
	brightcove.experienceNum = 0;
	brightcove.majorVersion = 9;
	brightcove.majorRevision = 0;
	brightcove.minorRevision = 28;
	brightcove.servlet = {
		AS3 : "federated_f9",
		HTML : "htmlFederated"
	};
	brightcove.playerType = {
		FLASH : "flash",
		HTML : "html",
		FLASH_IFRAME : "flashIFrame",
		INSTALLER : "installer",
		NO_SUPPORT : "nosupport"
	};
	brightcove.errorCodes = {
		UNKNOWN : 0,
		DOMAIN_RESTRICTED : 1,
		GEO_RESTRICTED : 2,
		INVALID_ID : 3,
		NO_CONTENT : 4,
		UNAVAILABLE_CONTENT : 5,
		UPGRADE_REQUIRED_FOR_VIDEO : 6,
		UPGRADE_REQUIRED_FOR_PLAYER : 7,
		SERVICE_UNAVAILABLE : 8
	};
	brightcove.defaultParam = {};
	brightcove.defaultParam.width = '100%';
	brightcove.defaultParam.height = '100%';
	brightcove.defaultFlashParam = {};
	brightcove.defaultFlashParam.allowScriptAccess = 'always';
	brightcove.defaultFlashParam.allowFullScreen = 'true';
	brightcove.defaultFlashParam.seamlessTabbing = false;
	brightcove.defaultFlashParam.swliveconnect = true;
	brightcove.defaultFlashParam.wmode = 'window';
	brightcove.defaultFlashParam.quality = 'high';
	brightcove.defaultFlashParam.bgcolor = '#999999';
	brightcove.hasActiveX = brightcove.isIE = (window.ActiveXObject != undefined);
	brightcove.userAgent = navigator.userAgent;
	brightcove._queuedAPICalls = [];
	var brightcoveJS = brightcove;
	brightcove.createExperiences = function(pEvent, pElementID) {
		var experiences = [];
		var params;
		var experience;
		var flashSupport = brightcove.checkFlashSupport();
		var htmlSupport = brightcove.checkHtmlSupport();
		if (pElementID != null) {
			experiences.push(document.getElementById(pElementID));
		} else {
			experiences = brightcove.collectExperiences();
		}
		if (brightcove.hasActiveX) {
			params = document.getElementsByTagName('param');
		}
		var urlParams = brightcove.cacheUrlParams();
		var numExperiences = experiences.length;
		for (var i = 0; i < numExperiences; i++) {
			experience = experiences[i];
			experience = brightcove.copyDefaultParams(experience);
			experience = brightcove.copySnippetParams(experience, params);
			experience = brightcove.copyUrlParams(experience, urlParams,
					numExperiences);
			var playerType = brightcove.determinePlayerType(experience,
					flashSupport, htmlSupport);
			var secureConnections = false;
			if (playerType == brightcove.playerType.HTML) {
				secureConnections = experience.params.secureHTMLConnections == "true";
			} else {
				secureConnections = experience.params.secureConnections == "true";
			}
			if (playerType == brightcove.playerType.NO_SUPPORT) {
				brightcove.renderInstallGif(experience, secureConnections);
				brightcove.reportUpgradeRequired(experience);
				continue;
			}
			if (playerType == brightcove.playerType.HTML) {
				delete experience.params.linkBaseURL;
			} else {
				if (experience.params.includeAPI
						&& experience.params.templateReadyHandler != null) {
					experience.params.originalTemplateReadyHandler = experience.params.templateReadyHandler;
					var handlerName = "templateReadyHandler" + experience.id;
					brightcove[handlerName] = (function(id) {
						return function(event) {
							if (brightcove.internal != null
									&& brightcove.internal._instances[id] != null) {
								brightcove._addModuleToEvent(id, event);
							}
							var player = brightcove.experienceObjects[id];
							brightcove.callHandlerForPlayer(player,
									"originalTemplateReadyHandler", event);
						};
					})(experience.id);
					experience.params.templateReadyHandler = 'brightcove["'
							+ handlerName + '"]';
				}
			}
			var file = brightcove.generateRequestUrl(experience, playerType,
					secureConnections);
			if (document.location.protocol == "http:") {
				var event = 'http://goku.brightcove.com/1pix.gif?';
				var gokuParams = [
						"dcsuri=/viewer/player_load_req",
						"playerType=" + playerType,
						"playerURL="
								+ encodeURIComponent(document.location || "") ];
				var image = brightcove.createElement('image');
				for ( var j in experience.params) {
					gokuParams.push([ encodeURIComponent(j) + "="
							+ encodeURIComponent(experience.params[j]) ]);
				}
				event += gokuParams.join('&');
				image.src = event;
			}
			brightcove.renderExperience(experience, file, playerType,
					secureConnections);
		}
	};
	brightcove.collectExperiences = function() {
		var experiences = [];
		var allObjects = document.getElementsByTagName('object');
		var numObjects = allObjects.length;
		for (var i = 0; i < numObjects; i++) {
			if (/\bBrightcoveExperience\b/.test(allObjects[i].className)) {
				if (allObjects[i].type != 'application/x-shockwave-flash') {
					experiences.push(allObjects[i]);
				}
			}
		}
		return experiences;
	};
	brightcove.cacheUrlParams = function() {
		var urlParams = {};
		urlParams.playerKey = decodeURIComponent(brightcove
				.getParameter("bckey"));
		urlParams.playerID = brightcove.getParameter("bcpid");
		urlParams.titleID = brightcove.getParameter("bctid");
		urlParams.lineupID = brightcove.getParameter("bclid");
		urlParams.autoStart = brightcove.getParameter("autoStart");
		urlParams.debuggerID = brightcove.getParameter("debuggerID");
		urlParams.forceHTML = brightcove.getParameter("forceHTML");
		urlParams.forceFlashIFrame = brightcove
				.getParameter("forceFlashIFrame");
		urlParams.debug = brightcove.getParameter("debug");
		urlParams.showNoContentMessage = brightcove
				.getParameter("showNoContentMessage");
		urlParams.htmlDefaultBitrate = brightcove
				.getParameter("htmlDefaultBitrate");
		urlParams.linkSrc = brightcove.getParameter("linkSrc");
		return urlParams;
	};
	brightcove.copyDefaultParams = function(experience) {
		if (!experience.params)
			experience.params = {};
		if (!experience.flashParams)
			experience.flashParams = {};
		for ( var i in brightcove.defaultParam) {
			experience.params[i] = brightcove.defaultParam[i];
		}
		for ( var j in brightcove.defaultFlashParam) {
			experience.flashParams[j] = brightcove.defaultFlashParam[j];
		}
		if (experience.id.length > 0) {
			experience.params.flashID = experience.id;
		} else {
			experience.id = experience.params.flashID = 'bcExperienceObj'
					+ (brightcove.experienceNum++);
		}
		return experience;
	};
	brightcove.copySnippetParams = function(experience, params) {
		if (!brightcove.hasActiveX) {
			params = experience.getElementsByTagName('param');
		}
		var numParams = params.length;
		var param;
		for (var j = 0; j < numParams; j++) {
			param = params[j];
			if (brightcove.hasActiveX && param.parentNode.id != experience.id) {
				continue;
			}
			experience.params[param.name] = param.value;
		}
		if (experience.params.bgcolor != undefined)
			experience.flashParams.bgcolor = experience.params.bgcolor;
		if (experience.params.wmode != undefined)
			experience.flashParams.wmode = experience.params.wmode;
		if (experience.params.seamlessTabbing != undefined)
			experience.flashParams.seamlessTabbing = experience.params.seamlessTabbing;
		return experience;
	};
	brightcove.copyUrlParams = function(experience, urlParams) {
		if (experience.params.autoStart == undefined
				&& urlParams.autoStart != undefined) {
			experience.params.autoStart = urlParams.autoStart;
		}
		if (urlParams.debuggerID != undefined) {
			experience.params.debuggerID = urlParams.debuggerID;
		}
		if (urlParams.forceHTML != undefined && urlParams.forceHTML !== '') {
			experience.params.forceHTML = urlParams.forceHTML;
		}
		if (urlParams.forceFlashIFrame != undefined
				&& urlParams.forceFlashIFrame !== '') {
			experience.params.forceFlashIFrame = urlParams.forceFlashIFrame;
		}
		if (urlParams.debug != undefined && urlParams.debug !== '') {
			experience.params.debug = urlParams.debug;
		}
		if (urlParams.showNoContentMessage != undefined
				&& urlParams.showNoContentMessage != '') {
			experience.params.showNoContentMessage = urlParams.showNoContentMessage;
		}
		if (urlParams.htmlDefaultBitrate != undefined
				&& urlParams.htmlDefaultBitrate !== '') {
			experience.params.htmlDefaultBitrate = urlParams.htmlDefaultBitrate;
		}
		if (urlParams.linkSrc != undefined && urlParams.linkSrc != '') {
			experience.params.linkSrc = urlParams.linkSrc;
		}
		var overrideContent = (urlParams.playerID.length < 1 && urlParams.playerKey.length < 1)
				|| (urlParams.playerID == experience.params.playerID)
				|| (urlParams.playerKey == experience.params.playerKey);
		if (overrideContent) {
			if (urlParams.titleID.length > 0) {
				experience.params.videoID = urlParams.titleID;
				experience.params["@videoPlayer"] = urlParams.titleID;
				experience.params.autoStart = (experience.params.autoStart != "false" && urlParams.autoStart != "false");
			}
			if (urlParams.lineupID.length > 0) {
				experience.params.lineupID = urlParams.lineupID;
			}
		}
		return experience;
	};
	brightcove.determinePlayerType = function(experience, flashSupport,
			htmlSupport) {
		if (flashSupport == null && htmlSupport == false) {
			return brightcove.playerType.NO_SUPPORT;
		}
		if (experience.params.forceHTML) {
			if (window.console) {
				var message = "The forceHTML parameter was used for the Brightcove player. This value should ONLY be used for";
				message += " development and testing purposes and is not supported in production environments.";
				console.log(message);
			}
			return brightcove.playerType.HTML;
		}
		if (experience.params.forceFlashIFrame
				|| (brightcove.isMetroIE() && flashSupport == null)) {
			return brightcove.playerType.FLASH_IFRAME;
		}
		if (flashSupport != null) {
			if (brightcove.isFlashVersionSufficient(experience, flashSupport)) {
				return brightcove.playerType.FLASH;
			} else {
				return brightcove.playerType.INSTALLER;
			}
		}
		if (htmlSupport) {
			if (brightcove.isSupportedHTMLDevice()
					|| experience.params.htmlFallback) {
				return brightcove.playerType.HTML;
			}
		}
		return brightcove.playerType.NO_SUPPORT;
	};
	brightcove.isFlashVersionSufficient = function(experience, flashSupport) {
		if (flashSupport == null)
			return false;
		var setMajorVersion = false;
		var requestedMajorVersion;
		var requestedMajorRevision;
		var requestedMinorRevision;
		if (experience.params.majorVersion != undefined) {
			requestedMajorVersion = parseInt(experience.params.majorVersion, 10);
			setMajorVersion = true;
		} else {
			requestedMajorVersion = brightcove.majorVersion;
		}
		if (experience.params.majorRevision != undefined) {
			requestedMajorRevision = parseInt(experience.params.majorRevision,
					10);
		} else {
			if (setMajorVersion) {
				requestedMajorRevision = 0;
			} else {
				requestedMajorRevision = brightcove.majorRevision;
			}
		}
		if (experience.params.minorRevision != undefined) {
			requestedMinorRevision = parseInt(experience.params.minorRevision,
					10);
		} else {
			if (setMajorVersion) {
				requestedMinorRevision = 0;
			} else {
				requestedMinorRevision = brightcove.minorRevision;
			}
		}
		return (flashSupport.majorVersion > requestedMajorVersion
				|| (flashSupport.majorVersion == requestedMajorVersion && flashSupport.majorRevision > requestedMajorRevision) || (flashSupport.majorVersion == requestedMajorVersion
				&& flashSupport.majorRevision == requestedMajorRevision && flashSupport.minorRevision >= requestedMinorRevision));
	};
	brightcove.generateRequestUrl = function(experience, playerType,
			secureConnections) {
		var file;
		if (playerType == brightcove.playerType.INSTALLER) {
			file = brightcove.cdnURL + "/viewer/playerProductInstall.swf";
			var MMPlayerType = brightcove.hasActiveX ? "ActiveX" : "PlugIn";
			document.title = document.title.slice(0, 47)
					+ " - Flash Player Installation";
			var MMdoctitle = document.title;
			file += "?&MMredirectURL=" + window.location + '&MMplayerType='
					+ MMPlayerType + '&MMdoctitle=' + MMdoctitle;
			brightcove.reportUpgradeRequired(experience);
		} else {
			if (secureConnections) {
				file = brightcove.getPubURL(brightcove.secureServicesURL,
						brightcove.pubSecureHost, experience.params.pubCode);
			} else {
				file = brightcove.getPubURL(brightcove.servicesURL,
						brightcove.pubHost, experience.params.pubCode);
			}
			var servlet = (playerType == brightcove.playerType.HTML) ? brightcove.servlet.HTML
					: brightcove.servlet.AS3;
			file += '/viewer/' + servlet + '?' + brightcove.getOverrides();
			for ( var config in experience.params) {
				file += '&' + encodeURIComponent(config) + '='
						+ encodeURIComponent(experience.params[config]);
			}
		}
		return file;
	};
	brightcove.renderInstallGif = function(experience, secureConnections) {
		var containerID = '_container' + experience.id;
		var container = brightcove.createElement('span');
		if (experience.params.height
				.charAt(experience.params.height.length - 1) == "%") {
			container.style.display = 'block';
		} else {
			container.style.display = 'inline-block';
		}
		container.id = containerID;
		var cdnURL = secureConnections ? brightcove.secureCDNURL
				: brightcove.cdnURL;
		var upgradeFlashImage = cdnURL.indexOf('.co.jp') > 0 ? "upgrade_flash_player_kk.gif"
				: "upgrade_flash_player2.gif";
		var linkHTML = "<a href='http://www.adobe.com/go/getflash/' target='_blank'><img src='"
				+ cdnURL
				+ "/viewer/"
				+ upgradeFlashImage
				+ "' alt='Get Flash Player' width='314' height='200' border='0'></a>";
		experience.parentNode.replaceChild(container, experience);
		document.getElementById(containerID).innerHTML = linkHTML;
	};
	brightcove.renderExperience = function(experience, file, playerType,
			secureConnections) {
		var experienceElement;
		var experienceID = experience.id;
		var container;
		var timeout = brightcove.flashTimeoutInterval;
		if (!(experience.params.playerKey || experience.params.playerID
				|| experience.params.playerId || experience.params.playerid)) {
			if (window.console) {
				console
						.log("No playerID or playerKey was found for the Brightcove player, so it can not be rendered.");
			}
			return;
		}
		brightcove.experienceObjects[experienceID] = experience;
		var unminified = (brightcove.getParameter("unminified") == "true")
				|| (experience.params.unminified === "true");
		if (experience.params.includeAPI === "true"
				&& !(brightcove._apiRequested || brightcove.api)) {
			var source = "/js/api/";
			if (unminified) {
				source += "unminified/";
			}
			source += "SmartPlayerAPI.js";
			var apiInclude = brightcove.createElement('script');
			apiInclude.type = "text/javascript";
			var cdnURL = secureConnections ? brightcove.secureCDNURL
					: brightcove.cdnURL;
			apiInclude.src = "SmartPlayerAPI.js";
			experience.parentNode.appendChild(apiInclude);
			brightcove._apiRequested = true;
		}
		file += "&startTime=" + new Date().getTime();
		if (playerType === brightcove.playerType.HTML) {
			timeout = brightcove.htmlTimeoutInterval;
			file += "&refURL="
					+ (window.document.referrer ? window.document.referrer
							: 'not available');
			if (unminified) {
				file += "&unminified=true";
			}
			experienceElement = brightcove.createIFrame(experience);
			experience.parentNode.replaceChild(experienceElement, experience);
			brightcove.experiences[experienceID] = experienceElement;
			experience.element = experienceElement;
			if (experience.params.videoID || experience.params.videoId) {
				file += "&"
						+ encodeURIComponent("@videoPlayer")
						+ "="
						+ encodeURIComponent(experience.params.videoID
								|| experience.params.videoId);
			}
			experienceElement.src = file;
		} else if (playerType === brightcove.playerType.FLASH_IFRAME) {
			var currentCDN = secureConnections ? brightcove.secureCDNURL
					: brightcove.cdnURL;
			var iframeURL = currentCDN + "/js/flash_iframe.html?parentPage="
					+ window.location.toString().split("?")[0];
			iframeURL += '&currentCDN=' + currentCDN;
			if (unminified) {
				iframeURL += '&unminified=' + unminified;
			}
			experienceElement = brightcove.createIFrame(experience);
			experience.parentNode.replaceChild(experienceElement, experience);
			brightcove.experiences[experienceID] = experienceElement;
			experience.element = experienceElement;
			experienceElement.src = iframeURL;
			window.addEventListener('message', function(event) {
				if (event.origin.split("/")[2] !== currentCDN.split("/")[2])
					return;
				var data = JSON.parse(event.data);
				if (data != "bcIframeInitialized") {
					return;
				}
				var playerConfig;
				if (brightcove.hasActiveX) {
					experience.flashParams.movie = file;
					var flashEmbedStr = brightcove.getFlashEmbedString(
							experience, secureConnections);
					playerConfig = {
						activeX : flashEmbedStr,
						height : experience.params.height,
						id : '_container' + experience.id,
						file : file
					};
				} else {
					playerConfig = brightcove.getFlashObjectParams(experience,
							file);
				}
				var playerConfigStr = JSON.stringify(playerConfig);
				experienceElement.contentWindow.postMessage(playerConfigStr,
						currentCDN);
			}, false);
			window.addEventListener('message', function(event) {
				if (event.origin.split("/")[2] !== currentCDN.split("/")[2])
					return;
				var data = JSON.parse(event.data);
				if (data.api && brightcove.internal
						&& brightcove.internal._setAPICallback) {
					if (data.api == "apiCallback") {
						brightcove.internal._setAPICallback(data.pid,
								data.callback, iframeURL);
					} else if (data.api == "loadEvent") {
						window[data.callback](data.event);
					} else if (data.api == "onTemplateReadyEvent") {
						brightcove[data.callback](data.event);
					}
				}
			}, false);
		} else {
			if (brightcove.hasActiveX) {
				experience.flashParams.movie = file;
				var flashEmbedStr = brightcove.getFlashEmbedString(experience,
						secureConnections);
				var containerID = '_container' + experience.id;
				container = brightcove.createFlashEmbed(containerID,
						experience.params.height);
				experience.parentNode.replaceChild(container, experience);
				document.getElementById(containerID).innerHTML = flashEmbedStr;
				brightcove.experiences[experienceID] = container;
			} else {
				var flashObjectParams = brightcove.getFlashObjectParams(
						experience, file);
				experienceElement = brightcove
						.createFlashObject(flashObjectParams);
				experience.parentNode.replaceChild(experienceElement,
						experience);
				brightcove.experiences[experienceID] = experienceElement;
			}
		}
		brightcove.timeouts[experience.id] = setTimeout(function() {
			brightcove.handleExperienceTimeout(experienceID);
		}, timeout);
	};
	brightcove.createIFrame = function(experience) {
		var iframeElement = brightcove.createElement('iframe');
		iframeElement.id = experience.id;
		iframeElement.width = experience.params.width;
		iframeElement.height = experience.params.height;
		iframeElement.className = experience.className;
		iframeElement.frameborder = 0;
		iframeElement.scrolling = "no";
		iframeElement.style.borderStyle = "none";
		return iframeElement;
	};
	brightcove.getFlashEmbedString = function(experience, secureConnections) {
		var options = '';
		var flashParams = experience.flashParams;
		for ( var pOption in flashParams) {
			options += '<param name="' + pOption + '" value="'
					+ experience.flashParams[pOption] + '" />';
		}
		var protocol = secureConnections ? "https" : "http";
		return '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'
				+ ' codebase="'
				+ protocol
				+ '://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version='
				+ brightcove.majorVersion + ',' + brightcove.majorRevision
				+ ',' + brightcove.minorRevision + ',0"' + ' id="'
				+ experience.id + '"' + ' width="' + experience.params.width
				+ '"' + ' height="' + experience.params.height + '"'
				+ ' type="application/x-shockwave-flash"'
				+ ' class="BrightcoveExperience">' + options + '</object>';
	};
	brightcove.getFlashObjectParams = function(experience, file) {
		var experienceObject = {};
		console.trace();
		experienceObject.type = 'application/x-shockwave-flash';
		experienceObject.data = file;
		experienceObject.id = experience.params.flashID;
		experienceObject.width = experience.params.width;
		experienceObject.height = experience.params.height;
		experienceObject.className = experience.className;
		experienceObject.seamlesstabbing = experience.flashParams.seamlessTabbing;
		for ( var config in experience.flashParams) {
			experienceObject["flashParam_" + config] = experience.flashParams[config];
		}
		return experienceObject;
	};
	brightcove.createFlashEmbed = function(experienceId, height) {
		var container = brightcove.createElement('span');
		if (height.charAt(height.length - 1) == "%") {
			container.style.display = 'block';
		} else {
			container.style.display = 'inline-block';
		}
		container.id = experienceId;
		return container;
	};
	brightcove.createFlashObject = function(playerConfig) {
		var experienceElement = brightcove.createElement('object');
		experienceElement.type = playerConfig.type;
		experienceElement.data = playerConfig.data;
		experienceElement.id = playerConfig.id;
		experienceElement.width = playerConfig.width;
		experienceElement.height = playerConfig.height;
		experienceElement.className = playerConfig.className;
		experienceElement.setAttribute("seamlesstabbing",
				playerConfig.seamlessTabbing);
		var tempParam;
		var flashParamPrefix = "flashParam_";
		for ( var config in playerConfig) {
			var flashParamInd = config.indexOf(flashParamPrefix);
			if (flashParamInd == 0) {
				tempParam = brightcove.createElement('param');
				tempParam.name = config.substring(flashParamPrefix.length);
				tempParam.value = playerConfig[config];
				experienceElement.appendChild(tempParam);
			}
		}
		return experienceElement;
	};
	brightcove.handleExperienceTimeout = function(pID) {
		brightcove.executeErrorHandlerForExperience(
				brightcove.experienceObjects[pID], {
					type : "templateError",
					errorType : "serviceUnavailable",
					code : brightcove.errorCodes.SERVICE_UNAVAILABLE,
					info : pID
				});
	};
	brightcove.reportPlayerLoad = function(pID) {
		var timeout = brightcove.timeouts[pID];
		if (timeout) {
			clearTimeout(timeout);
		}
	};
	brightcove.reportUpgradeRequired = function(pExperience) {
		brightcove.executeErrorHandlerForExperience(pExperience, {
			type : "templateError",
			errorType : "upgradeRequiredForPlayer",
			code : brightcove.errorCodes.UPGRADE_REQUIRED_FOR_PLAYER,
			info : pExperience.id
		});
	};
	brightcove.checkFlashSupport = function() {
		var hasActiveX = (window.ActiveXObject != undefined);
		return (hasActiveX) ? brightcove.checkFlashSupportIE() : brightcove
				.checkFlashSupportStandard();
	};
	brightcove.checkFlashSupportIE = function() {
		var versions;
		try {
			var flash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
			var version = flash.GetVariable('$version');
			versions = / ([0-9]+),([0-9]+),([0-9]+),/.exec(version);
		} catch (exception) {
			return null;
		}
		return {
			majorVersion : versions[1],
			majorRevision : versions[2],
			minorRevision : versions[3]
		};
	};
	brightcove.isMetroIE = function() {
		var version = 0;
		if (navigator.appVersion.indexOf("MSIE") != -1) {
			var appSplit = navigator.appVersion.split("MSIE");
			if (appSplit.length > 1) {
				version = parseFloat(appSplit[1]);
			}
		}
		if (version < 10 || isNaN(version)) {
			return false;
		}
		var activeXSupport = false;
		try {
			activeXSupport = !!new ActiveXObject("htmlfile");
		} catch (e) {
			activeXSupport = false;
		}
		return !activeXSupport;
	};
	brightcove.checkFlashSupportStandard = function() {
		var versions;
		var majorVersion;
		var majorRevision;
		var minorRevision;
		try {
			if (typeof navigator.plugins != 'undefined'
					&& navigator.plugins.length > 0) {
				if (navigator.plugins["Shockwave Flash 2.0"]
						|| navigator.plugins["Shockwave Flash"]) {
					var swfVersion = navigator.plugins["Shockwave Flash 2.0"] ? " 2.0"
							: "";
					var description = navigator.plugins["Shockwave Flash"
							+ swfVersion].description;
					var filename = navigator.plugins["Shockwave Flash"
							+ swfVersion].filename;
					if (filename.match) {
						if (filename.toLowerCase().match(/lite/)) {
							throw new Error();
						}
					}
					versions = description.split(" ");
					majorVersion = versions[2].split(".")[0];
					majorRevision = versions[2].split(".")[1];
					minorRevision = versions[3];
					if (minorRevision == "") {
						minorRevision = versions[4];
					}
					if (minorRevision[0] == "d") {
						minorRevision = minorRevision.substring(1);
					} else if (minorRevision[0] == "r") {
						minorRevision = minorRevision.substring(1);
						if (minorRevision.indexOf("d") > 0) {
							minorRevision = minorRevision.substring(0,
									minorRevision.indexOf("d"));
						}
					}
				} else {
					throw new Error();
				}
			} else {
				return null;
			}
		} catch (exception) {
			return null;
		}
		return {
			majorVersion : majorVersion,
			majorRevision : majorRevision,
			minorRevision : minorRevision
		};
	};
	brightcove.checkHtmlSupport = function() {
		var v = brightcove.createElement('video');
		var videoSupport = true;
		if (!brightcove.userAgent.match(new RegExp("android", "i"))) {
			videoSupport = !!(v.canPlayType && v.canPlayType(
					'video/mp4; codecs="avc1.42E01E, mp4a.40.2"').replace(/no/,
					''));
		}
		if (brightcove.userAgent.match(/BlackBerry.*Version\/6\.0/)) {
			return false;
		}
		var canvasSupport = !!brightcove.createElement('canvas').getContext;
		return videoSupport && canvasSupport;
	};
	brightcove.isSupportedHTMLDevice = function(pUAString) {
		var types = [ "iPad", "iPhone", "iPod", "android", "Silk", "IEMobile" ];
		var numTypes = types.length;
		var uaString = pUAString || brightcove.userAgent;
		for (var i = 0; i < numTypes; i++) {
			if (uaString.match(new RegExp(types[i], "i"))) {
				return true;
			}
		}
		return false;
	};
	brightcove.getTechnology = function(pExperienceId) {
		for ( var id in brightcove.experiences) {
			if (pExperienceId == id) {
				return (brightcove.experiences[id].tagName == "object") ? brightcove.playerType.FLASH
						: brightcove.playerType.HTML;
			}
		}
		return brightcove.playerType.NO_SUPPORT;
	};
	brightcove.respondToMessages = function(pMessage) {
		if (brightcove.verifyMessage(pMessage)) {
			var messageData = pMessage.data;
			if (messageData.charAt(0) == "\"") {
				if (window.JSON) {
					messageData = window.JSON.parse(messageData);
				} else {
					messageData = brightcove.json_parse(messageData);
				}
			}
			var messageParts = messageData.split("::");
			var type = messageParts[1];
			var messageInfo = "";
			for (var index = 2; index < messageParts.length; index++) {
				messageInfo += messageParts[index];
			}
			var messageJson = messageInfo.split("\n").join(" ");
			var messageDataObject;
			if (window.JSON) {
				messageDataObject = window.JSON.parse(messageJson);
			} else {
				messageDataObject = brightcove.json_parse(messageJson);
			}
			switch (type) {
			case "error":
				brightcove.executeMessageCallback(messageDataObject,
						brightcove.executeErrorHandlerForExperience);
				break;
			case "api":
				brightcove.handleAPICallForHTML(messageDataObject);
				break;
			case "handler":
				var event = brightcove.internal
						._convertDates(messageDataObject.event);
				try {
					brightcove.internal._handlers[messageDataObject.handler]
							(event);
				} catch (e) {
				}
				break;
			case "asyncGetter":
				var data = brightcove.internal
						._convertDates(messageDataObject.data);
				brightcove.internal._handlers[messageDataObject.handler](data);
				break;
			}
		}
	};
	brightcove.verifyMessage = function(pMessage) {
		return (/^brightcove\.player/).test(pMessage.data);
	};
	brightcove.handleAPICallForHTML = function(pMessageObject) {
		var experience = brightcove.experienceObjects[pMessageObject.id];
		if (experience == null) {
			return;
		}
		var id = experience.id;
		var method = pMessageObject.method;
		switch (method) {
		case "initializeBridge":
			brightcove.reportPlayerLoad(id);
			if (pMessageObject.arguments[0]) {
				if (brightcove.internal != null) {
					brightcove.internal._setAPICallback(id, null,
							pMessageObject.arguments[1]);
					brightcove.callHandlerForPlayer(experience,
							"templateLoadHandler", id);
				} else if (brightcove._apiRequested) {
					brightcove._queuedAPICalls.push(pMessageObject);
				}
			}
			break;
		case "callTemplateReady":
			if (brightcove._apiRequested && !brightcove.internal) {
				brightcove._queuedAPICalls.push(pMessageObject);
			} else {
				var event = pMessageObject.arguments;
				brightcove._addModuleToEvent(id, event);
				brightcove.callHandlerForPlayer(experience,
						"templateReadyHandler", event);
			}
			break;
		}
	};
	brightcove._addModuleToEvent = function(pID, pEvent) {
		if (pEvent.type != null && brightcove.api) {
			var experience = brightcove.api.getExperience(pID);
			if (experience) {
				pEvent.target = experience.getModule("experience");
			}
		}
	};
	brightcove.callHandlerForPlayer = function(pExperience, pHandler, pArgument) {
		if (pExperience && pExperience.params && pExperience.params[pHandler]) {
			var namespaceArray = pExperience.params[pHandler].split(".");
			var namespaces;
			if ((namespaces = namespaceArray.length) > 1) {
				var trace = window;
				for (var i = 0; i < namespaces; i++) {
					trace = trace[namespaceArray[i]];
				}
				if (typeof trace === "function") {
					trace(pArgument);
				}
			} else {
				window[pExperience.params[pHandler]](pArgument);
			}
		}
	};
	brightcove.executeErrorHandlerForExperience = function(pExperience,
			pErrorObject) {
		brightcove.callHandlerForPlayer(pExperience, "templateErrorHandler",
				pErrorObject);
	};
	brightcove.executeMessageCallback = function(pMessageDataObject, pCallback) {
		var experience;
		for ( var experienceKey in brightcove.experienceObjects) {
			experience = brightcove.experienceObjects[experienceKey];
			if (experience.element.src === pMessageDataObject.__srcUrl) {
				delete pMessageDataObject.__srcUrl;
				pCallback(experience, pMessageDataObject);
				break;
			}
		}
	};
	brightcove.createExperience = function(pElement, pParentOrSibling, pAppend) {
		if (!pElement.id || pElement.id.length < 1) {
			pElement.id = 'bcExperienceObj' + (brightcove.experienceNum++);
		}
		if (pAppend) {
			pParentOrSibling.appendChild(pElement);
		} else {
			pParentOrSibling.parentNode
					.insertBefore(pElement, pParentOrSibling);
		}
		brightcove.createExperiences(null, pElement.id);
	};
	brightcove.removeExperience = function(pID) {
		if (brightcove.experiences[pID] != null) {
			brightcove.experiences[pID].parentNode
					.removeChild(brightcove.experiences[pID]);
		}
	};
	brightcove.getURL = function() {
		var url;
		if (typeof window.location.search != 'undefined') {
			url = window.location.search;
		} else {
			url = /(\?.*)$/.exec(document.location.href);
		}
		return url;
	};
	brightcove.getOverrides = function() {
		var url = brightcove.getURL();
		var query = new RegExp('@[\\w\\.]+=[^&]+', 'g');
		var value = query.exec(url);
		var overrides = "";
		while (value != null) {
			overrides += "&" + value;
			value = query.exec(url);
		}
		return overrides;
	};
	brightcove.getParameter = function(pName, pDefaultValue) {
		if (pDefaultValue == null)
			pDefaultValue = "";
		var url = brightcove.getURL();
		var query = new RegExp(pName + '=([^&]*)');
		var value = query.exec(url);
		if (value != null) {
			return value[1];
		} else {
			return pDefaultValue;
		}
	};
	brightcove.createElement = function(el) {
		if (document.createElementNS) {
			return document.createElementNS('http://www.w3.org/1999/xhtml', el);
		} else {
			return document.createElement(el);
		}
	};
	brightcove.i18n = {
		'BROWSER_TOO_OLD' : 'The browser you are using is too old. Please upgrade to the latest version of your browser.'
	};
	brightcove.removeListeners = function() {
		if (/KHTML/i.test(navigator.userAgent)) {
			clearInterval(checkLoad);
			document.removeEventListener('load', brightcove.createExperiences,
					false);
		}
		if (typeof document.addEventListener != 'undefined') {
			document.removeEventListener('DOMContentLoaded',
					brightcove.createExperiences, false);
			document.removeEventListener('load', brightcove.createExperiences,
					false);
		} else if (typeof window.attachEvent != 'undefined') {
			window.detachEvent('onload', brightcove.createExperiences);
		}
	};
	brightcove.getPubURL = function(source, host, pubCode) {
		if (!pubCode || pubCode == "")
			return source;
		var re = /^([htps]{4,5}\:\/\/)([^\/\:]+)/i;
		host = host.replace("$pubcode$", pubCode).replace("$zoneprefix$$zone$",
				brightcove.pubSubdomain);
		return source.replace(re, "$1" + host);
	};
	brightcove.createExperiencesPostLoad = function() {
		brightcove.removeListeners();
		brightcove.createExperiences();
	};
	brightcove.encode = function(string) {
		string = escape(string);
		string = string.replace(/\+/g, "%2B");
		string = string.replace(/\-/g, "%2D");
		string = string.replace(/\*/g, "%2A");
		string = string.replace(/\//g, "%2F");
		string = string.replace(/\./g, "%2E");
		string = string.replace(/_/g, "%5F");
		string = string.replace(/@/g, "%40");
		return string;
	};
	if (/KHTML/i.test(navigator.userAgent)) {
		var checkLoad = setInterval(function() {
			if (/loaded|complete/.test(document.readyState)) {
				clearInterval(checkLoad);
				brightcove.createExperiencesPostLoad();
			}
		}, 70);
		document.addEventListener('load', brightcove.createExperiencesPostLoad,
				false);
	}
	if (typeof document.addEventListener != 'undefined') {
		document.addEventListener('DOMContentLoaded',
				brightcove.createExperiencesPostLoad, false);
		document.addEventListener('load', brightcove.createExperiencesPostLoad,
				false);
		window.addEventListener("message", brightcove.respondToMessages, false);
	} else if (typeof window.attachEvent != 'undefined') {
		window.attachEvent('onload', brightcove.createExperiencesPostLoad);
	} else {
		alert(brightcove.i18n.BROWSER_TOO_OLD);
	}
}
brightcove.json_parse = (function() {
	"use strict";
	var state, stack, container, key, value, escapes = {
		'\\' : '\\',
		'"' : '"',
		'/' : '/',
		't' : '\t',
		'n' : '\n',
		'r' : '\r',
		'f' : '\f',
		'b' : '\b'
	}, string = {
		go : function() {
			state = 'ok';
		},
		firstokey : function() {
			key = value;
			state = 'colon';
		},
		okey : function() {
			key = value;
			state = 'colon';
		},
		ovalue : function() {
			state = 'ocomma';
		},
		firstavalue : function() {
			state = 'acomma';
		},
		avalue : function() {
			state = 'acomma';
		}
	}, number = {
		go : function() {
			state = 'ok';
		},
		ovalue : function() {
			state = 'ocomma';
		},
		firstavalue : function() {
			state = 'acomma';
		},
		avalue : function() {
			state = 'acomma';
		}
	}, action = {
		'{' : {
			go : function() {
				stack.push({
					state : 'ok'
				});
				container = {};
				state = 'firstokey';
			},
			ovalue : function() {
				stack.push({
					container : container,
					state : 'ocomma',
					key : key
				});
				container = {};
				state = 'firstokey';
			},
			firstavalue : function() {
				stack.push({
					container : container,
					state : 'acomma'
				});
				container = {};
				state = 'firstokey';
			},
			avalue : function() {
				stack.push({
					container : container,
					state : 'acomma'
				});
				container = {};
				state = 'firstokey';
			}
		},
		'}' : {
			firstokey : function() {
				var pop = stack.pop();
				value = container;
				container = pop.container;
				key = pop.key;
				state = pop.state;
			},
			ocomma : function() {
				var pop = stack.pop();
				container[key] = value;
				value = container;
				container = pop.container;
				key = pop.key;
				state = pop.state;
			}
		},
		'[' : {
			go : function() {
				stack.push({
					state : 'ok'
				});
				container = [];
				state = 'firstavalue';
			},
			ovalue : function() {
				stack.push({
					container : container,
					state : 'ocomma',
					key : key
				});
				container = [];
				state = 'firstavalue';
			},
			firstavalue : function() {
				stack.push({
					container : container,
					state : 'acomma'
				});
				container = [];
				state = 'firstavalue';
			},
			avalue : function() {
				stack.push({
					container : container,
					state : 'acomma'
				});
				container = [];
				state = 'firstavalue';
			}
		},
		']' : {
			firstavalue : function() {
				var pop = stack.pop();
				value = container;
				container = pop.container;
				key = pop.key;
				state = pop.state;
			},
			acomma : function() {
				var pop = stack.pop();
				container.push(value);
				value = container;
				container = pop.container;
				key = pop.key;
				state = pop.state;
			}
		},
		':' : {
			colon : function() {
				if (Object.hasOwnProperty.call(container, key)) {
					throw new SyntaxError('Duplicate key "' + key + '"');
				}
				state = 'ovalue';
			}
		},
		',' : {
			ocomma : function() {
				container[key] = value;
				state = 'okey';
			},
			acomma : function() {
				container.push(value);
				state = 'avalue';
			}
		},
		'true' : {
			go : function() {
				value = true;
				state = 'ok';
			},
			ovalue : function() {
				value = true;
				state = 'ocomma';
			},
			firstavalue : function() {
				value = true;
				state = 'acomma';
			},
			avalue : function() {
				value = true;
				state = 'acomma';
			}
		},
		'false' : {
			go : function() {
				value = false;
				state = 'ok';
			},
			ovalue : function() {
				value = false;
				state = 'ocomma';
			},
			firstavalue : function() {
				value = false;
				state = 'acomma';
			},
			avalue : function() {
				value = false;
				state = 'acomma';
			}
		},
		'null' : {
			go : function() {
				value = null;
				state = 'ok';
			},
			ovalue : function() {
				value = null;
				state = 'ocomma';
			},
			firstavalue : function() {
				value = null;
				state = 'acomma';
			},
			avalue : function() {
				value = null;
				state = 'acomma';
			}
		}
	};
	function debackslashify(text) {
		return text.replace(/\\(?:u(.{4})|([^u]))/g, function(a, b, c) {
			return b ? String.fromCharCode(parseInt(b, 16)) : escapes[c];
		});
	}
	return function(source, reviver) {
		var r, tx = /^[\x20\t\n\r]*(?:([,:\[\]{}]|true|false|null)|(-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)|"((?:[^\r\n\t\\\"]|\\(?:["\\\/trnfb]|u[0-9a-fA-F]{4}))*)")/;
		state = 'go';
		stack = [];
		try {
			for (;;) {
				r = tx.exec(source);
				if (!r) {
					break;
				}
				if (r[1]) {
					action[r[1]][state]();
				} else if (r[2]) {
					value = +r[2];
					number[state]();
				} else {
					value = debackslashify(r[3]);
					string[state]();
				}
				source = source.slice(r[0].length);
			}
		} catch (e) {
			state = e;
		}
		if (state !== 'ok' || (/[^\x20\t\n\r]/).test(source)) {
			throw state instanceof SyntaxError ? state
					: new SyntaxError('JSON');
		}
		return typeof reviver === 'function' ? (function walk(holder, key) {
			var k, v, value = holder[key];
			if (value && typeof value === 'object') {
				for (k in value) {
					if (Object.prototype.hasOwnProperty.call(value, k)) {
						v = walk(value, k);
						if (v !== undefined) {
							value[k] = v;
						} else {
							delete value[k];
						}
					}
				}
			}
			return reviver.call(holder, key, value);
		}({
			'' : value
		}, '')) : value;
	};
}());