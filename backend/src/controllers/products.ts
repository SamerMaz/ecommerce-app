import { Request, Response } from 'express';
import db from '../config/prisma';
import { NotFoundException } from '../exceptions/not-found';
import { ErrorCode } from '../exceptions/root';

export const createProduct = async (req: Request, res: Response) => {
  const product = await db.product.create({
    data: {
      ...req.body,
    },
  });
  res.status(201).json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = req.body;
    const updateProduct = await db.product.update({
      where: {
        id: req.params.id,
      },
      data: product,
    });
    res.statusMessage = 'Product updated successfully';
    res.status(200).json(updateProduct);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    throw new NotFoundException(`Product not found`, ErrorCode.PRODUCT_NOT_FOUND);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productID = req.params.id;
    const deletedProduct = await db.product.delete({
      where: {
        id: productID,
      },
    });
    res.status(200).json({
      message: 'Product deleted successfully',
      product: deletedProduct,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      throw new NotFoundException(`Product with ID ${req.params.id} not found`, ErrorCode.PRODUCT_NOT_FOUND);
    }
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Failed to delete product', error });
  }
};

export const listProducts = async (req: Request, res: Response) => {
  const skip = Number(req.query.skip) || 0;
  const take = Number(req.query.take) || 0;

  const [count, products] = await Promise.all([
    db.product.count(),
    db.product.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  res.json({
    count,
    products,
    page: Math.ceil(skip / take) + 1,
    pages: Math.ceil(count / take),
  });
};

export const createManyProducts = async (req: Request, res: Response) => {
  const products = req.body;

  const createdProducts = await db.product.createMany({
    data: products,
  });

  res.status(201).json(createdProducts);
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await db.product.findFirstOrThrow({
      where: {
        id: req.params.id,
      },
    });

    res.json(product);
  } catch (error) {
    throw new NotFoundException(`Product not found ${error}`, ErrorCode.PRODUCT_NOT_FOUND);
  }
};
