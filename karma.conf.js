module.exports = function(config){
    config.set({

        basePath : './',

        logLevel: config.LOG_DEBUG,

        files : [
            'src/indent.js',
            'tests/utils.js',
            'tests/**/*.spec.js'
        ],

        exclude : [
        ],

        reporters: ['progress', 'coverage'],

        preprocessors: {
            "src/indent.js": ['coverage']
        },

        autoWatch : false,

        frameworks: ['jasmine'],

        browsers : ['PhantomJS'],

        plugins : [
            'karma-jasmine',
            'karma-phantomjs-launcher',
            'karma-coverage'
        ]
    });
};