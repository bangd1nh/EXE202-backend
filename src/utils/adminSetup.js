import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import bcrypt from 'bcrypt';

export const createAdminAccount = async () => {
  try {
    const admin = await User.findOne({ Role: 'ADMIN' });

    if (!admin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);

      const newAdmin = new User({
        Avatar: '"http://res.cloudinary.com/dprrvtlt6/image/upload/v1748964250/user_profiles/yybon3vslcpqhpoc2nqc.webp"',
        Email: 'admin123@gmail.com',
        FirstName: 'Admin',
        LastName: 'User',
        Username: 'admin',
        Password: hashedPassword,
        PhoneNumber: '0123456789',
        Role: 'ADMIN',
        CreateAt: new Date(),
        verify: true,
      });

      await newAdmin.save();
      console.log('Tài khoản admin đã được tạo!');

      // tạo ví cho admin sau khi tạo tài khoản
      const newWallet = new Wallet({
        UserId: newAdmin._id,   
        Balance: 0,           
        Transactions: [],
      });

      await newWallet.save();
      console.log('Ví admin đã được tạo!');
    } 
  } catch (error) {
    console.error('Lỗi khi tạo tài khoản admin:', error);
  }
};
