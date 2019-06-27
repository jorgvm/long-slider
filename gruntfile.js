module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    autoprefixer: {
      single_file: {
        src: "dist/css/main.css",
        dest: "dist/css/main.css"
      }
    },
    browserSync: {
      bsFiles: {
        src: "dist/css/main.css"
      },
      options: {
        proxy: "localhost",
        watchTask: true
      }
    },
    sass: {
      options: {
        style: "compressed"
      },
      dist: {
        files: {
          "dist/css/main.css": "scss/main.scss"
        }
      }
    },
    watch: {
      css: {
        files: "scss/**/*.scss",
        tasks: ["sass", "autoprefixer"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-autoprefixer");
  grunt.loadNpmTasks("grunt-contrib-sass");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-browser-sync");
  grunt.registerTask("default", ["sass", "autoprefixer", "watch"]);
  grunt.registerTask("sync", ["sass", "autoprefixer", "browserSync", "watch"]);
};
