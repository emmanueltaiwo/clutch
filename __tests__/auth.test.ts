import { validateLoginInput, validateSignupInput } from "@/services/auth";

describe("Validating Input Field", () => {
  const validLoginFormData = {
    email: "hello@test.com",
    password: "12345678",
  };

  const invalidLoginFormData = {
    email: "hello.com",
    password: "1234567",
  };

  const validSignupFormData = {
    email: "hello@test.com",
    fullName: "Clutch User",
    phoneNumber: "123456789",
    dateOfBirth: "2023-12-18",
    gender: "Male",
    country: "Nigeria",
    interest: "Tech",
    termsAndConditions: "on",
    password: "12345678",
    hasFullAccess: true,
    status: true,
  };

  const invalidSignupFormData = {
    email: "hello.com",
    fullName: "Clutch User",
    phoneNumber: "123456789",
    dateOfBirth: "2023-12-18",
    gender: "Male",
    country: "Nigeria",
    interest: "Tech",
    termsAndConditions: "off",
    password: "1234567",
    hasFullAccess: true,
    status: true,
  };

  it("should return true if login input field is valid", () => {
    expect(validateLoginInput(validLoginFormData)).toBeTruthy();
  });

  it("should return false if login input field is invalid", () => {
    expect(validateLoginInput(invalidLoginFormData)).toBeFalsy();
  });

  it("should return true if signup input field is valid", () => {
    expect(validateSignupInput(validSignupFormData)).toBeTruthy();
  });

  it("should return false if signup input field is invalid", () => {
    expect(validateSignupInput(invalidSignupFormData)).toBeFalsy();
  });
});

/*
  Write more test cases on the authentication feature
*/
