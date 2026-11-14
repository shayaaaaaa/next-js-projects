import { Suspense } from "react";

type PredictionResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };

const fetchPrediction = async <T,>(
  url: string
): Promise<PredictionResult<T>> => {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) {
      return { ok: false, message: `Unavailable (HTTP ${res.status})` };
    }

    return {
      ok: true,
      data: (await res.json()) as T,
    };
  } catch {
    return { ok: false, message: "Could not load prediction" };
  }
};

const getPredictedAge = (name: string) =>
  fetchPrediction<{ age?: number | null }>(
    `https://api.agify.io?name=${encodeURIComponent(name)}`
  );

const getPredictedGender = (name: string) =>
  fetchPrediction<{ gender?: string | null }>(
    `https://api.genderize.io?name=${encodeURIComponent(name)}`
  );

const getPredictedNationality = (name: string) =>
  fetchPrediction<{
    country?: Array<{ country_id: string }> | null;
  }>(`https://api.nationalize.io?name=${encodeURIComponent(name)}`);

interface Params {
  params: Promise<{ name: string }>;
}

export default function Page({ params }: Params) {
  return (
    <Suspense fallback={<main>Loading...</main>}>
      <Prediction params={params} />
    </Suspense>
  );
}

async function Prediction({ params }: Params) {
  const { name } = await params;

  const [age, gender, nationality] = await Promise.all([
    getPredictedAge(name),
    getPredictedGender(name),
    getPredictedNationality(name),
  ]);

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-3 p-4">
      <div className="p-8">
        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
          Personal Info
        </div>

        <div className="block mt-1 text-lg leading-tight font-medium text-black">
          Age: {age.ok ? age.data.age ?? "Unknown" : age.message}
        </div>

        <div className="block mt-1 text-lg leading-tight font-medium text-black">
          Gender: {gender.ok ? gender.data.gender ?? "Unknown" : gender.message}
        </div>

        <div className="block mt-1 text-lg leading-tight font-medium text-black">
          Nationality:{" "}
          {nationality.ok
            ? nationality.data.country?.[0]?.country_id ?? "Unknown"
            : nationality.message}
        </div>
      </div>
    </div>
  );
}