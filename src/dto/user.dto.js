class UserDTO {
  constructor(first_name, last_name, role, email, cart) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.role = role;
    this.email = email;
    this.full_name = `${first_name} ${last_name}`;
    this.cart = cart;
  }
}

const createUsersListDTO = (users) => {
  return {
    users: users.map(
      (user) =>
        new UserDTO(
          user.first_name,
          user.last_name,
          user.role,
          user.email,
          user.cart,
          user.full_name
        )
    ),
  };
};

module.exports = { createUsersListDTO, UserDTO };
