class Memory {

  constructor() {
    this.memory = [];
    for (let i = 0; i < 20 * 1024; i++) {
      this.memory[i] = 0; // выделена под программу
    }
  }

  get(offset) {
    return this.memory[offset];
  }

  set(offset, value) {
    this.memory[offset] = value;
  }

  reserve(size) {
    for (let i = 0; i < this.memory.length; i++) {
      let placed = 0;
      if (this.memory[i] === 0) { // свободно
        for (let j = i; j < i + size; j++) {
          if (this.memory[j] > 0) { // не влезает, занято
            placed = 0;
            i += size;
            j = i; // for end
          }
          placed += 1;
        }
        if (placed === size) {
          for (let j = i; j < i + size; j++) {
            this.memory[j] = 1; // действительно заняли
          }
          return i;
        }
      }
    }
    return -1;
  }

}

export default new Memory();
