import { Interpreter } from "./interpreter";

export class Renderer {
	private ticks: number = 0;
	private start: number | undefined;

	constructor(private interpreter: Interpreter, private programEl: HTMLElement, private stackEl: HTMLElement, private stdoutEl: HTMLElement, private statsEl: HTMLElement) {
	}

	initialRender() {
		this.renderTick();
	}

	renderTick() {
		let table = `<table class="table table-dark table-bordered"><tbody>`;

		for (let i = 0; i < this.interpreter.program.length; i++) {
			const line = this.interpreter.program[i];
			table += `<tr>`;
			for (let j = 0; j < line.length; j++) {
				if (i === this.interpreter.y && j === this.interpreter.x) {
					table += `<td class="highlight">${line[j]}</td>`;
				} else {
					table += `<td>${line[j]}</td>`;
				}
			}
			table += `</tr>`;
		}

		table += `</tbody></table>`;
		this.programEl.innerHTML = table;

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
