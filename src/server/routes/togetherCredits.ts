import { Router, Request, Response } from "express";

export function initTogetherCreditsRoutes(app: Router): void {
  app.get("/togetherCredits", async (req: Request, res: Response) => {
    try {
      const response = await fetch(
        "https://api.together.ai/api/admin/payments/current-usage?userId=6816b5dbdb99a2057ad1d2d6",
        {
          headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9",
            "if-none-match": 'W/"clb7ea63zsqy"',
            priority: "u=1, i",
            "sec-ch-ua":
              '"Chromium";v="136", "Microsoft Edge";v="136", "Not.A/Brand";v="99"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            cookie: process.env.TOGETHER_COOKIE,
          },
          referrer: "https://api.together.ai/settings/billing",
          referrerPolicy: "strict-origin-when-cross-origin",
          body: null,
          method: "GET",
          mode: "cors",
          credentials: "include",
        }
      );
      const data = await response.json();
      res.status(200).json({
        finalAmountCentsAfterSettlement: data.finalAmountCentsAfterSettlement,
      });
    } catch (e) {
      console.error(e);
      res.status(500).send("Error");
    }
  });
}
