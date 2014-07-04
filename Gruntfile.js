'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' + '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' + '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' + ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

        // -- Clean Config ---------------------------------------------------------
        clean: {
            files: ['dist']
        },
        // -- copy config ----------------------------------------------------------
        copy: {
            jquery_asScrollbar: {
                files: [{
                    expand: true,
                    flatten: true,
                    cwd: 'bower_components/jquery-asScrollbar/',
                    src: ['dist/*.js'],
                    dest: 'demo/js/'
                }]
            },
        },
        // -- Concat Config --------------------------------------------------------
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: ['src/<%= pkg.name %>.js'],
                dest: 'dist/<%= pkg.name %>.js'
            },
        },
        // -- uglify Config --------------------------------------------------------
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/<%= pkg.name %>.min.js'
            },
        },
        // -- jshint Config --------------------------------------------------------
        jshint: {
            gruntfile: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: 'Gruntfile.js'
            },
            src: {
                options: {
                    jshintrc: 'src/.jshintrc'
                },
                src: ['src/**/*.js']
            }
        },
        // -- watch Config ---------------------------------------------------------
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            src: {
                files: '<%= jshint.src.src %>',
                tasks: ['jshint:src', 'qunit']
            }
        },
        // -- jsbeautifier Config --------------------------------------------------
        jsbeautifier: {
            files: ['Gruntfile.js', "src/**/*.js"],
            options: {
                "indent_size": 4,
                "indent_char": " ",
                "indent_level": 0,
                "indent_with_tabs": true,
                "preserve_newlines": true,
                "max_preserve_newlines": 10,
                "jslint_happy": false,
                "brace_style": "collapse",
                "keep_array_indentation": false,
                "keep_function_indentation": false,
                "space_before_conditional": true,
                "eval_code": false,
                "indent_case": false,
                "unescape_strings": false
            },
        },
        // -- replace Config --------------------------------------------------------
        replace: {
            bower: {
                src: ['bower.json'],
                overwrite: true, // overwrite matched source files
                replacements: [{
                    from: /("version": ")([0-9\.]+)(")/g,
                    to: "$1<%= pkg.version %>$3"
                }]
            },
            jquery: {
                src: ['asGalleryPicker.jquery.json'],
                overwrite: true, // overwrite matched source files
                replacements: [{
                    from: /("version": ")([0-9\.]+)(")/g,
                    to: "$1<%= pkg.version %>$3"
                }]
            },
        },
        // -- recess config -------------------------------------------------------
        recess: {
            dist: {
                options: {
                    compile: true
                },
                files: {
                    'demo/css/asGalleryPicker.css': ['less/asGalleryPicker.less'],
                }
            }
        },
    });



    // -- Main Tasks ---------------------------------------------------------------
    // These plugins provide necessary tasks.
    require('load-grunt-tasks')(grunt, {
        pattern: ['grunt-*']
    });

    // Default task.
    grunt.registerTask('default', ['jshint', 'clean', 'copy', 'dist', 'css']);
    grunt.registerTask('dist', ['concat', 'uglify']);
    grunt.registerTask('css', ['recess']);
    grunt.registerTask('js', ['jshint', 'jsbeautifier']);

    grunt.registerTask('version', [
        'replace:bower',
        'replace:jquery'
    ]);

};
