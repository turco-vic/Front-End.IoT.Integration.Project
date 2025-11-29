import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    const { nome, categoria, estoque_minimo } = await request.json();
    
    const produtoIoT = await prisma.produtoIoT.update({
      where: { id: parseInt(id) },
      data: { 
        nome, 
        categoria,
        estoque_minimo: parseInt(estoque_minimo) 
      },
    });
    return NextResponse.json(produtoIoT);
  } catch (error) {
    console.error('Erro ao atualizar produto IoT:', error);
    return NextResponse.json({ erro: 'Erro ao atualizar produto IoT' }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const { id } = await context.params;
    await prisma.produtoIoT.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ sucesso: true });
  } catch (error) {
    console.error('Erro ao deletar produto IoT:', error);
    return NextResponse.json({ erro: 'Erro ao deletar produto IoT' }, { status: 500 });
  }
}
