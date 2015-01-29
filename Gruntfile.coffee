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


    # Compiles Sass to CSS and generates necessary files if requested
    compass:
      options:
        sassDir:                 "<%= app.public %>/styles"
        cssDir:                  "<%= app.tmp %>/styles"
        generatedImagesDir:      "<%= app.tmp %>/images/generated"
        imagesDir:               "<%= app.public %>/images"
        javascriptsDir:          "<%= app.public %>/scripts"
        fontsDir:                "<%= app.public %>/styles/fonts"
        importPath:              "<%= app.public %>/vendor"
        httpImagesPath:          "/images"
        httpGeneratedImagesPath: "/images/generated"
        httpFontsPath:           "/styles/fonts"
        relativeAssets:          false
        assetCacheBuster:        false

      dist:
        options:
          generatedImagesDir: "<%= app.dist %>/images/generated"

      server:
        options:
          debugInfo: false

    # Copies remaining files to places other tasks can use
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

    browserify:
      dev:
        options:
          transform: ["reactify"]
        browserifyOptions:
          debug:     true
        files:
          "<%= app.tmp %>/scripts/build.js": ["<%= app.public %>/scripts/**/*.js", "<%= app.public %>/scripts/**/*.jsx"]
      build:
        options:
          transform: ["reactify"]
          browserifyOptions:
            debug:     false
        files:
          "<%= app.dist %>/scripts/build.js": ["<%= app.tmp %>/scripts/**/*.js", "<%= app.tmp %>/scripts/**/*.jsx"]

    watch:
      options:
        nospawn: true
        livereload: true
      coffee:
        files: ["<%= app.public %>/scripts/**/*.{coffee}"]
        tasks: ["coffee:dist"]
      gruntfile:
        files: ["Gruntfile.coffee"]
      compass:
        files: ["<%= app.public %>/styles/**/*.{scss,sass}"]
        tasks: ["compass:server"]
      styles:
        files: ["<%= app.public %>/styles/**/*.css"]
        tasks: ["newer:copy:styles"]
      browserify:
        files: ["public/scripts/**/*.js", "public/scripts/**/*.jsx"]
        tasks: ["browserify:dev"]


    # Run some tasks in parallel to speed up build process
    concurrent:
      server: [
        "compass:server"
        "coffee:dist"
        "copy:styles"
      ]
      test: [
        "coffee"
        "copy:styles"
      ]
      dist: [
        "coffee"
        "compass"
        "copy:styles"
        "imagemin"
        "svgmin"
      ]

  grunt.registerTask "serve", ["clean:server", "concurrent:server", "browserify:dev", "watch"]
  grunt.registerTask "build", ["env:build", "browserify:build"]