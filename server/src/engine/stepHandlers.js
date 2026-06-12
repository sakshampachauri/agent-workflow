const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function asText(value) {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return '';
  return JSON.stringify(value);
}

function asObject(value) {
  if (value && typeof value === 'object') return value;
  if (typeof value !== 'string') return {};

  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}

function getByPath(source, path) {
  if (!path) return source;
  return String(path)
    .split('.')
    .filter(Boolean)
    .reduce((current, segment) => {
      if (current === null || current === undefined) return undefined;
      return current[segment];
    }, source);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));
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

  async jsonExtract(input, config) {
    const source = asObject(input);
    const path = String(config.path || '');
    const extracted = getByPath(source, path);
    const fallback = config.defaultValue ?? null;

    return {
      output: extracted === undefined ? fallback : extracted,
      message: extracted === undefined ? `Path "${path}" not found; used default value` : `Extracted "${path}"`
    };
  },

  async dataValidation(input, config) {
    const path = String(config.path || '');
    const value = path ? getByPath(asObject(input), path) : input;
    const rule = config.rule || 'required';
    const expected = config.expected;

    const checks = {
      required: value !== undefined && value !== null && asText(value).trim().length > 0,
      email: isValidEmail(value),
      minLength: asText(value).length >= Number(expected || 0),
      maxLength: asText(value).length <= Number(expected || 0),
      equals: asText(value) === asText(expected),
      greaterThan: Number(value) > Number(expected),
      lessThan: Number(value) < Number(expected)
    };

    const passed = Boolean(checks[rule]);
    return {
      output: input,
      message: passed ? `Validation passed: ${rule}` : `Validation failed: ${rule}`,
      shouldContinue: passed || config.continueOnFail === true
    };
  },

  async webhook(input, config) {
    const url = String(config.url || '');
    if (!url) {
      throw new Error('Webhook URL is required');
    }

    const method = String(config.method || 'POST').toUpperCase();
    const timeoutMs = Math.min(Math.max(Number(config.timeoutMs || 5000), 1000), 15000);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: method === 'GET' ? undefined : JSON.stringify({ input }),
        signal: controller.signal
      });

      const contentType = response.headers.get('content-type') || '';
      const responseBody = contentType.includes('application/json') ? await response.json() : await response.text();

      if (!response.ok) {
        throw new Error(`Webhook failed with status ${response.status}`);
      }

      return {
        output: {
          status: response.status,
          body: responseBody
        },
        message: `Webhook ${method} completed`
      };
    } finally {
      clearTimeout(timeout);
    }
  },

  async finalOutput(input, config) {
    const prefix = config.prefix ? `${config.prefix}: ` : '';
    return {
      output: `${prefix}${asText(input)}`,
      message: 'Final output prepared'
    };
  }
};
