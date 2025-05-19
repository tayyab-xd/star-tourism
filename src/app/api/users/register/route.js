import connectToDB from '@/lib/mongodb';
import User from '@/models/userModel';
import bcrypt from 'bcrypt';

export async function POST(req) {
    try {
        await connectToDB();
        const { name, email, password, phone } = await req.json();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return Response.json({ message: "Email already registered" }, { status: 400 });
        }

        const hashed = await bcrypt.hash(password, 10)

        const user = await User.create({ name, phone, email, password: hashed });

        return Response.json({ message: "User registered successfully" }, { status: 201 });
    } catch (err) {
        console.error("Register error:", err);
        return Response.json({ message: "Registration failed" }, { status: 500 });
    }
}
