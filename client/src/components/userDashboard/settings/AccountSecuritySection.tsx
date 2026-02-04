import Toggle from './Toggle'
import { Shield } from 'lucide-react'
import SecurityInputField from './SecurityInputField'

const AccountSecuritySection = () => {
    return (
        <section className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark shadow-sm">
            <div className="p-6 border-b border-border-light dark:border-border-dark">
                <h2 className="text-lg font-bold">Account Security</h2>
                <p className="text-sm text-text-sub-light dark:text-text-sub-dark mt-1">Manage your password and authentication methods.</p>
            </div>
            <div className="p-6 md:p-8 flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SecurityInputField label="Current Password" />
                    <SecurityInputField label="New Password" />
                    <SecurityInputField label="Confirm Password" />
                </div>
                <hr className="border-border-light dark:border-border-dark" />
                <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-600 dark:text-purple-400 h-fit">
                            <Shield className='w-5 h-5 fill-purple-600 dark:fill-purple-400' />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold">Two-Factor Authentication</h3>
                            <p className="text-xs text-text-sub-light dark:text-text-sub-dark mt-1 max-w-sm">Add an extra layer of security to your account. You will need a code to log in.</p>
                        </div>
                    </div>
                    <Toggle />
                </div>
            </div>
        </section>
    )
}

export default AccountSecuritySection