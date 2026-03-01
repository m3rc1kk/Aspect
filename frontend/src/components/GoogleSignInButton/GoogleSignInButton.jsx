import { useEffect, useRef, useCallback } from 'react';
import googleIcon from '../../assets/images/Auth/google.svg';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export default function GoogleSignInButton({ onSuccess, disabled, className = '' }) {
    const googleContainerRef = useRef(null);
    const onSuccessRef = useRef(onSuccess);

    useEffect(() => {
        onSuccessRef.current = onSuccess;
    }, [onSuccess]);

    useEffect(() => {
        if (!GOOGLE_CLIENT_ID || !googleContainerRef.current) return;
        const containerEl = googleContainerRef.current;

        const init = () => {
            if (!window.google?.accounts?.id) return;

            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: (response) => {
                    if (response.credential) {
                        onSuccessRef.current?.(response.credential);
                    }
                },
                auto_select: false,
            });

            const el = document.createElement('div');
            el.setAttribute('data-google-button', '1');
            containerEl.appendChild(el);
            window.google.accounts.id.renderButton(el, {
                type: 'standard',
                theme: 'outline',
                size: 'large',
                text: 'continue_with',
                width: 320,
            });
            const btn = el.querySelector('div[role="button"]');
            if (btn) {
                btn.style.position = 'absolute';
                btn.style.left = '0';
                btn.style.top = '0';
                btn.style.width = '100%';
                btn.style.height = '100%';
                btn.style.opacity = '0';
                btn.style.cursor = 'pointer';
            }
        };

        if (window.google?.accounts?.id) {
            init();
            return () => {
                const child = containerEl.querySelector('[data-google-button]');
                if (child) child.remove();
            };
        }

        const interval = setInterval(() => {
            if (window.google?.accounts?.id) {
                clearInterval(interval);
                init();
            }
        }, 100);
        return () => {
            clearInterval(interval);
            const child = containerEl.querySelector('[data-google-button]');
            if (child) child.remove();
        };
    }, []);

    const handleClick = useCallback(() => {
        if (disabled) return;
        const btn = googleContainerRef.current?.querySelector('div[role="button"]');
        if (btn) btn.click();
    }, [disabled]);

    if (!GOOGLE_CLIENT_ID) {
        return null;
    }

    return (
        <div
            role="button"
            tabIndex={0}
            className={className}
            onClick={handleClick}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }}
            style={{
                position: 'relative',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.6 : 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <img src={googleIcon} alt="" width={16} height={16} loading="lazy" className="form__google-icon" style={{ marginRight: 8 }} />
            <span>Google</span>
            <div ref={googleContainerRef} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }} aria-hidden />
        </div>
    );
}
