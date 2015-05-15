angular.module("app", ["pascalprecht.translate", "ngRoute", "ngAnimate", "toaster", "device", "ui.utils"])
.config(function ($translateProvider) {


	$translateProvider.useStaticFilesLoader({
	  prefix: 'assets/locale/',
	  suffix: '.json'
	})
	.determinePreferredLanguage()
	.preferredLanguage('en')
	.fallbackLanguage('en')
	.use((navigator.language).substring(0,2));

});