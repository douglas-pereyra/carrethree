// backend/data/users.js
const users = [
  {
    name: 'Douglas Admin',
    email: 'douglas@carrethree.br',
    password: 'adminpass', // A senha será criptografada ao ser importada
    isAdmin: true,
  },
  {
    name: 'Henrique Admin',
    email: 'henrique@carrethree.br',
    password: 'adminpass',
    isAdmin: true,
  },
  {
    name: 'Admin Exemplo',
    email: 'admin@example.com',
    password: 'adminpass',
    isAdmin: true,
  },
];

export default users;