import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from 'app'

import { log } from 'shared/utils'

const appConfig = new DocumentBuilder()
  .setDescription('Documentation')
  .setVersion('1.0.0')
  .addBearerAuth()
  .setTitle('API')
  .build()

const server = async (): Promise<void> => {
  const PORT = process.env.PORT ?? 5000
  const app = await NestFactory.create(AppModule, {
    cors: true,
  })

  const documentation = SwaggerModule.createDocument(app, appConfig)

  SwaggerModule.setup('/docs', app, documentation)

  await app.listen(PORT, () => log(`Server started on port = ${PORT}`))
}

server()
