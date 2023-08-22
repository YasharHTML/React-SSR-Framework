import { Request } from "express";

export function getServerSideProps(req: Request) {
    const id = req.query.id;
    const array = Array.from(new Array(+(id ?? "10")).keys());
    return {
        data: array,
    };
}

export default function App({ data }: { data: number[] }) {
    return (
        <>
            {data.map((data, index) => (
                <div key={index}>{data} number</div>
            ))}
        </>
    );
}
