const Redis = require("ioredis")

const redis = new Redis(process.env.REDIS_URL, {
  password: process.env.REDIS_PASSWORD,
  tls: process.env.REDIS_URL && process.env.REDIS_URL.startsWith("rediss://") ? {} : undefined
})

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()
  try {
    const { playerId = "default", payload } = req.body || {}
    if (!payload) return res.status(400).json({ error: "missing_payload" })
    await redis.set(`mnemo:${playerId}`, JSON.stringify(payload))
    res.status(200).json({ ok: true })
  } catch (e) {
    console.error("Redis save error", e)
    res.status(500).json({ error: "save_failed" })
  }
}
