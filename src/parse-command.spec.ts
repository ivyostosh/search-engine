import * as tsUnit from 'ts-unit';
import { Database } from './database';
import { parseCommands } from './parse-command';
import * as lodash from 'lodash';

export class ParseCommandTests extends tsUnit.TestClass {

  // Run indexCommandIsValid tests

  // Invalid cases
  parseFileEmptyFileTest() {
    const database = new Database();
    const command = '';

    const targetErrorMessages = ['parse error command cannot be empty'];

    this.areIdentical(true, lodash.isEqual(targetErrorMessages, parseCommands(database, command)));
  }

  parseFileInvalidLengthTest() {
    const database = new Database();
    const command = 'index';

    const targetErrorMessages = ['parse error command length needs to be longer than 1'];

    this.areIdentical(true, lodash.isEqual(targetErrorMessages, parseCommands(database, command)));
  }

  parseFileInvalidKeywordTest() {
    const database = new Database();
    const command = 'test 1';

    const targetErrorMessages = ['parse error command needs to start with index or query'];

    this.areIdentical(true, lodash.isEqual(targetErrorMessages, parseCommands(database, command)));
  }
}