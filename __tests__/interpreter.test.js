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

	if (count === maxTicks) {
		throw new Error(`Program did not halt in ${maxTicks} steps`);
	}

	return count;
}

/**
 *
 * @param {string} testCase
 * @param {number} maxTicks
 * @returns {Promise<{interp: Interpreter, steps: number}>}
 */
async function runTestCase(testCase, maxTicks = 1000) {
	const source = await readFile(path.join(__dirname, 'cases', testCase));
	const interp = new Interpreter(source.toString());

	const steps = runTillHalt(interp);

	return {
		steps,
		interp
	};
}

describe('Interpreter', () => {

	test('hello world', async () => {
		const {steps, interp} = await runTestCase('hello-world.befunge');

		expect(interp.stdout).toEqual('Hello World!');
		expect(interp.stack).toEqual([]);
		expect(steps).toBe(65);
	});

	test('hello world single line', async () => {
		const {steps, interp} = await runTestCase('hello-world-2.befunge');

		expect(interp.stdout).toEqual('Hello, World!');
		expect(interp.stack).toEqual([]);
		expect(steps).toBe(65);
	});
});
