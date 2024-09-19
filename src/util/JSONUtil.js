import { JSONPath } from "jsonpath-plus";

export class JSONUtil {
    constructor() {

    }

    static compare(obj1, obj2) {
        let result = { matched: {}, unmatched: {} };

        if (typeof obj1 === 'object' && typeof obj2 === 'object') {
            for (let key in obj1) {
                if (key !== 'links') { // Ignore "links" tag
                    if (key in obj2) {
                        if (this.compare(obj1[key], obj2[key])) {
                            result.matched[key] = obj1[key];
                        } else {
                            result.unmatched[key] = { obj1: obj1[key], obj2: obj2[key] };
                        }
                    } else {
                        result.unmatched[key] = obj1[key];
                    }
                }
            }
        } else if (Array.isArray(obj1) && Array.isArray(obj2)) {
            if (obj1.length !== obj2.length) {
                result.unmatched = { obj1: obj1, obj2: obj2 };
            } else {
                for (let i = 0; i < obj1.length; i++) {
                    if (!this.compare(obj1[i], obj2[i])) {
                        result.unmatched[i] = { obj1: obj1[i], obj2: obj2[i] };
                    }
                }
            }
        } else {
            if (this.isString(obj1)) {
                obj1 = obj1.replaceAll('\n', '');
                obj1 = obj1.replaceAll('<br>', '');
                obj1 = obj1.replaceAll('\r', '');
            }
            if (this.isString(obj2)) {
                obj2 = obj2.replaceAll('\n', '');
                obj2 = obj2.replaceAll('<br>', '');
                obj2 = obj2.replaceAll('\r', '');
            }
            if (obj1 === obj2) {
                return true;
            }
            else {
                return false;
            }
            //result.matched = obj1 === obj2 ? obj1 : { obj1: obj1, obj2: obj2 };
        }

        return result;
    }

    static isString(s) {
        return typeof (s) === 'string' || s instanceof String;
    }
}