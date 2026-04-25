import { describe, it, expect } from "vitest";
import { contactSchema } from "./contactSchema";

const valid = {
  name: "Ada Lovelace",
  email: "ada@lovelace.dev",
  message: "Hello, I'd like to chat about a frontend role.",
  website: "",
};

describe("contactSchema", () => {
  it("accepts a fully-valid submission", () => {
    const result = contactSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects an empty name", () => {
    const result = contactSchema.safeParse({ ...valid, name: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["name"]);
      expect(result.error.issues[0].message).toMatch(/required/i);
    }
  });

  it("rejects whitespace-only name (trim runs before min)", () => {
    const result = contactSchema.safeParse({ ...valid, name: "   " });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = contactSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["email"]);
    }
  });

  it("rejects an empty message", () => {
    const result = contactSchema.safeParse({ ...valid, message: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["message"]);
    }
  });

  it("rejects a message over 2000 chars", () => {
    const result = contactSchema.safeParse({
      ...valid,
      message: "a".repeat(2001),
    });
    expect(result.success).toBe(false);
  });

  it("rejects a name over 100 chars", () => {
    const result = contactSchema.safeParse({
      ...valid,
      name: "a".repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it("rejects an email over 255 chars", () => {
    const longLocal = "a".repeat(250);
    const result = contactSchema.safeParse({
      ...valid,
      email: `${longLocal}@example.com`,
    });
    expect(result.success).toBe(false);
  });

  it("rejects a non-empty honeypot (bot signal)", () => {
    const result = contactSchema.safeParse({
      ...valid,
      website: "https://buy-cheap-pills.example",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["website"]);
    }
  });

  it("treats omitted honeypot as valid", () => {
    const { website: _drop, ...rest } = valid;
    void _drop;
    const result = contactSchema.safeParse(rest);
    expect(result.success).toBe(true);
  });
});
