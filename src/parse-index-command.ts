/*
Index Expression

index doc-id token1 … tokenN

The index command adds a document to the index. The doc-id is an integer. Tokens are arbitrary alphanumeric strings. A document can contain an arbitrary number of tokens greater than zero.
The same token may occur more than once in a document. If the doc-id in an index command is the same as in a previously seen index command, the previously stored document should be completely replaced
(i.e., only the tokens from the latest command should be associated with the doc-id).

Examples:

index 1 soup tomato cream salt
index 2 cake sugar eggs flour sugar cocoa cream butter
index 1 bread butter salt
index 3 soup fish potato salt pepper

When the program successfully processes an index command, it should output

index ok doc-id

If the program sees an invalid index command (e.g, a token contains a non-alphanumeric character, or a doc-id is not an integer) it should report an error to standard output and continue processing commands. The error output should have the following form

index error error message
*/

import { Database } from './database';
import {logger} from './logger';

export const parseIndex = (database: Database, command: string[]): string => {

  // Check if the input is valid, and if so create a Command object
  const defaultErrorMessage = 'index error see console log for detail'

  return indexCommandIsValid(command) ?
    addIndexCommand(database, command) :
    defaultErrorMessage;
};

export const addIndexCommand = (database: Database, command: string[]): string =>  {

  // Split commends into two parts
  const docId = command[1];
  const tokens = command.slice(2);

  // If the command exits in database, delete oldTokens from invertedIndex hashmap
  if (docId in database.index) {
    const oldTokens = database.getCommandById(docId);
    database.deleteTokens(docId, oldTokens);
  }

  // Update index hashmap, which will replace the old tokens stored in the index hashmap (so no additional deletion is needed)
  database.addOrReplaceCommand(docId, tokens);

  // Update invertedIndex hashmap
  database.addTokens(docId, tokens);

  const successMessage = 'index ok ' + docId;
  logger(successMessage);

  return successMessage;
};

export const indexCommandIsValid = (command: string[]): boolean => {
  // Invalidate conditions
  if (command.length < 3) {
    logger('index error index command needs to have at least length 3');
    return false;
  }

  if (isNaN(Number(command[1]))) {
    logger('index error doc-id has to be an integer');
    return false;
  }

  const tokens = command.slice(2);

  // Invalidate non-alphanumeric characters for tokens
  for (const token of tokens) {
    if (!token.match(/^[0-9a-zA-Z]+$/)) {
      logger('index error tokens have to be alphanumeric characters');
      return false;
    }
  }

  // If pass all checks, return true
  return true;
};

