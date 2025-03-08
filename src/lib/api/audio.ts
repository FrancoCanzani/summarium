'use server';

import fs from 'fs';
import path from 'path';

export async function deleteAudio(filename: string) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'audio', filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Successfully deleted ${filename} from public/audio`);
    } else {
      console.warn(`File ${filename} not found in public/audio`);
      return;
    }
  } catch (error) {
    console.error('Error deleting audio file:', error);
    throw new Error('Failed to delete audio file from local storage.');
  }
}
