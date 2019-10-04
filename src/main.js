import {Interpreter} from './interpreter.js';
import {Renderer} from './renderer.js';

let speed = 1;

const get = document.getElementById.bind(document);
const startStopButton = get('start-stop');
const programDisplay = get('program-display');
const stackDisplay = get('stack-display');
const stdout = get('stdout');

let program;
let renderer;
let interval;

get('compile').addEventListener('click', () => {
	if (interval) {
		clearInterval(interval);
		interval = undefined;
	}
	program = new Interpreter(get('script').value, prompt.bind(window));
	renderer = new Renderer(program, programDisplay, stackDisplay, stdout);

	renderer.initialRender();
	startStopButton.innerText = 'Start';
});

function restartInterval() {
	if (interval) {
		clearInterval(interval);
	}

	interval = setInterval(() => {
		program.step();
		renderer.renderTick();

		if (program.halted) {
			clearInterval(interval);
		}
	}, speed);
}

startStopButton.addEventListener('click', () => {
	if (interval) {
		clearInterval(interval);
		interval = undefined;
		startStopButton.innerText = 'Start';
		return;
	}

	program.step();
	renderer.renderTick();

	restartInterval();
	startStopButton.innerText = 'Stop';
});

get('step').addEventListener('click', () => {
	program.step();
	renderer.renderTick();
});

get('speed-up').addEventListener('click', () => {
	speed = Math.max(0, Math.floor(speed * 0.75));
	restartInterval();
});

get('slow-down').addEventListener('click', () => {
	speed = Math.floor(speed * 1.25);
	restartInterval();
});

document.addEventListener('DOMContentLoaded', () => {
	get('compile').click();
});

