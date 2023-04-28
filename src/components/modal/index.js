import React, { useState, useCallback } from 'react';
import { Modal } from '@mui/base';
import { Appear } from '../../tools/animations';

import styles from './index.module.scss';

export default ({ show, onHide, title, text, link }) => {
    const [copyText, setCopyText] = useState('Copy Link');
    const renderBackdrop = useCallback(() => {
        if (show)
            return <div onClick={onHide} className={styles.backdrop} />;
        return null;
    }, [show]);
    const onCopy = () => {
        if (typeof navigator !== 'undefined') {
            navigator.clipboard.writeText(link);
            setCopyText('Copied !');
            setTimeout(() => setCopyText('Copy Link'), 2000);
        }
    };
    return (
        <Modal
            open={show}
            disableAutoFocus
            disablePortal
            className={styles.modal}
            slots={{ backdrop: renderBackdrop }}
        >
            <Appear in={show} className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h4>{title}</h4>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.text} dangerouslySetInnerHTML={{ __html: text }}></div>
                    <div className={styles.linkWrapper}>
                        <span className={styles.link}>{link}</span>
                    </div>
                </div>
                <div className={styles.modalFooter}>
                    <button className={styles.dismiss} onClick={onHide}>Dismiss</button>
                    <button className={styles.copy} onClick={onCopy}>{copyText}</button>
                </div>
            </Appear>
        </Modal>
    );
}