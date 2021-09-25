const { minify } = require("terser");
const path = require("path");
const fsPromises = require("fs/promises");

(async ()=>{
    "use strict";
    if (process.argv.length !== 3) {
        console.error("invalid arguments");
        return;
    }

    const jspath = process.argv[2];
    const code = await fsPromises.readFile(jspath, "utf-8");
    const result = await minify(code);

    const dir = path.dirname(jspath);
    const newFileName = path.basename(jspath, ".js") + ".txt";

    const newDir = path.join(dir, "bml");
    await fsPromises.mkdir(newDir, { recursive: true });

    const newPath = path.join(newDir, newFileName);
    const bml = `javascript:${encodeURIComponent(result.code)}`;


    await fsPromises.writeFile(newPath, bml, "utf-8");
})();