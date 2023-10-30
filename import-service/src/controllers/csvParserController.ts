import csvParser from 'csv-parser';

import ReadableStream = NodeJS.ReadableStream;

export const CSVParserController = {
  parse(stream: ReadableStream, onDataCb: (data: any) => void) {
    return new Promise((resolve, reject) => stream
      .pipe(csvParser())
      .on('data', async (data) => {
        await onDataCb(data);
        console.log('EVENT CSVParserController data\n' + JSON.stringify(data, null, 2));
      })
      .on('error', (error) => {
        console.log('EVENT CSVParserController error\n' + JSON.stringify({ error: error.message }, null, 2));
        reject(error)
      })
      .on('end', resolve)
    );
  }
}
