'use strict';

const gpio = require('onoff').Gpio;
const Promise = require('bluebird');
const EventEmitter = require('events').EventEmitter;
const logger = require('winston');

class PIR extends EventEmitter {
    constructor(opts) {
        if (!!opts) {
            this.gpio = opts.gpio || 4; // default to gpio #4
            this.ttl = opts.ttl || 1500; // 1500 TTL on activity
            this.process = setupProcess(this.ttl);
        }
    }

    start() {
        this.dfd = new Promise((resolve, reject) => {
            this.pir = new gpio(this.gpio, 'in', 'both');
            this.pir.watch(this.handler);
            this.emit('watching');
        });
    }

    stop() {
        if (!!this.dfd) {
            this.emit('stopping');
            this.pir.unwatch(this.handler);
            this.dfd.resolve('done');
        }
    }

    handler(err, val) {
        if (err) {
            return console.error('[PIR ERR]', err);
        }

        this.process(parseInt(val));
    }
}

function setupProcess(ttl) {
    // default state manager rules
    let active = false;
    let timeout = null;

    return function (bit) {
        let pir = this;
        if (bit === 1) { // activity
            clearTimeout(timeout);
            if (!active) {
                active = true;
                pir.emit('active');
            }
        } else { // inactivity
            if (active) {
                timeout = setTimeout(() => {
                    active = false;
                    pir.emit('inactive');
                }, ttl);
            }
        }
    };
}

module.exports = PIR;
