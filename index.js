'use strict';

const fs = require('fs');
const path = require('path');

const moment = require('moment');

const Feeder = require('./lib/feeder');
const Tweeter = require('./lib/tweeter');
const video = require('./lib/video');

const config = fs.existsSync('./local.config.js') ? require('./local.config.js') : require('./config.js');

const camaras = require('./lib/camaras.json')
const T = new Tweeter(config.twitterAPI);

const bot = (camera) => {

    const start = moment();

    let tweetText = 'Aquí tes ' + camera.nome;

    const date = new Date();
    let nImages = 240;

    const camaraFeed = new Feeder(camera, date, config.imagesPath + camera.id, nImages, config);
    let n = 0;
    function recursiveImage(n) {
        if (n < nImages) {
            setTimeout(function() {
                camaraFeed._getImage(n)
                .then( () => {
                    recursiveImage(n+1)
                })
            }, 15000);

        } else {

            video(config.imagesPath + camera.id + '/%d.jpg', path.join(__dirname, '/videos/'+camera.id+'.mp4'))
                .then( video  => {
                    camaraFeed.clean();
                    return T.tweetVideo(tweetText, video);
                })
                .then(id => process.stdout.write(id))
                .catch(error => {
                    process.stderr.write(error.message);
                });


        }
    }
    recursiveImage(n);

};

if (!fs.existsSync(config.imagesPath)) {
    fs.mkdirSync(config.imagesPath);
}


setInterval(function () {
  for (var i = camaras.length - 1; i >= 0; i--) {
    bot(camaras[i])
  }
}, 3 * 3600 * 1000); // horas * segundos * milisegundos

for (var i = camaras.length - 1; i >= 0; i--) {
  bot(camaras[i])
}