import * as tsUnit from 'ts-unit';
import { addIndexCommand, indexCommandIsValid } from './parse-index-command';
import { Database } from './database';
import * as lodash from 'lodash';

export class ParseIndexCommandTests extends tsUnit.TestClass {

  // Run indexCommandIsValid tests

  // Valid cases
  indexCommandIsValidValidTest1() {
    const command = [ 'index', '1', 'soup', 'tomato', 'cream', 'salt' ];

    this.areIdentical(true, indexCommandIsValid(command));
  }

  indexCommandIsValidValidTest2() {
    const command = [ 'index', '1', 'soup123', '123tomato' ];

    this.areIdentical(true, indexCommandIsValid(command));
  }

  // Invalid cases
  indexCommandIsValidInvalidLengthTest() {
    const command = [ 'index', '1' ];

    this.areIdentical(false, indexCommandIsValid(command));
  }

  indexCommandIsValidInvalidDocIdTest() {
    const command = [ 'index', 'one', 'soup' ];

    this.areIdentical(false, indexCommandIsValid(command));
  }

  indexCommandIsValidInvalidTokensTest() {
    const command = [ 'index', '1', '&', 'soup' ];

    this.areIdentical(false, indexCommandIsValid(command));
  }

  // Run addIndexCommand tests

  addIndexCommandSuccessTest() {

    const database = new Database();
    const command = [ 'index', '1', 'soup', 'tomato', 'cream', 'salt' ];
    const successMessage = addIndexCommand(database, command);

    const targetIndex = new Map();
    targetIndex['1'] = [ 'soup', 'tomato', 'cream', 'salt' ];

    const targetIndexSet = new Set('1');
    const targetInvertedIndex = new Map();
    targetInvertedIndex['soup'] = targetIndexSet;
    targetInvertedIndex['tomato'] = targetIndexSet;
    targetInvertedIndex['cream'] = targetIndexSet;
    targetInvertedIndex['salt'] = targetIndexSet;


    this.areIdentical('index ok 1', successMessage);
    this.areIdentical(true, lodash.isEqual(targetIndex['1'], database.index['1']));
    this.areIdentical(true, lodash.isEqual(targetInvertedIndex['soup'], database.invertedIndex['soup']));
    this.areIdentical(true, lodash.isEqual(targetInvertedIndex['tomato'], database.invertedIndex['tomato']));
    this.areIdentical(true, lodash.isEqual(targetInvertedIndex['cream'], database.invertedIndex['cream']));
    this.areIdentical(true, lodash.isEqual(targetInvertedIndex['salt'], database.invertedIndex['salt']));
  }

  addIndexCommandSuccessWithReplaceTest() {
    const database = new Database();
    const command1 = [ 'index', '1', 'soup', 'tomato', 'cream', 'salt' ];
    const command2 = [ 'index', '1', 'bread', 'butter', 'salt' ];
    addIndexCommand(database, command1);
    const successMessage = addIndexCommand(database, command2);

    const targetIndex = new Map();
    targetIndex['1'] = [ 'bread', 'butter', 'salt' ];

    const targetIndexSet = new Set('1');
    const targetInvertedIndex = new Map();
    targetInvertedIndex['soup'] = new Set();
    targetInvertedIndex['butter'] = targetIndexSet;

    this.areIdentical('index ok 1', successMessage);
    this.areIdentical(true, lodash.isEqual(targetIndex['1'], database.index['1']));
    this.areIdentical(true, lodash.isEqual(targetInvertedIndex['soup'], database.invertedIndex['soup']));
    this.areIdentical(true, lodash.isEqual(targetInvertedIndex['butter'], database.invertedIndex['butter']));
  }

}