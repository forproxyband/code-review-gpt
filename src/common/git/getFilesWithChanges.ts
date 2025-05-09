import { readFile } from 'fs/promises';
import { exit } from 'process';

import type { ReviewFile } from '../types';
import { logger } from '../utils/logger';
import { getChangedFileLines } from './getChangedFileLines';
import { getChangedFilesNames } from './getChangedFilesNames';

export const getFilesWithChanges = async (
  isCi: string | undefined,
  diffContext: number
): Promise<ReviewFile[]> => {
  try {
    const fileNames = await getChangedFilesNames(isCi);

    logger.debug('fileNames', fileNames);

    if (fileNames.length === 0) {
      logger.warn('No files with changes found, you might need to stage your changes.');
      exit(0);
    }

    const files = await Promise.all(
      fileNames.map(async (fileName) => {
        const fileContent = await readFile(fileName, 'utf8');
        const rawDiff = await getChangedFileLines(isCi, fileName, diffContext);

        logger.debug('rawDiff', rawDiff);

        return { fileName, fileContent, rawDiff };
      })
    );
    logger.debug('files', files);

    return files;
  } catch (error) {
    throw new Error(
      `Failed to get files with changes: ${(error as Error).message}\n\n${(error as Error).stack}`
    );
  }
};
