import { requestPost } from "@/helpers";
import { REQUEST_LOGIN, REQUEST_REGISTER } from "@/contants/api/posts"
import { APIResultType } from "@/interfaces/types/api-result-params";
import { APIReqParamsType } from "@/interfaces/types/api-reuest-params";

const userLogin = async (params: any) => {
    const url = `${REQUEST_LOGIN}`;

    const getParams: APIReqParamsType = {
        url,
        reqParams: params,
    }

    const result: APIResultType = await requestPost(getParams);

    return result;
}

export const userRegister = async (params: any) => {
    const url = `${REQUEST_REGISTER}`;

    const getParams: APIReqParamsType = {
        url,
        reqParams: params
    }

    const result: APIResultType = await requestPost(getParams);

    return result;
}

export const AuthData = {
    userLogin,
    userRegister
}