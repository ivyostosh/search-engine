export class Database {
  index: Map<string, string>;
  invertedIndex: Map<string, Set<string>>;

  constructor() {
    this.index = new Map();
    this.invertedIndex = new Map();
  }

  addOrReplaceCommand(id: string, tokens: string[]) {
    // Update index hashmap, which will replace the old tokens stored in the index hashmap (so no additional deletion is needed)
    this.index[id] = tokens;
  }

  getCommandById(id: string) {
    return this.index[id];
  }

  addTokens(id: string, tokens: string[]) {
    for (const token of tokens) {
      // Convert all tokens to lowercase
      const lowerCaseToken = token.toLowerCase();

      // Add to the invertedIndex
      if (!(lowerCaseToken in this.invertedIndex)) {
        this.invertedIndex[lowerCaseToken] = new Set();
      }

      this.invertedIndex[lowerCaseToken].add(id);
    }
  }

  deleteTokens(id: string, tokens: string) {
    for (const token of tokens) {
      // Convert all tokens to lowercase
      const lowerCaseToken = token.toLowerCase();

      this.invertedIndex[lowerCaseToken].delete(id);
    }
  }

  getIdByToken(token: string) {
    // Convert all tokens to lowercase
    const lowerCaseToken = token.toLowerCase();

    return lowerCaseToken in this.invertedIndex ? this.invertedIndex[lowerCaseToken] : new Set();
  }
}
