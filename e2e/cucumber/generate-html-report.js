const reporter = require('cucumber-html-reporter');
const pak = require('./../../package');

const options = {
    //['bootstrap', 'hierarchy', 'foundation', 'simple']
    theme: 'bootstrap',
    jsonDir: './target/cucumber',
    output: './target/cucumber/cucumber_report.html',
    reportSuiteAsScenarios: true,
    launchReport: true,
    brandTitle: 'Feature Report',
    metadata: {
        'App Version': pak.version,
        'Browser': 'Chrome',
        'Platform': 'Windows 7'
    }
};

const optionsSimple = {
    //['bootstrap', 'hierarchy', 'foundation', 'simple']
    theme: 'simple',
    jsonDir: './target/cucumber',
    output: './target/cucumber/cucumber_report_simple.html',
    reportSuiteAsScenarios: true,
    launchReport: true,
    brandTitle: 'Feature Report',
    metadata: {
        'App Version': pak.version,
        'Browser': 'Chrome',
        'Platform': 'Windows 7'
    }
};

let mode = '';
process.argv.forEach((val) => {
    if (val === '--simple') {
        mode = 'simple';
    }
});


switch (mode) {
    case 'simple':
        reporter.generate(optionsSimple);
        break;
    default:
        reporter.generate(options);
}

