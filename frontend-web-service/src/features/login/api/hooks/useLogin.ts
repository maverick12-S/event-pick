// =============================================
//  原則：UIとロジックを分離する
// コンポーネントは「見た目」だけに集中できる
// ロジックのテストもhook単体で書ける
// =============================================
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../authApi';
import { tokenService } from '../../../../api/tokenService';
import type { LoginRequest } from '../../../../types/auth';

// Vite 環境変数でモック認証を有効にできます
const USE_MOCK_AUTH = import.meta.env.VITE_MOCK_AUTH === 'true';

export const useLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const login = async (data: LoginRequest) => {
        setIsLoading(true);
        setError(null);

        // モックモード: 実際の API 呼び出しを行わず、成功扱いにしてプラン画面へ遷移
        if (USE_MOCK_AUTH) {
            // 少し遅延を入れて実際のリクエストっぽく見せる
            await new Promise((res) => setTimeout(res, 300));
            tokenService.setAccessToken('mock-access-token');
            tokenService.setRefreshToken('mock-refresh-token');
            navigate('/plan');
            setIsLoading(false);
            return;
        }

        try {
            const response = await authApi.login(data);
            // ログイン成功 → トークンを tokenService 経由で保存してホームへ遷移
            tokenService.setAccessToken(response.access_token ?? null);
            tokenService.setRefreshToken(response.refresh_token ?? null);
            // ログイン成功後はプラン画面へ遷移する
            navigate('/plan');
        }catch(err: unknown){
            //エラー表示
            if((err as {response?:{status?:number}}).response?.status === 401){
                setError('ユーザー名またはパスワードが間違っています');
            }else{
                setError('ログインに失敗しました。時間をおいて再度お試しください。');
            }
        }finally{
            setIsLoading(false);
        }
    };
    return {isLoading, error, login};
}