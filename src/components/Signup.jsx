import React, { useState, useMemo, useCallback } from 'react';
import { 
  Mail, Lock, User, Smartphone, Eye, EyeOff, 
  Check, CheckCircle2, AlertCircle, ArrowLeft, ShieldCheck, 
  Sparkles, X
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Signup({ onOpenLogin, onSignupSuccess, onNavigateHome }) {
  // Form Input States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Password Visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Terms Agreement States
  const [agreeTerms, setAgreeTerms] = useState(false); // [필수] 이용약관
  const [agreePrivacy, setAgreePrivacy] = useState(false); // [필수] 개인정보 수집 및 이용
  const [agreeMarketingSMS, setAgreeMarketingSMS] = useState(false); // [선택] SMS
  const [agreeMarketingEmail, setAgreeMarketingEmail] = useState(false); // [선택] 이메일
  const [agreeMarketingKakao, setAgreeMarketingKakao] = useState(false); // [선택] 카카오 알림톡

  // Modal / Terms view states
  const [activeTermsModal, setActiveTermsModal] = useState(null); // 'terms' | 'privacy' | null

  // Submission & UI States
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // 1. Phone number auto-formatter (numbers only + hyphens)
  const handlePhoneChange = useCallback((e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    let formatted = rawValue;

    if (rawValue.length <= 3) {
      formatted = rawValue;
    } else if (rawValue.length <= 7) {
      formatted = `${rawValue.slice(0, 3)}-${rawValue.slice(3)}`;
    } else if (rawValue.length <= 11) {
      formatted = `${rawValue.slice(0, 3)}-${rawValue.slice(3, 7)}-${rawValue.slice(7, 11)}`;
    } else {
      formatted = `${rawValue.slice(0, 3)}-${rawValue.slice(3, 7)}-${rawValue.slice(7, 11)}`;
    }
    setPhone(formatted);
  }, []);

  // 2. Real-time Validations
  const isEmailValid = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, [email]);

  const passwordValidation = useMemo(() => {
    const hasMinLength = password.length >= 8;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return {
      hasMinLength,
      hasSpecialChar,
      isValid: hasMinLength && hasSpecialChar
    };
  }, [password]);

  const isPasswordMatch = useMemo(() => {
    if (!confirmPassword) return false;
    return password === confirmPassword;
  }, [password, confirmPassword]);

  const isNameValid = useMemo(() => {
    return name.trim().length >= 2;
  }, [name]);

  const isPhoneValid = useMemo(() => {
    const numbersOnly = phone.replace(/[^0-9]/g, '');
    return numbersOnly.length >= 10 && numbersOnly.length <= 11;
  }, [phone]);

  // Terms calculation
  const isMarketingAll = agreeMarketingSMS && agreeMarketingEmail && agreeMarketingKakao;
  const isAllAgreed = agreeTerms && agreePrivacy && isMarketingAll;

  const handleToggleAllAgreements = useCallback(() => {
    const nextState = !isAllAgreed;
    setAgreeTerms(nextState);
    setAgreePrivacy(nextState);
    setAgreeMarketingSMS(nextState);
    setAgreeMarketingEmail(nextState);
    setAgreeMarketingKakao(nextState);
  }, [isAllAgreed]);

  const handleToggleMarketingAll = useCallback(() => {
    const nextState = !isMarketingAll;
    setAgreeMarketingSMS(nextState);
    setAgreeMarketingEmail(nextState);
    setAgreeMarketingKakao(nextState);
  }, [isMarketingAll]);

  // Form Submission Readiness
  const isFormValid = useMemo(() => {
    return (
      isEmailValid &&
      passwordValidation.isValid &&
      isPasswordMatch &&
      isNameValid &&
      isPhoneValid &&
      agreeTerms &&
      agreePrivacy
    );
  }, [
    isEmailValid,
    passwordValidation.isValid,
    isPasswordMatch,
    isNameValid,
    isPhoneValid,
    agreeTerms,
    agreePrivacy
  ]);

  // Form Submit Handler (Supabase Integration)
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;

    setServerError('');
    setIsLoading(true);

    try {
      const marketingChannels = [];
      if (agreeMarketingSMS) marketingChannels.push('SMS');
      if (agreeMarketingEmail) marketingChannels.push('EMAIL');
      if (agreeMarketingKakao) marketingChannels.push('KAKAO');

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name.trim(),
            phone: phone.trim(),
            marketing_agreed: marketingChannels.length > 0,
            marketing_channels: marketingChannels,
            agreed_at: new Date().toISOString()
          }
        }
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          setServerError('이미 가입된 이메일 주소입니다. 로그인을 이용해주세요.');
        } else {
          setServerError(error.message || '회원가입 처리 중 오류가 발생했습니다.');
        }
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
      setIsLoading(false);

      if (onSignupSuccess) {
        onSignupSuccess({
          id: data.user?.id,
          email: data.user?.email,
          name: name.trim(),
          phone: phone.trim()
        });
      }
    } catch (err) {
      console.error('Signup error:', err);
      setServerError('네트워크 연결 상태를 확인 후 다시 시도해주세요.');
      setIsLoading(false);
    }
  }, [isFormValid, isLoading, agreeMarketingSMS, agreeMarketingEmail, agreeMarketingKakao, email, password, name, phone, onSignupSuccess]);

  return (
    <div style={styles.pageWrapper}>
      {/* Top Header / Brand Nav */}
      <header style={styles.topNav}>
        <div style={styles.topNavInner}>
          <button 
            onClick={() => onNavigateHome ? onNavigateHome() : (window.location.hash = '#/')} 
            style={styles.backHomeBtn}
          >
            <ArrowLeft size={18} />
            <span>메인으로</span>
          </button>
          
          <div 
            style={styles.navLogo} 
            onClick={() => onNavigateHome ? onNavigateHome() : (window.location.hash = '#/')}
          >
            <img src="/brand_logo.png" alt="산으로간고등어" style={styles.logoImg} />
          </div>

          <button 
            onClick={() => onOpenLogin ? onOpenLogin() : (window.location.hash = '#/')} 
            style={styles.navLoginBtn}
          >
            로그인
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main style={styles.mainContainer}>
        <div style={styles.card} className="animate-fade signup-card-responsive">
          {isSuccess ? (
            /* Success Completion Screen */
            <div style={styles.successBox} className="animate-scale">
              <div style={styles.successIconWrapper}>
                <Sparkles size={40} color="#D84315" />
              </div>
              <h2 style={styles.successTitle} className="signup-header-title-responsive">회원가입이 완료되었습니다!</h2>
              <p style={styles.successDesc}>
                <strong>{name}</strong>님, 산으로간고등어의 소중한 회원이 되신 것을 진심으로 환영합니다.
              </p>

              <div style={styles.successInfoCard}>
                <div style={styles.successInfoRow}>
                  <span style={styles.infoLabel}>아이디(이메일)</span>
                  <span style={styles.infoValue}>{email}</span>
                </div>
                <div style={styles.successInfoRow}>
                  <span style={styles.infoLabel}>연락처</span>
                  <span style={styles.infoValue}>{phone}</span>
                </div>
                <div style={styles.successInfoRow}>
                  <span style={styles.infoLabel}>멤버십 혜택</span>
                  <span style={styles.infoBadge}>신규 5% 포인트 스탬프 적립 활성화</span>
                </div>
              </div>

              <div style={styles.successActionButtons}>
                <button 
                  onClick={() => onNavigateHome ? onNavigateHome() : (window.location.hash = '#/')} 
                  style={styles.primarySuccessBtn}
                >
                  홈으로 이동하여 메뉴 둘러보기
                </button>
              </div>
            </div>
          ) : (
            /* Signup Form Screen */
            <>
              <div style={styles.formHeader}>
                <div style={styles.headerBadge}>
                  <ShieldCheck size={14} color="#D84315" />
                  <span>간편 멤버십 가입</span>
                </div>
                <h1 style={styles.pageTitle} className="signup-header-title-responsive">회원가입</h1>
                <p style={styles.pageSubtitle}>
                  산으로간고등어의 특별한 화덕 미식 혜택과 스탬프 적립을 만나보세요.
                </p>
              </div>

              {serverError && (
                <div style={styles.serverErrorAlert} className="animate-fade">
                  <AlertCircle size={18} color="#D32F2F" />
                  <span>{serverError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} style={styles.form}>
                {/* 1. 이메일 (아이디) */}
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>
                    이메일 (아이디) <span style={styles.requiredMark}>*</span>
                  </label>
                  <div style={styles.inputWrapper}>
                    <Mail size={18} color="#8C7E7A" style={styles.leftIcon} />
                    <input
                      type="email"
                      placeholder="example@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        ...styles.input,
                        borderColor: email ? (isEmailValid ? '#2E7D32' : '#E57373') : '#E8DFD5'
                      }}
                      required
                    />
                    {email && (
                      <div style={styles.rightFeedback}>
                        {isEmailValid ? (
                          <CheckCircle2 size={18} color="#2E7D32" />
                        ) : (
                          <AlertCircle size={18} color="#D32F2F" />
                        )}
                      </div>
                    )}
                  </div>
                  {email && !isEmailValid && (
                    <span style={styles.errorText}>올바른 이메일 형식을 입력해주세요.</span>
                  )}
                  {email && isEmailValid && (
                    <span style={styles.successText}>사용 가능한 이메일 형식입니다.</span>
                  )}
                </div>

                {/* 2. 비밀번호 */}
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>
                    비밀번호 <span style={styles.requiredMark}>*</span>
                  </label>
                  <div style={styles.inputWrapper}>
                    <Lock size={18} color="#8C7E7A" style={styles.leftIcon} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="8자 이상, 특수문자(!@#$%^&*) 포함"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        ...styles.input,
                        paddingRight: 42,
                        borderColor: password ? (passwordValidation.isValid ? '#2E7D32' : '#E57373') : '#E8DFD5'
                      }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={styles.eyeBtn}
                      aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                    >
                      {showPassword ? <EyeOff size={18} color="#8C7E7A" /> : <Eye size={18} color="#8C7E7A" />}
                    </button>
                  </div>

                  {/* Password condition chips */}
                  <div style={styles.pwConditionList} className="signup-pw-chips-responsive">
                    <div style={{
                      ...styles.conditionChip,
                      color: passwordValidation.hasMinLength ? '#2E7D32' : '#8C7E7A',
                      backgroundColor: passwordValidation.hasMinLength ? '#E8F5E9' : '#F5EFEB'
                    }}>
                      <Check size={12} strokeWidth={3} />
                      <span>8자 이상</span>
                    </div>
                    <div style={{
                      ...styles.conditionChip,
                      color: passwordValidation.hasSpecialChar ? '#2E7D32' : '#8C7E7A',
                      backgroundColor: passwordValidation.hasSpecialChar ? '#E8F5E9' : '#F5EFEB'
                    }}>
                      <Check size={12} strokeWidth={3} />
                      <span>특수문자 포함</span>
                    </div>
                  </div>
                </div>

                {/* 3. 비밀번호 확인 */}
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>
                    비밀번호 확인 <span style={styles.requiredMark}>*</span>
                  </label>
                  <div style={styles.inputWrapper}>
                    <Lock size={18} color="#8C7E7A" style={styles.leftIcon} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="비밀번호를 다시 입력해주세요"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{
                        ...styles.input,
                        paddingRight: 42,
                        borderColor: confirmPassword ? (isPasswordMatch ? '#2E7D32' : '#E57373') : '#E8DFD5'
                      }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={styles.eyeBtn}
                      aria-label={showConfirmPassword ? '비밀번호 확인 숨기기' : '비밀번호 확인 보기'}
                    >
                      {showConfirmPassword ? <EyeOff size={18} color="#8C7E7A" /> : <Eye size={18} color="#8C7E7A" />}
                    </button>
                  </div>
                  {confirmPassword && (
                    isPasswordMatch ? (
                      <span style={styles.successText}>비밀번호가 일치합니다.</span>
                    ) : (
                      <span style={styles.errorText}>비밀번호가 일치하지 않습니다.</span>
                    )
                  )}
                </div>

                {/* 4. 이름(닉네임) */}
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>
                    이름 (닉네임) <span style={styles.requiredMark}>*</span>
                  </label>
                  <div style={styles.inputWrapper}>
                    <User size={18} color="#8C7E7A" style={styles.leftIcon} />
                    <input
                      type="text"
                      placeholder="홍길동"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={styles.input}
                      required
                    />
                  </div>
                </div>

                {/* 5. 휴대폰 번호 */}
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>
                    휴대폰 번호 <span style={styles.requiredMark}>*</span>
                  </label>
                  <div style={styles.inputWrapper}>
                    <Smartphone size={18} color="#8C7E7A" style={styles.leftIcon} />
                    <input
                      type="tel"
                      placeholder="010-1234-5678"
                      value={phone}
                      onChange={handlePhoneChange}
                      maxLength={13}
                      style={styles.input}
                      required
                    />
                  </div>
                  <span style={styles.helperText}>숫자만 입력하시면 자동으로 하이픈(-)이 생성됩니다.</span>
                </div>

                {/* 약관 동의 섹션 */}
                <div style={styles.termsSection}>
                  <div style={styles.termsHeader}>
                    <span style={styles.termsSectionTitle}>약관 동의</span>
                  </div>

                  {/* 전체 동의 박스 */}
                  <label style={{
                    ...styles.allAgreeBox,
                    backgroundColor: isAllAgreed ? '#FBE9E7' : '#F9F6F0',
                    borderColor: isAllAgreed ? '#D84315' : '#E8DFD5'
                  }}>
                    <input
                      type="checkbox"
                      checked={isAllAgreed}
                      onChange={handleToggleAllAgreements}
                      style={styles.checkbox}
                    />
                    <div style={styles.allAgreeTextWrapper}>
                      <span style={styles.allAgreeTitle}>전체 동의하기</span>
                      <span style={styles.allAgreeSub}>필수 및 선택 약관에 모두 동의합니다.</span>
                    </div>
                  </label>

                  <div style={styles.termsList}>
                    {/* [필수] 이용약관 */}
                    <div style={styles.termItem}>
                      <label style={styles.termLabel}>
                        <input
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          style={styles.checkbox}
                        />
                        <span style={styles.termText}>
                          <strong style={styles.requiredBadge}>[필수]</strong> 이용약관 동의
                        </span>
                      </label>
                      <button 
                        type="button" 
                        onClick={() => setActiveTermsModal('terms')} 
                        style={styles.viewTermsBtn}
                      >
                        내용보기
                      </button>
                    </div>

                    {/* [필수] 개인정보 수집 및 이용 */}
                    <div style={styles.termItem}>
                      <label style={styles.termLabel}>
                        <input
                          type="checkbox"
                          checked={agreePrivacy}
                          onChange={(e) => setAgreePrivacy(e.target.checked)}
                          style={styles.checkbox}
                        />
                        <span style={styles.termText}>
                          <strong style={styles.requiredBadge}>[필수]</strong> 개인정보 수집 및 이용 동의
                        </span>
                      </label>
                      <button 
                        type="button" 
                        onClick={() => setActiveTermsModal('privacy')} 
                        style={styles.viewTermsBtn}
                      >
                        내용보기
                      </button>
                    </div>

                    {/* [선택] 마케팅 정보 수신 */}
                    <div style={styles.marketingContainer}>
                      <div style={styles.termItem}>
                        <label style={styles.termLabel}>
                          <input
                            type="checkbox"
                            checked={isMarketingAll}
                            onChange={handleToggleMarketingAll}
                            style={styles.checkbox}
                          />
                          <span style={styles.termText}>
                            <strong style={styles.optionalBadge}>[선택]</strong> 마케팅 정보 수신 동의
                          </span>
                        </label>
                      </div>

                      {/* 세부 채널 선택 */}
                      <div style={styles.marketingChannels} className="signup-marketing-grid-responsive">
                        <label style={styles.subCheckLabel}>
                          <input
                            type="checkbox"
                            checked={agreeMarketingSMS}
                            onChange={(e) => setAgreeMarketingSMS(e.target.checked)}
                            style={styles.subCheckbox}
                          />
                          <span>SMS 수신</span>
                        </label>

                        <label style={styles.subCheckLabel}>
                          <input
                            type="checkbox"
                            checked={agreeMarketingEmail}
                            onChange={(e) => setAgreeMarketingEmail(e.target.checked)}
                            style={styles.subCheckbox}
                          />
                          <span>이메일 수신</span>
                        </label>

                        <label style={styles.subCheckLabel}>
                          <input
                            type="checkbox"
                            checked={agreeMarketingKakao}
                            onChange={(e) => setAgreeMarketingKakao(e.target.checked)}
                            style={styles.subCheckbox}
                          />
                          <span>카카오 알림톡</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 제출 버튼 */}
                <button
                  type="submit"
                  disabled={!isFormValid || isLoading}
                  style={{
                    ...styles.submitButton,
                    backgroundColor: isFormValid ? '#D84315' : '#E0D6CE',
                    cursor: isFormValid ? 'pointer' : 'not-allowed'
                  }}
                >
                  {isLoading ? (
                    <span style={styles.btnLoadingText}>
                      <span style={styles.spinner}></span> 회원가입 처리 중...
                    </span>
                  ) : (
                    '회원가입하기'
                  )}
                </button>
              </form>

              {/* 로그인 페이지 이동 링크 */}
              <div style={styles.loginRedirectWrapper}>
                <span style={styles.redirectText}>이미 계정이 있으신가요?</span>
                <button
                  type="button"
                  onClick={() => onOpenLogin ? onOpenLogin() : (window.location.hash = '#/')}
                  style={styles.loginLinkBtn}
                >
                  로그인
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      {/* 약관 상세 보기 모달 */}
      {activeTermsModal && (
        <div style={styles.modalOverlay} onClick={() => setActiveTermsModal(null)}>
          <div style={styles.termsModalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.termsModalHeader}>
              <h3 style={styles.termsModalTitle}>
                {activeTermsModal === 'terms' ? '산으로간고등어 이용약관' : '개인정보 수집 및 이용 동의'}
              </h3>
              <button onClick={() => setActiveTermsModal(null)} style={styles.modalCloseBtn}>
                <X size={20} />
              </button>
            </div>
            <div style={styles.termsModalBody}>
              {activeTermsModal === 'terms' ? (
                <div>
                  <h4>제1조 (목적)</h4>
                  <p>본 약관은 '산으로간고등어'(이하 "회사")가 제공하는 온라인 멤버십 및 매장 연계 서비스의 이용과 관련하여 회사와 회원의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
                  <h4>제2조 (회원가입 및 계정관리)</h4>
                  <p>1. 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 본 약관에 동의한다는 의사표시를 함으로서 회원가입을 신청합니다.</p>
                  <p>2. 회사는 등록된 회원에게 매장 포인트 적립, 예약 및 프로모션 안내 서비스를 제공합니다.</p>
                  <h4>제3조 (회원의 의무)</h4>
                  <p>회원은 아이디와 비밀번호에 관한 관리책임을 가지며, 타인에게 양도하거나 대여할 수 없습니다.</p>
                </div>
              ) : (
                <div>
                  <h4>1. 수집하는 개인정보 항목</h4>
                  <p>- 필수항목: 이메일(아이디), 비밀번호, 이름(닉네임), 휴대폰 번호</p>
                  <p>- 선택항목: 마케팅 수신 채널(SMS, 이메일, 카카오톡)</p>
                  <h4>2. 개인정보의 수집 및 이용목적</h4>
                  <p>- 회원 식별 및 본인 확인, 멤버십 스탬프/포인트 적립 및 사용 안내</p>
                  <p>- 공지사항 전달 및 고객 상담 지원</p>
                  <h4>3. 보유 및 이용기간</h4>
                  <p>회원 탈퇴 시까지 보관하며, 관계 법령에 규정된 경우 법정 보존 기간 동안 안전하게 보관 후 파기합니다.</p>
                </div>
              )}
            </div>
            <div style={styles.termsModalFooter}>
              <button 
                onClick={() => {
                  if (activeTermsModal === 'terms') setAgreeTerms(true);
                  if (activeTermsModal === 'privacy') setAgreePrivacy(true);
                  setActiveTermsModal(null);
                }} 
                style={styles.termsAgreeBtn}
              >
                동의하고 닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    backgroundColor: '#FCFAF7',
    color: '#2C1E1A',
    fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: 'flex',
    flexDirection: 'column',
  },
  topNav: {
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #EDE4DC',
    padding: '12px 24px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  topNavInner: {
    maxWidth: '1080px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backHomeBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: 'none',
    border: 'none',
    color: '#5C4E4A',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '8px 12px',
    borderRadius: '8px',
    transition: 'all 0.2s',
  },
  navLogo: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  logoImg: {
    height: '36px',
    objectFit: 'contain',
  },
  navLoginBtn: {
    background: 'none',
    border: '1px solid #D84315',
    color: '#D84315',
    fontSize: '13px',
    fontWeight: '600',
    padding: '6px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  mainContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px 16px 60px',
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: '520px',
    borderRadius: '20px',
    padding: '40px 36px',
    boxShadow: '0 12px 36px rgba(44, 30, 26, 0.08)',
    border: '1px solid #EFE8E1',
  },
  formHeader: {
    textAlign: 'center',
    marginBottom: 28,
  },
  headerBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FBE9E7',
    color: '#D84315',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: 12,
  },
  pageTitle: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#2C1E1A',
    marginBottom: 8,
    letterSpacing: '-0.5px',
  },
  pageSubtitle: {
    fontSize: '14px',
    color: '#8C7E7A',
    lineHeight: '1.5',
  },
  serverErrorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFEBEE',
    color: '#D32F2F',
    padding: '12px 16px',
    borderRadius: '10px',
    fontSize: '13px',
    marginBottom: 20,
    border: '1px solid #FFCDD2',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#3C2E2A',
  },
  requiredMark: {
    color: '#D84315',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  leftIcon: {
    position: 'absolute',
    left: 14,
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '13px 14px 13px 44px',
    borderRadius: '10px',
    border: '1px solid #E8DFD5',
    fontSize: '14px',
    backgroundColor: '#FCFAF7',
    color: '#2C1E1A',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s, background-color 0.2s',
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#8C7E7A',
  },
  rightFeedback: {
    position: 'absolute',
    right: 14,
    display: 'flex',
    alignItems: 'center',
  },
  pwConditionList: {
    display: 'flex',
    gap: 8,
    marginTop: 4,
  },
  conditionChip: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: '12px',
    fontWeight: '600',
    padding: '4px 10px',
    borderRadius: '6px',
    transition: 'all 0.2s',
  },
  errorText: {
    fontSize: '12px',
    color: '#D32F2F',
    marginTop: 2,
  },
  successText: {
    fontSize: '12px',
    color: '#2E7D32',
    marginTop: 2,
  },
  helperText: {
    fontSize: '12px',
    color: '#8C7E7A',
    marginTop: 2,
  },
  termsSection: {
    backgroundColor: '#FAF7F2',
    border: '1px solid #EAE0D5',
    borderRadius: '12px',
    padding: '18px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginTop: 6,
  },
  termsHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  termsSectionTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#3C2E2A',
  },
  allAgreeBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1px solid #E8DFD5',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  allAgreeTextWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  allAgreeTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#2C1E1A',
  },
  allAgreeSub: {
    fontSize: '12px',
    color: '#8C7E7A',
  },
  termsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    paddingTop: 4,
  },
  termItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '13px',
  },
  termLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    cursor: 'pointer',
  },
  termText: {
    color: '#4A3B36',
  },
  requiredBadge: {
    color: '#D84315',
  },
  optionalBadge: {
    color: '#8C7E7A',
  },
  viewTermsBtn: {
    background: 'none',
    border: 'none',
    color: '#8C7E7A',
    fontSize: '12px',
    textDecoration: 'underline',
    cursor: 'pointer',
    padding: 0,
  },
  marketingContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  marketingChannels: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    paddingLeft: 24,
    fontSize: '12px',
    color: '#6C5D58',
  },
  subCheckLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    cursor: 'pointer',
  },
  checkbox: {
    accentColor: '#D84315',
    width: 17,
    height: 17,
    cursor: 'pointer',
    marginTop: 2,
  },
  subCheckbox: {
    accentColor: '#D84315',
    width: 15,
    height: 15,
    cursor: 'pointer',
  },
  submitButton: {
    color: '#FFFFFF',
    padding: '16px 0',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    letterSpacing: '-0.3px',
    boxShadow: '0 4px 12px rgba(216, 67, 21, 0.2)',
    transition: 'all 0.2s',
    marginTop: 8,
  },
  btnLoadingText: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  spinner: {
    width: 16,
    height: 16,
    border: '2px solid #FFFFFF',
    borderTopColor: 'transparent',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.8s linear infinite',
  },
  loginRedirectWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
    paddingTop: 16,
    borderTop: '1px solid #F0E8DF',
    fontSize: '14px',
  },
  redirectText: {
    color: '#8C7E7A',
  },
  loginLinkBtn: {
    background: 'none',
    border: 'none',
    color: '#D84315',
    fontWeight: '700',
    cursor: 'pointer',
    padding: 0,
    textDecoration: 'underline',
  },
  successBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '10px 0',
  },
  successIconWrapper: {
    width: '72px',
    height: '72px',
    backgroundColor: '#FBE9E7',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#2C1E1A',
    marginBottom: 10,
  },
  successDesc: {
    fontSize: '15px',
    color: '#5C4E4A',
    lineHeight: '1.6',
    marginBottom: 24,
  },
  successInfoCard: {
    width: '100%',
    backgroundColor: '#FCFAF7',
    border: '1px solid #EAE0D5',
    borderRadius: '12px',
    padding: '18px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    textAlign: 'left',
    marginBottom: 28,
  },
  successInfoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13px',
  },
  infoLabel: {
    color: '#8C7E7A',
    fontWeight: '500',
  },
  infoValue: {
    color: '#2C1E1A',
    fontWeight: '600',
  },
  infoBadge: {
    color: '#D84315',
    fontWeight: '700',
    backgroundColor: '#FBE9E7',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
  },
  successActionButtons: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  primarySuccessBtn: {
    backgroundColor: '#D84315',
    color: '#FFFFFF',
    padding: '14px 0',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(44, 30, 26, 0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: 16,
  },
  termsModalContent: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: '500px',
    maxHeight: '80vh',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
  },
  termsModalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 20px',
    borderBottom: '1px solid #EFE8E1',
  },
  termsModalTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#2C1E1A',
  },
  modalCloseBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#8C7E7A',
    padding: 4,
  },
  termsModalBody: {
    padding: '20px',
    overflowY: 'auto',
    fontSize: '13px',
    lineHeight: '1.6',
    color: '#5C4E4A',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  termsModalFooter: {
    padding: '14px 20px',
    borderTop: '1px solid #EFE8E1',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  termsAgreeBtn: {
    backgroundColor: '#D84315',
    color: '#FFFFFF',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  }
};
