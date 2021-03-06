'use strict';

/**
 * A function that takes an object and returns it encoded as JSON Buffer.
 * Should work identically to the client version. Feel free to copy and paste
 * any work you did there.
 *
 * Example:
 *   const encoded = encode({ hello: 'world', foo: 'bar' })
 *   console.log(encoded)  // <Buffer 7b 22 66 6f 6f 22 3a 22 62 61 72 22 ... >
 *   console.log(encoded.toString())  // '{"foo":"bar","hello":"world"}'
 *
 * Hint:
 *   Remember that all transactions and blocks must be generated
 *   deterministically! JSON is convenient, but you will need to sort
 *   your object's keys or random transactions may fail.
 */
const encode = object => {
  // var flattenObject = function(ob) {
  //   var toReturn = {};

  //   for (var i in ob) {
  //     if (!ob.hasOwnProperty(i)) continue;

  //     if (typeof ob[i] == 'object') {
  //       var flatObject = flattenObject(ob[i]);
  //       for (var x in flatObject) {
  //         if (!flatObject.hasOwnProperty(x)) continue;

  //         toReturn[i + '.' + x] = flatObject[x];
  //       }
  //     } else {
  //       toReturn[i] = ob[i];
  //     }
  //   }
  //   return toReturn;
  // };
  // const flattenedObj = flattenObject(object);
  return Buffer.from(
    // JSON.stringify(flattenedObj, Object.keys(flattenedObj).sort())
    JSON.stringify(object, Object.keys(object).sort())
  );
};

/**
 * A function that takes a JSON Buffer and decodes it into an object. Unlike
 * the client version, there is no need to handle base64 strings.
 */
const decode = buffer => {
  return JSON.parse(buffer);
};

module.exports = {
  encode,
  decode
};
