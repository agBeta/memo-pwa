import path from "path";
import express from "express";
// @ts-ignore
import { default as morgan } from "morgan";

/*  We do not access to __dirname out of the box when using es6 modules in node.
    See https://stackoverflow.com/questions/46745014/alternative-for-dirname-in-node-js-when-using-es6-modules 

    Refresher_Note: 
    Make sure you have added "module": "es2020" and "moduleResolution": "Node" to your tsconfig file. Read more in 
    the following links: 
        https://stackoverflow.com/a/72599201.
        https://www.typescriptlang.org/docs/handbook/module-resolution.html.
*/
const __dirname = new URL(".", import.meta.url).pathname;

const app = express();

/*  Refresher_Note: Read more about the following settings, in:
        http://expressjs.com/en/4x/api.html#app.settings.table.
        http://expressjs.com/en/guide/behind-proxies.html.
*/
app.set("trust proxy", true);
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "client"));

if (process.env.NODE_ENV === "development") {
    // Read more in https://github.com/expressjs/morgan#creating-new-tokens.
    morgan.token(
        "ip",
        /** This function returns ip address of the request
         * @param {import("./types").ExpressRequestType} req
         * @param {*} res
         * @returns {string} ip address of the request
         */
        function (req, res) {
            return req.ip;
        }
    );

    app.use(
        // Based on https://github.com/expressjs/morgan#using-a-custom-format-function.
        morgan(
            /**
             * @param {import("./types").MorganTokensType} tokens
             * @param {import("./types").ExpressRequestType} req
             * @param {*} res
             * @returns {string}
             */
            function (tokens, req, res) {
                return [
                    tokens.ip(req, res), // Custom token that we just declared above.
                    " ",
                    tokens.method(req, res),
                    tokens.url(req, res),
                    tokens.status(req, res),
                    "-",
                    tokens["response-time"](req, res),
                    "ms"
                ].join(" ");
            },
            {
                /*  You can integrate other logging tools (like winston) with morgan via "stream". Read
                        more in the following links: 
                            https://stackoverflow.com/a/28824464.
                            https://github.com/expressjs/morgan#write-logs-to-a-file.
                    */
                stream: process.stdout
            }
        )
    );
}

app.use(
    /*  Mutable content (especially js and css file) should not be cached by the browser (based on insights from 
        https://jakearchibald.com/2016/caching-best-practices/). By default, "express.static()" sets Cache-Control
        to 'public, max-age=0', so we are fine. But for fonts, we decided to cache them for a long time.
    */
    "/public/fonts",
    express.static(path.resolve(__dirname, "client", "public", "fonts"), { maxAge: "30d" })
);

app.use("/public", express.static(path.resolve(__dirname, "client", "public")));

app.get("/*", (req, res) => {
    /*  Actually, some of CSP headers below are redundant. For example, we do not make any API requests inside our 
        javascript file, so "connect-src" is not necessary. But let it be, to keep the code more flexible and reusable, 
        especially for learning and boilerplate purposes.
    */
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self' "
    ).render("index", {});
});

const PORT = process.env.PORT || 9327;

app.listen(PORT, () => {
    console.log(`Hello. We are live on port ${PORT}`);
});
