import React, { useState, useEffect, useCallback, memo } from 'react';
import { Flame, MapPin, Phone, Clock, ChevronRight, User, LogOut, Check, Menu, X, ShoppingBag, Store, Package } from 'lucide-react';
import { getMediaFile } from '../lib/mediaStorage';

const NaverIcon = memo(({ size = 15, color = '#FFFFFF' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
    <path d="M16.273 12.845L7.376 0H0v24h7.727v-12.845L16.624 24H24V0h-7.727v12.845z" />
  </svg>
));

const InstagramIcon = memo(({ size = 16, color = '#E1306C' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
));

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

const banchanItems = [
  {
    id: 1,
    name: '산간고 돌판 7초김 (6장)',
    price: '2,500원~',
    weight: '약 30g (6장)',
    tag: '대표 맥반석',
    desc: '해남에서 온 원초를 뜨거운 430도 맥반석 위에서 딱 7초! 고소한 들기름 향과 바삭함이 일품인 수제 조미김',
    image: '/banchan_7cho_gim.jpg'
  },
  {
    id: 2,
    name: '비법 양념게장',
    price: '15,000원~',
    weight: '1팩',
    tag: '시그니처 별미',
    desc: '살이 꽉 찬 게에 산으로간고등어 특제 매콤달콤 양념을 듬뿍 버무려 흰 쌀밥과 완벽 어울리는 수제 양념게장',
    image: '/banchan_yangnyeom_gejang.jpg'
  },
  {
    id: 3,
    name: '화덕고등어 반마리(진공포장)',
    price: '6,000원~',
    weight: '진공포장 팩',
    tag: '대표 화덕구이',
    desc: '400도 화덕에서 노릇하게 구워진 참맛! 가정에서 에어프라이어나 전자레인지로 간편하게 데워드세요',
    image: '/banchan_mackerel_real_pack.jpg'
  },
  {
    id: 4,
    name: '홍타리 총각김치',
    price: '10,000원~',
    weight: '1kg / 1통',
    tag: '대표 수제김치',
    desc: '신선한 알타리와 달콤한 홍시의 환상 조합! 매장 식당 반찬 맛 그대로 아삭하고 감칠맛 넘치는 수제 김치',
    image: '/banchan_hongtari_real.jpg'
  },
  {
    id: 5,
    name: '정성 밑반찬 3팩',
    price: '10,000원~',
    weight: '3팩 골라담기',
    tag: '당일 생산',
    desc: '당일생산·당일판매! 셰프들이 매일 아침 정성껏 만든 십수 가지 다양한 밑반찬 중 3팩으로 식탁을 채우세요',
    image: '/banchan_mitbanchan_real_3pack.jpg'
  },
  {
    id: 6,
    name: '영양 갈비탕',
    price: '13,000원~',
    weight: '갈비무게만 400g이상',
    tag: '인기 국/탕',
    desc: '맛은 깊고 양은 넉넉! 정성껏 고아낸 진한 육수와 갈비무게만 400g 이상 푸짐한 영양 갈비탕',
    image: '/banchan_galbitang.jpg'
  },
  {
    id: 7,
    name: '수제 고등어빵',
    price: '5,000원~',
    weight: '수제 디저트 빵',
    tag: '시그니처 빵',
    desc: '산으로간고등어 특제 귀여운 고등어 모양의 촉촉하고 달콤한 수제 디저트 빵',
    image: '/banchan_mackerel_bread.jpg'
  },
  {
    id: 8,
    name: '고추장아찌 무침',
    price: '4,000원~',
    weight: '1팩',
    tag: '밥도둑 반찬',
    desc: '매콤달콤 특제 양념으로 감칠맛을 더한 아삭한 고추장아찌 무침',
    image: '/banchan_gochu_jangajji.jpg'
  }
];

const DEFAULT_HERO_MEDIA = {
  type: 'video',
  url: '/hero_video.mp4',
  tagline: '화덕 생선구이의 대명사',
  title: '400도 특수 화덕에서\n피어나는 자연의 맛',
  subtitle: '노르웨이 청정 해역의 프리미엄 고등어와 엄선된 한식을\n가장 완벽한 온도에서 즐겨보세요.',
  autoPlay: true,
  loop: true,
  muted: true
};

export default function Home({ onOpenLogin, onOpenSignup, loggedInUser, onLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [heroMedia, setHeroMedia] = useState(() => {
    const saved = localStorage.getItem('sangango_hero_media');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (parsed) return parsed;
      } catch {}
    }
    return DEFAULT_HERO_MEDIA;
  });

  const [activeMediaUrl, setActiveMediaUrl] = useState(heroMedia.url || '/hero_video.mp4');

  useEffect(() => {
    let activeBlobUrl = null;

    const updateMediaUrl = async (mediaConfig) => {
      if (mediaConfig?.isIndexedDB) {
        const blob = await getMediaFile('hero_media_blob');
        if (blob) {
          if (activeBlobUrl) {
            URL.revokeObjectURL(activeBlobUrl);
          }
          activeBlobUrl = URL.createObjectURL(blob);
          setActiveMediaUrl(activeBlobUrl);
          return;
        }
      }
      if (activeBlobUrl) {
        URL.revokeObjectURL(activeBlobUrl);
        activeBlobUrl = null;
      }
      setActiveMediaUrl(mediaConfig?.url || '/grilled_mackerel.jpg');
    };

    updateMediaUrl(heroMedia);

    const handleHeroUpdate = () => {
      const saved = localStorage.getItem('sangango_hero_media');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setHeroMedia(parsed);
          updateMediaUrl(parsed);
        } catch {}
      }
    };
    window.addEventListener('sangango_hero_updated', handleHeroUpdate);
    window.addEventListener('storage', handleHeroUpdate);
    return () => {
      if (activeBlobUrl) {
        URL.revokeObjectURL(activeBlobUrl);
      }
      window.removeEventListener('sangango_hero_updated', handleHeroUpdate);
      window.removeEventListener('storage', handleHeroUpdate);
    };
  }, [heroMedia]);

  const scrollToSection = useCallback((id) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div style={styles.container}>
      {/* Navigation Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logo} onClick={() => scrollToSection('hero')}>
            <img src="/brand_logo.png" alt="산으로간고등어 로고" style={styles.logoImage} />
          </div>

          {/* Desktop Navigation */}
          <nav style={styles.nav} className="desktop-nav">
            <button style={styles.navLink} onClick={() => scrollToSection('story')}>브랜드 스토리</button>
            <button style={styles.navLink} onClick={() => scrollToSection('menu')}>화덕 메뉴</button>
            <button style={styles.navLink} onClick={() => scrollToSection('selfbar')}>프리미엄 셀프바</button>
            <button style={styles.navLink} onClick={() => scrollToSection('banchanshop')}>반찬가게</button>
            <button style={styles.navLink} onClick={() => scrollToSection('location')}>찾아오시는 길</button>
          </nav>

          {/* Desktop Auth */}
          <div style={styles.authWrapper} className="desktop-auth">
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

          {/* Mobile Hamburger Toggle Button */}
          <button 
            className="mobile-menu-btn" 
            style={{ display: 'none' }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="메뉴 열기/닫기"
          >
            {isMobileMenuOpen ? <X size={26} color="#2C1E1A" /> : <Menu size={26} color="#2C1E1A" />}
          </button>
        </div>

        {/* Mobile Slide-down Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="mobile-drawer animate-fade">
            <button className="mobile-drawer-link" onClick={() => scrollToSection('story')}>브랜드 스토리</button>
            <button className="mobile-drawer-link" onClick={() => scrollToSection('menu')}>화덕 메뉴</button>
            <button className="mobile-drawer-link" onClick={() => scrollToSection('selfbar')}>프리미엄 셀프바</button>
            <button className="mobile-drawer-link" onClick={() => scrollToSection('banchanshop')}>반찬가게</button>
            <button className="mobile-drawer-link" onClick={() => scrollToSection('location')}>찾아오시는 길</button>
            
            <div className="mobile-drawer-auth">
              {loggedInUser ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <User size={18} color="#C19A6B" />
                    <span style={{ fontSize: '15px', fontWeight: '700', color: '#2C1E1A' }}>{loggedInUser.name} 님</span>
                  </div>
                  <button onClick={onLogout} style={{ ...styles.logoutBtn, display: 'flex', alignItems: 'center', gap: 4, color: '#D84315', fontSize: '13px', fontWeight: '600' }}>
                    <LogOut size={16} /> 로그아웃
                  </button>
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => { setIsMobileMenuOpen(false); onOpenLogin(); }} 
                    style={{ ...styles.loginBtn, flex: 1, border: '1px solid #E8DFD5', borderRadius: 8, padding: '10px 0', textAlign: 'center' }}
                  >
                    로그인
                  </button>
                  <button 
                    onClick={() => { setIsMobileMenuOpen(false); onOpenSignup(); }} 
                    style={{ ...styles.signupBtn, flex: 1, borderRadius: 8, padding: '10px 0', textAlign: 'center' }}
                  >
                    회원가입
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="hero" style={styles.heroSection} className="hero-section-responsive">
        <div style={styles.heroOverlay}></div>
        {heroMedia.type === 'video' ? (
          <video
            key={activeMediaUrl}
            src={activeMediaUrl}
            autoPlay={heroMedia.autoPlay ?? true}
            loop={heroMedia.loop ?? true}
            muted={heroMedia.muted ?? true}
            playsInline
            onLoadedMetadata={(e) => {
              if (heroMedia.startTime) {
                e.target.currentTime = heroMedia.startTime;
              }
            }}
            onTimeUpdate={(e) => {
              const v = e.target;
              if (heroMedia.startTime && v.currentTime < heroMedia.startTime) {
                v.currentTime = heroMedia.startTime;
              }
            }}
            onEnded={(e) => {
              e.target.currentTime = heroMedia.startTime || 0;
              e.target.play();
            }}
            style={styles.heroBgVideo}
          />
        ) : (
          <div style={{ ...styles.heroBgImage, backgroundImage: `url("${activeMediaUrl || '/grilled_mackerel.jpg'}")` }}></div>
        )}
        <div style={styles.heroContent} className="container animate-fade">
          <div style={styles.heroTagline}>
            <Flame size={16} color="#D84315" />
            <span>{heroMedia.tagline || '화덕 생선구이의 대명사'}</span>
          </div>
          <h1 style={styles.heroTitle} className="hero-title-responsive">
            {(heroMedia.title || '400도 특수 화덕에서\n피어나는 자연의 맛').split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < (heroMedia.title || '').split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>
          <p style={styles.heroSubtitle} className="hero-subtitle-responsive">
            {(heroMedia.subtitle || '노르웨이 청정 해역의 프리미엄 고등어와 엄선된 한식을\n가장 완벽한 온도에서 즐겨보세요.').split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < (heroMedia.subtitle || '').split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
          <div style={styles.heroButtons} className="hero-buttons-responsive">
            <button style={styles.heroBtnPrimary} className="hero-btn-responsive" onClick={() => scrollToSection('menu')}>
              메뉴 보러가기 <ChevronRight size={18} />
            </button>
            <button style={styles.heroBtnSecondary} className="hero-btn-responsive" onClick={() => scrollToSection('location')}>
              매장 위치 확인
            </button>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section id="story" style={styles.storySection} className="story-section-responsive">
        <div style={styles.storyContainer} className="container">
          <div style={styles.storyHeader}>
            <span style={styles.sectionSubtitle}>BRAND STORY</span>
            <h2 style={styles.storyHeroTitle} className="story-hero-title-responsive">
              지구에서 가장 좋은 고등어만, 밥상 위에
            </h2>
            <p style={styles.storyHeroSubtitle} className="story-hero-subtitle-responsive">
              산골 아이의 고등어 밥상에서 시작해, 서른 해를 이어온 집.
            </p>
          </div>

          <div style={styles.storyMainGrid} className="story-main-grid-responsive">
            <div style={styles.storyCardsWrapper}>
              {storyPoints.map((item) => (
                <div key={item.num} style={styles.storyCardItem} className="animate-fade story-card-item-responsive">
                  <div style={styles.storyCardHeader}>
                    <span style={styles.storyNumBadge}>{item.num}</span>
                    <span style={styles.storyTagBadge}>{item.tag}</span>
                  </div>
                  <h3 style={styles.storyItemTitle} className="story-item-title-responsive">{item.title}</h3>
                  <p style={styles.storyItemDesc} className="story-item-desc-responsive">{item.desc}</p>
                </div>
              ))}
            </div>

            <div style={styles.storyStickyImageArea} className="story-sticky-image-responsive">
              <div style={styles.storyImageWrapper}>
                <img 
                  src="/grilled_mackerel.jpg" 
                  alt="산으로간고등어 밥상 이야기" 
                  style={styles.storyImage} 
                  className="animate-scale"
                  loading="lazy"
                  decoding="async"
                />
                <div style={styles.storyBadge} className="story-badge-responsive">
                  <span style={styles.badgeNumber}>30년</span>
                  <span style={styles.badgeText}>이어온 밥상</span>
                </div>
              </div>
            </div>
          </div>

          {/* Closing Banner */}
          <div style={styles.storyClosingBanner} className="animate-fade story-closing-responsive">
            <h3 style={styles.closingTitle} className="story-closing-title-responsive">한 사람의 기억에서, 모두의 추억으로.</h3>
            <p style={styles.closingDesc} className="story-closing-desc-responsive">
              산으로간고등어는 한 사람의 기억에서 시작해, 오래도록 많은 분들의 추억이 되기를 바랍니다.
            </p>
          </div>
        </div>
      </section>

      {/* Menu Highlight Section */}
      <section id="menu" style={styles.menuSection} className="menu-section-responsive">
        <div className="container">
          <div style={styles.centerHeader}>
            <span style={styles.sectionSubtitle}>OUR SIGNATURE MENU</span>
            <h2 style={styles.sectionTitle}>메뉴소개</h2>
            <p style={styles.sectionDesc}>엄선한 식재료로 준비한 산으로간고등어의 일품 메뉴입니다.</p>
          </div>

          <div style={styles.menuGrid} className="menu-grid-responsive">
            {menuItems.map((item) => (
              <div key={item.id} style={styles.menuCard} className="animate-fade menu-card-hover">
                <div style={styles.menuImageContainer}>
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    style={styles.menuImage} 
                    className="menu-img-zoom" 
                    loading="lazy"
                    decoding="async"
                  />
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
      <section id="selfbar" style={styles.selfbarSection} className="selfbar-section-responsive">
        <div className="container">
          <div style={styles.storyGrid} className="selfbar-main-grid-responsive">
            <div style={styles.selfBarImageWrapper}>
              <img 
                src="/korean_self_bar_horizontal.png?v=3" 
                alt="산으로간고등어 프리미엄 무한 셀프바" 
                style={styles.selfBarImage}
                loading="lazy"
                decoding="async"
              />
              <div style={styles.selfBarBadge} className="selfbar-badge-responsive">
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

              <div style={styles.selfBarGrid} className="selfbar-grid-responsive">
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

      {/* Banchan Shop Section */}
      <section id="banchanshop" style={styles.banchanSection} className="banchan-section-responsive">
        <div className="container">
          <div style={styles.centerHeader}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#FBE9E7', padding: '6px 16px', borderRadius: '20px', marginBottom: '14px' }}>
              <ShoppingBag size={16} color="#D84315" />
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#D84315', letterSpacing: '0.05em' }}>TAKEOUT & DELIVER</span>
            </div>
            <h2 style={styles.sectionTitle}>산으로간고등어 반찬가게</h2>
            <p style={styles.sectionDesc}>
              매장의 깊은 손맛 그대로! 셰프들이 매일 아침 직접 조리하는 정성 수제 반찬과<br className="desktop-only" />
              400도 초벌 화덕 생선을 포장 및 신선 택배로 집에서 만나보세요.
            </p>
          </div>

          {/* Banchan Grid */}
          <div style={styles.banchanGrid} className="banchan-grid-responsive">
            {banchanItems.map((item) => (
              <div key={item.id} style={styles.banchanCard} className="animate-fade banchan-card-hover">
                <div style={styles.banchanImageWrapper}>
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    style={styles.banchanImage} 
                    className="menu-img-zoom" 
                    loading="lazy"
                    decoding="async"
                  />
                  <span style={styles.banchanTag}>{item.tag}</span>
                </div>
                <div style={styles.banchanCardContent}>
                  <div style={styles.banchanCardHeader}>
                    <h3 style={styles.banchanName}>{item.name}</h3>
                  </div>
                  <p style={styles.banchanDesc}>{item.desc}</p>
                  <div style={styles.banchanCardFooter}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={styles.banchanWeight}>{item.weight}</span>
                      <span style={styles.banchanPrice}>{item.price}</span>
                    </div>
                    <a
                      href="https://map.naver.com/p/search/%EC%82%B0%EC%9C%BC%EB%A1%9C%EA%B0%84%EA%B3%A4%EB%93%B1%EC%96%B4%20%EB%B0%98%EC%B0%AC%EA%B0%80%EA%B2%8C"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.banchanOrderTag}
                    >
                      <Store size={14} /> 매장 포장 / 택배
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Info Card Banner */}
          <div style={styles.banchanInfoBanner} className="animate-fade banchan-info-responsive">
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <Package size={24} color="#FFCCBC" />
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>
                  반찬가게 이용 및 신선 택배 안내
                </h3>
              </div>
              <p style={{ fontSize: '14.5px', color: '#E8DFD5', lineHeight: '1.7', margin: 0 }}>
                • <strong>매장 현장 구매</strong>: 매장 입구 전용 쇼케이스 (매일 11:00 ~ 21:00)<br />
                • <strong>전국 신선 택배</strong>: 아이스팩 냉장 특수 포장으로 신선도 100% 유지 (전국 당일/익일 배송)<br />
                • <strong>전화 주문 및 문의</strong>: 031-263-6823 (네이버 예약 및 반찬 단체 주문 가능)
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => scrollToSection('location')}
                style={styles.banchanBannerBtnPrimary}
              >
                <Store size={18} /> 매장 위치 보기
              </button>
              <a
                href="tel:031-263-6823"
                style={styles.banchanBannerBtnSecondary}
              >
                <Phone size={18} /> 전화 문의하기
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section id="location" style={styles.locationSection} className="location-section-responsive">
        <div className="container">
          <div style={styles.storyGrid} className="location-main-grid-responsive">
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

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }} className="naver-place-buttons-responsive">
                <a 
                  href="https://naver.me/FdCx23Ek" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={styles.naverBtn}
                >
                  <NaverIcon size={14} color="#FFFFFF" />
                  <span>산으로간고등어 네이버 플레이스</span>
                </a>
                <a 
                  href="https://map.naver.com/p/search/%EC%82%B0%EC%9C%BC%EB%A1%9C%EA%B0%84%EA%B3%A4%EB%93%B1%EC%96%B4%20%EB%B0%98%EC%B0%AC%EA%B0%80%EA%B2%8C" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={styles.naverBanchanBtn}
                >
                  <NaverIcon size={14} color="#FFFFFF" />
                  <span>반찬가게 네이버 플레이스</span>
                </a>
                <a 
                  href="https://www.instagram.com/sangango_official/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={styles.instaBtn}
                >
                  <InstagramIcon size={16} color="#FFFFFF" />
                  <span>공식 인스타그램</span>
                </a>
              </div>
            </div>

            <div style={styles.mapContainer} className="location-map-responsive">
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
          <div style={styles.footerInner} className="footer-inner-responsive">
            <div style={styles.footerBrand}>
              <span style={styles.footerLogoText}>산으로간고등어</span>
              <p style={styles.footerCopy}>© 2026 산으로간고등어. All Rights Reserved.</p>
            </div>
            <div style={styles.footerDetails} className="footer-details-responsive">
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
  heroBgVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 1,
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
  banchanSection: {
    padding: '100px 0',
    backgroundColor: '#FFF9F5',
    borderTop: '1px solid #F0E6DD',
    borderBottom: '1px solid #F0E6DD',
  },
  banchanGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    marginBottom: '48px',
  },
  banchanCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1.5px solid #E8DFD5',
    boxShadow: '0 4px 20px rgba(44, 30, 26, 0.04)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    textAlign: 'left',
  },
  banchanImageWrapper: {
    position: 'relative',
    height: '200px',
    overflow: 'hidden',
    backgroundColor: '#F6EFE9',
  },
  banchanImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.4s ease',
  },
  banchanTag: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#FFFFFF',
    backgroundColor: 'rgba(216, 67, 21, 0.9)',
    backdropFilter: 'blur(4px)',
    padding: '4px 10px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  banchanCardContent: {
    padding: '22px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between',
  },
  banchanCardHeader: {
    marginBottom: '8px',
  },
  banchanName: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#2C1E1A',
    lineHeight: '1.35',
  },
  banchanDesc: {
    fontSize: '13.5px',
    color: '#5C4E4A',
    lineHeight: '1.55',
    marginBottom: '20px',
    margin: 0,
  },
  banchanCardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTop: '1px solid #F6EFE9',
    paddingTop: '16px',
    marginTop: 'auto',
  },
  banchanWeight: {
    fontSize: '12px',
    color: '#8C7E7A',
    fontWeight: '500',
    marginBottom: '2px',
  },
  banchanPrice: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#D84315',
  },
  banchanOrderTag: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#C19A6B',
    backgroundColor: '#FAF5EF',
    padding: '8px 12px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    textDecoration: 'none',
    transition: 'all 0.2s',
  },
  banchanInfoBanner: {
    backgroundColor: '#2C1E1A',
    color: '#FFFFFF',
    borderRadius: '16px',
    padding: '32px 36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '32px',
    boxShadow: '0 12px 32px rgba(44, 30, 26, 0.15)',
    backgroundImage: 'radial-gradient(circle at top left, rgba(216, 67, 21, 0.2), transparent 50%)',
    textAlign: 'left',
  },
  banchanBannerBtnPrimary: {
    backgroundColor: '#D84315',
    color: '#FFFFFF',
    padding: '14px 22px',
    borderRadius: '10px',
    fontSize: '14.5px',
    fontWeight: '700',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 14px rgba(216, 67, 21, 0.3)',
    transition: 'all 0.2s',
  },
  banchanBannerBtnSecondary: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    color: '#FFFFFF',
    padding: '14px 22px',
    borderRadius: '10px',
    fontSize: '14.5px',
    fontWeight: '700',
    border: '1px solid rgba(255,255,255,0.25)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    transition: 'all 0.2s',
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
    padding: '14px 10px',
    borderRadius: '10px',
    fontSize: '13.5px',
    fontWeight: '700',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    boxShadow: '0 4px 12px rgba(3, 199, 90, 0.25)',
    textDecoration: 'none',
    lineHeight: '1.3',
    minHeight: '48px',
  },
  naverBanchanBtn: {
    backgroundColor: '#028A3E',
    color: '#FFFFFF',
    padding: '14px 10px',
    borderRadius: '10px',
    fontSize: '13.5px',
    fontWeight: '700',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    boxShadow: '0 4px 12px rgba(2, 138, 62, 0.25)',
    textDecoration: 'none',
    lineHeight: '1.3',
    minHeight: '48px',
  },
  instaBtn: {
    backgroundColor: '#E1306C',
    color: '#FFFFFF',
    padding: '14px 10px',
    borderRadius: '10px',
    fontSize: '13.5px',
    fontWeight: '700',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    textDecoration: 'none',
    boxShadow: '0 4px 12px rgba(225, 48, 108, 0.25)',
    lineHeight: '1.3',
    minHeight: '48px',
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
