import { type ReactNode } from 'react';
import { Menu, Search, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface HeaderAction {
  id: string;
  icon: ReactNode | string;
  label?: string;
  onClick?: () => void;
  badge?: boolean;
  badgeCount?: number;
  variant?: 'default' | 'primary' | 'ghost';
  hideOnMobile?: boolean;
}

export interface HeaderProfile {
  name: string;
  subtitle?: string;
  avatarUrl: string;
  showDropdown?: boolean;
  onClick?: () => void;
}

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  hideTitle?: boolean;

  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchClassName?: string;

  actions?: HeaderAction[];

  profile?: HeaderProfile;

  onMenuClick: () => void;

  leftExtra?: ReactNode;
  rightExtra?: ReactNode;

  headerClassName?: string;
  iconType?: 'lucide' | 'material';
}

export default function AppHeader({
  title,
  subtitle,
  hideTitle = false,
  showSearch = true,
  searchPlaceholder = 'Search...',
  searchValue = '',
  onSearchChange,
  searchClassName,
  actions = [],
  profile,
  onMenuClick,
  leftExtra,
  rightExtra,
  headerClassName,
  iconType = 'lucide',
}: AppHeaderProps) {
  const renderIcon = (iconName: string | ReactNode) => {
    if (typeof iconName === 'string' && iconType === 'material') {
      return (
        <span className="material-symbols-outlined text-[18px]">
          {iconName}
        </span>
      );
    }
    return iconName;
  };

  const renderAction = (action: HeaderAction) => {
    const buttonClasses = cn(
      'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all shadow-sm relative',
      action.hideOnMobile && 'hidden sm:flex',
      action.variant === 'primary' &&
        'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 active:scale-95',
      action.variant === 'ghost' &&
        'bg-transparent hover:bg-gray-100 dark:hover:bg-surface-dark text-slate-600 dark:text-text-sub-dark',
      !action.variant &&
        'bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-slate-600 dark:text-text-sub-dark hover:bg-gray-50 dark:hover:bg-surface-dark/80'
    );

    const iconOnlyClasses = cn(
      'h-10 w-10 flex items-center justify-center rounded-xl transition-all relative',
      action.variant === 'primary'
        ? 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/25'
        : 'bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-slate-600 dark:text-text-sub-dark hover:text-primary hover:border-primary/30'
    );

    return (
      <button
        key={action.id}
        onClick={action.onClick}
        className={action.label ? buttonClasses : iconOnlyClasses}
      >
        {renderIcon(action.icon)}
        {action.label && <span>{action.label}</span>}
        {action.badge && (
          <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-surface-dark" />
        )}
        {action.badgeCount && action.badgeCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {action.badgeCount > 9 ? '9+' : action.badgeCount}
          </span>
        )}
      </button>
    );
  };

  return (
    <header
      className={cn(
        'flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border-light dark:border-border-dark bg-background-light/80 dark:bg-surface-dark/80 backdrop-blur-md sticky top-0 z-20',
        headerClassName
      )}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <button
          className="lg:hidden text-slate-500 dark:text-text-sub-dark p-2 hover:bg-gray-100 dark:hover:bg-surface-dark rounded-lg"
          onClick={onMenuClick}
        >
          {iconType === 'material' ? (
            <span className="material-symbols-outlined">menu</span>
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {!hideTitle && title && (
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-text-main-dark tracking-tight truncate">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-slate-500 dark:text-text-sub-dark mt-0.5 hidden sm:block truncate">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {leftExtra}

        {showSearch && (
          <div
            className={cn(
              'hidden md:flex items-center flex-1 max-w-md lg:max-w-lg bg-white dark:bg-background-dark border border-gray-200 dark:border-border-dark rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-sm',
              searchClassName
            )}
          >
            {iconType === 'material' ? (
              <span className="material-symbols-outlined text-gray-400 dark:text-text-sub-dark mr-2 text-lg">
                search
              </span>
            ) : (
              <Search className="h-5 w-5 text-slate-400 dark:text-text-sub-dark" />
            )}
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={e => onSearchChange?.(e.target.value)}
              className="bg-transparent border-none text-sm focus:ring-0 placeholder:text-gray-400 dark:placeholder:text-text-sub-dark text-gray-700 dark:text-text-main-dark h-auto p-0 ml-2"
            />
            <span className="text-[10px] font-bold text-gray-400 dark:text-text-sub-dark border border-gray-200 dark:border-border-dark rounded-md px-1.5 py-0.5 ml-2 hidden lg:block">
              ⌘K
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {actions.map(action => renderAction(action))}

        {rightExtra}

        {profile && (
          <div className="h-8 w-px bg-slate-200 dark:bg-border-dark mx-2 hidden sm:block" />
        )}

        {profile && (
          <button
            onClick={profile.onClick}
            className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-full hover:bg-white dark:hover:bg-surface-dark transition-colors border border-transparent hover:border-border-light dark:hover:border-border-dark"
          >
            <div
              className="h-9 w-9 rounded-full bg-cover bg-center border border-slate-200 dark:border-border-dark shrink-0"
              style={{ backgroundImage: `url('${profile.avatarUrl}')` }}
            />
            <div className="hidden lg:flex flex-col items-start">
              <span className="text-sm font-semibold text-slate-900 dark:text-text-main-dark leading-none">
                {profile.name}
              </span>
              {profile.subtitle && (
                <span className="text-[10px] font-medium text-slate-500 dark:text-text-sub-dark uppercase tracking-wider mt-1">
                  {profile.subtitle}
                </span>
              )}
            </div>
            {profile.showDropdown && (
              <ChevronDown className="hidden lg:block h-4 w-4 text-slate-400 dark:text-text-sub-dark" />
            )}
          </button>
        )}
      </div>
    </header>
  );
}
