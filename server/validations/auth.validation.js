const { z } = require('zod');

const register = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').toLowerCase(),
    branch: z.string().min(2, 'Branch is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

const login = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required').toLowerCase(),
    password: z.string().min(1, 'Password is required'),
  }),
});

module.exports = {
  register,
  login,
};
