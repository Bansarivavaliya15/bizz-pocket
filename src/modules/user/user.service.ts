import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/schema/user.schema';
import { Verification } from 'src/schema/verification.schema';
import * as moment from 'moment-timezone';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';
import { LoginUserInput, VerifyUserInput, ResendOtpInput } from 'src/dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Verification.name) private readonly verificationModel: Model<Verification>,

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
      .get(url, {
        params: queryObj,
      })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  }

  async userLogin(loginUserInput: LoginUserInput) {
    const { mobileNo, areaCode, signature } = loginUserInput;
    let user = await this.userModel.findOne({
      mobileNo: mobileNo,
      isDeleted: false,
    });
    if (!user) {
      console.log("======================>");
      user = await new this.userModel({ mobileNo }).save()
    }
    const verificationData = await this.verificationModel.findOne({
      user: { _id: user._id },
    });
    if (verificationData) {
      await this.verificationModel.deleteOne({
        user: { _id: user._id },
      });
    }
    let otp = 123456
    if (process.env.NODE_ENV === 'production') {
      otp = Math.floor(100000 + Math.random() * 900000);
      await this.sendSms(mobileNo, otp, areaCode, signature);
    }
    await new this.verificationModel({ otp, user }).save();

    return { id: user._id, message: 'Otp sent in your mobile successfully.' };
  }


  async verifyUser(verifyUserInput: VerifyUserInput) {
    const { id, otp } = verifyUserInput;
    let user = await this.userModel.findOne({
      _id: id
    });
    if (!user) {
      throw new Error('User not exist by this id.');
    }
    const userVerification = await this.verificationModel.findOne({
      user: {
        _id: id,
      },
    });
    if (!userVerification || userVerification.otp !== Number(otp)) {
      throw new Error('Invalid OTP!!');
    }
    const createdAtDate = moment(userVerification.createdAt).add(1, 'm');
    if (createdAtDate.isBefore(moment(new Date()).utc())) {
      throw new Error('OTP is expired.');
    }
    await this.verificationModel.deleteOne({ user: { _id: id } });
    user.isVerified = true;

    const token = jwt.sign(
      {
        userId: id,
        mobileNo: user.mobileNo,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRATION_TIME },
    );
    return { token: token, user: user };
  }

  async resendOtp(resendOtpInput: ResendOtpInput) {
    const { areaCode, mobileNo, signature } = resendOtpInput;
    const user = await this.userModel.findOne({
      mobileNo: mobileNo,
      isDeleted: false,
    });
    if (!user) {
      throw new Error('User not exist by this id.');
    }
    await this.verificationModel.deleteOne({ user: { _id: user._id } });
    let otp = 123456

    if (process.env.NODE_ENV === 'production') {
      otp = Math.floor(100000 + Math.random() * 900000);
      await this.sendSms(mobileNo, otp, areaCode, signature);
    }
    const userVerification: Verification = new this.verificationModel();
    userVerification.otp = otp;
    userVerification.user = user;
    await new this.verificationModel(userVerification).save();

    return { message: 'Otp resend successfully' };
  }


}
