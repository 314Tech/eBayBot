var test = require('tape');
var lambdaLocal = require('lambda-local');
var winston = require('winston');

var lambdasPath = '../'

function testLocalLambda(func, event, cb) {
    var lambdaFunc = require(func);
    var lambdaEvent = require(event);
    winston.level = 'none'; //'error' //'debug', 'info'
    lambdaLocal.setLogger(winston);
    lambdaLocal.execute({
        event: lambdaEvent,
        lambdaFunc: lambdaFunc,
        lambdaHandler: 'handler',
        callbackWaitsForEmptyEventLoop: false,
        timeoutMs: 5000,
        mute: true,
        callback: cb
    });
}

test('Weather Current USA Portland', function (t) {

    testLocalLambda(lambdasPath + 'index.js', lambdasPath + 'tests/event-samples/usa-events.js',
        function (_err, _data) {
            err = _err;
            json = _data;
            //console.log("JSON" + JSON.stringify(json))
            t.equal(err, null, 'no errors');
            t.notEqual(json.package, null, 'has package object');
            t.notEqual(json.package.video, null, 'has package/video object');
            t.equal(json.package.video.item.length, 1, 'items length 1');
            const video_item = json.package.video.item[0];
            t.notEqual(video_item.rendition, null, 'has video item rendition object');
            t.notEqual(video_item.rendition.type, null, 'has video item rendition type object');
            t.equal(video_item.rendition.type, 'application/x-mpegURL', 'video item rendition type mpeg');
            t.end()
        });
});
