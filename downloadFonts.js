const https = require('https');
const fs = require('fs');
const path = require('path');

const fonts = [
  {
    name: 'Poppins-Regular.ttf',
    url: 'https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Regular.ttf'
  },
  {
    name: 'Poppins-Medium.ttf',
    url: 'https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Medium.ttf'
  },
  {
    name: 'Poppins-Light.ttf',
    url: 'https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Light.ttf'
  },
  {
    name: 'Poppins-Bold.ttf',
    url: 'https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Bold.ttf'
  },
  {
    name: 'Poppins-SemiBold.ttf',
    url: 'https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-SemiBold.ttf'
  }
];

const downloadFont = (url, filename) => {
  const androidPath = path.join(__dirname, 'android/app/src/main/assets/fonts', filename);
  const srcPath = path.join(__dirname, 'src/assets/fonts', filename);

  const download = (filepath) => {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(filepath);
      https.get(url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      }).on('error', (err) => {
        fs.unlink(filepath);
        reject(err);
      });
    });
  };

  Promise.all([
    download(androidPath),
    download(srcPath)
  ]).then(() => {
    console.log(`Downloaded ${filename} successfully`);
  }).catch((err) => {
    console.error(`Error downloading ${filename}:`, err);
  });
};

fonts.forEach(font => {
  downloadFont(font.url, font.name);
}); 