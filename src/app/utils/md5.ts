import * as encode from 'md5';

export function md5(text: string) {
  return encode(text);
}
