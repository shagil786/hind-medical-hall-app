import { requestGet } from "@/helpers";
import { REQUEST_POSTS } from "@/contants/api/posts"
import { APIResultType } from "@/interfaces/types/api-result-params";
import { APIReqParamsType } from "@/interfaces/types/api-reuest-params";

const getOffersData = async () => {
    const url = `${REQUEST_POSTS}`;

    const getParams: APIReqParamsType = {
        url,
    }

    const result: APIResultType = await requestGet(getParams);

    return result;
}

export const PostData = {
    getOffersData,
}