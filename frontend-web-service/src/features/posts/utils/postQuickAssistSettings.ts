export type AssistFieldKey = 'summary' | 'detail' | 'budget' | 'startTime' | 'endTime' | 'reservation';

export type QuickAssistBuildContext = {
  title: string;
  category: string;
  venueName: string;
  address: string;
  startTime: string;
  endTime: string;
  budget: string;
};

export type QuickAssistTemplate = {
  key: string;
  label: string;
  summary: string;
  buildDetail: (context: QuickAssistBuildContext) => string;
  reservationHint: string;
};

export type EventTimeTemplate = {
  key: string;
  label: string;
  startTime: string;
  endTime: string;
};

export type BudgetTemplate = {
  key: string;
  label: string;
  value: string;
};

export type AssistFieldOption = {
  key: AssistFieldKey;
  label: string;
};

export const ASSIST_NONE_VALUE = '';

export const DEFAULT_APPLY_FIELDS: AssistFieldKey[] = [
  'summary',
  'detail',
  'budget',
  'startTime',
  'endTime',
  'reservation',
];

const QUICK_ASSIST_TEMPLATES: QuickAssistTemplate[] = [
  {
    key: 'event-standard',
    label: 'イベント告知（基本）',
    summary: '開催情報をまとめたイベント告知です。ぜひご参加ください。',
    reservationHint: '予約サイトURL: https://',
    buildDetail: (c) => `【${c.title || 'イベント名を入力'} 開催！】\n\n地域の注目コンテンツが集まるイベントです。\n${c.category || 'カテゴリー'}を中心に、来場者同士で楽しめる企画を用意しています。\n\n日時: ${c.startTime || '開始時間未設定'} - ${c.endTime || '終了時間未設定'}\n場所: ${c.venueName || '会場名を入力'}（${c.address || '住所を入力'}）\n参加費: ${c.budget || '料金情報を入力'}\n\n友達やご家族とぜひお越しください。`,
  },
  {
    key: 'campaign',
    label: 'キャンペーン案内',
    summary: '期間限定キャンペーンを実施中です。お得な機会をお見逃しなく。',
    reservationHint: '事前予約不要（必要な場合はURLを記載）',
    buildDetail: (c) => `週末、街に新しい楽しみが生まれます。\n\n${c.venueName || '会場名を入力'}で、地域の店舗とコラボした特別キャンペーンを開催します。\nいつもよりお得に体験できる機会です。\n\n日時: ${c.startTime || '開始時間未設定'} - ${c.endTime || '終了時間未設定'}\n場所: ${c.address || '住所を入力'}\n内容: ${c.budget || '特典内容を入力'}\n\nこの機会にぜひご参加ください。`,
  },
  {
    key: 'live',
    label: 'ライブ/ステージ告知',
    summary: 'ライブ開催のお知らせです。音楽と空間をぜひお楽しみください。',
    reservationHint: 'チケットURL: https://',
    buildDetail: (c) => `音楽・出会い・高揚感。\n\nステージと観客が一体になれるライブイベントを開催します。\n初めての方でも楽しめる構成です。\n\n日時: ${c.startTime || '開始時間未設定'} - ${c.endTime || '終了時間未設定'}\n場所: ${c.venueName || '会場名を入力'}\n料金: ${c.budget || '料金情報を入力'}\n住所: ${c.address || '住所を入力'}\n\nぜひ会場で体感してください。`,
  },
  {
    key: 'food-fair',
    label: 'フードフェス告知',
    summary: '人気店が集まるフードイベントを開催します。食べ歩きをお楽しみください。',
    reservationHint: '整理券URL: https://',
    buildDetail: (c) => `【${c.title || 'フードフェス'} 開催】\n\n楽しめるポイント\n\n・人気フード店の限定出店\n・ライブパフォーマンス\n・フォトスポット\n・限定メニュー\n\n日時: ${c.startTime || '開始時間未設定'} - ${c.endTime || '終了時間未設定'}\n場所: ${c.venueName || '会場名を入力'}（${c.address || '住所を入力'}）\n料金: ${c.budget || '料金情報を入力'}\n\n週末のお出かけにぜひ。`,
  },
  {
    key: 'workshop',
    label: '体験ワークショップ',
    summary: '初心者歓迎の体験型ワークショップです。気軽にご参加ください。',
    reservationHint: '予約フォームURL: https://',
    buildDetail: (c) => `週末どこへ行こうか迷っていませんか？\n\nもしまだなら、体験ワークショップに参加してみませんか。\n学びと交流を同時に楽しめる内容です。\n\n日時: ${c.startTime || '開始時間未設定'} - ${c.endTime || '終了時間未設定'}\n場所: ${c.venueName || '会場名を入力'}\n住所: ${c.address || '住所を入力'}\n参加費: ${c.budget || '料金情報を入力'}\n\n気軽なご参加をお待ちしています。`,
  },
  {
    key: 'tour',
    label: '観光ツアー募集',
    summary: '地域の魅力を体験できる観光ツアーを実施します。',
    reservationHint: 'ツアー申込URL: https://',
    buildDetail: (c) => `開催まであと3日。\n\n人気の地域ツアー\n【${c.title || '観光ツアー'}】を実施します。\n\n街の魅力を歩いて体験しながら、特別な週末を過ごしましょう。\n\n日時: ${c.startTime || '開始時間未設定'} - ${c.endTime || '終了時間未設定'}\n集合: ${c.venueName || '集合場所を入力'}\n住所: ${c.address || '住所を入力'}\n料金: ${c.budget || '料金情報を入力'}`,
  },
  {
    key: 'family',
    label: 'ファミリー向け案内',
    summary: '家族で楽しめるイベントです。お子さま連れも安心して参加できます。',
    reservationHint: '参加申込URL: https://',
    buildDetail: (c) => `こんな方におすすめです。\n\n・家族で週末を過ごしたい\n・子どもと一緒に楽しみたい\n・安心できる会場を探している\n\nそんな方はぜひ\n【${c.title || 'ファミリーイベント'}】へ。\n\n日時: ${c.startTime || '開始時間未設定'} - ${c.endTime || '終了時間未設定'}\n場所: ${c.venueName || '会場名を入力'}\n住所: ${c.address || '住所を入力'}\n料金: ${c.budget || '料金情報を入力'}`,
  },
  {
    key: 'business',
    label: 'ビジネス/交流会告知',
    summary: '業界交流と情報共有を目的としたイベントを開催します。',
    reservationHint: '参加登録URL: https://',
    buildDetail: (c) => `青空の下で語り合い、学び合える交流の場を用意しました。\n\n立場を超えてつながれる、コミュニティ型の交流会です。\n\n日時: ${c.startTime || '開始時間未設定'} - ${c.endTime || '終了時間未設定'}\n会場: ${c.venueName || '会場名を入力'}\n住所: ${c.address || '住所を入力'}\n参加費: ${c.budget || '料金情報を入力'}\n\n新しい出会いを見つけにぜひご参加ください。`,
  },
  {
    key: 'community',
    label: 'コミュニティ型告知',
    summary: '地域のみんなで作るイベントです。地元の魅力を一緒に楽しみましょう。',
    reservationHint: '参加申込URL: https://',
    buildDetail: (c) => `地域のみんなで楽しむイベントを開催します。\n\n地元のお店やクリエイターが集まり、街を盛り上げる1日です。\n\n日時: ${c.startTime || '開始時間未設定'} - ${c.endTime || '終了時間未設定'}\n場所: ${c.venueName || '会場名を入力'}\n住所: ${c.address || '住所を入力'}\n参加費: ${c.budget || '料金情報を入力'}\n\nぜひご参加ください。`,
  },
  {
    key: 'sns-spread',
    label: 'SNS拡散型告知',
    summary: 'SNSでも話題にしやすい短文構成で、拡散しやすい告知です。',
    reservationHint: 'イベントページURL: https://',
    buildDetail: (c) => `週末はイベントへ。\n\n【${c.title || 'イベント名を入力'}】\n\n${c.category || 'イベント'}を楽しめる地域イベント開催。\n\n日時: ${c.startTime || '開始時間未設定'} - ${c.endTime || '終了時間未設定'}\n場所: ${c.venueName || '会場名を入力'}\n住所: ${c.address || '住所を入力'}\n料金: ${c.budget || '料金情報を入力'}\n\n#イベント\n#地域イベント\n#週末おでかけ`,
  },
];

