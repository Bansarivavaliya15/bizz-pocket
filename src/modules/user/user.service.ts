import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment-timezone';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';
import { LoginUserInput, VerifyUserInput, ResendOtpInput, UpdateUser } from 'src/dto/user.dto';
import { User } from 'src/entites/user.entity';
import { Verification } from 'src/entites/verification.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Verification)
    private readonly verificationRepository: Repository<Verification>,
  ) { }

  async sendSms(mobileNo: string, otp: number, areaCode: string, signature: string) {
    const queryObj = {
      APIkey: process.env.SMS_API_KEY,
      SenderID: process.env.SMS_SENDER_ID,
      Mobile: mobileNo.startsWith(areaCode) ? mobileNo : areaCode + mobileNo,
      MsgText: `Your login OTP is ${otp}. Please enter this code to proceed with your login. Thank you. LUBI.${signature} `,
      EntityID: process.env.SMS_ENTITY_ID,
      TemplateID: process.env.SMS_TEMPLATE_ID,
    };
    const url = 'https://ui.netsms.co.in/API/SendSMS.aspx';
    await axios
      .get(url, { params: queryObj })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  }

  async userLogin(loginUserInput: LoginUserInput) {
    const { mobileNo, areaCode, signature, deviceToken } = loginUserInput;
    let user = await this.userRepository.findOne({ where: { mobileNo, isDeleted: false } });
    if (!user) {
      user = await this.userRepository.save(this.userRepository.create({ mobileNo, deviceToken }));
    }

    const verificationData = await this.verificationRepository.findOne({ where: { user: { id: user.id } } });
    if (verificationData) {
      await this.verificationRepository.remove(verificationData);
    }

    let otp = 123456;
    if (process.env.NODE_ENV === 'production') {
      otp = Math.floor(100000 + Math.random() * 900000);
      await this.sendSms(mobileNo, otp, areaCode, signature);
    }

    const verification = this.verificationRepository.create({ otp, user });
    await this.verificationRepository.save(verification);

    return { id: user.id, message: 'Otp sent to your mobile successfully.' };
  }

  async verifyUser(verifyUserInput: VerifyUserInput) {
    const { id, otp, deviceToken } = verifyUserInput;
    let user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) throw new NotFoundException('User does not exist with this ID.');

    if (user.deviceToken !== deviceToken) {
      throw new BadRequestException('You cannot log in from another device.');
    }

    const userVerification = await this.verificationRepository.findOne({ where: { user: { id } } });
    if (!userVerification || userVerification.otp !== Number(otp)) {
      throw new BadRequestException('Invalid OTP!');
    }

    const createdAtDate = moment(userVerification.createdAt).add(1, 'm');
    if (createdAtDate.isBefore(moment(new Date()).utc())) {
      throw new BadRequestException('OTP is expired.');
    }

    await this.verificationRepository.remove(userVerification);
    user.isVerified = true;
    await this.userRepository.save(user);

    const token = jwt.sign(
      { userId: id, user, deviceToken },
      process.env.JWT_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRATION_TIME },
    );
    return { token, user };
  }

  async resendOtp(resendOtpInput: ResendOtpInput) {
    const { areaCode, mobileNo, signature } = resendOtpInput;
    const user = await this.userRepository.findOne({ where: { mobileNo, isDeleted: false } });
    if (!user) {
      throw new NotFoundException('User does not exist with this mobile number.');
    }

    await this.verificationRepository.delete({ user: { id: user.id } });

    let otp = 123456;
    if (process.env.NODE_ENV === 'production') {
      otp = Math.floor(100000 + Math.random() * 900000);
      await this.sendSms(mobileNo, otp, areaCode, signature);
    }

    const verification = this.verificationRepository.create({ otp, user });
    await this.verificationRepository.save(verification);

    return { message: 'OTP resent successfully.' };
  }

  uploadDocument(req, files): string[] {
    const baseURL = process.env.BASE_URL || req.protocol + '://' + req.get('host');
    return files.map((file) => (baseURL + '/' + file.filename));
  }

  async updateUser(req, id: string, file, updateUser: UpdateUser) {
    const user = await this.userRepository.findOne({ where: { id, isDeleted: false } });
    if (!user) throw new NotFoundException("User not found");

    const updateFields: Partial<User> = {
      email: updateUser.email ?? user.email,
      language: updateUser.language ?? user.language,
      type: updateUser.type ?? user.type,
      userName: updateUser.userName ?? user.userName,
      name: updateUser.name ?? user.name,
      tableSize: updateUser.tableSize ?? user.tableSize,
    };

    if (file) {
      const baseURL = process.env.BASE_URL || req.protocol + '://' + req.get('host');
      updateFields.profile = baseURL + '/' + file.filename;
    }

    await this.userRepository.update(id, updateFields);
    return await this.userRepository.findOne({
      where: { id },
    });
  }
}
