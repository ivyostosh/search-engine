import { Database } from './database';
import { parseIndex } from './parse-index-command';
import { parseQuery } from './parse-query-command';
import {logger} from './logger';

export const parseCommands = (database: Database, text: string): string[] => {
  // Validate and create Command objects

  const errorMessages = [];
  let errorMessage = '';

  if (!text) {
    errorMessage = 'parse error command cannot be empty';
    errorMessages.push(errorMessage);
    logger(errorMessage);
    return errorMessages;
  }

  for (const line of text.split(/\r?\n/)) {

    // In case of empty lines or end of file, don't exit but re-enter with the next line.
    if (!line) {
      continue;
    }

    const command = line.trim().split(/\s+/);

    if (command.length < 2) {
      errorMessage = 'parse error command length needs to be longer than 1';
      errorMessages.push(errorMessage);
      logger(errorMessage);
      continue;
    } else if (command[0] === 'index') {
      parseIndex(database, command);
    } else if (command[0] === 'query') {
      parseQuery(database, command);
    } else {
      errorMessage = 'parse error command needs to start with index or query';
      errorMessages.push(errorMessage);
      logger(errorMessage);
    }
  }

  return errorMessages;
};


