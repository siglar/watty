import { FC, ReactNode } from 'react';
import styles from './LoginHeader.module.css';
import logo from '../../../assets/logo.jpg';

type LoginHeaderProps = {
  children: ReactNode;
};

const LoginHeader: FC<LoginHeaderProps> = (props: LoginHeaderProps) => {
  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginHeader}>
        <img src={logo} alt="Watty logo" />
        <article>
          <p>Welcome to Watty</p>
          <p>Please log in.</p>
        </article>
      </div>
      {props.children}
    </div>
  );
};

export default LoginHeader;
