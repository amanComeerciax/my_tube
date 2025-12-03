class BloomFilter {
    constructor(size = 1000) {
      this.size = size;
      this.bitArray = new Array(size).fill(0);
    }
  
    // Hash functions
    hash1(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = (hash * 31 + str.charCodeAt(i)) % this.size;
      }
      return hash;
    }
  
    hash2(str) {
      let hash = 7;
      for (let i = 0; i < str.length; i++) {
        hash = (hash * 17 + str.charCodeAt(i)) % this.size;
      }
      return hash;
    }
  
    hash3(str) {
      let hash = 13;
      for (let i = 0; i < str.length; i++) {
        hash = (hash * 43 + str.charCodeAt(i)) % this.size;
      }
      return hash;
    }
  
    add(str) {
      const h1 = this.hash1(str);
      const h2 = this.hash2(str);
      const h3 = this.hash3(str);
  
      this.bitArray[h1] = 1;
      this.bitArray[h2] = 1;
      this.bitArray[h3] = 1;
    }
  
    contains(str) {
      const h1 = this.hash1(str);
      const h2 = this.hash2(str);
      const h3 = this.hash3(str);
  
      if (this.bitArray[h1] && this.bitArray[h2] && this.bitArray[h3]) {
        return true; // maybe present
      }
  
      return false; // definitely not present
    }
  }
  
  module.exports = BloomFilter;
  