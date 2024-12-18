import { Request, Response } from 'express';
import db from '../config/prisma';

export const createProduct = async (req: Request, res: Response) => {
  const product = await db.product.create({
    data: {
      ...req.body,
      tags: req.body.tags.join(','),
    },
  });
  res.status(201).json(product);
};
