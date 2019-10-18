import {ChangeEvent, Dispatch, SetStateAction} from 'react';

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
