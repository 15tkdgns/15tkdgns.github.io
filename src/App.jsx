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
            <li><a href="#career">Career</a></li>
            <li><a href="#research">Research</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#projects">Projects</a></li>

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
              </div>
              <div className="research-text">
                <div className="research-abstract">
                  <p>
                    본 연구에서는 Deep Neural Network(DNN)를 활용한 우울증 위험 예측 모델의 성능을
                    향상시키기 위한 하이퍼파라미터 최적화 방법을 제안합니다.
                  </p>
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
                  VIX-Beta 이론을 기반으로 한 핵심 발견을 포함하고 있습니다.
                </p>
                <div className="project-tech">
                  <span className="tech-tag">Python</span>
                  <span className="tech-tag">Financial Analysis</span>
                  <span className="tech-tag">Statistical Modeling</span>
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
                <div className="project-tech">
                  <span className="tech-tag">Python</span>
                  <span className="tech-tag">CNN</span>
                  <span className="tech-tag">FastAPI</span>
                  <span className="tech-tag">React</span>
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
