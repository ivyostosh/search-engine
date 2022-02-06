import { Database } from './database';
import { parseCommands } from './parse-command';
import { createInterface } from 'readline';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

const database = new Database();

rl.on('line', (line: string) => {
  parseCommands(database, line)
});