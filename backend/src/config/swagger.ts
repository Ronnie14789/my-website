import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ecatu Ronald Portfolio API',
      version: '1.0.0',
      description:
        'RESTful API for the Ecatu Ronald professional portfolio website. Handles contact form submissions, projects, blog posts, testimonials, and newsletter subscriptions.',
      contact: {
        name: 'Ecatu Ronald',
        email: 'ronaldecatu@gmail.com',
      },
    },
    servers: [
      { url: '/api', description: 'Current server' },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
    tags: [
      { name: 'Contact', description: 'Contact form submissions' },
      { name: 'Projects', description: 'Portfolio projects' },
      { name: 'Blog', description: 'Blog posts' },
      { name: 'Testimonials', description: 'Client testimonials' },
      { name: 'Newsletter', description: 'Newsletter subscriptions' },
      { name: 'Health', description: 'API health check' },
    ],
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
