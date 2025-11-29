import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const produtosIoT = await prisma.produtoIoT.findMany();
    return NextResponse.json(produtosIoT);
  } catch {
    return NextResponse.json({ erro: 'Erro ao buscar produtos IoT' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { nome, estoque_minimo, estoque_atual } = await request.json();
    const produtoIoT = await prisma.produtoIoT.create({
      data: { nome, estoque_minimo: parseInt(estoque_minimo), estoque_atual: parseInt(estoque_atual) },
    });
    return NextResponse.json(produtoIoT);
  } catch {
    return NextResponse.json({ erro: 'Erro ao criar produto IoT' }, { status: 500 });
  }
}
