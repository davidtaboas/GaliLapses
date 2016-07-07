'use strict';

const path = require('path');

module.exports = {
    twitterAPI: {
        consumer_key: '',
        consumer_secret: '',
        access_token: '',
        access_token_secret: ''
    },
    pathLoadImages: '/readImage.asp',
    imagesPath: path.join(__dirname, 'images/'),
    font: path.join(__dirname, 'font/OpenSans-ExtraBold.ttf')
};
