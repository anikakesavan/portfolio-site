const test = require("node:test");
const assert = require("node:assert/strict");
const { isValidEmail, validateContactForm } = require("../validation.js");

test("isValidEmail accepts normal addresses", () => {
  assert.equal(isValidEmail("anika@example.com"), true);
  assert.equal(isValidEmail("  anika@example.com  "), true);
});

test("isValidEmail rejects malformed addresses", () => {
  assert.equal(isValidEmail("not-an-email"), false);
  assert.equal(isValidEmail("missing@domain"), false);
  assert.equal(isValidEmail(""), false);
  assert.equal(isValidEmail(null), false);
});

test("validateContactForm flags all empty fields", () => {
  const result = validateContactForm({ name: "", email: "", message: "" });
  assert.equal(result.valid, false);
  assert.equal(result.errors.name, "Please enter your name.");
  assert.equal(result.errors.email, "Please enter your email.");
  assert.equal(result.errors.message, "Please enter a message.");
});

test("validateContactForm flags invalid email specifically", () => {
  const result = validateContactForm({ name: "Anika", email: "bad", message: "Hello there friend" });
  assert.equal(result.valid, false);
  assert.equal(result.errors.email, "Please enter a valid email address.");
  assert.equal(result.errors.name, undefined);
});

test("validateContactForm flags short messages", () => {
  const result = validateContactForm({ name: "Anika", email: "a@b.com", message: "hi" });
  assert.equal(result.valid, false);
  assert.equal(result.errors.message, "Message should be at least 10 characters.");
});

test("validateContactForm passes with good input", () => {
  const result = validateContactForm({
    name: "Anika",
    email: "anika@example.com",
    message: "Hello, I would love to connect!",
  });
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, {});
});
