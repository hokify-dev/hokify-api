const Swagger = require('swagger-client');
const spec = require('../swagger.json');

const request = require('request');
const fs = require('fs');


(async () => {
    spec.host = 'test.hokify.com'; // use test environment

    const client = await new Swagger({
        spec,
        usePromise: true
    });

    const loginResponse = await client.auth.login({
            body: {
                mandator: '<YOUR-ID>',
                token: '<YOUR-TOKEN>'
            }
        }
    );
    console.log('loginResponse', loginResponse.obj);

    client.clientAuthorizations.add('hokify_session_token',
        new Swagger.ApiKeyAuthorization(
            'x-session-token',
            loginResponse.obj.sessionToken,
            'header'
        )
    );

    let appliations = await client.application.getAllApplications();

    console.log('applications', appliations.obj);

    let application = appliations.obj[0];


    request.get('https://test.hokify.com/api/get-match-file-extern', {
        headers: {
            'x-session-token': loginResponse.obj.sessionToken
        },
        qs: {
            match: application.matchId,
            file: 'profile'
        }
    })
        .on('response', (response) => {
            response.pipe(fs.createWriteStream('../matchfiles/' + response.headers.filename));
        });

})()
    .catch((err) => console.log('something went wrong', err));


