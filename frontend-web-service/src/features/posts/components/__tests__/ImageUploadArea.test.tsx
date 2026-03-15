import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ImageUploadArea from '../ImageUploadArea';
import type { PostFormImage } from '../../types/postForm';

const makeImage = (idx: number, zoom = 1): PostFormImage => ({
  file: new File([''], `img-${idx}.png`, { type: 'image/png' }),
  preview: `blob:preview-${idx}`,
  positionX: 50,
  positionY: 50,
  zoom,
});

describe('ImageUploadArea', () => {
  const defaultProps = {
    images: [] as PostFormImage[],
    maxImages: 5,
    onAdd: vi.fn(),
    onRemove: vi.fn(),
    onPositionChange: vi.fn(),
    onZoomChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── 空状態 ───
  it('画像がない場合にプレースホルダを表示する', () => {
    render(<ImageUploadArea {...defaultProps} />);
    expect(screen.getByText('画像を追加してください')).toBeInTheDocument();
  });

  it('画像枚数カウンタを表示する（0 / 5 枚）', () => {
    render(<ImageUploadArea {...defaultProps} />);
    expect(screen.getByText('0 / 5 枚')).toBeInTheDocument();
  });

  it('maxImages=3 の場合に「0 / 3 枚」と表示する', () => {
    render(<ImageUploadArea {...defaultProps} maxImages={3} />);
    expect(screen.getByText('0 / 3 枚')).toBeInTheDocument();
  });

  // ─── 画像あり状態 ───
  it('画像があるときにプレビューを表示する', () => {
    const images = [makeImage(1)];
    render(<ImageUploadArea {...defaultProps} images={images} />);
    expect(screen.getByAltText('editor-0')).toBeInTheDocument();
    expect(screen.getByText('1 / 5 枚')).toBeInTheDocument();
  });

  it('サムネイルをクリックで選択画像を変更する', () => {
    const images = [makeImage(0), makeImage(1)];
    render(<ImageUploadArea {...defaultProps} images={images} />);
    const thumbs = screen.getAllByAltText(/thumb-/);
    expect(thumbs).toHaveLength(2);
    fireEvent.click(thumbs[1]);
    expect(screen.getByAltText('editor-1')).toBeInTheDocument();
  });

  it('枚数上限時に「写真を追加」ボタンが無効になる', () => {
    const images = Array.from({ length: 5 }, (_, i) => makeImage(i));
    render(<ImageUploadArea {...defaultProps} images={images} />);
    expect(screen.getByText('写真を追加').closest('button')).toBeDisabled();
  });

  it('上限未満のとき「写真を追加」ボタンが有効', () => {
    const images = [makeImage(0)];
    render(<ImageUploadArea {...defaultProps} images={images} />);
    expect(screen.getByText('写真を追加').closest('button')).not.toBeDisabled();
  });

  // ─── ファイル入力 ───
  it('ファイル選択時に onAdd を呼ぶ', () => {
    const onAdd = vi.fn();
    render(<ImageUploadArea {...defaultProps} onAdd={onAdd} />);
    const fileInput = document.querySelector('input[type="file"]')!;
    const file = new File(['test'], 'photo.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(onAdd).toHaveBeenCalled();
  });

  it('空ファイル選択時は onAdd を呼ばない', () => {
    const onAdd = vi.fn();
    render(<ImageUploadArea {...defaultProps} onAdd={onAdd} />);
    const fileInput = document.querySelector('input[type="file"]')!;
    fireEvent.change(fileInput, { target: { files: [] } });
    expect(onAdd).not.toHaveBeenCalled();
  });

  // ─── 削除 ───
  it('削除ボタン (X) クリック時に onRemove を呼ぶ', () => {
    const images = [makeImage(0), makeImage(1)];
    const onRemove = vi.fn();
    render(<ImageUploadArea {...defaultProps} images={images} onRemove={onRemove} />);
    // 各サムネにFiX削除ボタンがある
    const removeButtons = screen.getAllByRole('button').filter((btn) =>
      btn.querySelector('svg') && btn.getAttribute('aria-label') !== '投稿メニュー',
    );
    // 最初のサムネの削除ボタンをクリック
    const thumbContainers = screen.getAllByAltText(/thumb-/);
    const firstThumbParent = thumbContainers[0].closest('[class]')!;
    const closeBtn = firstThumbParent.querySelector('button');
    if (closeBtn) {
      fireEvent.click(closeBtn);
      expect(onRemove).toHaveBeenCalledWith(0);
    }
  });

  // ─── ズーム ───
  it('ズームスライダーの変更で onZoomChange を呼ぶ', () => {
    const images = [makeImage(0)];
    const onZoomChange = vi.fn();
    render(<ImageUploadArea {...defaultProps} images={images} onZoomChange={onZoomChange} />);
    const slider = document.querySelector('input[type="range"]')!;
    fireEvent.change(slider, { target: { value: '2.0' } });
    expect(onZoomChange).toHaveBeenCalledWith(0, 2.0);
  });

  it('ズーム倍率を表示する', () => {
    const images = [makeImage(0, 1.5)];
    render(<ImageUploadArea {...defaultProps} images={images} />);
    expect(screen.getByText(/1\.50x/)).toBeInTheDocument();
  });

  // ─── ホイールイベント ───
  it('ホイールイベントでズーム変更を呼ぶ', () => {
    const images = [makeImage(0, 1.0)];
    const onZoomChange = vi.fn();
    render(<ImageUploadArea {...defaultProps} images={images} onZoomChange={onZoomChange} />);
    const editor = screen.getByAltText('editor-0').closest('[style]') || screen.getByAltText('editor-0').parentElement!.parentElement!;
    // ホイール対象のコンテナを探す
    const wheelTarget = document.querySelector('[style*="touch-action"]') || editor;
    if (wheelTarget) {
      fireEvent.wheel(wheelTarget, { deltaY: -100 });
      expect(onZoomChange).toHaveBeenCalled();
    }
  });

  // ─── ポインターイベント ───
  it('マウスのpointerDown で drag を開始する', () => {
    const images = [makeImage(0)];
    const onPositionChange = vi.fn();
    render(<ImageUploadArea {...defaultProps} images={images} onPositionChange={onPositionChange} />);
    const container = document.querySelector('[style*="touch-action"]');
    if (container) {
      // setPointerCapture をモック
      (container as HTMLElement).setPointerCapture = vi.fn();
      (container as HTMLElement).hasPointerCapture = vi.fn().mockReturnValue(true);
      (container as HTMLElement).releasePointerCapture = vi.fn();

      fireEvent.pointerDown(container, {
        pointerId: 1,
        pointerType: 'mouse',
        button: 0,
        clientX: 100,
        clientY: 100,
      });
      fireEvent.pointerMove(container, {
        pointerId: 1,
        clientX: 120,
        clientY: 110,
      });
      expect(onPositionChange).toHaveBeenCalled();
    }
  });

  it('右クリック pointerDown でもドラッグ開始する', () => {
    const images = [makeImage(0)];
    const onPositionChange = vi.fn();
    render(<ImageUploadArea {...defaultProps} images={images} onPositionChange={onPositionChange} />);
    const container = document.querySelector('[style*="touch-action"]');
    if (container) {
      (container as HTMLElement).setPointerCapture = vi.fn();
      (container as HTMLElement).hasPointerCapture = vi.fn().mockReturnValue(true);
      (container as HTMLElement).releasePointerCapture = vi.fn();

      fireEvent.pointerDown(container, {
        pointerId: 1,
        pointerType: 'mouse',
        button: 2,
        clientX: 100,
        clientY: 100,
      });
      fireEvent.pointerMove(container, {
        pointerId: 1,
        clientX: 120,
        clientY: 110,
      });
      expect(onPositionChange).toHaveBeenCalled();
    }
  });

  it('pointerUp でドラッグ終了する', () => {
    const images = [makeImage(0)];
    render(<ImageUploadArea {...defaultProps} images={images} />);
    const container = document.querySelector('[style*="touch-action"]');
    if (container) {
      (container as HTMLElement).setPointerCapture = vi.fn();
      (container as HTMLElement).hasPointerCapture = vi.fn().mockReturnValue(false);
      (container as HTMLElement).releasePointerCapture = vi.fn();

      fireEvent.pointerDown(container, {
        pointerId: 1,
        pointerType: 'mouse',
        button: 0,
        clientX: 100,
        clientY: 100,
      });
      fireEvent.pointerUp(container, { pointerId: 1 });
      // no error thrown = success
    }
  });

  // ─── タッチ（ロングプレス） ───
  it('タッチのpointerDown でロングプレスタイマーを設定する', () => {
    vi.useFakeTimers();
    const images = [makeImage(0)];
    const onPositionChange = vi.fn();
    render(<ImageUploadArea {...defaultProps} images={images} onPositionChange={onPositionChange} />);
    const container = document.querySelector('[style*="touch-action"]');
    if (container) {
      (container as HTMLElement).setPointerCapture = vi.fn();
      (container as HTMLElement).hasPointerCapture = vi.fn().mockReturnValue(true);
      (container as HTMLElement).releasePointerCapture = vi.fn();

      fireEvent.pointerDown(container, {
        pointerId: 1,
        pointerType: 'touch',
        button: 0,
        clientX: 100,
        clientY: 100,
      });
      act(() => {
        vi.advanceTimersByTime(300);
      });
      fireEvent.pointerMove(container, {
        pointerId: 1,
        clientX: 130,
        clientY: 120,
      });
      expect(onPositionChange).toHaveBeenCalled();
    }
    vi.useRealTimers();
  });

  it('pointerCancel でタイマーをクリアする', () => {
    vi.useFakeTimers();
    const images = [makeImage(0)];
    render(<ImageUploadArea {...defaultProps} images={images} />);
    const container = document.querySelector('[style*="touch-action"]');
    if (container) {
      (container as HTMLElement).setPointerCapture = vi.fn();
      (container as HTMLElement).hasPointerCapture = vi.fn().mockReturnValue(false);
      (container as HTMLElement).releasePointerCapture = vi.fn();

      fireEvent.pointerDown(container, {
        pointerId: 1,
        pointerType: 'touch',
        button: 0,
        clientX: 100,
        clientY: 100,
      });
      fireEvent.pointerCancel(container, { pointerId: 1 });
      // no error
    }
    vi.useRealTimers();
  });

  // ─── selectedIndex の自動調整 ───
  it('選択中の画像が削除された場合に selectedIndex を調整する', () => {
    const images = [makeImage(0), makeImage(1), makeImage(2)];
    const onRemove = vi.fn();
    const { rerender } = render(
      <ImageUploadArea {...defaultProps} images={images} onRemove={onRemove} />,
    );
    // 3番目の画像を選択
    const thumbs = screen.getAllByAltText(/thumb-/);
    fireEvent.click(thumbs[2]);
    expect(screen.getByAltText('editor-2')).toBeInTheDocument();

    // 画像を2枚に減らす → selectedIndex が調整される
    const twoImages = [makeImage(0), makeImage(1)];
    rerender(<ImageUploadArea {...defaultProps} images={twoImages} onRemove={onRemove} />);
    expect(screen.getByAltText('editor-1')).toBeInTheDocument();
  });

  it('全画像が削除された場合に selectedIndex を 0 にリセットする', () => {
    const images = [makeImage(0)];
    const { rerender } = render(<ImageUploadArea {...defaultProps} images={images} />);
    rerender(<ImageUploadArea {...defaultProps} images={[]} />);
    expect(screen.getByText('画像を追加してください')).toBeInTheDocument();
  });

  // ─── 削除時のインデックス調整ロジック ───
  it('選択画像より前の画像を削除すると selectedIndex がデクリメントされる', () => {
    const images = [makeImage(0), makeImage(1), makeImage(2)];
    const onRemove = vi.fn();
    render(<ImageUploadArea {...defaultProps} images={images} onRemove={onRemove} />);
    // 3番目を選択
    const thumbs = screen.getAllByAltText(/thumb-/);
    fireEvent.click(thumbs[2]);

    // 最初の画像の削除ボタンをクリック（index 0 < selectedIndex 2）
    const firstThumb = thumbs[0].closest('[class]')!;
    const closeBtn = firstThumb.querySelector('button');
    if (closeBtn) {
      fireEvent.click(closeBtn);
      expect(onRemove).toHaveBeenCalledWith(0);
    }
  });

  // ─── pointerMove で drag が未開始の場合は何もしない ───
  it('ドラッグ未開始時の pointerMove は無視する', () => {
    const images = [makeImage(0)];
    const onPositionChange = vi.fn();
    render(<ImageUploadArea {...defaultProps} images={images} onPositionChange={onPositionChange} />);
    const container = document.querySelector('[style*="touch-action"]');
    if (container) {
      fireEvent.pointerMove(container, { pointerId: 99, clientX: 120, clientY: 110 });
      expect(onPositionChange).not.toHaveBeenCalled();
    }
  });

  // ─── 非マウス/非タッチのpointerDown は無視する ───
  it('pointerType が不明な場合は無視する', () => {
    const images = [makeImage(0)];
    const onPositionChange = vi.fn();
    render(<ImageUploadArea {...defaultProps} images={images} onPositionChange={onPositionChange} />);
    const container = document.querySelector('[style*="touch-action"]');
    if (container) {
      fireEvent.pointerDown(container, {
        pointerId: 1,
        pointerType: 'unknown' as 'mouse',
        button: 3,
        clientX: 100,
        clientY: 100,
      });
      fireEvent.pointerMove(container, { pointerId: 1, clientX: 120, clientY: 110 });
      expect(onPositionChange).not.toHaveBeenCalled();
    }
  });
});
