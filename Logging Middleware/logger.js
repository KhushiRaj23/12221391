const LOG_API_URL = 'http://20.244.56.144/evaluation-service/logs';

/**
 * Sends a log entry to the test server.
 * @param {string} stack - 'backend' or 'frontend'
 * @param {string} level - 'debug', 'info', 'warn', 'error', 'fatal'
 * @param {string} pkg - package name (see assignment for allowed values)
 * @param {string} message - log message
 * @param {string} token - Bearer token for authentication
 */
async function Log(stack, level, pkg, message, token) {
  try {
    const res = await fetch(LOG_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message
      })
    });
    if (!res.ok) {
      // Optionally handle/report failed log attempts

    }
    return await res.json();
  } catch (err) {
    // Optionally handle/report error
    return null;
  }
}

module.exports = { Log }; 