webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1)
	__webpack_require__(2)
	__webpack_require__(5)
	__webpack_require__(25)

	var Aviator = __webpack_require__(28)

	__webpack_require__(39)

	Aviator.linkSelector = 'a.aviator'
	Aviator.setRoutes({
	  '/admin': {
	    '/students': {
	      target: __webpack_require__(43),
	      '/': 'index',
	      ':id': 'edit'
	    },
	    '/classes': {
	      target: __webpack_require__(44),
	      '/': 'index',
	      '/:id': {
	        '/new': 'new',
	        '/edit': 'edit',
	        '/delete': 'delete' 
	      }
	    }
	  },
	  '/instructor-sign-in': {
	    target: __webpack_require__(51),
	    '/': 'index'
	  },
	  '/student-sign-in': {
	    target: __webpack_require__(52),
	    '/': 'index'
	  }
	})
	Aviator.dispatch()


/***/ },

/***/ 39:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 43:
/***/ function(module, exports) {

	module.exports = {
	  index: function() {
	    console.log('students index page')
	  }
	}


/***/ },

/***/ 44:
/***/ function(module, exports, __webpack_require__) {

	var qwest = __webpack_require__(45)

	var templates = {
	  'classes-index-template': __webpack_require__(50)
	}

	module.exports = {
	  index: function() {
	    qwest.get('/divisions').then(function(xhr, response) {
	      $('#spa-target').empty().html(templates['classes-index-template'](response))
	    })
	  },
	  edit: function(request) {
	    $("#spa-target").empty().alpaca({
	      "schema": {
	        "title": "Edit Class",
	        "description": "What do you think about Alpaca?",
	        "type": "object",
	        "properties": {
	          "name": {
	            "type": "string",
	            "title": "Name",
	            "required": true
	          },
	          "dayOfTheWeek": {
	            "type": "string",
	            "title": "Day of the Week",
	            "enum": ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
	            "required": true
	          },
	          "startTime": {
	            "type": "string",
	            "title": "Starting Time",
	            "required": true
	          },
	          "endTime": {
	            "type": "string",
	            "title": "Ending Time",
	            "required": true
	          }
	        }
	      },
	      "options": {
	        "form": {
	          "attributes": {
	            "action": "/divisions/" + request.namedParams.id,
	            "method": "put"
	          },
	          "buttons": {
	            "submit": {
	              "title": "Update",
	              "click": function() {
	                console.log('Submitting Form')
	              }
	            }
	          }
	        },
	        // "helper": "Tell us what you think about Alpaca!",
	        "fields": {
	          "name": {
	            // "helper": "Please enter your name.",
	            "placeholder": "Enter a name for the class"
	          },
	          "dayOfTheWeek": {
	            "type": "select",
	            // "helper": "Select your ranking.",
	            "optionLabels": ["Awesome!", "It's Ok", "Hmm..."]
	          },
	          "startTime": {
	            "type": "time"
	          },
	          "endTime": {
	            "type": "time"
	          }
	        }
	      }
	    })

	    // console.log('edit divisions', request.namedParams)
	  },
	  delete: function(request) {
	    console.log('delete divisions', request.namedParams)
	  }
	}


/***/ },

