import { Transform } from 'class-transformer';

export const TransformDate = (format: 'date' | 'datetime') => {
  return Transform(({ value }) => {
    if (!value) {
      return null;
    }

    const date = new Date(value);

    if (format === 'date') {
      return date.toISOString().slice(0, 10);
    }

    return date.toISOString().replace('T', ' ').slice(0, 19);
  });
};
