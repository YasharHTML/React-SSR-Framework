import { Request } from "express";

export function getStaticProps(req: Request) {
    const page = req.params.page;
    return {
        page,
    };
}

export default function App({page}: { page: string }) {
    return <>description: {page}</>;
}
