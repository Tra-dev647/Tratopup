import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <p className="text-[64px] font-extrabold leading-none text-[#e8f1ff]">404</p>
      <h1 className="kt-khmer mt-2 text-[22px] font-extrabold">រកមិនឃើញទំព័រនេះទេ</h1>
      <p className="kt-khmer mt-1.5 text-[13px] text-[var(--muted)]">
        Page not found — សូមត្រឡប់ទៅទំព័រដើម ឬជ្រើសរើសហ្គេមរបស់អ្នក។
      </p>
      <div className="mt-5 flex justify-center gap-2">
        <Link href="/" className="kt-btn kt-btn-primary kt-khmer px-4 py-2.5 text-[13px]">
          ទំព័រដើម
        </Link>
        <Link href="/games" className="kt-btn kt-btn-ghost kt-khmer px-4 py-2.5 text-[13px]">
          ហ្គេមទាំងអស់
        </Link>
      </div>
    </div>
  );
}
