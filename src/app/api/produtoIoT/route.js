import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const calcularEstoque = (movimentacoes) =>
  movimentacoes.reduce(
    (total, m) => total + (m.tipo === 'entrada' ? m.quantidade : -m.quantidade),
    0,
  );

export async function GET() {
  try {
    const produtosIoT = await prisma.produtoIoT.findMany({
      include: { movimentacao: true },
    });

    const produtosComEstoque = produtosIoT.map((produto) => ({
      id: produto.id,
      nome: produto.nome,
      categoria: produto.categoria,
      estoque_minimo: produto.estoque_minimo,
      estoque_atual: calcularEstoque(produto.movimentacao),
    }));

    return NextResponse.json(produtosComEstoque);
  } catch {
    return NextResponse.json({ erro: 'Erro ao buscar produtos IoT' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { nome, categoria, estoque_minimo } = await request.json();
    const produtoIoT = await prisma.produtoIoT.create({
      data: { 
        nome, 
        categoria,
        estoque_minimo: parseInt(estoque_minimo) 
      },
    });
    return NextResponse.json(produtoIoT);
  } catch (error) {
    console.error('Erro ao criar produto IoT:', error);
    return NextResponse.json({ erro: 'Erro ao criar produto IoT' }, { status: 500 });
  }
}
