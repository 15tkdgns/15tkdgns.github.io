import './App.css'

function App() {
  const handlePrint = () => {
    window.print()
  }

  return (
    <>
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-content">
          <div className="nav-logo">Portfolio</div>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#research">Research</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#career">Career</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero section-full">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>안녕하세요, AI로 세상을 바꾸는<br></br>연구개발자입니다</h1>
              <p className="subtitle">ML/DL Researcher & Full-Stack Developer</p>
              <p className="description">
                딥러닝 기반의 예측 모델 연구와 풀스택 개발을 통해
                실제 문제를 해결하는 것에 관심을 가지고 있습니다.
                KCI 등재 학술지에 제1저자로 논문을 게재한 경험이 있습니다.
              </p>
              <div className="hero-buttons">
                <a href="#career" className="btn btn-primary">
                  경력 보기
                </a>
                <a href="https://github.com/15tkdgns" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                  GitHub
                </a>
              </div>
            </div>
            <div className="hero-visual">
              <div className="profile-card">
                <img src="/profile.png" alt="Profile" className="profile-image" />
                <h3>Park SangHoon</h3>
                <p>AI Researcher & Developer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Section */}
      <section id="research" className="section-full">
        <div className="container">
          <div className="section-header">
            <h2>Research Publication</h2>
            <p>학술 논문 및 연구 성과</p>
          </div>

          <div className="research-card">
            <div className="research-badge">
              KCI 등재 논문
            </div>
            <h3>DNN 기반 우울증 위험 예측 성능 향상을 위한 하이퍼파라미터 최적화 방법 연구</h3>

            <div className="research-meta">
              <div className="research-meta-item">
                <strong>학회지:</strong> 한국정보기술학회논문지
              </div>
              <div className="research-meta-item">
                <strong>발행일:</strong> 2025.10
              </div>
              <div className="research-meta-item">
                <strong>저자:</strong> 제1저자
              </div>
            </div>

            <div className="research-content">
              <div className="research-image-container">
                <img src="/dnn-architecture.png" alt="DNN Architecture" className="research-image" />
                <p className="image-caption">DNN 모델 아키텍처</p>
                <div className="research-links">
                  <a href="https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE12433737" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    논문 보기
                  </a>
                  <a href="https://github.com/15tkdgns/depression" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                    GitHub
                  </a>
                </div>
              </div>
              <div className="research-text">
                <div className="research-abstract">
                  <p>
                    본 연구에서는 Deep Neural Network(DNN)를 활용한 우울증 위험 예측 모델의 성능을
                    향상시키기 위한 하이퍼파라미터 최적화 방법을 제안합니다. 국민건강영양조사 데이터를
                    활용하여 PHQ-9 기반 우울증 위험군을 분류하며, Grid Search와 Random Search를
                    비교 분석하여 최적의 모델 구성을 도출하였습니다.
                  </p>
                </div>
                <div className="research-highlights">
                  <div className="highlight-item">
                    <span className="highlight-label">데이터셋</span>
                    <span className="highlight-value">국민건강영양조사 (KNHANES) 10,000+ 샘플</span>
                  </div>
                  <div className="highlight-item">
                    <span className="highlight-label">모델 성능</span>
                    <span className="highlight-value">AUC 0.85+, F1-Score 0.82</span>
                  </div>
                  <div className="highlight-item">
                    <span className="highlight-label">최적화 기법</span>
                    <span className="highlight-value">Grid Search vs Random Search 비교</span>
                  </div>
                </div>
                <div className="research-tags">
                  <span className="tag">Deep Learning</span>
                  <span className="tag">DNN</span>
                  <span className="tag">Hyperparameter Optimization</span>
                  <span className="tag">Depression Prediction</span>
                  <span className="tag">Healthcare AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Detail Section 1 */}
      <section id="research-detail" className="section-full">
        <div className="container">
          <div className="section-header">
            <h2>Research Details</h2>
            <p>연구 방법론 및 결과</p>
          </div>

          <div className="detail-grid">
            <div className="detail-card">
              <h3>연구 배경 및 목적</h3>
              <p>
                우울증은 전 세계적으로 약 3억 명이 영향을 받는 주요 정신건강 문제입니다.
                특히 한국에서는 우울증 유병률이 지속적으로 증가하고 있어 조기 발견의 중요성이 대두되고 있습니다.
                본 연구는 국민건강영양조사 데이터를 활용하여 PHQ-9 점수 기반 우울증 위험군을 예측하는
                DNN 모델을 개발하고, 하이퍼파라미터 최적화를 통해 예측 성능을 향상시키는 것을 목표로 합니다.
              </p>
            </div>

            <div className="detail-card">
              <h3>데이터 및 전처리</h3>
              <ul className="detail-list">
                <li>데이터셋: 국민건강영양조사 (KNHANES)</li>
                <li>샘플 수: 10,000+ 개인 건강 데이터</li>
                <li>특성 변수: 인구통계, 생활습관, 건강상태 등 50+</li>
                <li>타겟 변수: PHQ-9 점수 기반 우울증 위험군</li>
                <li>전처리: 결측치 처리, 이상치 제거, 표준화, SMOTE</li>
              </ul>
            </div>

            <div className="detail-card">
              <h3>모델 아키텍처</h3>
              <ul className="detail-list">
                <li>Input Layer: 50+ 특성 변수</li>
                <li>Hidden Layer 1: 128 노드, ReLU, Dropout(0.3)</li>
                <li>Hidden Layer 2: 64 노드, ReLU, Dropout(0.3)</li>
                <li>Hidden Layer 3: 32 노드, ReLU, Dropout(0.2)</li>
                <li>Output Layer: Sigmoid (Binary Classification)</li>
              </ul>
            </div>

            <div className="detail-card">
              <h3>하이퍼파라미터 최적화</h3>
              <ul className="detail-list">
                <li>Grid Search: Learning Rate, Batch Size 탐색</li>
                <li>Random Search: 넓은 탐색 공간 최적화</li>
                <li>5-Fold Cross Validation으로 과적합 방지</li>
                <li>Early Stopping 적용</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Research Detail Section 2 */}
      <section id="research-detail-2" className="section-full">
        <div className="container">
          <div className="section-header">
            <h2>Research Results</h2>
            <p>성능 평가 및 기술 스택</p>
          </div>

          <div className="detail-grid">
            <div className="detail-card">
              <h3>성능 평가 결과</h3>
              <div className="performance-stats">
                <div className="stat-item">
                  <span className="stat-value">0.85+</span>
                  <span className="stat-label">AUC-ROC</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">0.82</span>
                  <span className="stat-label">F1-Score</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">0.84</span>
                  <span className="stat-label">Precision</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">0.80</span>
                  <span className="stat-label">Recall</span>
                </div>
              </div>
            </div>

            <div className="detail-card">
              <h3>활용 기술 스택</h3>
              <div className="tech-list">
                <span className="tech-item">Python 3.9</span>
                <span className="tech-item">TensorFlow 2.x</span>
                <span className="tech-item">Keras</span>
                <span className="tech-item">Scikit-learn</span>
                <span className="tech-item">Pandas</span>
                <span className="tech-item">NumPy</span>
                <span className="tech-item">Matplotlib</span>
                <span className="tech-item">Seaborn</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section-full">
        <div className="container">
          <div className="section-header">
            <h2>Technical Skills</h2>
            <p>연구 및 개발에 활용하는 기술 스택</p>
          </div>

          <div className="skills-image-container">
            <img src="/skills.png" alt="Technical Skills" className="skills-image" />
          </div>
        </div>
      </section>

      {/* Projects Section 1 - Caffeine */}
      <section id="projects" className="section-full">
        <div className="container">
          <div className="section-header">
            <h2>Projects</h2>
            <p>주요 프로젝트</p>
          </div>

          <div className="projects-list">
            {/* Caffeine Project */}
            <div className="project-card-large">
              <div className="project-image-large">
                <img src="/caffeine.png" alt="Caffeine Project" />
              </div>
              <div className="project-content-large">
                <div className="project-badge">Full-Stack</div>
                <h3>Caffeine - AI 기반 가계부 앱</h3>
                <p className="project-description">
                  React Native와 FastAPI를 활용한 풀스택 가계부 애플리케이션입니다.
                  AI 기반 소비 패턴 분석, 이상거래 탐지, 맞춤형 쿠폰 추천 등의 기능을 제공합니다.
                </p>
                <div className="project-features-tags">
                  <span className="feature-tag">AI 다음 소비 예측</span>
                  <span className="feature-tag">이상거래 탐지</span>
                  <span className="feature-tag">맞춤 쿠폰 추천</span>
                  <span className="feature-tag">LLM 챗봇</span>
                </div>
                <div className="project-tech">
                  <span className="tech-tag">React Native</span>
                  <span className="tech-tag">FastAPI</span>
                  <span className="tech-tag">XGBoost</span>
                  <span className="tech-tag">Docker</span>
                  <span className="tech-tag">PostgreSQL</span>
                </div>
                <div className="project-links">
                  <a href="https://github.com/15tkdgns/caffeine" target="_blank" rel="noopener noreferrer" className="project-link">
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Caffeine Project Detail Section 1 */}
      <section id="project-detail" className="section-full">
        <div className="container">
          <div className="section-header">
            <h2>Caffeine - Project Details</h2>
            <p>AI 기반 가계부 앱 상세 설명</p>
          </div>

          <div className="detail-grid">
            <div className="detail-card">
              <h3>프로젝트 개요</h3>
              <p>
                Caffeine은 AI 기술을 활용하여 사용자의 소비 패턴을 분석하고,
                다음 소비를 예측하며, 이상거래를 탐지하는 스마트 가계부 앱입니다.
                React Native와 FastAPI를 활용한 풀스택 구현으로, Docker 기반의
                마이크로서비스 아키텍처를 적용하였습니다.
              </p>
            </div>

            <div className="detail-card">
              <h3>핵심 기능</h3>
              <ul className="detail-list">
                <li>XGBoost 기반 다음 소비 카테고리 예측 (77.1% 정확도)</li>
                <li>Isolation Forest 기반 이상거래 탐지 시스템</li>
                <li>협업 필터링 기반 맞춤형 쿠폰 추천 엔진</li>
                <li>OpenAI GPT-4 기반 대화형 금융 상담 챗봇</li>
              </ul>
            </div>

            <div className="detail-card">
              <h3>ML 파이프라인</h3>
              <ul className="detail-list">
                <li>데이터: IBM Credit Card Transactions</li>
                <li>전처리: Time-based Split (Data Leakage 방지)</li>
                <li>클래스 불균형: SMOTE 오버샘플링</li>
                <li>하이퍼파라미터: Optuna 기반 자동 최적화</li>
              </ul>
            </div>

            <div className="detail-card">
              <h3>시스템 아키텍처</h3>
              <ul className="detail-list">
                <li>Frontend: React Native (Expo)</li>
                <li>Backend: FastAPI (Python 3.11, Async)</li>
                <li>Database: PostgreSQL 15</li>
                <li>Infrastructure: Docker Compose, Nginx</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Caffeine Project Detail Section 2 */}
      <section id="project-detail-2" className="section-full">
        <div className="container">
          <div className="section-header">
            <h2>Caffeine - Technical Details</h2>
            <p>성능 및 구현 상세</p>
          </div>

          <div className="detail-grid">
            <div className="detail-card">
              <h3>ML 모델 성능</h3>
              <div className="performance-stats">
                <div className="stat-item">
                  <span className="stat-value">77.1%</span>
                  <span className="stat-label">XGBoost 정확도</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">6개</span>
                  <span className="stat-label">카테고리 분류</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">95.7%</span>
                  <span className="stat-label">교통 F1-Score</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">91.2%</span>
                  <span className="stat-label">이상탐지 Precision</span>
                </div>
              </div>
            </div>

            <div className="detail-card">
              <h3>LLM 챗봇 구현</h3>
              <ul className="detail-list">
                <li>OpenAI GPT-4 API 연동</li>
                <li>RAG (Retrieval-Augmented Generation) 적용</li>
                <li>금융 도메인 특화 프롬프트 엔지니어링</li>
                <li>부적절 응답 필터링 및 가드레일 적용</li>
              </ul>
            </div>

            <div className="detail-card">
              <h3>API 엔드포인트</h3>
              <ul className="detail-list">
                <li>POST /api/predict - 다음 소비 예측</li>
                <li>POST /api/detect-fraud - 이상거래 탐지</li>
                <li>GET /api/recommendations - 쿠폰 추천</li>
                <li>POST /api/chat - LLM 챗봇 대화</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Caffeine Demo Section */}
      <section id="caffeine-demo" className="section-full">
        <div className="container">
          <div className="section-header">
            <h2>Caffeine - Demo Videos</h2>
            <p>사용자 앱 및 관리자 앱 데모 영상</p>
          </div>

          <div className="demo-videos">
            <div className="demo-video-card">
              <h3>사용자 앱 데모</h3>
              <p className="demo-description">AI 기반 소비 예측, 대시보드, 챗봇 기능 시연</p>
              <video controls className="demo-video">
                <source src="/videos/UserApp_.mp4" type="video/mp4" />
                브라우저가 영상을 지원하지 않습니다.
              </video>
            </div>
            <div className="demo-video-card">
              <h3>관리자 앱 데모</h3>
              <p className="demo-description">관리자 대시보드 및 데이터 관리 기능 시연</p>
              <video controls className="demo-video">
                <source src="/videos/관리자 더빙영상 (1).mp4" type="video/mp4" />
                브라우저가 영상을 지원하지 않습니다.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section 2 - VRP & Food-101 */}
      <section id="projects2" className="section-full">
        <div className="container">
          <div className="section-header">
            <h2>Projects</h2>
            <p>연구 및 ML 프로젝트</p>
          </div>

          <div className="projects-grid-two">
            {/* VRP Prediction */}
            <div className="project-card-horizontal">
              <div className="project-info">
                <div className="project-badge">Research</div>
                <h3>VRP 예측 연구 - VIX-Beta 이론</h3>
                <p className="project-description">
                  Variance Risk Premium(VRP) 예측 연구 프로젝트입니다.
                  VIX-Beta 이론을 기반으로 옵션 시장의 위험 프리미엄을 예측합니다.
                </p>
                <div className="project-detail-list">
                  <div className="project-detail-item">
                    <strong>연구 목표:</strong> VIX와 실현 변동성 간의 Gap을 예측하여 투자 전략 수립
                  </div>
                  <div className="project-detail-item">
                    <strong>핵심 발견:</strong> 22-day Gap이 VRP 예측에 가장 효과적 (R^2=0.44)
                  </div>
                  <div className="project-detail-item">
                    <strong>모델:</strong> MLP, Ridge Regression, Random Forest 비교 분석
                  </div>
                  <div className="project-detail-item">
                    <strong>데이터:</strong> S&P 500, VIX, 개별 자산 베타 (2010-2024)
                  </div>
                </div>
                <div className="project-tech">
                  <span className="tech-tag">Python</span>
                  <span className="tech-tag">Financial Analysis</span>
                  <span className="tech-tag">Statistical Modeling</span>
                  <span className="tech-tag">MLP</span>
                  <span className="tech-tag">Streamlit</span>
                </div>
                <div className="project-links">
                  <a href="https://github.com/15tkdgns/vrp-prediction" target="_blank" rel="noopener noreferrer" className="project-link">
                    GitHub
                  </a>
                </div>
              </div>
            </div>

            {/* CNN Food-101 */}
            <div className="project-card-horizontal">
              <div className="project-info">
                <div className="project-badge">CNN</div>
                <h3>Food-101 Image Classification</h3>
                <p className="project-description">
                  Food-101 데이터셋을 활용한 CNN 기반 음식 이미지 분류 프로젝트입니다.
                  FastAPI 백엔드와 React 프론트엔드로 풀스택 구현되었습니다.
                </p>
                <div className="project-detail-list">
                  <div className="project-detail-item">
                    <strong>데이터셋:</strong> Food-101 (101개 클래스, 101,000개 이미지)
                  </div>
                  <div className="project-detail-item">
                    <strong>모델:</strong> EfficientNet-B0 Fine-tuning (Top-1 Accuracy 82%)
                  </div>
                  <div className="project-detail-item">
                    <strong>Data Augmentation:</strong> RandomCrop, HorizontalFlip, ColorJitter
                  </div>
                  <div className="project-detail-item">
                    <strong>배포:</strong> FastAPI + React + Docker 컨테이너화
                  </div>
                </div>
                <div className="project-tech">
                  <span className="tech-tag">Python</span>
                  <span className="tech-tag">PyTorch</span>
                  <span className="tech-tag">EfficientNet</span>
                  <span className="tech-tag">FastAPI</span>
                  <span className="tech-tag">React</span>
                  <span className="tech-tag">Docker</span>
                </div>
                <div className="project-links">
                  <a href="https://github.com/15tkdgns/cnn" target="_blank" rel="noopener noreferrer" className="project-link">
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Career & Certifications Section */}
      <section id="career" className="section-full">
        <div className="container">
          <div className="section-header">
            <h2>Career & Certifications</h2>
            <p>경력 및 자격증</p>
          </div>

          <div className="career-grid">
            {/* Work Experience */}
            <div className="career-card">
              <h3>경력</h3>
              <div className="career-item">
                <div className="career-period">2023.01 - 2025.03</div>
                <div className="career-title">IT 인프라 구축/운영 회사</div>
                <ul className="career-details">
                  <li>서버, 스토리지, 백업 담당</li>
                  <li>영업 및 영업지원</li>
                  <li>대규모 사업 Project Assistant</li>
                  <li>소규모 사업 Project Manager</li>
                </ul>
              </div>
            </div>

            {/* Certifications */}
            <div className="career-card">
              <h3>국가공인 자격증</h3>
              <ul className="cert-list">
                <li>빅데이터분석기사</li>
                <li>정보처리기사</li>
                <li>데이터분석준전문가 (ADsP)</li>
              </ul>
            </div>

            <div className="career-card">
              <h3>제조사 공인 자격증</h3>
              <ul className="cert-list">
                <li>Lenovo Client Virtualization Sales Credential</li>
                <li>Lenovo Cloud Sales Credential</li>
                <li>Lenovo Data and Analytics Sales Credential</li>
                <li>NetApp Certified Technology Solutions Professional</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-full">
        <div className="container">
          <div className="section-header">
            <h2>Contact</h2>
            <p>연구 협업 및 프로젝트 문의</p>
          </div>

          <div className="contact-content">
            <div className="contact-card">
              <h3>연락처</h3>
              <p>
                연구 협업, 프로젝트 문의, 또는 기타 질문이 있으시면
                언제든지 연락 주세요.
              </p>
              <div className="contact-links">
                <a href="https://github.com/15tkdgns" target="_blank" rel="noopener noreferrer" className="contact-link">
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* Footer */}
      < footer className="footer" >
        <div className="container">
          <p>© 2025 Portfolio. All rights reserved.</p>
        </div>
      </footer >

      {/* PDF Download Button */}
      < button className="pdf-button no-print" onClick={handlePrint} >
        PDF 저장
      </button >
    </>
  )
}

export default App
