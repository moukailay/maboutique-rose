import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { User, UserCheck, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useTranslation } from '@/hooks/useTranslation';

export default function AuthDropdown() {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useTranslation();

  if (isAuthenticated && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <UserCheck className="h-5 w-5" />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full"></div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5 text-sm text-gray-700">
            <div className="font-medium">{t('nav.profile')}</div>
            <div className="text-gray-500">{user.firstName} {user.lastName}</div>
          </div>
          <DropdownMenuSeparator />
          {user.role === 'admin' ? (
            <DropdownMenuItem asChild>
              <Link href="/admin">
                <Settings className="mr-2 h-4 w-4" />
                {t('nav.admin')}
              </Link>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                {t('nav.profile')}
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            {t('nav.logout')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link href="/login" className="text-gray-700 hover:text-green-500">
            <User className="mr-2 h-4 w-4" />
            {t('nav.login')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/admin/login" className="text-gray-700 hover:text-rose-primary">
            <Settings className="mr-2 h-4 w-4" />
            {t('nav.admin')}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}