const {src, dest, series, parallel} = require('gulp');
const merge = require('merge-stream');
const del = require('del');
const install = require('gulp-install');
const exec = require('child_process').exec;
const zip = require('gulp-zip');
const appVersion = require('./package.json').version;

// Limpia las carpetas de dist
function cleanDist() {
    return del(['target/dist']);
}

// Limpia las carpetas temporales
function cleanTemp() {
    return del(['.temp/dist']);
}

// Limpia las carpetas temporales
function cleanCucumber() {
    return del(['target/cucumber']);
}

// copia los ficheros al directorio temporal
function copyDist() {
    var srcFiles = src(['app.js', 'package.json'])
        .pipe(dest('.temp/dist'));

    var rootFiles = src(['src/**/*', '!src/**/*.test.js'])
        .pipe(dest('.temp/dist/src'));

    return merge(srcFiles, rootFiles);
}

// Copia los ficheros de la carpeta dist temporal a la de target
function copyTempToDist() {
    return src(['.temp/dist/**/*', '!.temp/dist/package-lock.json'])
        .pipe(dest('target/dist'));
}

// ejecuta npm install sobre el package.json elegido
function npmInstall() {
    return src(['.temp/dist/package.json'])
        .pipe(install({
            args: ['--production']
        }));
}

// Ejecuta cucumber
function cucumberExecution(cb) {
    exec('npm run cucumber', function (err, stdout, stderr) {
        cb(err);
    });
}

// Ejecuta el report de cucumber
function cucumberReport(cb) {
    exec('npm run cucumber-report', function (err, stdout, stderr) {
        cb(err);
    });
}


// Envía a kiuwan los datos
// Requiere el cliente de kiuwan instalado en máquina local
function kiuwanReport(cb) {
    // Saco la ruta hasta el raíz del proyecto
    let path = __dirname;

    console.log('Generando el informe de Kiuwan [agent.cmd -s "' + path + '" -n NOMBRE_APP]');
    console.log('Puede tardar unos minutos');

    exec('agent.cmd -s "' + path + '" -n NOMBRE_APP', function (err, stdout, stderr) {
        console.log(stdout);

        console.log(stderr);
        cb(err);
    });
}

// Zipea el contenido de target
function zipTarget() {
    return src('target/dist/**/*.*')
        .pipe(zip('app_v' + appVersion + '.zip'))
        .pipe(dest('target'));
}

exports.kiuwan = series(kiuwanReport);
exports.cucumber = series(cleanCucumber, cucumberExecution, cucumberReport);
exports.build = series(parallel(cleanDist, cleanTemp), copyDist, npmInstall, copyTempToDist, zipTarget);
exports.default = exports.build;
