"use strict"

# Globbing
# for performance reasons we're only matching one level down:
# 'test/spec/{,*/}*.js'
# use this if you want to recursively match all subfolders:
# 'test/spec/**/*.js'
module.exports = (grunt)->

  # Load grunt tasks automatically
  require("load-grunt-tasks") grunt

  # Time how long tasks take. Can help when optimizing build times
  require("time-grunt") grunt

  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

    env:
      build:
        NODE_ENV: 'production'

    browserify:
      dev:
        options:
          debug:     true
          transform: ['reactify']
        files:
          'public/build/build.js': ['public/js/**/*.js', 'public/js/**/*.jsx']
      build:
        options:
          debug:     false
          transform: ['reactify']
        files:
          'public/build/build.js': ['public/js/**/*.js', 'public/js/**/*.jsx']

    watch:
      browserify:
        files: ['public/js/**/*.js', 'public/js/**/*.jsx']
        tasks: ['browserify:dev']
      options:
        nospawn: true

  grunt.registerTask 'default', ['watch']
  grunt.registerTask 'build', ['env:build', 'browserify:build']