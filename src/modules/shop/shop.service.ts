import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'enum';
import { CreateShopInput } from 'src/dto/shop.dto';
import { Shop } from 'src/entites/shop.entity';
import { User } from 'src/entites/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ShopService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Shop)
        private readonly shopRepository: Repository<Shop>,

    ) { }
    async createShop(createShopOwnerInput: CreateShopInput) {
        const { mobileNo, email, name, shopName, isLoginEnable, password } = createShopOwnerInput

        const existingUser = await this.userRepository.findOne({
            where: { mobileNo, isDeleted: false },
        });

        if (existingUser) {
            throw new BadRequestException('User with this mobile number already exists');
        }

        const user = this.userRepository.create({
            mobileNo: mobileNo,
            name: name ?? null,
            email: email ?? null,
            isLoginEnable: isLoginEnable ?? false,
            password: password ?? null,
            role: Role.SHOP_OWNER
        });

        await this.userRepository.save(user)
        const shop = this.shopRepository.create({
            name: shopName ?? null,
            userId: user.id
        });
        return this.shopRepository.save(shop)
    }

}
