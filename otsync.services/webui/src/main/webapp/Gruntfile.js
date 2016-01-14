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
              dest:'<%= artifactsPath %>/tempo.tmpl.htm'
            }
        },
        uglify: {
          all_src:{
            options: {
                banner: '/*! TempoBox web ui <%= grunt.template.today("dd-mm-yyyy") %> */\n',
                sourceMap : true,
                sourceMapIncludeSources : true
            },
            // This is how the dependencies being managed:load them in order!:(
            files:{
                '<%= artifactsPath %>/js/tempo.js':[
                  'js/vendor/jquery.js',
                  'js/vendor/jquery-ui.js',
                  'js/vendor/jquery.tmpl.js',
                  'js/vendor/jquery.jsperanto.js',
                  'js/vendor/jquery.address.js',
                  'js/vendor/json2.js',
                  'js/vendor/jquery.iframe-transport.js',
                  'js/vendor/jquery.fileupload.js',
                  'js/vendor/jquery.colorbox.js',
                  'js/vendor/iso8601.min.js',
                  'js/checkbox.js',
                  'js/utils.js',
                  'js/ui.js',
                  'js/user.js',
                  'js/request.js',
                  'js/response.js',
                  'js/externalShare.js',
                  'js/version.js',
                  'js/dialogs.js',
                  'js/events.js',
                  'js/selectbox.js',
                  'js/addfolder/addfolder.js',
                  'js/addfolder/addfolder.request.js',
                  'js/copy/copy.js',
                  'js/copy/copy.request.js',
                  'js/copy/copy.dialog.js',
                  'js/tasks/tasks.js',
                  'js/tasks/tasks.request.js',
                  'js/folderDescription/folderDescription.js',
                  'js/folderDescription/folderDescription.request.js',
                  'js/browse/sortcontroller.js',
                  'js/browse/selectioncontroller.js',
                  'js/browse/browse.js',
                  'js/browse/browse.request.js',
                  'js/delete/delete.js',
                  'js/delete/delete.request.js',
                  'js/move/move.js',
                  'js/move/move.request.js',
                  'js/move/move.dialog.js',
                  'js/profile/profile.js',
                  'js/profile/profile.dialog.js',
                  'js/profile/profile.request.js',
                  'js/userNotificationConfig/userNotificationConfig.js',
                  'js/userNotificationConfig/userNotificationConfig.dialog.js',
                  'js/userNotificationConfig/userNotificationConfig.request.js',
                  'js/rename/renamecontroller.js',
                  'js/reserve/reserve.js',
                  'js/reserve/reserve.request.js',
                  'js/unreserve/unreserve.js',
                  'js/unreserve/unreserve.request.js',
                  'js/search/search.js',
                  'js/search/search.request.js',
                  'js/share/share.js',
                  'js/share/share.request.js',
                  'js/share/share.dialogs.js',
                  'js/collaborators/collaborators.js',
                  'js/collaborators/collaborators.dialogs.js',
                  'js/collaborators/collaborators.request.js',
                  'js/upload/uploadcontroller.js',
                  'js/startup.js',
                  'help/helpmappings.js'
                ]
            }
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
