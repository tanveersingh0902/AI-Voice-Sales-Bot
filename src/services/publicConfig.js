import { getConfig } from './config';

export function getPublic(key) {
  return getConfig(key);
}
