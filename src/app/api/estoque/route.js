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
    const produtosIoT = await prisma.produtoIoT.findMany({ include: { movimentacao: true } });
    return NextResponse.json({
      produtosIoT: produtosIoT.map((p) => ({
        id: p.id,
        nome: p.nome,
        categoria: p.categoria,
        estoque_minimo: p.estoque_minimo,
        estoque_atual: calcularEstoque(p.movimentacao),
      })),
    });
  } catch (error) {
    return NextResponse.json({ erro: 'Erro ao buscar estoque' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { produtoIoT_id, usuario_id, tipo, quantidade, data_movimentacao } = await request.json();
    
    console.log('Dados recebidos:', { produtoIoT_id, usuario_id, tipo, quantidade, data_movimentacao });

    if (!usuario_id || isNaN(parseInt(usuario_id))) {
      return NextResponse.json({ erro: 'ID do usuário inválido' }, { status: 400 });
    }

    const produtoIoT = await prisma.produtoIoT.findUnique({
      where: { id: parseInt(produtoIoT_id) },
      include: { movimentacao: true },
    });

    if (!produtoIoT) {
      return NextResponse.json({ erro: 'Produto não encontrado' }, { status: 404 });
    }

    await prisma.movimentacao.create({
      data: {
        produtoId: parseInt(produtoIoT_id),
        usuarioId: parseInt(usuario_id),
        tipo,
        quantidade: parseInt(quantidade),
        ...(data_movimentacao && { data: new Date(data_movimentacao) }),
      },
    });

    const estoqueAtual =
      calcularEstoque(produtoIoT.movimentacao) +
      (tipo === 'entrada' ? parseInt(quantidade) : -parseInt(quantidade));
    const alerta = tipo === 'saida' && estoqueAtual < produtoIoT.estoque_minimo;

    return NextResponse.json({ sucesso: true, estoqueAtual, alerta });
  } catch (error) {
    console.error('Erro ao registrar movimentação:', error);
    return NextResponse.json({ erro: 'Erro ao registrar movimentação' }, { status: 500 });
  }
}
