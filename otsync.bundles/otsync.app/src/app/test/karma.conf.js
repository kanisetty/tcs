module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
  		'www/lib/angular/angular.js',
  		'www/lib/angular-route/angular-route.js',
  		'www/lib/angular-resource/angular-resource.js',
  		'www/lib/angular-mocks/angular-mocks.js',
  		'www/lib/angular-translate/angular-translate.js',
		'www/modules/browse/**/*.js',
  		'www/modules/cache/**/*.js',
      	'www/modules/collaborators/**/*.js',
      	'www/modules/email/**/*.js',
      	'www/modules/favorites/**/*.js',
	  	'www/modules/feed/**/*.js',
      	'www/modules/file/**/*.js',
      	'www/modules/header/**/*.js',
      	'www/modules/menu/**/*.js',
      	'www/modules/node/**/*.js',
      	'www/modules/session/**/*.js',
      	'www/modules/utilities/**/*.js',
      	'test/unit/browse/**/*.js',
      	'test/unit/collaborator/**/*.js',
		'test/unit/email/**/*.js',
      	'test/unit/favorites/**/*.js',
      	'test/unit/feeds/**/*.js',
      	'test/unit/node/**/*.js',
		'test/unit/session/**/*.js',
		'test/unit/utilities/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine'
    ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
