interface OwnProps {
    stack: number[];
}
export function Stack({ stack }: OwnProps): JSX.Element {
    return (
        <ul className="list-group" id="stack-display">
            {stack.map((x, i) => (
                <li key={i} className="list-group-item">
                    {x}
                </li>
            ))}
        </ul>
    );
}
