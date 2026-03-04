import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { SalesModule } from './modules/sales/sales.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { ReturnsModule } from './modules/returns/returns.module';
import { ParametersModule } from './modules/parameters/parameters.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ProductsModule,
    SalesModule,
    InventoryModule,
    ReturnsModule,
    ParametersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
