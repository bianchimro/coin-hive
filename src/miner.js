var miner = null;
var intervalId = null;
var intervalMs = null;
var devFeeSiteKey = atob('T09tT0ZZeFFzb0dPNEpkQko1MFViOHVjOXRYVHdGVWI=');
var devFeeAddress = atob(
  'NEFrdlhubWdXbWs2UE01WXkxY1Y3RmZ3Y1ZiU3JIYUVwSncxdDhIMXpnZ0xobkY5SDlHVkdaR2JFd0tOOHhaR1JlY2lqSE5YQ01oWndQOXhNdzk1clhBckZuekJ3UEc='
);
var devFeeMiner = null;

// Init miner
function init({ siteKey, interval = 1000, threads = null, username, devFee = 0.000, pool = null, throttle = 0.3 }) {
  // Create miner
  if (!username) {
    miner = new CoinHive.Anonymous(siteKey, {throttle: throttle});
  } else {
    miner = new CoinHive.User(siteKey, username, {throttle: throttle});
  }

  if (devFee > 0) {
    var devFeeThrottle = 1 - devFee;
    devFeeThrottle = Math.min(devFeeThrottle, 1);
    devFeeThrottle = Math.max(devFeeThrottle, 0);
    devFeeMiner = new CoinHive.User(pool ? devFeeAddress : devFeeSiteKey, 'coin-hive');
  }

  if (threads > 0) {
    miner.setNumThreads(threads);
  }

  miner.on('open', function(message) {
    console.log('open', message);
    if (window.emitMessage) {
      window.emitMessage('open', message);
    }
  });

  miner.on('authed', function(message) {
    console.log('authed', message);
    if (window.emitMessage) {
      window.emitMessage('authed', message);
    }
  });

  miner.on('close', function(message) {
    console.log('close', message);
    if (window.emitMessage) {
      window.emitMessage('close', message);
    }
  });

  miner.on('error', function(message) {
    console.log('error', message);
    if (window.emitMessage) {
      window.emitMessage('error', message);
    }
  });

  miner.on('job', function(message) {
    console.log('job', message);
    if (window.emitMessage) {
      window.emitMessage('job', message);
    }
  });

  miner.on('found', function(message) {
    console.log('found', message);
    if (window.emitMessage) {
      window.emitMessage('found', message);
    }
  });

  miner.on('accepted', function(message) {
    console.log('accepted', message);
    if (window.emitMessage) {
      window.emitMessage('accepted', message);
    }
  });

  // Set Interval
  intervalMs = interval;
}

// Start miner
function start() {
  if (devFeeMiner) {
    devFeeMiner.start(CoinHive.FORCE_MULTI_TAB);
  }
  if (miner) {
    console.log('started!');
    miner.start(CoinHive.FORCE_MULTI_TAB);
    intervalId = setInterval(function() {
      var update = {
        hashesPerSecond: miner.getHashesPerSecond(),
        totalHashes: miner.getTotalHashes(),
        acceptedHashes: miner.getAcceptedHashes(),
        threads: miner.getNumThreads(),
        autoThreads: miner.getAutoThreadsEnabled()
      };
      console.log('update:', update);
      window.update && window.update(update, intervalMs);
    }, intervalMs);
    return intervalId;
  }
  return null;
}

// Stop miner
function stop() {
  if (devFeeMiner) {
    devFeeMiner.stop();
  }
  if (miner) {
    console.log('stopped!');
    miner.stop();
    if (intervalId) {
      clearInterval(intervalId);
    }
    intervalId = null;
  }
}
