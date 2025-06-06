"use server";

import { revalidateTag } from "next/cache";
import { cookies, headers } from "next/headers";
import { RegenerateInviteCodeError } from "../../../../types";

export const regenerateInviteCode = async (leaderboardName: string) => {
  const token = cookies().get("secure-access-token")?.value;

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL +
      `/leaderboards/${leaderboardName}/regenerate`,
    {
      body: "{}", // https://github.com/Testaustime/testaustime-backend/issues/93
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "client-ip": headers().get("client-ip") ?? "Unknown IP",
        "bypass-token": process.env.RATELIMIT_IP_FORWARD_SECRET ?? "",
      },
    },
  );

  if (!response.ok) {
    if (response.status === 401) {
      return { error: RegenerateInviteCodeError.Unauthorized };
    } else if (response.status === 429) {
      return { error: RegenerateInviteCodeError.RateLimited };
    }

    return { error: RegenerateInviteCodeError.UnknownError };
  }
};

export const promoteUser = async (
  username: string,
  leaderboardName: string,
) => {
  const token = cookies().get("secure-access-token")?.value;

  if (!token) {
    return { error: "Unauthorized" as const };
  }

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL +
      `/leaderboards/${leaderboardName}/promote`,
    {
      body: JSON.stringify({ user: username }),
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "client-ip": headers().get("client-ip") ?? "Unknown IP",
        "bypass-token": process.env.RATELIMIT_IP_FORWARD_SECRET ?? "",
      },
    },
  );

  if (!response.ok) {
    console.log(response.status);
    if (response.status === 429) {
      return { error: "Too many requests" as const };
    }

    return {
      error:
        "Unknown error when fetching /leaderboards/{leaderboardName}/promot" as const,
      leaderboardName,
      status: response.status,
    };
  }

  revalidateTag(`leaderboard-${leaderboardName}`);
};

export const demoteUser = async (username: string, leaderboardName: string) => {
  const token = cookies().get("secure-access-token")?.value;

  if (!token) {
    return { error: "Unauthorized" as const };
  }

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + `/leaderboards/${leaderboardName}/demote`,
    {
      body: JSON.stringify({ user: username }),
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "client-ip": headers().get("client-ip") ?? "Unknown IP",
        "bypass-token": process.env.RATELIMIT_IP_FORWARD_SECRET ?? "",
      },
    },
  );

  if (!response.ok) {
    if (response.status === 429) {
      return { error: "Too many requests" as const };
    }

    return {
      error:
        "Unknown error when fetching /leadeboards/{leaderboardName}/demote" as const,
      leaderboardName,
      status: response.status,
    };
  }

  revalidateTag(`leaderboard-${leaderboardName}`);
};

export const kickUser = async (username: string, leaderboardName: string) => {
  const token = cookies().get("secure-access-token")?.value;

  if (!token) {
    return { error: "Unauthorized" as const };
  }

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + `/leaderboards/${leaderboardName}/kick`,
    {
      body: JSON.stringify({ user: username }),
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "client-ip": headers().get("client-ip") ?? "Unknown IP",
        "bypass-token": process.env.RATELIMIT_IP_FORWARD_SECRET ?? "",
      },
    },
  );

  if (!response.ok) {
    if (response.status === 429) {
      return { error: "Too many requests" as const };
    }

    return {
      error:
        "Unknown error when fetching /leaderboards/{leaderboardName}/kick" as const,
      leaderboardName,
      status: response.status,
    };
  }

  revalidateTag(`leaderboard-${leaderboardName}`);
};
