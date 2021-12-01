process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import 'dotenv/config';
import App from '@/app';
import AuthRoute from '@/routes/authRoute';
import IndexRoute from '@/routes/indexRoute';
import UsersRoute from '@/routes/userRoute';
import validateEnv from '@utils/validateEnv';
import { setRoute } from './routes/setRoute';

validateEnv();

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute(), new setRoute()]);

app.listen();
