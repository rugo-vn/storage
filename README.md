# Rugo Store

Store Management Service.

## Actions

### `put`

Put data to store.

Arguments:

- `{string} key` - key to identify.
- `{any} value` - value to store. Value `undefined` to delete key.

Return:

- `{boolean}` always `true`

### `get`

Get data from store.

Arguments:

- `{string} key` - key to get.

Return:

- `any` returned value.

## License

MIT