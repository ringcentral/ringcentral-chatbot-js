import Lambda from 'aws-sdk/clients/lambda'
import request from 'supertest'

export const createAsyncProxy = (functionName, filterApp) => {
  const lambda = new Lambda({ region: process.env.AWS_REGION })
  return async (event, context, callback) => {
    console.log(event.path)
    const lambdaFunction = () => {
      lambda.invoke({
        FunctionName: process.env.AWS_LAMBDA_FUNCTION_NAME.replace(/-proxy$/, `-${functionName}`),
        InvocationType: 'Event',
        Payload: JSON.stringify(event)
      }, (error, data) => console.log(error, data))
      callback(null, {
        statusCode: 200,
        headers: {
          'Validation-Token': event.headers['Validation-Token'],
          'Content-Type': 'text/html'
        },
        body: '<!doctype><html><body><script>close()</script></body></html>'
      })
    }
    if (!filterApp) {
      return lambdaFunction()
    }
    const response = await request(filterApp).get(event.path)
    if (response.statusCode === 404) {
      return lambdaFunction()
    }
    callback(null, {
      statusCode: response.statusCode,
      headers: response.headers,
      body: response.text
    })
  }
}
