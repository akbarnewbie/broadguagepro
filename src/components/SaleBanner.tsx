// Site-wide promo banner.
// To turn the sale on/off or change the text, edit the values below.
// (Kept config-driven so it's instant to change and doesn't depend on
// reading Wix discount rules, which the free test project can't expose.)
const SALE_ENABLED = true;
const SALE_TEXT = "🎉 Summer Sale — 50% OFF all products! Discount applied automatically at checkout.";

const SaleBanner = () => {
  if (!SALE_ENABLED) return null;

  return (
    <div className="w-full bg-gradient-accent text-primary-foreground text-center text-xs sm:text-sm py-2 px-4 font-medium">
      {SALE_TEXT}
    </div>
  );
};

export default SaleBanner;
