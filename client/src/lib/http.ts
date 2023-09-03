import axios from 'axios';
import Router from 'next/router';
import { notify } from './notify';

const instance = axios.create({
  baseURL: 'http://localhost:7001',
  withCredentials: true,
});

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      notify('Авторизація відсутня. Ви повинні увійти перш ніж продовжити');
      Router.replace('/login');
    }

    return Promise.reject(error);
  },
);

export default instance;
