module.exports = function(config){
  config.set({

    basePath : '../../../',

    files : [
  		'dependencies/angular/angular.js',
		'dependencies/angular-appworks/dist/angular-appworks.js',
  		'dependencies/angular-route/angular-route.js',
  		'dependencies/angular-mocks/angular-mocks.js',
  		'dependencies/angular-translate/angular-translate.js',
		'src/app/www/modules/browse/**/*.js',
  		'src/app/www/modules/cache/**/*.js',
      	'src/app/www/modules/collaborators/**/*.js',
      	'src/app/www/modules/email/**/*.js',
      	'src/app/www/modules/favorites/**/*.js',
	  	'src/app/www/modules/feed/**/*.js',
      	'src/app/www/modules/file/**/*.js',
      	'src/app/www/modules/header/**/*.js',
      	'src/app/www/modules/menu/**/*.js',
      	'src/app/www/modules/node/**/*.js',
      	'src/app/www/modules/session/**/*.js',
      	'src/app/www/modules/utilities/**/*.js',
      	'src/app/test/unit/browse/**/*.js',
      	'src/app/test/unit/collaborator/**/*.js',
		'src/app/test/unit/email/**/*.js',
      	'src/app/test/unit/favorites/**/*.js',
      	'src/app/test/unit/feeds/**/*.js',
      	'src/app/test/unit/node/**/*.js',
		'src/app/test/unit/session/**/*.js',
		'src/app/test/unit/utilities/**/*.js'
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
