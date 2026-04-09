exports.randomBytes = function(size) {
  const bytes = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    bytes[i] = Math.floor(Math.random() * 256);
  }
  return {
    toString: function(encoding) {
      if (encoding === 'hex') {
        let hex = '';
        for (let i = 0; i < bytes.length; i++) {
          hex += bytes[i].toString(16).padStart(2, '0');
        }
        return hex;
      }
      return Array.from(bytes).join(',');
    }
  };
};
