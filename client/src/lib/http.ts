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
    if (error.response?.status === 401) {
      notify('Authorization is missing. You must sign in before continuing');
      Router.replace('/login');
    } else if (error.response?.data) notify(error.response?.data);

    return Promise.reject(error);
  },
);

export default instance;
