import ErrorPage from 'modules/ErrorPage';

const Custom404 = () => {
  return (
    <ErrorPage>
      <p>Error 404</p>
      <p>Unfortunately, the page you requested was not found, but there are others that are also good.</p>
    </ErrorPage>
  );
};

export default Custom404;
