class Memory {

  constructor(props) {
    var _memory = [];
    for(var i = 0; i < 20*1024; i++) {
        _memory[i] = 0;
    }
  }

  get(offset) {
    return _memory[offset];
  }

  set(offset, value) {
    _memory[offset] = value;
  }

  reserve(count) {
        // var start = find();
        // return start;

        // function find() {
            for(var i = 0; i < _memory.count; i++) {
                if (_memory[i] == 0) {
                    for(var j = i; j <  i + count; i++) {
                        if(_memory[j] > 0) {
                            i = i + count;
                            continue;
                        }
                    }
                    return i;
                }
                return -1; // my
            }
        // }
    }

    var programm = new function() {
        var _variables = [];
        var _arrays = [];
        var _functions = [];
        var _status = 0;
        var operations = [
            executeFunction,
            handleArray,
            handleVar
        ];
        this.compile = function() {
            placeVars();
            placeArrays();
            placeFunction();
        }

        this.execute = function() {
            while(!status) {
                var _p_var = 30;
                var _p_arr = 2;
                var _p_func = 20;
                var code = rand() % 100;
                if(code < _p_var) {
                    handleVar();
                } else {
                    if(code < _p_var + _p_arr) {
                        handleArray();
                    } else {
                        if(code < _p_var + _p_arr + _p_func) {
                            executeFtunction();
                        }
                    }
                }
                var method = operations[code];
                method();
            }
        }

        this.exit = function(code) {
            _status = code;
        }
        function placeVars() {
            var avarage_count = 10;
            for(var i = 0; i < avarage_count; i++) {
                _variables.push(_memory.reserve(1));
            }
        }

        function placeArray() {
            var avarage_count = 2;
            var avarage_size = 50;

            for(var i = 0; i < avarage_count; i++) {
                _arrays.push(_memory.reserve(avarage_size));
            }
        }

        function executeFunction() {

        }
        function handleArray() {
            var avarage_size = 50;
            var address = _arrays[rand()%_arrays.length];
            for(var i = 0; i < avarage_size; i++) {
                memory.get(address + i);
            }
        }
        function handleVar() {
            var address = _variables[rand()%(_variables.length)];
            if(rand()%2) {
                memory.get(address);
            } else {
                memory.set(address, rand());
            }
        }
    }();
}();
