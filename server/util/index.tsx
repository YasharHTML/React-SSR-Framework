import fs from "fs/promises";
import { join } from "path";
import { Express, Request } from "express";
import ReactDOMServer from "react-dom/server";

export const walk: (dirPath: string) => Promise<string[]> = async (
    dirPath: string
) =>
    Promise.all(
        await fs.readdir(dirPath, { withFileTypes: true }).then(
            (entries) =>
                entries.map((entry) => {
                    const childPath = join(dirPath, entry.name);
                    return entry.isDirectory() ? walk(childPath) : childPath;
                }) as string[]
        )
    ).then((files) => files.flat(Number.POSITIVE_INFINITY));

export function convertFilePathsToRoutes(filePath: string) {
    const routePath = filePath.replace(/\[(.*?)\]/g, ":$1");
    const cleanRoutePath = routePath
        .replace(/\.tsx$/i, "")
        .replace(/^src\//, "");
    if (cleanRoutePath === "index") {
        return "/";
    }

    if (cleanRoutePath.endsWith("index")) {
        return `/${cleanRoutePath.substring(0, cleanRoutePath.length - 6)}`;
    }

    return `/${cleanRoutePath}`;
}

export const assignRoutes = (app: Express, routes: string[]) => {
    routes.sort();
    routes.reverse().forEach((route) => {
        const routePath = convertFilePathsToRoutes(route);

        console.log(route, " ==> ", routePath);

        app.get(routePath, async (req, res) => {
            const {
                default: Component,
                getServerSideProps,
                getStaticProps,
            }: {
                default: any;
                getServerSideProps?: (req: Request) => Promise<any> | any;
                getStaticProps?: (req: Request) => Promise<any> | any;
            } = await import("../../" + route.replace(".tsx", ""));
            const props = getServerSideProps
                ? await getServerSideProps(req)
                : getStaticProps
                ? await getStaticProps(req)
                : null;

            const payload = ReactDOMServer.renderToString(
                <Component {...props} />
            );

            fs.readFile("index.html", "utf-8")
                .then((file) => {
                    const result = file.replace("<!--app-root-->", payload);
                    res.send(result);
                })
                .catch((error) => {
                    res.status(500).json({
                        error,
                    });
                });
        });
    });
};
