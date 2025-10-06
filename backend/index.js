import app from './app.js';
import { config } from './src/config.js';

import "./database.js";

async function main() {
    const PORT = config.server.port;
    app.listen(PORT);
    console.log(`Server is running`);
}

main();