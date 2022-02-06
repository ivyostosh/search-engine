# Simple Search Engine
A simple index-based search engine.

## Getting started
1. Install [Node.js](https://nodejs.org/en/). Recommend version Node 17.
2. Clone the repository with git, or download and extract the zip file from the GitHub repo.
3. Run one of the following npm commands to explore the search-engine:
    - Compile and run the CLI: `npm run full-start`
    - Build: `npm run build`
    - Run CLI: `npm run start`
    - Run Unit Tests: `npm run test`
    - Run Lint: `npm run lint`
4. To quickly enter standard inputs, you can create a local file, and run `node out/cli-runner.js < {filePath}/{fileName}`. As an example, you can run `node out/cli-runner.js < data/valid-input-test1.txt` to use pre-created commands.

## Command Line Inputs Instructions
1. Command lines supports two different types of commands, index commands and query commands.
2. Index commands need to follow the format of `index doc-id token1 … tokenN`. 
    - The doc-id has to be an integer. Tokens have to be alphanumeric strings. A document can contain an arbitrary number of tokens greater than zero. The same token may occur more than once in a document. If the doc-id in an index command is the same as in a previously seen index command, the previously stored document will be completely replaced (i.e., only the tokens from the latest command should be associated with the doc-id).
    - If an index command is processed successfully, following message will be displayed at standard out `index ok doc-id`. If an index command is not processed successfully, following message will be displayed at standard out `index error error message`.
3. Query commands need to follow the format of `query expression`. 
    - Expression has to be composed of alphanumeric tokens and the special symbols &, |, (, and ). The most simple expression is a single token, and the result of executing this query is a list of the IDs of the documents that contain the token. More complex expressions can be built built using the operations of set conjunction (denoted by &) and disjunction (denoted by |). The & and | operation have equal precedence and are commutative and associative. Parentheses have the standard meaning. Parentheses are mandatory: a | b | c is not valid, (a | b) | c must be used.
    - If a query command is processed successfully, following message will be displayed at standard out `query results doc-id1 doc-id2 …`. If an index command is not processed successfully, following message will be displayed at standard out `query error error message`.
4. If an invalid input is entered, the search-engine will not process the invalid input. An error message will be displayed and the search-engine will wait for the next valid command.
5. Use `Ctrl+C` to exit.
6. Run `node out/cli-runner.js < data/valid-input-test1.txt` to see an example without invalid inputs, and `node out/cli-runner.js < data/invalid-input-test1.txt` to see an example with invalid inputs.

## Main Algorithm
With a design goal to optimize query speed over indexing speed, the search-engine used [inverted indexes](https://en.wikipedia.org/wiki/Inverted_index#:~:text=In%20computer%20science%2C%20an%20inverted,index%2C%20which%20maps%20from%20documents) to create the indexing database.

## Assumptions and Notes
1. The inverted index database saves all token in lower cases. If a upper case token or mixed case token is used in the command, the command will be converted to lower case first before saving / querying the inverted index database.
2. The inverted index database doesn't save the same index multiple times. As an example, if the search-engine receives an index command `index 1 apple apple`, a record of inverted_index['apple'] = {1} will be created, instead of inverted_index['apple'] = {1, 1}.
3. If a query returns no result, the following output will be displayed `query results empty.`
4. Environment variable process.env.NODE_ENV can be used to config console log information. See `src/logger.ts` for detail. Unit tests were set up with process.env.NODE_ENV = '0', so only error messages will be logged out.

## Potential Enhancements
- Support persistent databases.
- Support for concurrent processing via messaging and / or in-memory data store (e.g. redis).
- Support word distance matching when exact match is not found.

## Built With
- [Node.js](https://nodejs.org/en/)