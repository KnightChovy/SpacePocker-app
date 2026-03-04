import { type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: ReactNode;
}

export interface MenuSection {
  title?: string;
  items: MenuItem[];
}

export interface SidebarFooterCard {
  title: string;
  description: string;
  buttonText?: string;
  icon?: ReactNode;
  variant?: 'help' | 'action' | 'profile';
  onClick?: () => void;
  renderCustom?: () => ReactNode;
}

interface AppSidebarProps {
  brandName: string;
  brandSubtitle?: string;
  brandIcon: ReactNode;
  brandIconBg?: string;

  menuSections: MenuSection[];

  footerCards?: SidebarFooterCard[];

  activeItemId?: string;
  onItemClick?: (itemId: string) => void;

  isOpen: boolean;
  onOpenChange: (open: boolean) => void;

  iconType?: 'lucide' | 'material';
  sidebarClassName?: string;
  linkClassName?: string;
  activeLinkClassName?: string;
}

function getDefaultLinkClasses(
  isActive: boolean,
  activeLinkClassName?: string
) {
  const baseClass =
    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium';

  if (isActive && activeLinkClassName) {
    return cn(baseClass, activeLinkClassName);
  } else if (isActive) {
    return cn(
      baseClass,
      'bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] text-primary font-semibold'
    );
  }
  return cn(baseClass, 'text-slate-600 hover:bg-white hover:text-primary');
}

interface SidebarContentProps {
  brandName: string;
  brandSubtitle?: string;
  brandIcon: ReactNode;
  brandIconBg?: string;
  menuSections: MenuSection[];
  footerCards?: SidebarFooterCard[];
  activeItemId?: string;
  onItemClick?: (itemId: string) => void;
  onLinkClick: () => void;
  iconType?: 'lucide' | 'material';
  activeLinkClassName?: string;
}

function SidebarContent({
  brandName,
  brandSubtitle,
  brandIcon,
  brandIconBg = 'bg-primary',
  menuSections,
  footerCards = [],
  activeItemId,
  onItemClick,
  onLinkClick,
  iconType = 'lucide',
  activeLinkClassName,
}: SidebarContentProps) {
  const handleClick = (itemId: string) => {
    onItemClick?.(itemId);
    onLinkClick();
  };

  return (
    <ScrollArea className="h-full flex flex-col">
      <div className="flex flex-col h-full p-4">
        <div className="flex gap-3 px-2 py-4 mb-6">
          <div
            className={cn(
              'aspect-square rounded-xl h-10 w-10 flex items-center justify-center text-white shadow-lg',
              brandIconBg,
              brandIconBg.includes('primary') && 'shadow-primary/30'
            )}
          >
            {brandIcon}
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-slate-900 dark:text-text-main-dark text-base font-bold leading-tight tracking-tight">
              {brandName}
            </h1>
            {brandSubtitle && (
              <p className="text-slate-500 dark:text-text-sub-dark text-xs font-medium">
                {brandSubtitle}
              </p>
            )}
          </div>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          {menuSections.map((section, sectionIdx) => (
            <div key={sectionIdx} className="mb-2">
              {section.title && (
                <p className="px-4 mb-3 text-[11px] font-bold text-gray-400 dark:text-text-sub-dark uppercase tracking-[2px]">
                  {section.title}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map(item => {
                  const isActive = activeItemId
                    ? activeItemId === item.id
                    : false;

                  return (
                    <NavLink
                      key={item.id}
                      to={item.path}
                      onClick={() => handleClick(item.id)}
                      className={({ isActive: navIsActive }) =>
                        getDefaultLinkClasses(
                          activeItemId ? isActive : navIsActive,
                          activeLinkClassName
                        )
                      }
                    >
                      {iconType === 'material' ? (
                        <span
                          className={cn(
                            'material-symbols-outlined text-[22px]',
                            isActive && 'fill-1'
                          )}
                        >
                          {item.icon}
                        </span>
                      ) : (
                        <span className="h-5 w-5">{item.icon}</span>
                      )}
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {footerCards.length > 0 && (
          <div className="mt-auto space-y-4">
            {footerCards.map((card, idx) => {
              if (card.renderCustom) {
                return <div key={idx}>{card.renderCustom()}</div>;
              }

              if (card.variant === 'action') {
                return (
                  <div
                    key={idx}
                    className="bg-linear-to-br from-[#0e0d1b] to-[#1c1e31] rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group cursor-pointer"
                    onClick={card.onClick}
                  >
                    <div className="absolute top-0 right-0 h-24 w-24 bg-primary blur-2xl opacity-40 group-hover:opacity-60 transition-opacity" />
                    <div className="relative z-10">
                      {card.icon && (
                        <div className="bg-white/10 w-fit p-2 rounded-lg mb-3 backdrop-blur-sm">
                          {card.icon}
                        </div>
                      )}
                      <h4 className="font-bold text-sm mb-1">{card.title}</h4>
                      <p className="text-xs text-slate-300 mb-3">
                        {card.description}
                      </p>
                      {card.buttonText && (
                        <span className="text-xs font-bold text-primary-light flex items-center gap-1 group-hover:gap-2 transition-all">
                          {card.buttonText} <span className="text-sm">→</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={idx}
                  className="bg-linear-to-br from-primary/10 to-primary/5 rounded-2xl p-4 border border-primary/10 dark:border-primary/20"
                  onClick={card.onClick}
                >
                  <div className="flex items-start gap-3">
                    {card.icon && (
                      <div className="bg-white dark:bg-surface-dark p-2 rounded-lg shadow-sm text-primary">
                        {card.icon}
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-text-main-dark">
                        {card.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-text-sub-dark mt-1">
                        {card.description}
                      </p>
                      {card.buttonText && (
                        <button className="text-xs font-bold text-primary hover:text-primary-dark transition-colors mt-2">
                          {card.buttonText}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

export default function AppSidebar({
  brandName,
  brandSubtitle,
  brandIcon,
  brandIconBg,
  menuSections,
  footerCards,
  activeItemId,
  onItemClick,
  isOpen,
  onOpenChange,
  iconType = 'lucide',
  sidebarClassName,
  activeLinkClassName,
}: AppSidebarProps) {
  const handleLinkClick = () => onOpenChange(false);

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-72 p-0 [&>button]:hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-light dark:border-border-dark">
            <h2 className="text-lg font-bold text-gray-900 dark:text-text-main-dark">
              {brandSubtitle || brandName}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-surface-dark"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <SidebarContent
            brandName={brandName}
            brandSubtitle={brandSubtitle}
            brandIcon={brandIcon}
            brandIconBg={brandIconBg}
            menuSections={menuSections}
            footerCards={footerCards}
            activeItemId={activeItemId}
            onItemClick={onItemClick}
            onLinkClick={handleLinkClick}
            iconType={iconType}
            activeLinkClassName={activeLinkClassName}
          />
        </SheetContent>
      </Sheet>

      <aside
        className={cn(
          'hidden lg:flex w-72 flex-col bg-background-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark h-full shrink-0',
          sidebarClassName
        )}
      >
        <SidebarContent
          brandName={brandName}
          brandSubtitle={brandSubtitle}
          brandIcon={brandIcon}
          brandIconBg={brandIconBg}
          menuSections={menuSections}
          footerCards={footerCards}
          activeItemId={activeItemId}
          onItemClick={onItemClick}
          onLinkClick={handleLinkClick}
          iconType={iconType}
          activeLinkClassName={activeLinkClassName}
        />
      </aside>
    </>
  );
}