/***/ 45:
/***/ function(module, exports, __webpack_require__) {

	/*! qwest 4.4.5 (https://github.com/pyrsmk/qwest) */

	module.exports = function() {

		var global = typeof window != 'undefined' ? window : self,
			pinkyswear = __webpack_require__(46),
			jparam = __webpack_require__(49),
			defaultOptions = {},
			// Default response type for XDR in auto mode
			defaultXdrResponseType = 'json',
			// Default data type
			defaultDataType = 'post',
			// Variables for limit mechanism
			limit = null,
			requests = 0,
			request_stack = [],
			// Get XMLHttpRequest object
			getXHR = global.XMLHttpRequest? function(){
				return new global.XMLHttpRequest();
			}: function(){
				return new ActiveXObject('Microsoft.XMLHTTP');
			},
			// Guess XHR version
			xhr2 = (getXHR().responseType===''),

		// Core function
		qwest = function(method, url, data, options, before) {
			// Format
			method = method.toUpperCase();
			data = data || null;
			options = options || {};
			for(var name in defaultOptions) {
				if(!(name in options)) {
					if(typeof defaultOptions[name] == 'object' && typeof options[name] == 'object') {
						for(var name2 in defaultOptions[name]) {
							options[name][name2] = defaultOptions[name][name2];
						}
					}
					else {
						options[name] = defaultOptions[name];
					}
				}
			}

			// Define variables
			var nativeResponseParsing = false,
				crossOrigin,
				xhr,
				xdr = false,
				timeout,
				aborted = false,
				attempts = 0,
				headers = {},
				mimeTypes = {
					text: '*/*',
					xml: 'text/xml',
					json: 'application/json',
					post: 'application/x-www-form-urlencoded',
					document: 'text/html'
				},
				accept = {
					text: '*/*',
					xml: 'application/xml; q=1.0, text/xml; q=0.8, */*; q=0.1',
					json: 'application/json; q=1.0, text/*; q=0.8, */*; q=0.1'
				},
				i, j,
				response,
				sending = false,

			// Create the promise
			promise = pinkyswear(function(pinky) {
				pinky.abort = function() {
					if(!aborted) {
						if(xhr && xhr.readyState != 4) { // https://stackoverflow.com/questions/7287706/ie-9-javascript-error-c00c023f
							xhr.abort();
						}
						if(sending) {
							--requests;
							sending = false;
						}
						aborted = true;
					}
				};
				pinky.send = function() {
					// Prevent further send() calls
					if(sending) {
						return;
					}
					// Reached request limit, get out!
					if(requests == limit) {
						request_stack.push(pinky);
						return;
					}
					// Verify if the request has not been previously aborted
					if(aborted) {
						if(request_stack.length) {
							request_stack.shift().send();
						}
						return;
					}
					// The sending is running
					++requests;
					sending = true;
					// Get XHR object
					xhr = getXHR();
					if(crossOrigin) {
						if(!('withCredentials' in xhr) && global.XDomainRequest) {
							xhr = new XDomainRequest(); // CORS with IE8/9
							xdr = true;
							if(method != 'GET' && method != 'POST') {
								method = 'POST';
							}
						}
					}
					// Open connection
					if(xdr) {
						xhr.open(method, url);
					}
					else {
						xhr.open(method, url, options.async, options.user, options.password);
						if(xhr2 && options.async) {
							xhr.withCredentials = options.withCredentials;
						}
					}
					// Set headers
					if(!xdr) {
						for(var i in headers) {
							if(headers[i]) {
								xhr.setRequestHeader(i, headers[i]);
							}
						}
					}
					// Verify if the response type is supported by the current browser
					if(xhr2 && options.responseType != 'auto') {
						try {
							xhr.responseType = options.responseType;
							nativeResponseParsing = (xhr.responseType == options.responseType);
						}
						catch(e) {}
					}
					// Plug response handler
					if(xhr2 || xdr) {
						xhr.onload = handleResponse;
						xhr.onerror = handleError;
						// http://cypressnorth.com/programming/internet-explorer-aborting-ajax-requests-fixed/
						if(xdr) {
							xhr.onprogress = function() {};
						}
					}
					else {
						xhr.onreadystatechange = function() {
							if(xhr.readyState == 4) {
								handleResponse();
							}
						};
					}
					// Plug timeout
					if(options.async) {
						if('timeout' in xhr) {
							xhr.timeout = options.timeout;
							xhr.ontimeout = handleTimeout;
						}
						else {
							timeout = setTimeout(handleTimeout, options.timeout);
						}
					}
					// http://cypressnorth.com/programming/internet-explorer-aborting-ajax-requests-fixed/
					else if(xdr) {
						xhr.ontimeout = function() {};
					}
					// Override mime type to ensure the response is well parsed
					if(options.responseType != 'auto' && 'overrideMimeType' in xhr) {
						xhr.overrideMimeType(mimeTypes[options.responseType]);
					}
					// Run 'before' callback
					if(before) {
						before(xhr);
					}
					// Send request
					if(xdr) {
						// https://developer.mozilla.org/en-US/docs/Web/API/XDomainRequest
						setTimeout(function() {
							xhr.send(method != 'GET'? data : null);
						}, 0);
					}
					else {
						xhr.send(method != 'GET' ? data : null);
					}
				};
				return pinky;
			}),

			// Handle the response
			handleResponse = function() {
				var i, responseType;
				// Stop sending state
				sending = false;
				clearTimeout(timeout);
				// Launch next stacked request
				if(request_stack.length) {
					request_stack.shift().send();
				}
				// Verify if the request has not been previously aborted
				if(aborted) {
					return;
				}
				// Decrease the number of requests
				--requests;
				// Handle response
				try{
					// Process response
					if(nativeResponseParsing) {
						if('response' in xhr && xhr.response === null) {
							throw 'The request response is empty';
						}
						response = xhr.response;
					}
					else {
						// Guess response type
						responseType = options.responseType;
						if(responseType == 'auto') {
							if(xdr) {
								responseType = defaultXdrResponseType;
							}
							else {
								var ct = xhr.getResponseHeader('Content-Type') || '';
								if(ct.indexOf(mimeTypes.json)>-1) {
									responseType = 'json';
								}
								else if(ct.indexOf(mimeTypes.xml) > -1) {
									responseType = 'xml';
								}
								else {
									responseType = 'text';
								}
							}
						}
						// Handle response type
						switch(responseType) {
							case 'json':
								if(xhr.responseText.length) {
									try {
										if('JSON' in global) {
											response = JSON.parse(xhr.responseText);
										}
										else {
											response = new Function('return (' + xhr.responseText + ')')();
										}
									}
									catch(e) {
										throw "Error while parsing JSON body : "+e;
									}
								}
								break;
							case 'xml':
								// Based on jQuery's parseXML() function
								try {
									// Standard
									if(global.DOMParser) {
										response = (new DOMParser()).parseFromString(xhr.responseText,'text/xml');
									}
									// IE<9
									else {
										response = new ActiveXObject('Microsoft.XMLDOM');
										response.async = 'false';
										response.loadXML(xhr.responseText);
									}
								}
								catch(e) {
									response = undefined;
								}
								if(!response || !response.documentElement || response.getElementsByTagName('parsererror').length) {
									throw 'Invalid XML';
								}
								break;
							default:
								response = xhr.responseText;
						}
					}
					// Late status code verification to allow passing data when, per example, a 409 is returned
					// --- https://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
					if('status' in xhr && !/^2|1223/.test(xhr.status)) {
						throw xhr.status + ' (' + xhr.statusText + ')';
					}
					// Fulfilled
					promise(true, [xhr, response]);
				}
				catch(e) {
					// Rejected
					promise(false, [e, xhr, response]);
				}
			},

			// Handle errors
			handleError = function(message) {
				if(!aborted) {
					message = typeof message == 'string' ? message : 'Connection aborted';
					promise.abort();
					promise(false, [new Error(message), xhr, null]);
				}
			},
				
			// Handle timeouts
			handleTimeout = function() {
				if(!aborted) {
					if(!options.attempts || ++attempts != options.attempts) {
						xhr.abort();
						sending = false;
						promise.send();
					}
					else {
						handleError('Timeout (' + url + ')');
					}
				}
			};

			// Normalize options
			options.async = 'async' in options ? !!options.async : true;
			options.cache = 'cache' in options ? !!options.cache : false;
			options.dataType = 'dataType' in options ? options.dataType.toLowerCase() : defaultDataType;
			options.responseType = 'responseType' in options ? options.responseType.toLowerCase() : 'auto';
			options.user = options.user || '';
			options.password = options.password || '';
			options.withCredentials = !!options.withCredentials;
			options.timeout = 'timeout' in options ? parseInt(options.timeout, 10) : 30000;
			options.attempts = 'attempts' in options ? parseInt(options.attempts, 10) : 1;

			// Guess if we're dealing with a cross-origin request
			i = url.match(/\/\/(.+?)\//);
			crossOrigin = i && (i[1] ? i[1] != location.host : false);

			// Prepare data
			if('ArrayBuffer' in global && data instanceof ArrayBuffer) {
				options.dataType = 'arraybuffer';
			}
			else if('Blob' in global && data instanceof Blob) {
				options.dataType = 'blob';
			}
			else if('Document' in global && data instanceof Document) {
				options.dataType = 'document';
			}
			else if('FormData' in global && data instanceof FormData) {
				options.dataType = 'formdata';
			}
			if(data !== null) {
				switch(options.dataType) {
					case 'json':
						data = JSON.stringify(data);
						break;
					case 'post':
						data = jparam(data);
				}
			}

			// Prepare headers
			if(options.headers) {
				var format = function(match,p1,p2) {
					return p1 + p2.toUpperCase();
				};
				for(i in options.headers) {
					headers[i.replace(/(^|-)([^-])/g,format)] = options.headers[i];
				}
			}
			if(!('Content-Type' in headers) && method!='GET') {
				if(options.dataType in mimeTypes) {
					if(mimeTypes[options.dataType]) {
						headers['Content-Type'] = mimeTypes[options.dataType];
					}
				}
			}
			if(!headers.Accept) {
				headers.Accept = (options.responseType in accept) ? accept[options.responseType] : '*/*';
			}
			if(!crossOrigin && !('X-Requested-With' in headers)) { // (that header breaks in legacy browsers with CORS)
				headers['X-Requested-With'] = 'XMLHttpRequest';
			}
			if(!options.cache && !('Cache-Control' in headers)) {
				headers['Cache-Control'] = 'no-cache';
			}

			// Prepare URL
			if(method == 'GET' && data && typeof data == 'string') {
				url += (/\?/.test(url)?'&':'?') + data;
			}

			// Start the request
			if(options.async) {
				promise.send();
			}

			// Return promise
			return promise;

		};
		
		// Define external qwest object
		var getNewPromise = function(q) {
				// Prepare
				var promises = [],
					loading = 0,
					values = [];
				// Create a new promise to handle all requests
				return pinkyswear(function(pinky) {
					// Basic request method
					var method_index = -1,
						createMethod = function(method) {
							return function(url, data, options, before) {
								var index = ++method_index;
								++loading;
								promises.push(qwest(method, pinky.base + url, data, options, before).then(function(xhr, response) {
									values[index] = arguments;
									if(!--loading) {
										pinky(true, values.length == 1 ? values[0] : [values]);
									}
								}, function() {
									pinky(false, arguments);
								}));
								return pinky;
							};
						};
					// Define external API
					pinky.get = createMethod('GET');
					pinky.post = createMethod('POST');
					pinky.put = createMethod('PUT');
					pinky['delete'] = createMethod('DELETE');
					pinky['catch'] = function(f) {
						return pinky.then(null, f);
					};
					pinky.complete = function(f) {
						var func = function() {
							f(); // otherwise arguments will be passed to the callback
						};
						return pinky.then(func, func);
					};
					pinky.map = function(type, url, data, options, before) {
						return createMethod(type.toUpperCase()).call(this, url, data, options, before);
					};
					// Populate methods from external object
					for(var prop in q) {
						if(!(prop in pinky)) {
							pinky[prop] = q[prop];
						}
					}
					// Set last methods
					pinky.send = function() {
						for(var i=0, j=promises.length; i<j; ++i) {
							promises[i].send();
						}
						return pinky;
					};
					pinky.abort = function() {
						for(var i=0, j=promises.length; i<j; ++i) {
							promises[i].abort();
						}
						return pinky;
					};
					return pinky;
				});
			},
			q = {
				base: '',
				get: function() {
					return getNewPromise(q).get.apply(this, arguments);
				},
				post: function() {
					return getNewPromise(q).post.apply(this, arguments);
				},
				put: function() {
					return getNewPromise(q).put.apply(this, arguments);
				},
				'delete': function() {
					return getNewPromise(q)['delete'].apply(this, arguments);
				},
				map: function() {
					return getNewPromise(q).map.apply(this, arguments);
				},
				xhr2: xhr2,
				limit: function(by) {
					limit = by;
					return q;
				},
				setDefaultOptions: function(options) {
					defaultOptions = options;
					return q;
				},
				setDefaultXdrResponseType: function(type) {
					defaultXdrResponseType = type.toLowerCase();
					return q;
				},
				setDefaultDataType: function(type) {
					defaultDataType = type.toLowerCase();
					return q;
				},
				getOpenRequests: function() {
					return requests;
				}
			};
		
		return q;

	}();


/***/ },

/***/ 46:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module, setImmediate, process) {/*
	 * PinkySwear.js 2.2.2 - Minimalistic implementation of the Promises/A+ spec
	 * 
	 * Public Domain. Use, modify and distribute it any way you like. No attribution required.
	 *
	 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
	 *
	 * PinkySwear is a very small implementation of the Promises/A+ specification. After compilation with the
	 * Google Closure Compiler and gzipping it weighs less than 500 bytes. It is based on the implementation for 
	 * Minified.js and should be perfect for embedding. 
	 *
	 *
	 * PinkySwear has just three functions.
	 *
	 * To create a new promise in pending state, call pinkySwear():
	 *         var promise = pinkySwear();
	 *
	 * The returned object has a Promises/A+ compatible then() implementation:
	 *          promise.then(function(value) { alert("Success!"); }, function(value) { alert("Failure!"); });
	 *
	 *
	 * The promise returned by pinkySwear() is a function. To fulfill the promise, call the function with true as first argument and
	 * an optional array of values to pass to the then() handler. By putting more than one value in the array, you can pass more than one
	 * value to the then() handlers. Here an example to fulfill a promsise, this time with only one argument: 
	 *         promise(true, [42]);
	 *
	 * When the promise has been rejected, call it with false. Again, there may be more than one argument for the then() handler:
	 *         promise(true, [6, 6, 6]);
	 *         
	 * You can obtain the promise's current state by calling the function without arguments. It will be true if fulfilled,
	 * false if rejected, and otherwise undefined.
	 * 		   var state = promise(); 
	 * 
	 * https://github.com/timjansen/PinkySwear.js
	 */
	(function(target) {
		var undef;

		function isFunction(f) {
			return typeof f == 'function';
		}
		function isObject(f) {
			return typeof f == 'object';
		}
		function defer(callback) {
			if (typeof setImmediate != 'undefined')
				setImmediate(callback);
			else if (typeof process != 'undefined' && process['nextTick'])
				process['nextTick'](callback);
			else
				setTimeout(callback, 0);
		}

		target[0][target[1]] = function pinkySwear(extend) {
			var state;           // undefined/null = pending, true = fulfilled, false = rejected
			var values = [];     // an array of values as arguments for the then() handlers
			var deferred = [];   // functions to call when set() is invoked

			var set = function(newState, newValues) {
				if (state == null && newState != null) {
					state = newState;
					values = newValues;
					if (deferred.length)
						defer(function() {
							for (var i = 0; i < deferred.length; i++)
								deferred[i]();
						});
				}
				return state;
			};

			set['then'] = function (onFulfilled, onRejected) {
				var promise2 = pinkySwear(extend);
				var callCallbacks = function() {
		    		try {
		    			var f = (state ? onFulfilled : onRejected);
		    			if (isFunction(f)) {
			   				function resolve(x) {
							    var then, cbCalled = 0;
			   					try {
					   				if (x && (isObject(x) || isFunction(x)) && isFunction(then = x['then'])) {
											if (x === promise2)
												throw new TypeError();
											then['call'](x,
												function() { if (!cbCalled++) resolve.apply(undef,arguments); } ,
												function(value){ if (!cbCalled++) promise2(false,[value]);});
					   				}
					   				else
					   					promise2(true, arguments);
			   					}
			   					catch(e) {
			   						if (!cbCalled++)
			   							promise2(false, [e]);
			   					}
			   				}
			   				resolve(f.apply(undef, values || []));
			   			}
			   			else
			   				promise2(state, values);
					}
					catch (e) {
						promise2(false, [e]);
					}
				};
				if (state != null)
					defer(callCallbacks);
				else
					deferred.push(callCallbacks);
				return promise2;
			};
	        if(extend){
	            set = extend(set);
	        }
			return set;
		};
	})( false ? [window, 'pinkySwear'] : [module, 'exports']);


	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(47)(module), __webpack_require__(48).setImmediate, __webpack_require__(32)))

