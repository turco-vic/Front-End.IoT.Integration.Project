'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, Descriptions, Table, Spin, Button, Tag } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import styles from './ProdutoDetalhes.module.css';
import axios from 'axios';

export default function ProdutoDetalhes() {
  const router = useRouter();
  const params = useParams();
  const [produto, setProduto] = useState(null);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!sessionStorage.getItem('usuario')) {
      router.replace('/');
      return;
    }

    const carregarDados = async () => {
      try {
        const id = await params.id;
        
        const { data: produtos } = await axios.get('/api/produtoIoT');
        const produtoEncontrado = produtos.find(p => p.id === parseInt(id));
        
        if (!produtoEncontrado) {
          alert('Produto não encontrado');
          router.push('/produtoIoT');
          return;
        }

        setProduto(produtoEncontrado);

        const { data: estoqueData } = await axios.get('/api/estoque');
        const movimentacoesProduto = estoqueData.movimentacoes
          .filter(m => m.produtoId === parseInt(id))
          .sort((a, b) => new Date(b.data) - new Date(a.data));

        setMovimentacoes(movimentacoesProduto);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert('Erro ao carregar dados do produto');
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, [params, router]);

  const colunas = [
    {
      title: 'Data',
      dataIndex: 'data',
      key: 'data',
      align: 'center',
      sorter: (a, b) => new Date(a.data) - new Date(b.data),
      defaultSortOrder: 'descend',
      render: (data) => {
        const date = new Date(data);
        return `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
      },
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipo',
      align: 'center',
      render: (tipo) => (
        <Tag color={tipo === 'entrada' ? 'green' : 'red'}>
          {tipo.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Quantidade',
      dataIndex: 'quantidade',
      key: 'quantidade',
      align: 'center',
    },
    {
      title: 'Usuário',
      dataIndex: 'usuario',
      key: 'usuario',
      align: 'center',
      render: (usuario) => usuario?.nome || 'N/A',
    },
  ];

  if (carregando) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.loading}>
          <Spin size="large" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!produto) {
    return null;
  }

  const estoqueAbaixoMinimo = produto.estoque_atual < produto.estoque_minimo;

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        <ArrowLeftOutlined 
          onClick={() => router.push('/produtoIoT')}
          className={styles.btnVoltar}
        />
        
        <div className={styles.header}>
          <h1 className={styles.title}>{produto.nome}</h1>
          <p className={styles.subtitle}>Detalhes do produto IoT</p>
        </div>

        <div className={styles.content}>
          <Card className={styles.card}>
            <Descriptions title="Informações do Produto" bordered column={1}>
              <Descriptions.Item label="Nome">
                {produto.nome}
              </Descriptions.Item>
              <Descriptions.Item label="Categoria">
                {produto.categoria}
              </Descriptions.Item>
              <Descriptions.Item label="ID">
                #{produto.id}
              </Descriptions.Item>
              <Descriptions.Item label="Estoque Atual">
                <span className={estoqueAbaixoMinimo ? styles.estoqueAlerta : styles.estoqueNormal}>
                  {produto.estoque_atual} unidades
                  {estoqueAbaixoMinimo && ' ⚠️'}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Estoque Mínimo">
                {produto.estoque_minimo} unidades
              </Descriptions.Item>
            </Descriptions>

            {estoqueAbaixoMinimo && (
              <div className={styles.alerta}>
                ⚠️ Atenção: Estoque abaixo do mínimo recomendado!
              </div>
            )}
          </Card>

          <Card className={styles.card} title="Histórico de Movimentações">
            {movimentacoes.length > 0 ? (
              <Table 
                columns={colunas} 
                dataSource={movimentacoes} 
                rowKey="id"
                pagination={false}
                className={styles.table}
              />
            ) : (
              <p className={styles.semDados}>Nenhuma movimentação registrada para este produto.</p>
            )}
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
