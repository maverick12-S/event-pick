import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Background from '../components/Background/Background';
import styles from '../features/login/components/LoginForm/screens/LoginScreen.module.css';

const BaseLayout: React.FC = () => {
	return (
		<Background>
			<Header />
			<main className={styles.main}>
				<Outlet />
			</main>
			<Footer />
		</Background>
	);
};

export default BaseLayout;

