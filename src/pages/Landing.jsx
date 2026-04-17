import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import './Landing.css';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* フルスクリーンビデオ背景 */}
      <div className="video-background">
        <video
          autoPlay
          muted
          loop
          playsInline
          // オフィスやレイアウト作業を連想させるダミーのフリー動画をセット（後で差し替え可能）
          src="https://cdn.pixabay.com/video/2020/06/19/42555-430985920_large.mp4"
        ></video>
        <div className="video-overlay"></div>
      </div>

      <div className="landing-content">
        <main className="landing-hero-center">
          <h1 className="hero-title-main">
            １提案のすべてを、<br />
            一つのプラットフォームで。
          </h1>
          <p className="hero-subtitle-main">
            ヒアリング、AI自動レイアウト、見積データ連携から提案書抽出まで。<br />
            オフィスデザインの業務プロセスを圧倒的にスマートにする次世代システム。
          </p>

          <div className="hero-actions-main">
            <button className="btn-primary-large" onClick={() => navigate('/dashboard')}>
              アカウントを作成する <ChevronRight size={20} />
            </button>
            <button className="btn-glass-large" onClick={() => navigate('/dashboard')}>
              ログイン
            </button>
          </div>
        </main>

        <footer className="landing-footer" style={{ position: 'absolute', bottom: '2rem', width: '100%' }}>
          <p>© 2026 DISP Platform. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default Landing;
