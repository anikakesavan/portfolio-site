export default function NotFound() {
  return (
    <section className="grid min-h-[100svh] place-items-center bg-pine px-5 text-center">
      <div>
        <h1 className="display text-[clamp(4rem,16vw,14rem)]">Off the map</h1>
        <p className="mt-6 text-2xl">
          That page does not exist.{" "}
          <a href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/`} className="underline decoration-flag decoration-2 underline-offset-4">
            Go back home
          </a>
        </p>
      </div>
    </section>
  );
}
