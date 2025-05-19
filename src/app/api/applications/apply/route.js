import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import   connectToDB from '@/lib/mongodb'; // Adjust path
import applicationModel from '@/models/applicationModel'; // Adjust path
import { sendEmail } from '@/lib/sendEmail'; // Adjust path

export async function POST(req) {
  try {
    await connectToDB();
    const body = await req.json();
    const { destination, persons, days, message, tripType,fullName,email,phone,tripName,type } = body;

    const authHeader = req.headers.get('authorization');
    const token = authHeader.split(" ")[1];
    let userData;

    try {
      userData = jwt.verify(token, process.env.JWT_TOKEN);
    } catch (jwtErr) {
      return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 401 });
    }
    
    if (type==='Existing') {
      await applicationModel.create({
      fullName:userData.name,
      email:userData.email,
      phone:userData.phone,
      tripName,
      type
    });
    } else {
      await applicationModel.create({
      destination,
      persons,
      days,
      message,
      tripType,
      fullName,
      email,
      phone,
      type
    });
    }

    let html
    if (type==='Existing') {
      html=`
          <h2>${type} Trip Application</h2>
          <p><strong>Full Name:</strong> ${userData.name}</p>
          <p><strong>Email:</strong> ${userData.email}</p>
          <p><strong>Phone Number:</strong> ${userData.phone}</p>
          <p><strong>Trip Name:</strong> ${tripName}</p>
        `
    } else {
      html=`
          <h2>${type} Trip Application</h2>
          <p><strong>Full Name:</strong> ${userData.name}</p>
          <p><strong>Email:</strong> ${userData.email}</p>
          <p><strong>Phone Number:</strong> ${userData.phone}</p>
          <p><strong>Trip Destination:</strong> ${destination}</p>
          <p><strong>Persons:</strong> ${persons}</p>
          <p><strong>Trip type:</strong> ${tripType}</p>
          <p><strong>Days:</strong> ${days}</p>
          <p><strong>Message:</strong> ${message}</p>
        `
    }
    try {
      await sendEmail({
        subject: `${type} Trip Application`,
        html: html
      });
    } catch (emailErr) {
      console.error('Email sending error:', emailErr.message);
      return NextResponse.json({ error: 'Application saved, but failed to send confirmation email.' }, { status: 500 });
    }
    return NextResponse.json({ message: 'Application submitted and email sent successfully.' }, { status: 200 });

  } catch (err) {
    console.error('Server error:', err.message);
    return NextResponse.json({ error: 'Internal server error. Please try again later.' }, { status: 500 });
  }
}
