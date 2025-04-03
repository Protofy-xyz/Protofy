export const resolve = (...args) => args.join('/');
export const join = (...args) => args.join('/');
export const dirname = () => '.';
export const basename = (p) => p.split('/').pop();
export const extname = (p) => '.' + p.split('.').pop();
export const sep = '/';

export default {
  resolve,
  join,
  dirname,
  basename,
  extname,
  sep,
};