/***/ },

/***/ 48:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(32).nextTick;
	var apply = Function.prototype.apply;
	var slice = Array.prototype.slice;
	var immediateIds = {};
	var nextImmediateId = 0;

	// DOM APIs, for completeness

	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) { timeout.close(); };

	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};

	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};

	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};

	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);

	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};

	// That's not how node.js implements it but the exposed api is the same.
	exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
	  var id = nextImmediateId++;
	  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

	  immediateIds[id] = true;

	  nextTick(function onNextTick() {
	    if (immediateIds[id]) {
	      // fn.call() is faster so we optimize for the common use-case
	      // @see http://jsperf.com/call-apply-segu
	      if (args) {
	        fn.apply(null, args);
	      } else {
	        fn.call(null);
	      }
	      // Prevent ids from leaking
	      exports.clearImmediate(id);
	    }
	  });

	  return id;
	};

	exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
	  delete immediateIds[id];
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(48).setImmediate, __webpack_require__(48).clearImmediate))

/***/ },

/***/ 49:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * @preserve jquery-param (c) 2015 KNOWLEDGECODE | MIT
	 */
	/*global define */
	(function (global) {
	    'use strict';

	    var param = function (a) {
	        var add = function (s, k, v) {
	            v = typeof v === 'function' ? v() : v === null ? '' : v === undefined ? '' : v;
	            s[s.length] = encodeURIComponent(k) + '=' + encodeURIComponent(v);
	        }, buildParams = function (prefix, obj, s) {
	            var i, len, key;

	            if (Object.prototype.toString.call(obj) === '[object Array]') {
	                for (i = 0, len = obj.length; i < len; i++) {
	                    buildParams(prefix + '[' + (typeof obj[i] === 'object' ? i : '') + ']', obj[i], s);
	                }
	            } else if (obj && obj.toString() === '[object Object]') {
	                for (key in obj) {
	                    if (obj.hasOwnProperty(key)) {
	                        if (prefix) {
	                            buildParams(prefix + '[' + key + ']', obj[key], s, add);
	                        } else {
	                            buildParams(key, obj[key], s, add);
	                        }
	                    }
	                }
	            } else if (prefix) {
	                add(s, prefix, obj);
	            } else {
	                for (key in obj) {
	                    add(s, key, obj[key]);
	                }
	            }
	            return s;
	        };
	        return buildParams('', a, []).join('&').replace(/%20/g, '+');
	    };

	    if (typeof module === 'object' && typeof module.exports === 'object') {
	        module.exports = param;
	    } else if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	            return param;
	        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else {
	        global.param = param;
	    }

	}(this));


