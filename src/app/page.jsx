'use client';

import { Form, Input, Button, Alert } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styles from './Login.module.css';
import axios from 'axios';

export default function LoginPage() {
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  const onFinish = async (values) => {
    setErro(null);
    setCarregando(true);

    try {
      const { data } = await axios.post('/api/login', values);
      sessionStorage.setItem('usuario', JSON.stringify(data));
      router.replace('/home');
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao conectar com o servidor');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.header}>
          <h1 className={styles.title}>Sistema IoT</h1>
          <p className={styles.subtitle}>Gerenciamento de Produtos IoT</p>
        </div>

        {erro && (
          <Alert
            message="Erro"
            description={erro}
            type="error"
            closable
            onClose={() => setErro(null)}
            className={styles.alert}
          />
        )}

        <Form onFinish={onFinish} className={styles.form}>
          <Form.Item
            name="nome"
            rules={[{ required: true, message: 'Digite seu usuário!' }]}>
            <Input 
              prefix={<UserOutlined />}
              placeholder="Usuário"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="senha"
            rules={[{ required: true, message: 'Digite sua senha!' }]}>
            <Input.Password 
              prefix={<LockOutlined />}
              placeholder="Senha"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={carregando}
              size="large"
              className={styles.button}
            >
              Entrar
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
