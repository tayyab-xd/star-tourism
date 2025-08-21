import  connectToDB  from '@/lib/mongodb';
import User from '@/models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export async function POST(req) {
  try {
    await connectToDB();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return Response.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // For now just return user data (no JWT/session yet)
    const token = jwt.sign(
      { id: user._id,name:user.name, email: user.email , phone:user.phone , role:user.role },
      process.env.JWT_TOKEN
    );

    return Response.json({
        userId: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role:user.role,
        token
    }, { status: 200 });

  } catch (err) {
    console.error("Login error:", err);
    return Response.json({ message: "Login failed" }, { status: 500 });
  }
}
