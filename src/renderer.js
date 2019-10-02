export class Renderer {
	constructor(interpreter, programDisplay, stackDisplay, stdoutDisplay) {
		this.interpreter = interpreter;
		this.display = {
			program: programDisplay,
			stack: stackDisplay,
			stdout: stdoutDisplay
		};
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
		this.display.program.innerHTML = table;

		let stack = '';
		for (let i = this.interpreter.stack.length - 1; i >= 0; i--) {
			stack += `<li class="list-group-item">${this.interpreter.stack[i]}</li>`
		}
		this.display.stack.innerHTML = stack;

		this.display.stdout.innerHTML = this.interpreter.stdout;
	}
}
