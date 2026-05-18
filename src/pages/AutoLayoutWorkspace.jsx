import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UploadCloud, CheckCircle, ArrowLeft } from 'lucide-react';
import LeftSidebar from '../components/layout/LeftSidebar';
import './AutoLayoutWorkspace.css';

const MOCK_INTERIOR_IMAGES = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=400&q=80"
];

const MOCK_ESTIMATE_LINES = [
  "【概算見積書】",
  "-------------------------------------------------------------",
  "[執務スペース]",
  "  STTB322AASQIOV+SLS...   x 2       ¥ 180,000",
  "  SCNG770ACBK             x 25      ¥ 1,250,000",
  "  SOWD495BK               x 22      ¥ 880,000",
  "  仮 STMH817DNABK         x 3       ¥ 120,000",
  "",
  "[コミュニケーションスペース]",
  "  SSFE611NRWNL            x 6       ¥ 900,000",
  "  特注テーブル_1          x 1       ¥ 450,000",
  "-------------------------------------------------------------",
  "小計                                ¥ 3,780,000",
  "諸経費 (10%)                         ¥ 378,000",
  "-------------------------------------------------------------",
  "合計金額                            ¥ 4,158,000",
  "============================================================="
];

export default function AutoLayoutWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  // step 1: アップロード画面, step 2: 結果画面
  const [step, setStep] = useState(1);
  const [dxfUploaded, setDxfUploaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // 新規追加アクション用
  const [activeAction, setActiveAction] = useState(null);
  const [isActionProcessing, setIsActionProcessing] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedImageIndices, setSelectedImageIndices] = useState([]);
  const [visibleEstimateLines, setVisibleEstimateLines] = useState(0);

  const handleAction = (actionType) => {
    setActiveAction(actionType);
    setIsActionProcessing(true);

    if (actionType === 'estimate') {
      setVisibleEstimateLines(0);
      let count = 0;
      const intervalId = setInterval(() => {
        if (count < MOCK_ESTIMATE_LINES.length) {
          count++;
          setVisibleEstimateLines(count);
        } else {
          clearInterval(intervalId);
        }
      }, 180);

      setTimeout(() => {
        clearInterval(intervalId);
        setIsActionProcessing(false);
        setShowResultModal(true);
      }, 4000);
    } else if (actionType === 'image') {
      setSelectedImageIndices([]);
      let currentIndices = [];
      const intervalId = setInterval(() => {
        if (currentIndices.length < MOCK_INTERIOR_IMAGES.length) {
          currentIndices.push(currentIndices.length);
          setSelectedImageIndices([...currentIndices]);
        } else {
          clearInterval(intervalId);
        }
      }, 500);

      setTimeout(() => {
        clearInterval(intervalId);
        setIsActionProcessing(false);
        setShowResultModal(true);
      }, 4000);
    } else if (actionType === 'presen') {
      setTimeout(() => {
        setIsActionProcessing(false);
        setShowResultModal(true);
      }, 4500);
    } else {
      setTimeout(() => {
        setIsActionProcessing(false);
        setShowResultModal(true);
      }, 2000);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('teian_projects');
    if (saved) {
      try {
        const projects = JSON.parse(saved);
        const target = projects.find(p => p.id.toString() === id);
        if (target) {
          setProject(target);
        } else {
          // 見つからなければダミー
          setProject({ name: '株式会社デンソー勝山', answers: { space: '執務スペース', employees: 25, floorSpace: 50, deskWidth: 1200, deskDepth: 700 } });
        }
      } catch (e) { }
    } else {
      setProject({ name: 'モックアップ案件', answers: {} });
    }
  }, [id]);

  useEffect(() => {
    let scrollInterval;
    if (showResultModal && activeAction === 'presen') {
      const container = document.getElementById('presen-scroll-container');
      if (container) {
        let isUserScrolling = false;
        const stopScroll = () => { isUserScrolling = true; };
        container.addEventListener('wheel', stopScroll, { passive: true });
        container.addEventListener('touchstart', stopScroll, { passive: true });

        setTimeout(() => {
          scrollInterval = setInterval(() => {
            if (isUserScrolling) {
              clearInterval(scrollInterval);
              return;
            }
            if (container.scrollTop < container.scrollHeight - container.clientHeight) {
              container.scrollTop += 1.5;
            } else {
              clearInterval(scrollInterval);
            }
          }, 20);
        }, 1500);
      }
    }
    return () => clearInterval(scrollInterval);
  }, [showResultModal, activeAction]);

  if (!project) return <div style={{ padding: '2rem', textAlign: 'center' }}>読み込み中...</div>;

  const handleUploadDxf = () => {
    setDxfUploaded(true);
  };

  const handleRunZoning = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(2);
    }, 2000);
  };

  const renderStep1 = () => (
    <div className="alw-upload-container">
      {/* 左：図面プレビュー */}
      <div className="alw-upload-section">
        <h3 className="alw-section-title">図面プレビュー</h3>
        <div className="alw-dropzone" onClick={handleUploadDxf} style={{ background: dxfUploaded ? '#F0FDF4' : 'white', borderColor: dxfUploaded ? '#86EFAC' : '#D1D5DB' }}>
          {dxfUploaded ? (
            <div style={{ textAlign: 'center', color: '#166534' }}>
              <CheckCircle size={48} style={{ margin: '0 auto 1rem auto' }} />
              <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>DXFファイル アップロード完了</div>
              <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>floor_plan_v2.dxf</div>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <UploadCloud size={32} color="#374151" style={{ margin: '0 auto' }} />
              <div className="alw-drop-text">
                DXFファイルをドラッグ＆ドロップ<br />
                またはクリックしてアップロード
              </div>
            </div>
          )}
        </div>

        <div className="alw-upload-footer">
          <button
            className={`alw-btn-zoning ${dxfUploaded ? 'active' : ''}`}
            disabled={!dxfUploaded || isProcessing}
            onClick={handleRunZoning}
          >
            {isProcessing ? '処理中...' : 'ゾーニング生成'}
          </button>
        </div>
      </div>

      {/* 右：ヒアリングフォーム */}
      <div className="alw-upload-section">
        <h3 className="alw-section-title">ヒアリングフォーム (自動連携)</h3>
        <div className="alw-answers-box">
          <div style={{ marginBottom: '1.5rem', color: '#10B981', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={16} /> 質問ページの回答内容を反映しています
          </div>

          <div className="alw-answer-item">
            <div className="alw-answer-label">必要なスペース</div>
            <div className="alw-answer-value">{project.answers?.space || '執務スペース・コミュニケーション'}</div>
          </div>

          <div className="alw-answer-item">
            <div className="alw-answer-label">床面積</div>
            <div className="alw-answer-value">{project.answers?.floorSpace ? `${project.answers.floorSpace} 坪` : '50 坪'}</div>
          </div>

          <div className="alw-answer-item">
            <div className="alw-answer-label">想定社員数</div>
            <div className="alw-answer-value">{project.answers?.employees ? `${project.answers.employees} 名` : '25 名'}</div>
          </div>

          <div className="alw-answer-item">
            <div className="alw-answer-label">一人当たりのデスクサイズ</div>
            <div className="alw-answer-value">
              {project.answers?.deskWidth && project.answers?.deskDepth
                ? `${project.answers.deskWidth} mm × ${project.answers.deskDepth} mm`
                : '1200 mm × 700 mm'}
            </div>
          </div>

          {/* アンケート結果CSVとして疑似的に完了としている状態 */}
          <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #E5E7EB', color: '#6B7280', fontSize: '0.8rem', textAlign: 'center' }}>
            提案DXアンケート結果CSVデータ：準備完了
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div>
      <div className="alw-result-container">
        {/* 左側：フロアマップ領域（モック） */}
        <div className="alw-map-area" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'white', padding: '1.5rem', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
          <img src="/layout.png" alt="自動レイアウト生成結果" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', borderRadius: '4px' }} />
        </div>

        {/* 右側：リスト領域 */}
        <div className="alw-list-area">
          <div className="alw-list-header">
            <div className="alw-list-title">配置家具</div>
            <button className="alw-btn-refresh">再取得</button>
          </div>
          <div className="alw-list-content">
            <div className="alw-list-category">執務スペース</div>
            {[
              { code: 'STTB322AASQIOV+SLS...', count: 2 },
              { code: 'SCNG770ACBK', count: 25 },
              { code: 'SOWD495BK', count: 22 },
              { code: '仮 STMH817DNABK', count: 3 }
            ].map((item, i) => (
              <div className="alw-list-item" key={i}>
                <div className="alw-item-info">
                  <span className="alw-item-code">{item.code}</span>
                  <span className="alw-item-count">{item.count} 個</span>
                </div>
                <button className="alw-btn-change">変更</button>
              </div>
            ))}

            <div className="alw-list-category" style={{ marginTop: '1.5rem' }}>コミュニケーションスペース</div>
            {[
              { code: 'SSFE611NRWNL', count: 6 },
              { code: '特注テーブル_1', count: 1 }
            ].map((item, i) => (
              <div className="alw-list-item" key={i}>
                <div className="alw-item-info">
                  <span className="alw-item-code">{item.code}</span>
                  <span className="alw-item-count">{item.count} 個</span>
                </div>
                <button className="alw-btn-change">変更</button>
              </div>
            ))}
          </div>
          <div className="alw-list-footer">
            <span>合計金額</span>
            <span className="alw-total-price">¥12,251,000</span>
          </div>
        </div>
      </div>

      <div className="alw-bottom-actions">
        <button className="alw-btn-outline" onClick={() => setStep(1)}>再ゾーニング</button>
        
        <button className="alw-btn-green" onClick={() => handleAction('presen')}>プレゼン生成</button>
        <button className="alw-btn-green" onClick={() => handleAction('estimate')}>概算見積り出力</button>
        <button className="alw-btn-green" onClick={() => handleAction('image')}>イメージ画像生成</button>
        
        <button className="alw-btn-outline">DXF書き出し</button>
        <button className="alw-btn-outline">製品書き出し</button>
      </div>
    </div>
  );

  return (
    <div className="layout">
      <div className="layout-body">
        <LeftSidebar />
        <main className="main-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: '#FAFAFA' }}>

          <div className="alw-layout" style={{ flex: 1, overflowY: 'auto', background: 'transparent' }}>
            <header className="alw-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#FAFAFA', borderBottom: '1px solid #E5E7EB', padding: '1.5rem 2rem' }}>
              <button
                onClick={() => navigate(-1)}
                style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', padding: '0.5rem', width: '36px', height: '36px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', transition: 'all 0.2s' }}
                onMouseOver={e => e.currentTarget.style.background = '#F8FAFC'}
                onMouseOut={e => e.currentTarget.style.background = 'white'}
              >
                <ArrowLeft size={16} strokeWidth={2.5} />
              </button>
              <h1 className="alw-title" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>{project.name}</h1>
            </header>
            <main className="alw-main">
              {step === 1 ? renderStep1() : renderStep2()}
            </main>
          </div>

        </main>
      </div>

      {/* ローディングオーバーレイ */}
      {isProcessing && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', zIndex: 1100, display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #FFF', borderBottomColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <div style={{ color: 'white', fontWeight: 700, letterSpacing: '0.2em' }}>
            AI AUTOMATIC ZONING...
          </div>
        </div>
      )}

      {/* プレゼン生成用 特別ローディングオーバーレイ */}
      {isActionProcessing && activeAction === 'presen' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(10px)', zIndex: 1100, display: 'flex', flexDirection: 'column', padding: '3rem', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ color: 'white', letterSpacing: '0.1em', marginBottom: '2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '24px', height: '24px', border: '3px solid #F59E0B', borderBottomColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            AI Generating Presentation...
          </h2>
          <div style={{ width: '100%', maxWidth: '700px', background: 'white', borderRadius: '8px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)', overflow: 'hidden', position: 'relative' }}>
            <div style={{ animation: 'slideIn 0.5s ease-out forwards', opacity: 0 }}>
              <h3 style={{ margin: 0, color: '#1E293B', fontSize: '1.25rem', fontWeight: 800 }}>Office Layout Proposal</h3>
              <p style={{ margin: '0.25rem 0 0 0', color: '#64748B', fontSize: '0.875rem' }}>次世代の働き方を実現するオフィスデザインをご提案</p>
            </div>
            
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem' }}>
              <div style={{ flex: 1, animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 1s forwards', opacity: 0 }}>
                <img src={MOCK_INTERIOR_IMAGES[2]} alt="Concept" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '6px' }} />
                <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.5rem' }}>メインコンセプトパース図 挿入完了</div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.5rem' }}>
                <div style={{ animation: 'slideIn 0.5s ease-out 1.2s forwards', opacity: 0, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <CheckCircle size={16} color="#10B981" /> <span style={{ fontSize: '0.9rem', color: '#334155' }}>コミュニケーションエリアの配置</span>
                </div>
                <div style={{ animation: 'slideIn 0.5s ease-out 1.4s forwards', opacity: 0, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <CheckCircle size={16} color="#10B981" /> <span style={{ fontSize: '0.9rem', color: '#334155' }}>集中ブース「CAP-CELL Lite」導入</span>
                </div>
                <div style={{ animation: 'slideIn 0.5s ease-out 1.6s forwards', opacity: 0, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <CheckCircle size={16} color="#10B981" /> <span style={{ fontSize: '0.9rem', color: '#334155' }}>自然光を活かした動線設計</span>
                </div>
              </div>
            </div>

            <div style={{ width: '100%', height: '100px', background: '#F8FAFC', border: '1px dashed #CBD5E1', borderRadius: '8px', marginTop: '1rem', animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 2.2s forwards', opacity: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#64748B', fontWeight: 600, fontSize: '0.9rem', gap: '0.5rem' }}>
              <span>🎥 3Dウォークスルー動画を生成・マッピング中...</span>
              <div style={{ width: '16px', height: '16px', border: '2px solid #64748B', borderBottomColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            </div>

            <div style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '1.5rem', animation: 'slideIn 0.5s ease-out 3.2s forwards', opacity: 0 }}>
              AIによる文脈の最適化と、採用ファニチャーのスペック表を統合しています...
            </div>
            
            <div style={{ width: '100%', height: '4px', background: '#38BDF8', borderRadius: '2px', position: 'absolute', bottom: 0, left: 0, animation: 'progressBar 4.5s linear forwards' }}></div>
          </div>
        </div>
      )}

      {/* 見積もり生成用 特別ローディングオーバーレイ */}
      {isActionProcessing && activeAction === 'estimate' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(10px)', zIndex: 1100, display: 'flex', flexDirection: 'column', padding: '3rem', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ color: 'white', letterSpacing: '0.1em', marginBottom: '2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '24px', height: '24px', border: '3px solid #10B981', borderBottomColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            AI Generating Estimate...
          </h2>
          <div style={{ width: '100%', maxWidth: '600px', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem', fontFamily: 'monospace', color: '#10B981', minHeight: '380px', boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.2)' }}>
            {MOCK_ESTIMATE_LINES.slice(0, visibleEstimateLines).map((line, idx) => (
              <div key={idx} style={{ lineHeight: '1.6', whiteSpace: 'pre', fontSize: '0.9rem', animation: 'fadeIn 0.2s ease-out' }}>
                {line || ' '}
              </div>
            ))}
            <div style={{ animation: 'blink 1s infinite' }}>_</div>
          </div>
        </div>
      )}

      {/* イメージ画像生成用 特別ローディングオーバーレイ */}
      {isActionProcessing && activeAction === 'image' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(10px)', zIndex: 1100, display: 'flex', flexDirection: 'column', padding: '3rem', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #38BDF8', borderBottomColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1.5rem' }}></div>
          <h2 style={{ color: 'white', letterSpacing: '0.1em', marginBottom: '2.5rem', fontWeight: 700 }}>AI Rendering Perspectives...</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', width: '100%', maxWidth: '900px' }}>
            {MOCK_INTERIOR_IMAGES.map((src, idx) => (
              <div key={idx} style={{ 
                aspectRatio: '4/3', 
                background: '#1E293B', 
                borderRadius: '8px', 
                overflow: 'hidden', 
                opacity: selectedImageIndices.includes(idx) ? 1 : 0.1, 
                transform: selectedImageIndices.includes(idx) ? 'scale(1)' : 'scale(0.95)', 
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: selectedImageIndices.includes(idx) ? '0 10px 25px -5px rgba(56, 189, 248, 0.4)' : 'none',
                border: selectedImageIndices.includes(idx) ? '2px solid #38BDF8' : '2px solid transparent'
              }}>
                <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="generating..." />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 結果モーダル */}
      {showResultModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.6)', zIndex: 1200, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
          <div style={{ background: 'white', borderRadius: '12px', width: '100%', maxWidth: activeAction === 'image' ? '1000px' : '800px', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'white', zIndex: 10 }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
                {activeAction === 'presen' && '生成完了：プレゼンテーション資料'}
                {activeAction === 'estimate' && '生成完了：概算見積書'}
                {activeAction === 'image' && '生成完了：3Dイメージ画像一覧'}
              </h2>
              <button 
                onClick={() => setShowResultModal(false)}
                style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6B7280' }}
              >
                &times;
              </button>
            </div>

            {activeAction === 'image' ? (
              <div style={{ padding: '2rem', background: '#F9FAFB' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                  {MOCK_INTERIOR_IMAGES.map((src, idx) => (
                    <div key={idx} style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', background: 'white' }}>
                      <img src={src} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }} alt={`perspective ${idx + 1}`} />
                      <div style={{ padding: '1rem', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.875rem', color: '#4B5563', fontWeight: 600 }}>アングル {idx + 1}</span>
                        <button style={{ background: 'white', border: '1px solid #D1D5DB', borderRadius: '4px', padding: '0.25rem 0.75rem', fontSize: '0.75rem', cursor: 'pointer' }}>保存</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <button 
                    onClick={() => setShowResultModal(false)}
                    style={{ background: '#10B981', color: 'white', border: 'none', padding: '0.75rem 2rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}
                  >
                    閉じる
                  </button>
                </div>
              </div>
            ) : activeAction === 'estimate' ? (
              <div style={{ padding: '2rem', background: '#F9FAFB' }}>
                <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                  {MOCK_ESTIMATE_LINES.map((line, idx) => (
                    <div key={idx} style={{ lineHeight: '1.8', whiteSpace: 'pre', fontFamily: 'monospace', fontSize: '1rem', color: '#374151' }}>
                      {line || ' '}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                  <button onClick={() => setShowResultModal(false)} style={{ background: 'white', color: '#374151', border: '1px solid #D1D5DB', padding: '0.75rem 2rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>閉じる</button>
                  <button style={{ background: '#10B981', color: 'white', border: 'none', padding: '0.75rem 2rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>CSV出力</button>
                </div>
              </div>
            ) : activeAction === 'presen' ? (
              <div style={{ padding: '0', background: '#E5E7EB', display: 'flex', flexDirection: 'column', height: '75vh' }}>
                <div style={{ padding: '1rem 1.5rem', background: '#374151', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 600 }}>提案資料_完成版.pptx</div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => setShowResultModal(false)} style={{ background: 'transparent', color: 'white', border: '1px solid #6B7280', padding: '0.4rem 1.5rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>閉じる</button>
                    <button style={{ background: '#F59E0B', color: 'white', border: 'none', padding: '0.4rem 1.5rem', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}>ダウンロード</button>
                  </div>
                </div>
                <div id="presen-scroll-container" style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.5rem', scrollBehavior: 'smooth' }}>
                  {/* スライド1：表紙 */}
                  <div style={{ flexShrink: 0, width: '100%', maxWidth: '900px', background: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', borderRadius: '4px', overflow: 'hidden', aspectRatio: '16/9', display: 'flex', position: 'relative' }}>
                    <div style={{ flex: 1, background: '#111827', padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: 'white' }}>
                      <div style={{ width: '40px', height: '4px', background: '#F59E0B', marginBottom: '1.5rem' }}></div>
                      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 1rem 0', lineHeight: 1.2 }}>Office Layout<br/>Proposal</h1>
                      <p style={{ fontSize: '1.1rem', color: '#9CA3AF', margin: 0 }}>次世代の働き方を実現するオフィス空間設計</p>
                      <div style={{ marginTop: 'auto', fontSize: '0.85rem', color: '#6B7280' }}>
                        株式会社デンソー勝山 様<br/>
                        2026年5月18日
                      </div>
                    </div>
                    <div style={{ flex: 1.5, background: '#E5E7EB' }}>
                      <img src={MOCK_INTERIOR_IMAGES[0]} alt="Office Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </div>

                  {/* スライド2：コンセプトと課題解決 */}
                  <div style={{ flexShrink: 0, width: '100%', maxWidth: '900px', background: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', borderRadius: '4px', overflow: 'hidden', aspectRatio: '16/9', padding: '3rem', display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1F2937', margin: '0 0 0.5rem 0' }}>Concept & Solutions</h2>
                    <div style={{ width: '60px', height: '3px', background: '#3B82F6', marginBottom: '2rem' }}></div>
                    <div style={{ display: 'flex', gap: '2rem', flex: 1 }}>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                          <h3 style={{ fontSize: '1.1rem', color: '#374151', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={20} color="#3B82F6" /> 偶発的なコミュニケーションの創出</h3>
                          <p style={{ fontSize: '0.9rem', color: '#6B7280', lineHeight: 1.6, margin: 0 }}>オープンなコミュニケーションスペースを執務室の中心に配置し、部門間の垣根を越えたアイデアの創出を促します。</p>
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.1rem', color: '#374151', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={20} color="#3B82F6" /> Web会議・集中作業への対応</h3>
                          <p style={{ fontSize: '0.9rem', color: '#6B7280', lineHeight: 1.6, margin: 0 }}>防音性の高い個室ブース「CAP-CELL Lite」を複数配置し、オンライン会議や深い集中を要する業務を快適にサポートします。</p>
                        </div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <img src={MOCK_INTERIOR_IMAGES[1]} alt="Communication Space" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                      </div>
                    </div>
                  </div>

                  {/* スライド3：プロダクトフォーカス（ユーザー添付画像を想定したレイアウト） */}
                  <div style={{ flexShrink: 0, width: '100%', maxWidth: '900px', background: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', borderRadius: '4px', overflow: 'hidden', aspectRatio: '16/9', padding: '3rem', display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1F2937', margin: '0 0 0.5rem 0' }}>Featured Product: 個室ブース</h2>
                    <div style={{ width: '60px', height: '3px', background: '#F59E0B', marginBottom: '2rem' }}></div>
                    <div style={{ display: 'flex', gap: '2rem', flex: 1 }}>
                      <div style={{ flex: 1, background: '#F9FAFB', borderRadius: '8px', overflow: 'hidden', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         {/* CAP-CELL Liteっぽいモック画像 */}
                         <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=600&q=80" alt="Booth" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h3 style={{ fontSize: '1.5rem', color: '#111827', margin: '0 0 1rem 0' }}>"CAP-CELL Lite"</h3>
                        <p style={{ fontSize: '1rem', color: '#4B5563', lineHeight: 1.6, marginBottom: '2rem' }}>機能性・コンパクト性を重視したスマートなワークスポット。高い遮音性と快適な換気システムで、24時間快適に作業が可能です。</p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div style={{ background: '#F3F4F6', padding: '1rem', borderRadius: '6px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔇</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>高い遮音性</div>
                          </div>
                          <div style={{ background: '#F3F4F6', padding: '1rem', borderRadius: '6px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💨</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>24時間換気</div>
                          </div>
                          <div style={{ background: '#F3F4F6', padding: '1rem', borderRadius: '6px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔌</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>AC・USBポート完備</div>
                          </div>
                          <div style={{ background: '#F3F4F6', padding: '1rem', borderRadius: '6px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💡</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>心地よい照明</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes popIn { 0% { opacity: 0; transform: scale(0.9); } 70% { opacity: 1; transform: scale(1.02); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes progressBar { 0% { width: 0%; } 100% { width: 100%; } }
      `}</style>
    </div>
  );
}
