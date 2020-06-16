import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from "@nestjs/config";
import { MongooseModule, MongooseModuleOptions } from "@nestjs/mongoose";

const MONGOOSE_CONFIG: MongooseModuleOptions = {
    useCreateIndex: true
}

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.MONGODB_URI, MONGOOSE_CONFIG)
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
