export default {
  port: 3000,
  mongodb: 'mongodb://note-test:test@39.106.106.48/note-test',
  mongooseReconnectMs: 1000,
  mongooseDebug: false,
  email: {
    host: 'smtp.mxhichina.com',
    port: 465,
    secure: true,
    auth: {
      user: 'api@hengkx.com',
      pass: 'Test123456'
    },
    from: '云笔记<api@hengkx.com>'
  },
  ui: 'http://localhost:3000',
  api: 'http://localhost:3000',
}
