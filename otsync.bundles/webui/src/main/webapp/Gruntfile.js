module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cssmin : {
            options: {
                keepSpecialComments: 0
            },
            combine:{
                files:{
                  '<%= intermediatePath %>/tempo.css':['css/**/*.css']
                }
            },
            minify : {
                  options: {
                      banner: '/*! TempoBox web ui <%= grunt.template.today("dd-mm-yyyy") %> */\n'
                  },
                  src : '<%= intermediatePath %>/tempo.css',
                  dest : '<%= artifactsPath %>/css/tempo.css'
            }
        },
        concat: {
            options: {
                separator: '\n',
            },
            templates:{
              src:['js/**/*.tmpl.htm'],
              dest:'<%= artifactsPath %>/tempo.tmpl.html'
            }
        },
        uglify: {
          all_src:{
            options: {
                banner: '/*! TempoBox web ui <%= grunt.template.today("dd-mm-yyyy") %> */\n',
                sourceMap : true,
            },
            src:'js/**/*.js',
            dest:'<%= artifactsPath %>/js/tempo.js'
          }
        },

        copy:{
            assets:{
              files:[
                {cwd:'css/base/images/',src:['**'],dest:'<%= artifactsPath %>/css/images/',expand:true},
                {cwd:'img/',src:['**'],dest:'<%= artifactsPath %>/img/',expand:true},
                {cwd:'help/',src:['**'],dest:'<%= artifactsPath %>/help/',expand:true},
                {cwd:'locales/',src:['**'],dest:'<%= artifactsPath %>/locales/',expand:true},
                {cwd:'branding/assets/',src:['**'],dest:'<%= artifactsPath %>/img/',expand:true},
              ]
            }
        },
        clean:['<%= intermediatePath %>/','<%= artifactsPath %>/'],
        intermediatePath:'dist/intermediate',
        artifactsPath:'dist/artifacts'
      }
  );

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ['clean','cssmin','concat', 'uglify','copy']);
};
