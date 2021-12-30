import { flags, Interpreter } from './interpreter.js';
import { Renderer } from './renderer.js';
import './style.css';

let speed = 60;

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
const stdinDisplay = get('stdin');
const stdinText = get('stdin-text') as HTMLInputElement;
const script = get('script') as HTMLInputElement;

let program: Interpreter;
let renderer: Renderer;
let interval: NodeJS.Timeout | undefined;

get('compile').addEventListener('click', () => {
    if (interval) {
        clearInterval(interval);
        interval = undefined;
    }

    program = new Interpreter(script.value, stdinText.value);
    renderer = new Renderer(
        program,
        programDisplay,
        stackDisplay,
        stdinDisplay,
        stdout,
        stats
    );

    startStopButton.innerText = `Start (${speed})`;
});

function restartInterval() {
    if (interval) {
        clearInterval(interval);
    }

    interval = setInterval(() => {
        const changes = program.step();
        renderer.renderTick(changes);

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

    const changes = program.step();
    renderer.renderTick(changes);

    restartInterval();
    startStopButton.innerText = `Stop (${speed})`;
});

get('step').addEventListener('click', () => {
    const changes = program.step();
    renderer.renderTick(changes);
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

    renderer.renderTick(flags.programDirty | flags.stackDirty | flags.stdinDirty | flags.stdoutDirty);
    stats.innerText = `Took ${ms.toFixed(2)}ms, running at ${hz.toFixed(
        0
    )} IPS. Total of ${count} operations.`;
});

script.addEventListener('change', () => {
    sessionStorage.setItem('program', script.value);
});

stdinText.addEventListener('change', () => {
    sessionStorage.setItem('stdin', stdinText.value);
});

document.addEventListener('DOMContentLoaded', () => {
    let savedProgram = sessionStorage.getItem('program');
    let savedStdin = sessionStorage.getItem('stdin');

    if (savedProgram) {
        script.value = savedProgram;
    }

    if (savedStdin) {
        stdinText.value = savedStdin;
    }

    get('compile').click();
});
