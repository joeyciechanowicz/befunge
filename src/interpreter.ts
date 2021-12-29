const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;

enum Direction {
    Up,
    Right,
    Down,
    Left
}

export type ReadStdin = () => string | null;

export class Interpreter {
    private direction: Direction = Direction.Right;
    private stringMode: boolean = false;
    
    private readonly width: number;
    private readonly height: number;
    
    public halted: boolean = false;
    public readonly program: string[][] = [];
    public readonly stdin: string;
    public x: number = 0;
    public y: number = 0;
    public stdinPos: number = 0;
    public stack: number[] = [];
    public stdout: string = '';

    constructor(script: string, stdin: string) {
        this.stdin = stdin;
        const lines = script.split(/\n/g);
        this.width = lines.reduce((max, curr) => curr.length > max ? curr.length : max, 0);
        this.height = lines.length;

        lines.forEach((line) => {
            if (line.length < this.width) {
                const newLine = line + new Array((this.width - line.length) + 1).join(' ');
                this.program.push(Array.from(newLine));
            } else {
                this.program.push(Array.from(line));
            }
        });
    }

    private nextStdinChar(): string | null {
        if (this.stdinPos >= this.stdin.length) {
            return null;
        }
        return this.stdin.charAt(this.stdinPos++);
    }

    private nextStdinNum(): number {
        if (this.stdinPos >= this.stdin.length) {
            return -1;
        }

        let num = '';
        while (this.stdin.charAt(this.stdinPos).match(/[0-9]/)) {
            num += this.stdin.charAt(this.stdinPos);
            this.stdinPos++;
        }

        if (this.stdin.charAt(this.stdinPos) === ' ' || this.stdin.charAt(this.stdinPos) === '\n') {
            this.stdinPos++;
        }

        const result = parseInt(num);
        if (isNaN(result)) {
            return -1;
        }

        return result;
    }

    private nextPosition(): void {
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
    }

    step() {
        if (this.halted) {
            return;
        }

        const token = this.program[this.y][this.x];

        if (this.stringMode) {
            if (token === '"') {
                this.stringMode = false;
            } else {
                this.stack.push(token.charCodeAt(0));
            }

            this.nextPosition();
            return;
        }

        switch (token) {
            case 'v':
                this.direction = DOWN;
                break;
            case '>':
                this.direction = RIGHT;
                break;
            case '^':
                this.direction = UP;
                break;
            case '<':
                this.direction = LEFT;
                break;

            case '0':
                this.stack.push(0);
                break;
            case '1':
                this.stack.push(1);
                break;
            case '2':
                this.stack.push(2);
                break;
            case '3':
                this.stack.push(3);
                break;
            case '4':
                this.stack.push(4);
                break;
            case '5':
                this.stack.push(5);
                break;
            case '6':
                this.stack.push(6);
                break;
            case '7':
                this.stack.push(7);
                break;
            case '8':
                this.stack.push(8);
                break;
            case '9':
                this.stack.push(9);
                break;

            case '+': {
                const a = this.stack.pop() || 0;
                const b = this.stack.pop() || 0;
                this.stack.push(a + b);
                break;
            }
            case '-': {
                const a = this.stack.pop() || 0;
                const b = this.stack.pop() || 0;
                this.stack.push(b - a);
                break;
            }
            case '/': {
                const a = this.stack.pop() || 0;
                const b = this.stack.pop() || 0;
                this.stack.push(Math.floor(b / a));
                break;
            }
            case '*': {
                const a = this.stack.pop() || 0;
                const b = this.stack.pop() || 0;
                this.stack.push(a * b);
                break;
            }
            case '%': {
                const a = this.stack.pop() || 0;
                const b = this.stack.pop() || 0;
                this.stack.push(b % a);
                break;
            }

            case '!': {
                //  NOT: Pop a value. If the value is zero, push 1; otherwise, push zero
                const a = this.stack.pop() || 0;
                if (a === 0) {
                    this.stack.push(1);
                } else {
                    this.stack.push(0);
                }
                break;
            }

            case '`': {
                // Greater than: Pop a and b, then push 1 if b>a, otherwise zero
                const a = this.stack.pop() || 0;
                const b = this.stack.pop() || 0;

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
                const a = this.stack.pop() || 0;
                if (a === 0) {
                    this.direction = RIGHT;
                } else {
                    this.direction = LEFT;
                }
                break;
            }
            case '|': {
                // Pop a value; move down if value=0, up otherwise
                const a = this.stack.pop() || 0;
                if (a === 0) {
                    this.direction = DOWN;
                } else {
                    this.direction = UP;
                }
                break;
            }

            case ':': {
                // Duplicate value on top of the stack
                const a = this.stack.pop() || 0;
                if (a === undefined) {
                    this.stack.push(0);
                    this.stack.push(0);
                } else {
                    this.stack.push(a);
                    this.stack.push(a);
                }
                break;
            }

            case '\\': {
                // Swap two values on top of the stack
                const a = this.stack.pop() || 0;
                const b = this.stack.pop() || 0;
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
                const a = this.stack.pop() || 0;
                this.stdout += a + ' ';
                break;
            }
            case ',': {
                // Pop value and output as ASCII character
                const a = this.stack.pop() || 0;
                this.stdout += String.fromCharCode(a);
                break;
            }

            case '#': {
                // Bridge: Skip next cell
                this.nextPosition();
                break;
            }

            case 'p': {
                // A "put" call (a way to store a value for later use). Pop y, x, and v, then change the character at (x,y) in the program to the character with ASCII value v
                const y = this.stack.pop() || 0;
                const x = this.stack.pop() || 0;
                const v = this.stack.pop() || 0;

                this.program[y][x] = String.fromCharCode(v);
                break;
            }
            case 'g': {
                // A "get" call (a way to retrieve data in storage). Pop y and x, then push ASCII value of the character at that position in the program
                const y = this.stack.pop() || 0;
                const x = this.stack.pop() || 0;

                if (x < this.width && y < this.height) {
                    const v = this.program[y][x];
                    this.stack.push(v.charCodeAt(0));
                } else {
                    this.stack.push(0);
                }
                break;
            }

            case '&': {
                // Ask user for a number and push it
                this.stack.push(this.nextStdinNum());
                break;
            }
            case '~': {
                // Ask user for a character and push its ASCII value
                const char = this.nextStdinChar() || '';

                if (char.length === 0) {
                    // noop
                    return;
                }

                this.stack.push(char.charCodeAt(0));
                break;
            }

            case '@': {
                // End program
                this.halted = true;
                return;
            }

            case '"': {
                this.stringMode = true;
                break;
            }

            default:
                // noop as default
                break;
        }

        this.nextPosition();
    }
}
