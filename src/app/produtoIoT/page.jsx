'use client';
import { useEffect, useState } from 'react';
import { Table, Button, Form, Input, InputNumber, Modal, Select } from 'antd';
import { useRouter } from 'next/navigation';
import styles from './ProdutosIoT.module.css';
import axios from 'axios';

export default function ProdutosIoT() {
  const router = useRouter();
  const [produtosIoT, setProdutosIoT] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [filtroNome, setFiltroNome] = useState('');
  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();

  const carregarProdutosIoT = async () => {
    const { data } = await axios.get('/api/produtoIoT');
    setProdutosIoT(data);
  };

  useEffect(() => {
    if (!sessionStorage.getItem('usuario')) return router.replace('/');
    carregarProdutosIoT();
  }, [router]);

  const editar = (produtoIoT) => {
    setEditandoId(produtoIoT.id);
    form.setFieldsValue({
      nome: produtoIoT.nome,
      categoria: produtoIoT.categoria,
      estoque_minimo: produtoIoT.estoque_minimo,
    });
  };

  const salvarProdutoIoT = async (values) => {
    try {
      if (editandoId) {
        await axios.put(`/api/produtoIoT/${editandoId}`, values);
      } else {
        await axios.post('/api/produtoIoT', values);
      }
      form.resetFields();
      setEditandoId(null);
      carregarProdutosIoT();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert('Erro ao salvar produto: ' + (error.response?.data?.erro || error.message));
    }
  };

  const removerProdutoIoT = (id) => {
    modal.confirm({
      title: 'Confirmar exclusão?',
      content: 'Esta ação não pode ser desfeita.',
      okText: 'Sim',
      cancelText: 'Não',
      onOk: async () => {
        try {
          await axios.delete(`/api/produtoIoT/${id}`);
          carregarProdutosIoT();
        } catch (error) {
          console.error('Erro ao deletar produto:', error);
          alert('Erro ao deletar produto: ' + (error.response?.data?.erro || error.message));
        }
      },
    });
  };

  const colunas = [
    { title: 'Nome', dataIndex: 'nome', key: 'nome' },
    { title: 'Categoria', dataIndex: 'categoria', key: 'categoria' },
    { title: 'Estoque Atual', dataIndex: 'estoque_atual', key: 'estoque_atual' },
    { title: 'Estoque Mínimo', dataIndex: 'estoque_minimo', key: 'estoque_minimo' },
    {
      title: 'Ações',
      key: 'acoes',
      render: (_, l) => (
        <>
          <Button onClick={() => editar(l)}>Editar</Button>
          <Button danger onClick={() => removerProdutoIoT(l.id)}>Apagar</Button>
        </>
      ),
    },
  ];

  const produtosIoTFiltrados = produtosIoT.filter((p) =>
    p.nome.toLowerCase().includes(filtroNome.toLowerCase()),
  );

  return (
    <div className={styles.container}>
      {contextHolder}
      <Button onClick={() => router.replace('/home')}>Voltar Home</Button>
      <h1>Produtos IoT</h1>
      <Form form={form} layout="inline" onFinish={salvarProdutoIoT}>
        <Form.Item name="nome" rules={[{ required: true }]}>
          <Input placeholder="Nome" />
        </Form.Item>
        <Form.Item name="categoria" rules={[{ required: true }]}>
          <Select placeholder="Categoria" style={{ width: 200 }}>
            <Select.Option value="Sensores">Sensores</Select.Option>
            <Select.Option value="Microcontroladores">Microcontroladores</Select.Option>
            <Select.Option value="Conectividade">Conectividade</Select.Option>
            <Select.Option value="Atuadores">Atuadores</Select.Option>
            <Select.Option value="Componentes">Componentes</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="estoque_minimo" rules={[{ required: true }]}>
          <InputNumber placeholder="Estoque Mínimo" min={0} style={{ width: 150 }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {editandoId ? 'Salvar' : 'Adicionar'}
          </Button>
          {editandoId && (
            <Button onClick={() => { form.resetFields(); setEditandoId(null); }} style={{ marginLeft: 8 }}>
              Cancelar
            </Button>
          )}
        </Form.Item>
      </Form>
      <Input
        placeholder="Buscar produto IoT por nome"
        value={filtroNome}
        onChange={(e) => setFiltroNome(e.target.value)}
        allowClear
      />
      <Table columns={colunas} dataSource={produtosIoTFiltrados} rowKey="id" />
    </div>
  );
}
