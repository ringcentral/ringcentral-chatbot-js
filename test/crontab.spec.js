/* eslint-env jest */
import cronParser from 'cron-parser'
import moment from 'moment-timezone'

describe('models', () => {
  test('default', async () => {
    const interval = cronParser.parseExpression('*/2 * * * *', { utc: true })

    const prevTimestamp = interval.prev()._date
    const currentTimestamp = moment.tz(new Date(), 'utc')
    const delta = currentTimestamp - prevTimestamp

    expect(delta).toBeGreaterThanOrEqual(0)
    expect(delta).toBeLessThanOrEqual(120000) // milliseconds
  })

  test('wrong syntax', () => {
    expect(() => cronParser.parseExpression('fdafsd', { utc: true })).toThrowError()
  })

  test('syntax must have 5 tokens', () => {
    expect('*/2 * * * *'.split(/\s+/).length).toBe(5)
  })
})
