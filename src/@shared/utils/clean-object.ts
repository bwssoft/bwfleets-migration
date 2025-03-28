import _ from "lodash";

export const cleanObject = <T>(obj: T): Partial<T> => {
  if (_.isArray(obj)) {
    return obj
      .map((item) => cleanObject(item))
      .filter(
        (item) =>
          (!_.isEmpty(item) || _.isNumber(item)) &&
          item !== null &&
          item !== undefined
      ) as T;
  } else if (_.isObject(obj)) {
    return _(obj)
      .mapValues((value) => cleanObject(value))
      .pickBy(
        (value) =>
          (!_.isEmpty(value) || _.isBoolean(value) || _.isNumber(value)) &&
          value !== null &&
          value !== undefined
      )
      .value() as T;
  } else {
    return obj;
  }
};
