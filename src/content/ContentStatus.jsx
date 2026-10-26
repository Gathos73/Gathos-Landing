import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
export default function ContentStatus({ error }) {
  return <div className="bg-cream min-h-screen"><Navbar /><main className="max-w-3xl mx-auto px-6 pt-36 pb-24" aria-live="polite"><h1 className="font-editorial text-3xl">{error ? 'Content temporarily unavailable' : 'Loading…'}</h1>{error && <><p className="my-6">{error}</p><button className="underline" onClick={() => window.location.reload()}>Try again</button></>}</main><Footer /></div>
}
