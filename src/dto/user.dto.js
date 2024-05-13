class UserDTO {
  constructor(first_name, last_name, role, cart) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.role = role;
    this.full_name = `${first_name} ${last_name}`;
    this.cart = cart;
  }
}

module.exports = UserDTO;
