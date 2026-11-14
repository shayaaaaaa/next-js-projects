import { Suspense } from "react";

const getPredictedAge = async (name: string) => {
  const res = await fetch(
    `https://api.agify.io?name=${encodeURIComponent(name)}`
  );
  return res.json();
};

const getPredictedGender = async (name: string) => {
  const res = await fetch(
    `https://api.genderize.io?name=${encodeURIComponent(name)}`
  );
  return res.json();
};

const getPredictedNationality = async (name: string) => {
  const res = await fetch(
    `https://api.nationalize.io?name=${encodeURIComponent(name)}`
  );
  return res.json();
};

interface Params {
  params: Promise<{ name: string }>;
}

export default function Page({ params }: Params) {
  return (
    <Suspense fallback={<main>Loading...</main>}>
      <PredictionName params={params} />
    </Suspense>
  );
}

async function PredictionName({ params }: Params) {
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
          Age: {age?.age ?? "Unknown"}
        </div>
        <div className="block mt-1 text-lg leading-tight font-medium text-black">
          Gender: {gender?.gender ?? "Unknown"}
        </div>
        <div className="block mt-1 text-lg leading-tight font-medium text-black">
          Nationality: {nationality?.country?.[0]?.country_id ?? "Unknown"}
        </div>
      </div>
    </div>
  );
}