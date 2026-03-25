import SecurityInputField from './SecurityInputField';

const AccountSecuritySection = () => {
  return (
    <section className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark shadow-sm">
      <div className="p-6 border-b border-border-light dark:border-border-dark">
        <h2 className="text-lg font-bold">Account Security</h2>
        <p className="text-sm text-text-sub-light dark:text-text-sub-dark mt-1">
          Manage your password and authentication methods.
        </p>
      </div>
      <div className="p-6 md:p-8 flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SecurityInputField label="Current Password" />
          <SecurityInputField label="New Password" />
          <SecurityInputField label="Confirm Password" />
        </div>
      </div>
    </section>
  );
};

export default AccountSecuritySection;
