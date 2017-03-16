'use strict';

// will only work ON device currently, due to GPIO requirements
const pir = require('./src').pir;
let sensor = new pir({ ttl: 1000 });
sensor.start();
