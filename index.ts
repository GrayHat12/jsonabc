/*!
  JSON ABC | License: MIT.
*/

// Is a value an array?
export function isArray<T>(val: T) {
    return Object.prototype.toString.call(val) === "[object Array]";
}

// Is a value an Object?
export function isPlainObject<T>(val: T) {
    return Object.prototype.toString.call(val) === "[object Object]";
}

// Sorting Logic
export function sortObj(un: any, noarray?: boolean) {
    noarray = noarray || false;

    let or: any = {};

    if (isArray(un)) {
        // Sort or don't sort arrays
        if (noarray) {
            or = un;
        } else {
            or = un.sort();
        }

        or.forEach(function (v, i) {
            or[i] = sortObj(v, noarray);
        });

        if (!noarray) {
            or = or.sort(function (a, b) {
                a = JSON.stringify(a);
                b = JSON.stringify(b);
                return a < b ? -1 : a > b ? 1 : 0;
            });
        }
    } else if (isPlainObject(un)) {
        or = {};
        Object.keys(un)
            .sort(function (a, b) {
                if (a.toLowerCase() < b.toLowerCase()) return -1;
                if (a.toLowerCase() > b.toLowerCase()) return 1;
                return 0;
            })
            .forEach(function (key) {
                or[key] = sortObj(un[key], noarray);
            });
    } else {
        or = un;
    }

    return or;
}

// Remove trailing commas
export function cleanJSON(input: string) {
    input = input.replace(/,[ \t\r\n]+}/g, "}");
    input = input.replace(/,[ \t\r\n]+\]/g, "]");
    return input;
}

// Sort the JSON (clean, parse, sort, stringify).
export function sort(inputStr: string, noarray: boolean, space = 4) {
    let output: string;
	let obj: any;
	let r: any;

    if (inputStr) {
        try {
            inputStr = cleanJSON(inputStr);
            obj = JSON.parse(inputStr);
            r = sortObj(obj, noarray);
            output = JSON.stringify(r, null, space);
        } catch (ex) {
            console.error("jsonabc: Incorrect JSON object.", [], ex);
            throw ex;
        }
    }
    return output;
}

// End.
