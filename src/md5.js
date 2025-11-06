export async function md5(str) {
  let crypto;

  if (typeof window === 'undefined') {
    crypto = await import('crypto');
  }

  if (typeof window !== 'undefined' && window.crypto) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await window.crypto.subtle.digest('MD5', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  } 
  else if (crypto) {
    return crypto.createHash('md5').update(str).digest('hex');
  } 

  throw new Error('Unsupported environment for MD5 hashing');
}
