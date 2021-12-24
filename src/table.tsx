import { useEffect, useMemo, useRef } from 'react';

interface OwnProps {
    program: string[][];
    pid: number; // this is used as a proxy for program, to avoid expensive re-calculation
    x: number;
    y: number;
}
export const Table = ({ program, pid, x, y }: OwnProps) => {
    const ref = useRef<HTMLTableSectionElement>(null);
    const prevRef = useRef<Element | undefined>(undefined);

    // for performance, we only render the table when the program changes.
    // we use a ref to the tbody to then update the highlighting
    const result = useMemo(() => {
        console.log('rendering table', x, y);
        return (
            <table className="table table-dark table-bordered">
                <tbody ref={ref}>
                    {program.map((line, py) => (
                        <tr key={py}>
                            {line.map((col, px) => (
                                <td key={px}>{col}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pid]);

    useEffect(() => {
        // clear the highlight previous cell
        if (prevRef.current) {
            prevRef.current.classList.remove('highlight');
        }

        // add a highlight to the current cell
        if (ref.current) {
            if (ref.current.children.length > y) {
                const yNode = ref.current.children[y];
                if (yNode.children.length > x) {
                    const xNode = yNode.children[x];
                    prevRef.current = xNode;
                    xNode.classList.add('highlight');
                }
            }
        }
    }, [x, y]);

    return result;
};
