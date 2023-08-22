import { Request } from "express";

export function getStaticProps(req: Request) {
    const id = req.params.id;
    return {
        id,
    };
}

export default function App({id}: { id: string }) {
    return <>user: {id}</>;
}
