/**
 * EventDetailScreen — 投稿詳細画面
 * ─────────────────────────────────────────────
 * 2ページ横スワイプレイアウト
 *   Page 1: 写真カルーセル / イベント名 / 時間・場所 / カテゴリー / 概要
 *   Page 2: エリアマップ / 予約欄 / 詳細説明
 *
 * 動線: 投稿一覧 → 「詳細を見る」 → /events/:id
 * 既存コードには一切変更を加えない。
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiMapPin, FiUsers, FiCalendar, FiShare2, FiHeart, FiChevronLeft, FiChevronRight, FiExternalLink } from 'react-icons/fi';
import styles from './EventDetailScreen.module.css';

// ─── ダミーデータ（実際はAPIから取得） ─────────────────────────
interface EventDetail {
  id: string;
  title: string;
  images: { url: string; alt: string; color: string; emoji: string }[];
  timeStart: string;
  timeEnd: string;
  location: string;
  address: string;
  categories: string[];
  overview: string;
  mapEmbedUrl: string;
  mapLink: string;
  reservationTotal: number;
  reservationRemaining: number;
  details: {
    menuHighlights?: string[];
    dressCode?: string;
    guestSpeakers?: { name: string; title: string }[];
    notes?: string[];
  };
  company: string;
  likes: number;
}

const EVENT_DUMMY: EventDetail = {
  id: '1',
  title: 'Elegant Evening Dining Experience',
  images: [
    { url: '', alt: '会場メイン', color: 'linear-gradient(135deg,#1a2a4a 0%,#0d3060 100%)', emoji: '🍽️' },
    { url: '', alt: 'テーブルセッティング', color: 'linear-gradient(135deg,#1e1040 0%,#3a1060 100%)', emoji: '🥂' },
    { url: '', alt: '料理', color: 'linear-gradient(135deg,#102820 0%,#1a4030 100%)', emoji: '🍝' },
    { url: '', alt: 'スピーカー', color: 'linear-gradient(135deg,#2a1010 0%,#502020 100%)', emoji: '🎤' },
  ],
  timeStart: '15:00',
  timeEnd: '18:00',
  location: '渋谷 Jinnan 1-2-3',
  address: '東京都渋谷区神南1-2-3 イベントホール4F',
  categories: ['Italian', 'Formal', 'Networking'],
  overview:
    'An exclusive evening of fine Italian cuisine, elegant dining, and premier networking opportunities with industry leaders. Formal attire required. Limited seats available.',
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.7!2d139.699!3d35.662!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s%E6%B8%8B%E8%B0%B7!5e0!3m2!1sja!2sjp!4v1',
  mapLink: 'https://maps.google.com/?q=渋谷+Jinnan+1-2-3',
  reservationTotal: 50,
  reservationRemaining: 12,
  details: {
    menuHighlights: [
      'Multi-course Italian tasting menu',
      'Handmade pasta with truffle sauce',
      'Selection of aged wines and cocktails',
      'Decadent chocolate fondant dessert',
    ],
    dressCode:
      'Black tie optional, formal business attire required for gentlemen; evening dresses or formal wear for ladies.',
    guestSpeakers: [
      { name: 'Mr. Akira Tanaka', title: 'CEO of Global Innovations - Keynote Speaker on Future Trends' },
      { name: 'Ms. Elena Rossi', title: 'Renowned Italian Chef & Author - Talk on Culinary Excellence' },
    ],
    notes: ['Limited seats – early booking recommended', 'Valet parking available'],
  },
  company: 'Solvevia Entertainment',
  likes: 128,
};

// IDに応じてデータを返す（将来はAPIに差し替え）
const getEventById = (_id: string): EventDetail => EVENT_DUMMY;

// ─── サブコンポーネント ───────────────────────────────────────

/** 写真カルーセル */
const ImageCarousel: React.FC<{ images: EventDetail['images'] }> = ({ images }) => {
  const [current, setCurrent] = useState(0);
  const total = images.length;

  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);

  // タッチスワイプ
  const touchStartX = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd  = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
  };

  return (
    <div className={styles.carousel} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {/* スライド */}
      {images.map((img, i) => (
        <div
          key={i}
          className={styles.carouselSlide}
          style={{
            transform: `translateX(${(i - current) * 100}%)`,
            background: img.color,
          }}
          aria-hidden={i !== current}
        >
          {img.url ? (
            <img src={img.url} alt={img.alt} className={styles.carouselImg} />
          ) : (
            <div className={styles.carouselPlaceholder}>
              <span className={styles.carouselEmoji}>{img.emoji}</span>
              <span className={styles.carouselAlt}>{img.alt}</span>
            </div>
          )}
        </div>
      ))}

      {/* ← → ボタン */}
      <button className={`${styles.carouselBtn} ${styles.carouselBtnLeft}`} onClick={prev} aria-label="前の画像">
        <FiChevronLeft />
      </button>
      <button className={`${styles.carouselBtn} ${styles.carouselBtnRight}`} onClick={next} aria-label="次の画像">
        <FiChevronRight />
      </button>

      {/* ドットインジケーター */}
      <div className={styles.carouselDots} role="tablist" aria-label="画像インジケーター">
        {images.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === current}
            aria-label={`画像 ${i + 1}`}
            className={`${styles.carouselDot} ${i === current ? styles.carouselDotActive : ''}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </div>
  );
};

/** カテゴリーバッジ */
const CategoryBadge: React.FC<{ label: string; index: number }> = ({ label, index }) => {
  const colors = [
    { bg: 'rgba(229,57,53,0.85)', text: '#fff' },
    { bg: 'rgba(25,118,210,0.85)', text: '#fff' },
    { bg: 'rgba(56,142,60,0.85)', text: '#fff' },
    { bg: 'rgba(123,31,162,0.85)', text: '#fff' },
    { bg: 'rgba(245,124,0,0.85)', text: '#fff' },
  ];
  const c = colors[index % colors.length];
  return (
    <span className={styles.badge} style={{ background: c.bg, color: c.text }}>
      {label}
    </span>
  );
};

/** インフォピル（時間・場所） */
const InfoPill: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <div className={styles.infoPill}>
    <span className={styles.infoPillIcon}>{icon}</span>
    <span className={styles.infoPillText}>{text}</span>
  </div>
);

// ─── メイン画面 ─────────────────────────────────────────────

const EventDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const event = getEventById(id ?? '1');

  // ページインジケーター（0: Overview, 1: Details）
  const [page, setPage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [reserved, setReserved] = useState(false);
  const [reserving, setReserving] = useState(false);

  // 横スワイプ
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd  = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) setPage(diff > 0 ? 1 : 0);
  };

  const handleReserve = async () => {
    if (reserved) return;
    setReserving(true);
    await new Promise((r) => setTimeout(r, 900));
    setReserved(true);
    setReserving(false);
  };

  const filledSeats = event.reservationTotal - event.reservationRemaining;
  const fillPct = Math.round((filledSeats / event.reservationTotal) * 100);

  return (
    <div className={styles.root}>
      {/* ── ステータスバー風ヘッダー ───────────── */}
      <header className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate(-1)} aria-label="戻る">
          <FiArrowLeft />
        </button>
        <div className={styles.topBarCenter}>
          <span className={styles.topBarLogo}>EventPick</span>
          <span className={styles.topBarDate}>
            <FiCalendar className={styles.topBarIcon} aria-hidden />
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} | {new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className={styles.topBarActions}>
          <button
            className={`${styles.actionBtn} ${liked ? styles.actionBtnLiked : ''}`}
            onClick={() => setLiked((l) => !l)}
            aria-label={liked ? 'いいねを取り消す' : 'いいねする'}
          >
            <FiHeart />
          </button>
          <button className={styles.actionBtn} aria-label="シェア">
            <FiShare2 />
          </button>
        </div>
      </header>

      {/* ── ページナビゲータ (ドット) ──────────── */}
      <div className={styles.pageNav}>
        <button
          className={`${styles.pageNavTab} ${page === 0 ? styles.pageNavTabActive : ''}`}
          onClick={() => setPage(0)}
        >
          概要
        </button>
        <button
          className={`${styles.pageNavTab} ${page === 1 ? styles.pageNavTabActive : ''}`}
          onClick={() => setPage(1)}
        >
          詳細・予約
        </button>
      </div>

      {/* ── スワイプコンテナ ──────────────────── */}
      <div
        ref={containerRef}
        className={styles.swipeContainer}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className={styles.swipeTrack}
          style={{ transform: `translateX(${page === 0 ? '0%' : '-50%'})`  }}
        >

          {/* ═══════════════════════════════════════
              PAGE 1 — Overview
          ═══════════════════════════════════════ */}
          <div className={styles.swipePage}>
            <div className={styles.pageContent}>

              {/* 写真カルーセル */}
              <ImageCarousel images={event.images} />

              {/* イベント名 */}
              <div className={styles.card}>
                <h1 className={styles.eventTitle}>{event.title}</h1>

                {/* 時間・場所ピル */}
                <div className={styles.infoRow}>
                  <InfoPill icon={<FiClock />} text={`${event.timeStart}–${event.timeEnd}`} />
                  <InfoPill icon={<FiMapPin />} text={event.location} />
                </div>

                {/* カテゴリーバッジ */}
                <div className={styles.badgeRow}>
                  {event.categories.map((cat, i) => (
                    <CategoryBadge key={cat} label={cat} index={i} />
                  ))}
                </div>
              </div>

              {/* 概要 */}
              <div className={styles.card}>
                <h2 className={styles.sectionTitle}>Overview 🙌🎊</h2>
                <p className={styles.overviewText}>{event.overview}</p>
              </div>

              {/* 会社・いいね */}
              <div className={`${styles.card} ${styles.companyRow}`}>
                <span className={styles.companyName}>{event.company}</span>
                <span className={styles.likeCount}>
                  <FiHeart className={liked ? styles.likedIcon : styles.unlikedIcon} />
                  {event.likes + (liked ? 1 : 0)}
                </span>
              </div>

              {/* → 詳細へ誘導 */}
              <button className={styles.nextPageBtn} onClick={() => setPage(1)}>
                詳細・予約を見る
                <FiChevronRight className={styles.nextPageIcon} />
              </button>

            </div>
          </div>

          {/* ═══════════════════════════════════════
              PAGE 2 — Details & Reservation
          ═══════════════════════════════════════ */}
          <div className={styles.swipePage}>
            <div className={styles.pageContent}>

              {/* エリアマップ */}
              <div className={styles.card}>
                <h2 className={styles.sectionTitle}>Area Map</h2>
                <div className={styles.mapBox}>
                  <div className={styles.mapPlaceholder}>
                    <FiMapPin className={styles.mapPinIcon} />
                    <p className={styles.mapAddr}>{event.address}</p>
                    <p className={styles.mapSubAddr}>{event.location}</p>
                  </div>
                  <a
                    href={event.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.mapOpenLink}
                  >
                    <FiExternalLink className={styles.mapOpenIcon} />
                    Open in Maps
                  </a>
                </div>
              </div>

              {/* 予約欄 */}
              <div className={styles.card}>
                <h2 className={styles.sectionTitle}>Reservation</h2>

                <button
                  className={`${styles.reserveBtn} ${reserved ? styles.reserveBtnDone : ''} ${reserving ? styles.reserveBtnLoading : ''}`}
                  onClick={handleReserve}
                  disabled={reserved || reserving}
                  aria-label="予約する"
                >
                  {reserving ? '処理中…' : reserved ? '予約済み ✓' : 'Reserve'}
                </button>

                {/* 残席インジケーター */}
                <div className={styles.seatsRow}>
                  <FiUsers className={styles.seatsIcon} />
                  <span className={styles.seatsText}>
                    {event.reservationRemaining} spots remaining out of {event.reservationTotal}
                  </span>
                </div>
                <div className={styles.seatsBar}>
                  <div
                    className={styles.seatsBarFill}
                    style={{ width: `${fillPct}%` }}
                    role="progressbar"
                    aria-valuenow={fillPct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
              </div>

              {/* Event Details */}
              <div className={styles.card}>
                <h2 className={styles.sectionTitle}>Event Details</h2>

                {event.details.menuHighlights && (
                  <div className={styles.detailSection}>
                    <h3 className={styles.detailSubTitle}>Menu Highlights</h3>
                    <ul className={styles.bulletList}>
                      {event.details.menuHighlights.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {event.details.dressCode && (
                  <div className={styles.detailSection}>
                    <h3 className={styles.detailSubTitle}>Dress Code</h3>
                    <p className={styles.detailText}>{event.details.dressCode}</p>
                  </div>
                )}

                {event.details.guestSpeakers && (
                  <div className={styles.detailSection}>
                    <h3 className={styles.detailSubTitle}>Special Guest Speakers</h3>
                    {event.details.guestSpeakers.map((s, i) => (
                      <div key={i} className={styles.speakerRow}>
                        <span className={styles.speakerName}>• {s.name},</span>
                        <span className={styles.speakerTitle}> {s.title}</span>
                      </div>
                    ))}
                  </div>
                )}

                {event.details.notes && (
                  <div className={styles.detailSection}>
                    <h3 className={styles.detailSubTitle}>Notes</h3>
                    <ul className={styles.bulletList}>
                      {event.details.notes.map((n, i) => <li key={i}>{n}</li>)}
                    </ul>
                  </div>
                )}
              </div>

              <div className={styles.bottomPad} />
            </div>
          </div>
        </div>{/* /swipeTrack */}
      </div>{/* /swipeContainer */}

      {/* ── スワイプヒント ──────────────────────── */}
      <div className={styles.swipeHint} aria-hidden>
        {page === 0 ? '← スワイプで詳細へ' : 'スワイプで概要へ →'}
      </div>
    </div>
  );
};

export default EventDetailScreen;
