/**
 * Created by mschwartz on 5/1/15.
 */

//console.dir(require);

/*global require, exports, decaf */
var Client         = require('http').Client,
    process        = require('process'),
    File           = require('File'),
    packageDetails = JSON.parse(new File(require.fsPath + '../bower.json').readAll());

function Raygun(apiKey) {
    this.apiKey = apiKey;
}
decaf.extend(Raygun.prototype, {
    formatMessage : function (error, req, res) {
        var message = {
            occurredOn : new Date(),
            details    : {
                machineName : process.env.HOSTNAME,
                client      : {
                    name    : 'decaf-raygun',
                    version : packageDetails.version
                }
            }
        };
        // set error details
        if (error.stack) {
            var stack = [],
                parts,
                method;

            decaf.each(error.stack.split('\n'), function (line) {
                if (line.length) {
                    line = line.replace(/^\s*at\s+/, '');
                    if (~line.indexOf(':')) {
                        parts = line.split(':');
                    }
                    else if (~line.indexOf('#')) {
                        parts = line.split('#');
                    }
                    else {
                        return;
                    }
                    if (~parts[1].indexOf('(')) {
                        method = parts[1];
                        method = method.replace(/^.*\(/, '').replace(')', '');
                        parts[1] = parts[1].replace(/\s*\(.*$/, '');
                    }
                    else {
                        method = '[anonymous]';
                    }
                    stack.push({
                        lineNumber : parseInt(parts[1], 10),
                        className  : 'unknown',
                        fileName   : parts[0],
                        methodName : method
                    })
                }
            });
            message.details.error = {
                message    : error.message || "NoMessage",
                className  : error.name,
                stackTrace : stack
            };
            // environment
            message.details.environment = {
                osVersion               : process.properties['os.name'] + ' ' + process.properties['os.version'] + ' Java ' + process.properties['java.runtime.version'],
                architecture            : process.properties['os.arch'],
                totalPhysicalMemory     : process.getTotalMemory(),
                availablePhysicalMemory : process.getFreeMemory(),
                utcOffset               : new Date().getTimezoneOffset() / -60.0,
                processorCount          : process.getAvailableProcessors(),
                cpu                     : 'unknown'
            };
            // request
            if (req) {
                message.details.request = {
                    hostName    : req.host,
                    url         : req.uri,
                    httpMethod  : req.method,
                    ipAddress   : req.remote_addr,
                    queryString : req.queryString,
                    headers     : req.headers,
                    form        : req.data
                };
            }
            if (res) {
                message.details.response.statusCode = res.status
            }
        }
        return message;
    },
    sendError     : function (error, req, res) {
        var response = new Client('https://api.raygun.io/entries')
            .setHeader('Content-type', 'application/json')
            .setHeader('X-ApiKey', this.apiKey)
            .post(JSON.stringify(this.formatMessage(error, req, res)));
        return {
            status          : response.status,
            responseMessage : response.responseMessage,
            responseText    : response.responseText
        }
    }
});
decaf.extend(exports, {
    Raygun : Raygun
});
