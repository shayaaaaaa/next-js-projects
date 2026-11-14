import { Suspense } from "react";

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
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            {name}
        </main>
    );
}