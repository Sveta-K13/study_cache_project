class MemoryReserve {

  constructor(count) {
    var start = this.find();
    return start;
  }
    function(count) {

        function find() {
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
            }
        }
    }

}
