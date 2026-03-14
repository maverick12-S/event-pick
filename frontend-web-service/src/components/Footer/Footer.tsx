import React, { useState } from 'react';
import styles from './Footer.module.css';
import TermsOfServiceModal from '../../features/accounts/components/TermsOfServiceModal';
import SecurityInfoModal from '../../features/accounts/components/SecurityInfoModal';
import PrivacyPolicyModal from '../../features/accounts/components/PrivacyPolicyModal';
import CommercialTransactionModal from '../../features/accounts/components/CommercialTransactionModal';

const Footer: React.FC = () => {
  const [termsOpen, setTermsOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);
  const [privacyPolicyOpen, setPrivacyPolicyOpen] = useState(false);
  const [commercialOpen, setCommercialOpen] = useState(false);

  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span className={styles.lock} aria-hidden>🔒</span>
          <span className={styles.company}>Solvevia.</span>
          <nav className={styles.footerLinks} aria-label="フッターナビ">
            <button type="button" className={styles.linkButton} onClick={() => setTermsOpen(true)}>
              利用規約
            </button>
            <button type="button" className={styles.linkButton} onClick={() => setSecurityOpen(true)}>
              セキュリティ情報
            </button>
            <button type="button" className={styles.linkButton} onClick={() => setPrivacyPolicyOpen(true)}>
              プライバシーポリシー
            </button>
            <button type="button" className={styles.linkButton} onClick={() => setCommercialOpen(true)}>
              特定商取引法に基づく表記
            </button>
          </nav>
        </div>
      </footer>
      <TermsOfServiceModal open={termsOpen} onClose={() => setTermsOpen(false)} />
      <SecurityInfoModal open={securityOpen} onClose={() => setSecurityOpen(false)} />
      <PrivacyPolicyModal open={privacyPolicyOpen} onClose={() => setPrivacyPolicyOpen(false)} />
      <CommercialTransactionModal open={commercialOpen} onClose={() => setCommercialOpen(false)} />
    </>
  );
};

export default Footer;
