import _ from "lodash";

export const cleanObject = <T>(
  obj: T,
  ignoredKeys: string[] = []
): Partial<T> => {
  if (_.isArray(obj)) {
    return obj
      .map((item) => cleanObject(item, ignoredKeys))
      .filter(
        (item) =>
          (!_.isEmpty(item) || _.isNumber(item)) &&
          item !== null &&
          item !== undefined
      ) as T;
  } else if (_.isObject(obj)) {
    return _(obj)
      .mapValues((value, key) =>
        ignoredKeys.includes(key) ? value : cleanObject(value, ignoredKeys)
      )
      .pickBy((value, key) => {
        if (ignoredKeys.includes(key)) return true;

        return (
          (!_.isEmpty(value) || _.isBoolean(value) || _.isNumber(value)) &&
          value !== null &&
          value !== undefined
        );
      })
      .value() as T;
  } else {
    return obj;
  }
};
