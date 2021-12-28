export class Renderer {
	constructor(interpreter, programDisplay, stackDisplay, stdoutDisplay, statsDisplay) {
		this.interpreter = interpreter;
		this.display = {
			program: programDisplay,
			stack: stackDisplay,
			stdout: stdoutDisplay,
			stats: statsDisplay
		};
		this.ticks = 0;
	}

	initialRender() {
		this.renderTick();
	}

	renderTick() {
		// const table = document.createElement('table');
		// table.classList.add('table', 'table-dark', 'table-bordered');
		//
		// const tbody = document.createElement('tbody');
		// table.appendChild(tbody);
		//
		// this.tableContents = [];

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
		this.display.program.innerHTML = table;

		let stack = '';
		for (let i = this.interpreter.stack.length - 1; i >= 0; i--) {
			stack += `<li class="list-group-item">${this.interpreter.stack[i]}</li>`
		}
		this.display.stack.innerHTML = stack;

		this.display.stdout.innerHTML = this.interpreter.stdout;

		if (!this.start) {
			this.start = performance.now();
		}

		if (this.ticks % 50 === 0) {
			const elapsed = (performance.now() - this.start) / 1000;
			const rate = this.ticks / elapsed;
			this.display.stats.innerText = `${rate.toFixed(0)} OP/S`;
		}

		this.ticks++;
	}
}
