// =============================================
//  原則：UIとロジックを分離する
// コンポーネントは「見た目」だけに集中できる
// ロジックのテストもhook単体で書ける
// =============================================
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../authApi';
import type { LoginRequest, Realm } from '../../../types/auth';

export const useLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const login = async (data: LoginRequest) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await authApi.login(data);
            // ログイン成功 → トークンを保存してホームへ遷移
            localStorage.setItem('access_token', response.access_token);
            localStorage.setItem('refresh_token', response.refresh_token);
            navigate('/home');
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