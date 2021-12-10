process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import 'dotenv/config';
import App from '@/app';
import AuthRoute from '@/routes/authRoute';
import IndexRoute from '@/routes/indexRoute';
import UsersRoute from '@/routes/userRoute';
import validateEnv from '@utils/validateEnv';
import SetRoute from './routes/setRoute';
import FolderRoute from './routes/folderRoute';

validateEnv();

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute(), new SetRoute(), new FolderRoute()]);

app.listen();
