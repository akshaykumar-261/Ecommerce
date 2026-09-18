import { useForm } from "react-hook-form";
import { useState } from "react";
import { Percent, UserCog, Save, Camera } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import Button from "../../components/admin/Button";
import {
  useAdminCommission,
  useUpdateCommission,
  useAdminProfile,
  useUpdateAdminProfile,
} from "../../api/useAdminApi";
import toast from "react-hot-toast";

const fieldCls =
  "w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10";
const labelCls =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500";

/*
 * Admin console settings: platform commission (PUT /admin/change-commision)
 * and the admin profile (PUT /admin/update-profile). Each form is a separate
 * component with its own useForm so server data hydrates via defaultValues —
 * no setState-in-effect — and remounts when the query resolves (keyed).
 */
function AdminSettings() {
  const commission = useAdminCommission();
  const updateCommission = useUpdateCommission();
  const profile = useAdminProfile();
  const updateProfile = useUpdateAdminProfile();

  const saveCommission = (data) => {
    updateCommission.mutate(
      { commission_percentage: Number(data.commission_percentage) },
      {
        onSuccess: (res) => toast.success(res.message || "Commission updated"),
        onError: (error) =>
          toast.error(error.response?.data?.error || "Update failed"),
      },
    );
  };

  const saveProfile = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("lastname", data.lastname);
    formData.append("phoneNo", data.phoneNo);
    formData.append("address", data.address);
    formData.append("email", data.email);
    if (data.avtar && data.avtar[0]) {
      formData.append("avtar", data.avtar[0]);
    }
    updateProfile.mutate(formData, {
      onSuccess: (res) => toast.success(res.message || "Profile updated"),
      onError: (error) =>
        toast.error(error.response?.data?.error || "Update failed"),
    });
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Platform configuration and admin profile
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Commission */}
        <section className="animate-fade-up rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
              <Percent size={20} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Platform Commission
              </h2>
              <p className="text-xs text-slate-400">
                Percentage taken from each vendor sale
              </p>
            </div>
          </div>

          <CommissionForm
            key={`commission-${commission.data?.data?.id ?? "loading"}`}
            defaultValue={
              commission.data?.data?.commission_percentage !== undefined
                ? String(Number(commission.data.data.commission_percentage))
                : ""
            }
            saving={updateCommission.isPending}
            onSubmit={saveCommission}
          />
        </section>

        {/* Admin profile */}
        <section
          className="animate-fade-up rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
          style={{ animationDelay: "80ms" }}
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50">
              <UserCog size={20} className="text-violet-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Admin Profile</h2>
              <p className="text-xs text-slate-400">Your administrator details</p>
            </div>
          </div>

          <ProfileForm
            key={`profile-${profile.data?.data?.id ?? "loading"}`}
            defaults={profile.data?.data || {}}
            saving={updateProfile.isPending}
            onSubmit={saveProfile}
          />
        </section>
      </div>
    </AdminLayout>
  );
}

function CommissionForm({ defaultValue, saving, onSubmit }) {
  const { register, handleSubmit } = useForm({
    defaultValues: { commission_percentage: defaultValue },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className={labelCls}>Commission Percentage</label>
        <div className="relative">
          <input
            type="number"
            min="0"
            max="100"
            step="0.5"
            {...register("commission_percentage", { required: true })}
            className={`${fieldCls} pr-9`}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
            %
          </span>
        </div>
        <p className="mt-1.5 text-[11px] text-slate-400">
          Allowed range: 0 – 100. Applies to future payouts.
        </p>
      </div>

      <div className="flex justify-end">
        <Button type="submit" loading={saving}>
          <Save size={15} />
          Save Commission
        </Button>
      </div>
    </form>
  );
}

function ProfileForm({ defaults, saving, onSubmit }) {
  const [preview, setPreview] = useState(defaults.avtar || "");
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: defaults.name || "",
      lastname: defaults.lastname || "",
      phoneNo: defaults.phoneNo || "",
      address: defaults.address || "",
      email: defaults.email || "",
    },
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100">
          {preview ? (
            <img src={preview} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-400">
              <Camera size={28} />
            </div>
          )}
        </div>
        <div className="flex-1">
          <label className={labelCls}>Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            {...register("avtar")}
            onChange={(e) => {
              register("avtar").onChange(e);
              handleAvatarChange(e);
            }}
            className={`${fieldCls} cursor-pointer file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-indigo-600 hover:file:bg-indigo-100`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>First Name</label>
          <input type="text" {...register("name")} className={fieldCls} />
        </div>
        <div>
          <label className={labelCls}>Last Name</label>
          <input type="text" {...register("lastname")} className={fieldCls} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Email</label>
        <input type="email" {...register("email")} className={fieldCls} />
      </div>

      <div>
        <label className={labelCls}>Phone</label>
        <input type="text" {...register("phoneNo")} className={fieldCls} />
      </div>

      <div>
        <label className={labelCls}>Address</label>
        <textarea rows={2} {...register("address")} className={`${fieldCls} resize-none`} />
      </div>

      <div className="flex justify-end">
        <Button type="submit" loading={saving}>
          <Save size={15} />
          Save Profile
        </Button>
      </div>
    </form>
  );
}

export default AdminSettings;
