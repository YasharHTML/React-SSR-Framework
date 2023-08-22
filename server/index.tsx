import express from "express";

import { assignRoutes, walk } from "./util";

const app = express();

walk("src").then((routes) => {
    assignRoutes(app, routes);
});

app.listen(3000);
