import { Interpreter } from "./interpreter";

export class Renderer {
	private ticks: number = 0;
	private start: number | undefined;
	private tbody: HTMLElement;
	private currHighlight: Element;

	constructor(private interpreter: Interpreter, private programEl: HTMLElement, private stackEl: HTMLElement, private stdoutEl: HTMLElement, private statsEl: HTMLElement) {
		let table = `<table class="table table-dark table-bordered"><tbody id="table-body">`;

		for (let i = 0; i < this.interpreter.program.length; i++) {
			const line = this.interpreter.program[i];
			table += `<tr>`;
			for (let j = 0; j < line.length; j++) {
				table += `<td>${line[j]}</td>`;
			}
			table += `</tr>`;
		}

		table += `</tbody></table>`;
		this.programEl.innerHTML = table;

		this.tbody = document.getElementById('table-body')!;
		this.currHighlight = document.querySelector('#table-body > tr > td')!;
		this.currHighlight.className = 'highlight';
	}

	renderTick() {
		const {x, y} = this.interpreter;
		// clear previous highlight
		this.currHighlight.className = '';
		if (this.tbody.children.length > y) {
			const yNode = this.tbody.children[y];
			if (yNode.children.length > x) {
				const xNode = yNode.children[x];
				this.currHighlight = xNode;
				xNode.classList.add('highlight');
			}
		}

		let stack = '';
		for (let i = this.interpreter.stack.length - 1; i >= 0; i--) {
			stack += `<li class="list-group-item">${this.interpreter.stack[i]}</li>`
		}
		this.stackEl.innerHTML = stack;

		this.stdoutEl.innerHTML = this.interpreter.stdout;

		if (!this.start) {
			this.start = performance.now();
		}

		if (this.ticks % 50 === 0) {
			const elapsed = (performance.now() - this.start) / 1000;
			const rate = this.ticks / elapsed;
			this.statsEl.innerText = `${rate.toFixed(0)} OP/S`;
		}

		this.ticks++;
	}
}
