/**
 * A function that takes an object and returns it encoded as a JSON Buffer.
 * Should work identically to the processor version. Feel free to copy and
 * paste any work you did there.
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
export const encode = object => {
  let sortedObj = {};
  
  var flattenObject = function(ob) {
    var toReturn = {};

    for (var i in ob) {
      if (!ob.hasOwnProperty(i)) continue;

      if ((typeof ob[i]) == 'object') {
        var flatObject = flattenObject(ob[i]);
        for (var x in flatObject) {
          if (!flatObject.hasOwnProperty(x)) continue;

          toReturn[i + '.' + x] = flatObject[x];
        }
      } else {
        toReturn[i] = ob[i];
      }
    }
    return toReturn;
  };
  const flattenedObj = flattenObject(object);
  return Buffer.from(JSON.stringify(flattenedObj, Object.keys(flattenedObj).sort()));
};

/**
 * A function that takes a base64 string and decodes it into an object. This is
 * different from the processor version, which works on Buffers directly.
 *
 * Hint:
 *   Although state is encoded as a Buffer, the REST API will send
 *   any binary data as a base64 string. You will need to go from
 *   base64 string -> Buffer -> JSON string -> object
 */
export const decode = base64Str => {
  let base64Buf = Buffer.from(base64Str, 'base64');
  return JSON.parse(base64Buf.toString());
};
