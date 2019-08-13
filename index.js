'use strict';
const PathFinder = require('geojson-path-finder');

const https = require('https');

exports.handler = (event, context, callback) => {
    const space = event.pathParameters['proxy'];
    const access_token = (event.queryStringParameters && event.queryStringParameters.access_token) 
    ? event.queryStringParameters.access_token: event.headers['Authorization'];
    const inputJson=JSON.parse(event.body);
    const bbox = getExtent(inputJson);
    const templateUrl = `https://xyz.api.here.com/hub/spaces/${space}/bbox?access_token=${access_token}&west=${bbox[0]}&north=${bbox[3]}&east=${bbox[1]}&south=${bbox[2]}`;
    https.get(templateUrl, (res) => {
        let content = '';
        res.on('data', (chunk) => { content += chunk; });
        res.on('end', () => {
            const response  = {
                "statusCode": 200,
                "headers": {
                    "my_header": "my_value"
                },
                "body":JSON.stringify(getMapMatchedOutput(JSON.parse(content),inputJson)),//JSON.stringify(event),
                "isBase64Encoded": false
            };
            console.log(`Generated response =  ${response.body}`);
            callback(null, response);
        });
    });
};

function getMapMatchedOutput(bboxJson,cc){
    var pathFinder = new PathFinder(bboxJson,{edgeDataReduceFn:function(seed,props){
            return props;
        }});

        const path = pathFinder.findPath(toGeoJsonFeature(cc.coordinates[0]), toGeoJsonFeature(cc.coordinates[1]));
        return {
            type:"Feature",
            geometry:{
                type:"LineString",
                coordinates:path.path.map(elem=>{
                    return [elem[0],elem[1]];
                })
            },
            properties:path
        };
}
function toGeoJsonFeature(coordinate){
    return {
        type:"Feature",geometry:{ type:"Point",coordinates: coordinate }
    }
}

function getExtent(geometry) {
    var extent = [Infinity, Infinity, -Infinity, -Infinity];
    geometry.coordinates.forEach(coord => {
        if (extent[0] > coord[0]) extent[0] = coord[0];
        if (extent[1] > coord[1]) extent[1] = coord[1];
        if (extent[2] < coord[0]) extent[2] = coord[0];
        if (extent[3] < coord[1]) extent[3] = coord[1];
    });
    return extent;
}
