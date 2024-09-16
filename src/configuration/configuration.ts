import { time } from "console";

export default () => ({
  database: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
  },
  elastic: {
    node: process.env.ELASTIC_NODE || 'default_node_url',
    user: process.env.ELASTIC_USER || 'default_user',
    password: process.env.ELASTIC_PASSWORD || 'default_password',
    index: process.env.ELASTIC_INDEX || 'default_index',
    exceptionIndex: process.env.ELASTIC_EXCEPTION_INDEX || 'exception_logs',
  },
  timeZone:{
    timezone: process.env.TIMEZONE
  }
});
