'use strict';

const fs = require('fs');
const path = require('path');

const request = require('request');
const moment = require('moment');
const rimraf = require('rimraf');
const editor = require('./editor');
const sleep = require('sleep');

class Feeder {
    constructor(camara, timestamp, outputFolder, number, config) {

        this.outputFolder = outputFolder;
        this.camara = camara;
        this.timestamp = timestamp;
        //sorry
        if (!fs.existsSync(this.outputFolder)) {
            fs.mkdirSync(this.outputFolder);
        }
        this.number = number || 100;
        this.config = config;
    }


    getSeries() {

        const promises = [];


        let n = this.number;


        promises.push(this._getImage(moment().unix()));




        return new Promise((resolve, reject) => {
            Promise.all(promises)
                .then((files) => {
                    const images = [];

                    for (let fileName of files) {
                        images.push(fileName);
                    }

                    return resolve(images);
                })
                .catch((error) => {
                    return reject(error);
                });

        });
    }

    clean() {
        return rimraf.sync(this.outputFolder);
    }

    _getImage(number) {
        return new Promise((resolve, reject) => {
            request
                .get(this.camara.acceso + this.config.pathLoadImages)
                .on('response', function (response){
                    // console.log(response) // 200

                })
                .pipe(fs.createWriteStream(path.join(this.outputFolder, number + '.jpg')))
                .on('close', () => {
                    return resolve(path.join(this.outputFolder, number + '.jpg'));
                });

            // request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
    }

}


module.exports = Feeder;