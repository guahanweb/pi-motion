# PI Motion

This repository is intended as purely instructional and to provide some possible tooling to help assist engineers integrating sensors
with Raspberry Pi over GPIO. One of the pieces of motion detection that can be overlooked is the noise when using cheaper or lossy
hardware. In order to tune each device, there is a layer of logic needed to enforce a TTL (ideally tuned to each space you are monitoring).

## Passive Infrared (PIR)

The base sensor is an inexpensive PIR sensor (I used [this one](https://www.amazon.com/2013newestseller-HC-SR501-Pyroelectric-Infrared-Detector/dp/B00TW2DFYK) 
from Amazon.com). It can be connected over GPIO, and we will use the [onoff](https://github.com/fivdi/onoff) module to receive
communication from the sensor.

### Basic usage
```javascript
const PIR = require('pi-motion').pir;
const sensor = new PIR({
  gpio: 4, // defaults to #4
  ttl: 500 // defaults to 1500ms
});

sensor.on('active', function () {
  // activity detected
});

sensor.on('inactive', function () {
  // activity not detected for configured ttl
});
```
