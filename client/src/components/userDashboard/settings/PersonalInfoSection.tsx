import { USER_INFO } from '@/data/constant';
import InputField from './InputField';
import { Pencil } from 'lucide-react';

const PersonalInfoSection = () => {
  return (
    <section className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border-light dark:border-border-dark">
        <h2 className="text-lg font-bold">Personal Information</h2>
        <p className="text-sm text-text-sub-light dark:text-text-sub-dark mt-1">
          Update your photo and personal details.
        </p>
      </div>
      <div className="p-6 md:p-8 flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <div
              className="h-24 w-24 rounded-full bg-cover bg-center border-2 border-primary/20"
              style={{ backgroundImage: `url('${USER_INFO.profileImage}')` }}
            ></div>
            <button className="absolute bottom-0 right-0 bg-primary hover:bg-primary-dark text-white p-1.5 rounded-full border-2 border-surface-light dark:border-surface-dark transition-colors shadow-sm">
              <Pencil className="h-4 w-4 block" />
            </button>
          </div>
          <div className="flex flex-col gap-3 text-center sm:text-left">
            <div>
              <h3 className="text-sm font-bold">Profile Photo</h3>
              <p className="text-xs text-text-sub-light dark:text-text-sub-dark mt-1">
                Accepts JPG, GIF or PNG. Max size of 800K
              </p>
            </div>
            <div className="flex gap-3 justify-center sm:justify-start">
              <button className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold rounded-lg transition-colors">
                Change
              </button>
              <button className="px-3 py-1.5 bg-background-light dark:bg-background-dark text-text-sub-light hover:text-red-500 text-xs font-bold rounded-lg transition-colors border border-transparent hover:border-red-200">
                Remove
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Full Name"
            icon="person"
            defaultValue={USER_INFO.name}
          />
          <InputField
            label="Role / Title"
            icon="work"
            defaultValue={USER_INFO.role}
          />
          <InputField
            label="Email Address"
            icon="mail"
            defaultValue={USER_INFO.email}
            type="email"
          />
          <InputField
            label="Phone Number"
            icon="call"
            defaultValue={USER_INFO.phone}
            type="tel"
          />
        </div>
      </div>
    </section>
  );
};

export default PersonalInfoSection;
