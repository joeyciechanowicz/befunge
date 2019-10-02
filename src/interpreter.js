export const UP = 0;
export const RIGHT = 1;
export const DOWN = 2;
export const LEFT = 3;

export class Interpreter {
	constructor(script) {
		this.program = [];
		this.x = 0;
		this.y = 0;
		this.direction = RIGHT;
		this.stringMode = false;
		this.stack = [];
		this.stdout = '';
		this.halted = false;

		const lines = script.split(/\n/g);
		this.width = lines.reduce((max, curr) => {
			if (curr.length > max) {
				return curr.length;
			}
			return max;
		}, 0);
		this.height = lines.length;

		lines.forEach((line, idx) => {
			if (line.length < this.width) {
				const newLine = line + new Array((this.width - line.length) + 1).join(' ');
				this.program.push(Array.from(newLine));
			} else {
				this.program.push(Array.from(line));
			}
		});
	}

	step() {
		if (this.halted) {
			return;
		}

		let newX = this.x;
		let newY = this.y;

		switch (this.direction) {
			case UP:
				newY = this.y - 1 < 0 ? this.height - 1 : this.y - 1;
				break;
			case DOWN:
				newY = (this.y + 1) % this.height;
				break;
			case LEFT:
				newX = this.x - 1 < 0 ? this.width - 1 : this.x - 1;
				break;
			case RIGHT:
				newX = (this.x + 1) % this.width;
				break;
		}

		this.x = newX;
		this.y = newY;
		const nextToken = this.program[newY][newX];

		if (this.stringMode) {
			if (nextToken === '"') {
				this.stringMode = false;
			} else {
				this.stack.push(nextToken);
			}
			return;
		}

		switch (nextToken) {
			case 'v': this.direction = DOWN; break;
			case '>': this.direction = RIGHT; break;
			case '^': this.direction = UP; break;
			case '<': this.direction = LEFT; break;

			case '0': this.stack.push(0); break;
			case '1': this.stack.push(1); break;
			case '2': this.stack.push(2); break;
			case '3': this.stack.push(3); break;
			case '4': this.stack.push(4); break;
			case '5': this.stack.push(5); break;
			case '6': this.stack.push(6); break;
			case '7': this.stack.push(7); break;
			case '8': this.stack.push(8); break;
			case '9': this.stack.push(9); break;

			case '+': {
				const a = this.stack.pop();
				const b = this.stack.pop();
				this.stack.push(a + b);
				break;
			}
			case '-': {
				const a = this.stack.pop();
				const b = this.stack.pop();
				this.stack.push(b - a);
				break;
			}
			case '/': {
				const a = this.stack.pop();
				const b = this.stack.pop();
				this.stack.push(Math.floor(b / a));
				break;
			}
			case '*': {
				const a = this.stack.pop();
				const b = this.stack.pop();
				this.stack.push(a * b);
				break;
			}
			case '%': {
				const a = this.stack.pop();
				const b = this.stack.pop();
				this.stack.push(b % a);
				break;
			}

			case '!': {
				//  NOT: Pop a value. If the value is zero, push 1; otherwise, push zero
				const a = this.stack.pop();
				if (a === 0) {
					this.stack.push(1);
				} else {
					this.stack.push(0);
				}
				break;
			}

			case '`': {
				// Greater than: Pop a and b, then push 1 if b>a, otherwise zero
				const a = this.stack.pop();
				const b = this.stack.pop();
				if (b > a) {
					this.stack.push(1);
				} else {
					this.stack.push(0);
				}
				break;
			}

			case '?': {
				// Start moving in a random cardinal direction
				// TODO: Do this in one operation
				const newDirection = Math.random();
				if (newDirection < 0.25) {
					this.direction = UP;
				} else if (newDirection < 0.5) {
					this.direction = RIGHT;
				} else if (newDirection < 0.75) {
					this.direction = DOWN;
				} else {
					this.direction = LEFT;
				}
				break;
			}

			case '_': {
				// Pop a value; move right if value=0, left otherwise
				const a = this.stack.pop();
				if (a === 0) {
					this.direction = RIGHT;
				} else {
					this.direction = LEFT;
				}
				break;
			}
			case '|': {
				// Pop a value; move down if value=0, up otherwise
				const a = this.stack.pop();
				if (a === 0) {
					this.direction = UP;
				} else {
					this.direction = DOWN;
				}
				break;
			}

			case ':': {
				// Duplicate value on top of the stack
				this.stack.push(this.stack[this.stack.length - 1]);
				break;
			}

			case '\\': {
				// Swap two values on top of the stack
				const a = this.stack.pop();
				const b = this.stack.pop();
				this.stack.push(a);
				this.stack.push(b);
				break;
			}

			case '$': {
				this.stack.pop();
				break;
			}

			case '.': {
				// Pop value and output as an integer followed by a space
				const a = this.stack.pop();
				this.stdout += a;
				break;
			}
			case ',': {
				// Pop value and output as ASCII character
				const a = this.stack.pop();

				if (Number.isInteger(a)) {
					this.stdout += String.fromCharCode(a);
				} else {
					this.stdout += a;
				}
				break;
			}

			case '#': {
				// Bridge: Skip next cell
				throw new Error('not implemented');
			}

			case 'p': {
				// A "put" call (a way to store a value for later use). Pop y, x, and v, then change the character at (x,y) in the program to the character with ASCII value v
				throw new Error('not implemented');
			}
			case 'g': {
				// A "get" call (a way to retrieve data in storage). Pop y and x, then push ASCII value of the character at that position in the program
				throw new Error('not implemented');
			}

			case '&': {
				// Ask user for a number and push it
				const number = prompt('Enter a number');
				const converted = Number.parseInt(number);
				this.stack.push(converted);
				break;
			}
			case '~': {
				// Ask user for a character and push its ASCII value
				const char = prompt('Enter a character')[0];
				this.stack.push(char);
				break;
			}

			case '@': {
				// End program
				this.halted = true;
				break;
			}

			case '"': {
				this.stringMode = true;
				break;
			}

			default: break;
		}
	}
}
