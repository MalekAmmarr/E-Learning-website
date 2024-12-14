"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const mongoose_1 = require("mongoose");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    await app.listen(process.env.PORT ?? 3000);
    mongoose_1.default.connection.on('connected', () => {
        console.log('MongoDB connected');
    });
    mongoose_1.default.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
    });
    mongoose_1.default.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
    });
}
bootstrap();
//# sourceMappingURL=main.js.map