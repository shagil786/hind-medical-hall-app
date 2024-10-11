import axios from 'axios';
import _ from 'lodash';

// types
import { APIReqParamsType, APIResultType } from '../../interfaces/types';


// others
// import {
//   logger,
// } from '../../utils';

const requestPatch = async (params: APIReqParamsType) => {
  const {
    url,
    headers = {},
    reqParams = {},
  } = params;

  let apiResult: APIResultType;
  let apiResponse: any = null;
  let apiError: any = null;

  try {
    // logger.debugWithMarker('HTTP URL:');
    // logger.debug(url);

    // logger.debugWithMarker('HTTP REQUEST BODY (plain):');
    // logger.dir(reqParams);

    return await axios({
      method: 'patch',
      url,
      headers: {
        'content-type': 'application/json',
        ...headers,
      },
      data: {
        ...reqParams,
      },
    }).then((response) => {
      if ([200, 201, 202, 203].includes(response.status) === false) {
        // logger.debugWithMarker('HTTP ERROR:');
        // logger.dir(response);
        throw new Error('request failed');
      }
      apiResponse = response.data;
      // logger.debugWithMarker('HTTP RESPONSE:');
      // logger.dir(apiResponse);

      apiResult = {
        status: response.status,
        response: apiResponse,
        error: apiError,
      };
      return apiResult;
    }).catch((error) => {
      // logger.debugWithMarker('HTTP ERROR:');
      // logger.dir(error);

      apiError = new Error(error.message);
      const { response } = error;

      if (_.isEmpty(response) === false) {
        apiResponse = response;
      }

      if (_.isEmpty(response.data) === false) {
        apiResponse = response.data;
      }

      apiResult = {
        status: response.status,
        response: apiResponse,
        error: apiError,
      };
      return apiResult;
    });
  } catch (error: any) {
    // logger.debugWithMarker('HTTP ERROR:');
    // logger.dir(error);

    apiError = new Error(error.message);
    apiResult = {
      status: 400,
      response: apiResponse,
      error: apiError,
    };
    return apiResult;
  }
};

export { requestPatch };
