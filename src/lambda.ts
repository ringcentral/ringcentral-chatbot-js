import Lambda from 'aws-sdk/clients/lambda';
import request from 'supertest';

export const createAsyncProxy = (
  functionName: string,
  filterApp: any = undefined
) => {
  const lambda = new Lambda({region: process.env.AWS_REGION});
  return async (event: any) => {
    const lambdaFunction = async () => {
      await lambda
        .invoke({
          FunctionName: process.env.AWS_LAMBDA_FUNCTION_NAME!.replace(
            /-proxy$/,
            `-${functionName}`
          ),
          InvocationType: 'Event',
          Payload: JSON.stringify(event),
        })
        .promise();
      return {
        statusCode: 200,
        headers: {
          'Validation-Token': event.headers['Validation-Token'],
          'Content-Type': 'text/html',
        },
        body: '<!doctype><html><body><script>close()</script><p>Please close this page</p></body></html>',
      };
    };
    if (filterApp === undefined) {
      return lambdaFunction();
    }
    const response = await request(filterApp).get(event.path);
    if (response.statusCode === 404) {
      return lambdaFunction();
    }
    return {
      statusCode: response.statusCode,
      headers: response.headers,
      body: response.text,
    };
  };
};
