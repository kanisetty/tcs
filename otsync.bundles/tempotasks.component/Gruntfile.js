module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ["dist"],
        copy: {
            build: {
                files: [
                    {cwd: 'src/resources', src: '**/*', dest: 'dist/build', expand: true},
                    {cwd: 'src/webcontent', src: '**/*', dest: 'dist/build', expand: true},
                    {cwd: 'src/app/www', src: '**/*', dest: 'dist/mobile', expand: true},
                    {cwd: 'dependencies/ionic/release/css', src: 'ionic.min.css', dest: 'dist/mobile/lib/ionic', expand: true},
                    {cwd: 'dependencies/ionic/release/js', src: 'ionic.bundle.js', dest: 'dist/mobile/lib/ionic', expand: true},
                    {cwd: 'dependencies/angular-translate', src: 'angular-translate.js', dest: 'dist/mobile/lib/angular-translate',
                        expand: true},
                    {cwd: 'dependencies/angular-translate-loader-static-files', src: 'angular-translate-loader-static-files.js',
                        dest: 'dist/mobile/lib/angular-translate-loader-static-files', expand: true},
                    {cwd: 'dependencies/angular-appworks/dist', src: 'angular-appworks.min.js', dest: 'dist/mobile/lib/angular-appworks',
                        expand: true}
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
                    archive: 'dist/tempotasks-component_16.0.0.zip'
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