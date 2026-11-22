const sendUpstreamError = (res, error, fallbackMessage) => {
  const status = error.response?.status;
  const data = error.response?.data;
  const upstreamMessage =
    (typeof data?.detail === "string" && data.detail) ||
    (typeof data?.message === "string" && data.message) || "";

  console.error(fallbackMessage, "|", status || error.code || "", "|", upstreamMessage || error.message);

  if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT")
    return res.status(504).json({ message: "The AI service took too long to answer. Please try again." });

  if (["ECONNREFUSED", "ENOTFOUND", "EAI_AGAIN"].includes(error.code))
    return res.status(502).json({ message: "The AI service is not reachable right now." });

  if ([400, 404, 413, 502, 503, 504].includes(status))
    return res.status(status).json({ message: upstreamMessage || fallbackMessage });

  return res.status(500).json({ message: fallbackMessage });
};

module.exports = { sendUpstreamError };