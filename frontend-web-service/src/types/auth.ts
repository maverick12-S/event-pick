// =============================================
//  原則：型はアプリ全体で共有する「契約書」
// APIとUIの間で「形が違う」というバグを防ぐ
// TypeScriptの最大の恩恵を受ける場所
// =============================================

export interface LoginRequest {
    realm:string;
    username:string;
    password:string;
}

export interface LoginResponse {
    access_token:string;
    expires_in:number;
    refresh_expires_in:number;
    refresh_token:string;
    token_type:string;
    session_state:string;
    scope:string;
}

export interface AuthUser {
  id: string;
  username: string;
  realm: string;
  displayName?: string; 
}

