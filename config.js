module.exports = {
  port: process.env.PORT || 3000,
  jwtOptions: {
    secret: process.env.SECRET,
  },
};
