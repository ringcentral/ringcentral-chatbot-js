/* eslint-env jest */
import cronParser from 'cron-parser'
import moment from 'moment-timezone'

describe('models', () => {
  test('default', async () => {
    var interval = cronParser.parseExpression('*/2 * * * *', { utc: true })

    const prevTimestamp = interval.prev()._date
    const currentTimestamp = moment.tz(new Date(), 'utc')
    const delta = currentTimestamp - prevTimestamp

    expect(delta).toBeGreaterThanOrEqual(0)
    expect(delta).toBeLessThanOrEqual(120000)
  })
})
