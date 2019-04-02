require('module-alias/register');
const {Given, When, Then} = require('cucumber');
const {expect} = require('chai');

// Config de base de datos
global.testModeExecution = true;

Given('a variable set to {int}', function (number) {
    this.setTo(number);
});

When('I increment the variable by {int}', function (number) {
    this.saveRequest('err', 'res');
    this.incrementBy(number);
});

Then('the variable should contain {int}', function (number) {
    // Recupero la última request hecha
    let request = this.lastRequest;
    expect(this.variable).to.eql(number);
});
