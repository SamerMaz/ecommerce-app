import { Request, Response } from 'express';
import { AddressSchema } from '../schema/users';
import db from '../config/prisma';
import { isPrismaError } from '../utils/prismaError';
import { NotFoundException } from '../exceptions/not-found';
import { ErrorCode } from '../exceptions/root';

export const addAddress = async (req: Request, res: Response) => {
  AddressSchema.parse(req.body);
  try {
    const address = await db.address.create({
      data: {
        ...req.body,
        userId: req?.user?.id,
      },
    });

    res.statusMessage = 'address successfuly added';
    res.status(201).json(address);
  } catch (error) {
    if (isPrismaError(error))
      if (error.code === 'P2002') {
        // Unique constraint violation
        res.status(400).json({ message: 'Address already exists' });
      } else {
        res.status(500).json({ message: 'Something went wrong' });
      }
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    await db.address.delete({
      where: {
        id: +req.params.id,
      },
    });
    res.json({ success: true });
  } catch (error: unknown) {
    throw new NotFoundException('Address not found', ErrorCode.ADDRESS_NOT_FOUND);
  }
};

export const listAddress = async (req: Request, res: Response) => {
  const addresses = await db.address.findMany({
    where: {
      userId: req?.user?.id,
    },
  });
  res.json(addresses);
};
