const {CriticalError} = require('../errors/custom-errors');
const CryptoJSUtf8 = require('crypto-js/enc-utf8');
const AES = require('crypto-js/aes');

class CryptManager {
    /**
     * Descifra un dato mediante una variable de entorno
     * @param cryptData Datos cifrados
     * @param environmentKey variable de entorno donde se guarda la clave de descifrado
     * @returns {*} Dato descrifrado
     */
    decryptPasswordWithEnv(cryptData, environmentKey) {
        // Para cifrar podemos usar    console.log(AES.encrypt('textoplano', '12345').toString());
        // Cojo la clave de descifrado de las variables de entorno
        let key = process.env[environmentKey];

        // Chequeo que encontré la clave
        if (!key) {
            throw new CriticalError('Can`t get decrypt key');
        }

        // Descifro con la clave que he sacado de las variables de entorno
        let plain = AES.decrypt(cryptData, key).toString(CryptoJSUtf8);

        // Si no he conseguido descifrarla
        if (plain === null || plain === '') {
            throw new CriticalError('Can`t decrypt data');
        }

        return plain;
    }
}

/**
 * Este módulo crea un Manager para cifrar y descifrar
 */
module.exports = new CryptManager();
