import Memory from './memory';
import Cache from './cache';

const varsCount = 100;
const arraysCount = 10;
const arraysLength = 50; // для рандома от x до 2x
const functionSizeL = 20;
const functionSizeC = 10;

const p_var = 30; // %
const p_arr = 20;
const p_func = 50;

const p_funcL = 65;
const p_funcC = 35;

let memory = new Memory();

class Program {

  constructor() {
    this.vars = [];
    this.arrays = [];
    this.functionsL = [];
    this.functionsC = [];
    this.memory = memory;
    this.codeString = 0;
    this.cache = null;
  }

  init() {
    this.codeString = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;
    this.placeVars(); // compiles
    this.placeArrays();
    this.placeFunction();
    this.workTime = 0;
    this.cache = new Cache(this.memory); // init fill cache
  }

  run() {
    const start = new Date();
    for (let i = this.codeString; i > 0; i--) {
      const code = Math.floor(Math.random() * 100);
      if (code < p_var) {
        this.handleVar();
      } else {
        if (code < p_var + p_arr) {
          this.handleArray();
        } else {
          if (code < p_var + p_arr + p_func) {
            this.executeFunction();
          }
        }
      }
    }
    /**  result info **/
    const allOperation = this.cache.info.hit + this.cache.info.miss;
    const hitted = this.cache.info.hit / allOperation;
    const missed = this.cache.info.miss / allOperation;
    console.log(`hit: ${hitted.toFixed(7)}%`, `miss: ${missed.toFixed(7)}%`);
    const now = new Date();
    console.log(`blocked: ${this.cache.info.blocked}`, ' WorkTime: ms', (now.getTime() - start.getTime()), '\n');
    /*  result info */
  }

  executeFunction() {
    if (Math.random() < (p_funcL / 100)) {
      const index = Math.floor(Math.random() * this.functionsL.length);
      for (let i = 0; i < this.functionsL[index].size; i++) {
        this.cache.read(this.functionsL[index].start + i);
      }
    } else {
      const index = Math.floor(Math.random() * this.functionsC.length);
      const cicles = Math.floor(Math.random() * (11)) + 5;
      for (let j = 0; j < cicles; j++) {
        for (let i = 0; i < this.functionsL[index].size; i++) {
          this.cache.read(this.functionsL[index].start + i);
        }
      }
    }
  }

  handleArray() {
    const index = Math.floor(Math.random() * this.arrays.length);
    for (let i = 0; i < this.arrays[index].size; i++) {
      this.cache.read(this.arrays[index].start + i);
    }
  }
  handleVar() {
    const index = Math.floor(Math.random() * this.vars.length);
    if (Math.random() < 0.5) {
      this.cache.read(this.vars[index].start);
    } else {
      this.cache.write(this.vars[index].start);
    }
  }

  placeVars() {
    for (let i = 0; i < varsCount; i++) {
      this.vars.push({
        start: this.memory.reserve(1),
        size: 1,
      });
    }
  }

  placeArrays() {
    let arraySize = 0;
    for (let i = 0; i < arraysCount; i++) {
      arraySize = Math.floor(Math.random() * (arraysLength + 1)) + arraysLength;
      this.arrays.push({
        start: this.memory.reserve(arraySize),
        size: arraySize,
      });
    }
  }

  placeFunction() {
    let funcSize;
    for (let i = 0; i < Math.floor(this.codeString * (p_funcL / 100)); i++) {
      funcSize = Math.floor(Math.random() * (functionSizeL + 1)) + functionSizeL;
      this.functionsL.push({
        start: this.memory.reserve(funcSize),
        size: funcSize,
      });
    }
    for (let i = 0; i < Math.floor(this.codeString * (p_funcC / 100)); i++) {
      funcSize = Math.floor(Math.random() * (functionSizeC + 1)) + functionSizeC;
      this.functionsC.push({
        start: this.memory.reserve(funcSize),
        size: funcSize,
      });
    }
  }

}

export default Program;
