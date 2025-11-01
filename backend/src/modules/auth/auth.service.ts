import { Injectable, UnauthorizedException } from '@nestjs/common';
import { supabase } from '../../config/supabase.config';

@Injectable()
export class AuthService {
  async signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    return data;
  }

  async signOut(accessToken: string) {
    const { error } = await supabase.auth.admin.signOut(accessToken);

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    return { message: 'Signed out successfully' };
  }

  async verifyToken(token: string) {
    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
      throw new UnauthorizedException('Invalid token');
    }

    return data.user;
  }

  async refreshToken(refreshToken: string) {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    return data;
  }
}

