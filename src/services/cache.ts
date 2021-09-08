/**
 * This is a simple in-memory cache. This should work for our application early on,
 * but we may need to explore alternative/scalable caching solutions in the future. (i.e. Redis)
 */
class Cache {
  private cache: KeyValue = {};

  get(key: string) {
    return this.cache[key];
  }

  set(key: string, value: any) {
    this.cache[key] = value;
    return this.cache[key];
  }

  remove(key: string) {
    delete this.cache[key];
  }

  clear() {
    this.cache = {};
  }
}

export default Cache;
