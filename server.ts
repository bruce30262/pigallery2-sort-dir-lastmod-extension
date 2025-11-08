// Including dev-kit interfaces. It is not necessary, it only helps development with types.
// You need to prefix them with ./node_modules
import {IExtensionObject} from './node_modules/pigallery2-extension-kit';
import {SessionContext} from './node_modules/pigallery2-extension-kit/lib/backend/model/SessionContext';
import {ProjectedDirectoryCacheEntity} from './node_modules/pigallery2-extension-kit/lib/backend/model/database/enitites/ProjectedDirectoryCacheEntity';

// Including prod extension packages. You need to prefix them with ./node_modules
// lodash does not have types
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as _ from './node_modules/lodash';

// Importing packages that are available in the main app (listed in the packages.json in pigallery2)
import {Connection} from 'typeorm';

export const init = async (extension: IExtensionObject<void>): Promise<void> => {

  extension.Logger.info(`Setting up extension.`);
  extension.Logger.info(`Extension name: ${extension.extensionName}`);
  extension.Logger.info(`Extension id: ${extension.extensionId}`);

  extension.events.gallery.ProjectedCacheManager
    .getCacheForDirectory.after(async (data: { 
      input: [Connection, SessionContext, { id: number, name: string, path: string }], 
      output: ProjectedDirectoryCacheEntity 
    }) => {
      const [connection, session, dir] = data.input;
      // Let cache.oldestMedia always equal null
      data.output.oldestMedia = null;
      return data.output;
  });
};
