import { parse } from 'csv-parse';
import fs from 'node:fs';

const CSV_FILE_PATH = new URL('./tasks.csv', import.meta.url);
const SERVER_URL = 'http://localhost:4000/tasks';

async function readAndUploadCSV() {
  try {
    const csvStream = fs.createReadStream(CSV_FILE_PATH, { encoding: 'utf8' });

    const csvParser = parse({
      delimiter: ';',
      skipEmptyLines: true,
      fromLine: 2
    });

    const linesParse = csvStream.pipe(csvParser);

    for await (const line of linesParse) {
      const [title, description] = line;

      await postDataToServer({ title, description });
    }

    console.log('CSV upload completed.');
  } catch (error) {
    console.error('Error:', error);
  }
}

async function postDataToServer(data) {
  try {
    await fetch(SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('Data uploaded successfully.');
  } catch (error) {
    console.error('Error posting data:', error);
  }
}

readAndUploadCSV();
