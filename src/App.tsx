import { useCallback, useEffect, useState } from 'react';
import { useInterpreter, useLoadScripts, useRun } from './hooks';
import { Stack } from './stack';
import { Table } from './table';

const App: React.FC = () => {
    const [script, setScript] = useState('');
    const [programId, setProgramId] = useState(0);
    const [delay, setDelay] = useState(250);
    const { scriptNames, handleChange } = useLoadScripts(setScript);

    const interpreter = useInterpreter(script);

    const { running, start, stop } = useRun(interpreter, delay);

    const step = useCallback(() => {
        if (!interpreter.halted) {
            interpreter.step();
        }
    }, [interpreter]);

    useEffect(() => {
        setProgramId((p) => p + 1);
    }, [script]);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-12">
                    <form>
                        <div className="form-group">
                            <h1>Load Script</h1>
                            <label htmlFor="load-script">Script name </label>
                            <select id="load-script" onChange={handleChange}>
                                <option value=""></option>
                                {scriptNames.map((name) => (
                                    <option key={name} value={name}>
                                        {name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="h3" htmlFor="script">
                                Script
                            </label>
                            <textarea
                                id="script"
                                className="form-control"
                                rows={8}
                                onChange={(e) => setScript(e.target.value)}
                                value={script}
                            ></textarea>
                        </div>

                        <div
                            className="btn-toolbar"
                            role="toolbar"
                            aria-label="Playback controls"
                        >
                            <div
                                className="btn-group mr-2"
                                role="group"
                                aria-label="First group"
                            >
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() =>
                                        running ? stop() : start(1000)
                                    }
                                >
                                    {running ? 'Stop' : 'Run'}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={step}
                                    disabled={running}
                                >
                                    Step
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() =>
                                        running ? stop() : start(1)
                                    }
                                >
                                    {running ? 'Stop' : 'Start'} Animation
                                </button>
                            </div>

                            <div
                                className="btn-group mr-2"
                                role="group"
                                aria-label="First group"
                            >
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    aria-label="slow-down"
                                    onClick={() =>
                                        setDelay(
                                            Math.max(1, Math.floor(delay * 0.5))
                                        )
                                    }
                                >
                                    -
                                </button>
                                <button
                                    type="button"
                                    disabled
                                    className="btn btn-secondary"
                                >
                                    {delay}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    aria-label="delay up"
                                    onClick={() =>
                                        setDelay(Math.ceil(delay * 1.5))
                                    }
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="col-md">
                    <h1 className="h2">Program</h1>
                    <Table
                        program={interpreter._interpreter.program}
                        pid={programId}
                        x={interpreter.x}
                        y={interpreter.y}
                    />
                </div>

                <div className="col-lg">
                    <h1 className="h2">Stack</h1>
                    <Stack stack={interpreter.stack} />
                </div>

                <div className="col-lg">
                    <h1 className="h2">Stdout</h1>
                    <div className="card">
                        <div className="card-body">
                            <pre id="stdout">{interpreter.stdout}</pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
