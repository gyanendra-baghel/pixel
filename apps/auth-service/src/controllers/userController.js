import { prisma } from "../config/prisma.js";


export const getUser = async (req, res) => {
  const email = req.query.email;
  if (!email) {
    throw new Error("email required");
  }
  const userData = await prisma.user.findUnique({
    where: { email: email },
    select: { id: true, name: true, email: true, role: true }
  });

  if (!userData) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(userData);
}

export const getBulkUser = async (req, res) => {
  const emails = req.body.emails;
  if (!emails || !Array.isArray(emails)) {
    return res.status(400).json({ message: 'emails must be an array' });
  }

  const users = await prisma.user.findMany({
    where: {
      email: {
        in: emails,
      },
    },
    select: { id: true, name: true, email: true, role: true }
  });

  const foundEmails = users.map((u) => u.email);
  const missingEmails = emails.filter((email) => !foundEmails.includes(email));

  res.status(200).json({
    success: true,
    foundUsers: users,
    missingEmails
  });
}
