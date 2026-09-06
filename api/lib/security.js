const URL_PATTERN = /(https?:\/\/|www\.|[a-z0-9-]+\.(com|xyz|lol|io|org|net|gg)\b)/i;
const BLOCKED_PATTERN = /(seed phrase|private key|secret phrase|wallet connect|claim airdrop|support link|double your|guaranteed profit|send crypto)/i;

function moderateText(value, maxLength) {
  const text = String(value || '').replace(/[\u0000-\u001f\u007f]/g, '').trim();
  if (!text) return { ok: false, reason: 'Text is required.' };
  if (text.length > maxLength) return { ok: false, reason: `Text must be ${maxLength} characters or fewer.` };
  if (URL_PATTERN.test(text)) return { ok: false, reason: 'Links are blocked in the den.' };
  if (BLOCKED_PATTERN.test(text)) return { ok: false, reason: 'This message was blocked by the safety filter.' };
  return { ok: true, text };
}

function clientId(value) {
  return String(value || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 96) || 'anonymous';
}

function name(value) {
  return String(value || 'anonymous_pack_member').replace(/[^a-zA-Z0-9 _-]/g, '').replace(/\s+/g, ' ').trim().slice(0, 24) || 'anonymous_pack_member';
}

function ipKey(req, label, id) {
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  return `${label}:${ip}:${clientId(id)}`.slice(0, 180);
}

module.exports = { moderateText, clientId, name, ipKey };
