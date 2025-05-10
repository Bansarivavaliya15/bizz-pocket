import { BadRequestException, Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ShopService } from './shop.service';
import { CreateShopInput } from 'src/dto/shop.dto';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Role } from 'enum';
import { Roles } from 'src/common/decorator/role.decorator';
import { AuthGuard } from 'src/common/guards/auth.gurad';

@UseGuards(AuthGuard, RolesGuard)
@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) { }

  @Post('create')
  @Roles(Role.SUPER_ADMIN)
  async createShop(@Body() createShopInput: CreateShopInput) {
    try {
      return this.shopService.createShop(createShopInput);
    } catch (error) {
      console.log('createShop-errror=======>:', error);
      throw new BadRequestException(error.message);
    }
  }

}