/***/ },

/***/ 50:
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(5);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"1":function(container,depth0,helpers,partials,data) {
	    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

	  return "        <tr>\n          <td>"
	    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
	    + "</td>\n          <td>"
	    + alias4(((helper = (helper = helpers.dayOfTheWeek || (depth0 != null ? depth0.dayOfTheWeek : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"dayOfTheWeek","hash":{},"data":data}) : helper)))
	    + "</td>\n          <td>"
	    + alias4(((helper = (helper = helpers.startTime || (depth0 != null ? depth0.startTime : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"startTime","hash":{},"data":data}) : helper)))
	    + "</td>\n          <td>"
	    + alias4(((helper = (helper = helpers.endTime || (depth0 != null ? depth0.endTime : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"endTime","hash":{},"data":data}) : helper)))
	    + "</td>\n          <td>\n            <a class=\"btn btn-default aviator\" href=\"/admin/classes/"
	    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
	    + "/edit/\" role=\"button\">Edit</a>\n            <a class=\"btn btn-danger aviator\" href=\"/admin/classes/"
	    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
	    + "/delete/\" role=\"button\">Delete</a>\n          </td>\n        </tr>\n";
	},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
	    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", buffer = 
	  "<div class=\"panel panel-default\">\n  <div class=\"panel-heading\">\n    Classes\n    <a class=\"btn btn-default aviator\" href=\"/admin/classes/"
	    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
	    + "/new/\" role=\"button\">Create</a>\n  </div>\n  <table class=\"table\">\n    <thead>\n      <tr>\n        <th>Class Name</th>\n        <th>Day of the Week</th>\n        <th>Start Time</th>\n        <th>End Time</th>\n        <th></th>\n      </tr>\n    </thead>\n    <tbody class=\"table-hover\">\n";
	  stack1 = ((helper = (helper = helpers.data || (depth0 != null ? depth0.data : depth0)) != null ? helper : alias2),(options={"name":"data","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
	  if (!helpers.data) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
	  if (stack1 != null) { buffer += stack1; }
	  return buffer + "    </tbody>\n  </table>\n</div>\n";
	},"useData":true});

/***/ },

/***/ 51:
/***/ function(module, exports) {

	module.exports = {
	  index: function() {
	    console.log('instructor sign in page')
	  }
	}


/***/ },

/***/ 52:
/***/ function(module, exports) {

	module.exports = {
	  index: function() {
	    console.log('student sign in page')
	  }
	}


/***/ }

});