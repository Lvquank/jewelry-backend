const mongoose = require("mongoose");
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const User = require('./src/models/UserModel');
const Order = require('./src/models/OrderProduct');
const Product = require('./src/models/ProductModel');

dotenv.config();

async function seedUserAndOrder() {
    try {
        await mongoose.connect(process.env.MongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB.');

        console.log('Generating users...');
        const usersToCreate = [
            {
                name: 'Jensy Admin',
                email: 'admin@jensy.vn',
                password: bcrypt.hashSync('123456', 10),
                isAdmin: true,
                phone: 982463691,
                address: '159 Lý Thường Kiệt, Hà Đông',
                city: 'Hà Nội'
            },
            {
                name: 'Khách Hàng A',
                email: 'khachhang1@gmail.com',
                password: bcrypt.hashSync('123456', 10),
                isAdmin: false,
                phone: 123456789,
                address: 'Quận 1',
                city: 'TP HCM'
            }
        ];

        let createdUsers = [];
        for (let u of usersToCreate) {
            let existingUser = await User.findOne({ email: u.email });
            if (!existingUser) {
                existingUser = await User.create(u);
                console.log(`+ Created user: ${u.email}`);
            } else {
                console.log(`- User exists: ${u.email}`);
            }
            createdUsers.push(existingUser);
        }

        console.log('Generating orders based on existing products...');
        const products = await Product.find().limit(2);
        
        if (products.length > 0 && createdUsers.length > 1) {
            const customer = createdUsers[1];
            const orderData = {
                orderItems: [
                    {
                        name: products[0].name,
                        amount: 1,
                        image: products[0].image,
                        price: products[0].price,
                        discount: products[0].discount || 0,
                        product: products[0]._id
                    }
                ],
                shippingAddress: {
                    fullName: customer.name,
                    address: customer.address,
                    city: customer.city,
                    phone: customer.phone
                },
                paymentMethod: 'COD',
                itemsPrice: products[0].price,
                shippingPrice: 30000,
                totalPrice: products[0].price + 30000,
                user: customer._id,
                isPaid: false,
                isDelivered: false
            };

            const existingOrder = await Order.findOne({ user: customer._id });
            if (!existingOrder) {
                await Order.create(orderData);
                console.log('+ Created 1 mock order for Khách Hàng A');
            } else {
                console.log('- Mock order already exists for this user.');
            }
        } else {
            console.log('Note: Not enough products or users to create an order.');
        }

        console.log('User and Order seeding complete!');
        process.exit(0);
    } catch (e) {
        console.error('Error seeding data:', e);
        process.exit(1);
    }
}

seedUserAndOrder();
