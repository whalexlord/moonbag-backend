const app = require('./app');
const config = require('./config');
import { runServer } from "./const";

const PORT = process.env.PORT || config.port;
runServer();
const server = app.listen(PORT, () => {
  console.log('server is running on port', server.address().port);
});
