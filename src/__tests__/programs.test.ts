import fs from 'fs';
import path from 'path';
import { Interpreter } from '../interpreter';


/**
 *
 * @param {Interpreter} interpreter
 * @param {number} maxTicks
 * @return {number} count
 */
function runTillHalt(interpreter: Interpreter, maxTicks = 1000) {
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
function runTestCase(testCase: string, stdin: string = '', maxTicks = 1000) {
	const source = fs.readFileSync(path.join(__dirname, 'cases/programs', testCase));
	const interp = new Interpreter(source.toString(), stdin);

	const steps = runTillHalt(interp, maxTicks);

	return {
		steps,
		interp
	};
}

function readableString(str: string) {
	return str.replace(/\n/g, '\\n')
		.replace(String.fromCharCode(NaN), '\\u+0000')
		.replace(String.fromCharCode(NaN), '\\u+0000')
		.replace(String.fromCharCode(NaN), '\\u+0000')
		.replace(String.fromCharCode(NaN), '\\u+0000');
}

describe('Interpreter', () => {

	test('hello world', () => {
		const {steps, interp} = runTestCase('hello-world.bf');

		expect(interp.stdout).toEqual('Hello World!');
		expect(interp.stack).toEqual([]);
		expect(steps).toBe(66);
	});

	test('hello world single line', () => {
		const {steps, interp} = runTestCase('hello-world-2.bf');

		expect(readableString(interp.stdout)).toEqual('Hello, World!\\n');
		expect(interp.stack).toEqual([0]);
		expect(steps).toBe(107);
	});

	test('stdin-char', () => {
		const {steps, interp} = runTestCase('stdin-char.bf', 'ab');

		expect(readableString(interp.stdout)).toEqual('ba');
		expect(steps).toEqual(5);
	});

	test('stdin-nums', () => {
		const {steps, interp} = runTestCase('stdin-num.bf', '123 567');

		expect(readableString(interp.stdout)).toEqual('567 123 ');
		expect(steps).toEqual(5);
	});

	test('stdin-nums with new lines', () => {
		const {steps, interp} = runTestCase('stdin-num.bf', '123\n567\n');

		expect(readableString(interp.stdout)).toEqual('567 123 ');
		expect(steps).toEqual(5);
	});

	test('factorial', () => {
		const {steps, interp} = runTestCase('factorial.bf', '5');

		expect(readableString(interp.stdout)).toEqual('120 ');
		expect(steps).toEqual(97);
	});

	test('dna', () => {
		const {interp} = runTestCase('dna.bf', '', 10000);

		const stdout = readableString(interp.stdout);
		expect(stdout).toMatch(/[TGAC]+/);
		expect(interp.stdout.length).toEqual(58);
		expect(interp.stack).toEqual([1]);
	});

	test('compare integers', () => {
		const {steps, interp} = runTestCase('compare-integers.bf', '12 13');

		const stdout = readableString(interp.stdout);
		expect(stdout).toEqual('A=12  B=13 \\nA < B\\n');
		expect(steps).toEqual(64);
	});

	test('sieve', () => {
		const {steps, interp} = runTestCase('sieve.bf', '', 1000000);

		expect(interp.stdout).toEqual('2 3 5 7 11 13 17 19 23 29 31 37 41 43 47 53 59 61 67 71 73 79 ');
		expect(interp.stack).toEqual([80]);
		expect(steps).toBe(4752);
	});

	test('fibonnaci', () => {
		const {steps, interp} = runTestCase('fibonacci.bf', '', 100000000);

		expect(readableString(interp.stdout)).toEqual('0 1 1 2 3 5 8 13 21 34 55 89 144 233 377 ');
		expect(interp.stack).toEqual([193634, 14]);
		expect(steps).toBe(587);
	});

	test('dragon curve', () => {
		const {steps, interp} = runTestCase('dragon-curve.bf', '9', 100000000);

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
