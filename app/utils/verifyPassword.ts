import bcrypt from "bcrypt";
import User from "~/models/User";

const verifyPassword = async (username: string, pass: string) => {
  //Find user by "username"
  const user = await User.findOne({ name: username });

  if (!user || !user.password) {
    return false;
  }

  const isPassCorrect = await bcrypt.compare(pass, user.password);

  if (!isPassCorrect) {
    return false;
  }

  return true;
};

export default verifyPassword;
