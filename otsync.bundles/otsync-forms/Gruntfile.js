module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ["dist"],
        copy: {
            build: {
                files: [
                    {cwd: 'src/app/www', src: '**/*', dest: 'dist/mobile', expand: true},
                    {cwd: 'src/webcontent', src: '**/*', dest: 'dist/build', expand: true},
                    {cwd: 'src/resources', src: 'app.properties', dest: 'dist/build', expand: true},
                    {cwd: 'dependencies/appworks-js/dist', src: 'appworks.min.js', dest: 'dist/mobile/lib/appworks-js', expand: true},
                    {cwd: 'dependencies/jquery/dist', src: 'jquery.min.js', dest: 'dist/mobile/lib/jquery', expand: true},
                    {cwd: 'dependencies/underscore', src: 'underscore-min.js', dest: 'dist/mobile/lib/underscore', expand: true},
                    {cwd: 'dependencies/bootstrap/dist/js', src: 'bootstrap.min.js', dest: 'dist/mobile/lib/bootstrap/js', expand: true},
                    {cwd: 'dependencies/bootstrap/dist/fonts', src: '**/*', dest: 'dist/mobile/lib/bootstrap/fonts', expand: true},
                    {cwd: 'dependencies/bootstrap/dist/css', src: 'bootstrap.min.css', dest: 'dist/mobile/lib/bootstrap/css', expand: true},
                    {cwd: 'dependencies/handlebars', src: 'handlebars.min.js', dest: 'dist/mobile/lib/handlebars', expand: true},
                    {cwd: 'dependencies/moment/min', src: 'moment-with-locales.min.js', dest: 'dist/mobile/lib/moment', expand: true},
                    {cwd: 'dependencies/alpaca/dist/alpaca/bootstrap', src: 'alpaca.min.js', dest: 'dist/mobile/lib/alpaca/js', expand: true},
                    {cwd: 'dependencies/alpaca/dist/alpaca/bootstrap', src: 'alpaca.min.css', dest: 'dist/mobile/lib/alpaca/css', expand: true},
                    {cwd: 'dependencies/alpaca/dist/alpaca/bootstrap/images', src: '**/*', dest: 'dist/mobile/lib/alpaca/images', expand: true},

                    {cwd: 'dependencies/eonasdan-bootstrap-datetimepicker/build/js', src: 'bootstrap-datetimepicker.min.js', dest: 'dist/mobile/lib/eonasdan-bootstrap-datetimepicker', expand: true},
                    {cwd: 'dependencies/eonasdan-bootstrap-datetimepicker/build/css', src: 'bootstrap-datetimepicker.min.css', dest: 'dist/mobile/lib/eonasdan-bootstrap-datetimepicker', expand: true},
                    {cwd: 'dependencies/bootstrap3-typeahead', src: 'bootstrap3-typeahead.min.js', dest: 'dist/mobile/lib/typeahead', expand: true},
                    {cwd: 'dependencies/i18next', src: 'i18next.commonjs.withJQuery.min.js', dest: 'dist/mobile/lib/i18next', expand: true},
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
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ['clean', 'copy', 'compress']);
};