import { readdirSync, statSync, existsSync } from 'fs';
import path from 'path';

class File {
  path: string;
  name: string;
  parent: Folder;
  meta: any;

  constructor({
    path,
    name,
    parent,
    meta,
  }: {
    path: string;
    name: string;
    parent: Folder;
    meta: any;
  }) {
    this.path = path;
    this.name = name;
    this.parent = parent;
    this.meta = meta;
  }

  toJson() {
    return JSON.stringify(this, (key, value) => {
      if (value && typeof value === 'object' && key == 'parent')
        return undefined;
      return value;
    });
  }
}

class Folder {
  path: string;
  files: File[];
  folders: Folder[];
  parent: Folder | undefined;

  constructor({
    path,
    files,
    folders,
    parent,
  }: {
    path: string;
    files: File[];
    folders: Folder[];
    parent?: Folder;
  }) {
    this.path = path;
    this.files = files;
    this.folders = folders;
    this.parent = parent;
  }

  toJson() {
    delete this.parent;
    return JSON.stringify(this, (key, value) => {
      if (value && typeof value === 'object' && key == 'parent')
        return undefined;
      return value;
    });
  }

  flat() {
    let data: Folder[] = [];
    const mergerFolder = (folder: Folder) => {
      data = data.concat(
        folder.files.map((f) => {
          return new Folder({
            path: f.path,
            files: [f],
            folders: [],
            parent: folder,
          });
        }),
      );
      folder.folders.forEach((f) => {
        mergerFolder(f);
      });
    };
    mergerFolder(this);
    return data;
  }
}

const recursiveScan = (
  folderPath: string,
  parent: Folder | undefined = undefined,
) => {
  const all = readdirSync(folderPath, { withFileTypes: true });

  const folder = new Folder({
    path: folderPath,
    files: [],
    folders: [],
    parent,
  });

  const folders = all
    .filter((file) => file.isDirectory())
    .map((file) => {
      return recursiveScan(path.join(folderPath, file.name), folder);
    });

  const files = all
    .filter((file) => !file.isDirectory())
    .map((file) => {
      return new File({
        path: folderPath,
        name: file.name,
        parent: folder,
        meta: statSync(path.join(folderPath, file.name)),
      });
    });

  folder.files = files;
  folder.folders = folders;
  return folder;
};

export const readFolder = (path: string) => {
  try {
    existsSync(path);
    return recursiveScan(path, undefined);
  } catch (err) {
    throw err;
  }
};
