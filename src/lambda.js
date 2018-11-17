import Lambda from 'aws-sdk/clients/lambda'

export const createAsyncProxy = functionName => {
  const lambda = new Lambda({ region: process.env.AWS_REGION })
  return (event, context, callback) => {
    lambda.invoke({
      FunctionName: process.env.AWS_LAMBDA_FUNCTION_NAME.replace(/-proxy$/, `-${functionName}`),
      InvocationType: 'Event',
      Payload: JSON.stringify(event)
    }, (error, data) => console.log(error, data))
    callback(null, { statusCode: 200, body: '', headers: { 'Validation-Token': event.headers['Validation-Token'] } })
  }
}
