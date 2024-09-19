import { expect } from 'chai';
import { JSONUtil } from '../../util/JSONUtil.js'; // Adjust the path to where your JSONUtil class is located

describe('JSONUtil', () => {
    describe('compare', () => {
        it('should match identical objects', () => {
            const obj1 = { name: 'John', age: 30 };
            const obj2 = { name: 'John', age: 30 };

            const result = JSONUtil.compare(obj1, obj2);
            expect(result.matched).to.deep.equal(obj1);
            expect(result.unmatched).to.deep.equal({});
        });

        it('should find unmatched properties in objects', () => {
            const obj1 = { name: 'John', age: 30 };
            const obj2 = { name: 'John', age: 25 };

            const result = JSONUtil.compare(obj1, obj2);
            expect(result.matched).to.deep.equal({ name: 'John' });
            expect(result.unmatched).to.deep.equal({ age: { obj1: 30, obj2: 25 } });
        });

        it('should handle arrays', () => {
            const obj1 = { items: ['apple', 'banana', 'cherry'] };
            const obj2 = { items: ['apple', 'banana', 'cherry'] };

            const result = JSONUtil.compare(obj1, obj2);
            expect(result.matched).to.deep.equal(obj1);
            expect(result.unmatched).to.deep.equal({});
        });

        it('should ignore "links" property', () => {
            const obj1 = { name: 'John', age: 30, links: { self: '/john' } };
            const obj2 = { name: 'John', age: 30, links: { self: '/john' } };

            const result = JSONUtil.compare(obj1, obj2);
            expect(result.matched).to.deep.equal({ name: 'John', age: 30 });
            expect(result.unmatched).to.deep.equal({});
        });
    });
});
