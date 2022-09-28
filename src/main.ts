import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const cors = require('cors');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cors());
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method',
    );
    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, PUT, DELETE',
    );
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
  });
  await app.listen(4468);
}
bootstrap();
