interface OwnProps {
    text: string;
    char: number;
}
export function Stdin({ text, char }: OwnProps): JSX.Element {
    const start = text.substring(0, char);
    const end = text.substring(char + 1);

    return (
        <p>
            {start}
            <b>{text.charAt(char)}</b>
            {end}
        </p>
    );
}
