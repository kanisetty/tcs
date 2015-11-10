module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ["dist"],
        copy: {
            build: {
                files: [{
                    cwd: 'src/resources',
                    src: '**/*',
                    dest: 'dist/build',
                    expand: true
                },{
                    cwd: 'src/webcontent',
                    src: '**/*',
                    dest: 'dist/build',
                    expand: true
                },{
                    cwd: 'src/app',
                    src: '**/*',
                    dest: 'dist/mobile',
                    expand: true

                },{
                    cwd: '../common.js',
                    src: '**/*',
                    dest: 'dist/mobile/js',
                    expand: true

                },{
                    cwd: 'dependencies/appworks-js/dist',
                    src: 'appworks.min.js',
                    dest: 'dist/mobile/lib/appworks-js',
                    expand: true

                },{
                    cwd: 'dependencies/jquery/dist',
                    src: 'jquery.min.js',
                    dest: 'dist/mobile/lib/jquery',
                    expand: true

                },{
                    cwd: 'dependencies/moment/min',
                    src: 'moment.min.js',
                    dest: 'dist/mobile/lib/moment',
                    expand: true

                }]
            }
        },
        compress: {
            mobile: {
                options: {
                    archive: 'dist/build/mobile.zip'
                },
                files: [{
                    expand: true,
                    cwd: 'dist/mobile/',
                    src: ['**/*'],
                    dest: ''
                }]
            },
            final: {
                options: {
                    archive: 'dist/objectdetails-component_16.0.zip'
                },
                files: [{
                    expand: true,
                    cwd: 'dist/build/',
                    src: ['**/*'],
                    dest: ''
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ['clean', 'copy', 'compress']);
};