//

import { $api, config } from "../main";

export const getCommon = (  ) => {

    return $api.get('/api', {headers: config()})

}

export const postCommon = () => {
    
    return $api.get('/api', {headers: config()})

}
