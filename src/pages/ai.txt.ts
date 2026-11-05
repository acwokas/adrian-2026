import profile from '../../public/llms.txt?raw';

// Both machine-readable profiles use the same current public biography.
export function GET() {
  return new Response(profile, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
