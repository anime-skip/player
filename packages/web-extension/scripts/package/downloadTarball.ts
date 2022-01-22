import axios from 'axios';
import { createWriteStream } from 'fs';
import stream from 'stream';
import { promisify } from 'util';

const finished = promisify(stream.finished);

export async function downloadTarball(url: string, outputPath: string) {
  const writer = createWriteStream(outputPath);
  const response = await axios.get(url, {
    responseType: 'stream',
    headers: { Authorization: `token ${process.env.NODE_AUTH_TOKEN}` },
  });
  response.data.pipe(writer);
  return await finished(writer);
}
