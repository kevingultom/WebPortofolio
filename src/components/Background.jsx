import React from "react"

// Static, premium background inspired by Vercel: a pure-black canvas with a
// soft spotlight glow near the top and a faint grid that fades out toward the
// edges. No scroll listeners, no blend modes, no heavy blur animation — so it
// costs essentially nothing to render.
const AnimatedBackground = () => {
	return (
		<div className="fixed inset-0 -z-10 pointer-events-none bg-black">
			{/* Top spotlight glow */}
			<div
				className="absolute left-1/2 -translate-x-1/2 top-[-20%] w-[90vw] h-[70vh] rounded-full"
				style={{
					background:
						"radial-gradient(closest-side, rgba(255,255,255,0.10), rgba(255,255,255,0.03) 55%, rgba(255,255,255,0) 78%)",
				}}
			/>
			{/* Faint grid, masked so it dissolves toward the edges */}
			<div
				className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:44px_44px]"
				style={{
					maskImage:
						"radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)",
					WebkitMaskImage:
						"radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)",
				}}
			/>
		</div>
	)
}

export default AnimatedBackground
