import React, { useState } from "react";
import { CreditCard, ShieldCheck, ArrowRight, CheckCircle } from "lucide-react";
import Sidebar from "../../components/common/SideBar";
import Topbar from "../../components/common/Topbar";
import { useVenderOnboarding, useVenderStripeDetail } from "../../api/useAuth";
function StripeConnect() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mutate, isPending } = useVenderOnboarding();
  const {
    data: stripeData,
    isLoading: stripeLoading,
    isError: stripeError,
  } = useVenderStripeDetail();
  const isStripeConnected =
    stripeData?.data?.details_submitted &&
    stripeData?.data?.charges_enabled &&
    stripeData?.data?.payouts_enabled;
  console.log("Stripe Account Response:", stripeData);
  // ================= CONNECT STRIPE =================
  const handleConnectStripe = () => {
    mutate(undefined, {
      onSuccess: (data) => {
        console.log("Stripe onboarding response:", data);
        const stripeUrl = data?.data?.url;
        if (stripeUrl) {
          window.location.href = stripeUrl;
        } else {
          alert("Stripe onboarding URL not found");
        }
      },
      onError: (error) => {
        console.error("Stripe onboarding error:", error);
        alert(
          error?.response?.data?.message ||
            "Unable to create Stripe onboarding link",
        );
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      {/* ================= SIDEBAR ================= */}
      <Sidebar
        role="vendor"
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* ================= MAIN AREA ================= */}
      <div className="min-h-screen lg:ml-[270px]">
        {/* ================= TOPBAR ================= */}
        <Topbar
          role="vendor"
          userName="Vikash Store"
          setMobileOpen={setMobileOpen}
        />

        {/* ================= STRIPE CONTENT ================= */}
        <main className="p-5 lg:p-8">
          <div className="mx-auto max-w-2xl">
            {/* ================= PAGE HEADING ================= */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                Stripe Connect
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Connect your Stripe account to receive your store payments.
              </p>
            </div>

            {/* ================= STRIPE CARD ================= */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              {/* ================= HEADER ================= */}
              <div className="bg-gradient-to-r from-[#4630d8] via-[#365fe0] to-[#2e8ee8] px-6 py-7 text-white lg:px-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/15">
                    <CreditCard size={30} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold lg:text-2xl">
                      {isStripeConnected
                        ? "Stripe Account Connected"
                        : "Connect Stripe Account"}
                    </h2>

                    <p className="mt-1 text-sm text-white/80">
                      {isStripeConnected
                        ? "Your payment account is ready"
                        : "Set up your payment account"}
                    </p>
                  </div>
                </div>
              </div>

              {/* ================= CARD CONTENT ================= */}
              <div className="px-6 py-7 lg:px-8 lg:py-8">
                {/* ================= LOADING ================= */}
                {stripeLoading ? (
                  <div className="py-10 text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#4630d8]" />

                    <p className="mt-4 text-sm text-gray-500">
                      Checking Stripe account status...
                    </p>
                  </div>
                ) : stripeError ? (
                  /* ================= ERROR ================= */
                  <div className="rounded-xl bg-red-50 p-5 text-center">
                    <p className="font-semibold text-red-700">
                      Unable to check Stripe account status
                    </p>

                    <p className="mt-1 text-sm text-red-500">
                      Please try again later.
                    </p>
                  </div>
                ) : isStripeConnected ? (
                  /* ================= CONNECTED ================= */
                  <div>
                    <div className="rounded-xl border border-green-200 bg-green-50 p-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100">
                          <CheckCircle size={25} className="text-green-600" />
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-green-700">
                            Stripe Account Connected
                          </h3>

                          <p className="mt-1 text-sm text-green-600">
                            Your account is ready to receive payments.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ================= STATUS ================= */}
                    <div className="mt-7 space-y-5">
                      {/* Details Submitted */}
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
                          <ShieldCheck size={20} />
                        </div>

                        <div>
                          <p className="font-medium text-gray-800">
                            Account details submitted
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            Your Stripe account details have been submitted
                            successfully.
                          </p>
                        </div>
                      </div>

                      {/* Charges Enabled */}
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
                          <ShieldCheck size={20} />
                        </div>

                        <div>
                          <p className="font-medium text-gray-800">
                            Payments enabled
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            Your account can receive customer payments.
                          </p>
                        </div>
                      </div>

                      {/* Payouts Enabled */}
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
                          <ShieldCheck size={20} />
                        </div>

                        <div>
                          <p className="font-medium text-gray-800">
                            Payouts enabled
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            Your earnings can be transferred to your connected
                            account.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ================= NOT CONNECTED ================= */
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Receive payments securely
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      Connect your Stripe account to receive payments from
                      customers and manage your payouts securely.
                    </p>

                    {/* ================= FEATURES ================= */}
                    <div className="mt-7 space-y-5">
                      {/* Secure Payments */}
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
                          <ShieldCheck size={20} />
                        </div>

                        <div>
                          <p className="font-medium text-gray-800">
                            Secure payments
                          </p>

                          <p className="mt-1 text-sm leading-5 text-gray-500">
                            Your payment information is securely handled by
                            Stripe.
                          </p>
                        </div>
                      </div>

                      {/* Fast Payouts */}
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
                          <ShieldCheck size={20} />
                        </div>

                        <div>
                          <p className="font-medium text-gray-800">
                            Fast payouts
                          </p>

                          <p className="mt-1 text-sm leading-5 text-gray-500">
                            Receive your earnings directly into your connected
                            account.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ================= BUTTON ================= */}
                    <button
                      type="button"
                      onClick={handleConnectStripe}
                      disabled={isPending}
                      className="
                        mt-8
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-gradient-to-r
                        from-[#4630d8]
                        to-[#368de8]
                        px-5
                        py-3.5
                        font-semibold
                        text-white
                        shadow-md
                        transition-all
                        duration-200
                        hover:shadow-lg
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >
                      {isPending ? "Connecting..." : "Connect Stripe Account"}

                      {!isPending && <ArrowRight size={19} />}
                    </button>

                    {/* Footer */}
                    <p className="mt-5 text-center text-xs text-gray-400">
                      You will be redirected to Stripe to complete the setup.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default StripeConnect;
