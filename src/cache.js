const cacheSize = 1024;
const resetInterval = 1000; // reset requested bit
const blockedInterval = 10;

class Cache {
  constructor(memory) {
    this.memory = memory;
    this.info = {
      hit: 0,
      miss: 0,
      blocked: 0,
    };
    this.isBlocked = false;
    this.cache = [];
    for (let i = 0; i < cacheSize; i++) {
      this.cache[i] = {
        address: i,
        value: this.memory.get(i),
        requested: 0,
      };
    } // first init
  }

  isExist(pos) {
    let i;
    for (i = 0; i < this.cache.length; i++) {
      if (this.cache[i].address === pos) {
        this.cache[i].requested = 1;
        setTimeout(() => { this.cache[i].requested = 0; }, resetInterval);
        return true;
      }
    }
    return false;
  }

  findOldIndex() {
    for (let i = 0; i < cacheSize + 1; i++) {
      if (!this.cache[i].requested) return i;
      this.cache[i].requested = 0;
    }
    return 0;
  }

  read(pos) {
    if (this.isExist(pos)) {
      this.info.hit += 1;
    } else {
      this.info.miss += 1;
      const replaced = this.findOldIndex();
      this.cache[replaced] = {
        address: pos,
        value: this.memory.get(pos),
        requested: 1,
      };
      setTimeout(() => { this.cache[replaced].requested = 0; }, resetInterval);
    }
  }

  write(pos) {
    if (this.isBlocked) {
      this.info.blocked += 1;
      setTimeout(() => {
        this.write(pos);
      }, blockedInterval / 2); // ждем когда можно записать
    } else {
      this.isBlocked = true;
      this.memory.set(pos, 1);
      this.read(pos); // считаем, что тут перезаписывается значение в кэше, даже если оно уже там есть
      setTimeout(() => { this.isBlocked = false; }, blockedInterval);
    }
  }


}

export default Cache;
