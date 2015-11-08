module.exports = function(grunt) {
    var fs = require('fs');
    var swig = require('swig');
    var path = require('path');
    var _ = require('underscore');

    var theme = "2015-07";

    var globalConfig = {
        assetDestinationFolder: '../FrontendApplication/FrontendApplication/assets',
        theme: theme
    };

    // 1. All configuration goes here 
    grunt.initConfig({
        globalConfig: globalConfig,
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dist: {
                options: {
                    // style: 'compressed'
                },
                files: {
                    '<%= globalConfig.assetDestinationFolder %>/<%= globalConfig.theme %>/css/global.css': '_theme/scss/shared.scss',
                    '<%= globalConfig.assetDestinationFolder %>/<%= globalConfig.theme %>/css/employee.css': '_theme/scss/employee.scss',
                    '<%= globalConfig.assetDestinationFolder %>/<%= globalConfig.theme %>/css/broker.css': '_theme/scss/broker.scss',
                    '<%= globalConfig.assetDestinationFolder %>/<%= globalConfig.theme %>/css/iepngfix.css': '_theme/scss/iepngfix.scss'
                }
            }
        }, //end sass

        stripmq: {
            //Viewport options
            options: {
                width: 1000,
                type: 'screen'
            },
            all: {
                files: {
                    //follows the pattern 'destination': ['source']
                    '<%= globalConfig.assetDestinationFolder %>/<%= globalConfig.theme %>/css/lte-ie8.css': ['<%= globalConfig.assetDestinationFolder %>/<%= globalConfig.theme %>/css/global.css']
                }
            }
        },

        // scsslint: {
        //     allFiles: [
        //         '_scss/**/*.scss'
        //     ],
        //     options: {
        //         colorizeOutput: true
        //     }
        // },

        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: '_global/_img/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: '<%= globalConfig.assetDestinationFolder %>/img/'
                }]
            }
        }, //end imagemin

        jshint: {
            files: ['_theme/**/*.js'],
            jshintrc: '.jshintrc'
        }, //end jshint

        clean: {
            options: {
                force: true
            },
            asset: {
                src: ["<%= globalConfig.assetDestinationFolder %>/**/*"]
            }
        },

        localize: {
            app_2015_01: {
                locales: ['dev', 'en', 'zh-cn', 'th'],
                localeDir: '_global/_localization/',
                cwd: '_theme/',
                src: ['**/*.{html,js,json}'],
                dest: '<%= globalConfig.assetDestinationFolder %>/' + theme + '/'
            }
        },

        uglify: {
            options: {
                mangle: false
            },
            lib: {
                files: [{
                    expand: true,
                    cwd: '_global/_lib/',
                    src: '**/*.js',
                    dest: '<%= globalConfig.assetDestinationFolder %>/lib/'
                }]
            },
            theme: {
                files: [{
                    expand: true,
                    cwd: '<%= globalConfig.assetDestinationFolder %>/' + theme + '/',
                    src: '**/*.js',
                    dest: '<%= globalConfig.assetDestinationFolder %>/' + theme + '/'
                }]
            }
        },

        copy: {
            themeAssets: {
                cwd: '_theme/assets/',
                src: '**/*',
                dest: '<%= globalConfig.assetDestinationFolder %>/<%= globalConfig.theme %>/assets/',
                expand: true
            },
            root: {
                cwd: '_global/',
                src: '*.*',
                dest: '<%= globalConfig.assetDestinationFolder %>/',
                expand: true
            },
            redirects: {
                cwd: '_global/Services/',
                src: '**/*',
                dest: '<%= globalConfig.assetDestinationFolder %>/Services/',
                expand: true
            },
            globalImg: {
                cwd: '_global/_img/',
                src: '**/*',
                dest: '<%= globalConfig.assetDestinationFolder %>/img/',
                expand: true
            },
            fonts: {
                cwd: '_global/_fonts/',
                src: '**/*',
                dest: '<%= globalConfig.assetDestinationFolder %>/fonts/',
                expand: true
            },
            lib: {
                cwd: '_global/_lib/',
                src: '**/*',
                dest: '<%= globalConfig.assetDestinationFolder %>/lib/',
                expand: true
            }
        }, //end copy

        watch: {
            options: {
                livereload: true,
                interval: 5007
            },
            js: {
                files: ['_theme/**/*.js'],
                tasks: ['jshint'],
                options: {
                    nospawn: true
                }
            }, //end watch js
            assets: {
                files: ['_theme/assets/**/*'],
                tasks: ['copy'],
                options: {
                    nospawn: true
                }
            }, //end watch assets
            app: {
                files: ['_theme/**/*.{html,js}'],
                tasks: ['localize'],
                options: {
                    nospawn: true
                }
            }, //end watch app  
            root: {
                files: ['_global/*.{html,js}'],
                tasks: ['copy:root'],
                options: {
                    nospawn: true
                }
            }, //end watch root
            css: {
                files: ['_theme/scss/**/*.scss'],
                tasks: ['sass', 'stripmq'],
                options: {
                    nospawn: true
                }
                // lib: {
                //     files: ['_lib/**/*.*'],
                //     tasks: ['copy:lib'],
                //     options: {
                //         nospawn: true
                //     }
            }
        } //end watch
    }); //end initConfig

    grunt.registerMultiTask('localize', 'swig templater', function() {
        swig.invalidateCache();
        var locales = this.data.locales;
        var localeDir = this.data.localeDir;
        var inputDir = this.data.cwd;
        var outputDir = this.data.dest;

        var localeJson = [];
        locales.forEach(function(locale) {
            if (locale === "dev") {
                var devLocale = grunt.file.readJSON(localeDir + "en.json");
                var charMap = {
                    'a': '\u00E5',
                    'b': '\u0181',
                    'c': '\u0186',
                    'd': '\u0189',
                    'e': '\u018E',
                    'f': '\u0283',
                    'g': '\u0260',
                    'h': '\u0267',
                    'i': '\u01D0',
                    'j': '\u0249',
                    'k': '\u029E',
                    'l': '\u0234',
                    'm': '\u0271',
                    'n': '\u0272',
                    'o': '\u0298',
                    'p': '\u01A4',
                    'q': '\u024B',
                    'r': '\u0393',
                    's': '$',
                    't': '\u03EE',
                    'u': '\u028A',
                    'v': '\u028C',
                    'w': '\u0461',
                    'x': '\u03A7',
                    'y': '\u0177',
                    'z': '\u0179'
                };

                devLocale = _.mapObject(devLocale, function(val) {
                    var lower = val.toLowerCase();
                    var devVal = "!?";
                    for (var i = 0, len = lower.length; i < len; i++) {
                        var newChar = charMap[lower[i]];
                        if (newChar !== undefined) {
                            devVal += newChar;
                        } else {
                            devVal += lower[i];
                        }
                    }
                    devVal += "?!";
                    return devVal;
                });
                localeJson[locale] = devLocale;
            } else {
                localeJson[locale] = grunt.file.readJSON(localeDir + locale + ".json");
            }
            localeJson[locale].theme = theme;
        });

        // Iterate over all files
        this.filesSrc.forEach(function(file) {
            locales.forEach(function(locale) {
                var inputFile = inputDir + file;
                var outputFile = outputDir + locale + "/" + file;
                // grunt.log.writeln(inputFile + " => " + outputFile);
                grunt.file.write(outputFile, swig.renderFile(inputFile, localeJson[locale]));
            });
        });
    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    require('load-grunt-tasks')(grunt);

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['clean', 'jshint', 'localize', 'sass', 'stripmq', 'copy', 'watch']);
    grunt.registerTask('dist', ['clean', 'jshint', 'localize', 'sass', 'stripmq', 'imagemin', 'copy', 'uglify']);
};
module.exports = function(grunt) {

    grunt.initConfig({
        api_benchmark: {
            my_api: {
                options: {
                    output: 'generated'
                },
                files: {
                    'report.html': 'config.json'
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-api-benchmark');
    grunt.registerTask('benchmark', ['api_benchmark']);
};
