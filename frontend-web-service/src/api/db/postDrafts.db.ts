export type PostDraftPayload = {
  title: string;
  images: string[];
  summary: string;
  detail: string;
  reservation: string;
  address: string;
  venueName: string;
  budget: string;
  startTime: string;
  endTime: string;
  category: string;
};

export type PostDraftItem = PostDraftPayload & {
  id: string;
  savedAt: string;
};

const STORAGE_KEY = 'eventpick-post-drafts-v1';

export const postDraftsDb: PostDraftItem[] = [
  {
    id: 'seed-001',
    savedAt: '2026-03-06T15:40:00',
    title: 'サマーミュージックフェス2026 先行告知',
    images: [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    ],
    summary: '夏の大型音楽フェス開催告知。出演者情報と開始時刻を掲載予定。',
    detail:
      '開催日: 2026/08/20\n会場: EventPickアリーナ\n出演: 複数アーティスト\n注意事項やチケット情報を追記予定。',
    reservation: 'https://eventpick.example.com/fes2026',
    address: '東京都渋谷区神南1-3-1',
    venueName: 'EventPickアリーナ',
    budget: '¥3,000 - ¥8,000',
    startTime: '14:30',
    endTime: '22:00',
    category: 'ライブ',
  },
  {
    id: 'seed-002',
    savedAt: '2026-03-05T11:15:00',
    title: '初めて向け料理教室 体験会',
    images: [
      'https://images.unsplash.com/photo-1556911220-bda9f7f7597e?auto=format&fit=crop&w=1200&q=80',
    ],
    summary: '初心者向けの料理体験イベント。持ち物と集合時刻を明記する下書き。',
    detail:
      '料理初心者向けの体験会です。\n包丁の扱い方から簡単な一皿まで実習形式で進行。\nエプロン持参。',
    reservation: 'https://eventpick.example.com/cooking',
    address: '東京都新宿区西新宿2-8-1',
    venueName: 'EventPickクッキングスタジオ',
    budget: '¥2,500',
    startTime: '10:00',
    endTime: '13:00',
    category: '体験',
  },
  {
    id: 'seed-003',
    savedAt: '2026-03-02T20:05:00',
    title: '週末アート展覧会 ハイライト投稿',
    images: [
      'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80',
    ],
    summary: '展示内容の見どころを短くまとめた紹介投稿の下書き。',
    detail:
      '現代アートの展示会。\nフォトスポットと限定グッズの案内を本文に追加予定。\n混雑時間帯の注意喚起あり。',
    reservation: 'https://eventpick.example.com/artweek',
    address: '東京都港区六本木7-10-1',
    venueName: 'EventPickギャラリー',
    budget: '一般 ¥1,200 / 学生 ¥800',
    startTime: '09:00',
    endTime: '18:00',
    category: 'イベント',
  },
];

const canUseStorage = (): boolean => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const parseDrafts = (raw: string | null): PostDraftItem[] => {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is PostDraftItem => {
      if (!item || typeof item !== 'object') return false;
      const candidate = item as Partial<PostDraftItem>;
      return typeof candidate.id === 'string'
        && typeof candidate.savedAt === 'string'
        && typeof candidate.title === 'string'
        && Array.isArray(candidate.images);
    });
  } catch {
    return [];
  }
};

const readDrafts = (): PostDraftItem[] => {
  if (!canUseStorage()) return [];
  return parseDrafts(window.localStorage.getItem(STORAGE_KEY));
};

const writeDrafts = (items: PostDraftItem[]): void => {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const listPostDrafts = (): PostDraftItem[] => {
  const saved = readDrafts();
  const merged = [...saved, ...postDraftsDb];
  return merged.sort((a, b) => (a.savedAt < b.savedAt ? 1 : -1));
};

export const upsertPostDraft = (payload: PostDraftPayload): PostDraftItem | null => {
  if (!canUseStorage()) return null;

  const nowIso = new Date().toISOString();
  const drafts = readDrafts();

  const existingIdx = drafts.findIndex((item) =>
    item.title.trim() === payload.title.trim() && item.summary.trim() === payload.summary.trim(),
  );

  const nextItem: PostDraftItem = {
    id: existingIdx >= 0 ? drafts[existingIdx].id : `draft-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    savedAt: nowIso,
    ...payload,
  };

  if (existingIdx >= 0) {
    drafts[existingIdx] = nextItem;
  } else {
    drafts.push(nextItem);
  }

  writeDrafts(drafts);
  return nextItem;
};

export const deletePostDraft = (id: string): void => {
  const drafts = readDrafts();
  writeDrafts(drafts.filter((item) => item.id !== id));
};
