const Swagger = require('swagger-client');
const spec = require('../swagger.json');

(async () => {
  const client = await new Swagger({
    spec,
    usePromise: true
  });

  client.clientAuthorizations.add(
    'JOB_API_BASIC',
    new Swagger.PasswordAuthorization('<MANDATOR_ID>', '<MANDATOR_TOKEN>')
  );

  const loginResponse = await client.authentication.Token();
  console.log('loginResponse', loginResponse.obj);

  client.clientAuthorizations.add(
    'JOB_API_BEARER',
    new Swagger.ApiKeyAuthorization(
      'Authorization',
      'Bearer ' + loginResponse.obj.access_token,
      'header'
    )
  );

  const applications = await client.application.GetApplications();

  const latestApplication = applications.obj.pop();
  console.log('latestApplication', JSON.stringify(latestApplication, null, 3));
})().catch(err => console.log('something went wrong', err));
