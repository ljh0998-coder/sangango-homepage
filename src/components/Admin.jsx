import React, { useState, useMemo } from 'react';
import { 
  Users, BarChart2, TrendingUp, DollarSign, UserCheck, 
  Search, ShieldAlert, Award, FileSpreadsheet, Home as HomeIcon,
  Filter, RotateCcw, ArrowUpDown, ChevronLeft, ChevronRight 
} from 'lucide-react';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Custom states for filters in customer management tab
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGender, setFilterGender] = useState('All');
  const [filterAge, setFilterAge] = useState('All');
  const [filterGrade, setFilterGrade] = useState('All');
  const [filterFrequency, setFilterFrequency] = useState('All'); // 'High' (10+), 'Medium' (5-9), 'Low' (1-4)
  const [filterAmount, setFilterAmount] = useState('All'); // 'High' (200k+), 'Medium' (100k-199k), 'Low' (<100k)

  // Real-time Queue / Walk-in Simulation (Dashboard section)
  const [realtimeQueue, setRealtimeQueue] = useState([
    { id: 101, name: '김지현', time: '19:24', status: '입장 완료', menu: '고등어구이' },
    { id: 102, name: '박태민', time: '19:18', status: '대기 중 (3팀)', menu: '삼치구이' },
    { id: 103, name: '이소영', time: '19:12', status: '입장 완료', menu: '제육구이' },
    { id: 104, name: '최준혁', time: '19:05', status: '입장 완료', menu: '갈치조림' },
    { id: 105, name: '정민아', time: '18:58', status: '퇴장 완료', menu: '임연수구이' },
  ]);

  // Master Customer Database (Mock)
  const customers = [
    { id: 1, name: '김동현', gender: '남', age: 34, ageGroup: '30대', grade: 'VIP', visits: 18, spent: 288000, points: 14400, registered: '2026-03-12' },
    { id: 2, name: '이지은', gender: '여', age: 28, ageGroup: '20대', grade: 'Gold', visits: 8, spent: 124000, points: 6200, registered: '2026-04-05' },
    { id: 3, name: '박서준', gender: '남', age: 41, ageGroup: '40대', grade: 'VIP', visits: 22, spent: 348000, points: 17400, registered: '2026-01-20' },
    { id: 4, name: '최수영', gender: '여', age: 52, ageGroup: '50대 이상', grade: 'Gold', visits: 12, spent: 182000, points: 9100, registered: '2026-02-18' },
    { id: 5, name: '정우성', gender: '남', age: 46, ageGroup: '40대', grade: 'Silver', visits: 6, spent: 96000, points: 2880, registered: '2026-05-10' },
    { id: 6, name: '윤아름', gender: '여', age: 23, ageGroup: '20대', grade: 'Family', visits: 2, spent: 28000, points: 840, registered: '2026-06-25' },
    { id: 7, name: '한상우', gender: '남', age: 38, ageGroup: '30대', grade: 'Gold', visits: 9, spent: 141000, points: 7050, registered: '2026-03-30' },
    { id: 8, name: '강민경', gender: '여', age: 31, ageGroup: '30대', grade: 'Silver', visits: 5, spent: 78000, points: 2340, registered: '2026-05-15' },
    { id: 9, name: '조세호', gender: '남', age: 43, ageGroup: '40대', grade: 'Family', visits: 3, spent: 43000, points: 1290, registered: '2026-06-02' },
    { id: 10, name: '송혜교', gender: '여', age: 48, ageGroup: '40대', grade: 'VIP', visits: 15, spent: 245000, points: 12250, registered: '2026-02-01' },
    { id: 11, name: '임시완', gender: '남', age: 32, ageGroup: '30대', grade: 'Family', visits: 1, spent: 14000, points: 420, registered: '2026-07-01' },
    { id: 12, name: '배수지', gender: '여', age: 29, ageGroup: '20대', grade: 'Gold', visits: 11, spent: 172000, points: 8600, registered: '2026-04-14' },
    { id: 13, name: '공유', gender: '남', age: 55, ageGroup: '50대 이상', grade: 'VIP', visits: 25, spent: 412000, points: 20600, registered: '2026-01-15' },
    { id: 14, name: '김혜수', gender: '여', age: 50, ageGroup: '50대 이상', grade: 'VIP', visits: 19, spent: 310000, points: 15500, registered: '2026-01-29' }
  ];

  // Dynamic Filtering Process
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      // 1. Search Query filter (checks name or grade)
      const matchesSearch = customer.name.includes(searchQuery) || customer.grade.toLowerCase().includes(searchQuery.toLowerCase());
      
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
  }, [searchQuery, filterGender, filterAge, filterGrade, filterFrequency, filterAmount]);

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
    <div style={styles.adminContainer} className="animate-fade">
      {/* Sidebar Navigation */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.brandTitle}>
            <img src="/brand_logo.png" alt="로고" style={{ height: '28px', objectFit: 'contain', filter: 'brightness(0) invert(1)', marginBottom: '4px' }} />
            <span style={styles.brandSub}>ADMIN CONSOLE</span>
          </div>
        </div>

        <nav style={styles.sidebarNav}>
          <button 
            style={activeTab === 'dashboard' ? styles.sidebarBtnActive : styles.sidebarBtn}
            onClick={() => setActiveTab('dashboard')}
          >
            <Users size={18} />
            <span>대시보드</span>
          </button>
          
          <button 
            style={activeTab === 'customers' ? styles.sidebarBtnActive : styles.sidebarBtn}
            onClick={() => setActiveTab('customers')}
          >
            <UserCheck size={18} />
            <span>고객관리</span>
          </button>

          <button 
            style={activeTab === 'reports' ? styles.sidebarBtnActive : styles.sidebarBtn}
            onClick={() => setActiveTab('reports')}
          >
            <BarChart2 size={18} />
            <span>통계 / 리포트</span>
          </button>
        </nav>

        <div style={styles.sidebarFooter}>
          <a href="#/" style={styles.backBtn}>
            <HomeIcon size={16} />
            <span>홈페이지로 돌아가기</span>
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={styles.mainContent}>
        {/* Top Header */}
        <header style={styles.topHeader}>
          <div style={styles.headerTitleWrapper}>
            <h2 style={styles.headerTitle}>
              {activeTab === 'dashboard' && '운영 실시간 대시보드'}
              {activeTab === 'customers' && '멤버십 고객 관리'}
              {activeTab === 'reports' && '통계 분석 및 경영 보고서'}
            </h2>
            <p style={styles.headerSubtitle}>
              {activeTab === 'dashboard' && '매장의 실시간 유입 및 매출 지표를 파악합니다.'}
              {activeTab === 'customers' && '회원 등급 필터링과 매출액 기여도를 분석합니다.'}
              {activeTab === 'reports' && '월별 매출 추이와 인기 품목의 판매 현황 데이터를 조회합니다.'}
            </p>
          </div>

          <div style={styles.adminProfile}>
            <div style={styles.profileAvatar}>M</div>
            <div>
              <div style={styles.profileName}>최고 관리자</div>
              <div style={styles.profileRole}>System Admin</div>
            </div>
          </div>
        </header>

        {/* Tab contents */}
        {activeTab === 'dashboard' && (
          <div style={styles.tabPanel} className="animate-fade">
            {/* KPI Cards */}
            <div style={styles.kpiGrid}>
              <div style={styles.kpiCard}>
                <div style={styles.kpiIconWrapper}><Users size={20} color="#C19A6B" /></div>
                <div style={styles.kpiData}>
                  <span style={styles.kpiLabel}>전체 등록 고객</span>
                  <h3 style={styles.kpiValue}>{customers.length} 명</h3>
                  <span style={styles.kpiDelta}>+12.4% 이번 달</span>
                </div>
              </div>
              <div style={styles.kpiCard}>
                <div style={styles.kpiIconWrapper}><DollarSign size={20} color="#D84315" /></div>
                <div style={styles.kpiData}>
                  <span style={styles.kpiLabel}>누적 총 매출액</span>
                  <h3 style={styles.kpiValue}>₩{totalRevenueAll.toLocaleString()}</h3>
                  <span style={styles.kpiDelta}>+8.2% 이번 달</span>
                </div>
              </div>
              <div style={styles.kpiCard}>
                <div style={styles.kpiIconWrapper}><TrendingUp size={20} color="#2E7D32" /></div>
                <div style={styles.kpiData}>
                  <span style={styles.kpiLabel}>총 거래 건수</span>
                  <h3 style={styles.kpiValue}>{totalTransactionsAll} 건</h3>
                  <span style={styles.kpiDelta}>+6.7% 이번 달</span>
                </div>
              </div>
              <div style={styles.kpiCard}>
                <div style={styles.kpiIconWrapper}><Award size={20} color="#C19A6B" /></div>
                <div style={styles.kpiData}>
                  <span style={styles.kpiLabel}>지급 완료 포인트</span>
                  <h3 style={styles.kpiValue}>{(totalRevenueAll * 0.05).toLocaleString()} P</h3>
                  <span style={styles.kpiDelta}>5% 스탬프식 적립</span>
                </div>
              </div>
            </div>

            {/* Dashboard Visual Grid */}
            <div style={styles.dashboardVisualGrid}>
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
                      {customers.slice(-4).map((c) => (
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
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: Customer Grade Distribution */}
              <div style={styles.visualColumn}>
                <div style={{ ...styles.sectionCard, height: '100%' }}>
                  <h4 style={styles.cardHeaderTitle}>회원 등급별 고객 분포 비율</h4>
                  
                  {/* Decorative Circular Graph Mockup */}
                  <div style={styles.chartContainer}>
                    <svg width="220" height="220" viewBox="0 0 36 36" style={styles.circularSvg}>
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#E8DFD5" strokeWidth="2.5" />
                      
                      {/* VIP 35% */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#D4AF37" strokeWidth="3" 
                        strokeDasharray="35 65" strokeDashoffset="100" />
                      
                      {/* Gold 25% */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#90A4AE" strokeWidth="3" 
                        strokeDasharray="25 75" strokeDashoffset="65" />
                        
                      {/* Silver 25% */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#C19A6B" strokeWidth="3" 
                        strokeDasharray="25 75" strokeDashoffset="40" />

                      {/* Family 15% */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#D84315" strokeWidth="3" 
                        strokeDasharray="15 85" strokeDashoffset="15" />
                    </svg>

                    <div style={styles.gradeLegendGrid}>
                      <div style={styles.legendItem}>
                        <span style={{ ...styles.legendDot, backgroundColor: '#D4AF37' }}></span>
                        <span>VIP 등급 (35%)</span>
                      </div>
                      <div style={styles.legendItem}>
                        <span style={{ ...styles.legendDot, backgroundColor: '#90A4AE' }}></span>
                        <span>Gold 등급 (25%)</span>
                      </div>
                      <div style={styles.legendItem}>
                        <span style={{ ...styles.legendDot, backgroundColor: '#C19A6B' }}></span>
                        <span>Silver 등급 (25%)</span>
                      </div>
                      <div style={styles.legendItem}>
                        <span style={{ ...styles.legendDot, backgroundColor: '#D84315' }}></span>
                        <span>Family 등급 (15%)</span>
                      </div>
                    </div>
                  </div>

                  <div style={styles.infoAlert}>
                    <ShieldAlert size={18} color="#D84315" />
                    <p style={styles.infoAlertText}>
                      전체 고객 중 60% 이상이 Gold 등급 이상인 단골 고객층입니다. 이들을 위한 단골 맞춤형 혜택 관리가 필수적입니다.
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
                <button onClick={resetFilters} style={styles.resetBtn}>
                  <RotateCcw size={14} />
                  <span>필터 초기화</span>
                </button>
              </div>

              <div style={styles.filterRowGrid}>
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
            <div style={styles.filterSummaryBar}>
              <div style={styles.summaryStatsText}>
                검색된 고객 수: <strong style={{ color: '#D84315' }}>{customerStats.count}</strong>명 | 
                누적 합계 매출: <strong style={{ color: '#D84315' }}>₩{customerStats.spent.toLocaleString()}</strong> | 
                총 포인트 잔액: <strong style={{ color: '#D84315' }}>{customerStats.points.toLocaleString()} P</strong>
              </div>
              <div style={styles.searchBox}>
                <Search size={16} color="#8C7E7A" style={styles.searchIcon} />
                <input 
                  type="text" 
                  placeholder="고객 이름 또는 등급 검색..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={styles.searchBarInput}
                />
              </div>
            </div>

            {/* Main Customer Table */}
            <div style={styles.tableCard}>
              <table style={styles.adminTable}>
                <thead>
                  <tr>
                    <th style={styles.tableTh}>ID</th>
                    <th style={styles.tableTh}>고객명</th>
                    <th style={styles.tableTh}>성별</th>
                    <th style={styles.tableTh}>나이</th>
                    <th style={styles.tableTh}>고객등급</th>
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
                      <tr key={c.id} style={styles.tableRowHover}>
                        <td style={styles.tableTd}>{c.id}</td>
                        <td style={{ ...styles.tableTd, fontWeight: 'bold' }}>{c.name}</td>
                        <td style={styles.tableTd}>{c.gender}</td>
                        <td style={styles.tableTd}>{c.age}세 ({c.ageGroup})</td>
                        <td style={styles.tableTd}>
                          <span style={{
                            ...styles.gradeBadge,
                            backgroundColor: c.grade === 'VIP' ? '#FFF8E1' : c.grade === 'Gold' ? '#ECEFF1' : c.grade === 'Silver' ? '#FAF2E8' : '#FFEBEE',
                            color: c.grade === 'VIP' ? '#F57F17' : c.grade === 'Gold' ? '#37474F' : c.grade === 'Silver' ? '#C19A6B' : '#C62828'
                          }}>{c.grade}</span>
                        </td>
                        <td style={styles.tableTd}>{c.visits}회</td>
                        <td style={{ ...styles.tableTd, fontWeight: 'bold', color: '#D84315' }}>₩{c.spent.toLocaleString()}</td>
                        <td style={styles.tableTd}>{c.points.toLocaleString()} P</td>
                        <td style={styles.tableTd}>{c.registered}</td>
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

            <div style={styles.reportsGrid}>
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
      </main>
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
    padding: '12px',
    borderBottom: '1.5px solid #E8DFD5',
    fontSize: '12px',
    fontWeight: '700',
    color: '#8C7E7A',
    backgroundColor: '#FCFAF5',
  },
  tableTd: {
    padding: '12px',
    borderBottom: '1px solid #F0EAE3',
    fontSize: '13.5px',
    color: '#5C4E4A',
    textAlign: 'left',
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
    borderCollapse: 'collapse',
  },
  noDataTd: {
    padding: '40px',
    fontSize: '14px',
    color: '#8C7E7A',
    textAlign: 'center',
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
