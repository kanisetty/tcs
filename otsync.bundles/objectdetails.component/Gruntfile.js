module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ["dist"],
        copy: {
            build: {
                files: [
                    {cwd: 'src/resources', src: '**/*', dest: 'dist/build', expand: true},
                    {cwd: 'src/webcontent', src: '**/*', dest: 'dist/build', expand: true},
                    {cwd: 'src/app', src: '**/*', dest: 'dist/mobile', expand: true},
                    {cwd: '../common.app/css', src: 'bootstrap.min.css', dest: 'dist/mobile/css', expand: true},
                    {cwd: '../common.app/js', src: ['app.js', 'deviceStrategies.js'], dest: 'dist/mobile/js', expand: true},
                    {cwd: '../common.app/js/vendor', src: ['jquery.jsperanto.js', 'jquery-2.0.0.min.js', 'moment.min.js'],
                        dest: 'dist/mobile/js/vendor', expand: true},
                    {cwd: '../common.app/img', src: 'ajax-loader.gif', dest: 'dist/mobile/img', expand: true},
                    {cwd: 'dependencies/appworks-js/dist', src: 'appworks.min.js', dest: 'dist/mobile/lib/appworks-js', expand: true}
                ]
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
                    archive: 'dist/objectdetails-component_16.0.0.zip'
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