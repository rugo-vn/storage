# Rugo Storage

File management for Rugo Platform.

## Concepts

Every space have many items to store file, along with `table`, called `drive`.

## Settings

```js
const settings = {
  storage: /* root directory to store a file, should absolute path */,
}
```

## Commons

### Input Args

As same as `table`, `drive` should have `spaceId` and `driveName` as required args. But, we do not define schema for `drive`.

### Items

Each item in drive can be `file` or `dir` (folder) (called `entry`). But they have same infomation.

- `path`: Location of `entry`, related with `driveName`. Always beginning with slash `/` character.
- `name`: Name of `entry`.
- `mime`: Mime of `entry`, parsed from `path`. `inode/directory` if directory.
- `parent`: Parent path of `entry`, parsed from `path`. Always beginning with slash `/` character.
- `isDir`: Is directory or not.
- `size`: File size, `0` if directory.
- `data`: `FileCursor` to file, `null` if directory.
- `updatedAt`: `ctime` of `entry`.

## Actions

### `setConfig`

Arguments:

- `config`

Return:

- (type: `object`) config object.

### `getConfig`

Return:

- (type: `object`) config object.

### `create`

Arguments:

- `path` (type: `string`) path that you need to create entry.
- `isDir` (type: `boolean`) `true` if you need to create a directory. Default `false`.
- `data` (type: `FileCursor`) data to create a file. Default it will create an empty file.

### `list`

Arguments:

- `path` (type: `string`) path of directory to list.

Return:

- (type: `array`) result entries.

### `get`

Arguments:

- `path` (type: `string`) path of entry to get info.

Return:

- (type: `object`) entry object.

### `remove`

Arguments:

- `path` (type: `string`) path of remove file.

Return:

- (type: `object`) entry object.

### `move`

Arguments:

- `from` (type: `string`) src path to move.
- `to` (type: `string`) dest path move to.

### `compress`

Arguments:

- `from` (type: `string`) path of entry to compress.
- `to` (type: `string`) dest path to put compress file.

Return:

- (type: `object`) entry object.

### `extract`

Arguments:

- `from` (type: `string`) path of entry to extract.
- `to` (type: `string`) dest path to put extract content.

Return:

- (type: `object`) entry object.

## License

MIT.