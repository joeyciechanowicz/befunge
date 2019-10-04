const fs = require('fs');
const path = require('path');
const {promisify} = require('util');

import {Interpreter} from '../src/interpreter';

const readFile = promisify(fs.readFile);

/**
 *
 * @param {Interpreter} interpreter
 * @param {number} maxTicks
 * @return {number} count
 */
function runTillHalt(interpreter, maxTicks = 1000) {
	let count = 0;
	while (!interpreter.halted && count < maxTicks) {
		interpreter.step();
		count++;
	}
	interpreter.step();

	if (count === maxTicks) {
		throw new Error(`Program did not halt in ${maxTicks} steps`);
	}

	return count;
}

/**
 *
 * @param {string} testCase
 * @param prompt
 * @param {number} maxTicks
 * @returns {Promise<{interp: Interpreter, steps: number}>}
 */
async function runTestCase(testCase, prompt = undefined, maxTicks = 1000) {
	const source = await readFile(path.join(__dirname, 'cases/operators', testCase));
	const interp = new Interpreter(source.toString(), prompt);

	const steps = runTillHalt(interp, maxTicks);

	return {
		steps,
		interp
	};
}

function readableString(str) {
	return str.replace(/\n/g, '\\n')
		.replace(String.fromCharCode(NaN), '\\u+0000')
		.replace(String.fromCharCode(NaN), '\\u+0000')
		.replace(String.fromCharCode(NaN), '\\u+0000')
		.replace(String.fromCharCode(NaN), '\\u+0000');
}

describe('Operators', () => {
	test('horizontal if-true', async () => {
		const {steps, interp} = await runTestCase('horizontal-if-true.bf');

		expect(interp.x).toBe(2);
		expect(interp.y).toBe(1);
		expect(interp.stack).toEqual([]);
	});

	test('vertical if-true', async () => {
		const {steps, interp} = await runTestCase('vertical-if-true.bf');

		expect(interp.x).toBe(2);
		expect(interp.y).toBe(2);
		expect(interp.stack).toEqual([]);
	});

	test('horizontal if-false', async () => {
		const {steps, interp} = await runTestCase('horizontal-if-false.bf');

		expect(interp.x).toBe(0);
		expect(interp.y).toBe(1);
		expect(interp.stack).toEqual([]);
	});

	test('vertical if-false', async () => {
		const {steps, interp} = await runTestCase('vertical-if-false.bf');

		expect(interp.x).toBe(2);
		expect(interp.y).toBe(0);
		expect(interp.stack).toEqual([]);
	});

	test('not true', async () => {
		const {steps, interp} = await runTestCase('not-true.bf');
		expect(interp.stack).toEqual([1]);
	});

	test('not false', async () => {
		const {steps, interp} = await runTestCase('not-false.bf');
		expect(interp.stack).toEqual([0]);
	});

	test('greater than 4 > 5', async () => {
		const {steps, interp} = await runTestCase('greater-than-4-5.bf');
		expect(interp.stack).toEqual([0]);
	});

	test('greater than 5 > 4', async () => {
		const {steps, interp} = await runTestCase('greater-than-5-4.bf');
		expect(interp.stack).toEqual([1]);
	});

	test('duplicate', async () => {
		const {steps, interp} = await runTestCase('duplicate.bf');
		expect(interp.stack).toEqual([5, 5]);
	});

	test('swap', async () => {
		const {steps, interp} = await runTestCase('swap.bf');
		expect(interp.stack).toEqual([4, 5]);
	});
});
