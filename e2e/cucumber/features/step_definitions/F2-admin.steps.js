const {AfterAll, Before, Given, Then, When} = require('cucumber');
const request = require('supertest');
const {expect} = require('chai');

global.testModeExecution = true;

Then(/^se ha modificado el usuario (.*), cuyos datos previos están en "(.*)", con los datos (.*)$/,
    async function (userId, previousKey, data) {
        // Compruebo que las dos entradas que habrá en recursos de este dispositivo tienen diferente información
        const user = await this.models.User.findByPk(userId);
        expect(user).to.not.be.null;

        // Parseo los datos a JSON
        data = JSON.parse(data);

        // Miro campo a campo en los data pasados al endpoint si se ha hecho el cambio
        for (const field in data) {
            if (data.hasOwnProperty(field)) {
                // Si el campo es el de contraseña no puedo saber cuál es el valor que le ha dado al campo,
                // compruebo que ha cambiado simplemente
                if (field === 'password') {
                    if (previousKey) {
                        // Lo compruebo si he guardado los datos previamente
                        let previous = this.get(previousKey);
                        expect(user[field]).to.not.be.equal(previous.password);
                    }
                } else {
                    // compruebo si el valor en BBDD es el que le he pasado al endpoint
                    expect(user[field]).to.be.equal(data[field]);
                }
            }
        }
    });

Given(/^recojo la información actual del usuario (.*) de BBDD en la variable "([^"]*)"$/,
    async function (userId, key) {
        const user = await this.models.User.findByPk(userId);
        this.set(key, user);
    });
