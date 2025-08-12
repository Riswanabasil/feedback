import jwt from "jsonwebtoken";

export function signAccessToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
}
export function signAdminToken() {
  return jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "2h" });
}
export function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
