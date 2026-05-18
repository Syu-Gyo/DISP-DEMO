import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UploadCloud, CheckCircle, ArrowLeft } from 'lucide-react';
import LeftSidebar from '../components/layout/LeftSidebar';
import './AutoLayoutWorkspace.css';

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

  const handleAction = (actionType) => {
    setActiveAction(actionType);
    setIsActionProcessing(true);
    setTimeout(() => {
      setIsActionProcessing(false);
      setShowResultModal(true);
    }, 2000);
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

      {/* 追加アクション処理中オーバーレイ */}
      {isActionProcessing && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', zIndex: 1100, display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #FFF', borderBottomColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <div style={{ color: 'white', fontWeight: 700, letterSpacing: '0.1em' }}>
            {activeAction === 'presen' && 'プレゼンテーション資料を生成中...'}
            {activeAction === 'estimate' && '概算見積りデータを集計中...'}
            {activeAction === 'image' && '3Dイメージ画像をレンダリング中...'}
          </div>
        </div>
      )}

      {/* 結果モーダル */}
      {showResultModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.6)', zIndex: 1200, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
          <div style={{ background: 'white', borderRadius: '12px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
                {activeAction === 'presen' && '生成完了：プレゼンテーション資料'}
                {activeAction === 'estimate' && '生成完了：概算見積書'}
                {activeAction === 'image' && '生成完了：3Dイメージ画像'}
              </h2>
              <button 
                onClick={() => setShowResultModal(false)}
                style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6B7280' }}
              >
                &times;
              </button>
            </div>
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', background: '#F9FAFB' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                {activeAction === 'presen' && '📊'}
                {activeAction === 'estimate' && '💴'}
                {activeAction === 'image' && '🖼️'}
              </div>
              <h3 style={{ fontSize: '1.5rem', color: '#374151', marginBottom: '1rem' }}>
                {activeAction === 'presen' && '提案用プレゼン資料（PPTX形式）が生成されました'}
                {activeAction === 'estimate' && '概算見積書（PDF/Excel形式）が生成されました'}
                {activeAction === 'image' && '高画質3Dパース画像（JPG形式）が生成されました'}
              </h3>
              <p style={{ color: '#6B7280', marginBottom: '2rem' }}>※これはデモ画面です。本番環境ではここにプレビューやダウンロードボタンが表示されます。</p>
              <button 
                onClick={() => setShowResultModal(false)}
                style={{ background: '#10B981', color: 'white', border: 'none', padding: '0.75rem 2rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
