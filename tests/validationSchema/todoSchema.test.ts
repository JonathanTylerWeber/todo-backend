// tests/validationSchema/todoSchema.test.ts

import todoSchema from '../../src/validationSchema/todoSchema';

describe('Todo Schema Validation', () => {
  it('should validate a valid todo input with title and description', () => {
    const result = todoSchema.parse({
      title: 'Test Todo',
      description: 'This is a test description',
    });
    expect(result).toEqual({
      title: 'Test Todo',
      description: 'This is a test description',
    });
  });

  it('should throw an error when title is missing', () => {
    expect(() => {
      todoSchema.parse({
        description: 'This is a test description',
      });
    }).toThrow('Title is required');
  });

  it('should throw an error when title is empty', () => {
    expect(() => {
      todoSchema.parse({
        title: '',
        description: 'This is a test description',
      });
    }).toThrow('Title is required');
  });

  it('should throw an error when title is not a string', () => {
    expect(() => {
      todoSchema.parse({
        title: 123,
        description: 'This is a test description',
      });
    }).toThrow('Title must be a string');
  });

  it('should throw an error when description is missing', () => {
    expect(() => {
      todoSchema.parse({
        title: 'Test Todo',
      });
    }).toThrow('Description is required');
  });

  it('should throw an error when description is empty', () => {
    expect(() => {
      todoSchema.parse({
        title: 'Test Todo',
        description: '',
      });
    }).toThrow('Description is required');
  });

  it('should throw an error when description is not a string', () => {
    expect(() => {
      todoSchema.parse({
        title: 'Test Todo',
        description: 123,
      });
    }).toThrow('Description must be a string');
  });

  it('should allow additional fields (they will be ignored)', () => {
    const result = todoSchema.parse({
      title: 'Test Todo',
      description: 'This is a test description',
      extraField: 'Extra data',
    });
    expect(result).toEqual({
      title: 'Test Todo',
      description: 'This is a test description',
    });
  });

  it('should throw an error when title is undefined', () => {
    expect(() => {
      todoSchema.parse({
        title: undefined,
        description: 'This is a test description',
      });
    }).toThrow('Title is required');
  });

  it('should throw an error when description is null', () => {
    expect(() => {
      todoSchema.parse({
        title: 'Test Todo',
        description: null,
      });
    }).toThrow('Description must be a string');
  });
});
