process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import 'dotenv/config';
import App from '@/app';
import validateEnv from '@utils/validateEnv';
import SetRoute from './routes/setRoute';
import FolderRoute from './routes/folderRoute';
import AuthRoute from './routes/authRoute';

validateEnv();

const app = new App([new SetRoute(), new FolderRoute(), new AuthRoute()]);

app.listen();
