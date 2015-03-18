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
      server: "server"
      tmp:    ".tmp"
      vendor: "node_modules"

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
          "<%= app.tmp %>/styles/main.css": "<%= app.public %>/styles/main.less"

      # The following *-min tasks produce minified files in the dist folder
    imagemin:
      dist:
        files: [
          expand: true
          cwd:    "<%= app.public %>/images"
          src:    "**/*.{gif,jpeg,jpg,png}"
          dest:   "<%= app.dist %>/images"
        ]


      #uglify2: {} // https://github.com/mishoo/UglifyJS2
    cssmin:
      target:
        files: [{
          expand: true
          cwd: '<%= app.tmp %>/styles'
          src: ['*.css', '!*.min.css']
          dest: '<%= app.dist %>/styles'
          ext: '.min.css'
        }]


      # Renames files for browser caching purposes
    rev:
      dist:
        files:
          src: [
            "<%= app.dist %>/scripts/**/*.js"
            "<%= app.dist %>/styles/**/*.css"
            "<%= app.dist %>/images/**/*.{gif,jpeg,jpg,png}"
            "<%= app.dist %>/styles/fonts/{,*/}*.*"
          ]


      # Reads HTML for usemin blocks to enable smart builds that automatically
      # concat, minify and revision files. Creates configurations in memory so
      # additional tasks can operate on them
    useminPrepare:
      options:
        dest: "<%= app.dist %>"

      html: [
          "<%= app.server %>/views/index.hbs"
      ]


      # Performs rewrites based on rev and the useminPrepare configuration
    usemin:
      options:
        assetsDirs: ["<%= app.dist %>"]

      html: ["<%= app.dist %>/views/index.hbs"]
      css:  ["<%= app.dist %>/styles/**/*.css"]

    svgmin:
      dist:
        files: [
          expand: true
          cwd:    "<%= app.public %>/images"
          src:    "**/*.svg"
          dest:   "<%= app.dist %>/images"
        ]

    htmlmin:
      dist:
        options:
          collapseBooleanAttributes: true
          collapseWhitespace:        true
          removeAttributeQuotes:     true
          removeCommentsFromCDATA:   true
          removeEmptyAttributes:     true
          removeOptionalTags:        true
          removeRedundantAttributes: true
          useShortDoctype:           true

        files: [
          expand: true
          cwd:    "<%= app.dist %>"
          src:    ["{,*/}*.{html,hbs}"]
          dest:   "<%= app.dist %>"
        ]

  # Add vendor prefixed styles
    autoprefixer:
      options:
        browsers: ["last 1 version"]

      dist:
        files: [
          expand: true
          cwd:    ".tmp/styles/"
          src:    "**/*.css"
          dest:   ".tmp/styles/"
        ]

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
              "styles/fonts/{,*/}*.*"
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
          {
            expand:  true
            dot:     true
            dest:    "<%= app.dist %>/fonts"
            cwd:     'node_modules/material-design-fonticons/fonts/mdfonticon'
            src:     ["**"]
          }
        ]

      styles:
        files: [
          {
            expand: true
            dot:    true
            cwd:    "<%= app.public %>/styles"
            dest:   "<%= app.tmp %>/styles/"
            src:    "{,*/}*.css"
          }
          {
          # client app vendor files
            expand: true
            dot:    true
            cwd:    "<%= app.vendor %>"
            dest:   "<%= app.tmp %>/styles"
            src:    [
              "dropzone/dist/dropzone.css"
              "dropzone/dist/basic.css"
              "medium-editor/dist/css/medium-editor.css"
              "medium-editor/dist/css/themes/flat.css"
            ]
          }
        ]


      fonts:
        files: [
          {
            expand:  true
            dot:     true
            dest:    "<%= app.public %>/styles"
            cwd:     'node_modules/material-design-fonticons/styles'
            src:     ["mdfi.css", "mdfi_navigation.css"]
          },
          {
            expand:  true
            dot:     true
            dest:    "<%= app.public %>/fonts"
            cwd:     'node_modules/material-design-fonticons/fonts/mdfonticon'
            src:     ["**"]
          }
        ]
    replace:
      dist:
        src: "<%= app.dist %>/views/index.hbs"
        dest: "<%= app.dist %>/views/index.hbs"
        replacements: [
          {
            from: "href=/styles/"
            to: "href=/admin/site/styles/"
          },
          {
            from: "src=/scripts/"
            to: "src=/admin/site/scripts/"
          }
        ]

    browserify:
      dev:
        options:
          transform: ["reactify"]
          browserifyOptions:
            debug:     true
        files:
          "<%= app.tmp %>/scripts/build.js": ["<%= app.public %>/scripts/app.{js,jsx}"]
      build:
        options:
          transform: ["reactify"]
          browserifyOptions:
            debug:     false
        files:
          "<%= app.dist %>/scripts/build.js": ["<%= app.public %>/scripts/app.{js,jsx}"]
          "<%= app.tmp %>/concat/scripts/build.js": ["<%= app.public %>/scripts/app.{js,jsx}"]

    watch:
      options:
        nospawn: true
        livereload: 35730
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
        "less:dev"
        "copy:styles"
      ]

  grunt.registerTask "serve", ["clean:server", "concurrent:server", "browserify:dev", "watch"]
  grunt.registerTask "build", [
    "clean:dist",
    "env:build",
    "concurrent:dist",

    "useminPrepare"
    "concat"
    "autoprefixer"
    "cssmin"
    "copy:dist"

    "imagemin"
    "svgmin"

    "browserify:build"
    "uglify"

    "rev"
    "usemin"
    "htmlmin"
    "replace:dist"
  ]