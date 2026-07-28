import React, { useState } from 'react';
import { Flame, Star, MapPin, Phone, Clock, Compass, ChevronRight, User, LogOut, Check } from 'lucide-react';

export default function Home({ onOpenLogin, onOpenSignup, loggedInUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('menu');

  const menuItems = [
    {
      id: 1,
      name: '화덕 고등어구이',
      price: '16,000원',
      description: '노르웨이 프리미엄 고등어를 400도 화덕에서 구워 겉바속촉의 진수를 보여주는 대표 메뉴',
      isPopular: true,
      category: 'grilled',
      image: '/grilled_mackerel.jpg'
    },
    {
      id: 2,
      name: '화덕 삼치구이',
      price: '17,000원',
      description: '도톰하고 부드러운 살코기로 담백한 맛이 일품인 화덕 삼치구이',
      isPopular: false,
      category: 'grilled',
      image: '/samchi_gui.jpg'
    },
    {
      id: 3,
      name: '화덕 임연수구이',
      price: '16,000원',
      description: '부드러운 식감과 껍질의 고소함이 남다른 전통 화덕 임연수구이',
      isPopular: false,
      category: 'grilled',
      image: '/imyeonsu_gui.jpg'
    },
    {
      id: 4,
      name: '직화 제육구이',
      price: '17,000원',
      description: '은은한 불향과 비법 양념으로 매콤달콤하게 볶아낸 최고급 제육구이',
      isPopular: true,
      category: 'other',
      image: '/jeyuk_gui.jpg'
    },
    {
      id: 5,
      name: '화덕 민어구이',
      price: '22,000원',
      description: '고소하고 쫄깃한 최고급 식감으로 건강과 맛을 모두 사로잡은 별미 구이',
      isPopular: false,
      category: 'grilled',
      image: '/mineo_gui.jpg'
    },
    {
      id: 6,
      name: '여수 먹갈치구이',
      price: '35,000원',
      description: '여수 청정 바다에서 자란 먹갈치를 통으로 노릇하게 구워낸 최고급 명품 갈치구이',
      isPopular: false,
      category: 'grilled',
      image: '/galchi_gui.jpg'
    }
  ];

  const selfBarItems = [
    { name: '홍시를 넣은 알타리 김치', desc: '자연 감칠맛의 홍시로 감싸 아삭함과 깊은 발효의 풍미를 간직한 특제 김치' },
    { name: '수제 즉석 잡채', desc: '매시간 매장 내에서 직접 볶아 따뜻하고 탱글함이 유지되는 명품 잡채' },
    { name: '고등어와 어울리는 산나물', desc: '산지 직송 제철 식재료를 엄선하여 어머니의 손맛으로 무쳐낸 나물 찬' },
    { name: '해남 파래김', desc: '남해 청정 해역의 바다 향을 그대로 담아 고소하고 바삭하게 구워낸 고급 김' }
  ];

  const storyPoints = [
    {
      num: '01',
      tag: '시작',
      title: '산골 아이의 밥상에서 시작했습니다.',
      desc: '사방이 산인 제천에서 자랐습니다. 박달재를 넘어 소금에 절여 온 간고등어 한쪽이 어머니가 올려주시던 반찬의 전부였습니다. 산으로간고등어는 그 밥상의 기억에서 시작됐습니다.'
    },
    {
      num: '02',
      tag: '사람',
      title: '일곱 번 실패하고도 놓지 못한 한 가지.',
      desc: '스물여덟에 여덟 평짜리 생선구이 가게로 시작해 일곱 번 무너졌습니다. 그래도 놓지 못한 건, 그 밥상을 더 많은 사람에게 전하고 싶었기 때문입니다. 지금 이 가게가 여덟 번째, 고등어 한 가지만 서른 해가 넘었습니다.'
    },
    {
      num: '03',
      tag: '원칙',
      title: '가장 좋은 한 마리를 찾아, 매년 노르웨이까지 갑니다.',
      desc: '고등어가 가장 맛있어지는 때는 바다가 정합니다. 매년 11월 직접 가서 보고, 고르고, 한 해 쓸 물량을 한 번에 매입합니다. 노르웨이산이라고 다 같지 않습니다. 어느 때, 어떤 상태인지가 전부입니다.'
    },
    {
      num: '04',
      tag: '한 상',
      title: '생선 한 마리가 아니라, 밥상 한 상을 차립니다.',
      desc: '곤드레는 정선까지, 소금은 산지까지 직접 가서 확인합니다. 전용 화덕을 직접 만들었고, 반찬은 하나까지 저희가 만듭니다. 주인공만 잘하는 집이 되고 싶지 않았습니다.'
    },
    {
      num: '05',
      tag: '한 곳뿐인 이유',
      title: '좋은 재료가 부족해서 매장을 늘리지 않았습니다.',
      desc: '저희가 쓰는 재료는 수량이 정해져 있습니다. 매장을 늘리면 재료를 바꿔야 하고, 재료를 바꾸면 저희가 아니게 됩니다. 성장을 포기한 것이 아니라, 처음 정한 기준을 지키는 중입니다.'
    }
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={styles.container}>
      {/* Navigation Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logo} onClick={() => scrollToSection('hero')}>
            <img src="/brand_logo.png" alt="산으로간고등어 로고" style={styles.logoImage} />
          </div>

          <nav style={styles.nav}>
            <button style={styles.navLink} onClick={() => scrollToSection('story')}>브랜드 스토리</button>
            <button style={styles.navLink} onClick={() => scrollToSection('menu')}>화덕 메뉴</button>
            <button style={styles.navLink} onClick={() => scrollToSection('selfbar')}>프리미엄 셀프바</button>
            <button style={styles.navLink} onClick={() => scrollToSection('location')}>찾아오시는 길</button>
            <a href="#/admin" style={{ ...styles.navLink, color: '#C19A6B', fontWeight: 'bold' }}>관리자페이지</a>
          </nav>

          <div style={styles.authWrapper}>
            {loggedInUser ? (
              <div style={styles.userBadge}>
                <User size={16} color="#C19A6B" />
                <span style={styles.userName}>{loggedInUser.name} 님</span>
                <button onClick={onLogout} style={styles.logoutBtn} title="로그아웃">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <>
                <button onClick={onOpenLogin} style={styles.loginBtn}>로그인</button>
                <button onClick={onOpenSignup} style={styles.signupBtn}>회원가입</button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" style={styles.heroSection}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroBgImage}></div>
        <div style={styles.heroContent} className="container animate-fade">
          <div style={styles.heroTagline}>
            <Flame size={16} color="#D84315" />
            <span>화덕 생선구이의 대명사</span>
          </div>
          <h1 style={styles.heroTitle}>
            400도 특수 화덕에서<br />
            피어나는 자연의 맛
          </h1>
          <p style={styles.heroSubtitle}>
            노르웨이 청정 해역의 프리미엄 고등어와 엄선된 한식을<br />
            가장 완벽한 온도에서 즐겨보세요.
          </p>
          <div style={styles.heroButtons}>
            <button style={styles.heroBtnPrimary} onClick={() => scrollToSection('menu')}>
              메뉴 보러가기 <ChevronRight size={18} />
            </button>
            <button style={styles.heroBtnSecondary} onClick={() => scrollToSection('location')}>
              매장 위치 확인
            </button>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section id="story" style={styles.storySection}>
        <div style={styles.storyContainer} className="container">
          <div style={styles.storyHeader}>
            <span style={styles.sectionSubtitle}>BRAND STORY</span>
            <h2 style={styles.storyHeroTitle}>
              지구에서 가장 좋은 고등어만, 밥상 위에
            </h2>
            <p style={styles.storyHeroSubtitle}>
              산골 아이의 고등어 밥상에서 시작해, 서른 해를 이어온 집.
            </p>
          </div>

          <div style={styles.storyMainGrid}>
            <div style={styles.storyCardsWrapper}>
              {storyPoints.map((item) => (
                <div key={item.num} style={styles.storyCardItem} className="animate-fade">
                  <div style={styles.storyCardHeader}>
                    <span style={styles.storyNumBadge}>{item.num}</span>
                    <span style={styles.storyTagBadge}>{item.tag}</span>
                  </div>
                  <h3 style={styles.storyItemTitle}>{item.title}</h3>
                  <p style={styles.storyItemDesc}>{item.desc}</p>
                </div>
              ))}
            </div>

            <div style={styles.storyStickyImageArea}>
              <div style={styles.storyImageWrapper}>
                <img 
                  src="/grilled_mackerel.jpg" 
                  alt="산으로간고등어 밥상 이야기" 
                  style={styles.storyImage} 
                  className="animate-scale"
                />
                <div style={styles.storyBadge}>
                  <span style={styles.badgeNumber}>30년</span>
                  <span style={styles.badgeText}>이어온 밥상</span>
                </div>
              </div>
            </div>
          </div>

          {/* Closing Banner */}
          <div style={styles.storyClosingBanner} className="animate-fade">
            <h3 style={styles.closingTitle}>한 사람의 기억에서, 모두의 추억으로.</h3>
            <p style={styles.closingDesc}>
              산으로간고등어는 한 사람의 기억에서 시작해, 오래도록 많은 분들의 추억이 되기를 바랍니다.
            </p>
          </div>
        </div>
      </section>

      {/* Menu Highlight Section */}
      <section id="menu" style={styles.menuSection}>
        <div className="container">
          <div style={styles.centerHeader}>
            <span style={styles.sectionSubtitle}>OUR SIGNATURE MENU</span>
            <h2 style={styles.sectionTitle}>메뉴소개</h2>
            <p style={styles.sectionDesc}>엄선한 식재료로 준비한 산으로간고등어의 일품 메뉴입니다.</p>
          </div>

          <div style={styles.menuGrid}>
            {menuItems.map((item) => (
              <div key={item.id} style={styles.menuCard} className="animate-fade menu-card-hover">
                <div style={styles.menuImageContainer}>
                  <img src={item.image} alt={item.name} style={styles.menuImage} className="menu-img-zoom" />
                  {item.isPopular && <span style={styles.popularBadge}>인기 대표</span>}
                </div>
                <div style={styles.menuCardContent}>
                  <div style={styles.menuCardHeader}>
                    <h3 style={styles.menuName}>{item.name}</h3>
                    <span style={styles.menuPrice}>{item.price}</span>
                  </div>
                  <p style={styles.menuDesc}>{item.description}</p>
                  <div style={styles.menuCardFooter}>
                    <span style={styles.menuTag}>🔥 화덕 직화</span>
                    <span style={styles.menuTag}>🥕 셀프바 무제한 포함</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Self Bar Section */}
      <section id="selfbar" style={styles.selfbarSection}>
        <div className="container">
          <div style={styles.storyGrid}>
            <div style={styles.selfBarImageWrapper}>
              <img 
                src="/korean_self_bar_horizontal.png?v=3" 
                alt="산으로간고등어 프리미엄 무한 셀프바" 
                style={styles.selfBarImage}
              />
              <div style={styles.selfBarBadge}>
                <span style={styles.selfBarBadgeText}>DIRECTLY MADE</span>
                <span style={styles.selfBarBadgeTitle}>수제 반찬 셀프바</span>
              </div>
            </div>

            <div style={styles.storyTextWrapper}>
              <span style={styles.sectionSubtitle}>PREMIUM SELF BAR</span>
              <h2 style={styles.sectionTitle}>
                메인만큼 훌륭한 반찬들
              </h2>
              <p style={styles.storyDesc}>
                생선구이와 가장 잘 어울리는 최고급 한식 찬들을 마음껏 즐겨보세요. 
                모든 반찬은 매장에서 셰프들이 신선한 재료로 실시간 조리합니다.
              </p>

              <div style={styles.selfBarGrid}>
                {selfBarItems.map((item, idx) => (
                  <div key={idx} style={styles.selfBarCard}>
                    <div style={styles.selfBarCardHeader}>
                      <Check size={16} color="#D84315" />
                      <h4 style={styles.selfBarCardTitle}>{item.name}</h4>
                    </div>
                    <p style={styles.selfBarCardDesc}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section id="location" style={styles.locationSection}>
        <div className="container">
          <div style={styles.storyGrid}>
            <div style={styles.storyTextWrapper}>
              <span style={styles.sectionSubtitle}>VISIT US</span>
              <h2 style={styles.sectionTitle}>위치 및 이용안내</h2>
              <p style={styles.storyDesc}>
                수지 동천외식타운 내에 위치하여 넓고 여유로운 주차 공간과 품격 있는 실내를 갖추고 있어 가족 모임이나 단체 예약에 적합합니다.
              </p>

              <div style={styles.infoList}>
                <div style={styles.infoItem}>
                  <MapPin size={20} color="#C19A6B" style={{ marginTop: 2 }} />
                  <div>
                    <h5 style={styles.infoTitle}>주소</h5>
                    <p style={styles.infoText}>경기 용인시 수지구 고기로 126 (동천동 115-3)</p>
                  </div>
                </div>
                <div style={styles.infoItem}>
                  <Phone size={20} color="#C19A6B" style={{ marginTop: 2 }} />
                  <div>
                    <h5 style={styles.infoTitle}>전화번호</h5>
                    <p style={styles.infoText}>031-263-6823</p>
                  </div>
                </div>
                <div style={styles.infoItem}>
                  <Clock size={20} color="#C19A6B" style={{ marginTop: 2 }} />
                  <div>
                    <h5 style={styles.infoTitle}>영업시간</h5>
                    <p style={styles.infoText}>매일 10:50 - 21:00</p>
                    <p style={styles.infoTextSub}>브레이크타임 15:50 - 17:00 | 라스트오더 20:15</p>
                  </div>
                </div>
              </div>

              <div style={styles.linkButtons}>
                <a href="https://naver.me/FdCx23Ek" target="_blank" rel="noopener noreferrer" style={styles.naverBtn}>
                  네이버 플레이스 바로가기
                </a>
                <a href="https://www.instagram.com/sangango_official/" target="_blank" rel="noopener noreferrer" style={styles.instaBtn}>
                  공식 인스타그램
                </a>
              </div>
            </div>

            <div style={styles.mapContainer}>
              <div style={styles.mockMap}>
                <div style={styles.mapOverlay}>
                  <MapPin size={36} color="#D84315" style={styles.mapPinPulse} />
                  <div style={styles.mapTooltip}>
                    <strong>산으로간고등어</strong>
                    <span>경기 용인시 수지구 고기로 126</span>
                  </div>
                </div>
                {/* Simulated Road Lines SVG to look premium */}
                <svg width="100%" height="100%" style={styles.mapSvg}>
                  <rect width="100%" height="100%" fill="#EFE8DD" />
                  <path d="M-50,150 Q100,120 400,200 T900,100" fill="none" stroke="#FFFFFF" strokeWidth="24" />
                  <path d="M-50,150 Q100,120 400,200 T900,100" fill="none" stroke="#D3C7B6" strokeWidth="2" strokeDasharray="6,4" />
                  <path d="M200,-50 L250,550" fill="none" stroke="#FFFFFF" strokeWidth="18" />
                  <circle cx="230" cy="180" r="90" fill="#EADFCE" opacity="0.8" />
                  <circle cx="230" cy="180" r="12" fill="#D84315" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div className="container">
          <div style={styles.footerInner}>
            <div style={styles.footerBrand}>
              <span style={styles.footerLogoText}>산으로간고등어</span>
              <p style={styles.footerCopy}>© 2026 산으로간고등어. All Rights Reserved.</p>
            </div>
            <div style={styles.footerDetails}>
              <p>상호명: 주식회사 산고 | 대표자: 홍길동 | 사업자등록번호: 123-45-67890</p>
              <p>통신판매업신고: 제 2026-용인수지-0123호 | 주소: 경기 용인시 수지구 고기로 126</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#FCFAF5',
    color: '#2C1E1A',
  },
  header: {
    position: 'sticky',
    top: 0,
    backgroundColor: 'rgba(252, 250, 245, 0.9)',
    backdropFilter: 'blur(8px)',
    borderBottom: '1px solid #E8DFD5',
    zIndex: 1000,
    transition: 'all 0.3s ease',
  },
  headerInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  logoImage: {
    height: '42px',
    objectFit: 'contain',
  },
  nav: {
    display: 'flex',
    gap: '24px',
  },
  navLink: {
    background: 'none',
    border: 'none',
    fontSize: '15px',
    fontWeight: '500',
    color: '#5C4E4A',
    cursor: 'pointer',
    transition: 'color 0.2s',
    ':hover': {
      color: '#D84315'
    }
  },
  authWrapper: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  loginBtn: {
    background: 'none',
    border: 'none',
    fontSize: '14px',
    fontWeight: '500',
    color: '#5C4E4A',
    cursor: 'pointer',
    padding: '8px 12px',
  },
  signupBtn: {
    backgroundColor: '#D84315',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    padding: '8px 16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#BF360C',
    }
  },
  userBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#F6EFE9',
    padding: '6px 12px',
    borderRadius: '20px',
    border: '1px solid #E8DFD5',
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2C1E1A',
  },
  logoutBtn: {
    background: 'none',
    border: 'none',
    color: '#8C7E7A',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '2px',
    marginLeft: '4px',
    ':hover': {
      color: '#D84315',
    }
  },
  heroSection: {
    position: 'relative',
    height: '600px',
    display: 'flex',
    alignItems: 'center',
    color: '#FFFFFF',
    overflow: 'hidden',
  },
  heroBgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'url("/grilled_mackerel.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: 1,
    transform: 'scale(1.05)',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(28, 16, 12, 0.55)',
    zIndex: 2,
  },
  heroContent: {
    position: 'relative',
    zIndex: 3,
    textAlign: 'left',
  },
  heroTagline: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(4px)',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#FFCCBC',
    marginBottom: '20px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  heroTitle: {
    fontSize: '52px',
    fontWeight: '800',
    lineHeight: '1.2',
    marginBottom: '20px',
    letterSpacing: '-0.02em',
    textShadow: '0 2px 10px rgba(0,0,0,0.3)',
  },
  heroSubtitle: {
    fontSize: '18px',
    lineHeight: '1.6',
    color: '#F5EFEB',
    marginBottom: '32px',
    maxWidth: '600px',
  },
  heroButtons: {
    display: 'flex',
    gap: '16px',
  },
  heroBtnPrimary: {
    backgroundColor: '#D84315',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '6px',
    padding: '14px 28px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'background-color 0.2s, transform 0.2s',
    ':hover': {
      backgroundColor: '#BF360C',
      transform: 'translateY(-2px)',
    }
  },
  heroBtnSecondary: {
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    borderRadius: '6px',
    padding: '14px 28px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s, border-color 0.2s',
    ':hover': {
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderColor: '#FFFFFF',
    }
  },
  storySection: {
    padding: '100px 0',
    backgroundColor: '#FCFAF5',
  },
  storyContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  storyHeader: {
    textAlign: 'center',
    maxWidth: '720px',
    margin: '0 auto 50px auto',
  },
  storyHeroTitle: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#2C1E1A',
    marginBottom: '14px',
    lineHeight: '1.35',
  },
  storyHeroSubtitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#D84315',
    lineHeight: '1.6',
  },
  storyMainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: '48px',
    alignItems: 'start',
  },
  storyCardsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  storyCardItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '28px 32px',
    textAlign: 'left',
    boxShadow: '0 4px 20px rgba(44, 30, 26, 0.04)',
    border: '1px solid #F0E8DF',
  },
  storyCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
  },
  storyNumBadge: {
    fontSize: '14px',
    fontWeight: '800',
    color: '#D84315',
    backgroundColor: '#FBE9E7',
    padding: '4px 10px',
    borderRadius: '20px',
  },
  storyTagBadge: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#C19A6B',
    letterSpacing: '0.05em',
  },
  storyItemTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#2C1E1A',
    marginBottom: '10px',
    lineHeight: '1.4',
  },
  storyItemDesc: {
    fontSize: '15px',
    color: '#5C4E4A',
    lineHeight: '1.7',
    margin: 0,
  },
  storyStickyImageArea: {
    position: 'sticky',
    top: '120px',
  },
  storyClosingBanner: {
    marginTop: '60px',
    backgroundColor: '#2C1E1A',
    color: '#FFFFFF',
    borderRadius: '20px',
    padding: '44px 32px',
    textAlign: 'center',
    boxShadow: '0 12px 32px rgba(44, 30, 26, 0.15)',
    backgroundImage: 'radial-gradient(circle at top right, rgba(216, 67, 21, 0.25), transparent 60%)',
  },
  closingTitle: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#FFCCBC',
    marginBottom: '12px',
  },
  closingDesc: {
    fontSize: '16px',
    color: '#E8DFD5',
    lineHeight: '1.6',
    maxWidth: '680px',
    margin: '0 auto',
  },
  storyImageWrapper: {
    position: 'relative',
  },
  storyImage: {
    width: '100%',
    borderRadius: '16px',
    boxShadow: '0 16px 32px rgba(44, 30, 26, 0.08)',
  },
  storyBadge: {
    position: 'absolute',
    bottom: '-20px',
    left: '-20px',
    backgroundColor: '#D84315',
    color: '#FFFFFF',
    padding: '20px 24px',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 8px 20px rgba(216, 67, 21, 0.3)',
  },
  badgeNumber: {
    fontSize: '28px',
    fontWeight: '800',
    lineHeight: '1',
  },
  badgeText: {
    fontSize: '12px',
    fontWeight: '500',
    marginTop: '4px',
    opacity: 0.9,
  },
  menuSection: {
    padding: '100px 0',
    backgroundColor: '#F6EFE9',
  },
  centerHeader: {
    textAlign: 'center',
    maxWidth: '600px',
    margin: '0 auto 60px auto',
  },
  sectionDesc: {
    fontSize: '16px',
    color: '#8C7E7A',
    marginTop: '10px',
  },
  menuGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '30px',
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    overflow: 'hidden',
    textAlign: 'left',
    boxShadow: '0 4px 12px rgba(44, 30, 26, 0.03)',
    position: 'relative',
    border: '1px solid #E8DFD5',
  },
  menuCardContent: {
    padding: '24px',
  },
  menuImageContainer: {
    width: '100%',
    height: '200px',
    overflow: 'hidden',
    position: 'relative',
  },
  menuImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
  },
  popularBadge: {
    position: 'absolute',
    top: '12px',
    right: '16px',
    backgroundColor: '#D84315',
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: '600',
    padding: '4px 12px',
    borderRadius: '20px',
    boxShadow: '0 2px 6px rgba(216, 67, 21, 0.2)',
    zIndex: 5,
  },
  menuCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '16px',
  },
  menuName: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#2C1E1A',
  },
  menuPrice: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#D84315',
  },
  menuDesc: {
    fontSize: '14px',
    color: '#5C4E4A',
    lineHeight: '1.6',
    marginBottom: '24px',
  },
  menuCardFooter: {
    display: 'flex',
    gap: '8px',
  },
  menuTag: {
    fontSize: '12px',
    color: '#C19A6B',
    backgroundColor: '#FAF2E8',
    padding: '4px 10px',
    borderRadius: '4px',
    fontWeight: '500',
  },
  selfbarSection: {
    padding: '100px 0',
    backgroundColor: '#FCFAF5',
    borderBottom: '1px solid #E8DFD5',
  },
  selfBarImageWrapper: {
    position: 'relative',
  },
  selfBarImage: {
    width: '100%',
    height: 'auto',
    aspectRatio: '16 / 9',
    objectFit: 'cover',
    borderRadius: '16px',
    boxShadow: '0 16px 32px rgba(44, 30, 26, 0.08)',
  },
  selfBarBadge: {
    position: 'absolute',
    top: '24px',
    right: '24px',
    backgroundColor: 'rgba(44, 30, 26, 0.85)',
    backdropFilter: 'blur(4px)',
    color: '#FFFFFF',
    padding: '16px 20px',
    borderRadius: '8px',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  selfBarBadgeText: {
    fontSize: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#C19A6B',
    display: 'block',
  },
  selfBarBadgeTitle: {
    fontSize: '16px',
    fontWeight: '700',
    marginTop: '4px',
  },
  selfBarGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginTop: '32px',
  },
  selfBarCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E8DFD5',
    borderRadius: '8px',
    padding: '18px',
    textAlign: 'left',
    boxShadow: '0 2px 4px rgba(0,0,0,0.01)',
  },
  selfBarCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  selfBarCardTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#2C1E1A',
  },
  selfBarCardDesc: {
    fontSize: '13px',
    color: '#8C7E7A',
    lineHeight: '1.4',
  },
  locationSection: {
    padding: '100px 0',
    backgroundColor: '#FCFAF5',
  },
  infoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    marginBottom: '36px',
  },
  infoItem: {
    display: 'flex',
    gap: '16px',
    textAlign: 'left',
  },
  infoTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#2C1E1A',
    marginBottom: '4px',
  },
  infoText: {
    fontSize: '14px',
    color: '#5C4E4A',
  },
  infoTextSub: {
    fontSize: '12px',
    color: '#8C7E7A',
    marginTop: '2px',
  },
  linkButtons: {
    display: 'flex',
    gap: '14px',
  },
  naverBtn: {
    backgroundColor: '#03C75A',
    color: '#FFFFFF',
    padding: '12px 20px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
    boxShadow: '0 4px 10px rgba(3, 199, 90, 0.25)',
  },
  instaBtn: {
    backgroundColor: '#FFFFFF',
    color: '#E1306C',
    border: '1px solid #E8DFD5',
    padding: '12px 20px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  mapContainer: {
    width: '100%',
    height: '420px',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 16px 32px rgba(44, 30, 26, 0.08)',
    border: '1px solid #E8DFD5',
  },
  mockMap: {
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: '#EFE8DD',
  },
  mapSvg: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    top: '180px',
    left: '230px',
    transform: 'translate(-50%, -100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 10,
  },
  mapPinPulse: {
    filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.3))',
  },
  mapTooltip: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E8DFD5',
    borderRadius: '8px',
    padding: '10px 14px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    marginTop: '6px',
    width: '180px',
  },
  footer: {
    backgroundColor: '#2C1E1A',
    color: '#8C7E7A',
    padding: '60px 0',
    borderTop: '1px solid #1F1917',
  },
  footerInner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '24px',
  },
  footerBrand: {
    textAlign: 'left',
  },
  footerLogoText: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#F5EFEB',
    display: 'block',
    marginBottom: '8px',
  },
  footerCopy: {
    fontSize: '13px',
  },
  footerDetails: {
    textAlign: 'right',
    fontSize: '12px',
    lineHeight: '1.6',
  }
};
