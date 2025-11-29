'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Home.module.css';
import { Button } from 'antd';

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

  const sair = () => {
    sessionStorage.removeItem('usuario');
    router.replace('/');
  };

  return (
    <div className={styles.container}>
      {usuario ? (
        <div>
          <h1>Bem-vindo, {usuario.nome}</h1>
          <Button onClick={() => router.replace('/produtoIoT')}>Produtos IoT</Button>
          <Button onClick={() => router.replace('/estoque')}>Estoque</Button>
          <Button danger onClick={sair}>
            Sair
          </Button>
        </div>
      ) : (
        <p>Carregando ...</p>
      )}
    </div>
  );
}
