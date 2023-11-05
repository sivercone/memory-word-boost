process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import 'dotenv/config';
import App from '@src/app';
import { SetRoute, FolderRoute, AuthRoute } from '@src/routes';

const app = new App([new SetRoute(), new FolderRoute(), new AuthRoute()]);

app.listen();
