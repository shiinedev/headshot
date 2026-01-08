"use client";

import { CreditsHeader } from "@/components/payment/credit-header";
import { CreditPackageCard } from "@/components/payment/credit-package-card";
import { LocalPaymentForm } from "@/components/payment/local-payment-form";
import { PaymentMethodSelector } from "@/components/payment/payment-method-selector";
import { StripeCheckoutSection } from "@/components/payment/stripe-checkout-secsion";
import { useUser } from "@/lib/context/user-context";
import {
  useProcessPayment,
  userGetCreditPackages,
} from "@/lib/hooks/usePayment";
import { CreditPackage, PaymentPlatform } from "@/lib/types";
import { useState } from "react";
import { toast } from "sonner";

const UserCredits = () => {
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    null
  );
  const [selectedPlatform, setSelectedPlatform] =
    useState<PaymentPlatform>("STRIPE");
  const [showLocalForm, setShowLocalForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const { user } = useUser();

  const { data: creditPackages = [], isLoading: isLoadingCreditPackages } =
    userGetCreditPackages();

    console.log("creditPackages",creditPackages);

  const { mutate: processPayment, isPending: isVerifying } =
    useProcessPayment();

     const handleSelectPackage = (packageId: string) => {
    setSelectedPackageId(packageId);
    setShowLocalForm(false);
  };

   const handleSelectPlatform = (platform: PaymentPlatform) => {
    setSelectedPlatform(platform);
    // Show local form for all mobile wallet and local payments
    const isLocalPayment = ["EVC", "ZAAD", "SAHAL", "EBIR", "LOCAL"].includes(
      platform
    );
    setShowLocalForm(isLocalPayment);
  };

  const handleProcessStripePayment = () => {
    if (!selectedPackageId) {
      toast.error("Please select a package");
      return;
    }

    const frontendUrl = window.location.origin;

    processPayment({
      packageId: selectedPackageId,
      platform: "STRIPE",
      successUrl: `${frontendUrl}/verify-payment`,
      cancelUrl: `${frontendUrl}/dashboard/user/credits?status=cancel`,
    });
  };


    const handleProcessLocalPayment = (phone: string, platform?: string) => {
    if (!selectedPackageId) {
      toast.error("Please select a package");
      return;
    }

    const paymentPlatform = (platform || selectedPlatform) as PaymentPlatform;

    processPayment({
      packageId: selectedPackageId,
      platform: paymentPlatform,
      phone: phone,
    });
  };

  const selectedPackage = creditPackages?.find(
    (pkg:CreditPackage) => pkg._id === selectedPackageId
  );

  
  return (
    <div className="space-y-8">
      {/* Credits Header */}
      <CreditsHeader
        credits={user?.credits || 0}
        showHistory={showHistory}
        onToggleHistory={() => setShowHistory(!showHistory)}
      />

      {/* Credits Packages */}

      {showHistory ? (
        //  Payment history component
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
                Payment History
            </h2>
            <p>Your payment transactions will appear here.</p>
            <span>Will implement soon.</span>
        </div>
        // <PaymentHistory orders={paymentHistory || []} isLoading={isLoadingPaymentHistory} />
      ) : (
        <>
          {/* Credit Packages */}
          <div>
            <h2 className="mb-4 text-xl font-semibold text-foreground">
              Select a Package
            </h2>
            {isLoadingCreditPackages ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-80 animate-pulse rounded-lg bg-muted"
                  />
                ))}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {creditPackages?.map((pkg) => (
                  <CreditPackageCard
                    key={pkg._id}
                    package={pkg}
                    onSelect={handleSelectPackage}
                    isSelected={selectedPackageId === pkg._id}
                    isLoading={isLoadingCreditPackages}
                  />
                ))}
              </div>
            )}
          </div>

            {selectedPackage && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Select Payment Method
          </h2>

          <div className="space-y-4">
            {/* Payment Selector */}
            <PaymentMethodSelector
              selectedPlatform={selectedPlatform}
              onSelect={handleSelectPlatform}
            />

            <div className="border-t pt-4">
              {selectedPlatform === "STRIPE" && selectedPackage && (
                <StripeCheckoutSection
                  package={selectedPackage}
                  onCheckout={handleProcessStripePayment}
                  isLoading={isVerifying}
                />
              )}

              {showLocalForm && (
                <LocalPaymentForm
                  packageId={selectedPackageId || ""}
                  onSubmit={handleProcessLocalPayment}
                  isLoading={isVerifying}
                />
              )}
            </div>
          </div>
        </div>
      )}
        </>
      )}

      {/* Payment method selection */}

    
    </div>
  );
};

export default UserCredits;
