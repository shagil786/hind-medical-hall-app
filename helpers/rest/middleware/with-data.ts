import {
  ApiRequest,
  ApiResponse,
} from '../../../interfaces';

const withData = (handler: any) => async (req: ApiRequest, res: ApiResponse) => {
  const addOns = {
    test_env: 'browser',
  };

  const newQuery = {
    ...addOns,
  };

  const newBody = {
    ...addOns,
  };

  req.queryParams = newQuery;
  req.bodyParams = newBody;

  return handler(req, res);
};

export default withData;
