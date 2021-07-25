/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.createTable('product', {
    id: { type: 'serial', primaryKey: true },
    sku: { type: 'varchar(5)', notNull: true, unique: true },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  })
  pgm.createIndex('product', 'sku')

  pgm.createTable('stock', {
    id: { type: 'serial', primaryKey: true },
    stock: {
      type: 'integer',
      notNull: true,
    },
    product_id: {
      type: 'integer',
      notNull: true,
      references: '"product"',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  })

  pgm.createType('reservation_status', ['active', 'sold', 'canceled'])
  pgm.createTable('reservation', {
    id: { type: 'serial', primaryKey: true },
    token: { type: 'uuid', notNull: true },
    status: { type: 'reservation_status', notNull: true },
    product_id: {
      type: 'integer',
      notNull: true,
      references: '"product"',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  })
}

exports.down = (pgm) => {
  pgm.dropTable('reservation')
  pgm.dropType('reservation_status')
  pgm.dropTable('stock')
  pgm.dropTable('product')
}
