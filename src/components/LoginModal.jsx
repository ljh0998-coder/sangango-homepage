import React, { useState } from 'react';
import { Mail, Lock, User, X, CheckCircle, Smartphone } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    if (!isLogin && (!name || !phone)) {
      setError('이름과 휴대폰 번호를 입력해주세요.');
      return;
    }

    if (!isLogin && !agree) {
      setError('개인정보 수집 및 이용 동의에 동의하셔야 합니다.');
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      onLoginSuccess(isLogin ? { email, name: email.split('@')[0] } : { email, name });
      setSuccess(false);
      onClose();
      // Reset fields
      setEmail('');
      setPassword('');
      setName('');
      setPhone('');
      setAgree(false);
    }, 1500);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal} className="animate-scale">
        <button style={styles.closeBtn} onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {success ? (
          <div style={styles.successContainer} className="animate-fade">
            <CheckCircle size={60} color="#D84315" style={{ marginBottom: 16 }} />
            <h3 style={styles.successTitle}>
              {isLogin ? '로그인에 성공했습니다!' : '회원가입이 완료되었습니다!'}
            </h3>
            <p style={styles.successText}>산으로간고등어에 오신 것을 환영합니다.</p>
            <p style={styles.subtext}>수파베이스 연결 대기 중 (시뮬레이션 모드)</p>
          </div>
        ) : (
          <div className="animate-fade">
            <div style={styles.header}>
              <h2 style={styles.title}>
                {isLogin ? '산으로간고등어 로그인' : '산으로간고등어 회원가입'}
              </h2>
              <p style={styles.subtitle}>
                {isLogin ? '화덕에서 갓 구운 맛있는 소식을 만나보세요.' : '회원이 되시면 스탬프 및 적립 혜택을 드립니다.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              {error && <div style={styles.errorAlert}>{error}</div>}

              {!isLogin && (
                <>
                  <div style={styles.inputGroup}>
                    <User size={18} color="#8C7E7A" style={styles.inputIcon} />
                    <input
                      type="text"
                      placeholder="이름"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <Smartphone size={18} color="#8C7E7A" style={styles.inputIcon} />
                    <input
                      type="tel"
                      placeholder="휴대폰 번호 (예: 010-1234-5678)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                </>
              )}

              <div style={styles.inputGroup}>
                <Mail size={18} color="#8C7E7A" style={styles.inputIcon} />
                <input
                  type="email"
                  placeholder="이메일 주소"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <Lock size={18} color="#8C7E7A" style={styles.inputIcon} />
                <input
                  type="password"
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                />
              </div>

              {!isLogin && (
                <label style={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    style={styles.checkbox}
                  />
                  <span style={styles.checkboxLabel}>
                    [필수] 개인정보 수집 및 스탬프 적립 안내 동의
                  </span>
                </label>
              )}

              <button type="submit" style={styles.submitBtn}>
                {isLogin ? '로그인하기' : '회원가입 완료'}
              </button>
            </form>

            <div style={styles.switchWrapper}>
              <span style={styles.switchText}>
                {isLogin ? '아직 계정이 없으신가요?' : '이미 계정이 있으신가요?'}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                style={styles.switchBtn}
              >
                {isLogin ? '회원가입' : '로그인'}
              </button>
            </div>

            <div style={styles.supaBadge}>
              <span>⚙️ Supabase Integration Placeholder</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(44, 30, 26, 0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    padding: 16,
  },
  modal: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: '440px',
    borderRadius: '16px',
    padding: '36px 30px',
    position: 'relative',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#8C7E7A',
    padding: 4,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#F5EFEB',
    }
  },
  header: {
    textAlign: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#2C1E1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: '14px',
    color: '#8C7E7A',
    lineHeight: '1.4',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  errorAlert: {
    backgroundColor: '#FFEBEE',
    color: '#D32F2F',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    textAlign: 'left',
    border: '1px solid #FFCDD2',
  },
  inputGroup: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 14,
  },
  input: {
    width: '100%',
    padding: '12px 14px 12px 42px',
    border: '1px solid #E8DFD5',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#FCFAF5',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    ':focus': {
      borderColor: '#D84315',
      boxShadow: '0 0 0 3px rgba(216, 67, 21, 0.1)',
    }
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    cursor: 'pointer',
    textAlign: 'left',
    marginTop: 4,
  },
  checkbox: {
    accentColor: '#D84315',
    width: 16,
    height: 16,
    cursor: 'pointer',
  },
  checkboxLabel: {
    fontSize: '13px',
    color: '#5C4E4A',
  },
  submitBtn: {
    backgroundColor: '#D84315',
    color: '#FFFFFF',
    padding: '14px 0',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s, transform 0.1s',
    marginTop: 8,
  },
  switchWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
    fontSize: '14px',
  },
  switchText: {
    color: '#8C7E7A',
  },
  switchBtn: {
    background: 'none',
    border: 'none',
    color: '#D84315',
    fontWeight: '600',
    cursor: 'pointer',
    padding: 0,
    textDecoration: 'underline',
  },
  successContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '30px 10px',
  },
  successTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#2C1E1A',
    marginBottom: 8,
  },
  successText: {
    fontSize: '15px',
    color: '#5C4E4A',
    marginBottom: 4,
  },
  subtext: {
    fontSize: '12px',
    color: '#8C7E7A',
    backgroundColor: '#F6EFE9',
    padding: '4px 8px',
    borderRadius: '4px',
    marginTop: 12,
  },
  supaBadge: {
    display: 'flex',
    justifyContent: 'center',
    fontSize: '11px',
    color: '#C19A6B',
    marginTop: 18,
    opacity: 0.8,
  }
};
