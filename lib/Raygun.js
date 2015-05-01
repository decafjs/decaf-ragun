/**
 * Created by mschwartz on 5/1/15.
 */

/*global require, exports, decaf */
var Client         = require('http').Client,
    process        = require('process'),
    File           = require('File'),
    packageDetails = JSON.parse(new File('../bower.json').readAll());

function Raygun(apiKey) {
    this.apiKey = apiKey;
}
decaf.extend(Raygun.prototype, {
    formatMessage : function (error, req, res) {
        var message = {
            occurredOn : new Date(),
            details    : {
                client : {
                    name    : 'decaf-raygun',
                    version : packageDetails.version
                }
            }
        };
        // set error details
        if (error.stack) {
            var stack = [];
            decaf.each(error.stack.split('\n'), function(line) {
                if (line.length) {
                    line = line.replace(/^\s*at\s+/, '');
                    console.dir({ line: line })
                }
            })
        }
        return message;
    },
    sendError     : function (error, req, res) {

    }
});
decaf.extend(exports, {
    Raygun : Raygun
});
