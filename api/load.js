const Redis = require("ioredis")

const redis = new Redis(process.env.REDIS_URL, {
  password: process.env.REDIS_PASSWORD,
  tls: process.env.REDIS_URL && process.env.REDIS_URL.startsWith("rediss://") ? {} : undefined
})

module.exports = async function handler(req, res) {
  const playerId = (req.query.playerId || "default").toString()
  try {
    const data = await redis.get(`mnemo:${playerId}`)
    res.status(200).json(data ? JSON.parse(data) : null)
  } catch (e) {
    console.error("Redis load error", e)
    res.status(500).json({ error: "load_failed" })
  }
}
