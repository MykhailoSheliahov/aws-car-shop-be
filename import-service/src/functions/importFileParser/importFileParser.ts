
import { S3CreateEvent } from 'aws-lambda';
import path from 'path';
import * as dotenv from 'dotenv';

import { s3Controller } from '../../controllers/s3Controller';
import { CSVParserController } from '../../controllers/csvParserController';
import { HEADERS } from './../../constants';

dotenv.config({ path: path.join(__dirname, './../../../', '.env') });

export const handler = async (event: S3CreateEvent) => {
  try {
    console.log("EVENT importFileParser params\n" + JSON.stringify(event, null, 2));

    await Promise.all(event.Records.map(async (record) => {
      const { object: { key } } = record.s3;

      await CSVParserController.parse(s3Controller.getReadableStream(key));
      await s3Controller.moveObject(key);
    }))

    return {
      statusCode: 200,
      headers: HEADERS,
      body: JSON.stringify({ ok: true }, null, 2),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }, null, 2),
    }
  }
};
