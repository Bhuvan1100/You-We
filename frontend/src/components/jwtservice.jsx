
export async function getTokenAndSave(email) {
  if (!email) return null;

  try {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/jwt/createtoken`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (data.token) {
      localStorage.setItem("jwtToken", data.token);
      return data.token;
    }
    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
}
