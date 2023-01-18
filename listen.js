const app = require("./app.js");
const { PORT = 8080 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
