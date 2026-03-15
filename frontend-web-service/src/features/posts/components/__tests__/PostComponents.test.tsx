import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FieldLabel from '../FieldLabel';
import DarkInput from '../DarkInput';
import CategorySelect from '../CategorySelect';
import DiscardDialog from '../DiscardDialog';
import PostListPagination from '../PostListPagination';

// ─── FieldLabel ───
describe('FieldLabel', () => {
  it('番号とラベルを表示する', () => {
    render(<FieldLabel num={1} label="タイトル" />);
    expect(screen.getByText('1. タイトル')).toBeInTheDocument();
  });

  it('異なる番号とラベルを表示する', () => {
    render(<FieldLabel num={3} label="詳細説明" />);
    expect(screen.getByText('3. 詳細説明')).toBeInTheDocument();
  });
});

// ─── DarkInput ───
describe('DarkInput', () => {
  it('テキスト入力を表示する', () => {
    render(<DarkInput value="テスト" onChange={vi.fn()} placeholder="入力" />);
    const input = screen.getByPlaceholderText('入力');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('テスト');
  });

  it('入力変更時に onChange を呼ぶ', () => {
    const onChange = vi.fn();
    render(<DarkInput value="" onChange={onChange} placeholder="入力" />);
    fireEvent.change(screen.getByPlaceholderText('入力'), { target: { value: 'abc' } });
    expect(onChange).toHaveBeenCalledWith('abc');
  });

  it('multiline で textarea を描画する', () => {
    render(<DarkInput value="テスト" onChange={vi.fn()} placeholder="入力" multiline rows={3} />);
    const textarea = screen.getByPlaceholderText('入力');
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('maxLength を設定する', () => {
    render(<DarkInput value="abc" onChange={vi.fn()} placeholder="入力" maxLength={100} multiline />);
    const textarea = screen.getByPlaceholderText('入力');
    expect(textarea).toHaveAttribute('maxlength', '100');
  });
});

// ─── CategorySelect ───
describe('CategorySelect', () => {
  it('カテゴリーを選択のプレースホルダを表示する', () => {
    render(<CategorySelect value="" onChange={vi.fn()} />);
    expect(screen.getByText('カテゴリーを選択')).toBeInTheDocument();
  });

  it('選択されたカテゴリーを表示する', () => {
    render(<CategorySelect value="食事" onChange={vi.fn()} />);
    expect(screen.getByText('食事')).toBeInTheDocument();
  });
});

// ─── DiscardDialog ───
describe('DiscardDialog', () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    onDiscard: vi.fn(),
    onSaveAndExit: vi.fn(),
  };

  it('open=true で表示される', () => {
    render(<DiscardDialog {...defaultProps} />);
    expect(screen.getByText(/下書き保存をしますか/)).toBeInTheDocument();
  });

  it('open=false で非表示', () => {
    const { container } = render(<DiscardDialog {...defaultProps} open={false} />);
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });
});

// ─── PostListPagination ───
describe('PostListPagination', () => {
  it('ページ番号を表示する', () => {
    render(<PostListPagination page={2} totalPages={5} currentPage={2} onPrev={vi.fn()} onNext={vi.fn()} />);
    expect(screen.getByText('2 / 5')).toBeInTheDocument();
  });

  it('最初のページで「前へ」が無効', () => {
    render(<PostListPagination page={1} totalPages={5} currentPage={1} onPrev={vi.fn()} onNext={vi.fn()} />);
    expect(screen.getByText('前へ').closest('button')).toBeDisabled();
  });

  it('最後のページで「次へ」が無効', () => {
    render(<PostListPagination page={5} totalPages={5} currentPage={5} onPrev={vi.fn()} onNext={vi.fn()} />);
    expect(screen.getByText('次へ').closest('button')).toBeDisabled();
  });

  it('中間ページで両方のボタンが有効', () => {
    render(<PostListPagination page={3} totalPages={5} currentPage={3} onPrev={vi.fn()} onNext={vi.fn()} />);
    expect(screen.getByText('前へ').closest('button')).not.toBeDisabled();
    expect(screen.getByText('次へ').closest('button')).not.toBeDisabled();
  });

  it('「前へ」ボタンで onPrev を呼ぶ', () => {
    const onPrev = vi.fn();
    render(<PostListPagination page={2} totalPages={5} currentPage={2} onPrev={onPrev} onNext={vi.fn()} />);
    fireEvent.click(screen.getByText('前へ'));
    expect(onPrev).toHaveBeenCalledTimes(1);
  });

  it('「次へ」ボタンで onNext を呼ぶ', () => {
    const onNext = vi.fn();
    render(<PostListPagination page={2} totalPages={5} currentPage={2} onPrev={vi.fn()} onNext={onNext} />);
    fireEvent.click(screen.getByText('次へ'));
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
