"use strict"

# Globbing
# for performance reasons we"re only matching one level down:
# "test/spec/{,*/}*.js"
# use this if you want to recursively match all subfolders:
# "test/spec/**/*.js"
module.exports = (grunt)->

  # Load grunt tasks automatically
  require("load-grunt-tasks") grunt

  # Time how long tasks take. Can help when optimizing build times
  require("time-grunt") grunt

  grunt.initConfig
    pkg: grunt.file.readJSON "package.json"

    # Project settings
    app:
      # Configurable paths
      public: "public"
      dist:   "dist"
      server: "."
      tmp:    ".tmp"

    env:
      build:
        NODE_ENV: "production"

    # Empties folders to start fresh
    clean:
      dist:
        files: [
          dot: true
          src: [
            "<%= app.tmp %>"
            "<%= app.dist %>/*"
          ]
        ]
      server: "<%= app.tmp %>"

    # Compiles CoffeeScript to JavaScript
    coffee:
      dist:
        files: [
          expand: true
          cwd:    "<%= app.public %>/scripts"
          src:    "**/*.{coffee}"
          dest:   "<%= app.tmp %>/scripts"
        ]

    less:
      dev:
        options:
          paths: ["<%= app.public %>/styles"]
        files:
          "<%= app.tmp %>/styles/main.css": "<%= app.public %>/styles/main.less"

      dist:
        options:
          paths: ["<%= app.public %>/styles"]

        files:
          "<%= app.dist %>/styles/main.css": "<%= app.public %>/styles/main.less"

    copy:
      dist:
        files: [# client app files
          {
            expand: true
            dot:    true
            cwd:    "<%= app.public %>"
            dest:   "<%= app.dist %>"
            src:    [
              "*.{ico,png,txt}"
              ".htaccess"
              "{,*/}*.html"
              "styles/fonts/{,*/}*.*"
              "vendor/bootstrap-sass/vendor/assets/fonts/bootstrap/*.*"
              "vendor/fontawesome/fonts/*.*"
            ]
          }
          {
          # server app files
            expand: true
            dot:    true
            cwd:    "<%= app.server %>"
            dest:   "<%= app.dist %>"
            src:    ["views/{,*/}*.hbs"]
          }
        ]

      bodge:
        files: [
          expand: true
          dot:    true
          cwd:    "<%= app.public %>/scripts"
          dest:   "<%= app.tmp %>"
          src:    ["**/*.js"]
        ]

      styles:
        expand: true
        dot:    true
        cwd:    "<%= app.public %>/styles"
        dest:   "<%= app.tmp %>/styles/"
        src:    "{,*/}*.css"

      fonts:
        files: [
          {
            expand: true
            dot:    true
            dest:   "<%= app.public %>/styles/fonts"
            cwd: 'node_modules/material-design-fonticons/fonts/'
            src:    [
              "**"
            ]
          }
        ]

    browserify:
      dev:
        options:
          transform: ["es6ify", "reactify"]
          browserifyOptions:
            debug:     true
        files:
          "<%= app.tmp %>/scripts/build.js": ["<%= app.public %>/scripts/app.{js,jsx}"]
      build:
        options:
          transform: ["es6ify", "reactify"]
          browserifyOptions:
            debug:     false
        files:
          "<%= app.dist %>/scripts/build.js": ["<%= app.public %>/scripts/app.{js,jsx}"]

    watch:
      options:
        nospawn: true
        livereload: true
      coffee:
        files: ["<%= app.public %>/scripts/**/*.{coffee}"]
        tasks: ["coffee:dist"]
      gruntfile:
        files: ["Gruntfile.coffee"]
      less:
        files: ["<%= app.public %>/styles/*.less"]
        tasks: ["less:dev"]
      styles:
        files: ["<%= app.public %>/styles/**/*.css"]
        tasks: ["newer:copy:styles"]
      browserify:
        files: ["public/scripts/**/*.js", "public/scripts/**/*.jsx"]
        tasks: ["browserify:dev"]


    # Run some tasks in parallel to speed up build process
    concurrent:
      server: [
        "less:dev"
        "coffee:dist"
        "copy:styles"
        "copy:fonts"
      ]
      test: [
        "coffee"
        "copy:styles"
      ]
      dist: [
        "coffee"
        "less"
        "copy:styles"
        "imagemin"
        "svgmin"
      ]

  grunt.registerTask "serve", ["clean:server", "concurrent:server", "browserify:dev", "watch"]
  grunt.registerTask "build", ["env:build", "browserify:build"]