const EVENT_TIME_TEMPLATES: EventTimeTemplate[] = [
  { key: 'previous-day', label: '前日（終日寄り）', startTime: '09:00', endTime: '23:00' },
  { key: 'early-morning', label: '早朝', startTime: '06:00', endTime: '08:30' },
  { key: 'morning', label: '午前（朝イベント）', startTime: '08:00', endTime: '11:30' },
  { key: 'afternoon', label: '午後', startTime: '13:00', endTime: '17:00' },
  { key: 'evening', label: '夕方', startTime: '16:00', endTime: '19:00' },
  { key: 'night', label: '夜（ナイトイベント）', startTime: '18:30', endTime: '22:30' },
  { key: 'late-night', label: '深夜', startTime: '22:00', endTime: '01:00' },
];

const BUDGET_TEMPLATES: BudgetTemplate[] = [
  { key: 'free', label: '無料テンプレート', value: '無料' },
  { key: 'free-donation', label: '無料（投げ銭歓迎）', value: '無料（投げ銭歓迎）' },
  { key: 'paid-light', label: '有料（ライト）', value: '一般 ¥1,000 / 学割 ¥500' },
  { key: 'paid-standard', label: '有料（標準）', value: '一般 ¥2,000 / 学割 ¥1,500' },
  { key: 'paid-premium', label: '有料（プレミアム）', value: '一般 ¥4,500 / VIP ¥8,000' },
  { key: 'drink-ticket', label: '1ドリンク別', value: '入場 ¥2,500 + 1ドリンク ¥600' },
  { key: 'family-pack', label: 'ファミリー料金', value: '大人 ¥1,500 / 小学生以下 無料' },
];

const ASSIST_FIELD_OPTIONS: AssistFieldOption[] = [
  { key: 'summary', label: '説明概要' },
  { key: 'detail', label: '詳細説明' },
  { key: 'budget', label: '予算' },
  { key: 'startTime', label: '開始時間' },
  { key: 'endTime', label: '終了時間' },
  { key: 'reservation', label: '予約欄' },
];

export type PostQuickAssistSettings = {
  templates: QuickAssistTemplate[];
  eventTimes: EventTimeTemplate[];
  budgets: BudgetTemplate[];
  fieldOptions: AssistFieldOption[];
};

export const getPostQuickAssistSettings = (): PostQuickAssistSettings => {
  return {
    templates: QUICK_ASSIST_TEMPLATES,
    eventTimes: EVENT_TIME_TEMPLATES,
    budgets: BUDGET_TEMPLATES,
    fieldOptions: ASSIST_FIELD_OPTIONS,
  };
};
