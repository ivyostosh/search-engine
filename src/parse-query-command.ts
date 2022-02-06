/*
Query expression

Where expression is an arbitrary expression composed of alphanumeric tokens and the special symbols &, |, (, and ). The most simple expression is a single token, and the result of executing this query is a list of the IDs of the documents that contain the token.
More complex expressions can be built built using the operations of set conjunction (denoted by &) and disjunction (denoted by |). The & and | operation have equal precedence and are commutative and associative. Parentheses have the standard meaning.
Parentheses are mandatory: a | b | c is not valid, (a | b) | c must be used (this is to make parsing queries simpler).

Logically, to execute the query the program looks at every document previously specified by the index command, checks if the document matches the query, and outputs the doc-id if it does. However this is suboptimal and much more efficient implementations exist.

Upon reading the query command the program should execute the query and produce the following output

query results doc-id1 doc-id2 …

The doc-ids of the matching documents can be output in arbitrary order. If there is an error, the output should be

query error error message

Examples, given the index commands shown in the example above:

in: query butter
out: query results 2 1

in: query sugar
out: query results 2

in: query soup
out: query results 3

in: query (butter | potato) & salt
out: query results 1 3
*/

import { Database } from './database';
import { logger } from './logger';

export const parseQuery = (database: Database, command: string[]): void => {

  // Split the command by ()&|, and keep the delimiters
  const queryKeyword = ['query'];
  const queryCommand = queryKeyword.concat(command.slice(1).join('').split(/(?=[()&|])|(?<=[()&|])/g));

  // Check if the input is valid, and if so create a Command object
  if (queryCommandIsValid(queryCommand)) {
    getQueryResults(database, queryCommand, 1);
  }
}

export const getQueryResults = (database: Database, command: string[], index: number) => {

  let setSign = '|';
  let queryResult: Set<string> = new Set();
  let newQueryResult: Set<string> = new Set();
  let queryIndex = index;

  while (queryIndex < command.length) {
    const token = command[queryIndex];

    if (token.match(/^[0-9a-zA-Z]+$/)) {
      newQueryResult = queryDatabase(database, token);
    } else if (token === '&' || token === '|') {
      queryResult = setJoinHelper(queryResult, setSign, newQueryResult);
      setSign = token;
    } else if (token === '(') {
      const result = getQueryResults(database, command, queryIndex + 1);
      queryResult = result.queryResult;
      queryIndex = result.queryIndex;
    } else if (token === ')') {
      queryResult = setJoinHelper(queryResult, setSign, newQueryResult);
      return { queryResult, queryIndex };
    }

    queryIndex += 1
  }

  queryResult = setJoinHelper(queryResult, setSign, newQueryResult);

  if (queryResult.size === 0) {
    logger('query results empty');
  } else {
    logger('query results ' + [...queryResult].join(' '));
  }

  return { queryResult, queryIndex }
}

export const setJoinHelper = (queryResult: Set<string>, setSign: string, newQueryResult: Set<string>): Set<string> => {

  return (setSign === '|' ?
      new Set([...queryResult, ...newQueryResult])
      : new Set([...queryResult].filter(i => newQueryResult.has(i))));
}

export const queryDatabase = (database: Database, token: string) => {
  return database.getIdByToken(token);
}

export const queryCommandIsValid = (command: string[]): boolean => {

  if (command.length < 2) {
    logger('query error query command needs to have at least length 2');
    return false;
  }

  const tokens = command.slice(1);
  const bracketStack = [];
  let bracketDetected = false;
  let lastNonBracketCharIsAlNum = false;
  let expectAlNum = true;
  let operatorCount = 0;

  // If the tokens end with & or | or (, it's an invalid case.
  if (tokens[tokens.length - 1].match(/[&|(]/)) {
    logger('query error query command has to end with either alphanumeric characters or )');
    return false;
  }

  // Iterate over tokens to invalidate different cases.
  for (const token of tokens) {

    const lastSymbolInBracketStack = bracketStack[bracketStack.length - 1];

    if (!token.match(/^[0-9a-zA-Z]+$/) && !token.match(/[()&|]/)) {
      logger('query error query command have to be either alphanumeric characters or ()&|');
      return false;
    } else if (token === '(') {
      bracketDetected = true;
      bracketStack.push(token);
    } else if (token === ')') {
      bracketDetected = true;
      if (lastSymbolInBracketStack !== '(') {
        logger('query error query command has to have valid combination of brackets');
        return false;
      } else {
        bracketStack.pop();
      }
    } else if (expectAlNum && token.match(/^[0-9a-zA-Z]+$/)) {
      lastNonBracketCharIsAlNum = true;
    } else if (expectAlNum && !token.match(/^[0-9a-zA-Z]+$/) || !expectAlNum && !token.match(/[&|]/)) {
      logger('query error query command has to have valid combination of alphanumeric characters and &|');
      return false;
    } else if (!expectAlNum && token.match(/[&|]/)) {
      lastNonBracketCharIsAlNum = false;
      operatorCount += 1;
      if (operatorCount > 1 && !bracketDetected) {
        logger('query error query command has to use () to specify more than one operation');
        return false;
      }
    }

    if (!token.match(/[()]/)) {
      expectAlNum = !expectAlNum;
    }
  }

  return bracketStack.length || !lastNonBracketCharIsAlNum ? false : true;
};