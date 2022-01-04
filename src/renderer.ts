import { flags, Interpreter } from './interpreter';

export class Renderer {
    private ticks: number = 0;
    private start: number | undefined;
    private tbody: HTMLElement | undefined;
    private currHighlight: Element | undefined;

    constructor(
        private interpreter: Interpreter,
        private programEl: HTMLElement,
        private stackEl: HTMLElement,
        private stdinEl: HTMLElement,
        private stdoutEl: HTMLElement,
        private statsEl: HTMLElement
    ) {
        this.renderProgram();
        this.renderStdin();
        this.renderStack();
        this.renderStdout();
    }

    private renderStdin() {
        if (!(this.interpreter.stdin.length > 0)) {
            return;
        }

        const { stdin, stdinPos: pos } = this.interpreter;

		if (pos < stdin.length) {
			this.stdinEl.innerHTML =
				stdin.substring(0, pos) +
				'<strong><u>' +
				stdin[pos] +
				'</u></strong>' +
				stdin.substring(pos + 1);
		} else {
			this.stdinEl.innerHTML = stdin + '<strong>EOF</strong>';
		}
    }

    private renderStack() {
        let stack = '';
        for (let i = this.interpreter.stack.length - 1; i >= 0; i--) {
            const value = this.interpreter.stack[i];
            stack += `<li class="list-group-item">${value}${value > 31 ? ` (<span class="fw-lighter">${String.fromCharCode(value)}</span>)` : ``}</li>`;
        }
        this.stackEl.innerHTML = stack;
    }

    private renderProgram() {
        let table = `<table class="table table-dark table-bordered"><tbody id="table-body">`;

        for (let y = 0; y < this.interpreter.program.length; y++) {
            const line = this.interpreter.program[y];
            table += `<tr>`;
            for (let x = 0; x < line.length; x++) {
                table += `<td id="${x === this.interpreter.x && y === this.interpreter.y ? 'highlight' : ''}">${line[x]}</td>`;
            }
            table += `</tr>`;
        }

        table += `</tbody></table>`;
        this.programEl.innerHTML = table;

        this.tbody = document.getElementById('table-body')!;
        this.currHighlight = document.querySelector('#highlight')!;
    }

    private renderStdout() {
        this.stdoutEl.innerHTML = this.interpreter.stdout;
    }

    /**
     * 
     * @param changes bitmask of the changes from the program step
     */
    renderTick(changes: number, numOperations: number) {
        if (changes & flags.programDirty) {
            this.renderProgram();
        } else {
            const { x, y } = this.interpreter;
            // clear previous highlight
            this.currHighlight!.id = '';
            if (this.tbody!.children.length > y) {
                const yNode = this.tbody!.children[y];
                if (yNode.children.length > x) {
                    const xNode = yNode.children[x];
                    this.currHighlight = xNode;
                    xNode.id = 'highlight';
                }
            }
        }
        
        if (changes & flags.stdoutDirty) {
            this.renderStdout();
        }

        if (changes & flags.stdinDirty) {
            this.renderStdin();
        }

        if (changes & flags.stackDirty) {
            this.renderStack();
        }

        if (!this.start) {
            this.start = performance.now();
        }

        if (this.ticks % 60 === 0) {
            const elapsed = (performance.now() - this.start) / 1000;
            const rate = (this.ticks * numOperations) / elapsed;
            this.statsEl.innerText = `${rate.toFixed(0)} OP/S`;
        }

        this.ticks++;
    }
}
