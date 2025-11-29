'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Home.module.css';
import { Card, Row, Col } from 'antd';
import { BoxPlotOutlined, InboxOutlined } from '@ant-design/icons';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioLogado = sessionStorage.getItem('usuario');
    if (!usuarioLogado) {
      router.replace('/');
      return;
    }
    setUsuario(JSON.parse(usuarioLogado));
  }, [router]);

  return (
    <div className={styles.container}>
      {usuario ? (
        <>
          <Header />

          <main className={styles.main}>
            <div className={styles.welcome}>
              <h1>Bem-vindo, {usuario.nome}</h1>
              <p>Sistema de Gerenciamento de Produtos IoT</p>
            </div>

            <Row gutter={[24, 24]} className={styles.cards}>
              <Col xs={24} md={12}>
                <Card 
                  hoverable
                  className={styles.card}
                  onClick={() => router.replace('/produtoIoT')}
                >
                  <BoxPlotOutlined className={styles.cardIcon} />
                  <h3>Produtos IoT</h3>
                  <p>Gerencie seu catálogo de produtos IoT, incluindo sensores, microcontroladores e componentes eletrônicos.</p>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card 
                  hoverable
                  className={styles.card}
                  onClick={() => router.replace('/estoque')}
                >
                  <InboxOutlined className={styles.cardIcon} />
                  <h3>Gestão de Estoque</h3>
                  <p>Controle entradas e saídas, monitore níveis de estoque e receba alertas quando estiver abaixo do mínimo.</p>
                </Card>
              </Col>
            </Row>
          </main>
          <Footer />
        </>
      ) : (
        <p>Carregando ...</p>
      )}
    </div>
  );
}
