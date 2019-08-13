const request=require('request');

export function requestAsync(options){

    return new Promise((resolve, reject) => {
        request(options, function(err, response, body) {
            if (err)
                reject(err);
            else
                resolve({ response, body });
        });
    });
}

