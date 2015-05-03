var {test_main, suite, test, assert} = require('Tests');

require.paths.unshift('..');

var Raygun = require('decaf-raygun').Raygun,
    raygun = new Raygun('api key');

test_main('tests');
