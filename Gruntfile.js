module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        uglify: {
            options: {
                banner: "/*! <%= pkg.name %> | <%= pkg.author %> | <%= pkg.license %> */\n",
                sourceMap: false
            },
            build: {
                files: [
                    {
                        src: [
                            'src/modules/controllers.js',
                            'src/modules/tv-admin-controllers.js',
                            'src/modules/project-config-controllers.js',
                            'src/modules/member-card-controllers.js',
                            'src/modules/orders-controllers.js',
                            'src/modules/directives.js',
                            'src/modules/services.js',
                            'src/modules/filters.js',
                            'src/modules/qcode-controller.js',
                            'src/modules/report-controller.js',
                            'plugins/angular-locale_zh-cn.js',
                            'plugins/ramda.min.js'
                        ],
                        dest: "dist/js/app.min.js"
                    }
                ]
            }
        },

        cssmin: {
          combine: {
            files: {
              'dist/style/app.min.css': ['src/style/app.css','src/style/ionic.parts.css']
            }
          }
        },

        watch: {
            js: {
                files: "src/*/*.js",
                tasks: ["uglify"]
            },
            css: {
                files: "src/style/*.css",
                tasks: ["cssmin"]
            }
        }
    })

    grunt.loadNpmTasks("grunt-contrib-cssmin")
    grunt.loadNpmTasks("grunt-contrib-uglify")
    grunt.loadNpmTasks("grunt-contrib-watch")
    grunt.registerTask("default", ["uglify", "cssmin", "watch"])
}
