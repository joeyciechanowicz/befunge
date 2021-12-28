import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Interpreter } from './interpreter';

export const useLoadScripts = (setScript: Dispatch<SetStateAction<string>>) => {
    const scripts: {[s: string]: string} = {
        fibonacci:
`00:.1:.>:"@"8**++\\1+:67+\`#@_v
       ^ .:\\/*8"@"\\%*8"@":\\ <`
    };

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const script = scripts[e.target.value];
        setScript(script);
    };

    return {
        scriptNames: Object.keys(scripts),
        handleChange
    };
};


export interface WrappedInterpreter {
    halted: boolean;
    x: number;
    y: number;
    stack: number[];
    stdout: string;
    step: () => void;
    _interpreter: Interpreter;
}
export function useInterpreter(script: string, readline: ReadLine): WrappedInterpreter {
    const [interpreter, setInterpreter] = useState(
        () => new Interpreter(script, readline)
    );

    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [halted, setHalted] = useState(false);
    const [stdout, setStdout] = useState('');
    const [stack, setStack] = useState<number[]>([]);

    useEffect(() => {
        if (script && script.length > 0) {
            setX(0);
            setY(0);
            setHalted(false);
            setStdout('');

            setInterpreter(new Interpreter(script, prompt.bind(window)));
        }
    }, [script]);

    const step = () => {
        interpreter.step();
        setX(interpreter.x);
        setY(interpreter.y);
        setHalted(interpreter.halted);
        setStdout(interpreter.stdout);
        setStack(interpreter.stack);
    };

    return {
        step,
        x,
        y,
        halted,
        stdout,
        stack,
        _interpreter: interpreter,
    };
}

interface UseRunResult {
    running: boolean;
    start: (batchSize: number) => void;
    stop: () => void;
}
export function useRun(
    wrapped: WrappedInterpreter,
    delay: number,
): UseRunResult {
    const [running, setRunning] = useState(false);
    const runningRef = useRef(false);
    const delayRef = useRef(0);

    const stop = () => {
        setRunning(false);
        runningRef.current = false;
    }

    const start = (batchSize: number,) => {
        const tick = () => {
            if (runningRef.current === false) {
                return;
            }
            const unwrapped = wrapped._interpreter;

            for (let i = 0; i < batchSize - 1; i++) {
                if (unwrapped.halted) {
                    break;
                }

                // step using the interpreter directly, not the react wrapper
                unwrapped.step();
            }

            // call the wrapped step function that triggers all the setStates
            wrapped.step();

            if (unwrapped.halted) {
                stop();
            } else {
                // when running batches, we're not rendering on every tick
                if (batchSize > 1) {
                    window.requestAnimationFrame(tick);
                } else {
                    setTimeout(tick, delayRef.current);
                }
            }

        };

        setRunning(true);
        runningRef.current = true;
        tick();
    };

    useEffect(() => {
        delayRef.current = delay;
    }, [delay]);

    return {
        running,
        start,
        stop
    };
}

// export function useAnimate(
//     interpreter: WrappedInterpreter,
//     delay: number
// ): [boolean, (value: boolean) => void] {
//     const [animating, setAnimating] = useState(false);

//     const tick = useCallback(() => {
//         if (animating === false) {
//             return;
//         }

//         if (interpreter._interpreter.halted) {
//             setAnimating(false);
//             return;
//         } else {
//             interpreter.step();

//             setTimeout(tick, delay);
//         }
//     }, [interpreter, animating, delay]);

//     useEffect(() => {
//         if (animating === true) {
//             tick();
//         }
//     }, [animating, tick]);

//     return [animating, setAnimating];
// }
