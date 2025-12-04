class BloomFilter {
    constructor(size = 5000) {
      this.size = size;
      this.storage = new Array(size).fill(false);
    }
  
    // Simple hash functions
    hash1(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) hash = (hash + str.charCodeAt(i)) % this.size;
      return hash;
    }
  
    hash2(str) {
      let hash = 1;
      for (let i = 0; i < str.length; i++) hash = (hash * str.charCodeAt(i)) % this.size;
      return hash;
    }
  
    add(str) {
      const h1 = this.hash1(str);
      const h2 = this.hash2(str);
      this.storage[h1] = true;
      this.storage[h2] = true;
    }
  
    contains(str) {
      const h1 = this.hash1(str);
      const h2 = this.hash2(str);
      return this.storage[h1] && this.storage[h2];
    }
  }
  
  module.exports = BloomFilter;
  