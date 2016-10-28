import Program from './program';


  let programs = [];
  for (let i = 0; i < 4; i++) {
    programs[i] = new Program();
    programs[i].init();
    programs[i].run();
  }


