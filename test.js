var index = require("./index")

let callBack = (err,res)=>{
    console.log(JSON.stringify(res));
}
let a = async ()=>{
    var headers=[];

    index.handler({
        httpMethod:"POST",
        headers:headers,
        queryStringParameters:{
		access_token:"AYc6efZzV1MHPFwBidvahdI"
	},
        pathParameters:{
	  proxy:"uZnY5Thd"
	},
        body:JSON.stringify({
    "coordinates":[
        [
            12.0254992,
            57.6756536
        ],
        [
            12.0266786,
            57.6650217
       ]
  ]
}),
        path:"/uZnY5Thd?access_token=AYc6efZzV1MHPFwBidvahdI"
    },null,callBack);
};

a();



