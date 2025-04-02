import axios from "axios";
import { BaseUrl } from "./apiEndPoints";

const callApi = (url, method, payload ,token) => {
    return new Promise(async (resolve, reject) => {
        let config = payload ? {
            method: method,
            url: url,
            baseURL: `${BaseUrl}`,
            // headers: {
            //     // 'Content-Type': 'application/json',
            //     "Authorization":`Bearer ${token}`
            // },
            data: payload
        }:{
            method: method,
            url: url,
            baseURL: `${BaseUrl}`,
            headers: {
                // 'Content-Type': 'application/json',
                "Authorization":`Bearer ${token}`
            },  
        }
        try {
            const response = await axios(config)
            // console.log(response);
            if (response.status < 400 ) {
                resolve(response.data)
            }
            else{
                reject(response)
            }
        }
        catch (error) {
            reject(error)
        }
    })
}


export { callApi }