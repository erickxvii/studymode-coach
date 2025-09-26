'use client';
import QuizForm from '@/components/QuizForm';

export default function AssessPage() {
  return (
    <main className="px-4 py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold">Assessment</h1>
        <p className="text-slate-600">Answer a few quick questions to find your best study mode.</p>
        <QuizForm />
      </div>
    </main>
  );
}


