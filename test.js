var {test_main, suite, test, assert} = require('unit-test');

require.paths.unshift('..');

var Raygun = require('decaf-raygun').Raygun,
    raygun = new Raygun('api key');

test_main('tests');
