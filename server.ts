// Including dev-kit interfaces. It is not necessary, it only helps development with types.
// You need to prefix them with ./node_modules
import {IExtensionObject} from './node_modules/pigallery2-extension-kit';
// For ProjectedCacheManager.getCacheForDirectory 
import {SessionContext} from './node_modules/pigallery2-extension-kit/lib/backend/model/SessionContext';
import {ProjectedDirectoryCacheEntity} from './node_modules/pigallery2-extension-kit/lib/backend/model/database/enitites/ProjectedDirectoryCacheEntity';
// For DiskManager.scanDirectory 
import {DirectoryScanSettings} from './node_modules/pigallery2-extension-kit/lib/backend/model/fileaccess/DiskManager';
import {ParentDirectoryDTO} from './node_modules/pigallery2-extension-kit/lib/common/entities/DirectoryDTO';

// Including prod extension packages. You need to prefix them with ./node_modules
// lodash does not have types
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as _ from './node_modules/lodash';

// Importing packages that are available in the main app (listed in the packages.json in pigallery2)
import {Connection} from 'typeorm';
import {promises as fsp, Stats} from 'fs';
import * as path from 'path';

export const init = async (extension: IExtensionObject<void>): Promise<void> => {

  extension.Logger.info(`Setting up extension.`);
  extension.Logger.info(`Extension name: ${extension.extensionName}`);
  extension.Logger.info(`Extension id: ${extension.extensionId}`);

  // Overwrite lastModified to mtime, not max(ctime, mtime);
  extension.events.gallery.DiskManager
    .scanDirectory.after(async (data: {
      input: [string, DirectoryScanSettings?],
      output: ParentDirectoryDTO
    }) => {
      const absoluteDirectoryName = path.join(
        extension.paths.ImageFolder,
        data.output.path, // Parent dir
        data.output.name // Dir name
      );
      const stat = await fsp.stat(absoluteDirectoryName);
      data.output.lastModified = stat.mtime.getTime();
      return data.output;
  });

  // Overwrite cache.oldestMedia to null so directories will only sort by lastModified
  extension.events.gallery.ProjectedCacheManager
    .getCacheForDirectory.after(async (data: { 
      input: [Connection, SessionContext, { id: number, name: string, path: string }], 
      output: ProjectedDirectoryCacheEntity 
    }) => {
      data.output.oldestMedia = null;
      return data.output;
  });

};
