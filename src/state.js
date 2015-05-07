var debug = require('debug')('state'); // jshint ignore:line

/*
State
  game state base class.
*/

class State {
  assign(obj) {
    Object.assign(this, obj);
  }
}

export
default State;
