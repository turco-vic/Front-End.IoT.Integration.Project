import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const produtoIoT = await prisma.produtoIoT.update({
      where: { id: parseInt(id) },
      data: await request.json(),
    });
    return NextResponse.json(produtoIoT);
  } catch (error) {
    return NextResponse.json({ erro: 'Erro ao atualizar produto IoT' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.produtoIoT.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ sucesso: true });
  } catch (error) {
    return NextResponse.json({ erro: 'Erro ao deletar produto IoT' }, { status: 500 });
  }
}
