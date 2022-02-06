import * as tsUnit from 'ts-unit';
import { getQueryResults, queryCommandIsValid } from './parse-query-command';
import { addIndexCommand } from './parse-index-command';
import { Database } from './database';
import * as lodash from 'lodash';

export class ParseQueryCommandTests extends tsUnit.TestClass {

  // Run queryCommandIsValid tests

  // Valid cases
  queryCommandIsValidValidSimpleQueryTest1() {
    const command = [ 'query', 'butter' ];

    this.areIdentical(true, queryCommandIsValid(command));
  }

  queryCommandIsValidValidSimpleQueryTest2() {
    const command = [ 'query', 'butter', '&', 'salt' ];

    this.areIdentical(true, queryCommandIsValid(command));
  }

  queryCommandIsValidValidComplexQueryTest1() {
    const command = [ 'query', '(', 'butter', ')' ];

    this.areIdentical(true, queryCommandIsValid(command));
  }

  queryCommandIsValidValidComplexQueryTest2() {
    const command = [ 'query', '(', 'butter', '|', 'potato', ')', '&', 'salt' ];

    this.areIdentical(true, queryCommandIsValid(command));
  }

  queryCommandIsValidValidComplexQueryTest3() {
    const command = [ 'query', '(', '(', 'butter', '|', 'potato', ')', '&', 'salt', ')', '|', 'sugar' ];

    this.areIdentical(true, queryCommandIsValid(command));
  }

  // Invalid cases
  queryCommandIsValidInValidSimpleQueryTest() {
    const command = [ 'query', '#' ];

    this.areIdentical(false, queryCommandIsValid(command));
  }

  queryCommandIsValidInValidEmptyAlphaNumTest() {
    const command = [ 'query', '(', ')' ];

    this.areIdentical(false, queryCommandIsValid(command));
  }

  queryCommandIsValidInValidLackBracketsTest() {
    const command = [ 'query', 'butter', '|', 'potato', '&', 'salt' ];

    this.areIdentical(false, queryCommandIsValid(command));
  }

  queryCommandIsValidInvalidEndWithSpecialCharTest1() {
    const command = [ 'query', '(', 'butter', '&', ')' ];

    this.areIdentical(false, queryCommandIsValid(command));
  }

  queryCommandIsValidInvalidEndWithSpecialCharTest2() {
    const command = [ 'query', '(', 'butter', '&', 'salt', ')', '|' ];

    this.areIdentical(false, queryCommandIsValid(command));
  }

  queryCommandIsValidInValidBracketsComboTest1() {
    const command = [ 'query', '(', 'potato', '(' ];

    this.areIdentical(false, queryCommandIsValid(command));
  }

  queryCommandIsValidInValidBracketsComboTest2() {
    const command = [ 'query', '(', 'butter', '|', 'potato', '&', 'salt' ];

    this.areIdentical(false, queryCommandIsValid(command));
  }

  queryCommandIsValidInValidBracketsComboTest3() {
    const command = [ 'query', '(', '(', 'butter', '|', 'potato', '(', '&', 'salt', ')', '|', 'sugar'];

    this.areIdentical(false, queryCommandIsValid(command));
  }

  // Run getQueryResults tests

  getQueryResultsEmptyResultTest1() {

    const database = new Database();
    const indexCommand1 = [ 'index', '1', 'soup', 'tomato', 'cream', 'salt' ];
    const indexCommand2 = [ 'index', '2', 'butter' ];
    const queryCommand = [ 'query', 'sugar' ];
    addIndexCommand(database, indexCommand1);
    addIndexCommand(database, indexCommand2);

    const targetQueryResult = new Set();

    this.areIdentical(true, lodash.isEqual(targetQueryResult, getQueryResults(database, queryCommand, 1).queryResult));
  }

  getQueryResultsEmptyResultTest2() {

    const database = new Database();
    const indexCommand1 = [ 'index', '1', 'soup', 'tomato', 'cream', 'salt' ];
    const indexCommand2 = [ 'index', '2', 'butter' ];
    const queryCommand = [ 'query', 'butter', '&', 'salt' ];
    addIndexCommand(database, indexCommand1);
    addIndexCommand(database, indexCommand2);

    const targetQueryResult = new Set();

    this.areIdentical(true, lodash.isEqual(targetQueryResult, getQueryResults(database, queryCommand, 1).queryResult));
  }

  getQueryResultsSingleResultTest1() {

    const database = new Database()
    const indexCommand1 = [ 'index', '1', 'soup', 'tomato', 'cream', 'salt' ];
    const indexCommand2 = [ 'index', '2', 'butter' ];
    const queryCommand = [ 'query', 'butter' ];
    addIndexCommand(database, indexCommand1);
    addIndexCommand(database, indexCommand2);

    const targetQueryResult = new Set('2');

    this.areIdentical(true, lodash.isEqual(targetQueryResult, getQueryResults(database, queryCommand, 1).queryResult));
  }

  getQueryResultsSingleResultTest2() {

    const database = new Database();
    const indexCommand1 = [ 'index', '1', 'soup', 'tomato', 'cream', 'salt' ];
    const indexCommand2 = [ 'index', '2', 'butter' ];
    const indexCommand3 = [ 'index', '3', 'butter', 'soup', 'salt' ];
    const queryCommand = [ 'query', 'butter', '&', 'salt' ];
    addIndexCommand(database, indexCommand1);
    addIndexCommand(database, indexCommand2);
    addIndexCommand(database, indexCommand3);

    const targetQueryResult = new Set('3');

    this.areIdentical(true, lodash.isEqual(targetQueryResult, getQueryResults(database, queryCommand, 1).queryResult));
  }

  getQueryResultsMultipleResultTest1() {

    const database = new Database();
    const indexCommand1 = [ 'index', '1', 'soup', 'tomato', 'cream', 'salt' ];
    const indexCommand2 = [ 'index', '2', 'butter' ];
    const indexCommand3 = [ 'index', '3', 'butter', 'soup', 'salt' ];
    const queryCommand = [ 'query', '(', 'butter', '&', 'salt', ')', '|', 'tomato' ];
    addIndexCommand(database, indexCommand1);
    addIndexCommand(database, indexCommand2);
    addIndexCommand(database, indexCommand3);

    const targetQueryResult = new Set();
    targetQueryResult.add('1');
    targetQueryResult.add('3');

    this.areIdentical(true, lodash.isEqual(targetQueryResult, getQueryResults(database, queryCommand, 1).queryResult));
  }

  getQueryResultsMultipleResultTest2() {

    const database = new Database();
    const indexCommand1 = [ 'index', '1', 'soup', 'tomato', 'cream', 'salt' ];
    const indexCommand2 = [ 'index', '2', 'butter' ];
    const indexCommand3 = [ 'index', '3', 'butter', 'soup', 'salt' ];
    const indexCommand4 = [ 'index', '4', 'tomato' ];
    const queryCommand = [ 'query', '(', 'butter', '&', 'salt', ')', '|', 'tomato' ];
    addIndexCommand(database, indexCommand1);
    addIndexCommand(database, indexCommand2);
    addIndexCommand(database, indexCommand3);
    addIndexCommand(database, indexCommand4);

    const targetQueryResult = new Set();
    targetQueryResult.add('1');
    targetQueryResult.add('3');
    targetQueryResult.add('4');

    this.areIdentical(true, lodash.isEqual(targetQueryResult, getQueryResults(database, queryCommand, 1).queryResult));
  }

};