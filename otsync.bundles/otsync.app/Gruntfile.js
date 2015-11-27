module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ["dist"],
        copy: {
            build_ews: {
                files: [
                    {cwd: 'src/app/www', src: '**/*', dest: 'dist/mobile/ews', expand: true},
                    {cwd: 'src/resources/ews', src: ['app.properties', 'icon.png'], dest: 'dist/build/ews', expand: true},
                    {cwd: 'src/resources/ews', src: 'appSettings.js', dest: 'dist/mobile/ews', expand: true},
                    {cwd: 'src/webcontent', src: '**/*', dest: 'dist/build/ews', expand: true},
                    {cwd: 'dependencies/angular-appworks/dist', src: 'angular-appworks.js', dest: 'dist/mobile/ews/lib/angular-appworks', expand: true},
                    {cwd: 'dependencies/angular-ios9-uiwebview-patch', src: 'angular-ios9-uiwebview-patch.js',
                        dest: 'dist/mobile/ews/lib/angular-ios9-uiwebview-patch', expand: true},
                    {cwd: 'dependencies/angular-translate', src: 'angular-translate.min.js', dest: 'dist/mobile/ews/lib/angular-translate', expand: true},
                    {cwd: 'dependencies/angular-translate-loader-static-files', src: 'angular-translate-loader-static-files.min.js',
                        dest: 'dist/mobile/ews/lib/angular-translate-loader-static-files', expand: true},
                    {cwd: 'dependencies/ionic/release/css', src: 'ionic.min.css', dest: 'dist/mobile/ews/lib/ionic', expand: true},
                    {cwd: 'dependencies/ionic/release/js', src: 'ionic.bundle.min.js', dest: 'dist/mobile/ews/lib/ionic', expand: true},
                    {cwd: 'dependencies/ionicons/css', src: 'ionicons.min.css', dest: 'dist/mobile/ews/lib/ionicons/css', expand: true},
                    {cwd: 'dependencies/ionicons/fonts', src: '**/*', dest: 'dist/mobile/ews/lib/ionicons/fonts', expand: true}
                ]
            },
            build_favorites: {
                files: [
                    {cwd: 'src/app/www', src: '**/*', dest: 'dist/mobile/favorites', expand: true},
                    {cwd: 'src/resources/favorites', src: ['app.properties', 'icon.png'], dest: 'dist/build/favorites', expand: true},
                    {cwd: 'src/resources/favorites', src: 'appSettings.js', dest: 'dist/mobile/favorites', expand: true},
                    {cwd: 'src/webcontent', src: '**/*', dest: 'dist/build/favorites', expand: true},
                    {cwd: 'dependencies/angular-appworks/dist', src: 'angular-appworks.js', dest: 'dist/mobile/favorites/lib/angular-appworks', expand: true},
                    {cwd: 'dependencies/angular-ios9-uiwebview-patch', src: 'angular-ios9-uiwebview-patch.js',
                        dest: 'dist/mobile/favorites/lib/angular-ios9-uiwebview-patch', expand: true},
                    {cwd: 'dependencies/angular-translate', src: 'angular-translate.min.js', dest: 'dist/mobile/favorites/lib/angular-translate', expand: true},
                    {cwd: 'dependencies/angular-translate-loader-static-files', src: 'angular-translate-loader-static-files.min.js',
                        dest: 'dist/mobile/favorites/lib/angular-translate-loader-static-files', expand: true},
                    {cwd: 'dependencies/ionic/release/css', src: 'ionic.min.css', dest: 'dist/mobile/favorites/lib/ionic', expand: true},
                    {cwd: 'dependencies/ionic/release/js', src: 'ionic.bundle.min.js', dest: 'dist/mobile/favorites/lib/ionic', expand: true},
                    {cwd: 'dependencies/ionicons/css', src: 'ionicons.min.css', dest: 'dist/mobile/favorites/lib/ionicons/css', expand: true},
                    {cwd: 'dependencies/ionicons/fonts', src: '**/*', dest: 'dist/mobile/favorites/lib/ionicons/fonts', expand: true}
                ]
            },
            build_feeds: {
                files: [
                    {cwd: 'src/app/www', src: '**/*', dest: 'dist/mobile/feeds', expand: true},
                    {cwd: 'src/resources/feeds', src: ['app.properties', 'icon.png'], dest: 'dist/build/feeds', expand: true},
                    {cwd: 'src/resources/feeds', src: 'appSettings.js', dest: 'dist/mobile/feeds', expand: true},
                    {cwd: 'src/webcontent', src: '**/*', dest: 'dist/build/feeds', expand: true},
                    {cwd: 'dependencies/angular-appworks/dist', src: 'angular-appworks.js', dest: 'dist/mobile/feeds/lib/angular-appworks', expand: true},
                    {cwd: 'dependencies/angular-ios9-uiwebview-patch', src: 'angular-ios9-uiwebview-patch.js',
                        dest: 'dist/mobile/feeds/lib/angular-ios9-uiwebview-patch', expand: true},
                    {cwd: 'dependencies/angular-translate', src: 'angular-translate.min.js', dest: 'dist/mobile/feeds/lib/angular-translate', expand: true},
                    {cwd: 'dependencies/angular-translate-loader-static-files', src: 'angular-translate-loader-static-files.min.js',
                        dest: 'dist/mobile/feeds/lib/angular-translate-loader-static-files', expand: true},
                    {cwd: 'dependencies/ionic/release/css', src: 'ionic.min.css', dest: 'dist/mobile/feeds/lib/ionic', expand: true},
                    {cwd: 'dependencies/ionic/release/js', src: 'ionic.bundle.min.js', dest: 'dist/mobile/feeds/lib/ionic', expand: true},
                    {cwd: 'dependencies/ionicons/css', src: 'ionicons.min.css', dest: 'dist/mobile/feeds/lib/ionicons/css', expand: true},
                    {cwd: 'dependencies/ionicons/fonts', src: '**/*', dest: 'dist/mobile/feeds/lib/ionicons/fonts', expand: true}
                ]
            },
            build_pws: {
                files: [
                    {cwd: 'src/app/www', src: '**/*', dest: 'dist/mobile/pws', expand: true},
                    {cwd: 'src/resources/pws', src: ['app.properties', 'icon.png'], dest: 'dist/build/pws', expand: true},
                    {cwd: 'src/resources/pws', src: 'appSettings.js', dest: 'dist/mobile/pws', expand: true},
                    {cwd: 'src/webcontent', src: '**/*', dest: 'dist/build/pws', expand: true},
                    {cwd: 'dependencies/angular-appworks/dist', src: 'angular-appworks.js', dest: 'dist/mobile/pws/lib/angular-appworks', expand: true},
                    {cwd: 'dependencies/angular-ios9-uiwebview-patch', src: 'angular-ios9-uiwebview-patch.js',
                        dest: 'dist/mobile/pws/lib/angular-ios9-uiwebview-patch', expand: true},
                    {cwd: 'dependencies/angular-translate', src: 'angular-translate.min.js', dest: 'dist/mobile/pws/lib/angular-translate', expand: true},
                    {cwd: 'dependencies/angular-translate-loader-static-files', src: 'angular-translate-loader-static-files.min.js',
                        dest: 'dist/mobile/pws/lib/angular-translate-loader-static-files', expand: true},
                    {cwd: 'dependencies/ionic/release/css', src: 'ionic.min.css', dest: 'dist/mobile/pws/lib/ionic', expand: true},
                    {cwd: 'dependencies/ionic/release/js', src: 'ionic.bundle.min.js', dest: 'dist/mobile/pws/lib/ionic', expand: true},
                    {cwd: 'dependencies/ionicons/css', src: 'ionicons.min.css', dest: 'dist/mobile/pws/lib/ionicons/css', expand: true},
                    {cwd: 'dependencies/ionicons/fonts', src: '**/*', dest: 'dist/mobile/pws/lib/ionicons/fonts', expand: true}
                ]
            },
            build_tempo: {
                files: [
                    {cwd: 'src/app/www', src: '**/*', dest: 'dist/mobile/tempo', expand: true},
                    {cwd: 'src/resources/tempo', src: ['app.properties', 'icon.png'], dest: 'dist/build/tempo', expand: true},
                    {cwd: 'src/resources/tempo', src: 'appSettings.js', dest: 'dist/mobile/tempo', expand: true},
                    {cwd: 'src/webcontent', src: '**/*', dest: 'dist/build/tempo', expand: true},
                    {cwd: 'dependencies/angular-appworks/dist', src: 'angular-appworks.js', dest: 'dist/mobile/tempo/lib/angular-appworks', expand: true},
                    {cwd: 'dependencies/angular-ios9-uiwebview-patch', src: 'angular-ios9-uiwebview-patch.js',
                        dest: 'dist/mobile/tempo/lib/angular-ios9-uiwebview-patch', expand: true},
                    {cwd: 'dependencies/angular-translate', src: 'angular-translate.min.js', dest: 'dist/mobile/tempo/lib/angular-translate', expand: true},
                    {cwd: 'dependencies/angular-translate-loader-static-files', src: 'angular-translate-loader-static-files.min.js',
                        dest: 'dist/mobile/tempo/lib/angular-translate-loader-static-files', expand: true},
                    {cwd: 'dependencies/ionic/release/css', src: 'ionic.min.css', dest: 'dist/mobile/tempo/lib/ionic', expand: true},
                    {cwd: 'dependencies/ionic/release/js', src: 'ionic.bundle.min.js', dest: 'dist/mobile/tempo/lib/ionic', expand: true},
                    {cwd: 'dependencies/ionicons/css', src: 'ionicons.min.css', dest: 'dist/mobile/tempo/lib/ionicons/css', expand: true},
                    {cwd: 'dependencies/ionicons/fonts', src: '**/*', dest: 'dist/mobile/tempo/lib/ionicons/fonts', expand: true}
                ]
            }
        },
        compress: {
            mobile_ews: {
                options: {
                    archive: 'dist/build/ews/mobile.zip'
                },
                files: [{
                    expand: true,
                    cwd: 'dist/mobile/ews',
                    src: ['**/*'],
                    dest: ''
                }]
            },
            mobile_favorites: {
                options: {
                    archive: 'dist/build/favorites/mobile.zip'
                },
                files: [{
                    expand: true,
                    cwd: 'dist/mobile/favorites',
                    src: ['**/*'],
                    dest: ''
                }]
            },
            mobile_feeds: {
                options: {
                    archive: 'dist/build/feeds/mobile.zip'
                },
                files: [{
                    expand: true,
                    cwd: 'dist/mobile/feeds',
                    src: ['**/*'],
                    dest: ''
                }]
            },
            mobile_pws: {
                options: {
                    archive: 'dist/build/pws/mobile.zip'
                },
                files: [{
                    expand: true,
                    cwd: 'dist/mobile/pws',
                    src: ['**/*'],
                    dest: ''
                }]
            },
            mobile_tempo: {
                options: {
                    archive: 'dist/build/tempo/mobile.zip'
                },
                files: [{
                    expand: true,
                    cwd: 'dist/mobile/tempo',
                    src: ['**/*'],
                    dest: ''
                }]
            },
            final_ews: {
                options: {
                    archive: 'dist/ews-app_16.0.0.zip'
                },
                files: [{
                    expand: true,
                    cwd: 'dist/build/ews',
                    src: ['**/*'],
                    dest: ''
                }]
            },
            final_favorites: {
                options: {
                    archive: 'dist/favorites-app_16.0.0.zip'
                },
                files: [{
                    expand: true,
                    cwd: 'dist/build/favorites',
                    src: ['**/*'],
                    dest: ''
                }]
            },
            final_feeds: {
                options: {
                    archive: 'dist/feeds-app_16.0.0.zip'
                },
                files: [{
                    expand: true,
                    cwd: 'dist/build/feeds',
                    src: ['**/*'],
                    dest: ''
                }]
            },
            final_pws: {
                options: {
                    archive: 'dist/pws-app_16.0.0.zip'
                },
                files: [{
                    expand: true,
                    cwd: 'dist/build/pws',
                    src: ['**/*'],
                    dest: ''
                }]
            },
            final_tempo: {
                options: {
                    archive: 'dist/tempo-app_16.0.0.zip'
                },
                files: [{
                    expand: true,
                    cwd: 'dist/build/tempo',
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