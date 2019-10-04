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
	const source = await readFile(path.join(__dirname, 'cases/programs', testCase));
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

describe('Interpreter', () => {

	test('hello world', async () => {
		const {steps, interp} = await runTestCase('hello-world.bf');

		expect(interp.stdout).toEqual('Hello World!');
		expect(interp.stack).toEqual([]);
		expect(steps).toBe(66);
	});

	test('hello world single line', async () => {
		const {steps, interp} = await runTestCase('hello-world-2.bf');

		expect(readableString(interp.stdout)).toEqual('Hello, World!\\n');
		expect(interp.stack).toEqual([0]);
		expect(steps).toBe(107);
	});

	test('Prompt', async () => {
		const prompt = jest.fn();
		prompt.mockReturnValueOnce('a');

		const {steps, interp} = await runTestCase('prompt.bf', prompt);

		expect(readableString(interp.stdout)).toEqual('a');
		expect(prompt).toHaveBeenCalledTimes(1);
		expect(steps).toEqual(3);
	});

	test('factorial', async () => {
		const prompt = jest.fn();
		prompt.mockReturnValueOnce('5');

		const {steps, interp} = await runTestCase('factorial.bf', prompt);

		expect(readableString(interp.stdout)).toEqual('120 ');
		expect(prompt).toHaveBeenCalledTimes(1);
		expect(steps).toEqual(97);
	});

	test('dna', async () => {
		const {steps, interp} = await runTestCase('dna.bf', ()=>{}, 10000);

		const stdout = readableString(interp.stdout);
		expect(stdout).toMatch(/[TGAC]+/);
		expect(interp.stdout.length).toEqual(58);
		expect(interp.stack).toEqual([0]);
	});

	test('compare integers', async () => {
		const prompt = jest.fn();
		prompt.mockReturnValueOnce('12');
		prompt.mockReturnValueOnce('23');

		const {steps, interp} = await runTestCase('compare-integers.bf', prompt);

		const stdout = readableString(interp.stdout);
		expect(stdout).toEqual('A=12  B=23 \\nA < B\\n');
		expect(prompt).toHaveBeenCalledTimes(2);
		expect(steps).toEqual(64);
	});

	test('sieve', async () => {
		const {steps, interp} = await runTestCase('sieve.bf', ()=>{}, 1000000);

		expect(interp.stdout).toEqual('2 3 5 7 11 13 17 19 23 29 31 37 41 43 47 53 59 61 67 71 73 79 ');
		expect(interp.stack).toEqual([80]);
		expect(steps).toBe(4752);
	});

	test('fibonnaci', async () => {
		const {steps, interp} = await runTestCase('fibonacci.bf', ()=>{}, 100000000);

		expect(readableString(interp.stdout)).toEqual('0 1 1 2 3 5 8 13 21 34 55 89 144 233 377 ');
		expect(interp.stack).toEqual([193634, 14]);
		expect(steps).toBe(587);
	});

	test('dragon curve', async () => {
		const prompt = jest.fn();
		prompt.mockReturnValueOnce('9');
		const {steps, interp} = await runTestCase('dragon-curve.bf', prompt, 100000000);

		const lines = interp.stdout.split(/\n/g);

		expect(lines[1]).toEqual(`     _       _                                  `);
		expect(lines[2]).toEqual(`    |_|_    |_|_                                `);
		expect(lines[3]).toEqual(` _   _|_|_   _|_|                               `);
		expect(lines[4]).toEqual(`|_|_| |_| |_|_|_                     _   _      `);
		expect(lines[5]).toEqual(` _|        _|_|_|    _             _| |_|_|     `);
		expect(lines[6]).toEqual(`|_        |_| |_    |_|_          |_    |_   _  `);
		expect(lines[7]).toEqual(`  |_|          _|_   _|_|                _|_|_| `);
		expect(lines[8]).toEqual(`             _|_|_|_|_|_                |_|_|   `);
		expect(lines[9]).toEqual(`           _|_|_|_|_|_|_|    _       _   _|     `);
		expect(lines[10]).toEqual(`          |_| |_|_|_|_|_    |_|_    |_|_|_   _  `);
		expect(lines[11]).toEqual(`               _|_|_|_|_|_   _|_|_   _|_|_|_|_| `);
		expect(lines[12]).toEqual(`             _|_|_|_| |_| |_|_|_|_|_| |_| |_|   `);
		expect(lines[13]).toEqual(`           _|_|_|_|        _|_|_|_|             `);
		expect(lines[14]).toEqual(`          |_| |_|_   _    |_| |_|_   _          `);
		expect(lines[15]).toEqual(`               _|_|_|_|        _|_|_|_|         `);
		expect(lines[16]).toEqual(`              |_| |_|         |_| |_|           `);
		expect(steps).toBe(1176462);
	});
});
