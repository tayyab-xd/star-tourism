import connectToDB from "@/lib/mongodb";
import applicationModel from "@/models/applicationModel";
import jwt from 'jsonwebtoken';

export async function GET(req) {
    await connectToDB()
    const token = req.headers.get('authorization').split(' ')[1];
    const userData = jwt.verify(token, process.env.JWT_TOKEN);
    if (userData.role !== 'admin') {
      return NextResponse.json({ error: 'Only Admins allowed' }, { status: 500 });
    }
    const applications=await applicationModel.find()
    return Response.json({applications},{status:200}) 
}
