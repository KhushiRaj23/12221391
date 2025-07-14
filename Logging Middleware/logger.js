const url = 'http://20.244.56.144/evaluation-service/logs';

async function Log(stack, level, pkg, message, token) {
  try {
    const res = await fetch(url, {
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
