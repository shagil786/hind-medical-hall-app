import { APIReqParamsType, APIResultType } from '../../interfaces/types';
import axios from 'axios';
import _, { isEmpty } from 'lodash';

// types


// others

const requestFormData = async (params: APIReqParamsType) => {
  const {
    url,
    headers = {},
    // reqParams = {},
    formData = null,
  } = params;

  let apiResult: APIResultType;
  let apiResponse: any = null;
  let apiError: any = null;

  const reqConfig: any = {
    method: 'POST',
    url,
    headers: {
      ...headers,
    },
    // data: {
    //   ...reqParams,
    // },
  };

  if (formData) {
    reqConfig.data = formData;
    reqConfig.maxContentLength = 100000000;
    reqConfig.maxBodyLength = 1000000000;
  }

  if (
    isEmpty(reqConfig?.headers?.['content-type'])
  ) {
    reqConfig.headers = {
      ...reqConfig.headers ?? {},
      'content-type': 'application/json',
    };
  }

  // const finalUrl = await axios.getUri(reqConfig);

  try {
    return await axios(reqConfig).then((response: any) => {
      if ([200, 201, 202, 203].includes(response.status) === false) {
        // const errorObj = {
        //   message: 'Request Failed',
        //   data: response,
        // };
        throw new Error('request failed');
      }

      apiResponse = response.data;

      apiResult = {
        status: response.status,
        response: apiResponse,
        error: apiError,
      };

      return apiResult;
    }).catch((error: any) => {
      apiError = new Error(error.message);
      let errorMessage = error.message;
      const { response, data } = error;

      if (_.isEmpty(response) === false) {
        apiResponse = response;
        errorMessage = (response?.message) ? response?.message : errorMessage;
      }

      if (_.isEmpty(response?.data) === false) {
        apiResponse = response.data;
        errorMessage = (apiResponse?.message) ? apiResponse?.message : errorMessage;
      }

      if (_.isEmpty(data?.data) === false) {
        apiResponse = data?.data;
      }

      apiResult = {
        status: response?.status ?? 0,
        response: apiResponse,
        error: new Error(errorMessage),
      };

      return apiResult;
    });
  } catch (error: any) {
    apiError = new Error(error.message);

    apiResult = {
      status: 400,
      response: apiResponse,
      error: apiError,
    };

    return apiResult;
  }
};

export { requestFormData };
