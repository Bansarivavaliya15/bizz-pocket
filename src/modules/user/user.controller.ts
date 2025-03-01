import { Controller, Post, Body, Request, BadRequestException, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUserInput, VerifyUserInput, ResendOtpInput, UpdateUser } from 'src/dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('login')
  async userLogin(@Body() loginUserInput: LoginUserInput) {
    try {
      return await this.userService.userLogin(loginUserInput);
    } catch (error) {
      console.log('login-error=======>:', error);
      throw new BadRequestException(error.message);
    }
  }


  @Post('verifyUser')
  async verifyUser(@Body() verifyUserInput: VerifyUserInput) {
    try {
      return await this.userService.verifyUser(verifyUserInput);
    } catch (error) {
      console.log('verifyUser-error=======>:', error);
      throw new BadRequestException(error.message);
    }
  }

  @Post('resendOtp')
  async resendOtp(@Body() resendOtpInput: ResendOtpInput) {
    try {
      return await this.userService.resendOtp(resendOtpInput);
    } catch (error) {
      console.log('resendOtp-error=======>:', error);
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() updateUser: UpdateUser) {
    try {
      return await this.userService.updateUser(id, updateUser);
    } catch (error) {
      console.log('resendOtp-error=======>:', error);
      throw new BadRequestException(error.message);
    }
  }

}
