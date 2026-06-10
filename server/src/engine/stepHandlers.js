const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function asText(value) {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return '';
  return JSON.stringify(value);
}

export const stepHandlers = {
  async textTransform(input, config) {
    const operation = config.operation || 'uppercase';
    const text = asText(input);

    const outputByOperation = {
      uppercase: text.toUpperCase(),
      lowercase: text.toLowerCase(),
      trim: text.trim()
    };

    return {
      output: outputByOperation[operation] ?? text,
      message: `Applied ${operation} transform`
    };
  },

  async delay(input, config) {
    const requestedMs = Number(config.ms ?? 500);
    const ms = Math.min(Math.max(requestedMs, 0), 5000);
    await sleep(ms);

    return {
      output: input,
      message: `Waited ${ms}ms`
    };
  },

  async condition(input, config) {
    const text = asText(input);
    const operator = config.operator || 'contains';
    const compareValue = String(config.value ?? '');

    const checks = {
      contains: text.includes(compareValue),
      equals: text === compareValue,
      notEmpty: text.trim().length > 0
    };

    const passed = Boolean(checks[operator]);
    return {
      output: input,
      message: passed ? 'Condition passed' : 'Condition failed',
      shouldContinue: passed || config.continueOnFail === true
    };
  },

  async mockApiCall(input, config) {
    return {
      output: {
        previous: input,
        endpoint: config.endpoint || '/mock/customer-profile',
        method: config.method || 'GET',
        data: config.response || {
          id: 'mock-001',
          status: 'ok',
          receivedAt: new Date().toISOString()
        }
      },
      message: 'Mock API response generated'
    };
  },

  async finalOutput(input, config) {
    const prefix = config.prefix ? `${config.prefix}: ` : '';
    return {
      output: `${prefix}${asText(input)}`,
      message: 'Final output prepared'
    };
  }
};
