import jwt from 'jsonwebtoken';

export function verify(
  token: string,
  secret: jwt.Secret,
  options: jwt.VerifyOptions
) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, options, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
}

export function decode(token: string, options: jwt.DecodeOptions) {
  return jwt.decode(token, options);
}
