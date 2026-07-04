export type SupportedCountryCode = "+974" | "+91";

export function isValidPhoneNumber(
  countryCode: SupportedCountryCode,
  phone: string,
) {
  const digits = phone.replace(/\D/g, "");

  if (countryCode === "+974") {
    return digits.length === 8;
  }

  return /^[6-9]\d{9}$/.test(digits);
}
