import  connectToDB  from '@/lib/mongodb';
import User from '@/models/userModel';

export async function GET(req,  {params} ) {
  try {
    await connectToDB();

    const {id} =await params;
    const user = await User.findById(id).select('-password -__v -createdAt');
    if (!user) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }

    return Response.json(user, { status: 200 });

  } catch (err) {
    console.error('Error fetching user:', err);
    return Response.json({ message: 'Failed to fetch user' }, { status: 500 });
  }
}
