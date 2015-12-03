module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            build: {
                files: [
                    {cwd: 'src/resources', src: '**/*', dest: 'dist/build', expand: true},
                    {cwd: 'src/webcontent', src: '**/*', dest: 'dist/build', expand: true},
                    {cwd: 'src/app', src: '**/*', dest: 'dist/mobile', expand: true},
                    {cwd: '../common.app/js', src: ['deviceStrategies.js'], dest: 'dist/mobile/js', expand: true},
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
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.registerTask('default', ['copy', 'compress']);
};