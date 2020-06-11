// Merge a `source` object to a `target` recursively
export const merge = <T>(target: T, source?: unknown): T => {
  // Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
  if (source) {
    for (const key of Object.keys(source as any)) {
      if ((source as any)[key] instanceof Object)
        Object.assign((source as any)[key], merge((target as any)[key], (source as any)[key]));
    }
  }

  // Join `target` and modified `source`
  Object.assign(target || {}, source);
  return target;
};
