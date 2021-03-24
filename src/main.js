'use strict';

const fs = require('fs');
const pathLib = require('path');

exports.handler = (event, context, callback) => {

    // Get request and request headers
    const request = event.Records[0].cf.request;
    const headers = request.headers;

    const path = pathLib.resolve("params.json");
    let text = fs.readFileSync(path).toString();
    const params = JSON.parse(text);

    // Configure authentication
    // Read from provided params.json (populated by terraform)
    const authUser = params.authUser;
    const authPass = params.authPassword;

    // Construct the Basic Auth string
    const authString = 'Basic ' + new Buffer(authUser + ':' + authPass).toString('base64');

    const authStrings = [ authString ];
    const protectedPaths = [ "^\/.+$"];
    const unprotectedPaths = ["^\/res\/.+$"];

    // Require Basic authentication
    if (isProtectedURL(request.uri, protectedPaths, unprotectedPaths) && 
        (typeof headers.authorization == 'undefined' || !authStrings.includes(headers.authorization[0].value))) {

        const body = 'Unauthorized';
        const response = {
            status: '401',
            statusDescription: 'Unauthorized',
            body: body,
            headers: {
                'www-authenticate': [{key: 'WWW-Authenticate', value:'Basic'}]
            },
        };
        callback(null, response);
    }

    // Continue request processing if authentication passed
    callback(null, request);
};

function isProtectedURL(path, protectedPaths, unprotectedPaths) {
    let i = 0;
    for (; i < protectedPaths.length; i++) {
        if (path.match(protectedPaths[i])) {
            let ii = 0;
            for(; ii < unprotectedPaths.length; ii++) {
                if (path.match(unprotectedPaths[ii])) {
                    return false;
                }
            }
            
            return true;
        }
    }

    return false;
};
