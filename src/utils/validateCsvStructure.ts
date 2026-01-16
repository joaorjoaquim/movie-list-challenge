import { readFileSync } from 'fs';
import { join } from 'path';

const EXPECTED_HEADER = 'year;title;studios;producers;winner';
const EXPECTED_COLUMNS = ['year', 'title', 'studios', 'producers', 'winner'];
const EXPECTED_COLUMN_COUNT = 5;

export interface CsvValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateCsvStructure(): CsvValidationResult {
  const errors: string[] = [];
  const csvPath = join(process.cwd(), 'movielist.csv');

  try {
    const csvContent = readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').filter((line) => line.trim());

    if (lines.length === 0) {
      errors.push('CSV file is empty');
      return { isValid: false, errors };
    }

    const header = lines[0].trim();
    
    if (header !== EXPECTED_HEADER) {
      errors.push(`Invalid header. Expected: "${EXPECTED_HEADER}", got: "${header}"`);
    }

    const headerColumns = header.split(';');
    
    if (headerColumns.length !== EXPECTED_COLUMN_COUNT) {
      errors.push(`Invalid column count. Expected: ${EXPECTED_COLUMN_COUNT}, got: ${headerColumns.length}`);
    }

    for (let i = 0; i < EXPECTED_COLUMNS.length; i++) {
      if (headerColumns[i] !== EXPECTED_COLUMNS[i]) {
        errors.push(`Column ${i + 1} mismatch. Expected: "${EXPECTED_COLUMNS[i]}", got: "${headerColumns[i]}"`);
      }
    }

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const columns = line.split(';');
      
      if (columns.length !== EXPECTED_COLUMN_COUNT) {
        errors.push(`Line ${i + 1}: Invalid column count. Expected: ${EXPECTED_COLUMN_COUNT}, got: ${columns.length}`);
        continue;
      }

      const [year, title, , , winner] = columns;

      if (!year || !title) {
        errors.push(`Line ${i + 1}: Missing required fields (year or title)`);
        continue;
      }

      const yearNum = parseInt(year, 10);
      if (isNaN(yearNum) || yearNum <= 0) {
        errors.push(`Line ${i + 1}: Invalid year format. Expected positive integer, got: "${year}"`);
      }

      if (winner && winner.trim() !== '' && winner.trim().toLowerCase() !== 'yes') {
        const winnerLower = winner.trim().toLowerCase();
        if (winnerLower !== 'no' && winnerLower !== '') {
          errors.push(`Line ${i + 1}: Invalid winner value. Expected "yes", "no" or empty, got: "${winner}"`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  } catch (error) {
    errors.push(`Failed to read CSV file: ${error instanceof Error ? error.message : String(error)}`);
    return { isValid: false, errors };
  }
}
