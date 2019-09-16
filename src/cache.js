// 3rd-party modules
import _ from 'lodash';
const Redis = require('ioredis');

var redis, options;
var defaults = {
  keyPrefix: 'prod_feedrapp:'
};

export function connect (opt) {
  options = _.merge(defaults, opt);
  redis = new Redis(options);
}

export function cache (key, value, time = 3600) {
  if (!redis) {
    return;
  }
  redis.set(key, JSON.stringify(value), "EX", time);
}

export function getFromCache (key) {
  return new Promise((resolve, reject) => {
    if (!redis) {
      return reject();
    }

    redis.get(key, (error, data) => {
      if (error || !data) {
        return reject(error);
      }
      return resolve(JSON.parse(data));
    })

  });
}
