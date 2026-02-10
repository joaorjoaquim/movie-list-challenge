export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Movie List Challenge API',
    version: '1.0.0',
    description: 'API for Golden Raspberry Awards producer analysis',
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local server',
    },
  ],
  paths: {
    '/api/producers/intervals': {
      get: {
        summary: 'Get producer award intervals (Golden Raspberry Awards)',
        description:
          'Retrieve the producers with the longest and shortest intervals between two consecutive awards',
        responses: {
          '200': {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    min: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/ProducerInterval',
                      },
                    },
                    max: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/ProducerInterval',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/health': {
      get: {
        summary: 'Health check',
        description: 'Check if the API is running',
        responses: {
          '200': {
            description: 'API is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'ok',
                    },
                    uptime: {
                      type: 'number',
                      example: 123.45,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      ProducerInterval: {
        type: 'object',
        properties: {
          producer: {
            type: 'string',
            example: 'Joel Silver',
          },
          interval: {
            type: 'integer',
            example: 1,
          },
          previousWin: {
            type: 'integer',
            example: 1990,
          },
          followingWin: {
            type: 'integer',
            example: 1991,
          },
        },
      },
    },
  },
};
