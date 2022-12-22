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
const runButton = get('run');

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
        renderer.renderTick(changes, 1);

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
    renderer.renderTick(changes, 1);

    restartInterval();
    startStopButton.innerText = `Stop (${speed})`;
});

get('step').addEventListener('click', () => {
    const changes = program.step();
    renderer.renderTick(changes, 1);
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
    const delta = Math.ceil(speed * 0.25);
    speed += delta || 1;
    if (interval) {
        startStopButton.innerText = `Stop (${speed})`;
        restartInterval();
    } else {
        startStopButton.innerText = `Start (${speed})`;
    }
});

const BATCH_SIZE = 100000;
let start: number;
let total: number;
let stop = false;

function run() {
    if (stop) {
        return;
    }

    let i;
    let changes = 0b000;
    for (i = 0; i < BATCH_SIZE && !program.halted; i++) {
        changes |= program.step();
    }

    if (program.halted) {
        const finish = performance.now();

        const ms = finish - start;
        const hz = (i + total) / (ms / 1000);

        renderer.renderTick(
            flags.programDirty |
                flags.stackDirty |
                flags.stdinDirty |
                flags.stdoutDirty,
            BATCH_SIZE
        );
        stats.innerText = `Took ${ms.toFixed(2)}ms, running at ${hz.toFixed(
            0
        )} Ops/Sec. Total of ${total + i} operations.`;
        stop = true;
        start = 0;
        runButton.textContent = 'Start';
    } else {
        total += BATCH_SIZE;
        renderer.renderTick(changes, BATCH_SIZE);
        window.requestAnimationFrame(run);
    }
}
runButton.addEventListener('click', () => {
    if (start) {
        stop = true;
        start = 0;
        runButton.textContent = 'Start';
        return;
    }

    runButton.textContent = 'Stop';
    stop = false;
    total = 0;
    start = performance.now();
    run();
});

script.addEventListener('change', () => {
    localStorage.setItem('program', script.value);
});

stdinText.addEventListener('change', () => {
    localStorage.setItem('stdin', stdinText.value);
});

document.addEventListener('DOMContentLoaded', () => {
    let savedProgram = localStorage.getItem('program');
    let savedStdin = localStorage.getItem('stdin');

    if (savedProgram) {
        script.value = savedProgram;
    }

    if (savedStdin) {
        stdinText.value = savedStdin;
    }

    get('compile').click();
});
