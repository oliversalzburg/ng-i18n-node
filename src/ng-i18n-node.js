/**
 * Copyright (C) 2014, Oliver Salzburg
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 * Created: 2014-08-19 14:24
 *
 * @author Oliver Salzburg
 * @copyright Copyright (C) 2014, Oliver Salzburg, HARTWIG Communication & Events
 * @license http://opensource.org/licenses/mit-license.php MIT License
 */

(function() {
	"use strict";

	var module = angular.module( "ng-i18n-node", [] );

	module.factory( "httpInterceptor", ["$log", "$q", function( $log, $q ) {
		var httpInterceptor = {
			request       : function( config ) {
				if( config.url.match( /^\/i18n\// ) ) {
					$log.debug( "Intercepting /i18n/ request..." );
					config.i18nRequest = true;

					var isRequestForLiteral = config.url.match( /^\/i18n\/\w+\/\w+/ );

					if( isRequestForLiteral ) {
						var literalMatch = /^\/i18n\/\w+\/([^\/]+)/.exec( config.url );
						var requestedLiteral = literalMatch[ 1 ];
						var readableLiteral = decodeURIComponent( requestedLiteral );
						config.i18nLiteral = readableLiteral;
						return $q.reject( config );

					} else {
						var localeMatch = /^\/i18n\/([^\/]+)/.exec( config.url );
						var locale = localeMatch[ 1 ];
						config.url = "i18n/" + locale + ".json";
					}

					config.config = config;
					return config;
				}
				return config;
			},
			responseError : function( rejection ) {
				if( rejection.i18nRequest ) {
					$log.debug( "Handling rejected /i18n/ interception..." );

					var dataToReturn = "";
					var isRequestForLiteral = rejection.url.match( /^\/i18n\/\w+\/\w+/ );
					if( isRequestForLiteral ) {
						var literalMatch = /^\/i18n\/\w+\/([^\/]+)/.exec( rejection.url );
						var requestedLiteral = literalMatch[ 1 ];
						var readableLiteral = decodeURIComponent( requestedLiteral );

						dataToReturn = readableLiteral;

						httpInterceptor.untranslated = httpInterceptor.untranslated || {};
						httpInterceptor.untranslated[ readableLiteral ] = readableLiteral;
						httpInterceptor.flushUntranslated();
						$log.warn( "UNTRANSLATED LITERAL", readableLiteral );

					} else {
						// Requests for locale packages should have been handled by "request" interceptor.
						dataToReturn = {};
					}

					return {
						data       : dataToReturn,
						status     : 200,
						headers    : null,
						config     : rejection.config,
						statusText : "OK"
					};
				}
				return $q.reject( rejection );
			},

			flushUntranslated : function(){
				$log.info( httpInterceptor.untranslated );
			}
		};

		return httpInterceptor;
	}] );

	module.config( ["$httpProvider", function( $httpProvider ) {
		$httpProvider.interceptors.push( "httpInterceptor" );
	}] );
}());
