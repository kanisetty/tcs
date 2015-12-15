module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            build: {
                files: [
                    {cwd: '../src/app/www', src: '**/*', dest: 'dist/mobile', expand: true},
                    {cwd: '../src/webcontent', src: '**/*', dest: 'dist/build', expand: true},
                    {cwd: 'resources', src: ['app.properties', 'icon.png'], dest: 'dist/build', expand: true},
                    {cwd: 'resources', src: 'appSettings.js', dest: 'dist/mobile', expand: true},
                    {cwd: 'dependencies/angular-appworks/dist', src: 'angular-appworks.js', dest: 'dist/mobile/lib/angular-appworks',
                        expand: true},
                    {cwd: 'dependencies/angular-ios9-uiwebview-patch', src: 'angular-ios9-uiwebview-patch.js',
                        dest: 'dist/mobile/lib/angular-ios9-uiwebview-patch', expand: true},
                    {cwd: 'dependencies/angular-translate', src: 'angular-translate.min.js', dest: 'dist/mobile/lib/angular-translate',
                        expand: true},
                    {cwd: 'dependencies/angular-translate-loader-static-files', src: 'angular-translate-loader-static-files.min.js',
                        dest: 'dist/mobile/lib/angular-translate-loader-static-files', expand: true},
                    {cwd: 'dependencies/ionic/release/css', src: 'ionic.min.css', dest: 'dist/mobile/lib/ionic', expand: true},
                    {cwd: 'dependencies/ionic/release/js', src: 'ionic.bundle.min.js', dest: 'dist/mobile/lib/ionic', expand: true},
                    {cwd: 'dependencies/ionicons/css', src: 'ionicons.min.css', dest: 'dist/mobile/lib/ionicons/css', expand: true},
                    {cwd: 'dependencies/ionicons/fonts', src: '**/*', dest: 'dist/mobile/lib/ionicons/fonts', expand: true}
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
                    cwd: 'dist/mobile',
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