import React, {useState} from 'react';

import {useLoadScripts} from "./hooks";

const App: React.FC = () => {
    const [script, setScript] = useState('');
    const [speed, setSpeed] = useState(250);
    const {scriptNames, handleChange} = useLoadScripts(setScript);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-12">
                    <form>
                        <div className="form-group">
                            <label htmlFor="load-script">Load script</label>
                            <select id="load-script" onChange={handleChange}>
                                <option value=''></option>
                                {
                                    scriptNames.map(name => <option key={name} value={name}>{name}</option>)
                                }
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="h3" htmlFor="script">Script</label>
                            <textarea id="script" className="form-control" rows={8} onChange={e => setScript(e.target.value)} value={script}>
                            </textarea>
                        </div>

                        <div className="btn-toolbar" role="toolbar" aria-label="Playback controls">
                            <div className="btn-group mr-2" role="group" aria-label="First group">
                                <button type="button" className="btn btn-secondary">Compile</button>
                                <button type="button" className="btn btn-secondary">Run</button>
                                <button type="button" className="btn btn-secondary">Step</button>
                                <button type="button" className="btn btn-secondary">Start Animation</button>
                            </div>

                            <div className="btn-group mr-2" role="group" aria-label="First group">
                                <button type="button" className="btn btn-secondary" aria-label="slow-down" onClick={() => setSpeed(Math.max(1, Math.floor(speed * 0.5)))}>-</button>
                                <button type="button" disabled className="btn btn-secondary" >{speed}</button>
                                <button type="button" className="btn btn-secondary" aria-label="speed up" onClick={() => setSpeed(Math.ceil(speed * 1.5))}>+</button>
                            </div>
                        </div>

                        <span id="stats"/>
                    </form>
                </div>

                <div className="col-lg">
                    <h1 className="h2">Program</h1>
                    <div id="program-display">

                    </div>
                </div>

                <div className="col-lg">
                    <h1 className="h2">Stack</h1>
                    <ul className="list-group" id="stack-display">

                    </ul>
                </div>

                <div className="col-lg">
                    <h1 className="h2">Stdout</h1>
                    <div className="card">
                        <div className="card-body">
                    <pre id="stdout">

                    </pre>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default App;
