import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { Env } from './env'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
  })
  const configService = app.get<ConfigService<Env, true>>(ConfigService)
  const port = configService.get('PORT', 3333, { infer: true })

  await app.listen(process.env.PORT ?? port)
}
bootstrap()
