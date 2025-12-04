import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { nome, senha } = await request.json();
    const usuario = await prisma.usuario.findFirst({ where: { nome } });

    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
      return NextResponse.json({ erro: 'Nome ou senha inválidos' }, { status: 401 });
    }

    return NextResponse.json({ 
      id: usuario.id, 
      nome: usuario.nome 
    });
  } catch (error) {
    return NextResponse.json({ erro: 'Erro no servidor' }, { status: 500 });
  }
}
