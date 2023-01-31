import Mime from 'mime';
import { RugoException } from '@rugo-vn/exception';
import { closeSync, existsSync, mkdirSync, openSync, readdirSync, statSync } from 'fs';
import { basename, dirname, extname, join } from 'path';
import { FileCursor } from '@rugo-vn/service';
import { DIRECTORY_MIME } from './constants.js';
import rimraf from 'rimraf';

export const setConfig = async function({ root, config }) {
  this.registers[root] = config;

  return config;
}

export const getConfig = async function({ root }) {
  return this.registers[root];
}

export const get = async function({ root, path = '' }) {
  const formattedPath = join('/', path);
  const entryPath = join(root, formattedPath);

  if (!existsSync(entryPath))
    return null;

  const stats = statSync(entryPath);
  const isDir = stats.isDirectory();
  const mime = isDir ? DIRECTORY_MIME : Mime.getType(extname(entryPath));

  return {
    path: formattedPath,
    name: basename(entryPath),
    mime,
    parent: dirname(formattedPath),
    isDir,
    size: isDir ? 0 : stats.size,
    data: isDir ? null : new FileCursor(entryPath),
    updatedAt: stats.mtime
  };
}

export const create = async function({ root, path = '', isDir, data }) {
  const entryPath = join(root, join('/', path));

  if (existsSync(entryPath))
    throw new RugoException(`"${path}" existed`);

  const dir = dirname(entryPath);

  if (existsSync(dir) && !statSync(dir).isDirectory()) {
    throw new RugoException(`Parent of "${path}" is not directory`);
  }

  if (!existsSync(dir))
    mkdirSync(dir, { recursive: true });

  if (isDir) {
    mkdirSync(entryPath);
  } else if (data){
    await data.copyTo(entryPath);
  } else {
    closeSync(openSync(entryPath, 'w'));
  }

  return get.bind(this)({ root, path });
}

export const list = async function({ root, path = '' }) {
  const entryPath = join(root, join('/', path));

  if (!existsSync(entryPath))
    return [];

  if (!statSync(entryPath).isDirectory())
    return [];

  const ls = readdirSync(entryPath);
  
  return await Promise.all(ls.map(name => get.bind(this)({ root, path: join(path, name )})));
}

export const remove = async function({ root, path = '' }) {
  const entryPath = join(root, join('/', path));
  const entry = await get.bind(this)({ root, path });

  rimraf.sync(entryPath);

  return entry;
}