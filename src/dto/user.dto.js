class UserDTO {
  constructor(first_name, last_name, role) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.role = role;
    this.full_name = `${first_name} ${last_name}`;
  }
}

module.exports = UserDTO;
