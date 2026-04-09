module.exports = {
  // node:os mock
  availableParallelism: () => 1,
  
  // node:worker_threads mock
  Worker: class Worker {
    constructor() {}
    on(event, cb) {}
    postMessage(data) {}
    terminate() {}
  }
};
