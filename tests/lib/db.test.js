const db = require('../../src/lib/db')
const config = require('../../src/lib/config')

describe('Database', () => {

  beforeEach(async () => {
    config.init()
  })

  test('Connect DB', async () => {
    try {
      await db.connect()
    } catch(err) {
      expect(err).toBeNull()
    }

    await db.end()
  })

  test('Run a query', async () => {
    await db.connect()

    await db.query(`CREATE TABLE IF NOT EXISTS temp_table (fake_value varchar(512))`)
    let result = await db.tableExists('temp_table')
    expect(result).toBe(true)

    await db.query(`DROP TABLE temp_table`)
    result = await db.tableExists('temp_table')
    expect(result).toBe(false)

    await db.end()
  })

  test('Run a transaction', async () => {
    await db.connect()

    const client = await db.getClient()

    let result
    await client.query(`BEGIN`)
    await client.query(`CREATE TABLE IF NOT EXISTS temp_table_transaction (fake_value varchar(512))`, [])

    result = await client.query(`INSERT INTO temp_table_transaction VALUES ('one') RETURNING *`, [])
    expect(result.rows[0].fake_value).toBe('one')
    result = await client.query(`INSERT INTO temp_table_transaction VALUES ('two') RETURNING *`, [])
    expect(result.rows[0].fake_value).toBe('two')
    result = await client.query(`INSERT INTO temp_table_transaction VALUES ('three') RETURNING *`, [])
    expect(result.rows[0].fake_value).toBe('three')

    await client.query(`ROLLBACK`)

    result = await db.tableExists('temp_table_transaction')
    expect(result).toBe(false)

    client.release()
    await db.end()
  })
})