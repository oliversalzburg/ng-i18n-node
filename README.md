A solution to use [i18n-node-angular](https://github.com/oliversalzburg/i18n-node-angular) in an Angular application without NodeJS backend.

## Introduction
`ng-i18n-node` intercepts the `$http` service and looks for any requests going to `/i18n/` (the default `i18n-node-angular` route).

If a request to `/i18n/locale` is detected, it will be replaced with a request to `/i18n/locale.json` to retrieve the JSON formatted locale file from the local resources.

If a request to `/i18n/locale/translateable` is detected, the translatable string will be returned in its original form. At the same time it will be recorded and printed to the developer console, so that you can grab it and put it into your translation documents. 

## Installation
1. Include `.js` file:

		<script src="lib/ng-i18n-node/dist/ng-i18n-node.min.js"></script>

2. Load `ng-i18n-node` as a dependency of your module:

		angular.module( "foo", ["i18n", "ng-i18n-node"] );

3. Place your translation files into a folder named `i18n` in your project root.