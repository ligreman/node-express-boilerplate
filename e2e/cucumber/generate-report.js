var reporter = require('cucumber-html-reporter');

var options = {
    //['bootstrap', 'hierarchy', 'foundation', 'simple']
    theme: 'bootstrap',
    jsonFile: './target/cucumber/cucumber_report.json',
    output: './target/cucumber/cucumber_report.html',
    reportSuiteAsScenarios: true,
    launchReport: true,
    metadata: {
        'App Version': '0.3.2',
        'Test Environment': 'STAGING',
        'Browser': 'Chrome  54.0.2840.98',
        'Platform': 'Windows 10',
        'Parallel': 'Scenarios',
        'Executed': 'Remote'
    }
};

reporter.generate(options);
