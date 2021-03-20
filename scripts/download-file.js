const { createWriteStream } = require('fs');

const axios = require('axios').default;
const { promisify } = require('util');
const stream = require('stream');

const finished = promisify(stream.finished);

module.exports = {
  async downloadTarball(url, outputPath) {
    const writer = createWriteStream(outputPath);
    const response = await axios.get(url, {
      responseType: 'stream',
      headers: { Authorization: `token ${process.env.NODE_AUTH_TOKEN}` },
    });
    response.data.pipe(writer);
    return await finished(writer);
  },
};
