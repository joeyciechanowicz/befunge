import {Interpreter} from './interpreter.js';
import {Renderer} from './renderer.js';
import './style.css';

let speed = 250;

function get(id: string): HTMLElement {
	const el = document.getElementById(id);

	if (!el) {
		throw new Error(`No element exists for id ${id}`);
	}

	return el;
}

const startStopButton = get('start-stop');
const programDisplay = get('program-display');
const stackDisplay = get('stack-display');
const stdout = get('stdout');
const stats = get('stats');
const animation = get('start-animation');

let program: Interpreter;
let renderer: Renderer;
let interval: NodeJS.Timeout | undefined;

get('compile').addEventListener('click', () => {
	if (interval) {
		clearInterval(interval);
		interval = undefined;
	}
	program = new Interpreter((get('script') as HTMLInputElement).value, prompt.bind(window));
	renderer = new Renderer(program, programDisplay, stackDisplay, stdout, stats);

	renderer.initialRender();
	startStopButton.innerText = `Start (${speed})`;
});

function doTick() {
	if (program.halted) {
		renderer.renderTick();
		return;
	}
	program.step();
	renderer.renderTick();

	window.requestAnimationFrame(doTick);
}

animation.addEventListener('click', () => {
	window.requestAnimationFrame(doTick);
});

function restartInterval() {
	if (interval) {
		clearInterval(interval);
	}

	interval = setInterval(() => {
		program.step();
		renderer.renderTick();

		if (program.halted) {
			clearInterval(interval as NodeJS.Timeout);
		}
	}, speed);
}

startStopButton.addEventListener('click', () => {
	if (interval) {
		clearInterval(interval);
		interval = undefined;
		startStopButton.innerText = `Start (${speed})`;
		return;
	}

	program.step();
	renderer.renderTick();

	restartInterval();
	startStopButton.innerText = `Stop (${speed})`;
});

get('step').addEventListener('click', () => {
	program.step();
	renderer.renderTick();
});

get('speed-up').addEventListener('click', () => {
	speed = Math.max(0, Math.floor(speed * 0.75));

	if (interval) {
		startStopButton.innerText = `Stop (${speed})`;
		restartInterval();
	} else {
		startStopButton.innerText = `Start (${speed})`;
	}
});

get('slow-down').addEventListener('click', () => {
	speed = Math.floor(speed * 1.25);
	if (interval) {
		startStopButton.innerText = `Stop (${speed})`;
		restartInterval();
	} else {
		startStopButton.innerText = `Start (${speed})`;
	}
});

get('run').addEventListener('click', () => {
	let count = 0;
	const start = performance.now();
	while (!program.halted) {
		program.step();
		count++;
	}
	const finish = performance.now();

	const ms = finish - start;
	const hz = count / ms;

	stats.innerText = `Took ${ms.toFixed(2)}ms, running at ${hz.toFixed(0)} IPS. Total of ${count} operations.`;

	renderer.renderTick();
});

document.addEventListener('DOMContentLoaded', () => {
	get('compile').click();
});

