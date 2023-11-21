const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const hashPassword = bcrypt.hashSync("123456", 10);
const adminHasPassword = bcrypt.hashSync("Badass1234", 10);

const userData = [
  {
    username: "admin",
    isAdmin: true,
    password: adminHasPassword,
    address: "abcdefg",
    email: "admin@email.com",
    phone_No: "087654321",
  },
  {
    username: "Andy",
    password: hashPassword,
    phone_No: "0987654321",
    address: "abcdefg",
    email: "andy@email.com",
  },
  {
    username: "Bobby",
    password: hashPassword,
    phone_No: "0123456789",
    address: "abcdefg",
    email: "bobby@email.com",
  },
  {
    username: "Candy",
    password: hashPassword,
    phone_No: "0234567891",
    address: "abcdefg",
    email: "candy@email.com",
  },
  {
    username: "Danny",
    password: hashPassword,
    phone_No: "0678543291",
    address: "abcdefg",
    email: "danny@email.com",
  },
];

console.log("Seed...");

prisma.user.createMany({ data: userData }).then(console.log);
