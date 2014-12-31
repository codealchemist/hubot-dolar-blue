var dolarblue = require('dolar-blue'),
    request = require("request"),
    im = require('imagemagick'),
    fs = require('fs');

function dolarbluebot(robot) {
    function getEmoticon(sellValue) {
        var sellBad = 11,
            sellOk = 13,
            sellAwesome = 14;
            sellSupreme = 15;
            sellRocket = 16;
            
        if (sellValue >= sellRocket) return ' :rocket:';
        if (sellValue >= sellSupreme) return ' :joy:';
        if (sellValue >= sellAwesome) return ' :grin:';
        if (sellValue >= sellOk) return ' :smile:';
        if (sellValue <= sellBad) return ' :cold_sweat:';
        return '';
    }
    
    function log(msg) {
        if (typeof msg === 'object') {
            console.log('[ dolarblue ]--> [OBJECT]:');
            console.log(msg);
            return;
        }
        
        console.log('[ dolarblue ]--> ' + msg);
    }
    
    robot.hear(/^jarvis dolarblue$|^jarvis db$/i, function(msg){
        dolarblue(function(err, data){
            if (err) {
                msg.send('Oops, try again later.');
                return;
            }
            
            var date = data.date.toISOString().slice(0,10),
                time = data.date.getHours() + ':' + ("0" + data.date.getMinutes()).slice(-2),
                smile = '';
            date += ' ' + time;
            
            var emoticon = getEmoticon(data.rates.sell);
            msg.send('[ ' + date + ' ] _Dolar Blue:_ *BUY*: ' + data.rates.buy + ' / *SELL*: ' + data.rates.sell + emoticon);
        });
    });
    
    robot.hear(/^jarvis dbn.all$/i, function(msg){
        request({
            uri: "http://dolarblue.net",
        }, function(error, response, body) {
            var result = body.match(/http\:\/\/dolarblue\.net\/imagenes\/precio\/dolar-paralelo-.*\.jpeg/g),
                imageUrl = result[0];
                
            msg.send(imageUrl);
        });
    });
    
    robot.hear(/^jarvis dbn/i, function(msg){
        var imagesPath = '/home/ubuntu/workspace/public/img/';
            originalImagePath = imagesPath + 'dolarblue-original-latest.jpg',
            croppedImagePath = imagesPath + 'dolarblue-latest.jpg',
            croppedImageUrl = 'https://hubot-appnexus-ar-codealchemist.c9.io/dolarblue';
        
        // TODO: use promises to remove callback hell
        getSourceImageUrl(function(imageUrl){
            saveImage(imageUrl, originalImagePath, function(){
                cropImage(originalImagePath, croppedImagePath, function(){
                    msg.send(croppedImageUrl);
                });
            });
        });
        
        //-------------------------------------------------
        
        function getSourceImageUrl(callback) {
            request({
                uri: "http://dolarblue.net",
            }, function(error, response, body) {
                var result = body.match(/http\:\/\/dolarblue\.net\/imagenes\/precio\/dolar-paralelo-.*\.jpeg/g),
                    imageUrl = result[0];
                
                callback(imageUrl);
            });
        }
        
        function saveImage(url, file, callback) {
            var options = {
                url: url,
                encoding: 'binary'
            };
            
            var result = request.get(options, function(err, response, body) {
                fs.writeFile(file, body, 'binary', function(err) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    
                    log('image saved');
                    if (typeof callback === 'function') callback();
                }); 
            });
        }
        
        function cropImage(source, target, callback) {
            var width = 820,
                height = 275;
                
            im.crop({
                srcPath: source,
                dstPath: target,
                width: width,
                height: height,
                quality: 1,
                gravity: "North"
            }, function(err, stdout, stderr){
                if (err) {
                    log('ERROR: unable to crop image');
                    console.log(err);
                    return;
                }
                
                log('image cropped');
                if (typeof callback === 'function') callback();
            });
        }
    });
} //end dolarblue bot

module.exports = dolarbluebot;