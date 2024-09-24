import type { NextApiRequest } from "next";
import axios from "axios";
import https from "https";

const API_KEY = process.env.SIMALAND_API_KEY;

const SimalandAPI = axios.create({
  baseURL: "https://sima-land.ru/api/v3",
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

SimalandAPI.interceptors.request.use((config) => {
  config.headers["x-api-key"] = API_KEY;
  return config;
});

export default async function handler(req: NextApiRequest, res: any) {
  const { itemId } = req.query;

  if (!itemId || typeof itemId !== "string") {
    return res.status(400).json({ error: "Page ID is required" });
  }

  try {
    const response = await SimalandAPI.get(`/item/?page=${itemId}`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching Simaland item:", error);
    res.status(500).json({ error: "Failed to fetch Simaland item" });
  }
}
