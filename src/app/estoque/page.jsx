'use client';
import { useEffect, useState } from 'react';
import { Table, Button, Form, Select, InputNumber, DatePicker, Alert } from 'antd';
import { useRouter } from 'next/navigation';
import styles from './Estoque.module.css';
import axios from 'axios';

export default function Estoque() {
  const router = useRouter();
  const [produtosIoT, setProdutosIoT] = useState([]);
  const [alerta, setAlerta] = useState(null);
  const [form] = Form.useForm();

  const carregarDados = async () => {
    const { data } = await axios.get('/api/estoque');
    setProdutosIoT(data.produtosIoT.sort((a, b) => a.nome.localeCompare(b.nome)));
  };

  const registrarMovimentacao = async (values) => {
    const usuario = JSON.parse(sessionStorage.getItem('usuario'));
    const { data } = await axios.post('/api/estoque', {
      ...values,
      usuario_id: usuario.id,
    });
    if (data.alerta) setAlerta(`Atenção! Estoque abaixo do mínimo: ${data.estoqueAtual} unidades`);
    form.resetFields();
    carregarDados();
  };

  useEffect(() => {
    if (!sessionStorage.getItem('usuario')) return router.replace('/');
    carregarDados();
  }, [router]);

  const colunas = [
    { title: 'Produto IoT', dataIndex: 'nome' },
    { title: 'Categoria', dataIndex: 'categoria' },
    { title: 'Estoque Atual', dataIndex: 'estoque_atual' },
    { title: 'Estoque Mínimo', dataIndex: 'estoque_minimo' },
  ];

  return (
    <div className={styles.container}>
      <Button onClick={() => router.replace('/home')}>Voltar</Button>
      <h1>Gestão de Estoque</h1>
      {alerta && <Alert message={alerta} type="warning" closable onClose={() => setAlerta(null)} />}
      <Form form={form} layout="inline" onFinish={registrarMovimentacao}>
        <Form.Item name="produtoIoT_id" rules={[{ required: true }]}>
          <Select placeholder="Produto IoT">
            {produtosIoT.map((p) => (
              <Select.Option key={p.id} value={p.id}>
                {p.nome}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="tipo" rules={[{ required: true }]}>
          <Select placeholder="Tipo">
            <Select.Option value="entrada">Entrada</Select.Option>
            <Select.Option value="saida">Saída</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="quantidade" rules={[{ required: true }]}>
          <InputNumber placeholder="Quantidade" min={1} />
        </Form.Item>
        <Form.Item name="data_movimentacao">
          <DatePicker placeholder="Data" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Registrar
          </Button>
        </Form.Item>
      </Form>
      <h2>Estoque Atual</h2>
      <Table columns={colunas} dataSource={produtosIoT} rowKey="id" />
    </div>
  );
}
