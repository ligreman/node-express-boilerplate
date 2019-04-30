const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
// initalize sequelize with session store
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const cryptManager = require('@utils/crypt-manager');
const {CriticalError} = require('../../common/errors/custom-errors');
// Logger básico
const logger = require('winston').loggers.get('logger');


/**
 * Autentica al usuario
 * @param username User
 * @param password Pass
 * @param models Objeto de modelos de BBDD
 * @returns {Promise<void>} Promise resultante
 */
const authenticateUser = async function (username, password, models) {
    // Primero tengo que rescatar el usuario para verificar que su contraseña es correcta o no
    let user = await models.User.findOne({where: {username: username, status: true}});
    let finalUser = null;

    // Si no le he encontradou
    if (user !== null) {
        // verifico si la contraseña es correcta o no
        let same = await bcrypt.compare(password, user.password);

        if (same === true) {
            // Usuario correcto
            finalUser = user;
        }
    }

    return finalUser;
};

/**
 * Creamos una estrategia de autenticación Local (user+pass) para el login
 */
function createLocalStrategy(models) {
    passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        },
        function (username, password, done) {
            // autentico al usuario
            authenticateUser(username, password, models)
                .then(user => {
                    if (!user) {
                        logger.info('Credenciales del usuario %s no válidas al identificarse', username);
                        // Login erróneo
                        done(null, false);
                    } else {
                        logger.info('Usuario %s identificado correctamente', username);
                        // Login correcto
                        done(null, user);
                    }
                })
                .catch((err) => {
                    logger.error('Error al identificar al usuario %s', username);
                    logger.error('%O', err);
                    // Se produjo algún error al autenticar
                    done(err);
                });
        }
    ));
}

/**
 * Módulo de configuración de Passport para las sesiones y autenticación API
 * @param models Objeto con los modelos de base de datos
 * @returns {passport.PassportStatic | passport} Instancia de passport
 */
module.exports = function (app, database, config) {
    // Creo la estrategia de login según el método
    switch (config.session.strategy) {
        case 'ldap':
            //TODO futura estrategia por ldap
            break;
        case 'local':
            createLocalStrategy(database.models);
            break;
        default:
            throw new CriticalError('Can`t stablish session strategy');
    }

    // Configuramos el almacén de sesiones
    let theStore = new SequelizeStore({
        db: database.instance,
        table: 'sessions'
    });

    // Saco la clave de descifrado para el secreto de la sesión
    let theSecret = config.session.sessionSecret;

    if (config.session.isPasswordCyphed) {
        theSecret = cryptManager.decryptPasswordWithEnv(config.session.sessionSecret, config.session.environmentVarSecret);
    }

    if (theSecret === null || theSecret === '') {
        throw new CriticalError('Can`t decrypt data');
    }

    // Configuramos el middleware de Express para usar las sesiones mediante Sequelize
    // y también la configuración de la cookie que se creará en el usuario
    app.use(session({
        secret: theSecret,
        cookie: {
            httpOnly: true,
            secure: config.session.cookie.secure,
            maxAge: config.session.cookie.expirationMilis
        },
        name: 'app.sid',
        store: theStore,
        saveUninitialized: true,
        resave: false,
        proxy: false
    }));

    // Inicializamos passport y sus sesiones
    app.use(passport.initialize());
    app.use(passport.session());

    // Serialize de sesión para que passport sepa encontrar al usuario
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // deserialize de usuario de sesión
    passport.deserializeUser(function (id, done) {
        database.models.User.findByPk(id)
            .then((user) => {
                done(null, user);
                return null;
            })
            .catch((err) => {
                // Se produjo algún error al autenticar
                done(err);
                return null;
            });
    });

    return passport;
};
