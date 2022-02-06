import * as tsUnit from 'ts-unit';
import * as ParseCommandTests from './parse-command.spec';
import * as parseIndexCommandTests from './parse-index-command.spec';
import * as parseQueryCommandTests from './parse-query-command.spec';

// Set NODE_END to '0' so only log error messages for testings, see logger.ts for detail
process.env.NODE_ENV = '0';

const testSpecs = [
  ParseCommandTests,
  parseIndexCommandTests,
  parseQueryCommandTests
];

const tap = new tsUnit.Test(...testSpecs).run().getTapResults();

console.log(tap);