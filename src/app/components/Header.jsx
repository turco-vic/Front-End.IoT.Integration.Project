'use client';
import { useRouter } from 'next/navigation';
import { Button } from 'antd';
import { HomeOutlined, BoxPlotOutlined, InboxOutlined, LogoutOutlined } from '@ant-design/icons';
import styles from '../styles/Header.module.css';

export default function Header() {
  const router = useRouter();

  const sair = () => {
    sessionStorage.removeItem('usuario');
    router.replace('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <h2 className={styles.logo}>Sistema IoT</h2>
        <nav className={styles.nav}>
          <Button 
            type="text" 
            icon={<HomeOutlined />}
            onClick={() => router.replace('/home')}
            className={styles.navButton}
          >
            Home
          </Button>
          <Button 
            type="text" 
            icon={<BoxPlotOutlined />}
            onClick={() => router.replace('/produtoIoT')}
            className={styles.navButton}
          >
            Produtos IoT
          </Button>
          <Button 
            type="text" 
            icon={<InboxOutlined />}
            onClick={() => router.replace('/estoque')}
            className={styles.navButton}
          >
            Estoque
          </Button>
          <Button 
            danger 
            type="text"
            icon={<LogoutOutlined />}
            onClick={sair}
            className={styles.navButton}
          >
            Sair
          </Button>
        </nav>
      </div>
    </header>
  );
}
