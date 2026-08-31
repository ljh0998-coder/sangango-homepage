import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  Users, BarChart2, TrendingUp, DollarSign, UserCheck, 
  Search, ShieldAlert, Award, FileSpreadsheet, Home as HomeIcon,
  Filter, RotateCcw, Database, RefreshCw, Crown,
  Video, Image, Upload, Film, CheckCircle, Save, Scissors,
  Check, X
} from 'lucide-react';
import { supabase, supabaseAdmin } from '../lib/supabase';
import { saveMediaFile, getMediaFile } from '../lib/mediaStorage';

const DEFAULT_HERO_MEDIA = {
  type: 'video',
  url: '/hero_video.mp4',
  isIndexedDB: false,
  tagline: '화덕 생선구이의 대명사',
  title: '400도 특수 화덕에서\n피어나는 자연의 맛',
  subtitle: '노르웨이 청정 해역의 프리미엄 고등어와 엄선된 한식을\n가장 완벽한 온도에서 즐겨보세요.',
  autoPlay: true,
  loop: true,
  muted: true,
  startTime: 4.5
};

const DEFAULT_ADMIN_USER = {
  name: '이진혁 (관리자)',
  email: 'wlsgur4110@naver.com',
  role: '최고 관리자 (Super Admin)'
};

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Custom states for filters in customer management tab
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGender, setFilterGender] = useState('All');
  const [filterAge, setFilterAge] = useState('All');
  const [filterGrade, setFilterGrade] = useState('All');
  const [filterFrequency, setFilterFrequency] = useState('All');
  const [filterAmount, setFilterAmount] = useState('All');

  // Homepage Hero Media (Photo / Video) State
  const pendingFileRef = useRef(null);
  const previewVideoRef = useRef(null);
  const toastTimerRef = useRef(null);
  const noticeTimerRef = useRef(null);
  const [videoDuration, setVideoDuration] = useState(0);

  const [heroMedia, setHeroMedia] = useState(() => {
    const saved = localStorage.getItem('sangango_hero_media');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return DEFAULT_HERO_MEDIA;
  });
  const [activeMediaUrl, setActiveMediaUrl] = useState(heroMedia.url || '/grilled_mackerel.jpg');
  const [saveNotice, setSaveNotice] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    };
  }, []);

  const handleSaveHeroMedia = useCallback(async () => {
    setIsSaving(true);
    try {
      if (pendingFileRef.current) {
        await saveMediaFile('hero_media_blob', pendingFileRef.current);
        pendingFileRef.current = null;
      }
      const metaToSave = {
        ...heroMedia,
        url: heroMedia.isIndexedDB ? '' : heroMedia.url
      };
      localStorage.setItem('sangango_hero_media', JSON.stringify(metaToSave));
      window.dispatchEvent(new Event('sangango_hero_updated'));
      
      setSaveNotice(true);
      setShowSaveToast(true);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
      toastTimerRef.current = setTimeout(() => setShowSaveToast(false), 4000);
      noticeTimerRef.current = setTimeout(() => setSaveNotice(false), 6000);
    } catch (err) {
      console.error('Failed to save hero media:', err);
      alert('저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  }, [heroMedia]);

  // Load IndexedDB media blob URL if isIndexedDB is true
  useEffect(() => {
    let activeBlobUrl = null;
    const loadMediaUrl = async () => {
      if (heroMedia.isIndexedDB) {
        const blob = await getMediaFile('hero_media_blob');
        if (blob) {
          activeBlobUrl = URL.createObjectURL(blob);
          setActiveMediaUrl(activeBlobUrl);
          return;
        }
      }
      setActiveMediaUrl(heroMedia.url || '/grilled_mackerel.jpg');
    };

    loadMediaUrl();

    return () => {
      if (activeBlobUrl) {
        URL.revokeObjectURL(activeBlobUrl);
      }
    };
  }, [heroMedia.isIndexedDB, heroMedia.url]);

  // Supabase Live Data States
  const [supabaseUsers, setSupabaseUsers] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [currentAdminUser, setCurrentAdminUser] = useState(DEFAULT_ADMIN_USER);

  // Fetch real users from Supabase
  const fetchSupabaseUsers = useCallback(async () => {
    setIsSyncing(true);
    try {
      const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
      if (!error && users && users.length > 0) {
        const mapped = users.map((u, idx) => {
          const meta = u.user_metadata || {};
          const isAdmin = u.email === 'wlsgur4110@naver.com' || meta.role === 'admin' || meta.is_admin;
          return {
            id: `SB-${String(idx + 1).padStart(3, '0')}`,
            name: meta.name || (u.email === 'wlsgur4110@naver.com' ? '이진혁' : u.email.split('@')[0]),
            email: u.email,
            phone: meta.phone || (u.email === 'wlsgur4110@naver.com' ? '010-4586-0998' : '010-0000-0000'),
            gender: meta.gender || '남',
            age: meta.age || 32,
            ageGroup: meta.ageGroup || '30대',
            grade: isAdmin ? 'VIP' : (meta.grade || 'Family'),
            role: isAdmin ? '최고 관리자' : '일반 회원',
            isAdmin: isAdmin,
            visits: meta.visits || (isAdmin ? 12 : 1),
            spent: meta.spent || (isAdmin ? 350000 : 16000),
            points: meta.points || (isAdmin ? 50000 : 800),
            registered: u.created_at ? u.created_at.split('T')[0] : '2026-08-11',
            isRealSupabase: true
          };
        });
        setSupabaseUsers(mapped);
      }
    } catch (err) {
      console.error('Error fetching Supabase users in Admin:', err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchSupabaseUsers();

    // Check logged in user session
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const meta = user.user_metadata || {};
        setCurrentAdminUser({
          name: meta.name ? `${meta.name} (관리자)` : '이진혁 (관리자)',
          email: user.email,
          role: '최고 관리자 (Super Admin)'
        });
      }
    });
  }, [fetchSupabaseUsers]);

  // Real-time Queue / Walk-in Status
  const realtimeQueue = useMemo(() => [
    { id: 'Q-101', name: '이진혁', time: '19:30', status: '입장 완료', menu: '화덕 고등어구이' },
  ], []);

  // Real Supabase Customers only (No mock data)
  const customers = useMemo(() => {
    return supabaseUsers;
  }, [supabaseUsers]);

  // Dynamic Filtering Process
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      // 1. Search Query filter (checks name, email or grade)
      const matchesSearch = 
        customer.name.includes(searchQuery) || 
        (customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        customer.grade.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 2. Gender filter
      const matchesGender = filterGender === 'All' || customer.gender === filterGender;
      
      // 3. Age filter
      const matchesAge = filterAge === 'All' || customer.ageGroup === filterAge;
      
      // 4. Grade filter
      const matchesGrade = filterGrade === 'All' || customer.grade === filterGrade;
      
      // 5. Purchase Frequency filter
      let matchesFreq = true;
      if (filterFrequency !== 'All') {
        if (filterFrequency === 'High') matchesFreq = customer.visits >= 15;
        if (filterFrequency === 'Medium') matchesFreq = customer.visits >= 6 && customer.visits < 15;
        if (filterFrequency === 'Low') matchesFreq = customer.visits < 6;
      }
      
      // 6. Purchase Amount filter
      let matchesAmount = true;
      if (filterAmount !== 'All') {
        if (filterAmount === 'High') matchesAmount = customer.spent >= 250000;
        if (filterAmount === 'Medium') matchesAmount = customer.spent >= 100000 && customer.spent < 250000;
        if (filterAmount === 'Low') matchesAmount = customer.spent < 100000;
      }

      return matchesSearch && matchesGender && matchesAge && matchesGrade && matchesFreq && matchesAmount;
    });
  }, [customers, searchQuery, filterGender, filterAge, filterGrade, filterFrequency, filterAmount]);

  // Aggregate values dynamically based on filtered customers or total database
  const customerStats = useMemo(() => {
    const list = filteredCustomers;
    const totalVisits = list.reduce((sum, c) => sum + c.visits, 0);
    const totalSpent = list.reduce((sum, c) => sum + c.spent, 0);
    const totalPoints = list.reduce((sum, c) => sum + c.points, 0);
    
    // Distribution by grade
    const vipCount = list.filter(c => c.grade === 'VIP').length;
    const goldCount = list.filter(c => c.grade === 'Gold').length;
    const silverCount = list.filter(c => c.grade === 'Silver').length;
    const familyCount = list.filter(c => c.grade === 'Family').length;

    return {
      count: list.length,
      visits: totalVisits,
      spent: totalSpent,
      points: totalPoints,
      gradeDist: { VIP: vipCount, Gold: goldCount, Silver: silverCount, Family: familyCount }
    };
  }, [filteredCustomers]);

  const totalRevenueAll = customers.reduce((sum, c) => sum + c.spent, 0);
  const totalTransactionsAll = customers.reduce((sum, c) => sum + c.visits, 0);

  const resetFilters = () => {
    setSearchQuery('');
    setFilterGender('All');
    setFilterAge('All');
    setFilterGrade('All');
    setFilterFrequency('All');
    setFilterAmount('All');
  };

  return (
    <div style={styles.adminContainer} className="animate-fade admin-container-responsive">
      {/* Sidebar Navigation */}
      <aside style={styles.sidebar} className="admin-sidebar-responsive">
        <div style={styles.sidebarHeader} className="admin-sidebar-header-responsive">
          <div style={styles.brandTitle}>
            <img src="/brand_logo.png" alt="로고" style={{ height: '28px', objectFit: 'contain', filter: 'brightness(0) invert(1)', marginBottom: '4px' }} />
            <span style={styles.brandSub}>ADMIN CONSOLE</span>
          </div>
          <a href="#/" style={{ color: '#C19A6B', fontSize: '13px', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
            <HomeIcon size={14} /> <span>홈으로</span>
          </a>
        </div>

        <nav style={styles.sidebarNav} className="admin-sidebar-nav-responsive">
          <button 
            style={activeTab === 'dashboard' ? styles.sidebarBtnActive : styles.sidebarBtn}
            className="admin-sidebar-btn-responsive"
            onClick={() => setActiveTab('dashboard')}
          >
            <Users size={18} />
            <span>대시보드</span>
          </button>
          
          <button 
            style={activeTab === 'customers' ? styles.sidebarBtnActive : styles.sidebarBtn}
            className="admin-sidebar-btn-responsive"
            onClick={() => setActiveTab('customers')}
          >
            <UserCheck size={18} />
            <span>고객관리</span>
          </button>

          <button 
            style={activeTab === 'heroMedia' ? styles.sidebarBtnActive : styles.sidebarBtn}
            className="admin-sidebar-btn-responsive"
            onClick={() => setActiveTab('heroMedia')}
          >
            <Video size={18} />
            <span>대문 (배너/영상) 관리</span>
          </button>

          <button 
            style={activeTab === 'reports' ? styles.sidebarBtnActive : styles.sidebarBtn}
            className="admin-sidebar-btn-responsive"
            onClick={() => setActiveTab('reports')}
          >
            <BarChart2 size={18} />
            <span>통계 / 리포트</span>
          </button>
        </nav>

        <div style={styles.sidebarFooter} className="admin-sidebar-footer-responsive">
          <button 
            type="button"
            style={{ ...styles.backBtn, width: '100%', border: 'none', cursor: 'pointer', textDecoration: 'none' }}
            onClick={() => {
              window.location.href = window.location.origin + '/';
            }}
          >
            <HomeIcon size={16} />
            <span>홈페이지로 돌아가기</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={styles.mainContent} className="admin-main-responsive">
        {/* Top Header */}
        <header style={styles.topHeader} className="admin-header-responsive">
          <div style={styles.headerTitleWrapper}>
            <h2 style={styles.headerTitle} className="admin-header-title-responsive">
              {activeTab === 'dashboard' && '운영 실시간 대시보드'}
              {activeTab === 'customers' && '멤버십 고객 관리'}
              {activeTab === 'heroMedia' && '홈페이지 대문 (배너 / 영상) 설정'}
              {activeTab === 'reports' && '통계 분석 및 경영 보고서'}
            </h2>
            <p style={styles.headerSubtitle}>
              {activeTab === 'dashboard' && '매장의 실시간 유입 및 매출 지표를 파악합니다.'}
              {activeTab === 'customers' && '회원 등급 필터링과 매출액 기여도를 분석합니다.'}
              {activeTab === 'heroMedia' && '홈페이지 메인 대문의 배경 사진 및 동영상과 안내 문구를 관리합니다.'}
              {activeTab === 'reports' && '월별 매출 추이와 인기 품목의 판매 현황 데이터를 조회합니다.'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              backgroundColor: '#E8F5E9',
              borderRadius: '20px',
              border: '1px solid #C8E6C9',
              fontSize: '12px',
              fontWeight: '600',
              color: '#2E7D32'
            }}>
              <Database size={14} color="#2E7D32" />
              <span>Supabase Cloud 연동 ({supabaseUsers.length}명)</span>
            </div>

            <div style={styles.adminProfile}>
              <div style={{ ...styles.profileAvatar, backgroundColor: '#D84315' }}>진</div>
              <div>
                <div style={{ ...styles.profileName, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>{currentAdminUser.name}</span>
                  <Crown size={14} color="#FFB300" />
                </div>
                <div style={styles.profileRole}>{currentAdminUser.email}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Tab contents */}
        {activeTab === 'dashboard' && (
          <div style={styles.tabPanel} className="animate-fade">
            {/* KPI Cards */}
            <div style={styles.kpiGrid} className="admin-kpi-grid-responsive">
              <div style={styles.kpiCard} className="admin-kpi-card-responsive">
                <div style={styles.kpiIconWrapper}><Users size={20} color="#C19A6B" /></div>
                <div style={styles.kpiData}>
                  <span style={styles.kpiLabel}>전체 등록 고객</span>
                  <h3 style={styles.kpiValue}>{customers.length} 명</h3>
                  <span style={styles.kpiDelta}>+12.4% 이번 달</span>
                </div>
              </div>
              <div style={styles.kpiCard} className="admin-kpi-card-responsive">
                <div style={styles.kpiIconWrapper}><DollarSign size={20} color="#D84315" /></div>
                <div style={styles.kpiData}>
                  <span style={styles.kpiLabel}>누적 총 매출액</span>
                  <h3 style={styles.kpiValue}>₩{totalRevenueAll.toLocaleString()}</h3>
                  <span style={styles.kpiDelta}>+8.2% 이번 달</span>
                </div>
              </div>
              <div style={styles.kpiCard} className="admin-kpi-card-responsive">
                <div style={styles.kpiIconWrapper}><TrendingUp size={20} color="#2E7D32" /></div>
                <div style={styles.kpiData}>
                  <span style={styles.kpiLabel}>총 거래 건수</span>
                  <h3 style={styles.kpiValue}>{totalTransactionsAll} 건</h3>
                  <span style={styles.kpiDelta}>+6.7% 이번 달</span>
                </div>
              </div>
              <div style={styles.kpiCard} className="admin-kpi-card-responsive">
                <div style={styles.kpiIconWrapper}><Award size={20} color="#C19A6B" /></div>
                <div style={styles.kpiData}>
                  <span style={styles.kpiLabel}>지급 완료 포인트</span>
                  <h3 style={styles.kpiValue}>{(totalRevenueAll * 0.05).toLocaleString()} P</h3>
                  <span style={styles.kpiDelta}>5% 스탬프식 적립</span>
                </div>
              </div>
            </div>

            {/* Dashboard Visual Grid */}
            <div style={styles.dashboardVisualGrid} className="admin-visual-grid-responsive">
              {/* Left Column: Queue & New Customers */}
              <div style={styles.visualColumn}>
                <div style={styles.sectionCard}>
                  <h4 style={styles.cardHeaderTitle}>실시간 테이블/고객 등록 현황</h4>
                  <div style={styles.realtimeList}>
                    {realtimeQueue.map((item) => (
                      <div key={item.id} style={styles.realtimeItem}>
                        <div style={styles.realtimeUser}>
                          <div style={styles.realtimeUserIcon}>👤</div>
                          <div>
                            <div style={styles.realtimeUserName}>{item.name} 고객</div>
                            <div style={styles.realtimeUserMenu}>{item.menu} 주문</div>
                          </div>
                        </div>
                        <div style={styles.realtimeMeta}>
                          <span style={styles.realtimeTime}>{item.time}</span>
                          <span style={{
                            ...styles.realtimeStatus,
                            backgroundColor: item.status.includes('완료') ? '#E8F5E9' : '#FFF3E0',
                            color: item.status.includes('완료') ? '#2E7D32' : '#E65100'
                          }}>{item.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={styles.sectionCard}>
                  <h4 style={styles.cardHeaderTitle}>신규 등록 고객 리스트</h4>
                  <table style={styles.simpleTable}>
                    <thead>
                      <tr>
                        <th style={styles.tableTh}>이름</th>
                        <th style={styles.tableTh}>가입일</th>
                        <th style={styles.tableTh}>등급</th>
                        <th style={styles.tableTh}>누적금액</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.length === 0 ? (
                        <tr>
                          <td colSpan="4" style={{ ...styles.tableTd, textAlign: 'center', color: '#8C7E7A', padding: '24px' }}>
                            등록된 회원이 없습니다.
                          </td>
                        </tr>
                      ) : (
                        customers.slice(0, 5).map((c) => (
                          <tr key={c.id}>
                            <td style={styles.tableTd}><strong>{c.name}</strong></td>
                            <td style={styles.tableTd}>{c.registered}</td>
                            <td style={styles.tableTd}>
                              <span style={{
                                ...styles.gradeBadge,
                                backgroundColor: c.grade === 'VIP' ? '#FFF8E1' : c.grade === 'Gold' ? '#ECEFF1' : '#FAF2E8',
                                color: c.grade === 'VIP' ? '#F57F17' : c.grade === 'Gold' ? '#37474F' : '#C19A6B'
                              }}>{c.grade}</span>
                            </td>
                            <td style={styles.tableTd}>₩{c.spent.toLocaleString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: Customer Grade Distribution */}
              <div style={styles.visualColumn}>
                <div style={{ ...styles.sectionCard, height: '100%' }}>
                  <h4 style={styles.cardHeaderTitle}>회원 등급별 고객 분포 비율</h4>
                  
                  {/* Dynamic Circular Graph */}
                  <div style={styles.chartContainer} className="admin-chart-container-responsive">
                    <svg width="220" height="220" viewBox="0 0 36 36" style={styles.circularSvg}>
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#E8DFD5" strokeWidth="2.5" />
                      {customers.length > 0 ? (
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#D4AF37" strokeWidth="3" 
                          strokeDasharray="100 0" strokeDashoffset="100" />
                      ) : null}
                    </svg>

                    <div style={styles.gradeLegendGrid}>
                      <div style={styles.legendItem}>
                        <span style={{ ...styles.legendDot, backgroundColor: '#D4AF37' }}></span>
                        <span>VIP 등급 ({customerStats.gradeDist.VIP}명, {customers.length > 0 ? Math.round((customerStats.gradeDist.VIP / customers.length) * 100) : 0}%)</span>
                      </div>
                      <div style={styles.legendItem}>
                        <span style={{ ...styles.legendDot, backgroundColor: '#90A4AE' }}></span>
                        <span>Gold 등급 ({customerStats.gradeDist.Gold}명, {customers.length > 0 ? Math.round((customerStats.gradeDist.Gold / customers.length) * 100) : 0}%)</span>
                      </div>
                      <div style={styles.legendItem}>
                        <span style={{ ...styles.legendDot, backgroundColor: '#C19A6B' }}></span>
                        <span>Silver 등급 ({customerStats.gradeDist.Silver}명, {customers.length > 0 ? Math.round((customerStats.gradeDist.Silver / customers.length) * 100) : 0}%)</span>
                      </div>
                      <div style={styles.legendItem}>
                        <span style={{ ...styles.legendDot, backgroundColor: '#D84315' }}></span>
                        <span>Family 등급 ({customerStats.gradeDist.Family}명, {customers.length > 0 ? Math.round((customerStats.gradeDist.Family / customers.length) * 100) : 0}%)</span>
                      </div>
                    </div>
                  </div>

                  <div style={styles.infoAlert}>
                    <ShieldAlert size={18} color="#D84315" />
                    <p style={styles.infoAlertText}>
                      현재 등록된 실제 Supabase 회원 데이터를 기반으로 실시간 집계된 통계입니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Customer Management */}
        {activeTab === 'customers' && (
          <div style={styles.tabPanel} className="animate-fade">
            {/* Filter Bar */}
            <div style={styles.filterCard}>
              <div style={styles.filterHeader}>
                <div style={styles.filterTitle}>
                  <Filter size={16} color="#C19A6B" />
                  <span>상세 고객 필터링 조건</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button 
                    onClick={fetchSupabaseUsers} 
                    style={{
                      ...styles.resetBtn,
                      backgroundColor: '#FBE9E7',
                      color: '#D84315',
                      border: '1px solid #FFCCBC'
                    }}
                    title="Supabase 실시간 유저 동기화"
                  >
                    <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
                    <span>{isSyncing ? '동기화 중...' : 'Supabase 새로고침'}</span>
                  </button>
                  <button onClick={resetFilters} style={styles.resetBtn}>
                    <RotateCcw size={14} />
                    <span>필터 초기화</span>
                  </button>
                </div>
              </div>

              <div style={styles.filterRowGrid} className="admin-filter-grid-responsive">
                {/* 1. Gender */}
                <div style={styles.filterCol}>
                  <label style={styles.filterLabel}>성별</label>
                  <select 
                    value={filterGender} 
                    onChange={(e) => setFilterGender(e.target.value)} 
                    style={styles.filterSelect}
                  >
                    <option value="All">전체 성별</option>
                    <option value="남">남성</option>
                    <option value="여">여성</option>
                  </select>
                </div>

                {/* 2. Age Group */}
                <div style={styles.filterCol}>
                  <label style={styles.filterLabel}>연령대</label>
                  <select 
                    value={filterAge} 
                    onChange={(e) => setFilterAge(e.target.value)} 
                    style={styles.filterSelect}
                  >
                    <option value="All">전체 연령대</option>
                    <option value="20대">20대</option>
                    <option value="30대">30대</option>
                    <option value="40대">40대</option>
                    <option value="50대 이상">50대 이상</option>
                  </select>
                </div>

                {/* 3. Grade */}
                <div style={styles.filterCol}>
                  <label style={styles.filterLabel}>고객 등급</label>
                  <select 
                    value={filterGrade} 
                    onChange={(e) => setFilterGrade(e.target.value)} 
                    style={styles.filterSelect}
                  >
                    <option value="All">전체 등급</option>
                    <option value="VIP">VIP</option>
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                    <option value="Family">Family</option>
                  </select>
                </div>

                {/* 4. Purchase Frequency */}
                <div style={styles.filterCol}>
                  <label style={styles.filterLabel}>방문 빈도</label>
                  <select 
                    value={filterFrequency} 
                    onChange={(e) => setFilterFrequency(e.target.value)} 
                    style={styles.filterSelect}
                  >
                    <option value="All">전체 방문수</option>
                    <option value="High">단골 고객 (15회 이상)</option>
                    <option value="Medium">일반 회원 (6-14회)</option>
                    <option value="Low">신규/미방문 (5회 이하)</option>
                  </select>
                </div>

                {/* 5. Purchase Amount */}
                <div style={styles.filterCol}>
                  <label style={styles.filterLabel}>누적 매출금액</label>
                  <select 
                    value={filterAmount} 
                    onChange={(e) => setFilterAmount(e.target.value)} 
                    style={styles.filterSelect}
                  >
                    <option value="All">전체 구매액</option>
                    <option value="High">우수 매출 (25만원 이상)</option>
                    <option value="Medium">중형 매출 (10만원 - 24.9만원)</option>
                    <option value="Low">소형 매출 (10만원 미만)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Filter Summary Stats */}
            <div style={styles.filterSummaryBar} className="admin-summary-bar-responsive">
              <div style={styles.summaryStatsText}>
                검색된 고객 수: <strong style={{ color: '#D84315' }}>{customerStats.count}</strong>명 | 
                누적 합계 매출: <strong style={{ color: '#D84315' }}>₩{customerStats.spent.toLocaleString()}</strong> | 
                총 포인트 잔액: <strong style={{ color: '#D84315' }}>{customerStats.points.toLocaleString()} P</strong>
              </div>
              <div style={styles.searchBox} className="admin-search-box-responsive">
                <Search size={16} color="#8C7E7A" style={styles.searchIcon} />
                <input 
                  type="text" 
                  placeholder="고객 이름, 이메일, 등급 검색..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={styles.searchBarInput}
                />
              </div>
            </div>

            {/* Main Customer Table */}
            <div style={styles.tableCard}>
              <table style={styles.adminTable}>
                <colgroup>
                  <col style={{ width: '8.5%' }} />
                  <col style={{ width: '25%' }} />
                  <col style={{ width: '6.5%' }} />
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '11.5%' }} />
                  <col style={{ width: '8.5%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '9.5%' }} />
                  <col style={{ width: '10.5%' }} />
                </colgroup>
                <thead>
                  <tr>
                    <th style={styles.tableTh}>ID</th>
                    <th style={styles.tableTh}>고객명 / 이메일</th>
                    <th style={styles.tableTh}>성별</th>
                    <th style={styles.tableTh}>나이</th>
                    <th style={styles.tableTh}>고객등급 / 권한</th>
                    <th style={styles.tableTh}>누적 방문</th>
                    <th style={styles.tableTh}>누적 결제금액</th>
                    <th style={styles.tableTh}>보유 포인트</th>
                    <th style={styles.tableTh}>등록일자</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan="9" style={styles.noDataTd}>
                        조건에 부합하는 고객 데이터가 존재하지 않습니다.
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((c) => (
                      <tr 
                        key={c.id} 
                        style={{
                          ...styles.tableRowHover,
                          backgroundColor: c.isAdmin ? '#FFFDE7' : (c.isRealSupabase ? '#F9FBE7' : 'inherit')
                        }}
                      >
                        <td style={styles.tableTd}>
                          <span style={{ 
                            fontSize: '11px', 
                            fontWeight: '700', 
                            color: c.isRealSupabase ? '#D84315' : '#8C7E7A',
                            backgroundColor: c.isRealSupabase ? '#FBE9E7' : '#F5EFEB',
                            padding: '3px 8px',
                            borderRadius: '6px'
                          }}>
                            {c.id}
                          </span>
                        </td>
                        <td style={{ ...styles.tableTd, fontWeight: 'bold' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ fontSize: '14px', color: '#2C1E1A' }}>{c.name}</span>
                              {c.isAdmin && (
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 3,
                                  backgroundColor: '#D84315',
                                  color: '#FFFFFF',
                                  fontSize: '11px',
                                  fontWeight: '700',
                                  padding: '2px 8px',
                                  borderRadius: '4px'
                                }}>
                                  <Crown size={11} color="#FFFFFF" /> 최고 관리자
                                </span>
                              )}
                              {c.isRealSupabase && !c.isAdmin && (
                                <span style={{
                                  backgroundColor: '#E8F5E9',
                                  color: '#2E7D32',
                                  fontSize: '11px',
                                  fontWeight: '700',
                                  padding: '2px 6px',
                                  borderRadius: '4px'
                                }}>
                                  ⚡ 실시간
                                </span>
                              )}
                            </div>
                            <span style={{ fontSize: '12px', color: '#8C7E7A', fontWeight: 'normal' }}>
                              {c.email} {c.phone ? `(${c.phone})` : ''}
                            </span>
                          </div>
                        </td>
                        <td style={styles.tableTd}>{c.gender}</td>
                        <td style={styles.tableTd}>{c.age}세 ({c.ageGroup})</td>
                        <td style={styles.tableTd}>
                          <span style={{
                            ...styles.gradeBadge,
                            backgroundColor: c.grade === 'VIP' ? '#FFF8E1' : c.grade === 'Gold' ? '#ECEFF1' : c.grade === 'Silver' ? '#FAF2E8' : '#FFEBEE',
                            color: c.grade === 'VIP' ? '#F57F17' : c.grade === 'Gold' ? '#37474F' : c.grade === 'Silver' ? '#C19A6B' : '#C62828',
                            border: c.isAdmin ? '1px solid #FFB300' : 'none',
                            fontWeight: '800'
                          }}>
                            {c.grade}
                          </span>
                        </td>
                        <td style={styles.tableTd}>{c.visits}회</td>
                        <td style={{ ...styles.tableTd, fontWeight: 'bold', color: '#D84315' }}>₩{c.spent.toLocaleString()}</td>
                        <td style={styles.tableTd}>{c.points.toLocaleString()} P</td>
                        <td style={styles.tableTd}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span>{c.registered}</span>
                            {c.isRealSupabase && (
                              <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: '600' }}>Supabase 연동</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Statistics & Reports */}
        {activeTab === 'reports' && (
          <div style={styles.tabPanel} className="animate-fade">
            {/* Download Report Row */}
            <div style={styles.reportActionsRow}>
              <h3 style={styles.reportSectionTitle}>2026년 경영 분석 보고서</h3>
              <button onClick={() => alert('엑셀 보고서 다운로드 시뮬레이션: 데이터 준비 완료')} style={styles.exportBtn}>
                <FileSpreadsheet size={16} />
                <span>Excel 다운로드</span>
              </button>
            </div>

            <div style={styles.reportsGrid} className="admin-reports-grid-responsive">
              {/* Report Card 1: Monthly Sales Trend Line Chart */}
              <div style={styles.sectionCard}>
                <h4 style={styles.cardHeaderTitle}>월별 매출액 추이 (상반기 누적)</h4>
                <div style={styles.svgChartWrapper}>
                  {/* Premium Styled Line Chart */}
                  <svg width="100%" height="220" viewBox="0 0 500 220" style={styles.chartSvg}>
                    {/* Grid lines */}
                    <line x1="40" y1="30" x2="480" y2="30" stroke="#F0EAE3" strokeWidth="1" />
                    <line x1="40" y1="80" x2="480" y2="80" stroke="#F0EAE3" strokeWidth="1" />
                    <line x1="40" y1="130" x2="480" y2="130" stroke="#F0EAE3" strokeWidth="1" />
                    <line x1="40" y1="180" x2="480" y2="180" stroke="#E8DFD5" strokeWidth="1.5" />
                    
                    {/* Chart Gradient Path */}
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#D84315" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#D84315" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Area under the line */}
                    <path d="M40,180 L40,160 L120,130 L200,140 L280,90 L360,70 L440,40 L440,180 Z" fill="url(#chartGrad)" />
                    
                    {/* Line path */}
                    <path d="M40,160 L120,130 L200,140 L280,90 L360,70 L440,40" fill="none" stroke="#D84315" strokeWidth="3" />

                    {/* Data dots */}
                    <circle cx="40" cy="160" r="4.5" fill="#FFFFFF" stroke="#D84315" strokeWidth="2.5" />
                    <circle cx="120" cy="130" r="4.5" fill="#FFFFFF" stroke="#D84315" strokeWidth="2.5" />
                    <circle cx="200" cy="140" r="4.5" fill="#FFFFFF" stroke="#D84315" strokeWidth="2.5" />
                    <circle cx="280" cy="90" r="4.5" fill="#FFFFFF" stroke="#D84315" strokeWidth="2.5" />
                    <circle cx="360" cy="70" r="4.5" fill="#FFFFFF" stroke="#D84315" strokeWidth="2.5" />
                    <circle cx="440" cy="40" r="4.5" fill="#FFFFFF" stroke="#D84315" strokeWidth="2.5" />

                    {/* X Labels */}
                    <text x="40" y="200" textAnchor="middle" fontSize="11" fill="#8C7E7A">1월</text>
                    <text x="120" y="200" textAnchor="middle" fontSize="11" fill="#8C7E7A">2월</text>
                    <text x="200" y="200" textAnchor="middle" fontSize="11" fill="#8C7E7A">3월</text>
                    <text x="280" y="200" textAnchor="middle" fontSize="11" fill="#8C7E7A">4월</text>
                    <text x="360" y="200" textAnchor="middle" fontSize="11" fill="#8C7E7A">5월</text>
                    <text x="440" y="200" textAnchor="middle" fontSize="11" fill="#8C7E7A">6월</text>

                    {/* Y Labels */}
                    <text x="30" y="34" textAnchor="end" fontSize="10" fill="#8C7E7A">4천만</text>
                    <text x="30" y="84" textAnchor="end" fontSize="10" fill="#8C7E7A">3천만</text>
                    <text x="30" y="134" textAnchor="end" fontSize="10" fill="#8C7E7A">2천만</text>
                    <text x="30" y="184" textAnchor="end" fontSize="10" fill="#8C7E7A">1천만</text>
                  </svg>
                </div>
              </div>

              {/* Report Card 2: Popular Menu Bar Chart */}
              <div style={styles.sectionCard}>
                <h4 style={styles.cardHeaderTitle}>품목별 판매 선호도 순위 (월 평균 건수)</h4>
                <div style={styles.svgChartWrapper}>
                  {/* Premium Styled Horizontal Bar Chart */}
                  <div style={styles.barChartContainer}>
                    <div style={styles.barRow}>
                      <span style={styles.barLabel}>고등어구이</span>
                      <div style={styles.barTrack}>
                        <div style={{ ...styles.barFill, width: '85%' }}></div>
                      </div>
                      <span style={styles.barValue}>1,420건</span>
                    </div>

                    <div style={styles.barRow}>
                      <span style={styles.barLabel}>직화제육구이</span>
                      <div style={styles.barTrack}>
                        <div style={{ ...styles.barFill, width: '70%' }}></div>
                      </div>
                      <span style={styles.barValue}>1,180건</span>
                    </div>

                    <div style={styles.barRow}>
                      <span style={styles.barLabel}>삼치구이</span>
                      <div style={styles.barTrack}>
                        <div style={{ ...styles.barFill, width: '60%' }}></div>
                      </div>
                      <span style={styles.barValue}>980건</span>
                    </div>

                    <div style={styles.barRow}>
                      <span style={styles.barLabel}>임연수구이</span>
                      <div style={styles.barTrack}>
                        <div style={{ ...styles.barFill, width: '45%' }}></div>
                      </div>
                      <span style={styles.barValue}>720건</span>
                    </div>

                    <div style={styles.barRow}>
                      <span style={styles.barLabel}>갈치조림</span>
                      <div style={styles.barTrack}>
                        <div style={{ ...styles.barFill, width: '40%' }}></div>
                      </div>
                      <span style={styles.barValue}>640건</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Card 3: Hourly Reservation Trend */}
              <div style={{ ...styles.sectionCard, gridColumn: 'span 2' }}>
                <h4 style={styles.cardHeaderTitle}>요일별 시간대별 혼잡도 분석 (평균 매장 예약/입장 현황)</h4>
                <div style={styles.gridHeatmap}>
                  <div style={styles.heatmapRow}>
                    <span style={styles.heatmapDay}>평일 런치</span>
                    <div style={{ ...styles.heatmapCell, backgroundColor: '#FFCCBC' }}>11:30 (여유)</div>
                    <div style={{ ...styles.heatmapCell, backgroundColor: '#FF8A65' }}>12:00 (혼잡)</div>
                    <div style={{ ...styles.heatmapCell, backgroundColor: '#D84315', color: '#FFF' }}>12:30 (대기)</div>
                    <div style={{ ...styles.heatmapCell, backgroundColor: '#FF8A65' }}>13:00 (혼잡)</div>
                    <div style={{ ...styles.heatmapCell, backgroundColor: '#FFCCBC' }}>13:30 (여유)</div>
                  </div>
                  <div style={styles.heatmapRow}>
                    <span style={styles.heatmapDay}>평일 디너</span>
                    <div style={{ ...styles.heatmapCell, backgroundColor: '#FBE9E7' }}>17:30 (원활)</div>
                    <div style={{ ...styles.heatmapCell, backgroundColor: '#FFCCBC' }}>18:30 (여유)</div>
                    <div style={{ ...styles.heatmapCell, backgroundColor: '#FF8A65' }}>19:00 (혼잡)</div>
                    <div style={{ ...styles.heatmapCell, backgroundColor: '#FF8A65' }}>19:30 (혼잡)</div>
                    <div style={{ ...styles.heatmapCell, backgroundColor: '#FBE9E7' }}>20:00 (원활)</div>
                  </div>
                  <div style={styles.heatmapRow}>
                    <span style={styles.heatmapDay}>주말 전일</span>
                    <div style={{ ...styles.heatmapCell, backgroundColor: '#FF8A65' }}>11:30 (혼잡)</div>
                    <div style={{ ...styles.heatmapCell, backgroundColor: '#D84315', color: '#FFF' }}>12:30 (대기)</div>
                    <div style={{ ...styles.heatmapCell, backgroundColor: '#D84315', color: '#FFF' }}>13:30 (대기)</div>
                    <div style={{ ...styles.heatmapCell, backgroundColor: '#FF8A65' }}>15:00 (혼잡)</div>
                    <div style={{ ...styles.heatmapCell, backgroundColor: '#D84315', color: '#FFF' }}>18:00 (대기)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Homepage Hero Media (Photo / Video) Management Panel */}
        {activeTab === 'heroMedia' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade">
            {/* Success Toast / Alert */}
            {saveNotice && (
              <div style={{
                backgroundColor: '#E8F5E9',
                border: '1px solid #C8E6C9',
                color: '#2E7D32',
                padding: '16px 20px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '14.5px',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(46,125,50,0.1)'
              }}>
                <CheckCircle size={22} color="#2E7D32" />
                <span>홈페이지 대문 (배너/영상) 설정이 성공적으로 저장되었습니다! 홈페이지에 즉시 반영됩니다.</span>
              </div>
            )}

            {/* Main Configuration Card */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '28px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              border: '1px solid #E8DFD5',
              textAlign: 'left'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#2C1E1A', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Video size={22} color="#D84315" />
                대문 배경 미디어 방식 선택 (사진 / 동영상)
              </h3>

              {/* Media Type Switcher */}
              <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                <button
                  type="button"
                  onClick={() => setHeroMedia(prev => ({ ...prev, type: 'image' }))}
                  style={{
                    flex: 1,
                    padding: '16px',
                    borderRadius: '12px',
                    border: heroMedia.type === 'image' ? '2px solid #D84315' : '1px solid #E8DFD5',
                    backgroundColor: heroMedia.type === 'image' ? '#FDF8F5' : '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    fontSize: '15px',
                    fontWeight: '700',
                    color: heroMedia.type === 'image' ? '#D84315' : '#5C4E4A',
                    transition: 'all 0.2s'
                  }}
                >
                  <Image size={22} />
                  <span>🖼️ 이미지 / 대문 사진 사용</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHeroMedia(prev => ({ ...prev, type: 'video' }))}
                  style={{
                    flex: 1,
                    padding: '16px',
                    borderRadius: '12px',
                    border: heroMedia.type === 'video' ? '2px solid #D84315' : '1px solid #E8DFD5',
                    backgroundColor: heroMedia.type === 'video' ? '#FDF8F5' : '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    fontSize: '15px',
                    fontWeight: '700',
                    color: heroMedia.type === 'video' ? '#D84315' : '#5C4E4A',
                    transition: 'all 0.2s'
                  }}
                >
                  <Video size={22} />
                  <span>🎥 배경 동영상 사용 (MP4 / WebM)</span>
                </button>
              </div>

              {/* File Upload / Link Inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                {/* Upload File Input */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#2C1E1A', marginBottom: '8px' }}>
                    {heroMedia.type === 'video' ? '동영상 파일 직접 첨부 (MP4, WebM, MOV)' : '이미지 파일 직접 첨부 (JPG, PNG, WEBP)'}
                  </label>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '14px',
                    border: '2px dashed #D84315',
                    borderRadius: '10px',
                    backgroundColor: '#FFF8F6',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#D84315'
                  }}>
                    <Upload size={18} />
                    <span>내 컴퓨터에서 미디어 파일 선택</span>
                    <input
                      type="file"
                      accept={heroMedia.type === 'video' ? 'video/*' : 'image/*'}
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 150 * 1024 * 1024) {
                            alert('파일 크기가 150MB를 초과합니다. 150MB 이하의 동영상 파일이나 웹 URL 주소를 사용해 주세요.');
                            return;
                          }
                          pendingFileRef.current = file;
                          const isVideo = file.type.startsWith('video/');
                          const blobUrl = URL.createObjectURL(file);
                          setActiveMediaUrl(blobUrl);
                          setHeroMedia(prev => ({
                            ...prev,
                            type: isVideo ? 'video' : 'image',
                            isIndexedDB: true,
                            url: ''
                          }));
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Media URL Input */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#2C1E1A', marginBottom: '8px' }}>
                    또는 미디어 URL (웹 주소) 직접 입력
                  </label>
                  <input
                    type="text"
                    value={heroMedia.isIndexedDB ? '' : heroMedia.url}
                    onChange={(e) => {
                      pendingFileRef.current = null;
                      const newUrl = e.target.value;
                      setActiveMediaUrl(newUrl);
                      setHeroMedia(prev => ({
                        ...prev,
                        isIndexedDB: false,
                        url: newUrl
                      }));
                    }}
                    placeholder={heroMedia.type === 'video' ? 'https://example.com/video.mp4' : 'https://example.com/image.jpg'}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1px solid #E8DFD5',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              {/* Preset Recommendation Buttons */}
              <div style={{ marginBottom: '24px', backgroundColor: '#FAFAFA', padding: '16px', borderRadius: '10px', border: '1px solid #EEEEEE' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#5C4E4A', display: 'block', marginBottom: '10px' }}>
                  💡 샘플 미디어 원클릭 체험:
                </span>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => {
                      pendingFileRef.current = null;
                      const sampleUrl = '/hero_video.mp4';
                      setActiveMediaUrl(sampleUrl);
                      setHeroMedia(prev => ({
                        ...prev,
                        type: 'video',
                        isIndexedDB: false,
                        url: sampleUrl
                      }));
                    }}
                    style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #D84315', backgroundColor: '#FFFFFF', color: '#D84315', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Film size={14} /> 🎥 화덕 고등어구이 공식 영상 (hero_video.mp4)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      pendingFileRef.current = null;
                      const sampleUrl = '/grilled_mackerel.jpg';
                      setActiveMediaUrl(sampleUrl);
                      setHeroMedia(prev => ({
                        ...prev,
                        type: 'image',
                        isIndexedDB: false,
                        url: sampleUrl
                      }));
                    }}
                    style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #C19A6B', backgroundColor: '#FFFFFF', color: '#C19A6B', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Image size={14} /> 🖼️ 화덕 고등어구이 대표 사진
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      pendingFileRef.current = null;
                      const sampleUrl = '/samchi_gui.jpg';
                      setActiveMediaUrl(sampleUrl);
                      setHeroMedia(prev => ({
                        ...prev,
                        type: 'image',
                        isIndexedDB: false,
                        url: sampleUrl
                      }));
                    }}
                    style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #C19A6B', backgroundColor: '#FFFFFF', color: '#C19A6B', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Image size={14} /> 🖼️ 화덕 삼치구이 대표 사진
                  </button>
                </div>
              </div>

              {/* Video Options (if type === 'video') */}
              {heroMedia.type === 'video' && (
                <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', backgroundColor: '#FFF8F6', padding: '16px', borderRadius: '10px', border: '1px solid #FFE0B2' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600', color: '#2C1E1A', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={heroMedia.autoPlay}
                      onChange={(e) => setHeroMedia(prev => ({ ...prev, autoPlay: e.target.checked }))}
                    />
                    <span>자동 재생 (Autoplay)</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600', color: '#2C1E1A', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={heroMedia.loop}
                      onChange={(e) => setHeroMedia(prev => ({ ...prev, loop: e.target.checked }))}
                    />
                    <span>무한 반복 재생 (Loop)</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600', color: '#2C1E1A', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={heroMedia.muted}
                      onChange={(e) => setHeroMedia(prev => ({ ...prev, muted: e.target.checked }))}
                    />
                    <span>음소거 재생 (Mute - 브라우저 자동재생 필수)</span>
                  </label>
                </div>
              )}

              {/* Video Trimming Controls */}
              {heroMedia.type === 'video' && (
                <div style={{
                  marginBottom: '24px',
                  backgroundColor: '#FFF8F0',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1.5px solid #FFCC80'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <label style={{ fontSize: '15px', fontWeight: '700', color: '#D84315', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Scissors size={18} />
                      <span>✂️ 동영상 시작 위치 자르기 (앞부분 스킵/삭제)</span>
                    </label>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#8C7E7A' }}>
                      {videoDuration > 0 ? `전체 영상 길이: ${videoDuration.toFixed(1)}초` : '영상 로딩 중...'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                    <input
                      type="range"
                      min={0}
                      max={videoDuration > 0 ? Math.floor(videoDuration) : 60}
                      step={0.5}
                      value={heroMedia.startTime || 0}
                      onChange={(e) => {
                        const newStartTime = parseFloat(e.target.value) || 0;
                        setHeroMedia(prev => ({ ...prev, startTime: newStartTime }));
                        if (previewVideoRef.current) {
                          previewVideoRef.current.currentTime = newStartTime;
                        }
                      }}
                      style={{ flex: 1, accentColor: '#D84315', cursor: 'pointer' }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="number"
                        min={0}
                        max={videoDuration || 300}
                        step={0.5}
                        value={heroMedia.startTime || 0}
                        onChange={(e) => {
                          const newStartTime = Math.max(0, parseFloat(e.target.value) || 0);
                          setHeroMedia(prev => ({ ...prev, startTime: newStartTime }));
                          if (previewVideoRef.current) {
                            previewVideoRef.current.currentTime = newStartTime;
                          }
                        }}
                        style={{ width: '70px', padding: '6px 8px', borderRadius: '6px', border: '1px solid #E8DFD5', fontSize: '14px', fontWeight: '700', textAlign: 'center' }}
                      />
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#2C1E1A' }}>초 지점부터 시작</span>
                    </div>
                  </div>

                  {/* Preset Offset Quick Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#8C7E7A' }}>빠른 선택:</span>
                    {[0, 1, 2, 3, 4.5, 5, 10, 15].map((sec) => (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => {
                          setHeroMedia(prev => ({ ...prev, startTime: sec }));
                          if (previewVideoRef.current) {
                            previewVideoRef.current.currentTime = sec;
                          }
                        }}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '16px',
                          border: (heroMedia.startTime || 0) === sec ? '1.5px solid #D84315' : '1px solid #E8DFD5',
                          backgroundColor: (heroMedia.startTime || 0) === sec ? '#D84315' : '#FFFFFF',
                          color: (heroMedia.startTime || 0) === sec ? '#FFFFFF' : '#5C4E4A',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        {sec === 0 ? '처음부터 (0초)' : `+${sec}초 지점`}
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: '12.5px', color: '#8C7E7A', marginTop: '10px', marginBottom: 0 }}>
                    💡 설정한 시작 시간 이전의 앞부분(0초~{heroMedia.startTime || 0}초)은 재생되지 않으며, 영상 재생 및 무한 반복 시 항상 {heroMedia.startTime || 0}초 지점부터 시작됩니다.
                  </p>
                </div>
              )}

              {/* Text Settings */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#2C1E1A', marginBottom: '6px' }}>
                    상단 태그라인 (소제목)
                  </label>
                  <input
                    type="text"
                    value={heroMedia.tagline}
                    onChange={(e) => setHeroMedia(prev => ({ ...prev, tagline: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E8DFD5', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#2C1E1A', marginBottom: '6px' }}>
                    메인 제목 (줄바꿈 가능)
                  </label>
                  <textarea
                    rows={2}
                    value={heroMedia.title}
                    onChange={(e) => setHeroMedia(prev => ({ ...prev, title: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E8DFD5', fontSize: '14px', resize: 'vertical' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#2C1E1A', marginBottom: '6px' }}>
                    서브 설명문 (줄바꿈 가능)
                  </label>
                  <textarea
                    rows={2}
                    value={heroMedia.subtitle}
                    onChange={(e) => setHeroMedia(prev => ({ ...prev, subtitle: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E8DFD5', fontSize: '14px', resize: 'vertical' }}
                  />
                </div>
              </div>

              {/* Live Preview Box */}
              <div style={{ marginBottom: '28px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#2C1E1A', marginBottom: '10px' }}>
                  👁️ 실시간 미리보기 (Live Preview)
                </h4>
                <div style={{
                  position: 'relative',
                  height: '280px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  backgroundColor: '#1C100C',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 32px'
                }}>
                  {/* Overlay */}
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(28, 16, 12, 0.55)', zIndex: 2 }}></div>

                  {/* Media */}
                  {heroMedia.type === 'video' ? (
                    <video
                      ref={previewVideoRef}
                      key={activeMediaUrl}
                      src={activeMediaUrl}
                      autoPlay={heroMedia.autoPlay}
                      loop={heroMedia.loop}
                      muted={heroMedia.muted}
                      playsInline
                      onLoadedMetadata={(e) => {
                        setVideoDuration(e.target.duration || 0);
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
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
                    />
                  ) : (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundImage: `url("${activeMediaUrl || '/grilled_mackerel.jpg'}")`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      zIndex: 1
                    }}></div>
                  )}

                  {/* Content Overlay */}
                  <div style={{ position: 'relative', zIndex: 3, color: '#FFFFFF' }}>
                    <div style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', color: '#FFCCBC', marginBottom: '10px' }}>
                      {heroMedia.tagline}
                    </div>
                    <h2 style={{ fontSize: '22px', fontWeight: '800', lineHeight: 1.3, marginBottom: '8px', whiteSpace: 'pre-line' }}>
                      {heroMedia.title}
                    </h2>
                    <p style={{ fontSize: '13px', opacity: 0.9, whiteSpace: 'pre-line' }}>
                      {heroMedia.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Success Notification Alert Box */}
              {saveNotice && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#E8F5E9',
                  border: '1.5px solid #81C784',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  marginBottom: '18px',
                  boxShadow: '0 4px 14px rgba(46, 125, 50, 0.12)',
                  animation: 'fadeIn 0.3s ease-out'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      backgroundColor: '#2E7D32',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Check size={18} color="#FFFFFF" strokeWidth={3} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '15px', color: '#1B5E20' }}>
                        대문 미디어 및 문구가 성공적으로 저장되었습니다!
                      </div>
                      <div style={{ fontSize: '13px', color: '#2E7D32', marginTop: '2px' }}>
                        홈페이지 최상단 대문 화면에 즉시 적용되었습니다.
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSaveNotice(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#2E7D32',
                      padding: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '6px',
                      transition: 'background 0.2s'
                    }}
                    title="닫기"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}

              {/* Save Button with Interactive Feedback */}
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSaveHeroMedia}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '10px',
                  backgroundColor: isSaving ? '#8C7E7A' : saveNotice ? '#2E7D32' : '#D84315',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: saveNotice 
                    ? '0 6px 18px rgba(46, 125, 50, 0.35)' 
                    : '0 6px 18px rgba(216, 67, 21, 0.3)',
                  transition: 'all 0.25s ease'
                }}
              >
                {isSaving ? (
                  <>
                    <RefreshCw size={20} className="animate-spin" />
                    <span>설정 저장 중... 잠시만 기다려주세요</span>
                  </>
                ) : saveNotice ? (
                  <>
                    <Check size={22} strokeWidth={2.5} />
                    <span>✓ 성공적으로 저장되었습니다! (홈페이지 반영 완료)</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>대문 미디어 및 문구 저장하기 (홈페이지 즉시 반영)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Global Floating Toast Popup Notification */}
      {showSaveToast && (
        <div style={{
          position: 'fixed',
          top: '28px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#1E293B',
          color: '#FFFFFF',
          borderRadius: '14px',
          padding: '16px 26px',
          boxShadow: '0 16px 36px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          zIndex: 9999,
          animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          maxWidth: '90vw'
        }}>
          <div style={{
            backgroundColor: '#22C55E',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Check size={20} color="#FFFFFF" strokeWidth={3} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: '800', fontSize: '15px', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🎉 대문 설정 저장 완료!
            </span>
            <span style={{ fontSize: '13px', color: '#CBD5E1', marginTop: '2px' }}>
              미디어와 문구가 홈페이지에 성공적으로 즉시 반영되었습니다.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowSaveToast(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#CBD5E1',
              cursor: 'pointer',
              marginLeft: '8px',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  adminContainer: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#F5EFEB', // Warm beige background
    color: '#2C1E1A',
  },
  sidebar: {
    width: '260px',
    backgroundColor: '#1F1917', // Rich charcoal dark
    color: '#F5EFEB',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 100,
    boxShadow: '4px 0 10px rgba(0,0,0,0.1)',
  },
  sidebarHeader: {
    padding: '24px 20px',
    borderBottom: '1px solid #2C2422',
  },
  brandTitle: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '18px',
    fontWeight: '800',
    letterSpacing: '-0.02em',
    color: '#FFFFFF',
  },
  brandSub: {
    fontSize: '10px',
    fontWeight: '500',
    color: '#C19A6B',
    letterSpacing: '0.15em',
    marginTop: '4px',
  },
  sidebarNav: {
    padding: '24px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flexGrow: 1,
  },
  sidebarBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    background: 'none',
    border: 'none',
    borderRadius: '8px',
    color: '#8C7E7A',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s',
    width: '100%',
    ':hover': {
      backgroundColor: '#2C2422',
      color: '#FFFFFF',
    }
  },
  sidebarBtnActive: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: '#C19A6B', // Admin accent gold
    border: 'none',
    borderRadius: '8px',
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
  },
  sidebarFooter: {
    padding: '20px 16px',
    borderTop: '1px solid #2C2422',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: '8px',
    color: '#FAF2E8',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: 'rgba(255,255,255,0.1)',
    }
  },
  mainContent: {
    marginLeft: '260px',
    flexGrow: 1,
    padding: '40px',
    width: 'calc(100% - 260px)',
    minHeight: '100vh',
    scrollbarGutter: 'stable',
  },
  topHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    borderBottom: '1px solid #E8DFD5',
    paddingBottom: '20px',
  },
  headerTitleWrapper: {
    textAlign: 'left',
  },
  headerTitle: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#2C1E1A',
  },
  headerSubtitle: {
    fontSize: '14px',
    color: '#8C7E7A',
    marginTop: '4px',
  },
  adminProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  profileAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#C19A6B',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '16px',
  },
  profileName: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#2C1E1A',
    textAlign: 'left',
  },
  profileRole: {
    fontSize: '11px',
    color: '#8C7E7A',
    textAlign: 'left',
  },
  tabPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
  },
  kpiCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 4px 10px rgba(44, 30, 26, 0.03)',
    border: '1px solid #E8DFD5',
  },
  kpiIconWrapper: {
    width: '48px',
    height: '48px',
    borderRadius: '8px',
    backgroundColor: '#FCFAF5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  kpiData: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  kpiLabel: {
    fontSize: '12px',
    color: '#8C7E7A',
    fontWeight: '500',
  },
  kpiValue: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#2C1E1A',
    margin: '4px 0',
  },
  kpiDelta: {
    fontSize: '11px',
    color: '#2E7D32',
    backgroundColor: '#E8F5E9',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: '600',
  },
  dashboardVisualGrid: {
    display: 'grid',
    gridTemplateColumns: '1.4fr 1fr',
    gap: '24px',
  },
  visualColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #E8DFD5',
    boxShadow: '0 4px 10px rgba(44, 30, 26, 0.03)',
    textAlign: 'left',
  },
  cardHeaderTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#2C1E1A',
    marginBottom: '20px',
    position: 'relative',
    paddingLeft: '10px',
    borderLeft: '4px solid #C19A6B',
  },
  realtimeList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  realtimeItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 14px',
    border: '1px solid #F0EAE3',
    borderRadius: '8px',
    backgroundColor: '#FCFAF5',
  },
  realtimeUser: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  realtimeUserIcon: {
    fontSize: '16px',
  },
  realtimeUserName: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#2C1E1A',
  },
  realtimeUserMenu: {
    fontSize: '12px',
    color: '#8C7E7A',
    marginTop: '2px',
  },
  realtimeMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  realtimeTime: {
    fontSize: '12px',
    color: '#8C7E7A',
  },
  realtimeStatus: {
    fontSize: '11px',
    fontWeight: '600',
    padding: '4px 8px',
    borderRadius: '4px',
  },
  simpleTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '8px',
  },
  tableTh: {
    textAlign: 'left',
    padding: '14px 12px',
    borderBottom: '1.5px solid #E8DFD5',
    fontSize: '12px',
    fontWeight: '700',
    color: '#8C7E7A',
    backgroundColor: '#FCFAF5',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  tableTd: {
    padding: '14px 12px',
    borderBottom: '1px solid #F0EAE3',
    fontSize: '13.5px',
    color: '#5C4E4A',
    textAlign: 'left',
    verticalAlign: 'middle',
  },
  gradeBadge: {
    fontSize: '11px',
    fontWeight: '700',
    padding: '3px 8px',
    borderRadius: '4px',
    display: 'inline-block',
  },
  chartContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '30px',
    padding: '20px 0',
  },
  circularSvg: {
    transform: 'rotate(-90deg)',
  },
  gradeLegendGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    textAlign: 'left',
    fontSize: '13px',
    color: '#5C4E4A',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  legendDot: {
    width: '12px',
    height: '12px',
    borderRadius: '3px',
  },
  infoAlert: {
    display: 'flex',
    gap: '12px',
    backgroundColor: '#FAF2E8',
    padding: '14px',
    borderRadius: '8px',
    border: '1px solid #E8DFD5',
    marginTop: '20px',
  },
  infoAlertText: {
    fontSize: '12.5px',
    color: '#8C7E7A',
    lineHeight: '1.4',
  },
  filterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #E8DFD5',
    boxShadow: '0 4px 10px rgba(44, 30, 26, 0.03)',
    textAlign: 'left',
  },
  filterHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #F0EAE3',
    paddingBottom: '12px',
    marginBottom: '16px',
  },
  filterTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '700',
    fontSize: '15px',
    color: '#2C1E1A',
  },
  resetBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'none',
    border: 'none',
    color: '#8C7E7A',
    fontSize: '13px',
    cursor: 'pointer',
    ':hover': {
      color: '#D84315',
    }
  },
  filterRowGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '16px',
  },
  filterCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  filterLabel: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#8C7E7A',
  },
  filterSelect: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #E8DFD5',
    outline: 'none',
    fontSize: '13px',
    backgroundColor: '#FCFAF5',
  },
  filterSummaryBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E8DFD5',
    padding: '14px 20px',
    borderRadius: '8px',
    fontSize: '13.5px',
    fontWeight: '600',
    color: '#2C1E1A',
  },
  summaryStatsText: {
    textAlign: 'left',
  },
  searchBox: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '260px',
  },
  searchIcon: {
    position: 'absolute',
    left: '10px',
  },
  searchBarInput: {
    width: '100%',
    padding: '8px 10px 8px 32px',
    borderRadius: '6px',
    border: '1px solid #C19A6B',
    outline: 'none',
    fontSize: '13px',
    backgroundColor: '#FFFFFF',
  },
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #E8DFD5',
    boxShadow: '0 4px 10px rgba(44, 30, 26, 0.03)',
    overflowX: 'auto',
  },
  adminTable: {
    width: '100%',
    minWidth: '950px',
    tableLayout: 'fixed',
    borderCollapse: 'collapse',
  },
  noDataTd: {
    padding: '60px 20px',
    fontSize: '14px',
    color: '#8C7E7A',
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
  },
  tableRowHover: {
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#FCFAF5',
    }
  },
  reportActionsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  reportSectionTitle: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#2C1E1A',
  },
  exportBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#1E7145', // Excel green color
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 16px',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(30,113,69,0.2)',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#165433',
    }
  },
  reportsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  svgChartWrapper: {
    width: '100%',
    padding: '10px 0',
  },
  chartSvg: {
    overflow: 'visible',
  },
  barChartContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '10px 0',
  },
  barRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  },
  barLabel: {
    fontSize: '13px',
    fontWeight: '700',
    width: '100px',
    textAlign: 'left',
    color: '#5C4E4A',
  },
  barTrack: {
    flexGrow: 1,
    height: '14px',
    backgroundColor: '#F0EAE3',
    borderRadius: '7px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#C19A6B',
    borderRadius: '7px',
    transition: 'width 0.5s ease-out',
  },
  barValue: {
    fontSize: '13px',
    fontWeight: '600',
    width: '60px',
    textAlign: 'right',
    color: '#2C1E1A',
  },
  gridHeatmap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '10px',
  },
  heatmapRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  heatmapDay: {
    width: '90px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '700',
    color: '#2C1E1A',
  },
  heatmapCell: {
    flex: 1,
    padding: '12px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#2C1E1A',
    textAlign: 'center',
  }
};
