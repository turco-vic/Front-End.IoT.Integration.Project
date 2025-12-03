'use client';
import { useEffect, useState } from 'react';
import { Table, Button, Form, Select, InputNumber, DatePicker, Alert, ConfigProvider } from 'antd';
import { useRouter } from 'next/navigation';
import locale from 'antd/locale/pt_BR';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './Estoque.module.css';
import axios from 'axios';

dayjs.locale('pt-br');

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
    
    if (!usuario || !usuario.id) {
      alert('Usuário não identificado. Faça login novamente.');
      router.replace('/');
      return;
    }

    try {
      const { data } = await axios.post('/api/estoque', {
        ...values,
        usuario_id: usuario.id,
      });
      
      const produto = produtosIoT.find(p => p.id === values.produtoIoT_id);
      
      // Verifica se após a movimentação o estoque ainda está abaixo do mínimo
      if (data.estoqueAtual < (produto?.estoque_minimo || 0)) {
        setAlerta({
          produto: produto?.nome || 'Produto',
          estoqueAtual: data.estoqueAtual,
          estoqueMinimo: produto?.estoque_minimo || 0,
          tipo: values.tipo
        });
      } else {
        setAlerta(null);
      }
      
      form.resetFields();
      carregarDados();
    } catch (error) {
      console.error('Erro ao registrar movimentação:', error);
      alert('Erro ao registrar movimentação: ' + (error.response?.data?.erro || error.message));
    }
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
    <ConfigProvider locale={locale}>
      <div className={styles.container}>
        <Header />
        
        <main className={styles.main}>
          <div className={styles.header}>
            <h1 className={styles.title}>Gestão de Estoque</h1>
            <p className={styles.subtitle}>Registre movimentações e monitore seus produtos</p>
          </div>

          {alerta && (
            <Alert 
              message={
                <span>
                  <strong>⚠️ Alerta de Estoque Baixo</strong>
                </span>
              }
              description={
                <div>
                  <p style={{ margin: '8px 0' }}>
                    <strong>Produto:</strong> {alerta.produto}
                  </p>
                  <p style={{ margin: '8px 0' }}>
                    <strong>Estoque Atual:</strong> {alerta.estoqueAtual} unidades
                  </p>
                  <p style={{ margin: '8px 0' }}>
                    <strong>Estoque Mínimo:</strong> {alerta.estoqueMinimo} unidades
                  </p>
                  <p style={{ margin: '8px 0', color: '#d46b08' }}>
                    <strong>Diferença:</strong> {alerta.estoqueMinimo - alerta.estoqueAtual} unidades abaixo do mínimo
                  </p>
                </div>
              }
              type="warning" 
              closable 
              onClose={() => setAlerta(null)}
              className={styles.alert}
              showIcon
            />
          )}

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Registrar Movimentação</h2>
          <Form form={form} layout="inline" onFinish={registrarMovimentacao} className={styles.form}>
            <Form.Item name="produtoIoT_id" rules={[{ required: true, message: 'Selecione o produto' }]}>
              <Select placeholder="Produto IoT" size="large" style={{ width: 220 }}>
                {produtosIoT.map((p) => (
                  <Select.Option key={p.id} value={p.id}>
                    {p.nome}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="tipo" rules={[{ required: true, message: 'Selecione o tipo' }]}>
              <Select placeholder="Tipo" size="large" style={{ width: 150 }}>
                <Select.Option value="entrada">Entrada</Select.Option>
                <Select.Option value="saida">Saída</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="quantidade" rules={[{ required: true, message: 'Informe a quantidade' }]}>
              <InputNumber placeholder="Quantidade" min={1} size="large" style={{ width: 150 }} />
            </Form.Item>
            <Form.Item name="data_movimentacao">
              <DatePicker 
                placeholder="Data" 
                size="large" 
                format="DD/MM/YYYY"
                disabledDate={(current) => {
                  // Desabilita datas futuras (após hoje)
                  return current && current > dayjs().endOf('day');
                }}
                defaultValue={dayjs()}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" className={styles.btnPrimary}>
                Registrar
              </Button>
            </Form.Item>
          </Form>
        </div>

        <div className={styles.tableSection}>
          <h2 className={styles.sectionTitle}>Estoque Atual</h2>
          <Table 
            columns={colunas} 
            dataSource={produtosIoT} 
            rowKey="id"
            className={styles.table}
            pagination={false}
          />
        </div>
      </main>

      <Footer />
      </div>
    </ConfigProvider>
  );
}
