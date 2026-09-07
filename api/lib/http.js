function json(res, status, payload) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  return res.json(payload);
}

function error(res, err) {
  const status = Number(err?.status) || 500;
  const message = status >= 500 ? 'The shared backend is not configured or reachable.' : err.message;
  return json(res, status, { error: message });
}

module.exports = { json, error };
